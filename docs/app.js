// ── Smooth scroll for nav links ─────────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Update active state
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ── Update active nav on scroll ─────────────────────────
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-100px 0px -60% 0px' });

sections.forEach(section => observer.observe(section));

// ── Animate elements on scroll ──────────────────────────
const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.feature-card, .flow-container, .sitemap-group, .tech-group').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  animateOnScroll.observe(el);
});

// ── Stagger animation for feature cards ─────────────────
document.querySelectorAll('.features-grid').forEach(grid => {
  const cards = grid.querySelectorAll('.feature-card');
  cards.forEach((card, i) => {
    card.style.transitionDelay = `${i * 60}ms`;
  });
});

// ── Stagger for sitemap groups ──────────────────────────
document.querySelectorAll('.sitemap-group').forEach((group, i) => {
  group.style.transitionDelay = `${i * 100}ms`;
});

// ── Click to highlight route in sitemap ─────────────────
document.querySelectorAll('.tree-node').forEach(node => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.tree-node').forEach(n => n.style.background = '');
    node.style.background = 'var(--accent-light)';
    setTimeout(() => { node.style.background = ''; }, 2000);
  });
});
