// ============== HEM Utilities — Shared Interactions ==============

document.addEventListener('DOMContentLoaded', () => {

  // ---- Loader ----
  const loader = document.querySelector('.loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 280);
    });
    // fallback in case 'load' already fired
    setTimeout(() => loader.classList.add('hide'), 1400);
  }

  // ---- Header scroll state ----
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const toTop = document.querySelector('.to-top');
    if (toTop) {
      if (window.scrollY > 500) toTop.classList.add('show');
      else toTop.classList.remove('show');
    }
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Mobile nav toggle ----
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
    });
  }

  // ---- Dropdown nav items (click-to-toggle on touch/mobile, hover on desktop handled by CSS) ----
  document.querySelectorAll('.nav-item.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 760) {
        e.preventDefault();
        const item = link.closest('.nav-item');
        document.querySelectorAll('.nav-item.open').forEach(other => {
          if (other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      }
    });
  });

  // close mobile nav when a real link inside dropdown is clicked
  document.querySelectorAll('.dropdown a, .nav-link[href]:not([href="#"])').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth <= 760) {
        mainNav?.classList.remove('open');
        navToggle?.classList.remove('open');
      }
    });
  });

  // ---- Back to top ----
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---- Animated counters ----
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      const isFloat = String(target).includes('.');
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = (isFloat ? value.toFixed(1) : Math.round(value)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          co.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => co.observe(el));
  }

  // ---- Active nav link highlighting based on current path ----
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href !== '#' && href.split('/').pop() === path) {
      a.classList.add('active');
      const parentDropItem = a.closest('.nav-item');
      if (parentDropItem) {
        const parentTopLink = parentDropItem.parentElement?.closest('.nav-item')?.querySelector('.nav-link');
        parentTopLink?.classList.add('active');
      }
    }
  });

});
