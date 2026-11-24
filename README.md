# ⚡ CravePulse - Commercial Food Delivery & Live GPS Radar Tracker

A complete, high-performance food delivery web platform featuring high-resolution satellite street imagery, 3D interactive design, live geospatial route tracking, an automated Haversine distance engine, an interactive shopping cart with promo vouchers, order cancellation, customer & admin authentication, and a dedicated admin revenue and menu management portal.

---

## 🌟 Key Platform Features (Matching Production Specifications)

1. **Customer & Admin Registration & Login**:
   - Role-based accounts: **Customer** and **Admin**.
   - Demo 1-click accounts (`customer@cravepulse.com` / `admin@cravepulse.com`).
   - Modal authentication with persistent session state.

2. **Multi-Restaurant Catalog & Food Search**:
   - Browse partner restaurants with ratings, cuisines, delivery times, and price bands.
   - Filter menu items by restaurant and search by dish name.

3. **Cart Management**:
   - Add items, increment/decrement quantities, and remove items with instant state sync.

4. **Promo Coupons**:
   - `WELCOME50`: 50% discount on order subtotal.
   - `SAVE20`: 20% discount on order subtotal.

5. **Transparent Billing**:
   - Subtotal + 5% GST calculation.
   - Delivery fee: **₹40** (Free delivery automatically applied on orders of **₹500+**).

6. **Flexible Demo Payment Methods**:
   - **Cash on Delivery (COD)**
   - **UPI (Google Pay / PhonePe / Paytm)**
   - **Credit / Debit Card**

7. **Order History, Live Tracking & Order Cancellation**:
   - Track live driver simulation on GPS radar.
   - View complete order history with date, items, total, and status.
   - One-click **Cancel Order** button before order delivery.

8. **Admin Management & Revenue Reports**:
   - Add/manage restaurants and update menu prices directly in real time.
   - Update order status live (Placed ➔ Confirmed ➔ Preparing ➔ Picked Up ➔ Out for Delivery ➔ Delivered).
   - Real-time **Revenue Analytics**: Total Revenue, Delivered Orders, Average Order Value (AOV), and Payment Method breakdown.

9. **High-Resolution Satellite Street View & 3D Earth Globe**:
   - **Satellite Street View**: Esri World High-Res Satellite Imagery overlaid with road networks and street names (no API key required, zero watermarks).
   - **Detailed Street Map**: Clean OpenStreetMap vector tiles.
   - **3D Earth Space Globe**: Three.js interactive 3D globe rendered in outer space with rotation, zoom, and dynamic atmosphere.

10. **Persistent Storage (Reloads on Restart)**:
    - Automatically synced to SQLite (`food_delivery.db`).
    - Persistent text file logging to `orders.txt`.
    - Local storage fallback for standalone browser usage.

11. **Companion C++ Terminal App**:
    - Complete standalone terminal application (`food_delivery_tracker.cpp`) with Haversine distance and `orders.txt` logging.

---

## 🚀 How to Run the Website

### Option 1: Start the Web Server (Recommended)
Run the Python web server in your terminal:

```bash
python3 server.py
```

Open your browser at:
👉 **[http://localhost:8000](http://localhost:8000)**

*Features:*
- Connects to SQLite database (`food_delivery.db`).
- Provides REST API endpoints (`/api/menu`, `/api/orders`, `/api/orders/{id}/status`, `/api/orders/{id}/simulate`).
- Serves static assets smoothly.

---

### Option 2: Open Directly in Browser (Zero Setup)
Simply double-click or open `index.html` in any browser:
```bash
open index.html
```
The website contains a full client-side state engine with localStorage, so all features (Menu, Cart, Leaflet Map, Live Driver Simulator, Kitchen KDS) work out-of-the-box.

---

## 💻 How to Run the C++ Console Tracker

The project also includes a standalone C++ terminal companion:

```bash
clang++ -std=c++17 -Wall food_delivery_tracker.cpp -o food_delivery_tracker
./food_delivery_tracker
```

---

## 📁 Project Structure

```text
Food delivery tracker/
├── index.html                 # 3D Real-time Food Delivery Web Application
├── styles.css                 # 3D spatial design system, glassmorphism & responsive CSS
├── app.js                     # Dynamic frontend logic, Haversine engine, Leaflet map & cart
├── server.py                  # Python REST API server + SQLite database
├── food_delivery.db           # SQLite database with menu catalog and orders
├── food_delivery_tracker.cpp  # C++ console tracking program
├── food_delivery_tracker      # Compiled C++ binary
├── orders.txt                 # Order history persistence log
├── quickstart.sh              # One-click launch shell script
└── README.md                  # Complete project documentation
```
