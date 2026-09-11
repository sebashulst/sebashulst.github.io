/* ==========================================================================
   Sebastiaan Hulst — portfolio
   Vanilla JS. GSAP + ScrollTrigger + Lenis komen van een CDN.
   Valt netjes terug op een statische pagina als die niet laden.
   ========================================================================== */
(function () {
  'use strict';

  var hasGSAP = typeof window.gsap !== 'undefined';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touch = window.matchMedia('(pointer: coarse)').matches;
  var animate = hasGSAP && !reduced;

  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- fallback: alles zichtbaar zonder animatie ---------------- */
  function showEverything() {
    document.querySelectorAll('.fade-up').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    document.querySelectorAll('.reveal-word > span').forEach(function (el) {
      el.style.transform = 'none';
    });
    var l = document.getElementById('loader');
    if (l) l.style.display = 'none';
  }

  /* ---------- tekst opsplitsen in woorden ------------------------------ */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = '1';
    var html = '';
    el.textContent.trim().split(/\s+/).forEach(function (w) {
      html += '<span class="reveal-word"><span>' + w + '</span></span> ';
    });
    el.innerHTML = html;
  }

  /* ---------- smooth scroll -------------------------------------------- */
  var lenis = null;
  if (typeof window.Lenis !== 'undefined' && !reduced) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1 });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: 0 }); }
      });
    });
  }

  /* ---------- custom cursor -------------------------------------------- */
  if (!touch && !reduced) {
    var ring = document.createElement('div'); ring.className = 'cursor';
    var dot = document.createElement('div'); dot.className = 'cursor-dot';
    document.body.appendChild(ring); document.body.appendChild(dot);
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest('a,button,input,textarea')) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest('a,button,input,textarea')) ring.classList.remove('is-hover');
    });
  }

  /* ---------- magnetische knoppen -------------------------------------- */
  if (animate && !touch) {
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.4,
          duration: .6, ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)' });
      });
    });
  }

  /* ---------- werk-lijst: beeld volgt de cursor ------------------------ */
  var preview = document.getElementById('preview');
  if (preview && animate && !touch) {
    var pimg = preview.querySelector('img');
    var px = 0, py = 0, tx = 0, ty = 0, placed = false, current = null, frame = 0;

    function showPreview(item) {
      if (current === item) return;
      current = item;
      pimg.src = item.dataset.preview;
      gsap.to(preview, { opacity: 1, duration: .35, ease: 'power2.out' });
      gsap.fromTo(pimg, { scale: 1.25 }, { scale: 1, duration: .9, ease: 'power3.out' });
    }
    function hidePreview() {
      if (!current) return;
      current = null;
      gsap.to(preview, { opacity: 0, duration: .3, ease: 'power2.out' });
    }
    function itemUnderCursor() {
      var el = document.elementFromPoint(tx, ty);
      return el ? el.closest('.work-item[data-preview]') : null;
    }

    document.querySelectorAll('.work-item[data-preview]').forEach(function (item) {
      item.addEventListener('mouseenter', function () { showPreview(item); });
      item.addEventListener('mouseleave', hidePreview);
    });
    document.addEventListener('mouseleave', hidePreview);
    addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!placed) { px = tx; py = ty; placed = true; }
    });

    (function ploop() {
      // Tijdens scrollen beweegt de muis niet, dus vuurt mouseleave niet en
      // blijft het beeld hangen. Daarom een paar keer per seconde zelf kijken
      // wat er werkelijk onder de cursor ligt.
      if (placed && ++frame % 5 === 0) {
        var under = itemUnderCursor();
        if (under) showPreview(under); else hidePreview();
      }
      px += (tx - px) * 0.1; py += (ty - py) * 0.1;
      var w = preview.offsetWidth, h = preview.offsetHeight;
      preview.style.transform = 'translate(' + (px - w / 2) + 'px,' + (py - h / 2) + 'px) rotate(' + ((tx - px) * 0.06) + 'deg)';
      requestAnimationFrame(ploop);
    })();
  }

  /* ---------- marquee --------------------------------------------------- */
  document.querySelectorAll('.marquee').forEach(function (m) {
    var track = m.querySelector('.marquee-track');
    if (!track) return;
    var content = track.innerHTML;
    for (var i = 0; i < 3; i++) track.innerHTML += content;
    if (!animate) return;
    var w = track.scrollWidth / 4;
    gsap.to(track, { x: -w, duration: 22, ease: 'none', repeat: -1 });
  });

  /* ---------- scroll-reveals -------------------------------------------- */
  /* Een reveal mag niet los van de hero-intro opkomen: wat bij het laden al in
     beeld staat, zou anders animeren terwijl de curtain nog dicht is. Alles wat
     binnenkomt voordat de intro klaar is, wacht hier in de rij. Meten of iets
     "in beeld" staat op het moment van init is geen optie: de webfont laadt
     later en verschuift de layout dan alsnog. */
  var introKlaar = false;
  var wachtrij = [];

  function naIntro(fn) {
    if (introKlaar) fn(0); else wachtrij.push(fn);
  }

  function introIsKlaar() {
    if (introKlaar) return;
    introKlaar = true;
    wachtrij.forEach(function (fn, i) { fn(i * .12); });
    wachtrij.length = 0;
  }

  function initReveals() {
    if (!animate || !window.ScrollTrigger) { showEverything(); return; }

    document.querySelectorAll('[data-split]').forEach(splitWords);

    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.dataset.noscroll !== undefined) return;
      gsap.to(el.querySelectorAll('.reveal-word > span'), {
        y: '0%', duration: 1.05, ease: 'expo.out', stagger: 0.045,
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    gsap.utils.toArray('.fade-up').forEach(function (el) {
      var tw = gsap.to(el, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out',
        delay: parseFloat(el.dataset.delay || 0),
        paused: true
      });
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          naIntro(function (extra) {
            if (extra) gsap.delayedCall(extra, function () { tw.play(); });
            else tw.play();
          });
        }
      });
    });

    gsap.utils.toArray('.rule').forEach(function (el) {
      gsap.fromTo(el, { scaleX: 0 }, {
        scaleX: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 95%' }
      });
    });

    gsap.utils.toArray('[data-parallax]').forEach(function (el) {
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    var hero = document.querySelector('[data-hero-fade]');
    if (hero) {
      gsap.to(hero, {
        opacity: 0, y: -60, ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '+=60%', scrub: true }
      });
    }
  }

  /* ---------- intro + page transitions ---------------------------------- */
  var curtain = document.getElementById('curtain');
  var loader = document.getElementById('loader');

  function introFirstVisit() {
    var count = loader.querySelector('.l-count');
    var bar = loader.querySelector('.l-bar');
    var name = loader.querySelector('.l-name span');
    document.body.classList.add('is-locked');
    var tl = gsap.timeline({
      onComplete: function () {
        document.body.classList.remove('is-locked');
        loader.style.display = 'none';
        playHero();
      }
    });
    var o = { v: 0 };
    tl.to(name, { y: '0%', duration: 1, ease: 'expo.out' }, 0)
      .to(bar, { width: '100%', duration: 1.7, ease: 'power2.inOut' }, 0)
      .to(o, {
        v: 100, duration: 1.7, ease: 'power2.inOut',
        onUpdate: function () { count.textContent = String(Math.round(o.v)).padStart(3, '0'); }
      }, 0)
      .to(loader, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, 1.85);
  }

  function playHero() {
    var h = document.querySelector('[data-hero]');
    if (!h) { introIsKlaar(); return; }
    var tl = gsap.timeline();
    tl.to(h.querySelectorAll('.reveal-word > span'), { y: '0%', duration: 1.2, ease: 'expo.out', stagger: .05 })
      .to(h.querySelectorAll('.hero-in'), { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: .1 }, '-=.75')
      .call(introIsKlaar, null, '-=.2');
  }

  function setupTransitions() {
    if (!animate || !curtain) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || a.target === '_blank') return;
      if (/^(https?:|mailto:|tel:)/.test(href)) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        gsap.timeline()
          .set(curtain, { yPercent: 100, y: 0 })
          .to(curtain, { yPercent: 0, y: 0, duration: .7, ease: 'expo.inOut' })
          .call(function () { location.href = href; });
      });
    });
  }

  /* ---------- hero: cue naar de volgende sectie ------------------------- */
  /* De hairline vult zich precies over de afstand waarin de hero uitfadet,
     zodat hij vol staat op het moment dat de cue zelf verdwijnt. */
  (function () {
    var cue = document.querySelector('.next-cue');
    if (!cue) return;

    var wachtend = false;

    function update() {
      wachtend = false;
      var afstand = window.innerHeight * .6;
      var p = afstand > 0 ? Math.min(window.scrollY / afstand, 1) : 1;
      cue.style.setProperty('--cue', (p * 100).toFixed(1) + '%');
      cue.classList.toggle('is-idle', p < .01);
    }

    function onScroll() {
      if (!wachtend) { wachtend = true; requestAnimationFrame(update); }
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  })();

  /* ---------- contactformulier ------------------------------------------ */
  var form = document.getElementById('contact-form');
  if (form) {
    var note = form.querySelector('.form-note');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var action = form.getAttribute('action') || '';
      if (!action) return;

      note.textContent = 'Versturen\u2026';
      note.className = 'form-note';
      if (submitBtn) submitBtn.disabled = true;

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (r) {
          // Formspree antwoordt met JSON, ook bij een foutstatus.
          return r.json()
            .catch(function () { return {}; })
            .then(function (data) {
              if (!r.ok) throw data;
              return data;
            });
        })
        .then(function () {
          form.reset();
          note.textContent = 'Bericht verstuurd. Ik reageer meestal binnen een dag.';
          note.className = 'form-note is-ok';
        })
        .catch(function (data) {
          // Veldfouten van Formspree tonen; anders een algemene melding.
          var errors = data && data.errors;
          note.textContent = errors && errors.length
            ? errors.map(function (x) { return x.message; }).join(' ')
            : 'Verzenden lukte niet. Mail me gerust direct op sebastiaanhulst@hotmail.nl.';
          note.className = 'form-note is-err';
        })
        .then(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  /* ---------- start ------------------------------------------------------ */
  if (!animate) {
    showEverything();
  } else {
    document.querySelectorAll('[data-hero] [data-split]').forEach(splitWords);
    gsap.set('[data-hero] .hero-in', { opacity: 0, y: 26 });
    initReveals();
    if (loader && !sessionStorage.getItem('shp-seen')) {
      sessionStorage.setItem('shp-seen', '1');
      introFirstVisit();
    } else {
      if (loader) loader.style.display = 'none';
      gsap.set(curtain, { yPercent: 0, y: 0 });
      gsap.to(curtain, { yPercent: -100, y: 0, duration: .9, ease: 'expo.inOut', onComplete: playHero });
    }
    setupTransitions();
  }
})();
