/* ── Selectors ── */
    const navbar    = document.getElementById('navbar');
    const overlay   = document.getElementById('overlay');
    const progress  = document.getElementById('progress');
    const navLinks  = document.querySelectorAll('.nav-link');
    const navLinksEl = document.getElementById('navLinks');
    const navToggle  = document.getElementById('navToggle');
    const sections  = document.querySelectorAll('section[id]');

    /* ── Mobile hamburger menu ── */
    function closeMobileMenu() {
      navLinksEl.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        const isOpen = navLinksEl.classList.toggle('open');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });
    }
 
    /* ── NAV: hide on scroll-down, show on scroll-up ── */
    let lastY   = 0;
    let rafPending = false;
 
    window.addEventListener('scroll', () => {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
 
        // Progress bar
        const max = document.body.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
 
        // Hide/show navbar
        if (y > lastY && y > 90) {
          navbar.classList.add('hide');
        } else {
          navbar.classList.remove('hide');
        }
 
        // Active nav link
        updateActiveLink(y);
 
        lastY = y;
        rafPending = false;
      });
    }, { passive: true });
 
    /* ── Active section highlight ── */
    function updateActiveLink(scrollY) {
      let current = 'home';
      sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 120) {
          current = sec.getAttribute('id');
        }
      });
      navLinks.forEach(a => {
        a.classList.toggle('active', a.dataset.sec === current);
      });
    }
 
    /* ── Smooth nav click with flash transition ── */
    function flashScroll(targetEl) {
      overlay.classList.add('flash');
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => overlay.classList.remove('flash'), 280);
      }, 160);
    }
 
    navLinks.forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        closeMobileMenu();
        if (target) flashScroll(target);
      });
    });
 
    // Logo click
    document.querySelector('[data-nav-logo]').addEventListener('click', e => {
      e.preventDefault();
      closeMobileMenu();
      overlay.classList.add('flash');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => overlay.classList.remove('flash'), 280);
      }, 160);
    });
 
    /* ── Projects carousel arrows ── */
    const projGrid = document.getElementById('projGrid');
    const projPrev = document.getElementById('projPrev');
    const projNext = document.getElementById('projNext');

    if (projGrid && projPrev && projNext) {
      // One card width + the 24px gap
      function cardStep() {
        const card = projGrid.querySelector('.proj-card');
        return card ? card.getBoundingClientRect().width + 24 : 394;
      }

      projPrev.addEventListener('click', () => {
        projGrid.scrollBy({ left: -cardStep(), behavior: 'smooth' });
      });
      projNext.addEventListener('click', () => {
        projGrid.scrollBy({ left: cardStep(), behavior: 'smooth' });
      });

      // Dim arrows when there is nothing more to show in that direction
      function updateProjNav() {
        const maxScroll = projGrid.scrollWidth - projGrid.clientWidth - 2;
        projPrev.classList.toggle('off', projGrid.scrollLeft <= 2);
        projNext.classList.toggle('off', projGrid.scrollLeft >= maxScroll);
      }
      projGrid.addEventListener('scroll', updateProjNav, { passive: true });
      window.addEventListener('resize', updateProjNav);
      updateProjNav();

      /* ── Drag to scroll: hold left click and move the mouse ── */
      let isDragging = false;
      let hasDragged = false;
      let dragStartX = 0;
      let dragStartScroll = 0;

      projGrid.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;          // left button only
        isDragging = true;
        hasDragged = false;
        dragStartX = e.pageX;
        dragStartScroll = projGrid.scrollLeft;
        projGrid.classList.add('dragging');
        e.preventDefault();                  // stop text/image selection
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.pageX - dragStartX;
        if (Math.abs(dx) > 5) hasDragged = true;
        projGrid.scrollLeft = dragStartScroll - dx;
      });

      window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        projGrid.classList.remove('dragging'); // snap back to nearest card
      });

      // Swallow the click if the user was dragging, so links don't open
      projGrid.addEventListener('click', (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
        }
      }, true);
    }

    /* ── Scroll Reveal via IntersectionObserver ── */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
 
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.classList.add('on');
          /* Optionally stop observing after first reveal:
             io.unobserve(target); */
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
 
    revealEls.forEach(el => io.observe(el));
 
    /* ── Trigger hero immediately on load ── */
    window.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('#home .reveal, #home .reveal-right').forEach((el, i) => {
        setTimeout(() => el.classList.add('on'), 80 + i * 110);
      });
    });