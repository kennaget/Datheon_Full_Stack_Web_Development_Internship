const API_URL = 'https://fakestoreapi.com/products';
const TAX_RATE = 0.08;
const FREE_SHIPPING_MINIMUM = 20;
const SHIPPING_COST = 4.99;

let allProducts = [];
let currentCategory = 'all';
let cart = {};

const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const sectionTitle = document.getElementById('sectionTitle');
const loadingSpinner = document.getElementById('loadingSpinner');
const productGrid = document.getElementById('productGrid');

const cartBadge = document.getElementById('cartBadge');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const cartItemsList = document.getElementById('cartItemsList');
const subtotalText = document.getElementById('subtotalAmount');
const taxText = document.getElementById('taxAmount');
const shippingText = document.getElementById('shippingAmount');
const totalText = document.getElementById('totalAmount');

const checkoutModal = document.getElementById('checkoutModal');
const orderSummary = document.getElementById('orderSummary');


async function loadProducts() {
  loadingSpinner.style.display = 'block';
  productGrid.innerHTML = '';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Server responded with ' + response.status);
    }

    allProducts = await response.json();
    loadingSpinner.style.display = 'none';
    showProducts();
  } catch (error) {
    console.error('Failed to load products:', error);
    loadingSpinner.style.display = 'none';
    showLoadError();
  }
}


function showProducts() {
  const products = getVisibleProducts();

  if (products.length === 0) {
    productGrid.innerHTML = `
      <div class="state-message">
        <span class="state-icon">🔍</span>
        <p>No products found. Try a different search.</p>
      </div>`;
    return;
  }

  let html = '';
  for (const product of products) {
    html += createProductCardHtml(product);
  }
  productGrid.innerHTML = html;
}

function showLoadError() {
  productGrid.innerHTML = `
    <div class="state-message">
      <span class="state-icon">⚠️</span>
      <p>We couldn't load the products. Check your connection and try again.</p>
      <button class="retry-button" onclick="loadProducts()">Try again</button>
    </div>`;
}

function getVisibleProducts() {
  const searchText = searchInput.value.toLowerCase().trim();
  const products = [];

  for (const product of allProducts) {
    const isInCategory = currentCategory === 'all' || product.category === currentCategory;

    const titleMatches = product.title.toLowerCase().includes(searchText);
    const descriptionMatches = product.description.toLowerCase().includes(searchText);
    const matchesSearch = searchText === '' || titleMatches || descriptionMatches;

    if (isInCategory && matchesSearch) {
      products.push(product);
    }
  }

  sortProductList(products);
  return products;
}

function sortProductList(products) {
  const sortMode = sortSelect.value;

  if (sortMode === 'price-asc') {
    products.sort(function (a, b) { return a.price - b.price; });
  }
  if (sortMode === 'price-desc') {
    products.sort(function (a, b) { return b.price - a.price; });
  }
  if (sortMode === 'rating') {
    products.sort(function (a, b) { return b.rating.rate - a.rating.rate; });
  }
}

function createProductCardHtml(product) {
  const title = escapeHtml(product.title);
  const category = escapeHtml(product.category);
  const stars = getStarsText(product.rating.rate);
  const buttonSymbol = isInCart(product.id) ? '✓' : '+';

  return `
    <div class="product-card">
      ${getBadgeHtml(product)}
      <div class="product-image">
        <img src="${product.image}" alt="${title}" loading="lazy" />
      </div>
      <div class="product-info">
        <span class="product-category">${category}</span>
        <p class="product-title">${title}</p>
        <div class="product-rating">
          <span class="rating-stars">${stars}</span>
          <span class="rating-count">(${product.rating.count})</span>
        </div>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button class="add-to-cart-button" data-id="${product.id}" onclick="addToCart(${product.id})" title="Add to cart">
            ${buttonSymbol}
          </button>
        </div>
      </div>
    </div>`;
}

function getBadgeHtml(product) {
  if (product.rating.rate >= 4.5) {
    return '<span class="product-badge top-rated">⭐ Top Rated</span>';
  }
  if (product.price < 15) {
    return '<span class="product-badge">🔥 Hot Deal</span>';
  }
  return '';
}

function getStarsText(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  let emptyStars = 5 - fullStars;

  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) {
    stars += '½';
    emptyStars = emptyStars - 1;
  }
  stars += '☆'.repeat(emptyStars);

  return stars;
}


function findProduct(id) {
  for (const product of allProducts) {
    if (product.id === id) {
      return product;
    }
  }
  return null;
}

function isInCart(id) {
  return cart[id] !== undefined;
}

function getCartItems() {
  const items = [];
  for (const id in cart) {
    items.push(cart[id]);
  }
  return items;
}

function addToCart(id) {
  if (isInCart(id)) {
    cart[id].quantity += 1;
  } else {
    const product = findProduct(id);
    if (!product) {
      return;
    }
    cart[id] = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    };
  }

  updateCart();
  animateCartBadge();
}

function updateQuantity(id, change) {
  if (!isInCart(id)) {
    return;
  }

  cart[id].quantity += change;

  if (cart[id].quantity <= 0) {
    delete cart[id];
  }

  updateCart();
}

function removeFromCart(id) {
  delete cart[id];
  updateCart();
}

function clearCart() {
  cart = {};
  updateCart();
}

function calculateTotals() {
  let subtotal = 0;
  for (const item of getCartItems()) {
    subtotal += item.price * item.quantity;
  }

  const tax = subtotal * TAX_RATE;

  let shipping = SHIPPING_COST;
  if (subtotal === 0 || subtotal > FREE_SHIPPING_MINIMUM) {
    shipping = 0;
  }

  return {
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: subtotal + tax + shipping
  };
}

function countCartItems() {
  let count = 0;
  for (const item of getCartItems()) {
    count += item.quantity;
  }
  return count;
}


function updateCart() {
  showCartItems();
  showCartTotals();
  updateAddButtons();
}

function showCartItems() {
  const items = getCartItems();

  if (items.length === 0) {
    cartItemsList.innerHTML = `
      <div class="empty-cart">
        <span>🛍️</span>
        <p>Your cart is empty</p>
      </div>`;
    return;
  }

  let html = '';
  for (const item of items) {
    html += createCartItemHtml(item);
  }
  cartItemsList.innerHTML = html;
}

function createCartItemHtml(item) {
  const title = escapeHtml(item.title);

  return `
    <div class="cart-item">
      <img class="cart-item-image" src="${item.image}" alt="${title}" />
      <div class="cart-item-info">
        <p class="cart-item-title">${title}</p>
        <span class="cart-item-price">${formatPrice(item.price * item.quantity)}</span>
        <div class="quantity-controls">
          <button class="quantity-button" onclick="updateQuantity(${item.id}, -1)">−</button>
          <span class="quantity-number">${item.quantity}</span>
          <button class="quantity-button" onclick="updateQuantity(${item.id}, 1)">+</button>
        </div>
      </div>
      <button class="remove-button" onclick="removeFromCart(${item.id})" title="Remove">🗑️</button>
    </div>`;
}

function showCartTotals() {
  const totals = calculateTotals();

  cartBadge.textContent = countCartItems();
  subtotalText.textContent = formatPrice(totals.subtotal);
  taxText.textContent = formatPrice(totals.tax);
  totalText.textContent = formatPrice(totals.total);

  if (totals.shipping === 0 && totals.subtotal > 0) {
    shippingText.innerHTML = '<span class="free-shipping">FREE ✓</span>';
  } else {
    shippingText.textContent = formatPrice(totals.shipping);
  }
}

function updateAddButtons() {
  const buttons = document.querySelectorAll('.add-to-cart-button');

  for (const button of buttons) {
    const id = Number(button.dataset.id);
    button.textContent = isInCart(id) ? '✓' : '+';
  }
}

function animateCartBadge() {
  cartBadge.style.transform = 'scale(1.4)';

  setTimeout(function () {
    cartBadge.style.transform = 'scale(1)';
  }, 250);
}


function handleSearch() {
  showProducts();
}

function sortProducts() {
  showProducts();
}

function filterCategory(button) {
  const category = button.dataset.category;

  const allCategoryButtons = document.querySelectorAll('.category-button');
  for (const categoryButton of allCategoryButtons) {
    categoryButton.classList.remove('active');
  }
  button.classList.add('active');

  currentCategory = category;

  if (category === 'all') {
    sectionTitle.textContent = 'All Products';
  } else {
    sectionTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
  }

  showProducts();
}

function toggleCart() {
  cartDrawer.classList.toggle('open');
  cartOverlay.classList.toggle('open');

  const cartIsOpen = cartDrawer.classList.contains('open');
  lockPageScroll(cartIsOpen);
}

function openCheckout() {
  const items = getCartItems();

  if (items.length === 0) {
    alert('Your cart is empty! Add some items first 🛒');
    return;
  }

  let html = '';
  for (const item of items) {
    html += `
    <div class="order-item-line">
      <span>${escapeHtml(item.title.substring(0, 30))}… ×${item.quantity}</span>
      <span>${formatPrice(item.price * item.quantity)}</span>
    </div>`;
  }

  html += `
    <div class="order-item-line order-total">
      <span>Total</span><span>${formatPrice(calculateTotals().total)}</span>
    </div>`;

  orderSummary.innerHTML = html;

  cartDrawer.classList.remove('open');
  cartOverlay.classList.remove('open');
  checkoutModal.classList.add('open');
  lockPageScroll(true);
}

function closeCheckout() {
  checkoutModal.classList.remove('open');
  lockPageScroll(false);
}

function continueShopping() {
  closeCheckout();
  clearCart();
}

function scrollToProducts() {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}


function formatPrice(price) {
  return '$' + price.toFixed(2);
}

function escapeHtml(text) {
  const temporaryElement = document.createElement('div');
  temporaryElement.textContent = text;
  return temporaryElement.innerHTML;
}

function lockPageScroll(shouldLock) {
  document.body.style.overflow = shouldLock ? 'hidden' : '';
}


searchInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    handleSearch();
  }
});

loadProducts();
