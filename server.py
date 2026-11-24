#!/usr/bin/env python3
"""
CravePulse - Full Stack REST API & Web Server
Features: User Auth, Multi-Restaurant Catalog, Menu Management,
          Payment Processing, Live Tracking, Text File Persistence & Revenue Reports
"""

import http.server
import socketserver
import json
import sqlite3
import os
import math
import mimetypes
from datetime import datetime
from urllib.parse import urlparse, parse_qs

PORT = int(os.environ.get("PORT", 8000))
DB_FILE = "food_delivery.db"
TEXT_ORDERS_FILE = "orders.txt"

def calculate_haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

def append_order_to_text_file(order):
    try:
        with open(TEXT_ORDERS_FILE, "a", encoding="utf-8") as f:
            f.write("====================================================\n")
            f.write(f"ORDER ID: {order.get('order_id')}\n")
            f.write(f"DATE/TIME: {order.get('created_at', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))}\n")
            f.write(f"CUSTOMER: {order.get('customer_name')} ({order.get('customer_phone')})\n")
            f.write(f"ADDRESS: {order.get('delivery_address')}\n")
            f.write(f"RESTAURANT: {order.get('restaurant_name', 'Central Food Hub')}\n")
            f.write(f"PAYMENT METHOD: {order.get('payment_method', 'COD')}\n")
            f.write(f"STATUS: {order.get('status', 'Placed')}\n")
            f.write("ITEMS:\n")
            for item in order.get('items', []):
                f.write(f"  - {item.get('name')} x {item.get('quantity', 1)} @ Rs. {item.get('price', 0):.2f}\n")
            f.write(f"SUBTOTAL: Rs. {order.get('subtotal', 0):.2f}\n")
            f.write(f"TAX (5% GST): Rs. {order.get('tax', 0):.2f}\n")
            f.write(f"DELIVERY FEE: Rs. {order.get('delivery_fee', 0):.2f}\n")
            f.write(f"GRAND TOTAL: Rs. {order.get('grand_total', 0):.2f}\n")
            f.write("====================================================\n\n")
    except Exception as e:
        print(f"Error saving to {TEXT_ORDERS_FILE}: {e}")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()

    # Users Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT,
        created_at TEXT
    )
    ''')

    # Restaurants Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY,
        name TEXT,
        cuisine TEXT,
        rating REAL,
        delivery_time TEXT,
        address TEXT,
        emoji TEXT
    )
    ''')

    # Menu Items Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER,
        name TEXT,
        category TEXT,
        price REAL,
        description TEXT,
        is_veg INTEGER,
        rating REAL,
        emoji TEXT
    )
    ''')

    # Orders Table
    cur.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        order_id TEXT PRIMARY KEY,
        customer_name TEXT,
        customer_phone TEXT,
        delivery_address TEXT,
        restaurant_name TEXT,
        payment_method TEXT,
        items_json TEXT,
        subtotal REAL,
        tax REAL,
        delivery_fee REAL,
        grand_total REAL,
        status TEXT,
        driver_id TEXT,
        driver_name TEXT,
        driver_lat REAL,
        driver_lon REAL,
        pickup_lat REAL,
        pickup_lon REAL,
        dropoff_lat REAL,
        dropoff_lon REAL,
        created_at TEXT,
        last_updated TEXT
    )
    ''')

    # Seed Default Users
    cur.execute("SELECT COUNT(*) FROM users")
    if cur.fetchone()[0] == 0:
        cur.executemany("INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)", [
            ("Rahul Sharma", "customer@cravepulse.com", "password123", "Customer", "2026-11-20"),
            ("Store Administrator", "admin@cravepulse.com", "admin123", "Admin", "2026-11-20")
        ])

    # Seed Restaurants
    cur.execute("SELECT COUNT(*) FROM restaurants")
    if cur.fetchone()[0] == 0:
        restaurants = [
            (1, "The Royal Tandoor", "North Indian & Kebabs", 4.8, "25-30 min", "Mall Road, City Center", "🍲"),
            (2, "Pizza Bella Vista", "Wood-fired Pizza & Italian", 4.9, "20-25 min", "High Street Avenue", "🍕"),
            (3, "Spice Route Biryani", "Hyderabadi & Awadhi Dum", 4.9, "25-35 min", "Heritage Bazaar", "🍚"),
            (4, "Urban Burger Lab", "Gourmet Burgers & Shakes", 4.7, "15-20 min", "Cyber Hub Lane", "🍔"),
            (5, "Brew & Gelato Cafe", "Artisanal Coffee & Desserts", 4.8, "10-15 min", "Central Square", "🍨")
        ]
        cur.executemany("INSERT INTO restaurants VALUES (?,?,?,?,?,?,?)", restaurants)

    # Seed Menu Items
    cur.execute("SELECT COUNT(*) FROM menu")
    if cur.fetchone()[0] == 0:
        menu_items = [
            (1, 1, "Smoked Paneer Tikka Masala", "Main Course", 279.0, "Charcoal tandoor cottage cheese in rich tomato butter gravy", 1, 4.8, "🍲"),
            (2, 1, "Butter Garlic Naan Platter", "Breads", 119.0, "Freshly baked clay-oven flatbread brushed with garlic herb butter", 1, 4.6, "🫓"),
            (3, 3, "Royal Hyderabadi Dum Biryani", "Biryani", 319.0, "Slow-cooked saffron basmati rice with fragrant spices & tender cuts", 0, 4.9, "🍚"),
            (4, 3, "Subz Nizami Biryani", "Biryani", 229.0, "Farm fresh vegetables layered with aged basmati rice & rose essence", 1, 4.7, "🍚"),
            (5, 2, "Truffle Farmhouse Pizza", "Fast Food", 349.0, "Hand-stretched sourdough, wild mushrooms, black truffle oil & mozzarella", 1, 4.9, "🍕"),
            (6, 4, "Double Smashed Cheeseburger", "Fast Food", 229.0, "Crispy smashed patties, aged cheddar, caramelised onions & secret sauce", 0, 4.8, "🍔"),
            (7, 4, "Crispy Korean Chicken Wings", "Fast Food", 289.0, "Crunchy double-fried wings tossed in fiery sweet gochujang glaze", 0, 4.8, "🍗"),
            (8, 5, "Dark Roasted Iced Mocha", "Beverages", 149.0, "Double-shot arabica espresso shaken with belgian chocolate & cold milk", 1, 4.7, "🥤"),
            (9, 5, "Artisanal Mango Gelato", "Dessert", 159.0, "Hand-churned Alphonso mango gelato topped with toasted pistachios", 1, 4.9, "🍨"),
            (10, 5, "Fresh Mint Lime Mojito", "Beverages", 99.0, "Sparkling fizzy beverage with crushed mint, zesty lime & cane sugar", 1, 4.5, "🍋")
        ]
        cur.executemany("INSERT INTO menu VALUES (?,?,?,?,?,?,?,?,?)", menu_items)

    # Seed Initial Demo Order FD-1001 if none exists
    cur.execute("SELECT COUNT(*) FROM orders")
    if cur.fetchone()[0] == 0:
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        items_sample = [
            {"id": 5, "name": "Truffle Farmhouse Pizza", "quantity": 1, "price": 349.0, "emoji": "🍕"},
            {"id": 8, "name": "Dark Roasted Iced Mocha", "quantity": 2, "price": 149.0, "emoji": "🥤"}
        ]
        sample_order = {
            "order_id": "FD-1001",
            "customer_name": "Rahul Sharma",
            "customer_phone": "+91 98765 43210",
            "delivery_address": "Flat 402, Green View Apartments, Sector 4",
            "restaurant_name": "Pizza Bella Vista",
            "payment_method": "UPI (Google Pay)",
            "items": items_sample,
            "subtotal": 647.0,
            "tax": 32.35,
            "delivery_fee": 0.0,
            "grand_total": 679.35,
            "status": "Out for Delivery",
            "created_at": now_str
        }
        cur.execute('''
        INSERT INTO orders VALUES (
            'FD-1001', 'Rahul Sharma', '+91 98765 43210', 'Flat 402, Green View Apartments, Sector 4',
            'Pizza Bella Vista', 'UPI (Google Pay)', ?, 647.0, 32.35, 0.0, 679.35, 'Out for Delivery',
            'DRV-04', 'Vikram Singh', 26.2245, 78.2091, 26.2307, 78.2173, 26.2183, 78.1828,
            ?, ?
        )
        ''', (json.dumps(items_sample), now_str, now_str))
        append_order_to_text_file(sample_order)

    conn.commit()
    conn.close()

class CustomRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        # 1. Menu Catalog
        if path == "/api/menu":
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT id, restaurant_id, name, category, price, description, is_veg, rating, emoji FROM menu")
            rows = cur.fetchall()
            conn.close()
            menu = []
            for r in rows:
                menu.append({
                    "id": r[0], "restaurant_id": r[1], "name": r[2], "category": r[3],
                    "price": r[4], "desc": r[5], "veg": bool(r[6]), "rating": r[7], "emoji": r[8]
                })
            self._send_json(200, {"success": True, "items": menu})
            return

        # 2. Restaurants Catalog
        elif path == "/api/restaurants":
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT id, name, cuisine, rating, delivery_time, address, emoji FROM restaurants")
            rows = cur.fetchall()
            conn.close()
            restaurants = []
            for r in rows:
                restaurants.append({
                    "id": r[0], "name": r[1], "cuisine": r[2], "rating": r[3],
                    "delivery_time": r[4], "address": r[5], "emoji": r[6]
                })
            self._send_json(200, {"success": True, "restaurants": restaurants})
            return

        # 3. Orders List
        elif path == "/api/orders":
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
            rows = cur.fetchall()
            conn.close()
            orders = [self._row_to_order_dict(r) for r in rows]
            self._send_json(200, {"success": True, "orders": orders})
            return

        # 4. Single Order
        elif path.startswith("/api/orders/"):
            parts = path.split("/")
            if len(parts) >= 4 and parts[3]:
                order_id = parts[3]
                subpath = parts[4] if len(parts) > 4 else ""

                conn = sqlite3.connect(DB_FILE)
                cur = conn.cursor()
                cur.execute("SELECT * FROM orders WHERE order_id = ?", (order_id,))
                row = cur.fetchone()
                conn.close()

                if not row:
                    self._send_json(404, {"success": False, "error": f"Order {order_id} not found"})
                    return

                order_data = self._row_to_order_dict(row)
                if subpath == "location":
                    self._send_json(200, {
                        "success": True,
                        "order_id": order_id,
                        "rider_name": order_data["rider_name"],
                        "driver_location": {"lat": order_data["driver_lat"], "lon": order_data["driver_lon"]},
                        "pickup_location": {"lat": order_data["pickup_lat"], "lon": order_data["pickup_lon"]},
                        "dropoff_location": {"lat": order_data["dropoff_lat"], "lon": order_data["dropoff_lon"]},
                        "distance_km": calculate_haversine(
                            order_data["driver_lat"], order_data["driver_lon"],
                            order_data["dropoff_lat"], order_data["dropoff_lon"]
                        ),
                        "status": order_data["status"],
                        "last_updated": order_data["last_updated"]
                    })
                    return

                self._send_json(200, {"success": True, "order": order_data})
                return

        # 5. Revenue Report (Key Feature #10 for Admin)
        elif path == "/api/revenue":
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*), SUM(grand_total) FROM orders WHERE status != 'Cancelled'")
            active_cnt, total_rev = cur.fetchone()
            total_rev = total_rev or 0.0

            cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'Delivered'")
            delivered_cnt = cur.fetchone()[0]

            cur.execute("SELECT COUNT(*) FROM orders WHERE status = 'Cancelled'")
            cancelled_cnt = cur.fetchone()[0]

            # Payment breakdown
            cur.execute("SELECT payment_method, COUNT(*), SUM(grand_total) FROM orders GROUP BY payment_method")
            pay_rows = cur.fetchall()
            conn.close()

            payment_breakdown = {}
            for pr in pay_rows:
                method = pr[0] or "COD"
                payment_breakdown[method] = {
                    "count": pr[1],
                    "total": round(pr[2] or 0.0, 2)
                }

            avg_order = round(total_rev / active_cnt, 2) if active_cnt > 0 else 0.0

            self._send_json(200, {
                "success": True,
                "total_revenue": round(total_rev, 2),
                "total_orders": active_cnt + cancelled_cnt,
                "delivered_orders": delivered_cnt,
                "cancelled_orders": cancelled_cnt,
                "average_order_value": avg_order,
                "payment_breakdown": payment_breakdown
            })
            return

        # Default static file handling
        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(length) if length > 0 else b'{}'
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        # 1. User Auth: Login / Register
        if path == "/api/auth/login":
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT id, name, email, role FROM users WHERE LOWER(email) = ? AND password = ?", (email, password))
            row = cur.fetchone()
            conn.close()

            if row:
                self._send_json(200, {
                    "success": True,
                    "user": {"id": row[0], "name": row[1], "email": row[2], "role": row[3]}
                })
            else:
                self._send_json(401, {"success": False, "error": "Invalid email or password"})
            return

        elif path == "/api/auth/register":
            name = body.get("name", "New User").strip()
            email = body.get("email", "").strip().lower()
            password = body.get("password", "")
            role = body.get("role", "Customer")
            now_str = datetime.now().strftime("%Y-%m-%d")

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            try:
                cur.execute("INSERT INTO users (name, email, password, role, created_at) VALUES (?,?,?,?,?)",
                            (name, email, password, role, now_str))
                conn.commit()
                user_id = cur.lastrowid
                conn.close()
                self._send_json(201, {
                    "success": True,
                    "user": {"id": user_id, "name": name, "email": email, "role": role}
                })
            except sqlite3.IntegrityError:
                conn.close()
                self._send_json(400, {"success": False, "error": "Email is already registered"})
            return

        # 2. Create Order
        elif path == "/api/orders":
            customer_name = body.get("customer_name", "Rahul Sharma")
            customer_phone = body.get("customer_phone", "+91 98765 43210")
            delivery_address = body.get("delivery_address", "Flat 402, Green View Apartments")
            restaurant_name = body.get("restaurant_name", "Pizza Bella Vista")
            payment_method = body.get("payment_method", "Cash on Delivery (COD)")
            items = body.get("items", [])

            subtotal = float(body.get("subtotal", 0.0))
            if subtotal <= 0 and items:
                subtotal = sum(i.get("price", 0) * i.get("quantity", 1) for i in items)
            tax = round(subtotal * 0.05, 2)
            # Key feature #6: Delivery Rs. 40, free from Rs. 500
            delivery_fee = 0.0 if subtotal >= 500.0 else 40.0
            grand_total = float(body.get("grand_total", round(subtotal + tax + delivery_fee, 2)))

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM orders")
            count = cur.fetchone()[0]
            order_id = f"FD-{1001 + count}"
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            pickup_lat, pickup_lon = 26.2307, 78.2173
            dropoff_lat, dropoff_lon = 26.2183, 78.1828
            driver_lat, driver_lon = pickup_lat, pickup_lon

            cur.execute('''
            INSERT INTO orders VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Placed', 'DRV-04', 'Vikram Singh',
                ?, ?, ?, ?, ?, ?, ?, ?
            )
            ''', (
                order_id, customer_name, customer_phone, delivery_address, restaurant_name, payment_method,
                json.dumps(items), subtotal, tax, delivery_fee, grand_total,
                driver_lat, driver_lon, pickup_lat, pickup_lon, dropoff_lat, dropoff_lon,
                now_str, now_str
            ))
            conn.commit()
            conn.close()

            # Append to text file (Key feature #11)
            order_data = {
                "order_id": order_id,
                "customer_name": customer_name,
                "customer_phone": customer_phone,
                "delivery_address": delivery_address,
                "restaurant_name": restaurant_name,
                "payment_method": payment_method,
                "items": items,
                "subtotal": subtotal,
                "tax": tax,
                "delivery_fee": delivery_fee,
                "grand_total": grand_total,
                "status": "Placed",
                "created_at": now_str
            }
            append_order_to_text_file(order_data)

            self._send_json(201, {
                "success": True,
                "message": "Order placed and logged to orders.txt",
                "order_id": order_id,
                "status": "Placed",
                "grand_total": grand_total
            })
            return

        # 3. Add Restaurant (Admin Key feature #9)
        elif path == "/api/restaurants":
            name = body.get("name", "New Eatery")
            cuisine = body.get("cuisine", "Multi-cuisine")
            rating = float(body.get("rating", 4.5))
            delivery_time = body.get("delivery_time", "20-30 min")
            address = body.get("address", "Main Market")
            emoji = body.get("emoji", "🍽️")

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("INSERT INTO restaurants (name, cuisine, rating, delivery_time, address, emoji) VALUES (?,?,?,?,?,?)",
                        (name, cuisine, rating, delivery_time, address, emoji))
            conn.commit()
            rest_id = cur.lastrowid
            conn.close()

            self._send_json(201, {"success": True, "id": rest_id, "name": name})
            return

        # 4. Add Menu Item (Admin Key feature #9)
        elif path == "/api/menu":
            rest_id = int(body.get("restaurant_id", 1))
            name = body.get("name", "New Dish")
            category = body.get("category", "Main Course")
            price = float(body.get("price", 199.0))
            desc = body.get("description", "Freshly prepared chef recipe")
            is_veg = 1 if body.get("is_veg", True) else 0
            emoji = body.get("emoji", "🍲")

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("INSERT INTO menu (restaurant_id, name, category, price, description, is_veg, rating, emoji) VALUES (?,?,?,?,?,?,?,?)",
                        (rest_id, name, category, price, desc, is_veg, 4.8, emoji))
            conn.commit()
            item_id = cur.lastrowid
            conn.close()

            self._send_json(201, {"success": True, "id": item_id, "name": name})
            return

        # 5. Simulate Driver GPS Step
        elif path.startswith("/api/orders/") and path.endswith("/simulate"):
            parts = path.split("/")
            order_id = parts[3]
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT driver_lat, driver_lon, dropoff_lat, dropoff_lon, status FROM orders WHERE order_id = ?", (order_id,))
            row = cur.fetchone()
            if not row:
                conn.close()
                self._send_json(404, {"success": False, "error": "Order not found"})
                return

            d_lat, d_lon, target_lat, target_lon, status = row
            new_lat = d_lat + (target_lat - d_lat) * 0.22
            new_lon = d_lon + (target_lon - d_lon) * 0.22
            dist = calculate_haversine(new_lat, new_lon, target_lat, target_lon)

            new_status = status
            if dist < 0.25:
                new_status = "Delivered"
            elif status in ["Placed", "Confirmed", "Preparing", "Picked Up"]:
                new_status = "Out for Delivery"

            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            cur.execute('''
            UPDATE orders SET driver_lat = ?, driver_lon = ?, status = ?, last_updated = ? WHERE order_id = ?
            ''', (new_lat, new_lon, new_status, now_str, order_id))
            conn.commit()
            conn.close()

            self._send_json(200, {
                "success": True,
                "order_id": order_id,
                "latitude": new_lat,
                "longitude": new_lon,
                "distance_km": dist,
                "status": new_status,
                "eta_minutes": max(1, int(dist * 2.8))
            })
            return

        self._send_json(404, {"error": "Endpoint not found"})

    def do_PATCH(self):
        parsed = urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(length) if length > 0 else b'{}'
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        # 1. Update Order Status (Admin / Rider)
        if path.startswith("/api/orders/") and path.endswith("/status"):
            parts = path.split("/")
            order_id = parts[3]
            new_status = body.get("status")

            valid_statuses = ["Placed", "Confirmed", "Preparing", "Picked Up", "Out for Delivery", "Delivered", "Cancelled"]
            if new_status not in valid_statuses:
                self._send_json(400, {"success": False, "error": f"Invalid status '{new_status}'"})
                return

            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("UPDATE orders SET status = ?, last_updated = ? WHERE order_id = ?", (new_status, now_str, order_id))
            conn.commit()
            conn.close()

            self._send_json(200, {"success": True, "order_id": order_id, "new_status": new_status})
            return

        # 2. Cancel Order (Key feature #8)
        elif path.startswith("/api/orders/") and path.endswith("/cancel"):
            parts = path.split("/")
            order_id = parts[3]
            now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("SELECT status FROM orders WHERE order_id = ?", (order_id,))
            row = cur.fetchone()
            if not row:
                conn.close()
                self._send_json(404, {"success": False, "error": "Order not found"})
                return

            if row[0] == "Delivered":
                conn.close()
                self._send_json(400, {"success": False, "error": "Delivered order cannot be cancelled"})
                return

            cur.execute("UPDATE orders SET status = 'Cancelled', last_updated = ? WHERE order_id = ?", (now_str, order_id))
            conn.commit()
            conn.close()

            self._send_json(200, {"success": True, "order_id": order_id, "status": "Cancelled"})
            return

        # 3. Update Menu Item Price (Admin Key feature #9)
        elif path.startswith("/api/menu/"):
            parts = path.split("/")
            item_id = int(parts[3])
            new_price = float(body.get("price", 0))

            conn = sqlite3.connect(DB_FILE)
            cur = conn.cursor()
            cur.execute("UPDATE menu SET price = ? WHERE id = ?", (new_price, item_id))
            conn.commit()
            conn.close()

            self._send_json(200, {"success": True, "item_id": item_id, "new_price": new_price})
            return

        self._send_json(404, {"error": "Endpoint not found"})

    def _row_to_order_dict(self, r):
        try:
            items = json.loads(r[6])
        except Exception:
            items = []
        return {
            "order_id": r[0],
            "customer_name": r[1],
            "customer_phone": r[2],
            "delivery_address": r[3],
            "restaurant_name": r[4] or "Pizza Bella Vista",
            "payment_method": r[5] or "COD",
            "items": items,
            "subtotal": r[7],
            "tax": r[8],
            "delivery_fee": r[9],
            "grand_total": r[10],
            "status": r[11],
            "driver_id": r[12],
            "rider_name": r[13] or "Vikram Singh",
            "driver_lat": r[14],
            "driver_lon": r[15],
            "pickup_lat": r[16],
            "pickup_lon": r[17],
            "dropoff_lat": r[18],
            "dropoff_lon": r[19],
            "created_at": r[20],
            "last_updated": r[21],
            "distance_km": calculate_haversine(r[14], r[15], r[18], r[19]),
            "eta_minutes": max(1, int(calculate_haversine(r[14], r[15], r[18], r[19]) * 2.8))
        }

def run_server():
    init_db()
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    socketserver.TCPServer.allow_reuse_address = True

    current_port = PORT
    httpd = None
    for attempt_port in [current_port, 8080, 8081, 8001, 8888, 5000]:
        try:
            httpd = socketserver.TCPServer(("", attempt_port), CustomRequestHandler)
            current_port = attempt_port
            break
        except OSError as e:
            if attempt_port == 5000:
                print(f"Error binding port: {e}")
                return
            continue

    print(f"==================================================")
    print(f" CRAVEPULSE - REAL-TIME FOOD DELIVERY WEB SERVER  ")
    print(f" Access Live App: http://localhost:{current_port} ")
    print(f" Direct HTML: Open index.html in any browser      ")
    print(f" Status: Satellite Radar, Auth & Admin Active     ")
    print(f" Text Persistence: Logging to orders.txt          ")
    print(f"==================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server gracefully...")

if __name__ == "__main__":
    run_server()
