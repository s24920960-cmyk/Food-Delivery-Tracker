/**
 * CravePulse - Modern Real-Time Food Delivery & Satellite GPS Platform
 * Features: Auth, Multi-Restaurant Catalog, Satellite/Street/3D Earth Maps,
 *           Coupons (WELCOME50, SAVE20), Payments, Cancellation, Admin & Revenue Analytics
 */

// Global Application State
const appState = {
  // Current Authenticated User (Key Feature #1)
  currentUser: {
    id: 1,
    name: "Rahul Sharma",
    email: "customer@cravepulse.com",
    role: "Customer" // "Customer" or "Admin"
  },

  // Multi-Restaurant Catalog (Key Feature #2)
  restaurantsCatalog: [
    { id: 1, name: "The Royal Tandoor", cuisine: "North Indian & Kebabs", rating: 4.8, delivery_time: "25-30 min", address: "Mall Road, City Center", emoji: "🍲" },
    { id: 2, name: "Pizza Bella Vista", cuisine: "Wood-fired Pizza & Italian", rating: 4.9, delivery_time: "20-25 min", address: "High Street Avenue", emoji: "🍕" },
    { id: 3, name: "Spice Route Biryani", cuisine: "Hyderabadi & Awadhi Dum", rating: 4.9, delivery_time: "25-35 min", address: "Heritage Bazaar", emoji: "🍚" },
    { id: 4, name: "Urban Burger Lab", cuisine: "Gourmet Burgers & Shakes", rating: 4.7, delivery_time: "15-20 min", address: "Cyber Hub Lane", emoji: "🍔" },
    { id: 5, name: "Brew & Gelato Cafe", cuisine: "Artisanal Coffee & Desserts", rating: 4.8, delivery_time: "10-15 min", address: "Central Square", emoji: "🍨" }
  ],

  // Menu Catalog (Key Feature #2 & #9)
  menuCatalog: [
    { id: 1, restaurant_id: 1, restaurant_name: "The Royal Tandoor", name: "Smoked Paneer Tikka Masala", category: "Main Course", price: 279.0, desc: "Charcoal-tandoor cottage cheese in rich tomato butter gravy", veg: true, rating: 4.8, time: "20 mins", emoji: "🍲" },
    { id: 2, restaurant_id: 1, restaurant_name: "The Royal Tandoor", name: "Butter Garlic Naan Platter", category: "Breads", price: 119.0, desc: "Freshly baked clay-oven flatbread brushed with garlic herb butter", veg: true, rating: 4.6, time: "10 mins", emoji: "🫓" },
    { id: 3, restaurant_id: 3, restaurant_name: "Spice Route Biryani", name: "Royal Hyderabadi Dum Biryani", category: "Biryani", price: 319.0, desc: "Slow-cooked saffron basmati rice with fragrant spices & tender cuts", veg: false, rating: 4.9, time: "25 mins", emoji: "🍚" },
    { id: 4, restaurant_id: 3, restaurant_name: "Spice Route Biryani", name: "Subz Nizami Dum Biryani", category: "Biryani", price: 229.0, desc: "Farm fresh vegetables layered with aged basmati rice & saffron", veg: true, rating: 4.7, time: "22 mins", emoji: "🍚" },
    { id: 5, restaurant_id: 2, restaurant_name: "Pizza Bella Vista", name: "Truffle Farmhouse Pizza", category: "Fast Food", price: 349.0, desc: "Hand-stretched sourdough, wild mushrooms, black truffle oil & mozzarella", veg: true, rating: 4.9, time: "22 mins", emoji: "🍕" },
    { id: 6, restaurant_id: 4, restaurant_name: "Urban Burger Lab", name: "Double Smashed Cheeseburger", category: "Fast Food", price: 229.0, desc: "Dual crispy smashed patties, aged cheddar, caramelised onions & secret sauce", veg: false, rating: 4.8, time: "18 mins", emoji: "🍔" },
    { id: 7, restaurant_id: 4, restaurant_name: "Urban Burger Lab", name: "Crispy Korean Chicken Wings", category: "Fast Food", price: 289.0, desc: "Crunchy double-fried wings tossed in fiery sweet gochujang glaze", veg: false, rating: 4.8, time: "16 mins", emoji: "🍗" },
    { id: 8, restaurant_id: 5, restaurant_name: "Brew & Gelato Cafe", name: "Dark Roasted Iced Mocha", category: "Beverages", price: 149.0, desc: "Double-shot espresso shaken with belgian chocolate & cold milk", veg: true, rating: 4.7, time: "8 mins", emoji: "🥤" },
    { id: 9, restaurant_id: 5, restaurant_name: "Brew & Gelato Cafe", name: "Artisanal Mango Gelato", category: "Dessert", price: 159.0, desc: "Hand-churned Alphonso mango gelato topped with toasted pistachios", veg: true, rating: 4.9, time: "5 mins", emoji: "🍨" },
    { id: 10, restaurant_id: 5, restaurant_name: "Brew & Gelato Cafe", name: "Fresh Mint Lime Mojito", category: "Beverages", price: 99.0, desc: "Sparkling fizzy beverage with crushed mint, zesty lime & cane sugar", veg: true, rating: 4.5, time: "6 mins", emoji: "🍋" }
  ],

  // Shopping Cart (Key Feature #3)
  cart: [
    { id: 5, name: "Truffle Farmhouse Pizza", price: 349.0, quantity: 1, emoji: "🍕", restaurant_name: "Pizza Bella Vista" },
    { id: 8, name: "Dark Roasted Iced Mocha", price: 149.0, quantity: 2, emoji: "🥤", restaurant_name: "Brew & Gelato Cafe" }
  ],

  // Filter & Checkout States
  activeFilter: 'all',
  activeDiet: 'all',
  selectedRestaurantFilter: null,
  selectedRiderTip: 20.0,
  discountValue: 0.0,
  activeCouponCode: null,
  selectedPaymentMethod: "Cash on Delivery (COD)", // Key Feature #7

  // Active Real-Time Order
  activeOrder: {
    order_id: "FD-1001",
    customer_name: "Rahul Sharma",
    customer_phone: "+91 98765 43210",
    delivery_address: "Flat 402, Green View Apartments, Sector 4",
    restaurant_name: "Pizza Bella Vista",
    payment_method: "Cash on Delivery (COD)",
    items: [
      { id: 5, name: "Truffle Farmhouse Pizza", price: 349.0, quantity: 1, emoji: "🍕" },
      { id: 8, name: "Dark Roasted Iced Mocha", price: 149.0, quantity: 2, emoji: "🥤" }
    ],
    subtotal: 647.0,
    delivery_fee: 0.0, // Free above 500
    tax: 32.35,
    tip: 20.0,
    grand_total: 699.35,
    status: "Out for Delivery",
    rider_name: "Vikram Singh",
    rider_vehicle: "Honda Activa 6G • White (MP-07-CB-4210)",
    rider_rating: 4.9,
    pickup_lat: 26.2307,
    pickup_lon: 78.2173,
    dropoff_lat: 26.2183,
    dropoff_lon: 78.1828,
    rider_lat: 26.2245,
    rider_lon: 78.2091,
    created_at: "22:45",
    speed_kmh: 28
  },

  ordersHistory: [],
  leafletMap: null,
  satelliteLayerGroup: null,
  streetLayer: null,
  mapMarkers: {},
  autoMoveTimer: null,
  mapMode: 'satellite', // 'satellite', 'street', or 'globe'

  // 3D Earth Globe State
  earthScene: null,
  earthCamera: null,
  earthRenderer: null,
  earthControls: null,
  earthGlobe: null,
  earthMarkersGroup: null,
  earthRiderMarker: null,
  isEarthAutoRotating: false
};

// ==========================================
// 1. HAVERSINE GEODESIC ROUTING ENGINE
// ==========================================
function computeHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function computeETA(distanceKm, speedKmh = 28) {
  if (distanceKm <= 0.05) return 0;
  return Math.max(1, Math.round((distanceKm / speedKmh) * 60));
}

// ==========================================
// 2. INITIALIZATION & NAVIGATION TABS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  try { loadStoredState(); } catch(e) { console.error(e); }
  try { updateAuthUI(); } catch(e) { console.error(e); }
  try { renderRestaurants(); } catch(e) { console.error(e); }
  try { renderFeaturedDishes(); } catch(e) { console.error(e); }
  try { renderFullMenu(); } catch(e) { console.error(e); }
  try { refreshCartDisplay(); } catch(e) { console.error(e); }
  try { init3DInteractiveTilt(); } catch(e) { console.error(e); }
  try { initLiveTrackingMap(); } catch(e) { console.error(e); }
  try { init3DEarthGlobe(); } catch(e) { console.error(e); }
  try { updateLiveTrackingTelemetry(); } catch(e) { console.error(e); }
  try { renderOrderHistory(); } catch(e) { console.error(e); }
  try { refreshAdminDashboard(); } catch(e) { console.error(e); }
});

function switchView(viewName) {
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

  const targetPanel = document.getElementById(`view-${viewName}`);
  if (targetPanel) targetPanel.classList.add('active');

  const buttons = document.querySelectorAll('.nav-item');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(viewName)) {
      btn.classList.add('active');
    }
  });

  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.remove('mobile-open');

  if (typeof window.scrollTo === 'function') {
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch(e) { window.scrollTo(0, 0); }
  }

  if (viewName === 'tracking') {
    setTimeout(() => {
      if (appState.mapMode === 'globe') {
        onEarthResize();
      } else if (appState.leafletMap) {
        appState.leafletMap.invalidateSize();
      }
    }, 250);
  } else if (viewName === 'history') {
    renderOrderHistory();
  } else if (viewName === 'admin') {
    refreshAdminDashboard();
  }
}

function toggleMobileNav() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('mobile-open');
}

function promptAddressChange() {
  const newAddr = prompt("Enter your delivery address:", appState.activeOrder.delivery_address);
  if (newAddr && newAddr.trim().length > 0) {
    appState.activeOrder.delivery_address = newAddr.trim();
    const locText = document.getElementById('currentLocationText');
    if (locText) locText.textContent = newAddr.trim();
    const chk = document.getElementById('checkoutAddress');
    if (chk) chk.value = newAddr.trim();
    showToast("📍 Delivery address updated!");
    updateLiveTrackingTelemetry();
  }
}

// ==========================================
// 3. USER AUTHENTICATION (Key Feature #1)
// ==========================================
function updateAuthUI() {
  const badge = document.getElementById('userAuthBadge');
  const adminNav = document.getElementById('adminNavItem');
  if (!badge) return;

  if (appState.currentUser) {
    const isAdm = appState.currentUser.role === "Admin";
    badge.innerHTML = `
      <div class="logged-user-pill">
        <span>${isAdm ? '🔑' : '👤'} ${appState.currentUser.name} (${appState.currentUser.role})</span>
        <button class="btn-logout-mini" onclick="logoutUser()">Logout</button>
      </div>
    `;
    if (adminNav) adminNav.style.display = isAdm ? 'flex' : 'none';
  } else {
    badge.innerHTML = `
      <button class="btn-login-modal" onclick="openAuthModal()">
        <span>👤 Login / Register</span>
      </button>
    `;
    if (adminNav) adminNav.style.display = 'none';
  }
}

function openAuthModal() {
  document.getElementById('authModal')?.classList.add('active');
}

function closeAuthModal() {
  document.getElementById('authModal')?.classList.remove('active');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('authTabLogin');
  const tabReg = document.getElementById('authTabRegister');
  const formLogin = document.getElementById('authFormLogin');
  const formReg = document.getElementById('authFormRegister');

  if (tab === 'login') {
    tabLogin?.classList.add('active');
    tabReg?.classList.remove('active');
    if (formLogin) formLogin.style.display = 'block';
    if (formReg) formReg.style.display = 'none';
  } else {
    tabLogin?.classList.remove('active');
    tabReg?.classList.add('active');
    if (formLogin) formLogin.style.display = 'none';
    if (formReg) formReg.style.display = 'block';
  }
}

function fillDemoLogin(role) {
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (role === 'admin') {
    if (emailInput) emailInput.value = "admin@cravepulse.com";
    if (passInput) passInput.value = "admin123";
  } else {
    if (emailInput) emailInput.value = "customer@cravepulse.com";
    if (passInput) passInput.value = "password123";
  }
}

async function executeLogin() {
  const email = (document.getElementById('loginEmail')?.value || '').trim();
  const password = (document.getElementById('loginPassword')?.value || '').trim();

  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  // Check locally or sync with backend
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        appState.currentUser = data.user;
      }
    } else {
      // Local demo fallback
      if (email.includes("admin")) {
        appState.currentUser = { id: 2, name: "Store Administrator", email, role: "Admin" };
      } else {
        appState.currentUser = { id: 1, name: "Rahul Sharma", email, role: "Customer" };
      }
    }
  } catch (e) {
    if (email.includes("admin")) {
      appState.currentUser = { id: 2, name: "Store Administrator", email, role: "Admin" };
    } else {
      appState.currentUser = { id: 1, name: "Rahul Sharma", email, role: "Customer" };
    }
  }

  saveStoredState();
  updateAuthUI();
  closeAuthModal();
  showToast(`Welcome back, ${appState.currentUser.name}!`);

  if (appState.currentUser.role === "Admin") {
    switchView('admin');
  }
}

async function executeRegister() {
  const name = (document.getElementById('regName')?.value || 'Guest User').trim();
  const email = (document.getElementById('regEmail')?.value || '').trim();
  const password = (document.getElementById('regPassword')?.value || '').trim();
  const role = document.getElementById('regRole')?.value || 'Customer';

  if (!email || !password) {
    alert("Please fill all required registration fields");
    return;
  }

  appState.currentUser = { id: Date.now(), name, email, role };
  saveStoredState();
  updateAuthUI();
  closeAuthModal();
  showToast(`Account created! Welcome, ${name}`);
}

function logoutUser() {
  appState.currentUser = null;
  saveStoredState();
  updateAuthUI();
  switchView('home');
  showToast("Logged out successfully");
}

// ==========================================
// 4. RESTAURANTS CATALOG (Key Feature #2)
// ==========================================
function renderRestaurants() {
  const homeGrid = document.getElementById('homeRestaurantsGrid');
  const fullGrid = document.getElementById('fullRestaurantsGrid');
  const restaurantOptions = document.getElementById('newDishRestaurant');

  const cardsHTML = appState.restaurantsCatalog.map(rest => `
    <div class="restaurant-card-3d" onclick="filterMenuByRestaurant(${rest.id})">
      <div class="rest-cover">
        <span>${rest.emoji}</span>
        <span class="rest-rating-pill">★ ${rest.rating}</span>
      </div>
      <div class="rest-details">
        <h3 class="rest-name">${rest.name}</h3>
        <span class="rest-cuisine">${rest.cuisine}</span>
        <div class="rest-footer">
          <span>⏱️ ${rest.delivery_time}</span>
          <span>📍 ${rest.address}</span>
        </div>
      </div>
    </div>
  `).join('');

  if (homeGrid) homeGrid.innerHTML = cardsHTML;
  if (fullGrid) fullGrid.innerHTML = cardsHTML;

  if (restaurantOptions) {
    restaurantOptions.innerHTML = appState.restaurantsCatalog.map(r => `
      <option value="${r.id}">${r.name}</option>
    `).join('');
  }
}

function filterRestaurantsCatalog() {
  const q = (document.getElementById('restaurantSearchInput')?.value || '').toLowerCase();
  const fullGrid = document.getElementById('fullRestaurantsGrid');
  if (!fullGrid) return;

  const filtered = appState.restaurantsCatalog.filter(r => 
    r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
  );

  fullGrid.innerHTML = filtered.map(rest => `
    <div class="restaurant-card-3d" onclick="filterMenuByRestaurant(${rest.id})">
      <div class="rest-cover">
        <span>${rest.emoji}</span>
        <span class="rest-rating-pill">★ ${rest.rating}</span>
      </div>
      <div class="rest-details">
        <h3 class="rest-name">${rest.name}</h3>
        <span class="rest-cuisine">${rest.cuisine}</span>
        <div class="rest-footer">
          <span>⏱️ ${rest.delivery_time}</span>
          <span>📍 ${rest.address}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function filterMenuByRestaurant(restId) {
  appState.selectedRestaurantFilter = restId;
  const rest = appState.restaurantsCatalog.find(r => r.id === restId);
  switchView('menu');

  const heading = document.getElementById('menuViewHeading');
  const subheading = document.getElementById('menuViewSubheading');
  if (heading && rest) heading.textContent = `${rest.name} Menu`;
  if (subheading && rest) subheading.textContent = `Specialities: ${rest.cuisine} • Delivery in ${rest.delivery_time}`;

  renderFullMenu();
}

// ==========================================
// 5. FOOD MENU & 3D CARDS (Key Feature #2)
// ==========================================
function renderFeaturedDishes() {
  const container = document.getElementById('homeDishesGrid');
  if (!container) return;

  let items = appState.menuCatalog;
  if (appState.activeDiet === 'veg') items = items.filter(i => i.veg);
  if (appState.activeDiet === 'non-veg') items = items.filter(i => !i.veg);

  container.innerHTML = items.slice(0, 6).map(dish => createDishCardHTML(dish)).join('');
}

function renderFullMenu() {
  const container = document.getElementById('fullMenuGrid');
  if (!container) return;

  const searchQuery = (document.getElementById('menuSearchInput')?.value || '').toLowerCase();
  const vegOnly = document.getElementById('vegOnlyCheckbox')?.checked || false;

  const filtered = appState.menuCatalog.filter(item => {
    const matchesRest = !appState.selectedRestaurantFilter || item.restaurant_id === appState.selectedRestaurantFilter;
    const matchesCat = appState.activeFilter === 'all' || item.category === appState.activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.desc.toLowerCase().includes(searchQuery);
    const matchesDiet = !vegOnly || item.veg;
    return matchesRest && matchesCat && matchesSearch && matchesDiet;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding: 60px 0; color: var(--text-muted);">
        <p style="font-size:2.5rem; margin-bottom:8px;">🔍</p>
        <h3>No dishes found</h3>
        <p>Try searching for something else or clearing the restaurant filter.</p>
        <button class="btn-hero-action" style="margin-top:16px" onclick="clearRestaurantFilter()">Show All Dishes</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(dish => createDishCardHTML(dish)).join('');
}

function clearRestaurantFilter() {
  appState.selectedRestaurantFilter = null;
  const heading = document.getElementById('menuViewHeading');
  const subheading = document.getElementById('menuViewSubheading');
  if (heading) heading.textContent = "All Food Dishes";
  if (subheading) subheading.textContent = "Browse items across all restaurants or filter by cuisine category.";
  renderFullMenu();
}

function createDishCardHTML(dish) {
  return `
    <div class="dish-card-3d">
      <div class="dish-cover">
        <span class="dish-emoji-hero">${dish.emoji}</span>
        <span class="tag-diet ${dish.veg ? 'veg' : 'non-veg'}">
          ${dish.veg ? '🟢 VEG' : '🔴 NON-VEG'}
        </span>
        <span class="tag-time">⏱️ ${dish.time || '20 min'}</span>
        <span class="tag-rating">★ ${dish.rating}</span>
      </div>
      <div class="dish-details">
        <span class="dish-category-label">${dish.restaurant_name || dish.category}</span>
        <h3 class="dish-title">${dish.name}</h3>
        <p class="dish-description">${dish.desc}</p>
        <div class="dish-footer">
          <span class="dish-price">₹${dish.price.toFixed(2)}</span>
          <button class="btn-add-dish" onclick="addItemToCart(${dish.id})">
            + Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

function setDietFilter(diet) {
  appState.activeDiet = diet;
  document.querySelectorAll('.diet-btn').forEach(btn => btn.classList.remove('active'));
  const btn = document.getElementById(`filter${diet === 'all' ? 'All' : diet === 'veg' ? 'Veg' : 'NonVeg'}Home`);
  if (btn) btn.classList.add('active');
  renderFeaturedDishes();
}

function setMenuCategory(cat) {
  appState.activeFilter = cat;
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase().includes(cat.toLowerCase()) || (cat === 'all' && btn.textContent.includes('All')));
  });
  renderFullMenu();
}

function filterMenuCatalog() {
  renderFullMenu();
}

function toggleVegOnly(cb) {
  renderFullMenu();
}

function handleHeroSearch(e) {
  if (e.key === 'Enter') searchFromHero();
}

function searchFromHero() {
  const query = (document.getElementById('heroSearchInput')?.value || '').trim();
  switchView('menu');
  const searchInput = document.getElementById('menuSearchInput');
  if (searchInput) {
    searchInput.value = query;
    renderFullMenu();
  }
}

// 3D Tilt Physics on Hero Card
function init3DInteractiveTilt() {
  const scene = document.getElementById('heroScene');
  if (!scene) return;

  scene.addEventListener('mousemove', (e) => {
    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    const mainCard = scene.querySelector('.hero-main-card');
    if (mainCard) {
      mainCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    }
  });

  scene.addEventListener('mouseleave', () => {
    const mainCard = scene.querySelector('.hero-main-card');
    if (mainCard) {
      mainCard.style.transform = `rotateY(-8deg) rotateX(6deg)`;
    }
  });
}

// ==========================================
// 6. CART & BILLING (Key Features #3, #4, #5, #6, #7)
// ==========================================
function addItemToCart(itemId) {
  const dish = appState.menuCatalog.find(d => d.id === itemId);
  if (!dish) return;

  const existing = appState.cart.find(c => c.id === itemId);
  if (existing) {
    existing.quantity++;
  } else {
    appState.cart.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      emoji: dish.emoji,
      restaurant_name: dish.restaurant_name
    });
  }

  refreshCartDisplay();
  showToast(`Added ${dish.name} to cart! 😋`);
}

function changeCartQty(itemId, delta) {
  const item = appState.cart.find(c => c.id === itemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    appState.cart = appState.cart.filter(c => c.id !== itemId);
  }

  refreshCartDisplay();
}

function clearCart() {
  appState.cart = [];
  appState.discountValue = 0;
  appState.activeCouponCode = null;
  refreshCartDisplay();
  showToast("Cart emptied");
}

function setTip(amt) {
  appState.selectedRiderTip = amt;
  document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(amt.toString()));
  });
  refreshCartDisplay();
}

function selectPaymentMethod(radio) {
  appState.selectedPaymentMethod = radio.value;
  document.querySelectorAll('.pay-option').forEach(el => el.classList.remove('active'));
  radio.closest('.pay-option')?.classList.add('active');
}

// Key Feature #5: 5% GST & Key Feature #6: Rs. 40 delivery, free from Rs. 500
function computeOrderTotals() {
  const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = (subtotal === 0 || subtotal >= 500.0) ? 0.0 : 40.0;
  const taxes = subtotal * 0.05; // 5% GST
  const grandTotal = Math.max(0, subtotal + deliveryFee + taxes + appState.selectedRiderTip - appState.discountValue);

  return { subtotal, deliveryFee, taxes, grandTotal };
}

function refreshCartDisplay() {
  const countBadge = document.getElementById('cartBadgeCount');
  const totalItems = appState.cart.reduce((sum, i) => sum + i.quantity, 0);
  if (countBadge) countBadge.textContent = totalItems;

  const listContainer = document.getElementById('cartItemsList');
  if (listContainer) {
    if (appState.cart.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-cart-icon">🛒</div>
          <h3 style="font-size:1.3rem; margin-bottom:6px;">Your cart is empty</h3>
          <p style="color:var(--text-muted); margin-bottom:20px;">Explore dishes from our top restaurants and add them to your cart.</p>
          <button class="btn-hero-action" onclick="switchView('menu')">Browse Food Menu</button>
        </div>
      `;
    } else {
      listContainer.innerHTML = appState.cart.map(item => `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <span class="cart-item-pic">${item.emoji}</span>
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-unit">₹${item.price.toFixed(2)} • ${item.restaurant_name || 'Kitchen'}</div>
            </div>
          </div>
          <div class="cart-item-controls">
            <div class="qty-counter-glass">
              <button class="btn-qty" onclick="changeCartQty(${item.id}, -1)">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="btn-qty" onclick="changeCartQty(${item.id}, 1)">+</button>
            </div>
            <div class="cart-item-sum">₹${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        </div>
      `).join('');
    }
  }

  const { subtotal, deliveryFee, taxes, grandTotal } = computeOrderTotals();
  
  const subEl = document.getElementById('subtotalDisplay');
  const delEl = document.getElementById('deliveryFeeDisplay');
  const taxEl = document.getElementById('taxesDisplay');
  const grandEl = document.getElementById('grandTotalDisplay');
  const freeBadge = document.getElementById('freeDeliveryAlert');
  const discRow = document.getElementById('discountRow');
  const discEl = document.getElementById('discountDisplay');

  if (subEl) subEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (delEl) delEl.textContent = deliveryFee === 0 ? "FREE" : `₹${deliveryFee.toFixed(2)}`;
  if (taxEl) taxEl.textContent = `₹${taxes.toFixed(2)}`;
  if (grandEl) grandEl.textContent = `₹${grandTotal.toFixed(2)}`;

  if (freeBadge) {
    if (subtotal >= 500.0) {
      freeBadge.textContent = "🎉 Free delivery unlocked (Order >= ₹500)!";
      if (freeBadge.style) {
        freeBadge.style.color = "var(--accent)";
        freeBadge.style.background = "rgba(16, 185, 129, 0.12)";
      }
    } else {
      freeBadge.textContent = `💡 Add ₹${(500 - subtotal).toFixed(2)} more for FREE Delivery!`;
      if (freeBadge.style) {
        freeBadge.style.color = "var(--secondary)";
        freeBadge.style.background = "rgba(14, 165, 233, 0.12)";
      }
    }
  }

  if (discRow && discEl) {
    if (appState.discountValue > 0) {
      if (discRow.style) discRow.style.display = "flex";
      discEl.textContent = `-₹${appState.discountValue.toFixed(2)}`;
    } else {
      if (discRow.style) discRow.style.display = "none";
    }
  }
}

// Key Feature #4: Coupons WELCOME50 and SAVE20
function applyPromoCode() {
  const code = (document.getElementById('promoInput')?.value || '').trim().toUpperCase();
  const feedback = document.getElementById('promoFeedback');
  const { subtotal } = computeOrderTotals();

  if (subtotal === 0) {
    if (feedback) {
      feedback.textContent = "Add dishes first before applying promo code.";
      feedback.className = "promo-feedback error";
    }
    return;
  }

  if (code === "WELCOME50") {
    // 50% discount up to ₹150
    appState.discountValue = Math.min(150, subtotal * 0.50);
    appState.activeCouponCode = code;
    if (feedback) {
      feedback.textContent = `Promo WELCOME50 applied! 50% Off (Saved ₹${appState.discountValue.toFixed(2)}) 🎉`;
      feedback.className = "promo-feedback success";
    }
    refreshCartDisplay();
  } else if (code === "SAVE20") {
    // 20% discount up to ₹200
    appState.discountValue = Math.min(200, subtotal * 0.20);
    appState.activeCouponCode = code;
    if (feedback) {
      feedback.textContent = `Promo SAVE20 applied! 20% Off (Saved ₹${appState.discountValue.toFixed(2)}) 🎉`;
      feedback.className = "promo-feedback success";
    }
    refreshCartDisplay();
  } else {
    if (feedback) {
      feedback.textContent = "Invalid code. Use WELCOME50 (50% Off) or SAVE20 (20% Off)";
      feedback.className = "promo-feedback error";
    }
  }
}

// ==========================================
// 7. CHECKOUT & ORDER CREATION (Key Feature #8 & #11)
// ==========================================
async function executeCheckout() {
  if (appState.cart.length === 0) {
    alert("Please add food items to your cart before placing an order!");
    return;
  }

  const name = document.getElementById('checkoutName')?.value || appState.currentUser?.name || "Rahul Sharma";
  const phone = document.getElementById('checkoutPhone')?.value || "+91 98765 43210";
  const address = document.getElementById('checkoutAddress')?.value || "Flat 402, Green View Apartments, Sector 4";

  const { subtotal, deliveryFee, taxes, grandTotal } = computeOrderTotals();
  const orderNumber = `FD-${1000 + (appState.ordersHistory.length + 2)}`;
  const now = new Date();
  const createdDate = getFormattedReceiptDate(now);

  const orderRecord = {
    order_id: orderNumber,
    customer_name: name,
    customer_phone: phone,
    delivery_address: address,
    restaurant_name: appState.cart[0]?.restaurant_name || "Pizza Palace",
    payment_method: appState.selectedPaymentMethod,
    items: [...appState.cart],
    subtotal: subtotal,
    discount: appState.discountValue || 0,
    delivery_fee: deliveryFee,
    tax: taxes,
    tip: appState.selectedRiderTip,
    grand_total: grandTotal,
    status: "Placed",
    rider_name: "Vikram Singh",
    rider_vehicle: "Honda Activa 6G • White (MP-07-CB-4210)",
    rider_rating: 4.9,
    pickup_lat: 26.2307,
    pickup_lon: 78.2173,
    dropoff_lat: 26.2183,
    dropoff_lon: 78.1828,
    rider_lat: 26.2307,
    rider_lon: 78.2173,
    created_at: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    created_date: createdDate,
    speed_kmh: 28
  };

  // POST to server (logs to orders.txt & SQLite)
  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderRecord)
    });
  } catch (e) {
    console.log("Logged order locally");
  }

  appState.activeOrder = orderRecord;
  appState.ordersHistory.unshift(orderRecord);
  appState.viewingReceiptOrder = orderRecord;
  saveStoredState();

  // Populate Modal Receipt in Exact Terminal Format
  const receipt = document.getElementById('modalReceiptDetails');
  if (receipt) {
    receipt.innerHTML = renderTerminalReceipt(orderRecord);
  }

  document.getElementById('checkoutSuccessModal')?.classList.add('active');

  // Clear cart
  appState.cart = [];
  appState.discountValue = 0;
  appState.activeCouponCode = null;
  refreshCartDisplay();
  renderOrderHistory();
  refreshAdminDashboard();
}

function getFormattedReceiptDate(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const mins = pad(d.getMinutes());
  return `${day}-${month}-${year} ${hours}:${mins}`;
}

function renderTerminalReceipt(ord) {
  if (!ord) return '';
  const cleanId = ord.order_id ? ord.order_id.replace(/^FD-/, '') : '1001';
  const dateStr = ord.created_date || getFormattedReceiptDate();
  const subtotalVal = (ord.subtotal || 0).toFixed(2);
  const discountVal = (ord.discount || 0).toFixed(2);
  const taxVal = (ord.tax || (ord.subtotal * 0.05) || 0).toFixed(2);
  const deliveryVal = (ord.delivery_fee !== undefined ? ord.delivery_fee : 0).toFixed(2);
  const totalVal = (ord.grand_total || 0).toFixed(2);
  const restName = ord.restaurant_name || "Pizza Palace";
  const custName = ord.customer_name || "suraj";
  const addr = ord.delivery_address || "mits gwalior";
  const payMethod = ord.payment_method || "COD";
  const statusStr = ord.status || "Placed";

  const itemsHtml = (ord.items || []).map(item => {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    return `
      <div class="rcpt-row">
        <span class="rcpt-col-name">${item.name}</span>
        <span class="rcpt-col-qty">x${item.quantity}</span>
        <span class="rcpt-col-price">Rs.${itemTotal}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="rcpt-terminal-text">
      <div class="rcpt-title">*** ORDER PLACED SUCCESSFULLY ***</div>
      <div class="rcpt-sep-double">======================================</div>
      <div class="rcpt-meta">
        <div class="rcpt-row-split">
          <span>ORDER #${cleanId}</span>
          <span>${dateStr}</span>
        </div>
        <div>Restaurant: ${restName}</div>
        <div>Customer  : ${custName}</div>
        <div>Address   : ${addr}</div>
      </div>
      <div class="rcpt-sep-dash">--------------------------------------</div>
      <div class="rcpt-items-list">
        ${itemsHtml}
      </div>
      <div class="rcpt-sep-dash">--------------------------------------</div>
      <div class="rcpt-calc">
        <div class="rcpt-row-calc"><span>Subtotal :</span> <span>Rs.${subtotalVal}</span></div>
        <div class="rcpt-row-calc"><span>Discount :</span> <span>-Rs.${discountVal}</span></div>
        <div class="rcpt-row-calc"><span>GST (5%) :</span> <span>Rs.${taxVal}</span></div>
        <div class="rcpt-row-calc"><span>Delivery :</span> <span>Rs.${deliveryVal}</span></div>
        <div class="rcpt-row-calc rcpt-total-highlight"><span>TOTAL    :</span> <span>Rs.${totalVal}</span></div>
        <div class="rcpt-row-calc"><span>Paid via :</span> <span>${payMethod}</span></div>
        <div class="rcpt-row-calc"><span>STATUS   :</span> <span>${statusStr}</span></div>
      </div>
      <div class="rcpt-sep-double">======================================</div>
    </div>
  `;
}

function openOrderReceipt(orderId) {
  const ord = appState.ordersHistory.find(o => o.order_id === orderId) || (appState.activeOrder.order_id === orderId ? appState.activeOrder : null);
  if (!ord) return;

  appState.viewingReceiptOrder = ord;
  const receipt = document.getElementById('modalReceiptDetails');
  if (receipt) {
    receipt.innerHTML = renderTerminalReceipt(ord);
  }
  document.getElementById('checkoutSuccessModal')?.classList.add('active');
}

function closeReceiptModal() {
  document.getElementById('checkoutSuccessModal')?.classList.remove('active');
}

function printReceipt() {
  window.print();
}

function downloadReceiptTxt() {
  const ord = appState.viewingReceiptOrder || appState.activeOrder;
  if (!ord) return;

  const cleanId = ord.order_id ? ord.order_id.replace(/^FD-/, '') : '1001';
  const dateStr = ord.created_date || getFormattedReceiptDate();
  const subtotalVal = (ord.subtotal || 0).toFixed(2);
  const discountVal = (ord.discount || 0).toFixed(2);
  const taxVal = (ord.tax || (ord.subtotal * 0.05) || 0).toFixed(2);
  const deliveryVal = (ord.delivery_fee !== undefined ? ord.delivery_fee : 0).toFixed(2);
  const totalVal = (ord.grand_total || 0).toFixed(2);

  const itemsTxt = (ord.items || []).map(i => {
    const namePad = i.name.padEnd(20, ' ').substring(0, 20);
    const qtyPad = `x${i.quantity}`.padStart(4, ' ');
    const pricePad = `Rs.${(i.price * i.quantity).toFixed(2)}`.padStart(12, ' ');
    return `${namePad} ${qtyPad} ${pricePad}`;
  }).join('\n');

  const textContent = `*** ORDER PLACED SUCCESSFULLY ***
======================================
ORDER #${cleanId}   ${dateStr}
Restaurant: ${ord.restaurant_name || 'Pizza Palace'}
Customer  : ${ord.customer_name || 'suraj'}
Address   : ${ord.delivery_address || 'mits gwalior'}
--------------------------------------
${itemsTxt}
--------------------------------------
Subtotal : Rs.${subtotalVal}
Discount : -Rs.${discountVal}
GST (5%) : Rs.${taxVal}
Delivery : Rs.${deliveryVal}
TOTAL    : Rs.${totalVal}
Paid via : ${ord.payment_method || 'COD'}
STATUS   : ${ord.status || 'Placed'}
======================================
`;

  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CravePulse_Receipt_${cleanId}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function closeModalAndTrack() {
  document.getElementById('checkoutSuccessModal')?.classList.remove('active');
  switchView('tracking');
  updateLiveTrackingTelemetry();
}

// ==========================================
// 8. SATELLITE & 3D EARTH GPS TRACKING
// ==========================================

// Helper: Lat/Long to 3D Cartesian coordinates on sphere
function latLonToVector3(lat, lon, radius = 100) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Initialize Leaflet Map with Photorealistic Esri Satellite Imagery + Hybrid Street Labels
function initLiveTrackingMap() {
  const mapElement = document.getElementById('liveTrackingMap');
  if (!mapElement || typeof L === 'undefined') return;

  try {
    const ord = appState.activeOrder;
    appState.leafletMap = L.map('liveTrackingMap', {
      zoomControl: true,
      attributionControl: false
    }).setView([ord.rider_lat, ord.rider_lon], 15);

    // 1. High-Res Satellite Base Layer (Esri World Imagery)
    const satImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // 2. High-Res Street & Neighborhood Labels Overlay
    const satLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // 3. High-Res Road & Highway Network Overlay
    const satRoads = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    });

    // Combined Satellite Hybrid Layer Group
    appState.satelliteLayerGroup = L.layerGroup([satImagery, satRoads, satLabels]);

    // Detailed OpenStreetMap Street Layer
    appState.streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    });

    // Add Satellite Layer by default
    appState.satelliteLayerGroup.addTo(appState.leafletMap);

    // Custom Map Icons
    const kitchenIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="background:#0ea5e9; color:#fff; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; box-shadow:0 0 15px #0ea5e9; border:2px solid #fff;">🏪</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const customerIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="background:#10b981; color:#fff; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.3rem; box-shadow:0 0 15px #10b981; border:2px solid #fff;">🏠</div>`,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const riderIcon = L.divIcon({
      className: 'custom-map-icon',
      html: `<div style="background:#ff4b2b; color:#fff; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem; box-shadow:0 0 20px #ff4b2b; border:3px solid #fff;">🛵</div>`,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    appState.mapMarkers.kitchen = L.marker([ord.pickup_lat, ord.pickup_lon], { icon: kitchenIcon })
      .addTo(appState.leafletMap)
      .bindPopup(`<b>${ord.restaurant_name}</b><br>Pickup Kitchen`);

    appState.mapMarkers.customer = L.marker([ord.dropoff_lat, ord.dropoff_lon], { icon: customerIcon })
      .addTo(appState.leafletMap)
      .bindPopup(`<b>${ord.customer_name}</b><br>${ord.delivery_address}`);

    appState.mapMarkers.rider = L.marker([ord.rider_lat, ord.rider_lon], { icon: riderIcon })
      .addTo(appState.leafletMap)
      .bindPopup(`<b>Rider ${ord.rider_name}</b><br>En route on street`);

    // Route polyline with high-contrast neon styling
    appState.mapMarkers.route = L.polyline([
      [ord.pickup_lat, ord.pickup_lon],
      [ord.rider_lat, ord.rider_lon],
      [ord.dropoff_lat, ord.dropoff_lon]
    ], {
      color: '#ff4b2b',
      weight: 5,
      opacity: 0.9,
      dashArray: '8, 8'
    }).addTo(appState.leafletMap);

  } catch (err) {
    console.warn("Leaflet Map setup notice:", err);
  }
}

// 3-Way Mode Switcher: 'satellite', 'street', or 'globe'
function switchMapMode(mode) {
  appState.mapMode = mode;
  const globeContainer = document.getElementById('earthGlobeContainer');
  const streetContainer = document.getElementById('liveTrackingMap');
  const btnSat = document.getElementById('btnViewSatellite');
  const btnStreet = document.getElementById('btnViewStreet');
  const btnGlobe = document.getElementById('btnViewGlobe');

  // Toggle button styling
  btnSat?.classList.toggle('active', mode === 'satellite');
  btnStreet?.classList.toggle('active', mode === 'street');
  btnGlobe?.classList.toggle('active', mode === 'globe');

  if (mode === 'globe') {
    if (globeContainer) globeContainer.style.display = 'block';
    if (streetContainer) streetContainer.style.display = 'none';
    onEarthResize();
    showToast("Switched to 3D Earth Globe view");
  } else {
    if (globeContainer) globeContainer.style.display = 'none';
    if (streetContainer) streetContainer.style.display = 'block';

    if (appState.leafletMap) {
      if (mode === 'satellite') {
        if (appState.streetLayer) appState.leafletMap.removeLayer(appState.streetLayer);
        if (appState.satelliteLayerGroup) appState.satelliteLayerGroup.addTo(appState.leafletMap);
        showToast("🛰️ Photorealistic Satellite & Street View active");
      } else {
        if (appState.satelliteLayerGroup) appState.leafletMap.removeLayer(appState.satelliteLayerGroup);
        if (appState.streetLayer) appState.streetLayer.addTo(appState.leafletMap);
        showToast("🗺️ Detailed Street Map active");
      }
      appState.leafletMap.invalidateSize();
    }
  }
}

// Center map view on Rider
function zoomToRiderLocation() {
  const ord = appState.activeOrder;
  if (appState.mapMode === 'globe') {
    zoomEarthToLocation();
  } else if (appState.leafletMap) {
    appState.leafletMap.flyTo([ord.rider_lat, ord.rider_lon], 17, { duration: 1.2 });
    showToast("🎯 Centered camera on Rider's street coordinates");
  }
}

// 3D Earth Globe with Solar System Environment
function init3DEarthGlobe() {
  const container = document.getElementById('earthGlobeContainer');
  if (!container || typeof THREE === 'undefined') return;

  try {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    appState.earthScene = new THREE.Scene();
    appState.earthCamera = new THREE.PerspectiveCamera(45, width / height, 1, 4000);
    appState.earthCamera.position.set(0, 80, 320);

    appState.earthRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    appState.earthRenderer.setPixelRatio(window.devicePixelRatio);
    appState.earthRenderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(appState.earthRenderer.domElement);

    // Re-append overlay
    const overlay = document.createElement('div');
    overlay.className = 'globe-overlay-hint';
    overlay.innerHTML = `
      <span>🖱️ Drag to rotate 3D Earth • Scroll wheel to zoom in/out</span>
      <span id="globeCoordBadge" class="coord-badge">📍 26.2245° N, 78.2091° E</span>
    `;
    container.appendChild(overlay);

    // Lights
    appState.earthScene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(400, 250, 400);
    appState.earthScene.add(sunLight);

    // Starfield in deep space
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(1800 * 3);
    for (let i = 0; i < 1800 * 3; i += 3) {
      const rad = 800 + Math.random() * 1200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      starPos[i] = rad * Math.sin(phi) * Math.cos(theta);
      starPos[i + 1] = rad * Math.sin(phi) * Math.sin(theta);
      starPos[i + 2] = rad * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    appState.earthScene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, transparent: true, opacity: 0.85 })));

    // Earth Sphere
    const earthRadius = 100;
    const globeMat = new THREE.MeshStandardMaterial({
      map: generateProceduralEarthTexture(),
      roughness: 0.75,
      metalness: 0.15
    });
    appState.earthGlobe = new THREE.Mesh(new THREE.SphereGeometry(earthRadius, 64, 64), globeMat);
    appState.earthScene.add(appState.earthGlobe);

    // Atmosphere halo
    appState.earthScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(earthRadius + 3.5, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.18, side: THREE.BackSide })
    ));

    // OrbitControls
    if (typeof THREE.OrbitControls !== 'undefined') {
      appState.earthControls = new THREE.OrbitControls(appState.earthCamera, appState.earthRenderer.domElement);
      appState.earthControls.enableDamping = true;
      appState.earthControls.dampingFactor = 0.05;
      appState.earthControls.minDistance = 112;
      appState.earthControls.maxDistance = 850;
    }

    // 3D Markers Group
    appState.earthMarkersGroup = new THREE.Group();
    appState.earthScene.add(appState.earthMarkersGroup);
    build3DEarthMarkers();

    // Render loop
    function animate() {
      requestAnimationFrame(animate);
      if (appState.earthControls) appState.earthControls.update();
      if (appState.cameraFlyTarget) {
        appState.earthCamera.position.lerp(appState.cameraFlyTarget, 0.06);
        if (appState.earthCamera.position.distanceTo(appState.cameraFlyTarget) < 1.5) {
          appState.cameraFlyTarget = null;
        }
      }
      appState.earthRenderer.render(appState.earthScene, appState.earthCamera);
    }
    animate();

    window.addEventListener('resize', onEarthResize);
  } catch (err) {
    console.warn("3D Earth notice:", err);
  }
}

function generateProceduralEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Oceans
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#061325');
  grad.addColorStop(0.5, '#0a1e3f');
  grad.addColorStop(1, '#051122');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Graticules
  ctx.strokeStyle = 'rgba(14, 165, 233, 0.18)';
  ctx.lineWidth = 1.2;
  for (let x = 0; x < canvas.width; x += canvas.width / 24) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += canvas.height / 12) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  // India & Continents
  ctx.fillStyle = '#1e3a2f';
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3;

  function drawCont(pts) {
    ctx.beginPath();
    pts.forEach((pt, i) => {
      const px = (pt[0] / 360 + 0.5) * canvas.width;
      const py = (0.5 - pt[1] / 180) * canvas.height;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  drawCont([[68, 24], [72, 30], [77, 35], [82, 30], [88, 26], [92, 22], [88, 16], [82, 12], [80, 8], [77, 8], [73, 15], [70, 20]]);
  drawCont([[-10, 36], [0, 44], [15, 55], [30, 68], [60, 72], [100, 75], [140, 70], [170, 65], [145, 45], [125, 32], [115, 22], [105, 10], [100, 15], [90, 24], [80, 32], [60, 25], [50, 30], [35, 32], [25, 38], [10, 38], [-5, 36]]);

  // Night City Lights
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 400; i++) {
    const lon = (Math.random() * 20 + 68);
    const lat = (Math.random() * 18 + 12);
    ctx.beginPath();
    ctx.arc((lon / 360 + 0.5) * canvas.width, (0.5 - lat / 180) * canvas.height, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function build3DEarthMarkers() {
  if (!appState.earthMarkersGroup) return;
  const ord = appState.activeOrder;
  const radius = 100.5;

  const kitchenPos = latLonToVector3(ord.pickup_lat, ord.pickup_lon, radius);
  const custPos = latLonToVector3(ord.dropoff_lat, ord.dropoff_lon, radius);
  const riderPos = latLonToVector3(ord.rider_lat, ord.rider_lon, radius);

  // Kitchen Pin
  const kMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0x0ea5e9 }));
  kMesh.position.copy(kitchenPos);
  appState.earthMarkersGroup.add(kMesh);

  // Customer Pin
  const cMesh = new THREE.Mesh(new THREE.SphereGeometry(2.5, 16, 16), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
  cMesh.position.copy(custPos);
  appState.earthMarkersGroup.add(cMesh);

  // Rider Pin
  const rMesh = new THREE.Mesh(new THREE.SphereGeometry(3.0, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff4b2b }));
  rMesh.position.copy(riderPos);
  appState.earthRiderMarker = rMesh;
  appState.earthMarkersGroup.add(rMesh);

  // 3D Arc
  const midPoint = kitchenPos.clone().lerp(custPos, 0.5).normalize().multiplyScalar(radius + 12);
  const curve = new THREE.QuadraticBezierCurve3(kitchenPos, midPoint, custPos);
  const arcGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(32));
  appState.earthMarkersGroup.add(new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0xff4b2b, linewidth: 3 })));
}

function zoomEarthToLocation() {
  const ord = appState.activeOrder;
  appState.cameraFlyTarget = latLonToVector3(ord.rider_lat, ord.rider_lon, 145);
  showToast("🚀 Zooming into Rider in 3D!");
}

function onEarthResize() {
  const container = document.getElementById('earthGlobeContainer');
  if (!container || !appState.earthRenderer || !appState.earthCamera) return;
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 520;
  appState.earthCamera.aspect = width / height;
  appState.earthCamera.updateProjectionMatrix();
  appState.earthRenderer.setSize(width, height);
}

// Telemetry & Marker Updates
function updateLiveTrackingTelemetry() {
  const ord = appState.activeOrder;
  if (!ord) return;

  const distance = computeHaversineDistance(ord.rider_lat, ord.rider_lon, ord.dropoff_lat, ord.dropoff_lon);
  const eta = computeETA(distance, ord.speed_kmh);

  const ordId = document.getElementById('trackerOrderId');
  const statText = document.getElementById('trackerStatusText');
  const ts = document.getElementById('trackerTimestamp');
  const etaEl = document.getElementById('liveEtaDisplay');
  const distEl = document.getElementById('liveDistanceDisplay');
  const heroEta = document.getElementById('heroLiveEta');
  const tDist = document.getElementById('telemetryDistance');
  const tEta = document.getElementById('telemetryEta');

  if (ordId) ordId.textContent = `Order #${ord.order_id}`;
  if (statText) statText.textContent = ord.status;
  if (ts) ts.textContent = `Placed at ${ord.created_at} • Expected in ${eta} mins`;
  if (etaEl) etaEl.textContent = eta;
  if (distEl) distEl.textContent = distance;
  if (heroEta) heroEta.textContent = `${eta} MINS`;
  if (tDist) tDist.textContent = `${distance} km`;
  if (tEta) tEta.textContent = `~${eta} mins`;

  const coordBadge = document.getElementById('globeCoordBadge');
  if (coordBadge) coordBadge.textContent = `📍 Rider: ${ord.rider_lat.toFixed(4)}° N, ${ord.rider_lon.toFixed(4)}° E`;

  // Update Stepper Pipeline
  const STAGES = ["Placed", "Confirmed", "Preparing", "Picked Up", "Out for Delivery", "Delivered"];
  const currentIdx = STAGES.indexOf(ord.status);

  STAGES.forEach((stage, idx) => {
    const node = document.getElementById(`stepNode-${stage}`);
    if (node) {
      node.classList.remove('active', 'completed');
      if (idx < currentIdx) node.classList.add('completed');
      else if (idx === currentIdx) node.classList.add('active');
    }
  });

  for (let i = 1; i <= 5; i++) {
    const line = document.getElementById(`stepLine-${i}`);
    if (line) {
      line.classList.toggle('completed', (i - 1) < currentIdx);
    }
  }

  // Update Manifest
  const manifestList = document.getElementById('manifestItemsList');
  const manifestCount = document.getElementById('manifestCount');
  const manifestTotal = document.getElementById('manifestTotal');
  if (manifestList) {
    manifestList.innerHTML = ord.items.map(i => `
      <div style="display:flex; justify-content:space-between">
        <span>${i.name} <strong>x${i.quantity}</strong></span>
        <span>₹${(i.price * i.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }
  if (manifestCount) manifestCount.textContent = ord.items.reduce((s, i) => s + i.quantity, 0);
  if (manifestTotal) manifestTotal.textContent = `₹${ord.grand_total.toFixed(2)}`;

  // Update 3D Earth Marker
  if (appState.earthRiderMarker) {
    appState.earthRiderMarker.position.copy(latLonToVector3(ord.rider_lat, ord.rider_lon, 100.5));
  }

  // Update Leaflet marker coordinates
  if (appState.leafletMap && appState.mapMarkers.rider) {
    appState.mapMarkers.rider.setLatLng([ord.rider_lat, ord.rider_lon]);
    if (appState.mapMarkers.route) {
      appState.mapMarkers.route.setLatLngs([
        [ord.pickup_lat, ord.pickup_lon],
        [ord.rider_lat, ord.rider_lon],
        [ord.dropoff_lat, ord.dropoff_lon]
      ]);
    }
  }
}

function simulateDriverStep() {
  const ord = appState.activeOrder;
  if (!ord) return;

  const latDelta = (ord.dropoff_lat - ord.rider_lat) * 0.22;
  const lonDelta = (ord.dropoff_lon - ord.rider_lon) * 0.22;

  ord.rider_lat += latDelta;
  ord.rider_lon += lonDelta;

  const rem = computeHaversineDistance(ord.rider_lat, ord.rider_lon, ord.dropoff_lat, ord.dropoff_lon);

  if (rem < 0.25) {
    ord.status = "Delivered";
    showToast("🎉 Order Delivered to your doorstep!");
    if (appState.autoMoveTimer) toggleAutoMove();
  } else if (ord.status !== "Out for Delivery") {
    ord.status = "Out for Delivery";
  }

  updateLiveTrackingTelemetry();
  renderOrderHistory();
  showToast(`🛵 Rider moved along street. Remaining: ${rem} km`);
}

function toggleAutoMove() {
  const btn = document.getElementById('autoSimulationBtn');
  if (appState.autoMoveTimer) {
    clearInterval(appState.autoMoveTimer);
    appState.autoMoveTimer = null;
    if (btn) {
      btn.textContent = "Auto GPS: OFF";
      btn.classList.remove('highlight');
    }
  } else {
    appState.autoMoveTimer = setInterval(simulateDriverStep, 2600);
    if (btn) {
      btn.textContent = "Auto GPS: ON (2.6s)";
      btn.classList.add('highlight');
    }
    showToast("Live GPS satellite stream started");
  }
}

function advanceOrderStatus(newStatus) {
  if (!appState.activeOrder) return;
  appState.activeOrder.status = newStatus;
  updateLiveTrackingTelemetry();
  renderOrderHistory();
  showToast(`Order status updated to "${newStatus}"`);
}

function triggerCallDriver() {
  alert(`Calling Rider ${appState.activeOrder.rider_name} at +91 98765 12345...`);
}

function triggerChatDriver() {
  const msg = prompt(`Send a message to ${appState.activeOrder.rider_name}:`, "Please ring the bell upon arrival.");
  if (msg) showToast("Message sent to rider!");
}

// ==========================================
// 9. ORDER HISTORY & CANCELLATION (Key Feature #8)
// ==========================================
function renderOrderHistory() {
  const container = document.getElementById('orderHistoryContainer');
  if (!container) return;

  const allOrders = appState.ordersHistory.length > 0 ? appState.ordersHistory : [appState.activeOrder];

  container.innerHTML = allOrders.map(ord => {
    const isCancelled = ord.status === 'Cancelled';
    const isDelivered = ord.status === 'Delivered';
    const canCancel = !isCancelled && !isDelivered;

    return `
      <div class="history-card">
        <div class="hist-head">
          <div>
            <span class="hist-id">${ord.order_id}</span>
            <div class="hist-rest">Restaurant: <strong>${ord.restaurant_name}</strong> • ${ord.created_at}</div>
          </div>
          <span class="status-chip ${isCancelled ? 'cancelled' : ''}">${ord.status}</span>
        </div>
        <div class="hist-items">
          ${ord.items.map(i => `<div>• ${i.name} <strong>x${i.quantity}</strong> (₹${(i.price * i.quantity).toFixed(2)})</div>`).join('')}
        </div>
        <div class="hist-footer">
          <div>
            <span class="hist-total">₹${ord.grand_total.toFixed(2)}</span>
            <small style="margin-left:8px; color:var(--text-muted)">Payment: ${ord.payment_method}</small>
          </div>
          <div class="hist-actions">
            <button class="btn-map-control" onclick="openOrderReceipt('${ord.order_id}')">Receipt 🧾</button>
            ${canCancel ? `<button class="btn-cancel-order" onclick="cancelOrder('${ord.order_id}')">Cancel Order ✕</button>` : ''}
            <button class="btn-map-control highlight" onclick="trackSpecificOrder('${ord.order_id}')">Track on Satellite ➔</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function cancelOrder(orderId) {
  if (!confirm(`Are you sure you want to cancel Order ${orderId}?`)) return;

  // Sync with server API
  try {
    await fetch(`/api/orders/${orderId}/cancel`, { method: 'PATCH' });
  } catch(e) {}

  const ord = appState.ordersHistory.find(o => o.order_id === orderId) || (appState.activeOrder.order_id === orderId ? appState.activeOrder : null);
  if (ord) {
    ord.status = 'Cancelled';
  }
  if (appState.activeOrder.order_id === orderId) {
    appState.activeOrder.status = 'Cancelled';
  }

  saveStoredState();
  renderOrderHistory();
  updateLiveTrackingTelemetry();
  refreshAdminDashboard();
  showToast(`Order ${orderId} has been Cancelled.`);
}

function trackSpecificOrder(orderId) {
  const found = appState.ordersHistory.find(o => o.order_id === orderId) || appState.activeOrder;
  if (found) {
    appState.activeOrder = found;
    switchView('tracking');
    updateLiveTrackingTelemetry();
    zoomToRiderLocation();
  }
}

// ==========================================
// 10. ADMIN PORTAL & REVENUE REPORTS (Key Features #9 & #10)
// ==========================================
function switchAdminTab(tabName) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));

  const targetSec = document.getElementById(`admin-sec-${tabName}`);
  if (targetSec) targetSec.classList.add('active');

  const buttons = document.querySelectorAll('.admin-tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabName)) {
      btn.classList.add('active');
    }
  });

  if (tabName === 'revenue') renderRevenueReport();
  if (tabName === 'restaurants') renderAdminRestaurants();
  if (tabName === 'menu') renderAdminMenu();
  if (tabName === 'orders') renderAdminOrders();
}

function refreshAdminDashboard() {
  renderRevenueReport();
  renderAdminRestaurants();
  renderAdminMenu();
  renderAdminOrders();
}

// Key Feature #10: Basic Revenue Report
function renderRevenueReport() {
  const allOrders = appState.ordersHistory.length > 0 ? appState.ordersHistory : [appState.activeOrder];
  const activeOrders = allOrders.filter(o => o.status !== 'Cancelled');
  const totalSales = activeOrders.reduce((sum, o) => sum + o.grand_total, 0);
  const deliveredCount = allOrders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = allOrders.filter(o => o.status === 'Cancelled').length;
  const avgOrder = activeOrders.length > 0 ? (totalSales / activeOrders.length) : 0;

  const totalSalesEl = document.getElementById('revTotalSales');
  const totalOrdersEl = document.getElementById('revTotalOrders');
  const compCountEl = document.getElementById('revCompletedCount');
  const avgTicketEl = document.getElementById('revAvgTicket');

  if (totalSalesEl) totalSalesEl.textContent = `₹${totalSales.toFixed(2)}`;
  if (totalOrdersEl) totalOrdersEl.textContent = `${allOrders.length} Orders`;
  if (compCountEl) compCountEl.textContent = `${deliveredCount} Delivered • ${cancelledCount} Cancelled`;
  if (avgTicketEl) avgTicketEl.textContent = `₹${avgOrder.toFixed(2)}`;

  // Payment Breakdown
  const breakdown = {
    "Cash on Delivery (COD)": 0,
    "UPI (Instant)": 0,
    "Credit / Debit Card": 0
  };

  activeOrders.forEach(o => {
    if (o.payment_method.includes("UPI")) breakdown["UPI (Instant)"] += o.grand_total;
    else if (o.payment_method.includes("Card")) breakdown["Credit / Debit Card"] += o.grand_total;
    else breakdown["Cash on Delivery (COD)"] += o.grand_total;
  });

  const barsContainer = document.getElementById('revenuePaymentBars');
  if (barsContainer) {
    barsContainer.innerHTML = Object.entries(breakdown).map(([method, amount]) => {
      const pct = totalSales > 0 ? Math.round((amount / totalSales) * 100) : 0;
      return `
        <div class="pay-bar-item">
          <div class="pbi-meta">
            <span>${method}</span>
            <span>₹${amount.toFixed(2)} (${pct}%)</span>
          </div>
          <div class="pbi-track">
            <div class="pbi-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Key Feature #9: Admin Restaurants Management
function renderAdminRestaurants() {
  const tbody = document.getElementById('adminRestaurantsTable');
  if (!tbody) return;

  tbody.innerHTML = appState.restaurantsCatalog.map(r => `
    <tr>
      <td>#${r.id}</td>
      <td><strong>${r.emoji} ${r.name}</strong></td>
      <td>${r.cuisine}</td>
      <td>${r.delivery_time}</td>
      <td>★ ${r.rating}</td>
    </tr>
  `).join('');
}

function adminAddRestaurant() {
  const name = (document.getElementById('newRestName')?.value || '').trim();
  const cuisine = (document.getElementById('newRestCuisine')?.value || '').trim();
  const time = (document.getElementById('newRestTime')?.value || '20-25 min').trim();
  const address = (document.getElementById('newRestAddress')?.value || 'City Center').trim();

  if (!name || !cuisine) {
    alert("Please enter restaurant name and cuisine");
    return;
  }

  const newRest = {
    id: appState.restaurantsCatalog.length + 1,
    name,
    cuisine,
    rating: 4.8,
    delivery_time: time,
    address,
    emoji: "🏪"
  };

  appState.restaurantsCatalog.push(newRest);
  saveStoredState();
  renderRestaurants();
  renderAdminRestaurants();
  showToast(`Restaurant "${name}" added successfully!`);

  // Reset fields
  document.getElementById('newRestName').value = '';
  document.getElementById('newRestCuisine').value = '';
}

// Key Feature #9: Admin Menu Items & Price Modification
function renderAdminMenu() {
  const tbody = document.getElementById('adminMenuTable');
  if (!tbody) return;

  tbody.innerHTML = appState.menuCatalog.map(item => `
    <tr>
      <td>${item.emoji} <strong>${item.name}</strong><br><small style="color:var(--text-muted)">${item.restaurant_name || ''}</small></td>
      <td>${item.category}</td>
      <td>
        <input type="number" id="priceInput_${item.id}" value="${item.price}" class="price-edit-input">
      </td>
      <td>
        <button class="btn-update-price" onclick="adminUpdatePrice(${item.id})">Update</button>
      </td>
    </tr>
  `).join('');
}

function adminUpdatePrice(itemId) {
  const input = document.getElementById(`priceInput_${itemId}`);
  if (!input) return;

  const newPrice = parseFloat(input.value);
  if (isNaN(newPrice) || newPrice <= 0) {
    alert("Enter a valid price greater than 0");
    return;
  }

  const item = appState.menuCatalog.find(d => d.id === itemId);
  if (item) {
    item.price = newPrice;
    saveStoredState();
    renderFullMenu();
    renderFeaturedDishes();
    showToast(`Price for "${item.name}" updated to ₹${newPrice.toFixed(2)}`);
  }
}

function adminAddMenuItem() {
  const restId = parseInt(document.getElementById('newDishRestaurant')?.value || 1);
  const name = (document.getElementById('newDishName')?.value || '').trim();
  const cat = document.getElementById('newDishCategory')?.value || 'Main Course';
  const price = parseFloat(document.getElementById('newDishPrice')?.value || 199);
  const isVeg = document.getElementById('newDishDiet')?.value === '1';

  if (!name || isNaN(price)) {
    alert("Please provide dish name and valid price");
    return;
  }

  const rest = appState.restaurantsCatalog.find(r => r.id === restId);
  const newDish = {
    id: appState.menuCatalog.length + 1,
    restaurant_id: restId,
    restaurant_name: rest ? rest.name : "Kitchen Hub",
    name,
    category: cat,
    price,
    desc: "Fresh chef recipe prepared with gourmet ingredients",
    veg: isVeg,
    rating: 4.8,
    time: "20 mins",
    emoji: isVeg ? "🥗" : "🍗"
  };

  appState.menuCatalog.push(newDish);
  saveStoredState();
  renderFullMenu();
  renderAdminMenu();
  showToast(`Dish "${name}" added to menu!`);

  document.getElementById('newDishName').value = '';
  document.getElementById('newDishPrice').value = '';
}

// Key Feature #9: Admin Order Status Updates
function renderAdminOrders() {
  const tbody = document.getElementById('adminOrdersTable');
  if (!tbody) return;

  const allOrders = appState.ordersHistory.length > 0 ? appState.ordersHistory : [appState.activeOrder];

  tbody.innerHTML = allOrders.map(ord => `
    <tr>
      <td><strong>${ord.order_id}</strong></td>
      <td>${ord.customer_name}<br><small>${ord.customer_phone}</small></td>
      <td>${ord.items.map(i => `${i.name} (${i.quantity})`).join(', ')}</td>
      <td><strong>₹${ord.grand_total.toFixed(2)}</strong></td>
      <td>${ord.payment_method}</td>
      <td><span class="status-chip ${ord.status === 'Cancelled' ? 'cancelled' : ''}">${ord.status}</span></td>
      <td>
        <select class="admin-select" style="padding:4px 8px; font-size:0.8rem; width:130px;" onchange="adminChangeOrderStatus('${ord.order_id}', this.value)">
          <option value="">Change Status...</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Preparing">Preparing</option>
          <option value="Picked Up">Picked Up</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancel Order</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function adminChangeOrderStatus(orderId, newStatus) {
  if (!newStatus) return;
  const ord = appState.ordersHistory.find(o => o.order_id === orderId) || (appState.activeOrder.order_id === orderId ? appState.activeOrder : null);
  if (ord) {
    ord.status = newStatus;
  }
  if (appState.activeOrder.order_id === orderId) {
    appState.activeOrder.status = newStatus;
  }
  saveStoredState();
  renderAdminOrders();
  renderOrderHistory();
  updateLiveTrackingTelemetry();
  refreshAdminDashboard();
  showToast(`Order ${orderId} status set to "${newStatus}"`);
}

// ==========================================
// 11. TOAST NOTIFICATIONS & PERSISTENCE (Key Feature #11)
// ==========================================
function showToast(text) {
  const shelf = document.getElementById('toastNotificationShelf');
  if (!shelf) return;

  const toast = document.createElement('div');
  toast.className = 'toast-3d';
  toast.innerHTML = `<span>⚡</span><span>${text}</span>`;
  shelf.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

function saveStoredState() {
  try {
    localStorage.setItem('cravepulse_current_user', JSON.stringify(appState.currentUser));
    localStorage.setItem('cravepulse_active_order', JSON.stringify(appState.activeOrder));
    localStorage.setItem('cravepulse_history', JSON.stringify(appState.ordersHistory));
    localStorage.setItem('cravepulse_restaurants', JSON.stringify(appState.restaurantsCatalog));
    localStorage.setItem('cravepulse_menu', JSON.stringify(appState.menuCatalog));
  } catch (e) {}
}

function loadStoredState() {
  try {
    const usr = localStorage.getItem('cravepulse_current_user');
    if (usr) appState.currentUser = JSON.parse(usr);

    const act = localStorage.getItem('cravepulse_active_order');
    if (act) appState.activeOrder = JSON.parse(act);

    const hist = localStorage.getItem('cravepulse_history');
    if (hist) appState.ordersHistory = JSON.parse(hist);

    const rests = localStorage.getItem('cravepulse_restaurants');
    if (rests) appState.restaurantsCatalog = JSON.parse(rests);

    const mn = localStorage.getItem('cravepulse_menu');
    if (mn) appState.menuCatalog = JSON.parse(mn);
  } catch (e) {}

  if (appState.ordersHistory.length === 0 && appState.activeOrder) {
    appState.ordersHistory.push(appState.activeOrder);
  }
}
