/**
 * NYA — UI interactions (scroll reveal, nav, smooth scroll, form)
 * js/ui.js  — plain script, no external dependencies
 */

/* ─── Nav scroll effect ──────────────────────────────────────── */
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── Smooth scroll for nav links ───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ─── Scroll reveal ──────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ─── Contact form prevent default ──────────────────────────── */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => e.preventDefault());
}
