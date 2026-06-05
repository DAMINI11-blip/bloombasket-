// =============================
// BLOOMBASKET - UPGRADED SCRIPT
// =============================


// -----------------------------
// PRODUCTS (8 items with ratings)
// -----------------------------

const products = [
  {
    id: 1,
    name: "Rose Delight",
    price: 599,
    // Verified: Red rose bouquet on table — photo by Shameel Mukkath
    image: "https://images.pexels.com/photos/11196806/pexels-photo-11196806.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Birthday",
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: "White Elegance",
    price: 799,
    // Verified: Elegant white rose bouquet — photo by Terje Sollie
    image: "https://images.pexels.com/photos/273941/pexels-photo-273941.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Wedding",
    rating: 4.8,
    reviews: 95
  },
  {
    id: 3,
    name: "Pink Love",
    price: 699,
    // Verified: Close-up pink rose bouquet on white background — photo by Ylanite Koppens
    image: "https://images.pexels.com/photos/2014698/pexels-photo-2014698.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Valentine",
    rating: 4.7,
    reviews: 210
  },
  {
    id: 4,
    name: "Golden Charm",
    price: 899,
    // Verified: Yellow roses + purple irises colorful bouquet — photo by Bozhena
    image: "https://images.pexels.com/photos/9008416/pexels-photo-9008416.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Anniversary",
    rating: 4.6,
    reviews: 74
  },
  {
    id: 5,
    name: "Lavender Dream",
    price: 749,
    // Verified: Purple hyacinth bouquet in vase — photo by Hatice Baran
    image: "https://images.pexels.com/photos/16037078/pexels-photo-16037078.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Birthday",
    rating: 4.4,
    reviews: 56
  },
  {
    id: 6,
    name: "Sunset Bliss",
    price: 649,
    // Verified: Sunflower + purple wildflower bouquet — photo by Deborah Valdivieso
    image: "https://images.pexels.com/photos/19127808/pexels-photo-19127808.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Anniversary",
    rating: 4.3,
    reviews: 43
  },
  {
    id: 7,
    name: "Ivory Grace",
    price: 999,
    // Verified: Bride holding peach & white rose bouquet — photo by Valeria Boltneva
    image: "https://images.pexels.com/photos/585410/pexels-photo-585410.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Wedding",
    rating: 4.9,
    reviews: 182
  },
  {
    id: 8,
    name: "Crimson Kiss",
    price: 849,
    // Verified: Red & pink rose bouquet, fashion editorial — photo by Godisable Jacob
    image: "https://images.pexels.com/photos/963457/pexels-photo-963457.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Valentine",
    rating: 4.8,
    reviews: 167
  }
];
// -----------------------------
// STATE
// -----------------------------
const state = {
  currentFilter: "All",
  searchQuery: "",
  sortBy: "default",
  cart: JSON.parse(localStorage.getItem("bb_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("bb_wishlist")) || []
};


// -----------------------------
// PERSISTENCE
// -----------------------------
function saveCart() {
  localStorage.setItem("bb_cart", JSON.stringify(state.cart));
}

function saveWishlist() {
  localStorage.setItem("bb_wishlist", JSON.stringify(state.wishlist));
}


// -----------------------------
// RENDER ENGINE
// -----------------------------
function renderApp() {
  renderProducts();
  renderCart();
  updateCartCount();
}


// -----------------------------
// FILTER + SORT LOGIC
// -----------------------------
function getFilteredProducts() {
  let list = [...products];

  // Filter by category
  if (state.currentFilter !== "All") {
    list = list.filter(p => p.category === state.currentFilter);
  }

  // Filter by search
  if (state.searchQuery) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(state.searchQuery) ||
      p.category.toLowerCase().includes(state.searchQuery)
    );
  }

  // Sort
  if (state.sortBy === "low") {
    list.sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "high") {
    list.sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  }

  return list;
}


// -----------------------------
// STAR RATING HELPER
// -----------------------------
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
}


// -----------------------------
// PRODUCT CARD RENDER
// -----------------------------
function renderProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";

  const inCart = state.cart.find(i => i.id === product.id);
  const isWishlisted = state.wishlist.includes(product.id);
  const cartQty = inCart ? inCart.qty : 0;

  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${product.image}" alt="${product.name}" loading="lazy"/>
      <button
        class="wishlist-btn ${isWishlisted ? "active" : ""}"
        onclick="toggleWishlist(${product.id})"
        title="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}"
      >❤</button>
      <span class="category-tag">${product.category}</span>
    </div>

    <div class="card-body">
      <h3 class="card-title">${product.name}</h3>

      <div class="card-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span class="rating-count">${product.rating} (${product.reviews})</span>
      </div>

      <div class="card-footer">
        <span class="price">₹${product.price}</span>

        ${cartQty === 0
          ? `<button class="add-btn" onclick="addToCart(${product.id})">Add +</button>`
          : `<div class="qty-control">
               <button onclick="decreaseQty(${product.id})">−</button>
               <span>${cartQty}</span>
               <button onclick="addToCart(${product.id})">+</button>
             </div>`
        }
      </div>
    </div>
  `;

  return card;
}


// -----------------------------
// PRODUCT RENDER
// -----------------------------
function renderProducts() {
  const container = document.getElementById("productContainer");
  container.innerHTML = "";

  const filtered = getFilteredProducts();

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🌾</div>
        <h3>No bouquets found</h3>
        <p>Try a different search or filter</p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    container.appendChild(renderProductCard(product));
  });
}


// -----------------------------
// CART LOGIC
// -----------------------------
function addToCart(id) {
  const item = state.cart.find(p => p.id === id);

  if (item) {
    item.qty += 1;
  } else {
    const product = products.find(p => p.id === id);
    state.cart.push({ ...product, qty: 1 });
    showToast(`🌸 ${product.name} added to cart!`);
  }

  saveCart();
  renderApp();
}

function decreaseQty(id) {
  const item = state.cart.find(p => p.id === id);
  if (!item) return;

  item.qty -= 1;

  if (item.qty <= 0) {
    const name = item.name;
    state.cart = state.cart.filter(p => p.id !== id);
    showToast(`🗑️ ${name} removed from cart`);
  }

  saveCart();
  renderApp();
}

function removeFromCart(id) {
  const item = state.cart.find(p => p.id === id);
  if (item) showToast(`🗑️ ${item.name} removed`);
  state.cart = state.cart.filter(i => i.id !== id);
  saveCart();
  renderApp();
}


// -----------------------------
// WISHLIST LOGIC
// -----------------------------
function toggleWishlist(id) {
  const product = products.find(p => p.id === id);
  if (state.wishlist.includes(id)) {
    state.wishlist = state.wishlist.filter(w => w !== id);
    showToast(`💔 ${product.name} removed from wishlist`);
  } else {
    state.wishlist.push(id);
    showToast(`❤️ ${product.name} saved to wishlist!`);
  }
  saveWishlist();
  renderApp();
}


// -----------------------------
// CART RENDER
// -----------------------------
function renderCart() {
  const container = document.getElementById("cartItems");
  container.innerHTML = "";

  if (state.cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><p>🌱 Your cart is empty</p></div>`;
    document.getElementById("cartTotal").innerText = "0";
    return;
  }

  state.cart.forEach(item => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">₹${item.price} × ${item.qty}</span>
      </div>
      <div class="cart-item-controls">
        <button onclick="decreaseQty(${item.id})">−</button>
        <span>${item.qty}</span>
        <button onclick="addToCart(${item.id})">+</button>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
    `;

    container.appendChild(div);
  });

  const total = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("cartTotal").innerText = total;
}


// -----------------------------
// CART COUNT
// -----------------------------
function updateCartCount() {
  const count = state.cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").innerText = count;
}


// -----------------------------
// CART PANEL TOGGLE
// -----------------------------
function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("hidden");
  document.getElementById("cartOverlay").classList.toggle("hidden");
}


// -----------------------------
// CHECKOUT MODAL
// -----------------------------
function checkout() {
  if (state.cart.length === 0) {
    showToast("🌱 Your cart is empty!");
    return;
  }

  const modalItems = document.getElementById("modalItems");
  modalItems.innerHTML = "";

  state.cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "modal-item-row";
    row.innerHTML = `
      <span>${item.name} × ${item.qty}</span>
      <span>₹${item.price * item.qty}</span>
    `;
    modalItems.appendChild(row);
  });

  const total = state.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  document.getElementById("modalTotal").innerText = total;

  document.getElementById("checkoutModal").classList.remove("hidden");

  // Close cart panel
  document.getElementById("cartPanel").classList.add("hidden");
  document.getElementById("cartOverlay").classList.add("hidden");
}

function closeModal() {
  document.getElementById("checkoutModal").classList.add("hidden");
}

function confirmOrder() {
  closeModal();
  state.cart = [];
  saveCart();
  renderApp();
  showToast("✅ Order placed successfully! Thank you 🌸");
}


// -----------------------------
// TOAST NOTIFICATION
// -----------------------------
let toastTimer = null;

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hidden");
  }, 2500);
}


// -----------------------------
// DEBOUNCE HELPER
// -----------------------------
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}


// -----------------------------
// EVENTS
// -----------------------------

// Filter buttons
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.currentFilter = btn.dataset.category;
    renderApp();
  });
});

// Search — debounced
document.getElementById("searchInput").addEventListener(
  "input",
  debounce((e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderApp();
  }, 300)
);

// Sort
document.getElementById("sortSelect").addEventListener("change", (e) => {
  state.sortBy = e.target.value;
  renderApp();
});

// Close modal on overlay click
document.getElementById("checkoutModal").addEventListener("click", (e) => {
  if (e.target === document.getElementById("checkoutModal")) closeModal();
});


// -----------------------------
// INIT
// -----------------------------
renderApp();