// SukhSainiCabs — main.js
document.addEventListener('DOMContentLoaded', function () {

  // Navbar scroll
  const navbar = document.querySelector('.navbar');
  const scrollBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 400);
  });

  // Mobile menu
  const burger = document.querySelector('.hamburger');
  const mMenu  = document.querySelector('.mobile-menu');
  if (burger && mMenu) {
    burger.addEventListener('click', () => {
      const open = mMenu.classList.toggle('open');
      const [a, b, c] = burger.querySelectorAll('span');
      a.style.transform = open ? 'rotate(45deg) translate(5px,5px)'  : '';
      b.style.opacity   = open ? '0' : '';
      c.style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
    });
    mMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mMenu.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  // Active nav on scroll
  const secs = document.querySelectorAll('section[id]');
  const navAs = document.querySelectorAll('.nav-links a');
  secs.forEach(sec => {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id));
      });
    }, { rootMargin: '-40% 0px -40% 0px' }).observe(sec);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 78, behavior: 'smooth' }); }
    });
  });

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.service-card,.why-card,.fleet-card,.tour-card,.permit-card');
  fadeEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; el.style.transition = 'opacity 0.45s ease, transform 0.45s ease'; });
  const fObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'none'; }, (i % 4) * 75);
        fObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fObs.observe(el));

  // Counter animation
  document.querySelectorAll('.stat-number[data-count]').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const tgt = parseInt(el.dataset.count), suf = el.dataset.suffix || '';
        let cur = 0; const inc = tgt / 50;
        const t = setInterval(() => { cur += inc; if (cur >= tgt) { cur = tgt; clearInterval(t); } el.textContent = Math.floor(cur) + suf; }, 28);
      }
    }, { threshold: 0.5 }).observe(el);
  });
});
