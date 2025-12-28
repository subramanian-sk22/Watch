// Basic site JavaScript: smooth scroll, video controls, buy handlers
(function(){
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Video controls: click toggles play/pause, double-click toggles mute
  const video = document.querySelector('.video-background video');
  if (video) {
    video.muted = true;
    video.addEventListener('click', () => {
      if (video.paused) video.play(); else video.pause();
    });
    video.addEventListener('dblclick', () => {
      video.muted = !video.muted;
    });
  }

  // Buy button handler - add to cart and redirect to payment
  document.querySelectorAll('.buy-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const title = card ? (card.querySelector('h3')?.innerText || 'item') : 'item';
      const priceText = card ? (card.querySelector('p')?.innerText || '0') : '0';
      const price = parseInt(priceText.replace(/[^\d]/g, ''));

      // Get current cart from localStorage
      let cart = [];
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        cart = JSON.parse(savedCart);
      }

      // Add or update item in cart
      const existingItem = cart.find(item => item.name === title);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({
          id: cart.length + 1,
          name: title,
          price: price,
          quantity: 1
        });
      }

      // Save cart and redirect
      localStorage.setItem('cart', JSON.stringify(cart));
      btn.disabled = true;
      btn.textContent = 'Added to Cart';
      btn.style.opacity = '0.85';
      
      // Redirect to payment page after a brief delay
      setTimeout(() => {
        window.location.href = 'payment.html';
      }, 800);
    });
  });

  // CTA button scroll-to-products
  const cta = document.querySelector('.cta-button');
  if (cta) cta.addEventListener('click', () => {
    const target = document.querySelector('#products');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Expose a small API for console testing
window.siteHelpers = {
  scrollTo: selector => { const el = document.querySelector(selector); if (el) el.scrollIntoView({ behavior: 'smooth' }); },
  toggleVideoPlay: () => { const v = document.querySelector('.video-background video'); if (v) v.paused ? v.play() : v.pause(); },
    toggleVideoMute: () => { const v = document.querySelector('.video-background video'); if (v) v.muted = !v.muted; },
  addToCart: title => { console.log('Pretend add to cart:', title); }
};

})();
