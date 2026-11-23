/*
* FOOD DELIVERY APP - Console based, written in C++17
* ---------------------------------------------------
* Features:
* Customer : register/login, browse + search restaurants, cart, coupons,
* checkout (COD/UPI/Card), order history, track & cancel orders
* Admin : view all orders, update order status, add restaurants,
* add/remove menu items, revenue report
* Storage : plain text files (users.txt, restaurants.txt, orders.txt)
*
* Compile : g++ -std=c++17 -o food_delivery food_delivery.cpp
* Run : ./food_delivery (Windows: food_delivery.exe)
*
* Default admin login -> username: admin password: admin123
*/
#include <algorithm>
#include <cstdlib>
#include <ctime>
#include <fstream>
#include <functional>
#include <iomanip>
#include <iostream>
#include <limits>
#include <sstream>
#include <string>
#include <vector>
using namespace std;
// ======================= DATA MODELS =======================
struct MenuItem {
 string name;
 double price;
};
struct Restaurant {
 int id;
 string name;
 string cuisine;
 vector<MenuItem> menu;
};
struct User {
 string username;
 string passHash;
 string address;
 bool isAdmin;
};
struct OrderLine {
 string name;
 int qty; double price;
};
struct Order {
 int id;
 string user;
 string restaurant;
 vector<OrderLine> lines;
 double subtotal, discount, tax, delivery, total;
 string payment, address, status, time;
};
// ======================= HELPERS =======================
namespace util {
vector<string> split(const string& s, char delim) {
 vector<string> parts;
 string token;
 stringstream ss(s);
 while (getline(ss, token, delim)) parts.push_back(token);
 return parts;
}
// Remove characters we use as file separators so they can't corrupt the data
string clean(string s) {
 for (char& c : s)
 if (c == '|' || c == ';' || c == '~') c = ' ';
 return s;
}
string toLower(string s) {
 transform(s.begin(), s.end(), s.begin(), ::tolower);
 return s;
}
// NOTE: std::hash is fine for a college project, NOT for real-world security
string hashPassword(const string& p) {
 return to_string(hash<string>{}(p + "fd_salt_2026"));
}
string now() {
 time_t t = time(nullptr);
 char buf[32];
 strftime(buf, sizeof(buf), "%d-%m-%Y %H:%M", localtime(&t));
 return buf;
}
string money(double v) {
 stringstream ss;
 ss << "Rs." << fixed << setprecision(2) << v;
 return ss.str();
} // Exit cleanly if input ends (Ctrl+D / Ctrl+Z) instead of looping forever
void exitOnEOF() {
 if (cin.eof()) {
 cout << "\nInput closed. Exiting.\n";
 exit(0);
 }
}
string readLine(const string& prompt) {
 string s;
 cout << prompt;
 getline(cin, s);
 exitOnEOF();
 return s;
}
int readInt(const string& prompt, int lo, int hi) {
 while (true) {
 cout << prompt;
 string line;
 getline(cin, line);
 exitOnEOF();
 try {
 size_t pos;
 int v = stoi(line, &pos);
 if (pos == line.size() && v >= lo && v <= hi) return v;
 } catch (...) {}
 cout << " Invalid input. Enter a number between " << lo << " and " << hi << ".\n";
 }
}
double readPrice(const string& prompt) {
 while (true) {
 cout << prompt;
 string line;
 getline(cin, line);
 exitOnEOF();
 try {
 size_t pos;
 double v = stod(line, &pos);
 if (pos == line.size() && v > 0) return v;
 } catch (...) {}
 cout << " Enter a valid positive price.\n";
 }
}
void line(char c = '=', int n = 60) { cout << string(n, c) << "\n"; }
void header(const string& title) {
 cout << "\n";
 line();
 cout << " " << title << "\n";
 line();
} void pause() {
 cout << "\nPress Enter to continue...";
 string s;
 getline(cin, s);
 exitOnEOF();
}
} // namespace util
using namespace util;
// ======================= MAIN APPLICATION =======================
class FoodApp {
 const string USERS_FILE = "users.txt";
 const string REST_FILE = "restaurants.txt";
 const string ORDERS_FILE = "orders.txt";
 const double TAX_RATE = 0.05; // 5% GST
 const double DELIVERY_FEE = 40.0;
 const double FREE_DELIVERY_ABOVE = 500.0;
 vector<User> users;
 vector<Restaurant> restaurants;
 vector<Order> orders;
 int nextOrderId = 1001;
 // Session state
 User* current = nullptr;
 vector<OrderLine> cart;
 int cartRestaurant = -1; // index into restaurants, -1 if cart empty
public:
 FoodApp() {
 loadUsers();
 loadRestaurants();
 loadOrders();
 }
 void run() {
 while (true) {
 header("FOODIE EXPRESS - Food Delivery");
 cout << " 1. Login\n 2. Register\n 3. Exit\n";
 int c = readInt("Choose: ", 1, 3);
 if (c == 1) login();
 else if (c == 2) registerUser();
 else {
 cout << "\nThanks for using Foodie Express. Goodbye!\n";
 return;
 }
 if (current) {
 if (current->isAdmin) adminMenu();
else customerMenu(); current = nullptr;
cart.clear();
 cartRestaurant = -1;
 }
 }
 }
private:
 // ---------------------- PERSISTENCE ----------------------
 void loadUsers() {
 ifstream f(USERS_FILE);
 string l;
 while (getline(f, l)) {
 auto p = split(l, '|');
 if (p.size() >= 4) users.push_back({p[0], p[1], p[2], p[3] == "1"});
 }
 bool hasAdmin = any_of(users.begin(), users.end(), [](const User& u) { return u.isAdmin; 
});
 if (!hasAdmin) {
 users.push_back({"admin", hashPassword("admin123"), "Head Office", true});
 saveUsers();
 }
 }
 void saveUsers() {
 ofstream f(USERS_FILE);
 for (auto& u : users)
 f << u.username << '|' << u.passHash << '|' << u.address << '|' << (u.isAdmin ? 1 : 
0) << '\n';
 }
 void loadRestaurants() {
 ifstream f(REST_FILE);
 string l;
 while (getline(f, l)) {
 auto p = split(l, '|');
 if (p.empty()) continue;
 if (p[0] == "R" && p.size() >= 4) {
 restaurants.push_back({stoi(p[1]), p[2], p[3], {}});
 } else if (p[0] == "I" && p.size() >= 3 && !restaurants.empty()) {
 try { restaurants.back().menu.push_back({p[1], stod(p[2])}); } catch (...) {}
 }
 }
 if (restaurants.empty()) {
 seedRestaurants();
 saveRestaurants();
 }
 }
 void saveRestaurants() {
 ofstream f(REST_FILE);
 for (auto& r : restaurants) {
 f << "R|" << r.id << '|' << r.name << '|' << r.cuisine << '\n'; for (auto& m : r.menu) f << "I|" << m.name << '|' << m.price << '\n';
 }
 }
 void seedRestaurants() {
 restaurants = {
 {1, "Spice Garden", "North Indian",
 {{"Butter Chicken", 280}, {"Paneer Tikka Masala", 240}, {"Garlic Naan", 45}, {"Dal 
Makhani", 190}, {"Jeera Rice", 120}}},
 {2, "Pizza Palace", "Italian",
 {{"Margherita Pizza", 199}, {"Farmhouse Pizza", 299}, {"Garlic Bread", 99}, {"Pasta 
Alfredo", 220}, {"Choco Lava Cake", 89}}},
 {3, "Dragon Wok", "Chinese",
 {{"Veg Hakka Noodles", 150}, {"Chilli Chicken", 230}, {"Veg Manchurian", 170}, 
{"Fried Rice", 160}, {"Spring Rolls", 110}}},
 {4, "Burger Barn", "Fast Food",
 {{"Classic Veg Burger", 99}, {"Chicken Zinger", 149}, {"French Fries", 79}, {"Peri 
Peri Wrap", 129}, {"Cold Coffee", 89}}},
 {5, "South Spice", "South Indian",
 {{"Masala Dosa", 90}, {"Idli Sambar (3 pcs)", 60}, {"Medu Vada", 70}, {"Filter 
Coffee", 40}, {"Rava Upma", 65}}},
 };
 }
 void loadOrders() {
 ifstream f(ORDERS_FILE);
 string l;
 while (getline(f, l)) {
 auto p = split(l, '|');
 if (p.size() < 13) continue;
 try {
 Order o;
o.id = stoi(p[0]);
 o.user = p[1];
o.restaurant = p[2];
 o.subtotal = stod(p[3]);
o.discount = stod(p[4]);
 o.tax = stod(p[5]);
 o.delivery = stod(p[6]);
o.total = stod(p[7]);
 o.payment = p[8];
o.address = p[9];
 o.status = p[10];
o.time = p[11];
 for (auto& item : split(p[12], ';')) {
 auto q = split(item, '~');
if (q.size() == 3) o.lines.push_back({q[0], stoi(q[1]), stod(q[2])});
 }
orders.push_back(o);
 nextOrderId = max(nextOrderId, o.id + 1);
 } catch (...) {}
 }
 } void saveOrders() {
 ofstream f(ORDERS_FILE);
 for (auto& o : orders) {
 f << o.id << '|' << o.user << '|' << o.restaurant << '|' << o.subtotal << '|' << 
o.discount << '|'
 << o.tax << '|' << o.delivery << '|' << o.total << '|' << o.payment << '|' << 
o.address << '|'
 << o.status << '|' << o.time << '|';
 for (auto& l : o.lines) f << l.name << '~' << l.qty << '~' << l.price << ';';
 f << '\n';
 }
 }
 // ---------------------- AUTH ----------------------
 void registerUser() {
 header("REGISTER");
 string name = clean(readLine("Username: "));
 if (name.empty() || name.find(' ') != string::npos) {
 cout << "Username cannot be empty or contain spaces.\n";
 return;
 }
 for (auto& u : users)
 if (toLower(u.username) == toLower(name)) {
 cout << "That username is already taken.\n";
 return;
 }
 string pass = readLine("Password (min 4 chars): ");
 if (pass.size() < 4) {
 cout << "Password too short.\n";
 return;
 }
 string addr = clean(readLine("Delivery address: "));
 if (addr.empty()) addr = "Not provided";
 users.push_back({name, hashPassword(pass), addr, false});
 saveUsers();
 cout << "Registration successful! You can now login.\n";
 }
 void login() {
 header("LOGIN");
 string name = readLine("Username: ");
 string pass = readLine("Password: ");
 for (auto& u : users) {
 if (u.username == name && u.passHash == hashPassword(pass)) {
 current = &u;
cout << "\nWelcome, " << u.username << "!\n";
 return;
 }
 }
 cout << "Invalid username or password.\n";
 }
 // ---------------------- CUSTOMER void customerMenu() {
 while (true) {
 header("CUSTOMER MENU | Cart: " + to_string(cartCount()) + " item(s)");
 cout << " 1. Browse restaurants\n"
 << " 2. Search (restaurant / cuisine / dish)\n"
<< " 3. View cart & checkout\n"
 << " 4. My orders / track order\n"
 << " 5. Cancel an order\n"
<< " 6. Update delivery address\n"
<< " 7. Logout\n";
 int c = readInt("Choose: ", 1, 7);
 switch (c) {
 case 1: browseRestaurants(); break;
 case 2: searchMenu(); break;
case 3: viewCart(); break;
 case 4: myOrders(); break;
 case 5: cancelOrder(); break;
 case 6:
 current->address = clean(readLine("New address: "));
 saveUsers();
cout << "Address updated.\n";
break;
 case 7: return;
 }
 }
 }
 int cartCount() const {
 int n = 0;
 for (auto& l : cart) n += l.qty;
 return n;
 }
 void browseRestaurants() {
 header("RESTAURANTS");
 for (size_t i = 0; i < restaurants.size(); i++)
 cout << " " << i + 1 << ". " << left << setw(20) << restaurants[i].name << 
restaurants[i].cuisine << "\n";
 cout << " 0. Back\n";
 int c = readInt("Select restaurant: ", 0, (int)restaurants.size());
 if (c == 0) return;
 showMenu(c - 1);
 }
 void showMenu(int ri) {
 Restaurant& r = restaurants[ri];
 while (true) {
 header(r.name + " (" + r.cuisine + ")");
 if (r.menu.empty()) {
 cout << " No items available.\n";
 return;
 }
 for (size_t i = 0; i < r.menu.size(); i++) cout << " " << setw(2) << i + 1 << ". " << left << setw(28) << r.menu[i].name << 
money(r.menu[i].price) << "\n";
 cout << " 0. Back\n";
 int c = readInt("Add item to cart: ", 0, (int)r.menu.size());
 if (c == 0) return;
 addToCart(ri, c - 1);
 }
 }
 void addToCart(int ri, int mi) {
 if (cartRestaurant != -1 && cartRestaurant != ri) {
 cout << "Your cart has items from " << restaurants[cartRestaurant].name << ".\n";
 int ch = readInt("Clear cart and start a new one? (1=Yes, 0=No): ", 0, 1);
 if (!ch) return;
 cart.clear();
 }
 int qty = readInt("Quantity (1-20): ", 1, 20);
 const MenuItem& m = restaurants[ri].menu[mi];
 cartRestaurant = ri;
 for (auto& l : cart)
 if (l.name == m.name) {
 l.qty = min(20, l.qty + qty);
cout << "Updated " << m.name << " in cart.\n";
 return;
 }
 cart.push_back({m.name, qty, m.price});
 cout << "Added " << qty << " x " << m.name << " to cart.\n";
 }
 void searchMenu() {
 string q = toLower(readLine("Search keyword: "));
 if (q.empty()) return;
 header("SEARCH RESULTS");
 bool found = false;
 for (size_t i = 0; i < restaurants.size(); i++) {
 auto& r = restaurants[i];
 bool restMatch = toLower(r.name).find(q) != string::npos || 
toLower(r.cuisine).find(q) != string::npos;
 for (auto& m : r.menu) {
 if (restMatch || toLower(m.name).find(q) != string::npos) {
 cout << " [" << i + 1 << "] " << left << setw(18) << r.name << setw(26) << 
m.name << money(m.price) << "\n";
 found = true;
 }
 }
 }
 if (!found) {
 cout << " Nothing found.\n";
 return;
 }
 int c = readInt("\nOpen restaurant number (0 to go back): ", 0, (int)restaurants.size());
 if (c > 0) showMenu(c - 1);
 } double computeDiscount(const string& code, double subtotal) {
 string c = toLower(code);
 if (c == "welcome50") return subtotal >= 200 ? 50 : 0;
 if (c == "save20") return subtotal >= 300 ? min(100.0, subtotal * 0.20) : 0;
 return 0;
 }
 void printCart(double& subtotal) {
 subtotal = 0;
 cout << " Restaurant: " << restaurants[cartRestaurant].name << "\n";
 line('-');
 for (size_t i = 0; i < cart.size(); i++) {
 double t = cart[i].qty * cart[i].price;
 subtotal += t;
 cout << " " << i + 1 << ". " << left << setw(26) << cart[i].name << "x" << setw(3) 
<< cart[i].qty << right << setw(12) << money(t) << "\n";
 }
 line('-');
 cout << left;
 }
 void viewCart() {
 if (cart.empty()) {
 cout << "\nYour cart is empty.\n";
 pause();
 return;
 }
 string coupon;
 while (true) {
 header("YOUR CART");
 double subtotal;
 printCart(subtotal);
 double discount = computeDiscount(coupon, subtotal);
 double delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
 double tax = (subtotal - discount) * TAX_RATE;
 double total = subtotal - discount + tax + delivery;
 cout << " Subtotal : " << money(subtotal) << "\n";
 if (discount > 0) cout << " Discount : -" << money(discount) << " (" << coupon << 
")\n";
 cout << " GST (5%) : " << money(tax) << "\n";
 cout << " Delivery : " << (delivery == 0 ? "FREE" : money(delivery)) << "\n";
 cout << " TOTAL : " << money(total) << "\n\n";
 cout << " 1. Place order\n 2. Apply coupon (WELCOME50 / SAVE20)\n 3. Remove an 
item\n 4. Clear cart\n 5. Back\n";
 int c = readInt("Choose: ", 1, 5);
 if (c == 1) {
 placeOrder(subtotal, discount, tax, delivery, total);
 return;
 } else if (c == 2) {
 coupon = readLine("Enter coupon code: ");
 if (computeDiscount(coupon, subtotal) == 0) {
 cout << "Coupon invalid or minimum order not met (WELCOME50: min Rs.200, 
SAVE20: min Rs.300).\n";
 coupon.clear(); pause();
 }
 } else if (c == 3) {
 int idx = readInt("Item number to remove: ", 1, (int)cart.size());
 cart.erase(cart.begin() + idx - 1);
 if (cart.empty()) {
 cartRestaurant = -1;
cout << "Cart is now empty.\n";
return;
 }
 } else if (c == 4) {
 cart.clear();
 cartRestaurant = -1;
cout << "Cart cleared.\n";
 return;
 } else return;
 }
 }
 void placeOrder(double subtotal, double discount, double tax, double delivery, double total) 
{
 cout << "\nDelivery address: " << current->address << "\n";
 if (readInt("Use this address? (1=Yes, 0=Enter new): ", 0, 1) == 0) {
 string a = clean(readLine("New address: "));
 if (!a.empty()) current->address = a;
 saveUsers();
 }
 cout << "\nPayment method:\n 1. Cash on Delivery\n 2. UPI\n 3. Credit/Debit Card\n";
 int p = readInt("Choose: ", 1, 3);
 string payment = p == 1 ? "COD" : p == 2 ? "UPI" : "Card";
 if (p == 2) {
 string upi = readLine("Enter UPI ID (e.g. name@bank): ");
 if (upi.find('@') == string::npos) {
 cout << "Invalid UPI ID. Order not placed.\n";
pause();
 return;
 }
 cout << "Processing UPI payment... Payment successful!\n";
 } else if (p == 3) {
 string card = readLine("Enter 16-digit card number: ");
 if (card.size() != 16 || !all_of(card.begin(), card.end(), ::isdigit)) {
 cout << "Invalid card number. Order not placed.\n";
 pause();
return;
 }
 cout << "Processing card payment... Payment successful!\n";
 }
 Order o{nextOrderId++, current->username, restaurants[cartRestaurant].name, cart,
 subtotal, discount, tax, delivery, total, payment, current->address, "Placed", 
now()};
 orders.push_back(o);
 saveOrders();
 cart.clear();
 cartRestaurant = -1; cout << "\n*** ORDER PLACED SUCCESSFULLY ***\n";
 printReceipt(o);
 pause();
 }
 void printReceipt(const Order& o) {
 line('=');
 cout << " ORDER #" << o.id << " " << o.time << "\n";
 cout << " Restaurant: " << o.restaurant << "\n";
 cout << " Customer : " << o.user << "\n";
 cout << " Address : " << o.address << "\n";
 line('-');
 for (auto& l : o.lines)
 cout << " " << left << setw(26) << l.name << "x" << setw(3) << l.qty << right << 
setw(12) << money(l.qty * l.price) << "\n";
 line('-');
 cout << left;
 cout << " Subtotal: " << money(o.subtotal) << " Discount: -" << money(o.discount) << 
"\n";
 cout << " GST: " << money(o.tax) << " Delivery: " << money(o.delivery) << "\n";
 cout << " TOTAL: " << money(o.total) << " Paid via: " << o.payment << "\n";
 cout << " STATUS: " << o.status << "\n";
 line('=');
 }
 void myOrders() {
 header("MY ORDERS");
 vector<Order*> mine;
 for (auto& o : orders)
 if (o.user == current->username) mine.push_back(&o);
 if (mine.empty()) {
 cout << " You have no orders yet.\n";
 pause();
 return;
 }
 for (auto* o : mine)
 cout << " #" << o->id << " " << left << setw(16) << o->restaurant << setw(12) << 
money(o->total) << o->status << "\n";
 int id = readInt("\nEnter order # for full details (0 to go back): ", 0, 999999);
 if (id == 0) return;
 for (auto* o : mine)
 if (o->id == id) {
 printReceipt(*o);
trackingBar(o->status);
 pause();
 return;
 }
 cout << "Order not found.\n";
 pause();
 }
 void trackingBar(const string& status) {
 const vector<string> steps = {"Placed", "Preparing", "Out for Delivery", "Delivered"};
 if (status == "Cancelled") { cout << " Tracking: [ Order Cancelled ]\n";
 return;
 }
 cout << " Tracking: ";
 bool reached = true;
 for (size_t i = 0; i < steps.size(); i++) {
 cout << (reached ? "[x] " : "[ ] ") << steps[i];
 if (steps[i] == status) reached = false;
 if (i + 1 < steps.size()) cout << " -> ";
 }
 cout << "\n";
 }
 void cancelOrder() {
 int id = readInt("Order # to cancel (0 to go back): ", 0, 999999);
 if (id == 0) return;
 for (auto& o : orders) {
 if (o.id == id && o.user == current->username) {
 if (o.status == "Placed") {
 o.status = "Cancelled";
saveOrders();
cout << "Order #" << id << " cancelled.";
if (o.payment != "COD") cout << " Refund will be processed in 3-5 days.";
cout << "\n";
 } else {
 cout << "Order cannot be cancelled now (status: " << o.status << ").\n";
 }
pause();
 return;
 }
 }
 cout << "Order not found.\n";
 pause();
 }
 // ---------------------- ADMIN ----------------------
 void adminMenu() {
 while (true) {
 header("ADMIN PANEL");
 cout << " 1. View all orders\n"
 << " 2. Update order status\n"
<< " 3. Add restaurant\n"
<< " 4. Add menu item\n"
<< " 5. Remove menu item\n"
 << " 6. Revenue report\n"
<< " 7. Logout\n";
 int c = readInt("Choose: ", 1, 7);
 switch (c) {
 case 1: allOrders(); break;
 case 2: updateStatus(); break;
 case 3: addRestaurant(); break;
 case 4: addMenuItem(); break;
case 5: removeMenuItem(); break; case 6: revenueReport(); break;
case 7: return;
 }
 }
 }
 void allOrders() {
 header("ALL ORDERS");
 if (orders.empty()) cout << " No orders yet.\n";
 for (auto& o : orders)
 cout << " #" << o.id << " " << left << setw(10) << o.user << setw(16) << 
o.restaurant
 << setw(12) << money(o.total) << setw(6) << o.payment << o.status << "\n";
 pause();
 }
 void updateStatus() {
 int id = readInt("Order # to update (0 to go back): ", 0, 999999);
 if (id == 0) return;
 for (auto& o : orders) {
 if (o.id != id) continue;
 if (o.status == "Cancelled" || o.status == "Delivered") {
 cout << "This order is already " << o.status << ".\n";
 pause();
return;
 }
 cout << "Current status: " << o.status << "\n 1. Preparing\n 2. Out for Delivery\n 
3. Delivered\n";
 int c = readInt("New status: ", 1, 3);
 o.status = c == 1 ? "Preparing" : c == 2 ? "Out for Delivery" : "Delivered";
 saveOrders();
 cout << "Order #" << id << " is now '" << o.status << "'.\n";
 pause();
 return;
 }
 cout << "Order not found.\n";
 pause();
 }
