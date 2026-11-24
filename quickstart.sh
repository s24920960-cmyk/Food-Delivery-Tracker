#!/bin/bash
# Quickstart script for CravePulse - Real-Time Food Delivery & Tracking

echo "============================================================"
echo "      CRAVEPULSE - REAL-TIME FOOD DELIVERY & TRACKER        "
echo "      Lightning Fast Food Delivery with Live GPS Radar      "
echo "============================================================"
echo "Select an option to launch:"
echo " 1) Start Web App Server (Python + SQLite + REST API)"
echo " 2) Open Website directly in Default Browser (index.html)"
echo " 3) Run C++ Terminal Tracker Application"
echo " 4) Exit"
echo "============================================================"
read -p "Enter choice [1-4]: " choice

case $choice in
  1)
    echo "Starting Web Server at http://localhost:8000..."
    python3 server.py
    ;;
  2)
    echo "Opening index.html in your default web browser..."
    open index.html 2>/dev/null || xdg-open index.html 2>/dev/null || sensible-browser index.html 2>/dev/null
    ;;
  3)
    echo "Compiling C++ tracker application..."
    clang++ -std=c++17 -Wall food_delivery_tracker.cpp -o food_delivery_tracker 2>/dev/null || g++ -std=c++17 -Wall food_delivery_tracker.cpp -o food_delivery_tracker
    echo "Launching C++ console program..."
    ./food_delivery_tracker
    ;;
  4)
    echo "Exiting..."
    exit 0
    ;;
  *)
    echo "Invalid option. Exiting."
    exit 1
    ;;
esac
