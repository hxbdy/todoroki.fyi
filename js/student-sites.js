(function () {
  var list = document.getElementById('student-sites-list');
  if (!list) return;

  function isHttps(url) {
    try {
      return new URL(url).protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  function isImage(url) {
    return typeof url === 'string' && (isHttps(url) || /^\.\/img\/students\/[\w.-]+$/.test(url));
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function render(site) {
    var card = el('a', 'c-site-card');
    card.href = site.url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    if (isImage(site.thumb)) {
      var img = el('img', 'c-site-card__thumb');
      img.src = site.thumb;
      img.alt = '';
      img.loading = 'lazy';
      card.appendChild(img);
    } else {
      card.appendChild(el('div', 'c-site-card__thumb c-site-card__thumb--none', 'No Image'));
    }

    var body = el('div', 'c-site-card__body');
    body.appendChild(el('h3', 'c-site-card__title', site.title));
    body.appendChild(el('p', 'c-site-card__summary', site.summary));

    var meta = el('p', 'c-site-card__meta', '制作: ' + site.author + (site.school ? '(' + site.school + ')' : ''));
    body.appendChild(meta);

    body.appendChild(el('span', 'c-site-card__external', '外部サイトを開く'));
    card.appendChild(body);
    return card;
  }

  fetch('./data/student-sites.json')
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (sites) {
      var valid = sites.filter(function (s) { return s && s.title && isHttps(s.url); });
      list.textContent = '';
      if (!valid.length) {
        list.appendChild(el('p', 'p-sites__empty', '現在掲載中のサイトはありません。'));
        return;
      }
      valid.forEach(function (s) { list.appendChild(render(s)); });
    })
    .catch(function () {
      list.textContent = '';
      list.appendChild(el('p', 'p-sites__empty', '一覧を読み込めませんでした。'));
    });
})();
