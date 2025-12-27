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

  // Buy button handler (simple demo behaviour)
  document.querySelectorAll('.buy-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const title = card ? (card.querySelector('h3')?.innerText || 'item') : 'item';
      if (confirm(`Add "${title}" to cart?`)) {
        btn.disabled = true;
        btn.textContent = 'Added';
        btn.style.opacity = '0.85';
        console.log('Added to cart:', title);
      }
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
