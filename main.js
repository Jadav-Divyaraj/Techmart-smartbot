// ===== TECHMART AI - MAIN SCRIPT =====
import { PRODUCTS, DEALS, formatPrice } from './database.js';
import { processMessage } from './chatbot.js';

// ===== GLOBAL STATE =====
let cart = [];
let wishlist = [];
let currentFilter = 'all';
let visibleCount = 12;
let chatOpen = false;
let timerInterval = null;

// ===== UTILITY =====
function $(id) { return document.getElementById(id); }
function formatStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '<i class="fas fa-star"></i>'.repeat(full);
  if (half) s += '<i class="fas fa-star-half-alt"></i>';
  s += '<i class="far fa-star"></i>'.repeat(5 - full - (half ? 1 : 0));
  return s;
}
function showToast(msg, type = 'success') {
  const container = $('toastContainer');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
  container.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 3000);
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = $('hamburger');
  const navLinks = document.querySelector('.nav-links');
  const searchToggle = $('searchToggle');
  const searchOverlay = $('searchOverlay');
  const searchClose = $('searchClose');
  const globalSearch = $('globalSearch');
  const searchResults = $('searchResults');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar?.classList.add('scrolled');
    else navbar?.classList.remove('scrolled');

    // Back to top
    const btt = $('backToTop');
    if (btt) {
      if (window.scrollY > 400) btt.classList.add('visible');
      else btt.classList.remove('visible');
    }
  });

  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  searchToggle?.addEventListener('click', () => {
    searchOverlay?.classList.toggle('active');
    if (searchOverlay?.classList.contains('active')) globalSearch?.focus();
  });

  searchClose?.addEventListener('click', () => {
    searchOverlay?.classList.remove('active');
    if (searchResults) searchResults.innerHTML = '';
    if (globalSearch) globalSearch.value = '';
  });

  globalSearch?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q || !searchResults) return;
    const results = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.includes(q)
    ).slice(0, 8);

    if (!results.length) {
      searchResults.innerHTML = '<div style="color:var(--text-muted);padding:12px;text-align:center">No products found</div>';
      return;
    }

    searchResults.innerHTML = results.map(p => `
      <div class="search-result-item" onclick="openProductDetail(${p.id}); document.getElementById('searchClose').click()">
        <div class="search-result-img">${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<
        
        style=\\'font-size:1.5rem\\'>${p.emoji}</span>'" />` : `<span style="font-size:1.5rem">${p.emoji}</span>`}</div>
        <div class="search-result-info">
          <div class="search-result-name">${p.name}</div>
          <div class="search-result-cat">${p.brand} · ${p.category.toUpperCase()}</div>
        </div>
        <div class="search-result-price">${formatPrice(p.price)}</div>
      </div>
    `).join('');
  });

  // Nav link active state on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const h = section.offsetHeight;
      const top = section.offsetTop;
      if (scrollY >= top && scrollY < top + h) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  });

  // Back to top
  $('backToTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Footer filter links
  document.querySelectorAll('[data-filter-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = link.dataset.filterLink;
      filterProducts(cat);
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ===== CATEGORY CARDS =====
function initCategories() {
  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      filterProducts(cat);
      document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

// ===== PRODUCTS RENDERING =====
function createProductCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const inWishlist = wishlist.some(w => w.id === p.id);
  const specEntries = Object.entries(p.specs).slice(0, 2).map(([k, v]) => `${k}: ${v}`).join(' • ');
  const stockClass = p.stock === 'In Stock' ? 'in-stock' : p.stock === 'Low Stock' ? 'low-stock' : 'out-stock';

  return `
    <div class="product-card" data-category="${p.category}" onclick="openProductDetail(${p.id})">
      ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'NEW' : p.badge === 'best' ? 'BESTSELLER' : p.badge === 'hot' ? '🔥 HOT' : 'SALE'}</span>` : ''}
      <button class="product-wishlist ${inWishlist ? 'active' : ''}" onclick="event.stopPropagation(); toggleWishlist(${p.id}, this)" title="Wishlist">
        <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
      </button>
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='${p.emoji}'" />
      </div>
      <div class="product-info">
        <div class="product-category">${p.category.toUpperCase()}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-brand">${p.brand}</div>
        <div class="product-specs">${specEntries}</div>
        <div class="product-rating">
          <span class="stars">${formatStars(p.rating)}</span>
          <span class="rating-count">(${p.reviews.toLocaleString('en-IN')})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="product-price-old">${formatPrice(p.oldPrice)}</span>` : ''}
          ${discount ? `<span class="product-discount">-${discount}%</span>` : ''}
        </div>
        <div class="product-stock ${stockClass}">
          <i class="fas fa-circle" style="font-size:0.5rem"></i> ${p.stock}
        </div>
        <div class="product-actions" onclick="event.stopPropagation()">
          <button class="btn btn-primary" onclick="addToCart(${p.id})"><i class="fas fa-cart-plus"></i> Add</button>
          <button class="btn btn-outline" onclick="openProductDetail(${p.id})"><i class="fas fa-eye"></i> View</button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts() {
  const grid = $('productsGrid');
  if (!grid) return;

  let filtered = currentFilter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === currentFilter);
  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map(createProductCard).join('');

  // Load more button
  const loadMoreBtn = $('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= filtered.length ? 'none' : 'inline-flex';
  }
}

function filterProducts(cat) {
  currentFilter = cat;
  visibleCount = 12;

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === cat);
  });

  renderProducts();
}

function initProducts() {
  renderProducts();

  // Filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => filterProducts(btn.dataset.filter));
  });

  // Load more
  $('loadMoreBtn')?.addEventListener('click', () => {
    visibleCount += 8;
    renderProducts();
  });
}

// ===== DEALS =====
function renderDeals() {
  const grid = $('dealsGrid');
  if (!grid) return;
  grid.innerHTML = DEALS.map(d => {
    const prod = PRODUCTS.find(p => p.id === d.id);
    const img = prod?.img || '';
    return `
      <div class="deal-card" onclick="openProductDetail(${d.id})">
        <div class="deal-img-wrap">
          ${img ? `<img src="${img}" alt="${d.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'deal-emoji-fallback\\'>${prod?.emoji || ''}</span>'" />` : `<span class="deal-emoji-fallback">${prod?.emoji || ''}</span>`}
        </div>
        <div class="deal-info">
          <div class="deal-name">${d.name}</div>
          <div class="deal-old">${formatPrice(d.oldPrice)}</div>
          <div class="deal-price">${formatPrice(d.price)}</div>
          <span class="deal-save">${d.save}</span>
        </div>
        <button class="btn btn-sm btn-accent" onclick="event.stopPropagation(); addToCart(${d.id})"><i class="fas fa-cart-plus"></i></button>
      </div>
    `;
  }).join('');
}

// ===== COUNTDOWN TIMER =====
function initTimer() {
  let hours = 8, mins = 45, secs = 30;
  timerInterval = setInterval(() => {
    secs--;
    if (secs < 0) { secs = 59; mins--; }
    if (mins < 0) { mins = 59; hours--; }
    if (hours < 0) { hours = 11; mins = 59; secs = 59; }
    const h = $('timerH'), m = $('timerM'), s = $('timerS');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(mins).padStart(2, '0');
    if (s) s.textContent = String(secs).padStart(2, '0');
  }, 1000);
}

// ===== CART =====
function addToCart(id) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;
  const existing = cart.find(c => c.id === id);
  if (existing) { existing.qty++; }
  else { cart.push({ ...prod, qty: 1 }); }
  updateCartUI();
  showToast(`${prod.name} added to cart!`, 'success');
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
  renderCartItems();
}

function updateQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  updateCartUI();
  renderCartItems();
}

function updateCartUI() {
  const count = $('cartCount');
  if (count) {
    const total = cart.reduce((sum, c) => sum + c.qty, 0);
    count.textContent = total;
  }
}

function renderCartItems() {
  const cartItems = $('cartItems');
  const cartFooter = $('cartFooter');
  const cartTotal = $('cartTotal');
  if (!cartItems) return;

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }

  if (cartFooter) cartFooter.style.display = 'flex';
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  if (cartTotal) cartTotal.textContent = formatPrice(total);

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">
        ${item.img ? `<img src="${item.img}" alt="${item.name}" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'cart-item-emoji-fallback\\'>${item.emoji}</span>'" />` : `<span class="cart-item-emoji-fallback">${item.emoji}</span>`}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
        <span>${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function initCart() {
  $('cartBtn')?.addEventListener('click', () => {
    renderCartItems();
    $('cartModal')?.classList.add('open');
  });
  $('cartClose')?.addEventListener('click', () => $('cartModal')?.classList.remove('open'));
  $('cartModal')?.addEventListener('click', (e) => { if (e.target === $('cartModal')) $('cartModal')?.classList.remove('open'); });
}

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;

// ===== CHECKOUT SYSTEM =====
let checkoutStep = 1;
let checkoutData = {
  payment: 'upi',
  orderId: ''
};

function startCheckout() {
  if (!cart.length) { showToast('Your cart is empty!', 'error'); return; }
  checkoutStep = 1;
  checkoutData = {
    payment: 'upi',
    orderId: 'TM' + Math.floor(Math.random() * 90000 + 10000)
  };
  var cartModal = document.getElementById('cartModal');
  var checkoutModal = document.getElementById('checkoutModal');
  if (cartModal) cartModal.classList.remove('open');
  if (checkoutModal) checkoutModal.classList.add('open');
  renderCheckoutStep();
}

function renderCheckoutStep() {
  updateStepIndicators();
  var content = document.getElementById('checkoutContent');
  if (!content) return;

  if (checkoutStep === 1) {
    renderCartReview(content);
  } else if (checkoutStep === 2) {
    renderPaymentSelection(content);
  } else if (checkoutStep === 3) {
    renderOrderConfirmation(content);
  }
}

function updateStepIndicators() {
  document.querySelectorAll('.checkout-step').forEach(function(el) {
    var step = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');
    if (step === checkoutStep) el.classList.add('active');
    else if (step < checkoutStep) el.classList.add('completed');
  });
  document.querySelectorAll('.checkout-step-line').forEach(function(el, i) {
    el.classList.toggle('completed', i + 1 < checkoutStep);
  });
  var title = document.getElementById('checkoutTitle');
  if (title) {
    var titles = ['', '<i class="fas fa-shopping-cart"></i> Review Cart', '<i class="fas fa-credit-card"></i> Payment Method', '<i class="fas fa-check-circle"></i> Confirm Order'];
    title.innerHTML = titles[checkoutStep] || '<i class="fas fa-credit-card"></i> Checkout';
  }
}

function renderCartReview(container) {
  var subtotal = cart.reduce(function(sum, c) { return sum + c.price * c.qty; }, 0);
  var shipping = subtotal >= 2999 ? 0 : 99;
  var total = subtotal + shipping;
  var itemCount = cart.reduce(function(s, c) { return s + c.qty; }, 0);

  var itemsHtml = cart.map(function(item) {
    var imgHtml = item.img
      ? '<img src="' + item.img + '" alt="' + item.name + '" onerror="this.style.display=\'none\';this.parentElement.innerHTML=\'<span class=\\\'checkout-cart-item-emoji\\\'>' + item.emoji + '</span>\'" />'
      : '<span class="checkout-cart-item-emoji">' + item.emoji + '</span>';
    return '<div class="checkout-cart-item">' +
      '<div class="checkout-cart-item-img">' + imgHtml + '</div>' +
      '<div class="checkout-cart-item-info">' +
        '<div class="checkout-cart-item-name">' + item.name + '</div>' +
        '<div class="checkout-cart-item-meta">Qty: ' + item.qty + ' &middot; ' + item.brand + '</div>' +
      '</div>' +
      '<div class="checkout-cart-item-price">' + formatPrice(item.price * item.qty) + '</div>' +
    '</div>';
  }).join('');

  var freeShippingNote = shipping === 0
    ? '<div class="checkout-summary-row" style="color:var(--success);font-size:0.78rem"><i class="fas fa-check-circle"></i> Free shipping on orders above &#8377;2999</div>'
    : '';

  container.innerHTML =
    '<div class="checkout-cart-items">' + itemsHtml + '</div>' +
    '<div class="checkout-summary">' +
      '<div class="checkout-summary-row"><span>Subtotal (' + itemCount + ' items)</span><span>' + formatPrice(subtotal) + '</span></div>' +
      '<div class="checkout-summary-row"><span>Shipping</span><span class="' + (shipping === 0 ? 'free-tag' : '') + '">' + (shipping === 0 ? 'FREE' : formatPrice(shipping)) + '</span></div>' +
      freeShippingNote +
      '<div class="checkout-summary-row total"><span>Total</span><span class="price">' + formatPrice(total) + '</span></div>' +
    '</div>' +
    '<div class="checkout-actions">' +
      '<button class="btn btn-back" onclick="closeCheckout()"><i class="fas fa-arrow-left"></i> Back to Cart</button>' +
      '<button class="btn btn-primary" onclick="nextCheckoutStep()">Continue <i class="fas fa-arrow-right"></i></button>' +
    '</div>';
}

function renderPaymentSelection(container) {
  var methods = [
    { id: 'upi', name: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: 'fa-mobile-alt' },
    { id: 'card', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: 'fa-credit-card' },
    { id: 'netbanking', name: 'Net Banking', desc: 'All major banks supported', icon: 'fa-university' },
    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive', icon: 'fa-money-bill-wave' }
  ];

  var methodsHtml = methods.map(function(m) {
    var selected = checkoutData.payment === m.id ? 'selected' : '';
    var checked = checkoutData.payment === m.id ? 'checked' : '';
    return '<label class="payment-method ' + selected + '">' +
      '<input type="radio" name="paymentMethod" value="' + m.id + '" ' + checked + ' onchange="selectPayment(\'' + m.id + '\')" />' +
      '<span class="payment-method-icon"><i class="fas ' + m.icon + '"></i></span>' +
      '<div class="payment-method-info">' +
        '<div class="payment-method-name">' + m.name + '</div>' +
        '<div class="payment-method-desc">' + m.desc + '</div>' +
      '</div>' +
    '</label>';
  }).join('');

  container.innerHTML =
    '<div class="payment-methods">' + methodsHtml + '</div>' +
    '<div class="checkout-actions">' +
      '<button class="btn btn-back" onclick="prevCheckoutStep()"><i class="fas fa-arrow-left"></i> Back</button>' +
      '<button class="btn btn-primary" onclick="nextCheckoutStep()">Continue <i class="fas fa-arrow-right"></i></button>' +
    '</div>';
}

function selectPayment(method) {
  checkoutData.payment = method;
  document.querySelectorAll('.payment-method').forEach(function(el) {
    el.classList.toggle('selected', el.querySelector('input').value === method);
  });
}

function renderOrderConfirmation(container) {
  var subtotal = cart.reduce(function(sum, c) { return sum + c.price * c.qty; }, 0);
  var shipping = subtotal >= 2999 ? 0 : 99;
  var total = subtotal + shipping;
  var paymentNames = { upi: 'UPI', card: 'Credit/Debit Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };
  var itemCount = cart.reduce(function(s, c) { return s + c.qty; }, 0);

  container.innerHTML =
    '<div class="checkout-summary">' +
      '<div class="checkout-summary-row"><span>Order ID</span><span style="color:var(--primary-light);font-weight:700">' + checkoutData.orderId + '</span></div>' +
      '<div class="checkout-summary-row"><span>Items</span><span>' + itemCount + ' product(s)</span></div>' +
      '<div class="checkout-summary-row total"><span>Total</span><span class="price">' + formatPrice(total) + '</span></div>' +
    '</div>' +
    '<div style="margin-top:16px;background:var(--dark);border-radius:var(--radius-sm);padding:16px">' +
      '<div style="font-weight:700;margin-bottom:8px;font-size:0.88rem"><i class="fas fa-credit-card" style="color:var(--primary-light)"></i> Payment Method</div>' +
      '<div style="font-size:0.85rem">' + (paymentNames[checkoutData.payment] || checkoutData.payment) + '</div>' +
    '</div>' +
    '<div style="margin-top:12px;background:var(--dark);border-radius:var(--radius-sm);padding:16px">' +
      '<div style="font-weight:700;margin-bottom:8px;font-size:0.88rem"><i class="fas fa-info-circle" style="color:var(--primary-light)"></i> What\'s Next?</div>' +
      '<div style="font-size:0.82rem;color:var(--text-muted);line-height:1.6">After placing your order, you\'ll receive a confirmation. You can track your order anytime using the Order ID in the chatbot or the Track Order section.</div>' +
    '</div>' +
    '<div class="checkout-actions">' +
      '<button class="btn btn-back" onclick="prevCheckoutStep()"><i class="fas fa-arrow-left"></i> Back</button>' +
      '<button class="btn btn-primary" id="placeOrderBtn" onclick="placeOrder()"><i class="fas fa-check"></i> Place Order</button>' +
    '</div>';
}

function nextCheckoutStep() {
  checkoutStep++;
  renderCheckoutStep();
}

function prevCheckoutStep() {
  if (checkoutStep > 1) {
    checkoutStep--;
    renderCheckoutStep();
  } else {
    closeCheckout();
  }
}

function closeCheckout() {
  var checkoutModal = document.getElementById('checkoutModal');
  var cartModal = document.getElementById('cartModal');
  if (checkoutModal) checkoutModal.classList.remove('open');
  if (cartModal) cartModal.classList.add('open');
  renderCartItems();
}

function placeOrder() {
  var subtotal = cart.reduce(function(sum, c) { return sum + c.price * c.qty; }, 0);
  var shipping = subtotal >= 2999 ? 0 : 99;
  var total = subtotal + shipping;
  var paymentNames = { upi: 'UPI', card: 'Credit/Debit Card', netbanking: 'Net Banking', cod: 'Cash on Delivery' };
  var estDays = checkoutData.payment === 'cod' ? '4-6' : '2-4';
  var orderItems = cart.map(function(c) { return c.name; }).join(', ');
  var currentOrderId = checkoutData.orderId;

  // Add to ORDERS database so it can be tracked in chatbot
  var newOrder = {
    orderId: currentOrderId,
    customerName: 'Customer',
    status: 'Processing',
    trackingNo: 'TM-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    orderDate: new Date().toISOString().split('T')[0],
    product: orderItems,
    steps: 1
  };

  // Try to push to ORDERS, if that fails use a fallback
  try {
    ORDERS.push(newOrder);
  } catch(e) {
    // Fallback: store in localStorage
    var storedOrders = JSON.parse(localStorage.getItem('techmart_orders') || '[]');
    storedOrders.push(newOrder);
    localStorage.setItem('techmart_orders', JSON.stringify(storedOrders));
  }

  var checkoutModal = document.getElementById('checkoutModal');
  var successModal = document.getElementById('orderSuccessModal');
  if (checkoutModal) checkoutModal.classList.remove('open');
  if (successModal) successModal.classList.add('open');

  var successContent = document.getElementById('orderSuccessContent');
  if (successContent) {
    successContent.innerHTML =
      '<div class="order-success-content">' +
        '<div class="order-success-icon"><i class="fas fa-check"></i></div>' +
        '<h2 class="order-success-title">Order Placed Successfully! &#127881;</h2>' +
        '<p class="order-success-subtitle">Thank you for shopping with TechMart AI</p>' +
        '<div class="order-success-id">' +
          '<div class="order-success-id-label">Order ID</div>' +
          '<div class="order-success-id-value">' + currentOrderId + '</div>' +
        '</div>' +
        '<div class="order-success-details">' +
          '<div class="order-success-detail-row"><span class="label">Items</span><span class="value">' + cart.reduce(function(s, c) { return s + c.qty; }, 0) + ' product(s)</span></div>' +
          '<div class="order-success-detail-row"><span class="label">Total Amount</span><span class="value">' + formatPrice(total) + '</span></div>' +
          '<div class="order-success-detail-row"><span class="label">Payment</span><span class="value">' + (paymentNames[checkoutData.payment] || checkoutData.payment) + '</span></div>' +
          '<div class="order-success-detail-row"><span class="label">Est. Delivery</span><span class="value" style="color:var(--success)">' + estDays + ' business days</span></div>' +
        '</div>' +
        '<div style="background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:var(--radius-sm);padding:12px;margin-bottom:20px;text-align:left">' +
          '<div style="font-size:0.82rem;color:var(--primary-light);font-weight:600;margin-bottom:4px"><i class="fas fa-robot"></i> Track with Chatbot</div>' +
          '<div style="font-size:0.78rem;color:var(--text-muted)">You can track this order anytime by typing <strong style="color:var(--text)">"Track ' + currentOrderId + '"</strong> in the chatbot!</div>' +
        '</div>' +
        '<button class="btn btn-primary" onclick="closeOrderSuccess()" style="width:100%;justify:center"><i class="fas fa-shopping-bag"></i> Continue Shopping</button>' +
      '</div>';
  }

  // Clear cart
  cart = [];
  updateCartUI();
  showToast('🎉 Order placed successfully!', 'success');
}

function closeOrderSuccess() {
  var modal = document.getElementById('orderSuccessModal');
  if (modal) modal.classList.remove('open');
}

// Checkout initialization
function initCheckout() {
  document.getElementById('checkoutClose')?.addEventListener('click', function() {
    var modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('open');
  });
  document.getElementById('checkoutModal')?.addEventListener('click', function(e) {
    if (e.target === document.getElementById('checkoutModal')) {
      this.classList.remove('open');
    }
  });
  document.getElementById('orderSuccessModal')?.addEventListener('click', function(e) {
    if (e.target === document.getElementById('orderSuccessModal')) {
      closeOrderSuccess();
    }
  });
}

window.startCheckout = startCheckout;
window.closeCheckout = closeCheckout;
window.nextCheckoutStep = nextCheckoutStep;
window.prevCheckoutStep = prevCheckoutStep;
window.selectPayment = selectPayment;
window.placeOrder = placeOrder;
window.closeOrderSuccess = closeOrderSuccess;

// ===== WISHLIST =====
function toggleWishlist(id, btn) {
  const prod = PRODUCTS.find(p => p.id === id);
  if (!prod) return;
  const idx = wishlist.findIndex(w => w.id === id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="far fa-heart"></i>';
    showToast(`Removed from wishlist`, 'info');
  } else {
    wishlist.push(prod);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
    showToast(`${prod.name} added to wishlist!`, 'success');
  }
}
window.toggleWishlist = toggleWishlist;

$('wishlistBtn')?.addEventListener('click', () => {
  showToast(`You have ${wishlist.length} item(s) in wishlist`, 'info');
});

// ===== PRODUCT DETAIL MODAL =====
function openProductDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const specRows = Object.entries(p.specs).map(([k, v]) => `
    <div class="spec-row"><span class="spec-key">${k}</span><span class="spec-val">${v}</span></div>
  `).join('');

  const content = `
    <div class="pd-content">
      <div class="pd-top">
        <div class="pd-img">
          ${p.img ? `<img src="${p.img}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.innerHTML='${p.emoji}'" />` : p.emoji}
        </div>
        <div class="pd-info">
          <div class="pd-category">${p.brand} · ${p.category.toUpperCase()}</div>
          <div class="pd-name">${p.name}</div>
          <div class="pd-brand">by ${p.brand}</div>
          <div class="product-rating">
            <span class="stars">${formatStars(p.rating)}</span>
            <span class="rating-count">(${p.reviews.toLocaleString('en-IN')} reviews)</span>
          </div>
          <div class="pd-price">${formatPrice(p.price)}</div>
          ${p.oldPrice ? `<div class="pd-price-old">${formatPrice(p.oldPrice)} · <span style="color:var(--success)">${discount}% off</span></div>` : ''}
          <div class="product-stock ${p.stock === 'In Stock' ? 'in-stock' : 'low-stock'}">
            <i class="fas fa-circle" style="font-size:0.5rem"></i> ${p.stock}
          </div>
          <div class="pd-specs">
            <h4>Specifications</h4>
            ${specRows}
          </div>
          <div class="pd-actions" style="margin-top:20px">
            <button class="btn btn-primary" onclick="addToCart(${p.id}); document.getElementById('productModal').classList.remove('open')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
            <button class="btn btn-outline" onclick="toggleWishlist(${p.id}, this)"><i class="${wishlist.some(w => w.id === p.id) ? 'fas' : 'far'} fa-heart"></i> Wishlist</button>
          </div>
          <p style="margin-top:16px;color:var(--text-muted);font-size:0.85rem">${p.desc}</p>
        </div>
      </div>
    </div>
  `;

  const modal = $('productModal');
  const content_el = $('productModalContent');
  if (content_el) content_el.innerHTML = content;
  if (modal) modal.classList.add('open');
}

window.openProductDetail = openProductDetail;

function initProductModal() {
  $('productModalClose')?.addEventListener('click', () => $('productModal')?.classList.remove('open'));
  $('productModal')?.addEventListener('click', (e) => { if (e.target === $('productModal')) $('productModal')?.classList.remove('open'); });
}

// ===== CHATBOT =====
function initChatbot() {
  const toggle = $('chatToggle');
  const container = $('chatContainer');
  const openIcon = toggle?.querySelector('.chat-toggle-icon.open');
  const closeIcon = toggle?.querySelector('.chat-toggle-icon.close');
  const input = $('chatInput');
  const sendBtn = $('chatSend');
  const messages = $('chatMessages');
  const typing = $('chatTyping');
  const clearBtn = $('chatClear');
  const minimizeBtn = $('chatMinimize');

  toggle?.addEventListener('click', () => {
    chatOpen = !chatOpen;
    if (container) container.style.display = chatOpen ? 'flex' : 'none';
    if (openIcon) openIcon.style.display = chatOpen ? 'none' : 'flex';
    if (closeIcon) closeIcon.style.display = chatOpen ? 'flex' : 'none';
  });

  minimizeBtn?.addEventListener('click', () => {
    chatOpen = false;
    if (container) container.style.display = 'none';
    if (openIcon) openIcon.style.display = 'flex';
    if (closeIcon) closeIcon.style.display = 'none';
  });

  clearBtn?.addEventListener('click', () => {
    if (!messages) return;
    messages.innerHTML = `
      <div class="chat-welcome">
        <div class="welcome-avatar"><i class="fas fa-robot"></i></div>
        <div class="welcome-text">
          <strong>Hi! I'm TechMart AI 👋</strong>
          <p>Chat cleared! How can I help you?</p>
        </div>
      </div>
      <div class="chat-quick-btns">
        <button class="quick-btn" data-msg="Show gaming laptops under ₹60000">🎮 Gaming Laptops</button>
        <button class="quick-btn" data-msg="Recommend best GPU for gaming">🖥️ Best GPU</button>
        <button class="quick-btn" data-msg="Show SSD under ₹5000">💾 Cheap SSDs</button>
        <button class="quick-btn" data-msg="Track my order">📦 Track Order</button>
        <button class="quick-btn" data-msg="Compare RTX 4060 vs RTX 5060">⚡ Compare GPUs</button>
        <button class="quick-btn" data-msg="What are your payment methods?">💳 Payment Info</button>
      </div>
    `;
    initQuickBtns();
  });

  function initQuickBtns() {
    document.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
    });
  }
  initQuickBtns();

  sendBtn?.addEventListener('click', () => {
    const msg = input?.value.trim();
    if (msg) { sendMessage(msg); if (input) input.value = ''; }
  });

  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const msg = input.value.trim();
      if (msg) { sendMessage(msg); input.value = ''; }
    }
  });

  async function sendMessage(msg) {
    if (!messages) return;
    appendUserMessage(msg);
    if (typing) typing.style.display = 'flex';
    scrollChat();

    const response = await processMessage(msg);
    if (typing) typing.style.display = 'none';
    renderBotResponse(response);
    scrollChat();
  }

  function appendUserMessage(msg) {
    const el = document.createElement('div');
    el.className = 'msg user';
    el.innerHTML = `
      <div class="msg-bubble">${escapeHtml(msg)}</div>
      <div class="msg-avatar"><i class="fas fa-user"></i></div>
    `;
    messages?.appendChild(el);
    scrollChat();
  }

  function renderBotResponse(response) {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg bot';

    let innerHtml = '';

    if (response.type === 'text') {
      innerHtml = `<div class="msg-avatar"><i class="fas fa-robot"></i></div><div class="msg-bubble">${response.content}</div>`;
    } else if (response.type === 'products') {
      const cards = response.products.map(p => `
        <div class="chat-product-card" onclick="openProductDetail(${p.id}); void 0">
          <div class="chat-product-card-img">
            ${p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span class=\\'chat-product-card-emoji-fallback\\'>${p.emoji}</span>'" />` : `<span class="chat-product-card-emoji-fallback">${p.emoji}</span>`}
          </div>
          <div class="chat-product-card-info">
            <div class="chat-product-card-name">${p.name}</div>
            <div class="chat-product-card-price">${formatPrice(p.price)}</div>
            <div class="chat-product-card-specs">${Object.values(p.specs).slice(0, 2).join(' • ')}</div>
          </div>
          <button class="chat-product-card-add" onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
        </div>
      `).join('');
      innerHtml = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-bubble" style="max-width:95%;padding:12px">
          <div style="margin-bottom:10px">${response.intro}</div>
          ${cards}
        </div>
      `;
    } else if (response.type === 'compare') {
      const { p1, p2, allKeys, winner } = response;
      const rows = allKeys.map(key => `
        <tr>
          <td class="spec-key">${key}</td>
          <td>${p1.specs[key] || '—'}</td>
          <td>${p2.specs[key] || '—'}</td>
        </tr>
      `).join('');
      innerHtml = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-bubble" style="max-width:96%;padding:12px">
          <strong>⚡ Comparison: ${p1.name.split(' ').slice(-2).join(' ')} vs ${p2.name.split(' ').slice(-2).join(' ')}</strong>
          <table class="chat-table" style="margin:10px 0">
            <thead><tr><th>Spec</th><th>${p1.name.split(' ').slice(-2).join(' ')}</th><th>${p2.name.split(' ').slice(-2).join(' ')}</th></tr></thead>
            <tbody>
              <tr><td>Price</td><td>${formatPrice(p1.price)}</td><td>${formatPrice(p2.price)}</td></tr>
              <tr><td>Rating</td><td>${p1.rating}⭐</td><td>${p2.rating}⭐</td></tr>
              ${rows}
            </tbody>
          </table>
          <div style="margin-top:8px">🏆 <strong>Our Pick:</strong> ${winner.name} — Better rated overall!</div>
          <div style="margin-top:8px;display:flex;gap:8px">
            <button class="chat-product-card-add" onclick="addToCart(${p1.id})">Add ${p1.name.split(' ').slice(-2).join(' ')}</button>
            <button class="chat-product-card-add" onclick="addToCart(${p2.id})">Add ${p2.name.split(' ').slice(-2).join(' ')}</button>
          </div>
        </div>
      `;
    } else if (response.type === 'order_form') {
      innerHtml = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-bubble" style="max-width:90%;padding:12px">
          <div style="margin-bottom:10px">${response.content}</div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <input id="orderIdInput" type="text" placeholder="e.g. TM10045" style="flex:1;background:var(--dark);border:1px solid var(--dark-border);border-radius:8px;color:var(--text);padding:8px 12px;font-size:0.85rem;font-family:var(--font)" />
            <button class="chat-product-card-add" onclick="trackOrderFromInput()">Track</button>
          </div>
          <div style="margin-top:10px;font-size:0.78rem;color:var(--text-muted)">
            Demo order IDs: TM10045, TM10046, TM10047, TM10048, TM10049
          </div>
        </div>
      `;
    } else if (response.type === 'order_status') {
      const { order, info } = response;
      const stepsHtml = [1,2,3,4].map(s => `<div class="order-step ${s < info.steps ? 'done' : s === info.steps ? 'active' : ''}"></div>`).join('');
      const stepLabels = ['Ordered', 'Shipped', 'Out for Del.', 'Delivered'];
      innerHtml = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-bubble" style="max-width:90%;padding:12px">
          <strong>${info.icon} Order Tracking</strong>
          <div class="chat-order-status" style="margin-top:10px">
            <div class="order-label">Order ID</div>
            <div class="order-val">${order.orderId}</div>
            <div class="order-label">Product</div>
            <div class="order-val">${order.product}</div>
            <div class="order-label">Status</div>
            <div class="order-val ${info.color}">${order.status}</div>
            <div class="order-label">Tracking No.</div>
            <div class="order-val">${order.trackingNo}</div>
            <div class="order-label">Order Date</div>
            <div class="order-val">${order.orderDate}</div>
            <div class="order-progress">${stepsHtml}</div>
            <div style="display:flex;justify-content:space-between;font-size:0.68rem;color:var(--text-muted);margin-top:4px">
              ${stepLabels.map(l => `<span>${l}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (response.type === 'ticket_form') {
      innerHtml = `
        <div class="msg-avatar"><i class="fas fa-robot"></i></div>
        <div class="msg-bubble" style="max-width:92%;padding:12px">
          <strong>🎫 Support Ticket</strong>
          <p style="margin:8px 0;font-size:0.82rem;color:var(--text-muted)">Tell us about your issue and we'll resolve it ASAP:</p>
          <div class="chat-ticket-form">
            <input type="text" id="ticketName" placeholder="Your Name" />
            <input type="text" id="ticketOrder" placeholder="Order ID (e.g. TM10045)" />
            <select id="ticketType">
              <option value="">Select Issue Type</option>
              <option>Damaged Product</option>
              <option>Wrong Product Delivered</option>
              <option>Product Not Working</option>
              <option>Missing Parts</option>
              <option>Other</option>
            </select>
            <textarea id="ticketDesc" placeholder="Describe your issue..."></textarea>
            <button class="btn btn-primary btn-sm" onclick="submitTicket()"><i class="fas fa-paper-plane"></i> Submit Ticket</button>
          </div>
        </div>
      `;
    } else {
      innerHtml = `<div class="msg-avatar"><i class="fas fa-robot"></i></div><div class="msg-bubble">${response.content || 'Sorry, I didn\'t understand that.'}</div>`;
    }

    wrapper.innerHTML = innerHtml;
    messages?.appendChild(wrapper);
  }

  function scrollChat() {
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

// Global chat functions
window.openChatWithMessage = function (msg) {
  const container = $('chatContainer');
  const openIcon = document.querySelector('.chat-toggle-icon.open');
  const closeIcon = document.querySelector('.chat-toggle-icon.close');
  chatOpen = true;
  if (container) container.style.display = 'flex';
  if (openIcon) openIcon.style.display = 'none';
  if (closeIcon) closeIcon.style.display = 'flex';

  const input = $('chatInput');
  if (input) {
    input.value = msg;
    setTimeout(() => {
      $('chatSend')?.click();
    }, 300);
  }
};

window.trackOrderFromInput = async function () {
  const input = $('orderIdInput');
  if (!input) return;
  const id = input.value.trim();
  if (!id) { showToast('Please enter an order ID', 'error'); return; }

  const chatInput = $('chatInput');
  window.openChatWithMessage(`Track my order ${id}`);
};

window.submitTicket = function () {
  const name = $('ticketName')?.value.trim();
  const order = $('ticketOrder')?.value.trim();
  const type = $('ticketType')?.value;
  const desc = $('ticketDesc')?.value.trim();

  if (!name || !type || !desc) { showToast('Please fill all fields', 'error'); return; }

  const ticketId = 'TKT' + Math.floor(Math.random() * 90000 + 10000);
  showToast(`✅ Ticket ${ticketId} created! Our team will contact you within 24 hours.`, 'success');

  // Append success message in chat
  const messages = $('chatMessages');
  if (messages) {
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.innerHTML = `
      <div class="msg-avatar"><i class="fas fa-robot"></i></div>
      <div class="msg-bubble">
        ✅ <strong>Ticket Created!</strong><br/>
        Ticket ID: <strong>${ticketId}</strong><br/>
        Type: ${type}<br/>
        Our support team will contact <strong>${name}</strong> within 24 hours.<br/><br/>
        Is there anything else I can help you with?
      </div>
    `;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }
};

// ===== INIT ALL =====
function init() {
  initNavbar();
  initCategories();
  initProducts();
  renderDeals();
  initTimer();
  initCart();
  initCheckout();
  initProductModal();
  initChatbot();
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  setTimeout(init, 100);
}
