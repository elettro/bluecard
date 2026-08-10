(function () {
  var BBB_URL = 'https://give.org/charity-reviews/elderly/the-blue-card-in-new-york-ny-9999-16357';
  var BBB_IMAGE = '/bluecard/images/footer/bbb-accredited-charity-white.png';

  function addBbbBadge() {
    var badges = document.querySelector('.bc-badges');
    if (!badges) return false;

    if (!document.getElementById('bc-bbb-accredited-badge')) {
      var link = document.createElement('a');
      link.id = 'bc-bbb-accredited-badge';
      link.href = BBB_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('aria-label', 'BBB Accredited Charity profile for The Blue Card');

      var image = document.createElement('img');
      image.src = BBB_IMAGE;
      image.alt = 'BBB Accredited Charity';
      image.loading = 'lazy';

      link.appendChild(image);
      badges.appendChild(link);
    }

    if (!document.getElementById('bc-bbb-footer-layout')) {
      var style = document.createElement('style');
      style.id = 'bc-bbb-footer-layout';
      style.textContent = [
        '@media (min-width:701px){.bc-badges{grid-template-columns:repeat(4,minmax(0,1fr))!important;max-width:1000px!important;gap:24px!important}}',
        '.bc-badges>a{display:flex;align-items:center;justify-content:center;width:100%;min-width:0}',
        '.bc-badges #bc-bbb-accredited-badge img{max-height:120px!important;width:auto!important;max-width:100%!important;object-fit:contain!important}',
        '@media (max-width:700px){.bc-badges{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important}}'
      ].join('');
      document.head.appendChild(style);
    }

    return true;
  }

  if (addBbbBadge()) return;

  var observer = new MutationObserver(function () {
    if (addBbbBadge()) observer.disconnect();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
