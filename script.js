// Custom cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});
function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Portfolio filter (visual only)
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .portfolio-item, .review-card, .stat-item, .carousel-slide').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Add stagger to grid children
document.querySelectorAll('.services-grid .service-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.1}s`;
});
document.querySelectorAll('.portfolio-grid .portfolio-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.reviews-grid .review-card').forEach((el, i) => {
  el.style.transitionDelay = `${i * 0.12}s`;
});

// ── CAROUSEL ──────────────────────────────────────────────
(function () {
  const track    = document.getElementById('carouselTrack');
  const dotsWrap = document.getElementById('carouselDots');
  const btnPrev  = document.getElementById('carouselPrev');
  const btnNext  = document.getElementById('carouselNext');
  if (!track) return;

  const slides      = Array.from(track.querySelectorAll('.carousel-slide'));
  const slideWidth  = () => slides[0].offsetWidth + 19; // 19 = gap (1.2rem ≈ 19px)
  const visibleCount = () => Math.floor(track.parentElement.offsetWidth / slideWidth()) || 1;
  let current = 0;
  const total = slides.length;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    const max = total - visibleCount();
    current = Math.max(0, Math.min(index, max));
    track.style.transform = `translateX(-${current * slideWidth()}px)`;
    updateDots();
  }

  btnPrev.addEventListener('click', () => goTo(current - 1));
  btnNext.addEventListener('click', () => goTo(current + 1));

  // Touch / drag support
  let startX = 0, isDragging = false;
  track.addEventListener('mousedown',  e => { isDragging = true; startX = e.clientX; });
  track.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].clientX; }, {passive:true});
  track.addEventListener('mousemove',  e => { if (isDragging) e.preventDefault(); });
  track.addEventListener('mouseup',    e => { if (!isDragging) return; isDragging = false; const dx = e.clientX - startX; if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1); });
  track.addEventListener('touchend',   e => { if (!isDragging) return; isDragging = false; const dx = e.changedTouches[0].clientX - startX; if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1); });

  // Auto-advance every 4 seconds
  let autoTimer = setInterval(() => {
    const max = total - visibleCount();
    goTo(current >= max ? 0 : current + 1);
  }, 4000);

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.parentElement.addEventListener('mouseleave', () => {
    autoTimer = setInterval(() => {
      const max = total - visibleCount();
      goTo(current >= max ? 0 : current + 1);
    }, 4000);
  });

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(current));
})();