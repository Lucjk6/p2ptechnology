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
  // ── Flip cards on click ──
  var flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(function (card) {
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });

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

  // ── Animated counters ──
  var statNums = document.querySelectorAll('.stat-num[data-target]');
  if (statNums.length && 'IntersectionObserver' in window) {
    var counterDone = false;
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterDone) {
          counterDone = true;
          statNums.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            if (target === 0) {
              el.textContent = '0' + suffix;
              return;
            }
            var duration = 1800;
            var start = 0;
            var startTime = null;

            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
              var current = Math.floor(eased * target);
              el.textContent = current + suffix;
              if (progress < 1) {
                requestAnimationFrame(step);
              } else {
                el.textContent = target + suffix;
              }
            }
            requestAnimationFrame(step);
          });
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });

    statNums.forEach(function (el) {
      counterObserver.observe(el);
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
})();
