let allProducts    = [];   
let filteredProducts = []; 
let cart           = {};   

const TAX_RATE      = 0.08;
const FREE_SHIPPING = 20;

const $ = id => document.getElementById(id);

async function fetchProducts() {
  try {
    const res  = await fetch('https://fakestoreapi.com/products');
    const data = await res.json();
    allProducts      = data;
    filteredProducts = [...data];
    $('loadingSpinner').style.display = 'none';
    renderProducts(filteredProducts);
  } catch (err) {
    $('loadingSpinner').innerHTML =
      '<p style="color:#ef4444">⚠️ Failed to load products. Please refresh.</p>';
  }
}

function renderProducts(products) {
  const grid = $('productGrid');
  grid.innerHTML = '';

  if (!products.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted)">
        <span style="font-size:3rem">🔍</span>
        <p style="margin-top:12px;font-size:1.05rem">No products found. Try a different search.</p>
      </div>`;
    return;
  }

  products.forEach(p => {
    const stars  = renderStars(p.rating.rate);
    const badge  = getBadge(p);
    const inCart = cart[p.id];

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${badge ? `<span class="card-badge ${badge.cls}">${badge.label}</span>` : ''}
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.title}" loading="lazy" />
      </div>
      <div class="card-body">
        <span class="card-category">${p.category}</span>
        <p class="card-title">${p.title}</p>
        <div class="card-stars">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.rating.count})</span>
        </div>
        <div class="card-footer">
          <span class="card-price">$${p.price.toFixed(2)}</span>
          <button class="add-btn" onclick="addToCart(${p.id})" title="Add to cart">
            ${inCart ? '✓' : '+'}
          </button>
        </div>
      </div>`;
    grid.appendChild(card);
  });
}

function renderStars(rate) {
  const full  = Math.floor(rate);
  const half  = rate % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function getBadge(p) {
  if (p.rating.rate >= 4.5) return { label: '⭐ Top Rated', cls: 'top' };
  if (p.price < 15)         return { label: '🔥 Hot Deal',  cls: ''    };
  return null;
}

function filterCategory(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const search = $('searchInput').value.toLowerCase();
  let base = cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat);
  filteredProducts = base.filter(p => p.title.toLowerCase().includes(search));

  $('sectionTitle').textContent = cat === 'all' ? 'All Products'
    : cat.charAt(0).toUpperCase() + cat.slice(1);

  sortProducts();
}

function handleSearch() {
  const query   = $('searchInput').value.toLowerCase().trim();
  const activeBtn = document.querySelector('.cat-btn.active');
  const cat     = activeBtn?.dataset.cat || 'all';

  let base = cat === 'all' ? allProducts : allProducts.filter(p => p.category === cat);
  filteredProducts = query
    ? base.filter(p => p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query))
    : base;

  sortProducts();
}

document.addEventListener('DOMContentLoaded', () => {
  $('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
  fetchProducts();
});

function sortProducts() {
  const mode = $('sortSelect').value;
  const copy = [...filteredProducts];

  if (mode === 'price-asc')  copy.sort((a,b) => a.price - b.price);
  if (mode === 'price-desc') copy.sort((a,b) => b.price - a.price);
  if (mode === 'rating')     copy.sort((a,b) => b.rating.rate - a.rating.rate);

  renderProducts(copy);
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  if (!product) return;

  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { ...product, qty: 1 };
  }

  updateCartUI();
  animateBadge();
}

function updateQuantity(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function removeFromCart(id) {
  delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const items  = Object.values(cart);
  const badge  = $('cartBadge');
  const itemsEl = $('cartItems');

  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  badge.textContent = totalQty;

  if (!items.length) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <span>🛍️</span><p>Your cart is empty</p>
      </div>`;
  } else {
    itemsEl.innerHTML = items.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.title}" />
        <div class="cart-item-info">
          <p class="cart-item-title">${item.title}</p>
          <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQuantity(${item.id},-1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="updateQuantity(${item.id},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
      </div>`).join('');
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING || subtotal === 0 ? 0 : 4.99;
  const grand    = subtotal + tax + shipping;

  $('subtotal').textContent     = `$${subtotal.toFixed(2)}`;
  $('taxAmount').textContent    = `$${tax.toFixed(2)}`;
  $('shippingAmount').textContent = shipping === 0 && subtotal > 0
    ? '<span style="color:var(--success)">FREE</span>'
    : `$${shipping.toFixed(2)}`;
  $('grandTotal').textContent   = `$${grand.toFixed(2)}`;

  const shipEl = $('shippingAmount');
  if (shipping === 0 && subtotal > 0) {
    shipEl.innerHTML = '<span style="color:var(--success);font-weight:600">FREE ✓</span>';
  } else {
    shipEl.textContent = shipping === 0 ? '$0.00' : `$${shipping.toFixed(2)}`;
  }

  sortProducts();
}

function toggleCart() {
  $('cartDrawer').classList.toggle('open');
  $('cartOverlay').classList.toggle('open');
  document.body.style.overflow =
    $('cartDrawer').classList.contains('open') ? 'hidden' : '';
}

function animateBadge() {
  const badge = $('cartBadge');
  badge.style.transform = 'scale(1.4)';
  setTimeout(() => badge.style.transform = 'scale(1)', 250);
}

function openCheckout() {
  const items = Object.values(cart);
  if (!items.length) {
    alert('Your cart is empty! Add some items first 🛒');
    return;
  }

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax      = subtotal * TAX_RATE;
  const shipping = subtotal > FREE_SHIPPING ? 0 : 4.99;
  const grand    = subtotal + tax + shipping;

  const summaryEl = $('orderSummary');
  summaryEl.innerHTML = items.map(i => `
    <div class="order-item-line">
      <span>${i.title.substring(0,30)}… ×${i.qty}</span>
      <span>$${(i.price * i.qty).toFixed(2)}</span>
    </div>`).join('') +
    `<div class="order-item-line" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border);font-weight:700">
      <span>Total</span><span>$${grand.toFixed(2)}</span>
    </div>`;

  $('cartDrawer').classList.remove('open');
  $('cartOverlay').classList.remove('open');

  $('checkoutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  $('checkoutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function clearCart() {
  cart = {};
  updateCartUI();
}