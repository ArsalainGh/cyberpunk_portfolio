document.addEventListener('contextmenu', function(e) {
    e.preventDefault(); // Disables the right-click menu
    alert("don't try i know what kind of man you are");  // Shows your custom message
  });

/* ============================================================
   CYBERPUNK ANIME PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ============================================================
   THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  }
})();

function setupThemeToggle() {
  const toggles = document.querySelectorAll('.theme-toggle');
  const html = document.documentElement;

  function updateToggleLabels() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    toggles.forEach(btn => {
      const icon = btn.querySelector('.icon');
      const label = btn.querySelector('.label');
      if (icon) icon.textContent = isDark ? '☀' : '◑';
      if (label) label.textContent = isDark ? 'LIGHT' : 'DARK';
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleLabels();
    });
  });

  updateToggleLabels();
}

/* ============================================================
   BURGER MENU
   ============================================================ */
function setupBurgerMenu() {
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!burger || !mobileMenu) return;

  function openMenu() {
    burger.classList.add('open');
    mobileMenu.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
  }

  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  burger.addEventListener('click', () => {
    if (burger.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector('.navbar')?.offsetHeight || 64;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function setupScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   CURSOR GLOW (desktop only)
   ============================================================ */
function setupCursorGlow() {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;
  if (window.matchMedia('(pointer: coarse)').matches) {
    glow.style.display = 'none';
    return;
  }

  let mx = 0, my = 0;
  let cx = 0, cy = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    raf = requestAnimationFrame(animate);
  }

  animate();
}

/* ============================================================
   FLOATING PARTICLES
   ============================================================ */
function setupParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  const COLORS = [
    'rgba(0,245,255,0.7)',
    'rgba(255,43,214,0.6)',
    'rgba(138,92,255,0.6)',
    'rgba(124,255,107,0.5)',
    'rgba(255,233,61,0.5)'
  ];

  const COUNT = window.innerWidth < 768 ? 10 : 22;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1.5;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 18 + 12;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(p);
  }
}

/* ============================================================
   INTERSECTION OBSERVER — FADE IN
   ============================================================ */
function setupScrollReveal() {
  const style = document.createElement('style');
  style.textContent = `
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1);
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const targets = document.querySelectorAll(
    '.glass-card, .timeline-item, .section-title, .section-label, .hero-badge, .blog-post-card'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   AVATAR FALLBACK
   ============================================================ */
function setupAvatarFallback() {
  const avatarImgs = document.querySelectorAll('.hero-avatar img');
  avatarImgs.forEach(img => {
    img.addEventListener('error', () => {
      const fallback = img.closest('.hero-avatar').querySelector('.avatar-fallback');
      if (fallback) {
        img.style.display = 'none';
        fallback.style.display = 'flex';
      }
    });

    // If already broken (cached)
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/* ============================================================
   PROJECT IMAGE FALLBACK
   ============================================================ */
function setupProjectImgFallback() {
  document.querySelectorAll('.project-img img').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = img.closest('.project-img').querySelector('.project-img-placeholder');
      if (placeholder) {
        img.style.display = 'none';
        placeholder.style.display = 'flex';
      }
    });

    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event('error'));
    }
  });
}

/* ============================================================
   BLOG FILTER (blog.html only)
   ============================================================ */
function setupBlogFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const posts = document.querySelectorAll('.blog-post-card');
  if (!filterBtns.length || !posts.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      posts.forEach(post => {
        const tags = post.getAttribute('data-tags') || '';
        const show = filter === 'all' || tags.includes(filter);
        post.style.transition = 'opacity 0.3s, transform 0.3s';
        if (show) {
          post.style.opacity = '1';
          post.style.transform = 'scale(1)';
          post.style.display = '';
        } else {
          post.style.opacity = '0';
          post.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (!tags.includes(filter) && filter !== 'all') {
              post.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}

/* ============================================================
   TYPED EFFECT (hero tagline accent)
   ============================================================ */
function setupTypedEffect() {
  const el = document.getElementById('typed-role');
  if (!el) return;

  const words = ['Web Developer', 'Linux Enthusiast', 'Security Learner', 'CS Student', 'Open Source Fan','I Use Arch Btw'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = words[wIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(type, 1600);
        return;
      }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 55 : 90);
  }

  type();
}

/* ============================================================
   NAVBAR SCROLL STYLE
   ============================================================ */
function setupNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.style.boxShadow = '0 2px 30px rgba(0,0,0,0.45)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupBurgerMenu();
  setupSmoothScroll();
  setupScrollTop();
  setupCursorGlow();
  setupParticles();
  setupScrollReveal();
  setupAvatarFallback();
  setupProjectImgFallback();
  setupBlogFilter();
  setupTypedEffect();
  setupNavbarScroll();
});
