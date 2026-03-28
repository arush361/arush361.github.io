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
      { type: 'output', text: '<span class="t-stat">10+ years</span> shipping products people actually use' },
      { type: 'output', text: '<span class="t-highlight">PokerStars</span> <span class="t-comment">(72M+ users)</span> \u2192 <span class="t-highlight">FinTech</span> <span class="t-comment">(420M+ credit cards)</span> \u2192 HealthTech' },
      { type: 'output', text: '<span class="t-stat">0\u21921</span> builds. <span class="t-stat">M+ users</span>. <span class="t-stat">M+ revenue</span>. Still going.' },
      { type: 'blank' },
      { type: 'cmd', prompt: '>', text: ' arush.stack()' },
      { type: 'output', text: '<span class="t-key">tools:</span>  <span class="t-val">LLMs \u2022 platform thinking \u2022 unreasonable optimism</span>' },
      { type: 'output', text: '<span class="t-key">fuel:</span>   <span class="t-val">alarming amounts of coffee</span>' },
      { type: 'output', text: '<span class="t-key">belief:</span> <span class="t-val">complexity is just clarity waiting to happen</span>' },
    ];

    // Show terminal container
    terminal.classList.add('active');

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

  /* --- 8. Smooth Scroll --- */
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

    fetch(rssUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (!data.items || !data.items.length) {
          track.innerHTML = '<div class="posts-loading">No articles found.</div>';
          return;
        }

        track.innerHTML = '';

        data.items.forEach(function (item) {
          var tmp = document.createElement('div');
          tmp.innerHTML = item.description || '';
          var text = tmp.textContent || tmp.innerText || '';
          var excerpt = text.substring(0, 160).trim() + '\u2026';

          var card = document.createElement('a');
          card.className = 'post-card';
          card.href = item.link;
          card.target = '_blank';
          card.rel = 'noopener';

          card.innerHTML =
            '<div class="post-card__source">Medium</div>' +
            '<p class="post-card__text">' + item.title + ' \u2014 ' + excerpt + '</p>' +
            '<span class="post-card__cta">Read article \u2197</span>';

          track.appendChild(card);
        });

        // Trigger card stagger after feed loads
        if (track.classList.contains('cards-visible') || isInViewport(track)) {
          track.classList.add('cards-visible');
        }
      })
      .catch(function () {
        track.innerHTML = '<div class="posts-loading">Could not load articles.</div>';
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

    function drawParticle(p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 85, 255, 0.4)';
      ctx.fill();
    }

    function drawLine(p1, p2, dist, maxDist) {
      var opacity = (1 - dist / maxDist) * 0.2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = 'rgba(0, 85, 255, ' + opacity + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    function drawMouseLine(p, dist) {
      var opacity = (1 - dist / mouseDist) * 0.3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = 'rgba(0, 85, 255, ' + opacity + ')';
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

  /* --- Initialize Everything --- */
  function init() {
    initTypewriter();
    initScrollReveal();
    initHRDraw();
    initCardsReveal();
    initCounters();
    initMagneticTags();
    initHeaderScroll();
    initSmoothScroll();
    initCarousels();
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
