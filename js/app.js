/* Smooth scroll for anchor links */
document.addEventListener('click', function (e) {
  var link = e.target.closest('a[href^="#"]');
  if (!link) return;
  var el = document.querySelector(link.getAttribute('href'));
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* Scroll reveal animation */
var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(function (el) {
  observer.observe(el);
});

/* Carousel navigation */
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

/* Medium RSS feed → carousel cards */
(function () {
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
        /* Strip HTML from description to get plain text excerpt */
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
    })
    .catch(function () {
      track.innerHTML = '<div class="posts-loading">Could not load articles.</div>';
    });
})();
