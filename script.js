/* ============================================
   Cafe 55 Varanasi — Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Navbar scroll effect ---- */
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  const handleScroll = () => {
    const current = window.scrollY;
    navbar.classList.toggle('scrolled', current > 50);
    lastScroll = current;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ---- Mobile menu toggle ---- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  const toggleMenu = () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  /* ---- Scroll reveal animations ---- */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---- Animated stat counters ---- */
  const statNumbers = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const divide = parseInt(el.dataset.divide || '1', 10);
    const duration = 2000;
    const startTime = performance.now();

    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const displayValue = current / divide;

      if (isDecimal) {
        el.textContent = displayValue.toFixed(1) + suffix;
      } else {
        const rounded = Math.floor(displayValue);
        el.textContent = rounded.toLocaleString('en-IN') + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1) + suffix;
        } else {
          el.textContent = (target / divide).toLocaleString('en-IN') + suffix;
        }
      }
    };

    requestAnimationFrame(update);
  };

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => statObserver.observe(el));

  /* ---- Reservation form ---- */
  const form = document.getElementById('reservationForm');
  const successMsg = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('resName').value.trim();
    const phone = document.getElementById('resPhone').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;

    if (!name || !phone || !date || !time || !guests) {
      successMsg.style.color = 'var(--color-error)';
      successMsg.textContent = 'Please fill in all fields to confirm your reservation.';
      return;
    }

    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
    if (!phoneRegex.test(phone)) {
      successMsg.style.color = 'var(--color-error)';
      successMsg.textContent = 'Please enter a valid phone number.';
      return;
    }

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      successMsg.style.color = 'var(--color-error)';
      successMsg.textContent = 'Please select a future date.';
      return;
    }

    successMsg.style.color = 'var(--color-success)';
    successMsg.textContent = `Thank you, ${name}! Your table for ${guests} guest(s) on ${date} at ${time} has been reserved. We'll call you shortly to confirm.`;

    form.reset();
  });

  /* ---- Set min date on reservation date input ---- */
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    const scrollPos = window.scrollY + 120;
    let currentId = '';

    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinkEls.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = href === currentId ? 'var(--color-gold)' : '';
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });
});
