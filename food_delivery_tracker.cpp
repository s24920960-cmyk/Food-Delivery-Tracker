/**
 * ============================================================================
 * Academic Project: C++ Food Delivery Tracker (Milestone 5)
 * ============================================================================
 * Project: Food Delivery Tracker
 * Milestone: Milestone 5 - Final Documentation & Deployment
 * 
 * Submitted By:
 *   - Sumit Prajapati (BTIT26O1143)
 *   - Suraj Kumar (BTIT26O1144)
 * 
 * Project Mentor:
 *   - Prof. Surbhi Gupta Ma'am
 * 
 * Department: School of Information Technology
 * College: Madhav Institute of Technology & Science (MITS), Gwalior
 * Programming Language: C++
 * ============================================================================
 */

#include <iostream>
#include <iomanip>
#include <vector>
#include <string>
#include <fstream>
#include <sstream>
#include <ctime>
#include <cstdlib>

using namespace std;

// Structure to represent a Food Item on the Menu
struct MenuItem {
    int id;
    string name;
    string category;
    double price;
};

// Structure to represent an Item in the User's Cart
struct CartItem {
    MenuItem item;
    int quantity;
    double totalAmount;
};

// Structure to represent an Order
struct Order {
    string orderId;
    string customerName;
    string customerPhone;
    string deliveryAddress;
    vector<CartItem> items;
    double subtotal;
    double tax;
    double deliveryFee;
    double grandTotal;
    string status; // Placed, Confirmed, Preparing, Picked Up, Out for Delivery, Delivered
    string timestamp;
};

// Global Menu Items Catalog
const vector<MenuItem> foodCatalog = {
    {1, "Paneer Butter Masala", "Main Course", 240.00},
    {2, "Butter Naan (2 pcs)", "Breads", 60.00},
    {3, "Veg Biryani with Raita", "Rice", 180.00},
    {4, "Chicken Dum Biryani", "Biryani", 260.00},
    {5, "Margherita Cheese Pizza", "Fast Food", 220.00},
    {6, "Crispy Veg Burger & Fries", "Fast Food", 140.00},
    {7, "Classic Cold Coffee", "Beverages", 90.00},
    {8, "Gulab Jamun (2 pcs)", "Dessert", 70.00}
};

// Global State
vector<CartItem> currentCart;
vector<Order> activeOrders;
int orderCounter = 1002;

// Function Prototypes (as required by Milestone 5 Technical Documentation)
void displayMenu();
void showMainMenu();
void addItem();
void updateQuantity();
double calculateTotal();
void displayBill();
void placeOrder();
void trackOrder();
void viewOrderHistory();
void saveOrderToFile(const Order& order);

// Helper functions
string getCurrentTimestamp() {
    time_t now = time(0);
    char buf[80];
    strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", localtime(&now));
    return string(buf);
}

void printHeader(const string& title) {
    cout << "\n========================================================\n";
    cout << "   " << title << "\n";
    cout << "========================================================\n";
}

void displayMenu() {
    printHeader("FOOD MENU (MITS CAMPUS / GWALIOR RESTAURANT)");
    cout << left << setw(5) << "ID"
         << setw(30) << "Item Name"
         << setw(15) << "Category"
         << right << setw(10) << "Price (INR)" << endl;
    cout << string(60, '-') << endl;

    for (const auto& item : foodCatalog) {
        cout << left << setw(5) << item.id
             << setw(30) << item.name
             << setw(15) << item.category
             << right << setw(10) << fixed << setprecision(2) << item.price << endl;
    }
    cout << string(60, '-') << endl;
}

void addItem() {
    displayMenu();
    int selectedId, qty;
    cout << "\nEnter Food Item ID to add: ";
    if (!(cin >> selectedId)) {
        cin.clear();
        string dummy; cin >> dummy;
        cout << "Invalid input. Please enter a valid number.\n";
        return;
    }

    const MenuItem* selectedItem = nullptr;
    for (const auto& item : foodCatalog) {
        if (item.id == selectedId) {
            selectedItem = &item;
            break;
        }
    }

    if (!selectedItem) {
        cout << "Error: Food item with ID " << selectedId << " does not exist!\n";
        return;
    }

    cout << "Enter Quantity for \"" << selectedItem->name << "\": ";
    if (!(cin >> qty) || qty <= 0) {
        cin.clear();
        string dummy; cin >> dummy;
        cout << "Invalid quantity! Quantity must be a positive integer.\n";
        return;
    }

    // Check if item already exists in cart
    bool exists = false;
    for (auto& cartItem : currentCart) {
        if (cartItem.item.id == selectedId) {
            cartItem.quantity += qty;
            cartItem.totalAmount = cartItem.quantity * cartItem.item.price;
            exists = true;
            cout << "Updated quantity of \"" << selectedItem->name << "\" to " << cartItem.quantity << ".\n";
            break;
        }
    }

    if (!exists) {
        CartItem newItem;
        newItem.item = *selectedItem;
        newItem.quantity = qty;
        newItem.totalAmount = qty * selectedItem->price;
        currentCart.push_back(newItem);
        cout << "Successfully added " << qty << "x \"" << selectedItem->name << "\" to your cart!\n";
    }
}

void updateQuantity() {
    if (currentCart.empty()) {
        cout << "\nYour cart is currently empty! Add items first.\n";
        return;
    }

    printHeader("CURRENT CART ITEMS");
    cout << left << setw(6) << "S.No"
         << setw(30) << "Item Name"
         << setw(10) << "Qty"
         << right << setw(12) << "Amount (INR)" << endl;
    cout << string(58, '-') << endl;

    for (size_t i = 0; i < currentCart.size(); ++i) {
        cout << left << setw(6) << (i + 1)
             << setw(30) << currentCart[i].item.name
             << setw(10) << currentCart[i].quantity
             << right << setw(12) << fixed << setprecision(2) << currentCart[i].totalAmount << endl;
    }
    cout << string(58, '-') << endl;

    int itemIdx;
    cout << "\nEnter S.No of the item to update (or 0 to cancel): ";
    if (!(cin >> itemIdx) || itemIdx < 0 || itemIdx > static_cast<int>(currentCart.size())) {
        cin.clear();
        string dummy; cin >> dummy;
        cout << "Invalid selection!\n";
        return;
    }

    if (itemIdx == 0) return;

    int newQty;
    cout << "Enter new quantity (Enter 0 to remove item): ";
    if (!(cin >> newQty) || newQty < 0) {
        cin.clear();
        string dummy; cin >> dummy;
        cout << "Invalid quantity!\n";
        return;
    }

    if (newQty == 0) {
        cout << "Removed \"" << currentCart[itemIdx - 1].item.name << "\" from cart.\n";
        currentCart.erase(currentCart.begin() + (itemIdx - 1));
    } else {
        currentCart[itemIdx - 1].quantity = newQty;
        currentCart[itemIdx - 1].totalAmount = newQty * currentCart[itemIdx - 1].item.price;
        cout << "Quantity updated to " << newQty << " successfully!\n";
    }
}

double calculateTotal() {
    double subtotal = 0.0;
    for (const auto& item : currentCart) {
        subtotal += item.totalAmount;
    }
    return subtotal;
}

void displayBill() {
    if (currentCart.empty()) {
        cout << "\nYour cart is empty! No bill to display.\n";
        return;
    }

    double subtotal = calculateTotal();
    double gst = subtotal * 0.05; // 5% GST
    double deliveryCharge = (subtotal >= 400.0) ? 0.0 : 40.0; // Free delivery above 400
    double grandTotal = subtotal + gst + deliveryCharge;

    printHeader("ORDER BILL SUMMARY");
    cout << left << setw(4) << "#"
         << setw(28) << "Item"
         << setw(8) << "Rate"
         << setw(6) << "Qty"
         << right << setw(12) << "Total (INR)" << endl;
    cout << string(58, '-') << endl;

    for (size_t i = 0; i < currentCart.size(); ++i) {
        cout << left << setw(4) << (i + 1)
             << setw(28) << currentCart[i].item.name
             << setw(8) << fixed << setprecision(2) << currentCart[i].item.price
             << setw(6) << currentCart[i].quantity
             << right << setw(12) << fixed << setprecision(2) << currentCart[i].totalAmount << endl;
    }
    cout << string(58, '-') << endl;
    cout << right << setw(46) << "Subtotal: " << setw(12) << fixed << setprecision(2) << subtotal << " INR\n";
    cout << right << setw(46) << "GST (5%): " << setw(12) << fixed << setprecision(2) << gst << " INR\n";
    cout << right << setw(46) << "Delivery Charge: " << setw(12) << fixed << setprecision(2) << deliveryCharge << " INR\n";
    if (deliveryCharge == 0.0) {
        cout << right << setw(58) << "(Free Delivery Applied!)\n";
    }
    cout << string(58, '=') << endl;
    cout << right << setw(46) << "Grand Total Payable: " << setw(12) << fixed << setprecision(2) << grandTotal << " INR\n";
    cout << string(58, '=') << endl;
}

void saveOrderToFile(const Order& order) {
    ofstream outFile("orders.txt", ios::app);
    if (!outFile) {
        cerr << "Warning: Could not open orders.txt for writing.\n";
        return;
    }
    outFile << "========================================\n";
    outFile << "ORDER ID: " << order.orderId << "\n";
    outFile << "Date/Time: " << order.timestamp << "\n";
    outFile << "Customer: " << order.customerName << " (" << order.customerPhone << ")\n";
    outFile << "Address: " << order.deliveryAddress << "\n";
    outFile << "Status: " << order.status << "\n";
    outFile << "Items Ordered:\n";
    for (const auto& item : order.items) {
        outFile << " - " << item.item.name << " x " << item.quantity 
                << " = INR " << fixed << setprecision(2) << item.totalAmount << "\n";
    }
    outFile << "Subtotal: INR " << order.subtotal << "\n";
    outFile << "GST (5%): INR " << order.tax << "\n";
    outFile << "Delivery Fee: INR " << order.deliveryFee << "\n";
    outFile << "Grand Total: INR " << order.grandTotal << "\n";
    outFile << "========================================\n\n";
    outFile.close();
}

void placeOrder() {
    if (currentCart.empty()) {
        cout << "\nYour cart is empty! Please add items before placing an order.\n";
        return;
    }

    displayBill();

    cout << "\nDo you wish to confirm and place this demo order? (y/n): ";
    char choice;
    cin >> choice;
    if (choice != 'y' && choice != 'Y') {
        cout << "Order placement cancelled.\n";
        return;
    }

    cin.ignore(); // clear newline
    Order newOrder;
    stringstream ss;
    ss << "FD-" << orderCounter++;
    newOrder.orderId = ss.str();

    cout << "\nEnter Customer Name: ";
    getline(cin, newOrder.customerName);
    if (newOrder.customerName.empty()) newOrder.customerName = "Sumit Prajapati";

    cout << "Enter Customer Phone: ";
    getline(cin, newOrder.customerPhone);
    if (newOrder.customerPhone.empty()) newOrder.customerPhone = "+91 98765 43210";

    cout << "Enter Delivery Address: ";
    getline(cin, newOrder.deliveryAddress);
    if (newOrder.deliveryAddress.empty()) newOrder.deliveryAddress = "Hostel 3, MITS Gwalior Campus, MP";

    newOrder.items = currentCart;
    newOrder.subtotal = calculateTotal();
    newOrder.tax = newOrder.subtotal * 0.05;
    newOrder.deliveryFee = (newOrder.subtotal >= 400.0) ? 0.0 : 40.0;
    newOrder.grandTotal = newOrder.subtotal + newOrder.tax + newOrder.deliveryFee;
    newOrder.status = "Placed";
    newOrder.timestamp = getCurrentTimestamp();

    activeOrders.push_back(newOrder);
    saveOrderToFile(newOrder);

    // Clear cart after placing order
    currentCart.clear();

    printHeader("ORDER CONFIRMATION RECEIPT");
    cout << "Order successfully created and placed!\n";
    cout << "Demo Order ID  : " << newOrder.orderId << "\n";
    cout << "Customer Name  : " << newOrder.customerName << "\n";
    cout << "Contact        : " << newOrder.customerPhone << "\n";
    cout << "Deliver To     : " << newOrder.deliveryAddress << "\n";
    cout << "Total Amount   : INR " << fixed << setprecision(2) << newOrder.grandTotal << "\n";
    cout << "Current Status : " << newOrder.status << " [Order Placed]\n";
    cout << "Status Flow    : Placed -> Confirmed -> Preparing -> Picked Up -> Out for Delivery -> Delivered\n";
    cout << "Saved to local persistent file: orders.txt\n";
    cout << "========================================================\n";
}

void trackOrder() {
    if (activeOrders.empty()) {
        cout << "\nNo active orders found in current session.\n";
        cout << "Checking if orders exist in orders.txt or enter your demo order ID...\n";
    }

    cout << "\nEnter Order ID to track (e.g., FD-1001, or list active): ";
    string targetId;
    cin >> targetId;

    Order* found = nullptr;
    for (auto& ord : activeOrders) {
        if (ord.orderId == targetId) {
            found = &ord;
            break;
        }
    }

    if (!found) {
        cout << "Order ID " << targetId << " not found in active memory session!\n";
        if (!activeOrders.empty()) {
            cout << "Available Active Orders in session:\n";
            for (const auto& ord : activeOrders) {
                cout << " - " << ord.orderId << " (" << ord.customerName << ") -> " << ord.status << "\n";
            }
        }
        return;
    }

    printHeader("LIVE ORDER DELIVERY TRACKING");
    cout << "Order Reference : " << found->orderId << "\n";
    cout << "Recipient       : " << found->customerName << "\n";
    cout << "Delivery Target : " << found->deliveryAddress << "\n";
    cout << "Order Time      : " << found->timestamp << "\n";
    cout << "Current Status  : " << found->status << "\n";

    // Progress bar representation
    const vector<string> stages = {
        "Placed", "Confirmed", "Preparing", "Picked Up", "Out for Delivery", "Delivered"
    };

    int currentStageIdx = 0;
    for (size_t i = 0; i < stages.size(); ++i) {
        if (stages[i] == found->status) {
            currentStageIdx = static_cast<int>(i);
            break;
        }
    }

    cout << "\nDelivery Progress Timeline:\n";
    for (size_t i = 0; i < stages.size(); ++i) {
        if (static_cast<int>(i) < currentStageIdx) {
            cout << " [✓] " << stages[i] << " (Completed)\n";
        } else if (static_cast<int>(i) == currentStageIdx) {
            cout << " [➔] " << stages[i] << " (CURRENT ACTIVE STAGE)\n";
        } else {
            cout << " [ ] " << stages[i] << "\n";
        }
    }

    cout << "\nSimulated Route & Haversine Distance:\n";
    cout << " - Restaurant   : MITS Gwalior Food Hub (26.2307° N, 78.2173° E)\n";
    cout << " - Delivery Guy : Driver DRV-04 on Motorbike (Live Coordinates: 26.2245° N, 78.2091° E)\n";
    cout << " - Destination  : " << found->deliveryAddress << " (26.2183° N, 78.1828° E)\n";
    cout << " - Est. Distance: 3.4 km | Est. Delivery Time: 12 mins\n";

    // Allow user to advance status in demo mode
    if (found->status != "Delivered") {
        cout << "\n[DEMO VIVA SIMULATION] Advance order to next delivery stage? (y/n): ";
        char adv;
        cin >> adv;
        if (adv == 'y' || adv == 'Y') {
            if (currentStageIdx + 1 < static_cast<int>(stages.size())) {
                found->status = stages[currentStageIdx + 1];
                cout << "SUCCESS: Order status updated to \"" << found->status << "\"!\n";
                saveOrderToFile(*found);
            }
        }
    } else {
        cout << "\nThis order has been marked as DELIVERED. Thank you for using Food Delivery Tracker!\n";
    }
}

void viewOrderHistory() {
    ifstream inFile("orders.txt");
    if (!inFile) {
        cout << "\nNo order history file (orders.txt) found yet. Place an order to create it.\n";
        return;
    }
    printHeader("LOCAL ORDER HISTORY ARCHIVE (orders.txt)");
    string line;
    while (getline(inFile, line)) {
        cout << line << "\n";
    }
    inFile.close();
}

void showMainMenu() {
    cout << "\n========================================================\n";
    cout << "        FOOD DELIVERY TRACKER - C++ CONSOLE APP         \n";
    cout << "        Department of IT | MITS Gwalior (Milestone 5)   \n";
    cout << "========================================================\n";
    cout << " 1. View Food Menu\n";
    cout << " 2. Add Item to Cart\n";
    cout << " 3. View Cart & Manage Quantities\n";
    cout << " 4. Display Bill Summary\n";
    cout << " 5. Place Demo Order\n";
    cout << " 6. Track Order Status (Simulated GPS / Delivery Stages)\n";
    cout << " 7. View Saved Orders History (File Handling)\n";
    cout << " 8. Academic Project Information & Viva Details\n";
    cout << " 9. Exit Application\n";
    cout << "========================================================\n";
    cout << "Enter your choice (1-9): ";
}

int main() {
    // Seed sample active order for instant demonstration
    Order sampleOrder;
    sampleOrder.orderId = "FD-1001";
    sampleOrder.customerName = "Sumit Prajapati";
    sampleOrder.customerPhone = "+91 98765 43210";
    sampleOrder.deliveryAddress = "Hostel 3, MITS Gwalior Campus, MP";
    sampleOrder.subtotal = 380.00;
    sampleOrder.tax = 19.00;
    sampleOrder.deliveryFee = 40.00;
    sampleOrder.grandTotal = 439.00;
    sampleOrder.status = "Picked Up";
    sampleOrder.timestamp = getCurrentTimestamp();
    activeOrders.push_back(sampleOrder);

    int choice = 0;
    while (true) {
        showMainMenu();
        if (!(cin >> choice)) {
            cin.clear();
            string dummy;
            cin >> dummy;
            cout << "\n[!] Invalid input! Please enter a number between 1 and 9.\n";
            continue;
        }

        switch (choice) {
            case 1:
                displayMenu();
                break;
            case 2:
                addItem();
                break;
            case 3:
                updateQuantity();
                break;
            case 4:
                displayBill();
                break;
            case 5:
                placeOrder();
                break;
            case 6:
                trackOrder();
                break;
            case 7:
                viewOrderHistory();
                break;
            case 8:
                printHeader("ACADEMIC PROJECT DETAILS & ATTRIBUTION");
                cout << "Project Name      : Food Delivery Tracker\n";
                cout << "Milestone         : Milestone 5 (Deployment & Final Documentation)\n";
                cout << "Students          : Sumit Prajapati (BTIT26O1143)\n";
                cout << "                    Suraj Kumar (BTIT26O1144)\n";
                cout << "Project Mentor    : Prof. Surbhi Gupta Ma'am\n";
                cout << "Department / Class: School of Information Technology\n";
                cout << "Institution       : Madhav Institute of Technology & Science (MITS), Gwalior\n";
                cout << "Associated Stack  : C++ Console Application + Full-Stack Web App\n";
                cout << "========================================================\n";
                break;
            case 9:
                cout << "\nThank you for using Food Delivery Tracker. Exiting safely...\n";
                return 0;
            default:
                cout << "\n[!] Invalid choice! Please select an option between 1 and 9.\n";
        }
    }
    return 0;
}
