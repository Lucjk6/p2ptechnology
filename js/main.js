/* ══════════════════════════════════════════
   P2P Technology — Main Script
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Mobile nav toggle ──
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle && navLinks && navOverlay) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      navOverlay.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navOverlay.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navOverlay.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });

    // Close button inside nav panel
    var navClose = document.querySelector('.nav-close');
    if (navClose) {
      navClose.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Close menu on link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navOverlay.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ── Active nav link highlight on scroll ──
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a');

  function highlightNav() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = '#F5C400';
          }
        });
      }
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ── Contact form handling ──
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatus.className = 'form-status';
      formStatus.textContent = '';

      var nome = contactForm.elements.nome.value.trim();
      var email = contactForm.elements.email.value.trim();
      var messaggio = contactForm.elements.messaggio.value.trim();

      if (!nome || !email || !messaggio) {
        formStatus.textContent = 'Compila tutti i campi prima di inviare.';
        formStatus.className = 'form-status error';
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        formStatus.textContent = 'Inserisci un indirizzo email valido.';
        formStatus.className = 'form-status error';
        return;
      }

      // ── Send to Formspree ──
      var FORMSPREE_ID = 'mojyjwza';

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso...';

      fetch('https://formspree.io/f/' + FORMSPREE_ID, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ nome: nome, email: email, messaggio: messaggio })
      })
        .then(function (response) {
          if (response.ok) {
            formStatus.textContent = 'Messaggio inviato con successo! Ti risponderemo entro 24 ore.';
            formStatus.className = 'form-status success';
            contactForm.reset();
          } else {
            formStatus.textContent = 'Errore nell\'invio. Riprova o scrivici direttamente via email.';
            formStatus.className = 'form-status error';
          }
        })
        .catch(function () {
          formStatus.textContent = 'Errore di connessione. Controlla la tua rete e riprova.';
          formStatus.className = 'form-status error';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Invia messaggio';
        });
    });
  }

  // ── Fade-in on scroll (IntersectionObserver) ──
  var fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // ── Cookie banner ──
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');

  if (cookieBanner && cookieAccept) {
    if (localStorage.getItem('cookieAccepted')) {
      cookieBanner.classList.add('hidden');
    }
    cookieAccept.addEventListener('click', function () {
      localStorage.setItem('cookieAccepted', '1');
      cookieBanner.classList.add('hidden');
    });
  }

  // ── Dynamic portfolio loading ──
  var GRADIENTS = {
    concert: 'linear-gradient(135deg, #0a0a0a 0%, #1a1200 50%, #0a0a0a 100%)',
    fashion: 'linear-gradient(135deg, #0a0a0a 0%, #0d0a1a 50%, #0a0a0a 100%)',
    led:     'linear-gradient(135deg, #0a0a0a 0%, #001a1a 50%, #0a0a0a 100%)',
    expo:    'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 50%, #0a0a0a 100%)'
  };
  var FALLBACK_PROJECTS = [
    { title: 'Concerto Estate 2024', category: 'Evento \u00b7 Milano', description: 'Impianto luci completo con movinghead, LED wall e gestione scenografica.', image: '', gradient: 'concert' },
    { title: 'Fashion Show', category: 'Scenografia \u00b7 Torino', description: 'Scenografia immersiva con proiezioni e giochi di luce.', image: '', gradient: 'fashion' },
    { title: 'LED Wall Corporate', category: 'Installazione', description: 'LED wall ad alta risoluzione per conferenza aziendale.', image: '', gradient: 'led' },
    { title: 'Expo Stand', category: 'Impianto \u00b7 Fiera', description: 'Impianto elettrico dedicato per stand fieristico.', image: '', gradient: 'expo' }
  ];

  function escapeHtml(str) {
    var d = document.createElement('div');
    d.textContent = str || '';
    return d.innerHTML;
  }

  function renderPortfolio(projects) {
    projects = projects.slice(0, 20); // Max 20 foto
    var track = document.getElementById('sliderTrack');
    var dotsContainer = document.getElementById('sliderDots');
    var captionEl = document.getElementById('slideCaption');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    if (!track) return;
    track.innerHTML = '';
    dotsContainer.innerHTML = '';

    var current = 0;

    projects.forEach(function (p, i) {
      var slide = document.createElement('div');
      slide.className = 'slider-slide';

      var title = escapeHtml(p.title);
      var grad = GRADIENTS[p.gradient] || GRADIENTS.concert;

      if (p.image) {
        slide.innerHTML = '<img src="' + escapeHtml(p.image) + '" alt="' + title + '" loading="lazy">';
      } else {
        slide.innerHTML =
          '<div class="slide-placeholder" style="background:' + grad + '">' +
            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' +
            '<span>' + title + '</span>' +
          '</div>';
      }
      track.appendChild(slide);

      var dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Vai alla foto ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsContainer.appendChild(dot);
    });

    function updateCaption(index) {
      if (!captionEl) return;
      var p = projects[index];
      captionEl.innerHTML =
        '<span>' + escapeHtml(p.category) + '</span>' +
        '<h4>' + escapeHtml(p.title) + '</h4>' +
        '<p>' + escapeHtml(p.description) + '</p>';
    }

    function goTo(index) {
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      var dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
      updateCaption(current);
    }

    // Init caption
    updateCaption(0);

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(current > 0 ? current - 1 : projects.length - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(current < projects.length - 1 ? current + 1 : 0);
      });
    }

    // Touch swipe support
    var startX = 0;
    var slider = document.getElementById('portfolioSlider');
    if (slider) {
      slider.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
      }, { passive: true });
      slider.addEventListener('touchend', function (e) {
        var diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) goTo(current < projects.length - 1 ? current + 1 : 0);
          else goTo(current > 0 ? current - 1 : projects.length - 1);
        }
      });
    }
  }

  function loadPortfolio() {
    fetch('data/portfolio.json')
      .then(function (res) {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(function (projects) {
        renderPortfolio(projects);
      })
      .catch(function () {
        renderPortfolio(FALLBACK_PROJECTS);
      });
  }

  loadPortfolio();

  // ── Hero particle network animation ──
  (function () {
    var canvas = document.getElementById('heroParticles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 80;
    var CONNECT_DIST = 140;
    var mouse = { x: -9999, y: -9999 };
    var animId;

    function resize() {
      var hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1,
          alpha: Math.random() * 0.5 + 0.3
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            var opacity = (1 - dist / CONNECT_DIST) * 0.15;
            ctx.strokeStyle = 'rgba(255,107,53,' + opacity + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & move particles
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];

        // Mouse repulsion
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 120) {
          p.x += mdx * 0.02;
          p.y += mdy * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,107,53,' + p.alpha + ')';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    // Track mouse for interactive repulsion (desktop only)
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      var heroEl = canvas.closest('.hero');
      if (heroEl) {
        heroEl.addEventListener('mousemove', function (e) {
          var rect = canvas.getBoundingClientRect();
          mouse.x = e.clientX - rect.left;
          mouse.y = e.clientY - rect.top;
        });
        heroEl.addEventListener('mouseleave', function () {
          mouse.x = -9999;
          mouse.y = -9999;
        });
      }
    }

    var lastWidth = 0;
    window.addEventListener('resize', function () {
      var hero = canvas.parentElement;
      var newWidth = hero.offsetWidth;
      // Only recreate on actual width change (ignore mobile address bar toggle)
      if (newWidth !== lastWidth) {
        lastWidth = newWidth;
        resize();
        createParticles();
      }
    });

    resize();
    lastWidth = canvas.width;
    createParticles();
    draw();
  })();

})();
