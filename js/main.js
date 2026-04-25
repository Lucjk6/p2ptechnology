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

  // ── i18n Language Switch ──
  var translations = {
    en: {
      'nav.chi': 'About us',
      'nav.servizi': 'Services',
      'nav.progetti': 'Projects',
      'nav.contatti': 'Contact',
      'hero.tag': 'Stage Design & Lights · Media Server · Security',
      'hero.title': 'We Design.<br>We Build.<br><em>We Illuminate.</em>',
      'hero.sub': 'We turn ideas into extraordinary visual experiences. Cutting-edge technology and creative vision for events, concerts and television.',
      'hero.cta1': 'Explore services',
      'hero.cta2': 'Contact us',
      'chi.label': 'About us / Chi siamo',
      'chi.title': 'Born from experience,<br>driven by passion.',
      'chi.mission': 'P2P Technology was founded to <strong>revolutionize the world of entertainment</strong>. We combine cutting-edge technology and creative vision for events, concerts and television.',
      'chi.s1': 'Shows',
      'chi.s2': 'Events',
      'chi.s3': 'Concerts',
      'chi.s4': 'Television',
      'chi.s5': 'Trade Fairs & Stands',
      'serv.label': 'Our services / I nostri servizi',
      'serv.title': 'From vision to reality.',
      'serv.h1': 'Design',
      'serv.p1': 'We turn your ideas into detailed technical projects. Lighting design, 3D rendering and stage planning.',
      'serv.h2': 'Build',
      'serv.p2': 'We build and configure every element with the best tools in the industry, ensuring quality and safety.',
      'serv.h3': 'Installation',
      'serv.p3': 'Our technical team follows every phase on-site, ensuring flawless execution from setup to go-live.',
      'serv.badge': 'Full service',
      'sceno.title': 'Light is our language.',
      'sceno.l1': 'Lighting design for stages and outdoor',
      'sceno.l2': 'Custom-built scenic structures',
      'sceno.l3': 'LED walls and video wall surfaces',
      'sceno.l4': 'DMX control systems and show programming',
      'sceno.l5': 'Static and dynamic LED strips — ArtNet management',
      'sceno.l6': 'LED dots and scenic pixel mapping',
      'sceno.l7': 'Custom scenic and decorative lighting',
      'sceno.l8': 'Professional equipment rental and sales',
      'sceno.qlabel': 'Creative possibilities',
      'sceno.quote': '"Every idea deserves to be illuminated the right way."',
      'media.title': 'Video that makes the difference.',
      'media.desc': 'Professional management of real-time video content for concerts, events and TV productions. We can orchestrate any visual surface with absolute precision.',
      'media.t1': 'Video mapping',
      'media.t2': 'Real-time content generation',
      'media.t3': 'Audio-video sync',
      'media.t4': 'Multi-output management',
      'media.t5': 'Integration with lighting control systems',
      'sec.label': 'Security & Surveillance / Sicurezza',
      'sec.title': 'Protecting what matters.',
      'sec.desc1': '<strong>Security</strong> is an integral part of our services. We design and install alarm and video surveillance systems for venues, production facilities and commercial spaces, integrating the most advanced technology with our field experience.',
      'sec.desc2': 'A single partner for entertainment and security.',
      'sec.h1': 'Video Surveillance',
      'sec.p1': 'IP, analog and hybrid CCTV systems. Remote management and cloud storage.',
      'sec.h2': 'Alarm Systems',
      'sec.p2': 'Anti-intrusion control panels, volumetric and perimeter sensors, real-time notifications.',
      'sec.h3': 'Access Control',
      'sec.p3': 'Badges, biometrics and integrated systems for venues and production spaces.',
      'sec.h4': 'Maintenance',
      'sec.p4': 'Preventive and corrective assistance with guaranteed fast response.',
      'proj.label': 'Our work / I nostri lavori',
      'proj.title': 'Projects that speak for themselves.',
      'cont.label': 'Start your project / Inizia il tuo progetto',
      'cont.title': 'Let\'s talk about your event.',
      'cont.intro': 'We are ready to turn your idea into an unforgettable show.',
      'cont.r1': 'Account Manager & CEO',
      'cont.b1': 'The commercial and strategic point of reference. Coordinates client relations, business development and company vision.',
      'cont.r2': 'Media Server & Stage Mgr',
      'cont.b2': 'Visual content and media server specialist. Transforms surfaces into high-impact video canvases.',
      'cont.r3': 'Stage Lighting Manager',
      'cont.b3': 'Stage design expert. Plans and directs every lighting installation with precision and creativity.',
      'cont.r4': 'Alarms & Surveillance Mgr',
      'cont.b4': 'Specialist in integrated security systems. Ensures space protection with tailored solutions.',
      'form.nameL': 'Name',
      'form.nameP': 'Your name',
      'form.emailP': 'email@example.com',
      'form.msgL': 'Message',
      'form.msgP': 'Describe your project...',
      'form.send': 'Send message',
      'footer.copy': '&copy; 2026 P2P Technology S.R.L. &mdash; all rights reserved &middot; <a href="privacy.html">Privacy Policy</a>',
      'cookie.text': 'This site uses third-party services (Google Fonts, Formspree) that may collect data. See the <a href="privacy.html">Privacy Policy</a>.',
      'cookie.btn': 'Got it'
    },
    it: {
      'nav.chi': 'Chi siamo',
      'nav.servizi': 'Servizi',
      'nav.progetti': 'Progetti',
      'nav.contatti': 'Contatti',
      'hero.tag': 'Scenotecnica & Luci · Media Server · Sicurezza',
      'hero.title': 'Progettiamo.<br>Realizziamo.<br><em>Illuminiamo.</em>',
      'hero.sub': 'Trasformiamo idee in esperienze visive straordinarie. Tecnica d\'avanguardia e visione creativa per eventi, concerti e televisione.',
      'hero.cta1': 'Scopri i servizi',
      'hero.cta2': 'Contattaci',
      'chi.label': 'Chi siamo / Who we are',
      'chi.title': 'Nati dall\'esperienza,<br>mossi dalla passione.',
      'chi.mission': 'P2P Technology nasce per <strong>rivoluzionare il mondo dello spettacolo</strong>. Combiniamo tecnica d\'avanguardia e visione creativa per eventi, concerti e televisione.',
      'chi.s1': 'Spettacoli',
      'chi.s2': 'Eventi',
      'chi.s3': 'Concerti',
      'chi.s4': 'Televisione',
      'chi.s5': 'Fiere & Stand',
      'serv.label': 'I nostri servizi / Our services',
      'serv.title': 'Dalla visione alla realtà.',
      'serv.h1': 'Progettazione',
      'serv.p1': 'Trasformiamo le tue idee in progetti tecnici dettagliati. Design lighting, rendering 3D e planning scenotecnico.',
      'serv.h2': 'Realizzazione',
      'serv.p2': 'Costruiamo e configuriamo ogni elemento con i migliori strumenti del settore, assicurando qualità e sicurezza.',
      'serv.h3': 'Installazione',
      'serv.p3': 'Il nostro team tecnico segue ogni fase in loco, garantendo un\'esecuzione impeccabile dal montaggio al go-live.',
      'serv.badge': 'Servizio completo',
      'sceno.title': 'La luce è il nostro linguaggio.',
      'sceno.l1': 'Lighting design per palcoscenici e outdoor',
      'sceno.l2': 'Strutture scenografiche su misura',
      'sceno.l3': 'LED wall e superfici videowall',
      'sceno.l4': 'Sistemi di controllo DMX e programmazione show',
      'sceno.l5': 'Strip LED statiche e dinamiche — gestione ArtNet',
      'sceno.l6': 'Dot luminosi e pixel mapping scenografico',
      'sceno.l7': 'Illuminotecnica scenografica e d\'arredo su misura',
      'sceno.l8': 'Noleggio e vendita attrezzatura professionale',
      'sceno.qlabel': 'Possibilità creative',
      'sceno.quote': '"Ogni idea merita di essere illuminata nel modo giusto."',
      'media.title': 'Il video che fa la differenza.',
      'media.desc': 'Gestione professionale di contenuti video in tempo reale per concerti, eventi e produzioni TV. Siamo in grado di orchestrare qualsiasi superficie visiva con precisione assoluta.',
      'media.t1': 'Mappatura video',
      'media.t2': 'Generazione contenuti real-time',
      'media.t3': 'Sincronizzazione audio-video',
      'media.t4': 'Gestione multi-output',
      'media.t5': 'Integrazione con sistemi di controllo luci',
      'sec.label': 'Sicurezza & Videosorveglianza / Security Systems',
      'sec.title': 'Proteggere ciò che conta.',
      'sec.desc1': 'La <strong>sicurezza</strong> è parte integrante dei nostri servizi. Progettiamo e installiamo sistemi di allarme e videosorveglianza per venue, strutture produttive e spazi commerciali, integrando la tecnologia più avanzata con la nostra esperienza sul campo.',
      'sec.desc2': 'Un unico interlocutore per spettacolo e sicurezza.',
      'sec.h1': 'Videosorveglianza',
      'sec.p1': 'Sistemi TVCC IP, analogici e ibridi. Gestione remota e archiviazione cloud.',
      'sec.h2': 'Sistemi d\'Allarme',
      'sec.p2': 'Centrali anti-intrusione, sensori volumetrici e perimetrali, notifiche real-time.',
      'sec.h3': 'Controllo Accessi',
      'sec.p3': 'Badge, biometria e sistemi integrati per venue e spazi produttivi.',
      'sec.h4': 'Manutenzione',
      'sec.p4': 'Assistenza preventiva e correttiva con intervento rapido garantito.',
      'proj.label': 'I nostri lavori / Our work',
      'proj.title': 'Progetti che parlano da soli.',
      'cont.label': 'Inizia il tuo progetto / Start your project',
      'cont.title': 'Parliamo del tuo evento.',
      'cont.intro': 'Siamo pronti a trasformare la tua idea in uno spettacolo indimenticabile.',
      'cont.r1': 'Account Manager & CEO',
      'cont.b1': 'Il punto di riferimento commerciale e strategico. Coordina relazioni clienti, sviluppo business e visione aziendale.',
      'cont.r2': 'Resp. Media Server & Sceno',
      'cont.b2': 'Specialista di visual content e media server. Trasforma le superfici in canvas video di altissimo impatto.',
      'cont.r3': 'Resp. Tecnico Scenoluminoso',
      'cont.b3': 'Esperto di scenotecnica. Progetta e dirige ogni installazione luminosa con precisione e creatività.',
      'cont.r4': 'Resp. Allarmi & Videosorveglianza',
      'cont.b4': 'Tecnico specializzato in sistemi di sicurezza integrati. Garantisce la protezione degli spazi con soluzioni su misura.',
      'form.nameL': 'Nome',
      'form.nameP': 'Il tuo nome',
      'form.emailP': 'email@esempio.it',
      'form.msgL': 'Messaggio',
      'form.msgP': 'Descrivi il tuo progetto...',
      'form.send': 'Invia messaggio',
      'footer.copy': '&copy; 2026 P2P Technology S.R.L. &mdash; tutti i diritti riservati &middot; <a href="privacy.html">Privacy Policy</a>',
      'cookie.text': 'Questo sito utilizza servizi di terze parti (Google Fonts, Formspree) che potrebbero raccogliere dati. Consulta la <a href="privacy.html">Privacy Policy</a>.',
      'cookie.btn': 'Ho capito'
    }
  };

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (translations[lang] && translations[lang][key]) {
        el.placeholder = translations[lang][key];
      }
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
    });
  });

  // Apply saved language
  var savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (e) {}
  if (savedLang && translations[savedLang]) {
    setLang(savedLang);
  }

})();
