/* ============================================
   ANIMATIONS ENGINE
   ============================================ */

(function () {
  'use strict';

  /* --- 1. Typewriter Effect --- */
  function initTypewriter() {
    var el = document.querySelector('.typewriter');
    if (!el) {
      // No typewriter on this page, trigger terminal immediately
      setTimeout(initTerminal, 300);
      return;
    }

    var lines = (el.getAttribute('data-text') || '').split('|');
    var cursor = document.createElement('span');
    cursor.className = 'cursor';
    el.appendChild(cursor);

    var lineIdx = 0;
    var charIdx = 0;
    var textNode = document.createTextNode('');
    el.insertBefore(textNode, cursor);

    function type() {
      if (lineIdx >= lines.length) {
        setTimeout(function () { cursor.style.display = 'none'; }, 2000);
        // Trigger terminal after typewriter finishes
        initTerminal();
        return;
      }

      var line = lines[lineIdx];
      if (charIdx < line.length) {
        textNode.textContent += line[charIdx];
        charIdx++;
        setTimeout(type, 45 + Math.random() * 35);
      } else {
        lineIdx++;
        if (lineIdx < lines.length) {
          var br = document.createElement('br');
          el.insertBefore(br, cursor);
          textNode = document.createTextNode('');
          el.insertBefore(textNode, cursor);
          charIdx = 0;
          setTimeout(type, 200);
        } else {
          type();
        }
      }
    }

    setTimeout(type, 400);
  }

  /* --- 1b. Terminal Intro Animation --- */
  function initTerminal() {
    var terminal = document.getElementById('hero-terminal');
    var body = document.getElementById('terminal-body');
    if (!terminal || !body) return;

    var script = [
      { type: 'cmd', prompt: '>', text: ' arush.role()' },
      { type: 'output', text: '<span class="t-key">Sr. Product Manager</span> <span class="t-comment">// Platform @ PointClickCare</span>' },
      { type: 'output', text: 'Building the auth layer between patient data' },
      { type: 'output', text: 'and everything that wants it. Doctors. Admins. <span class="t-highlight">AI agents.</span>' },
      { type: 'blank' },
      { type: 'cmd', prompt: '>', text: ' arush.career()' },
      { type: 'output', text: '<span class="t-stat">10+ years</span> building + shipping products at scale' },
      { type: 'output', text: '<span class="t-highlight">PokerStars</span> <span class="t-comment">(72M+ users)</span> \u2192 <span class="t-highlight">FinTech</span> <span class="t-comment">(420M+ credit cards)</span> \u2192 HealthTech' },
      { type: 'output', text: '<span class="t-stat">0\u21921</span> builds. <span class="t-stat">M+ users</span>. <span class="t-stat">M+ revenue</span>. Still going.' },
      { type: 'blank' },
      { type: 'cmd', prompt: '>', text: ' arush.stack()' },
      { type: 'output', text: '<span class="t-key">tools:</span>  <span class="t-val">LLMs \u2022 platform thinking \u2022 unreasonable optimism</span>' },
      { type: 'output', text: '<span class="t-key">fuel:</span>   <span class="t-val">alarming amounts of coffee</span>' },
      { type: 'output', text: '<span class="t-key">belief:</span> <span class="t-val">complexity is just clarity waiting to happen</span>' },
    ];

    // Show terminal container + trigger 3D assembly
    terminal.classList.add('active');

    // 3D depth reveal: exploded -> assembled
    if (terminal.classList.contains('terminal--3d-intro')) {
      // Start assembled after a delay (layers fly in from exploded positions)
      setTimeout(function () {
        terminal.classList.add('assembled');
      }, 200);
    }

    var lineIdx = 0;

    function renderLine() {
      if (lineIdx >= script.length) {
        // All lines done, show hero links
        var links = document.querySelector('.hero__links');
        if (links) {
          setTimeout(function () {
            links.style.animation = 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both';
          }, 300);
        }
        return;
      }

      var item = script[lineIdx];
      var div = document.createElement('div');
      div.className = 'terminal__line';

      if (item.type === 'blank') {
        div.classList.add('t-blank');
        div.innerHTML = '&nbsp;';
      } else if (item.type === 'cmd') {
        div.innerHTML = '<span class="t-prompt">' + item.prompt + '</span> <span class="t-cmd">' + item.text + '</span>';
      } else {
        div.innerHTML = '<span class="t-output">' + item.text + '</span>';
      }

      body.appendChild(div);

      // Stagger: commands get a typing delay, outputs appear faster
      var delay = item.type === 'cmd' ? 400 : item.type === 'blank' ? 150 : 120;

      setTimeout(function () {
        div.classList.add('visible');
        lineIdx++;
        setTimeout(renderLine, delay);
      }, 30);
    }

    // Start after a brief pause
    setTimeout(renderLine, 300);
  }

  /* --- 2. Scroll Reveal + Stagger --- */
  function initScrollReveal() {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* --- 3. HR Line Draw Animation --- */
  function initHRDraw() {
    var hrObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('drawn');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('hr').forEach(function (el) {
      hrObserver.observe(el);
    });
  }

  /* --- 4. Carousel Card Stagger --- */
  function initCardsReveal() {
    var cardObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('cards-visible');
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.cards-reveal').forEach(function (el) {
      cardObserver.observe(el);
    });
  }

  /* --- 5. Animated Counters (numbers in .hl spans) --- */
  function initCounters() {
    var counterPattern = /^([\d,.]+)(M|K|B)?(\+?)$/;
    var targets = [];

    document.querySelectorAll('.hl').forEach(function (el) {
      var text = el.textContent.trim();
      var match = text.match(counterPattern);
      if (!match) return;

      var raw = match[1];
      var unitSuffix = match[2] || '';
      var plusSuffix = match[3] || '';
      var numericStr = raw.replace(/,/g, '');
      var endVal = parseFloat(numericStr);
      if (isNaN(endVal)) return;

      var hasDecimal = numericStr.indexOf('.') !== -1;
      var hasComma = raw.indexOf(',') !== -1;

      targets.push({
        el: el,
        endVal: endVal,
        suffix: unitSuffix + plusSuffix,
        hasDecimal: hasDecimal,
        hasComma: hasComma,
        originalText: text
      });

      el.setAttribute('data-count', 'true');
    });

    if (!targets.length) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        counterObserver.unobserve(el);

        var t = null;
        for (var i = 0; i < targets.length; i++) {
          if (targets[i].el === el) { t = targets[i]; break; }
        }
        if (!t || t.done) return;
        t.done = true;

        animateCount(t);
      });
    }, { threshold: 0.5 });

    targets.forEach(function (t) {
      counterObserver.observe(t.el);
    });
  }

  function animateCount(t) {
    var duration = 1200;
    var startTime = null;
    t.el.classList.add('counting');

    function formatNumber(val) {
      var str = t.hasDecimal ? val.toFixed(1) : Math.round(val).toString();
      if (t.hasComma) {
        var parts = str.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        str = parts.join('.');
      }
      return str + t.suffix;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * t.endVal;

      t.el.textContent = formatNumber(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        t.el.textContent = t.originalText;
        setTimeout(function () { t.el.classList.remove('counting'); }, 300);
      }
    }

    requestAnimationFrame(step);
  }

  /* --- 6. Magnetic Hover on Skill Tags --- */
  function initMagneticTags() {
    document.querySelectorAll('.stag').forEach(function (tag) {
      tag.addEventListener('mousemove', function (e) {
        var rect = tag.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        tag.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.25) + 'px) scale(1.05)';
      });

      tag.addEventListener('mouseleave', function () {
        tag.style.transform = '';
      });
    });
  }

  /* --- 7. Header Scroll Shrink --- */
  function initHeaderScroll() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var scrolled = false;
    window.addEventListener('scroll', function () {
      var isScrolled = window.scrollY > 60;
      if (isScrolled !== scrolled) {
        scrolled = isScrolled;
        header.classList.toggle('site-header--scrolled', scrolled);
      }
    }, { passive: true });
  }

  /* --- 8. Magnetic Link Underlines --- */
  function initMagneticLinks() {
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('mousemove', function (e) {
        var rect = link.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var pct = x / (rect.width / 2); // -1 to 1
        var after = link.querySelector('::after'); // can't access pseudo, use CSS variable
        var skew = pct * 4; // max 4deg skew
        var translateX = pct * 6; // max 6px shift
        var scaleX = 1 + Math.abs(pct) * 0.15; // stretch up to 15%
        link.style.setProperty('--mag-skew', skew + 'deg');
        link.style.setProperty('--mag-tx', translateX + 'px');
        link.style.setProperty('--mag-sx', scaleX);
      });

      link.addEventListener('mouseleave', function () {
        link.style.setProperty('--mag-skew', '0deg');
        link.style.setProperty('--mag-tx', '0px');
        link.style.setProperty('--mag-sx', '1');
      });
    });
  }

  /* --- 9. Smooth Scroll --- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var el = document.querySelector(link.getAttribute('href'));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* --- 8. Carousel Navigation --- */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel__track');
      var prev = carousel.querySelector('.carousel__btn--prev');
      var next = carousel.querySelector('.carousel__btn--next');
      var scrollAmount = 272;

      if (prev) prev.addEventListener('click', function () {
        track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });

      if (next) next.addEventListener('click', function () {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    });
  }

  /* --- 9. Medium RSS Feed --- */
  function initMediumFeed() {
    var track = document.getElementById('posts-track');
    if (!track) return;

    var rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@arusharma';
    var cacheKey = 'medium_rss_cache';
    var cacheTTL = 30 * 60 * 1000; // 30 minutes

    var funnyErrors = [
      { text: 'Medium is ghosting me right now. Try my ', linkText: 'profile', after: ' directly.' },
      { text: 'The articles are on a coffee break. They\'ll be back. Probably.', linkText: null, after: '' },
      { text: 'RSS feed said "new phone, who dis?" Try again later.', linkText: null, after: '' },
      { text: 'My articles exist, I promise. Medium\'s API just doesn\'t feel like proving it right now.', linkText: null, after: '' },
      { text: 'Plot twist: the articles were the friends we made along the way. Also they\'re ', linkText: 'here', after: '.' }
    ];
    var funnyChoice = funnyErrors[Math.floor(Math.random() * funnyErrors.length)];

    function buildErrorMsg() {
      var wrapper = document.createElement('div');
      wrapper.className = 'posts-loading';
      wrapper.appendChild(document.createTextNode(funnyChoice.text));
      if (funnyChoice.linkText) {
        var link = document.createElement('a');
        link.href = 'https://arusharma.medium.com';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = funnyChoice.linkText;
        wrapper.appendChild(link);
      }
      if (funnyChoice.after) {
        wrapper.appendChild(document.createTextNode(funnyChoice.after));
      }
      return wrapper;
    }

    function renderCards(items) {
      track.innerHTML = '';
      items.forEach(function (item) {
        var parser = new DOMParser();
        var parsed = parser.parseFromString(item.description || '', 'text/html');
        var text = parsed.body.textContent || '';
        var excerpt = text.substring(0, 160).trim() + '\u2026';

        var card = document.createElement('a');
        card.className = 'post-card';
        card.href = item.link;
        card.target = '_blank';
        card.rel = 'noopener';

        var pubDate = '';
        if (item.pubDate) {
          var d = new Date(item.pubDate);
          pubDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        var source = document.createElement('div');
        source.className = 'post-card__source';
        source.textContent = 'Medium';
        card.appendChild(source);

        var text = document.createElement('p');
        text.className = 'post-card__text';
        text.textContent = item.title + ' \u2014 ' + excerpt;
        card.appendChild(text);

        if (pubDate) {
          var dateSpan = document.createElement('span');
          dateSpan.className = 'post-card__date';
          dateSpan.textContent = pubDate;
          card.appendChild(dateSpan);
        }

        var cta = document.createElement('span');
        cta.className = 'post-card__cta';
        cta.textContent = 'Read article \u2197';
        card.appendChild(cta);

        track.appendChild(card);
      });

      if (track.classList.contains('cards-visible') || isInViewport(track)) {
        track.classList.add('cards-visible');
      }
    }

    // Try cache first
    try {
      var cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && (Date.now() - cached.timestamp) < cacheTTL) {
        renderCards(cached.items);
        return;
      }
    } catch (e) { /* cache miss or corrupt, fetch fresh */ }

    fetch(rssUrl)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        if (!data.items || !data.items.length) {
          track.innerHTML = '';
          track.appendChild(buildErrorMsg());
          return;
        }

        // Cache the response
        try {
          localStorage.setItem(cacheKey, JSON.stringify({
            items: data.items,
            timestamp: Date.now()
          }));
        } catch (e) { /* localStorage full or unavailable, no-op */ }

        renderCards(data.items);
      })
      .catch(function (err) {
        // Try stale cache as last resort
        try {
          var stale = JSON.parse(localStorage.getItem(cacheKey));
          if (stale && stale.items) {
            renderCards(stale.items);
            return;
          }
        } catch (e) { /* no cache available */ }
        track.innerHTML = '';
        track.appendChild(buildErrorMsg());
      });
  }

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  /* --- 10. Particle Constellation Background --- */
  function initConstellation() {
    var canvas = document.getElementById('constellation');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var w, h, particleCount;
    var connectDist = 180;
    var mouseDist = 250;
    var raf;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      particleCount = Math.min(Math.floor((w * h) / 10000), 120);

      // Re-seed if particle count changed significantly
      if (Math.abs(particles.length - particleCount) > 10) {
        seedParticles();
      }
    }

    function seedParticles() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 1.8 + 0.8
        });
      }
    }

    var _isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // Listen for theme changes instead of reading DOM every frame
    var _themeObserver = new MutationObserver(function () {
      _isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    });
    _themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    function isDark() {
      return _isDark;
    }

    // Light: blue particles. Dark: cyan/teal glow
    function pColor(alpha) {
      return isDark()
        ? 'rgba(0, 220, 255, ' + alpha + ')'
        : 'rgba(0, 85, 255, ' + alpha + ')';
    }

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = pColor(isDark() ? 0.5 : 0.4);
      ctx.fill();
    }

    function drawLine(p1, p2, dist, maxDist) {
      var opacity = (1 - dist / maxDist) * (isDark() ? 0.25 : 0.2);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = pColor(opacity);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawMouseLine(p, dist) {
      var opacity = (1 - dist / mouseDist) * (isDark() ? 0.4 : 0.3);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = pColor(opacity);
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    function update() {
      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Gentle mouse repulsion
        var mdx = p.x - mouse.x;
        var mdy = p.y - mouse.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < mouseDist) {
          var force = (mouseDist - mDist) / mouseDist * 0.02;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
          drawMouseLine(p, mDist);
        }

        // Speed damping
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 0.8) {
          p.vx *= 0.98;
          p.vy *= 0.98;
        }

        drawParticle(p);

        // Connect nearby particles
        for (var j = i + 1; j < particles.length; j++) {
          var p2 = particles[j];
          var dx = p.x - p2.x;
          var dy = p.y - p2.y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectDist) {
            drawLine(p, p2, dist, connectDist);
          }
        }
      }

      raf = requestAnimationFrame(update);
    }

    // Track mouse
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        raf = requestAnimationFrame(update);
      }
    });

    window.addEventListener('resize', resize);
    resize();
    seedParticles();
    raf = requestAnimationFrame(update);
  }

  /* --- 11. Floating Code Glyphs --- */
  function initFloatingGlyphs() {
    var container = document.getElementById('floating-glyphs');
    if (!container) return;

    var glyphs = [
      '{ }', '=>', '//', '0x', '&&', '||', '/**/', '===',
      'fn()', '[ ]', '<>', '::',  '#!/', '>>>', 'null',
      'async', 'await', 'auth', 'token', 'key', 'id:',
      'POST', 'GET', 'JWT', 'SHA', 'RSA', 'TLS',
      'IAM', 'RBAC', 'SSO', 'MCP', 'API'
    ];

    var sizes = [11, 12, 13, 14, 16, 18];

    function spawnGlyph() {
      var el = document.createElement('span');
      el.className = 'glyph';
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];

      var size = sizes[Math.floor(Math.random() * sizes.length)];
      var left = Math.random() * 100;
      var duration = 25 + Math.random() * 35;

      el.style.fontSize = size + 'px';
      el.style.left = left + '%';
      el.style.bottom = '-2rem';
      el.style.animationDuration = duration + 's';
      el.style.fontWeight = Math.random() > 0.6 ? '700' : '400';

      container.appendChild(el);

      // Cleanup after animation
      setTimeout(function () {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, duration * 1000);
    }

    // Initial burst
    for (var i = 0; i < 10; i++) {
      setTimeout(spawnGlyph, i * 500);
    }

    // Continuous spawn
    setInterval(spawnGlyph, 2500 + Math.random() * 1500);
  }

  /* --- 12. Avatar Lightbox --- */
  function initAvatarLightbox() {
    var lightbox = document.getElementById('avatar-lightbox');
    if (!lightbox) return;

    var avatars = document.querySelectorAll('.avatar--header, .avatar--lg');
    var backdrop = lightbox.querySelector('.avatar-lightbox__backdrop');
    var lbImg = lightbox.querySelector('.avatar-lightbox__img');

    var funnyLabels = [
      'I swear I am not an AI agent. Probably.',
      'This human has shipped more products than most bots.',
      'Warning: may spontaneously talk about OAuth.',
      'Powered by coffee, not transformers.',
      '72M+ users and they still don\'t know my face.',
      'I build identity systems. Ironic, given this tiny photo.',
      'Yes, I\'m real. My terminal intro is the AI part.',
      'Trust issues? I literally manage them for a living.',
      'The only thing I hallucinate is deadlines being met.'
    ];
    var nameEl = lightbox.querySelector('.avatar-lightbox__name');

    function openLightbox() {
      nameEl.textContent = funnyLabels[Math.floor(Math.random() * funnyLabels.length)];
      lightbox.classList.remove('closing');
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.add('closing');
      setTimeout(function () {
        lightbox.classList.remove('active', 'closing');
        document.body.style.overflow = '';
      }, 400);
    }

    avatars.forEach(function (avatar) {
      avatar.style.cursor = 'pointer';
      avatar.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openLightbox();
      });
    });

    backdrop.addEventListener('click', closeLightbox);
    lbImg.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* --- 13. Back to Top Button --- */
  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    var shown = false;
    window.addEventListener('scroll', function () {
      var shouldShow = window.scrollY > 400;
      if (shouldShow !== shown) {
        shown = shouldShow;
        btn.classList.toggle('visible', shown);
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- 13. Dark Mode Toggle --- */
  function initDarkMode() {
    var toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Check saved preference or system preference
    var saved = localStorage.getItem('theme');
    if (saved) {
      document.documentElement.setAttribute('data-theme', saved);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    updateToggleIcon();

    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateToggleIcon();
    });

    function updateToggleIcon() {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      toggle.innerHTML = isDark ? '&#9728;' : '&#9790;';
      toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }
  }

  /* --- 13. Carousel Scroll Dots --- */
  function initCarouselDots() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel__track');
      var dotsContainer = carousel.querySelector('.carousel__dots');
      if (!track || !dotsContainer) return;

      var cards = track.children;
      var dotCount = cards.length;
      if (dotCount <= 1) return;

      // Create dots
      for (var i = 0; i < dotCount; i++) {
        var dot = document.createElement('button');
        dot.className = 'carousel__dot';
        dot.setAttribute('aria-label', 'Go to card ' + (i + 1));
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
      }

      function updateDots() {
        var scrollLeft = track.scrollLeft;
        var cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 272; // 16 = gap
        var activeIdx = Math.round(scrollLeft / cardWidth);
        dotsContainer.querySelectorAll('.carousel__dot').forEach(function (d, idx) {
          d.classList.toggle('carousel__dot--active', idx === activeIdx);
        });
      }

      // Click dot to scroll
      dotsContainer.addEventListener('click', function (e) {
        var dot = e.target.closest('.carousel__dot');
        if (!dot) return;
        var idx = parseInt(dot.getAttribute('data-index'));
        var cardWidth = cards[0] ? cards[0].offsetWidth + 16 : 272;
        track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      });

      // Update on scroll
      track.addEventListener('scroll', updateDots, { passive: true });

      // Initial state
      setTimeout(updateDots, 100);
    });
  }

  /* --- 14. Fix Reveal Blank Gaps --- */
  function fixRevealGaps() {
    // Instantly show reveal elements that are already in or near the viewport
    // This prevents large blank gaps on initial load
    var viewHeight = window.innerHeight;
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      // If element is within 1.5x the viewport height, show it instantly
      if (rect.top < viewHeight * 1.5) {
        el.classList.add('visible');
      }
    });
  }

  /* --- Initialize Everything --- */
  function init() {
    initDarkMode();
    initAvatarLightbox();
    initBackToTop();
    fixRevealGaps();
    initTypewriter();
    initScrollReveal();
    initHRDraw();
    initCardsReveal();
    initCounters();
    initMagneticTags();
    initHeaderScroll();
    initMagneticLinks();
    initSmoothScroll();
    initCarousels();
    initCarouselDots();
    initMediumFeed();
    initConstellation();
    initFloatingGlyphs();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
