/* ============================================
   ANIMATIONS ENGINE
   ============================================ */

(function () {
  'use strict';

  /* --- 1. Typewriter Effect --- */
  function initTypewriter() {
    var el = document.querySelector('.typewriter');
    if (!el) return;

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
        // Done typing -- keep cursor blinking for 2s then remove
        setTimeout(function () { cursor.style.display = 'none'; }, 2000);
        return;
      }

      var line = lines[lineIdx];
      if (charIdx < line.length) {
        textNode.textContent += line[charIdx];
        charIdx++;
        setTimeout(type, 45 + Math.random() * 35);
      } else {
        // Move to next line
        lineIdx++;
        if (lineIdx < lines.length) {
          var br = document.createElement('br');
          el.insertBefore(br, cursor);
          textNode = document.createTextNode('');
          el.insertBefore(textNode, cursor);
          charIdx = 0;
          setTimeout(type, 200);
        } else {
          type(); // trigger the "done" branch
        }
      }
    }

    // Small delay before starting
    setTimeout(type, 400);
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

  /* --- 7. Smooth Scroll --- */
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

  /* --- Initialize Everything --- */
  function init() {
    initTypewriter();
    initScrollReveal();
    initHRDraw();
    initCardsReveal();
    initCounters();
    initMagneticTags();
    initSmoothScroll();
    initCarousels();
    initMediumFeed();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
