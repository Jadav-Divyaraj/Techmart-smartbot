import { useEffect, useRef } from 'react';
import './styles/main.css';

export default function App() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Import and run the main script after the HTML is injected
    // @ts-ignore
    import('./scripts/main.js').catch(console.error);
  }, []);

  return (
    <div id="techmart-app" dangerouslySetInnerHTML={{ __html: getHTML() }} />
  );
}

function getHTML(): string {
  return `
<!-- ===== NAVBAR ===== -->
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <div class="nav-logo">
      <span class="logo-icon"><i class="fas fa-microchip"></i></span>
      <span class="logo-text">TechMart </span>
    </div>
    <ul class="nav-links" id="navLinks">
      <li><a href="#home" class="nav-link active">Home</a></li>
      <li><a href="#products" class="nav-link">Products</a></li>
      <li><a href="#deals" class="nav-link">Deals</a></li>
      <li><a href="#brands" class="nav-link">Brands</a></li>
      <li><a href="#support" class="nav-link">Support</a></li>
    </ul>
    <div class="nav-actions">
      <button class="nav-icon-btn" id="searchToggle" title="Search"><i class="fas fa-search"></i></button>
      <button class="nav-icon-btn" id="cartBtn" title="Cart"><i class="fas fa-shopping-cart"></i><span class="cart-count" id="cartCount">0</span></button>
      <button class="nav-icon-btn" id="wishlistBtn" title="Wishlist"><i class="fas fa-heart"></i></button>
      <div class="nav-credit-badge" title="Developed by Divyarajsinh Jadav – R.C. Technical Institute">
        <span class="credit-dot"></span>
        <span class="credit-name">Divyarajsinh</span>
      </div>
      <button class="hamburger" id="hamburger"><i class="fas fa-bars"></i></button>
    </div>
  </div>
  <div class="search-overlay" id="searchOverlay">
    <div class="search-box">
      <i class="fas fa-search search-icon-inner"></i>
      <input type="text" id="globalSearch" placeholder="Search CPUs, GPUs, Laptops, RAM..." />
      <button class="search-close" id="searchClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="search-results" id="searchResults"></div>
  </div>
</nav>

<!-- ===== HERO ===== -->
<section class="hero" id="home">
  <div class="hero-bg">
    <img src="https://images.pexels.com/photos/30469968/pexels-photo-30469968.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1400" alt="Gaming Setup" class="hero-bg-img" />
    <div class="hero-overlay"></div>
  </div>
  <div class="hero-content">
    <div class="hero-badge"><i class="fas fa-bolt"></i> New Arrivals In Stock</div>
    <h1 class="hero-title">Power Your<br/><span class="hero-highlight">Digital World</span></h1>
    <p class="hero-subtitle">Premium computer hardware at unbeatable prices. CPUs, GPUs, RAM, SSDs &amp; more — delivered fast across India.</p>
    <div class="hero-actions">
      <a href="#products" class="btn btn-primary"><i class="fas fa-shopping-bag"></i> Shop Now</a>
      <a href="#deals" class="btn btn-outline"><i class="fas fa-fire"></i> Hot Deals</a>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><span class="stat-num">10,000+</span><span class="stat-label">Products</span></div>
      <div class="hero-stat"><span class="stat-num">50,000+</span><span class="stat-label">Customers</span></div>
      <div class="hero-stat"><span class="stat-num">4.9★</span><span class="stat-label">Rating</span></div>
    </div>
  </div>
  <div class="hero-scroll"><i class="fas fa-chevron-down"></i></div>
</section>

<!-- ===== ANNOUNCEMENT BAR ===== -->
<div class="announcement-bar">
  <div class="announcement-track" id="announcementTrack">
    <span><i class="fas fa-truck"></i> Free Shipping on orders above ₹2999</span>
    <span><i class="fas fa-shield-alt"></i> 1 Year Warranty on All Products</span>
    <span><i class="fas fa-undo"></i> 7-Day Easy Returns</span>
    <span><i class="fas fa-headset"></i> 24/7 AI Customer Support</span>
    <span><i class="fas fa-tag"></i> Use code TECHMART10 for 10% off</span>
    <span><i class="fas fa-truck"></i> Free Shipping on orders above ₹2999</span>
    <span><i class="fas fa-shield-alt"></i> 1 Year Warranty on All Products</span>
    <span><i class="fas fa-undo"></i> 7-Day Easy Returns</span>
    <span><i class="fas fa-headset"></i> 24/7 AI Customer Support</span>
    <span><i class="fas fa-tag"></i> Use code TECHMART10 for 10% off</span>
  </div>
</div>

<!-- ===== CATEGORIES ===== -->
<section class="categories-section" id="categories">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Shop by Category</h2>
      <p class="section-subtitle">Browse our wide range of computer hardware</p>
    </div>
    <div class="categories-grid">
      <div class="category-card" data-category="cpu"><div class="cat-icon"><i class="fas fa-microchip"></i></div><h3>CPUs</h3><p>Processors</p><span class="cat-count">42 items</span></div>
      <div class="category-card" data-category="gpu"><div class="cat-icon"><i class="fas fa-tv"></i></div><h3>GPUs</h3><p>Graphics Cards</p><span class="cat-count">38 items</span></div>
      <div class="category-card" data-category="ram"><div class="cat-icon"><i class="fas fa-memory"></i></div><h3>RAM</h3><p>Memory</p><span class="cat-count">55 items</span></div>
      <div class="category-card" data-category="ssd"><div class="cat-icon"><i class="fas fa-hdd"></i></div><h3>SSDs</h3><p>Storage</p><span class="cat-count">47 items</span></div>
      <div class="category-card" data-category="motherboard"><div class="cat-icon"><i class="fas fa-server"></i></div><h3>Motherboards</h3><p>Mainboards</p><span class="cat-count">31 items</span></div>
      <div class="category-card" data-category="monitor"><div class="cat-icon"><i class="fas fa-desktop"></i></div><h3>Monitors</h3><p>Displays</p><span class="cat-count">29 items</span></div>
      <div class="category-card" data-category="keyboard"><div class="cat-icon"><i class="fas fa-keyboard"></i></div><h3>Keyboards</h3><p>Peripherals</p><span class="cat-count">63 items</span></div>
      <div class="category-card" data-category="mouse"><div class="cat-icon"><i class="fas fa-mouse"></i></div><h3>Mice</h3><p>Peripherals</p><span class="cat-count">44 items</span></div>
      <div class="category-card" data-category="laptop"><div class="cat-icon"><i class="fas fa-laptop"></i></div><h3>Laptops</h3><p>Portable PCs</p><span class="cat-count">56 items</span></div>
    </div>
  </div>
</section>

<!-- ===== FEATURED PRODUCTS ===== -->
<section class="products-section" id="products">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Featured Products</h2>
      <p class="section-subtitle">Handpicked by our experts</p>
    </div>
    <div class="products-filter">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="cpu">CPUs</button>
      <button class="filter-btn" data-filter="gpu">GPUs</button>
      <button class="filter-btn" data-filter="ram">RAM</button>
      <button class="filter-btn" data-filter="ssd">SSDs</button>
      <button class="filter-btn" data-filter="motherboard">Motherboards</button>
      <button class="filter-btn" data-filter="monitor">Monitors</button>
      <button class="filter-btn" data-filter="keyboard">Keyboards</button>
      <button class="filter-btn" data-filter="mouse">Mice</button>
      <button class="filter-btn" data-filter="laptop">Laptops</button>
    </div>
    <div class="products-grid" id="productsGrid"></div>
    <div class="products-load-more">
      <button class="btn btn-outline" id="loadMoreBtn"><i class="fas fa-plus"></i> Load More Products</button>
    </div>
  </div>
</section>

<!-- ===== DEALS ===== -->
<section class="deals-section" id="deals">
  <div class="container">
    <div class="section-header light">
      <h2 class="section-title">🔥 Hot Deals</h2>
      <p class="section-subtitle">Limited time offers — don't miss out!</p>
    </div>
    <div class="deals-timer">
      <span>Deal ends in:</span>
      <div class="timer-box"><span id="timerH">08</span><small>Hrs</small></div>
      <div class="timer-box"><span id="timerM">45</span><small>Min</small></div>
      <div class="timer-box"><span id="timerS">30</span><small>Sec</small></div>
    </div>
    <div class="deals-grid" id="dealsGrid"></div>
  </div>
</section>

<!-- ===== BRANDS ===== -->
<section class="brands-section" id="brands">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Top Brands</h2>
      <p class="section-subtitle">We carry only the best</p>
    </div>
    <div class="brands-track-wrapper">
      <div class="brands-track">
        <div class="brand-logo">NVIDIA</div>
        <div class="brand-logo">AMD</div>
        <div class="brand-logo">Intel</div>
        <div class="brand-logo">ASUS</div>
        <div class="brand-logo">MSI</div>
        <div class="brand-logo">Corsair</div>
        <div class="brand-logo">Samsung</div>
        <div class="brand-logo">WD</div>
        <div class="brand-logo">Seagate</div>
        <div class="brand-logo">Kingston</div>
        <div class="brand-logo">Gigabyte</div>
        <div class="brand-logo">ZOTAC</div>
        <div class="brand-logo">NVIDIA</div>
        <div class="brand-logo">AMD</div>
        <div class="brand-logo">Intel</div>
        <div class="brand-logo">ASUS</div>
        <div class="brand-logo">MSI</div>
        <div class="brand-logo">Corsair</div>
      </div>
    </div>
  </div>
</section>

<!-- ===== WHY US ===== -->
<section class="why-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Why TechMart AI?</h2>
    </div>
    <div class="why-grid">
      <div class="why-card"><div class="why-icon"><i class="fas fa-shield-alt"></i></div><h3>Genuine Products</h3><p>100% authentic hardware from authorized distributors with full warranty coverage.</p></div>
      <div class="why-card"><div class="why-icon"><i class="fas fa-truck"></i></div><h3>Fast Delivery</h3><p>Same-day dispatch for in-stock items. Delivery in 2–5 business days pan-India.</p></div>
      <div class="why-card"><div class="why-icon"><i class="fas fa-robot"></i></div><h3>AI Assistant</h3><p>Our smart chatbot helps you find products, compare specs & resolve issues instantly.</p></div>
      <div class="why-card"><div class="why-icon"><i class="fas fa-tags"></i></div><h3>Best Price</h3><p>Price-matched guarantee. If you find it cheaper, we'll match or beat the price.</p></div>
      <div class="why-card"><div class="why-icon"><i class="fas fa-undo"></i></div><h3>Easy Returns</h3><p>Hassle-free 7-day return policy. No questions asked for defective products.</p></div>
      <div class="why-card"><div class="why-icon"><i class="fas fa-headset"></i></div><h3>Expert Support</h3><p>Technical experts available via chat and phone to help you build your perfect PC.</p></div>
    </div>
  </div>
</section>

<!-- ===== SUPPORT ===== -->
<section class="support-section" id="support">
  <div class="container">
    <div class="section-header light">
      <h2 class="section-title">Customer Support</h2>
      <p class="section-subtitle">We're here to help you every step of the way</p>
    </div>
    <div class="support-grid">
      <div class="support-card"><i class="fas fa-search"></i><h3>Track Order</h3><p>Check your order status and live tracking</p><button class="btn btn-sm btn-outline" onclick="openChatWithMessage('Track my order')">Track Now</button></div>
      <div class="support-card"><i class="fas fa-undo-alt"></i><h3>Returns &amp; Refunds</h3><p>Easy return initiation within 7 days</p><button class="btn btn-sm btn-outline" onclick="openChatWithMessage('I want to return my product')">Start Return</button></div>
      <div class="support-card"><i class="fas fa-tools"></i><h3>Complaint</h3><p>Report issues and create support tickets</p><button class="btn btn-sm btn-outline" onclick="openChatWithMessage('I have a complaint about my product')">File Complaint</button></div>
      <div class="support-card"><i class="fas fa-question-circle"></i><h3>FAQs</h3><p>Find answers to common questions</p><button class="btn btn-sm btn-outline" onclick="openChatWithMessage('What are your payment methods?')">View FAQs</button></div>
    </div>
  </div>
</section>

<!-- ===== FOOTER ===== -->
<footer class="footer">
  <div class="footer-top">
    <div class="container footer-grid">
      <div class="footer-col footer-brand">
        <div class="footer-logo"><i class="fas fa-microchip"></i> TechMart <span>AI</span></div>
        <p>India's most trusted online store for computer hardware and peripherals. Powered by AI.</p>
        <div class="footer-social">
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-youtube"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#deals">Deals</a></li>
          <li><a href="#brands">Brands</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Categories</h4>
        <ul>
          <li><a href="#products" data-filter-link="cpu">CPUs</a></li>
          <li><a href="#products" data-filter-link="gpu">GPUs</a></li>
          <li><a href="#products" data-filter-link="laptop">Laptops</a></li>
          <li><a href="#products" data-filter-link="ssd">SSDs</a></li>
          <li><a href="#products" data-filter-link="ram">RAM</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a href="#support">Track Order</a></li>
          <li><a href="#support">Returns</a></li>
          <li><a href="#support">Warranty</a></li>
          <li><a href="#support">Contact Us</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <ul class="footer-contact">
          <li><i class="fas fa-phone"></i> +91 98765 43210</li>
          <li><i class="fas fa-envelope"></i> support@techmart.ai</li>
          <li><i class="fas fa-map-marker-alt"></i> Bengaluru, Karnataka</li>
          <li><i class="fas fa-clock"></i> Mon–Sat, 9AM–6PM</li>
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <p>&copy; 2025 TechMart AI. All rights reserved.</p>
      <div class="payment-icons">
        <span><i class="fab fa-cc-visa"></i></span>
        <span><i class="fab fa-cc-mastercard"></i></span>
        <span><i class="fas fa-mobile-alt"></i> UPI</span>
        <span><i class="fas fa-university"></i> NetBanking</span>
        <span><i class="fas fa-money-bill-wave"></i> COD</span>
      </div>
      <div class="developer-credit">
        <span class="credit-line">Developed by <strong>Divyarajsinh Jadav</strong></span>
        <span class="credit-divider">|</span>
        <span class="credit-line"><i class="fas fa-graduation-cap"></i> R.C. Technical Institute</span>
        <span class="credit-divider">|</span>
        <span class="credit-line">Diploma Student</span>
      </div>
    </div>
  </div>
</footer>

<!-- ===== CART MODAL ===== -->
<div class="modal-overlay" id="cartModal">
  <div class="modal cart-modal" id="cartModalBox">
    <div class="modal-header">
      <h3><i class="fas fa-shopping-cart"></i> Your Cart</h3>
      <button class="modal-close" id="cartClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="cart-items" id="cartItems">
      <div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Your cart is empty</p></div>
    </div>
    <div class="cart-footer" id="cartFooter" style="display:none">
      <div class="cart-total">Total: <strong id="cartTotal">₹0</strong></div>
      <button class="btn btn-primary" onclick="startCheckout()"><i class="fas fa-bolt"></i> Checkout</button>
    </div>
  </div>
</div>

<!-- ===== CHECKOUT MODAL ===== -->
<div class="modal-overlay" id="checkoutModal">
  <div class="modal checkout-modal">
    <div class="modal-header">
      <h3 id="checkoutTitle"><i class="fas fa-credit-card"></i> Checkout</h3>
      <button class="modal-close" id="checkoutClose"><i class="fas fa-times"></i></button>
    </div>
    <div class="checkout-steps">
      <div class="checkout-step active" data-step="1"><span class="step-num">1</span><span class="step-label">Cart</span></div>
      <div class="checkout-step-line"></div>
      <div class="checkout-step" data-step="2"><span class="step-num">2</span><span class="step-label">Payment</span></div>
      <div class="checkout-step-line"></div>
      <div class="checkout-step" data-step="3"><span class="step-num">3</span><span class="step-label">Confirm</span></div>
    </div>
    <div class="checkout-content" id="checkoutContent">
      <!-- Step content rendered dynamically -->
    </div>
  </div>
</div>

<!-- ===== ORDER SUCCESS MODAL ===== -->
<div class="modal-overlay" id="orderSuccessModal">
  <div class="modal order-success-modal">
    <div class="order-success-content" id="orderSuccessContent">
      <!-- Rendered dynamically -->
    </div>
  </div>
</div>

<!-- ===== PRODUCT DETAIL MODAL ===== -->
<div class="modal-overlay" id="productModal">
  <div class="modal product-modal">
    <button class="modal-close" id="productModalClose"><i class="fas fa-times"></i></button>
    <div id="productModalContent"></div>
  </div>
</div>

<!-- ===== CHATBOT WIDGET ===== -->
<div class="chat-widget" id="chatWidget">
  <button class="chat-toggle" id="chatToggle" title="Chat with AI Assistant">
    <span class="chat-toggle-icon open"><i class="fas fa-robot"></i></span>
    <span class="chat-toggle-icon close" style="display:none"><i class="fas fa-times"></i></span>
    <span class="chat-badge">AI</span>
  </button>
  <div class="chat-container" id="chatContainer" style="display:none">
    <div class="chat-header">
      <div class="chat-header-info">
        <div class="chat-avatar"><i class="fas fa-robot"></i></div>
        <div>
          <div class="chat-name">TechMart AI</div>
          <div class="chat-status"><span class="status-dot"></span> Online</div>
        </div>
      </div>
      <div class="chat-header-actions">
        <button class="chat-header-btn" id="chatMinimize" title="Minimize"><i class="fas fa-minus"></i></button>
        <button class="chat-header-btn" id="chatClear" title="Clear Chat"><i class="fas fa-trash"></i></button>
      </div>
    </div>
    <div class="chat-messages" id="chatMessages">
      <div class="chat-welcome">
        <div class="welcome-avatar"><i class="fas fa-robot"></i></div>
        <div class="welcome-text">
          <strong>Hi! I'm TechMart AI 👋</strong>
          <p>I can help you find products, compare specs, track orders, check compatibility, and much more!</p>
        </div>
      </div>
      <div class="chat-quick-btns">
        <button class="quick-btn" data-msg="Show gaming laptops under ₹60000">🎮 Gaming Laptops</button>
        <button class="quick-btn" data-msg="Recommend best GPU for gaming">🖥️ Best GPU</button>
        <button class="quick-btn" data-msg="Show SSD under ₹5000">💾 Cheap SSDs</button>
        <button class="quick-btn" data-msg="Track my order">📦 Track Order</button>
        <button class="quick-btn" data-msg="Compare RTX 4060 vs RTX 5060 Ti">⚡ Compare GPUs</button>
        <button class="quick-btn" data-msg="What are your payment methods?">💳 Payment Info</button>
      </div>
    </div>
    <div class="chat-typing" id="chatTyping" style="display:none">
      <div class="typing-indicator"><span></span><span></span><span></span></div>
      <span>TechMart AI is thinking...</span>
    </div>
    <div class="chat-input-area">
      <input type="text" id="chatInput" placeholder="Ask about products, orders, specs..." />
      <button class="chat-send" id="chatSend"><i class="fas fa-paper-plane"></i></button>
    </div>
  </div>
</div>

<!-- ===== BACK TO TOP ===== -->
<button class="back-to-top" id="backToTop"><i class="fas fa-chevron-up"></i></button>

<!-- ===== TOAST ===== -->
<div class="toast-container" id="toastContainer"></div>

<!-- ===== FLOATING DEVELOPER CREDIT (Mobile Only) ===== -->
<div class="floating-credit" id="floatingCredit">
  <span class="floating-credit-dot"></span>
  <span class="floating-credit-text">Developed by <strong>Divyaraj Jadav</strong></span>
</div>
`;
}
