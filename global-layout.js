(function () {
  var currentPath = (window.location.pathname || '/').replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  if (currentPath === '/bluecard' || currentPath === '/') {
    var podcastHeading = Array.from(document.querySelectorAll('main h2')).find(function (heading) {
      return heading.textContent.trim() === 'The Longevity Paradox of Holocaust Survivors';
    });
    if (podcastHeading) {
      var podcastSection = podcastHeading.closest('section');
      if (podcastSection) podcastSection.remove();
    }
  }

  var baseScript = document.createElement('script');
  baseScript.src = '/bluecard/global-layout-base.js?v=20260804-3';
  baseScript.onload = function () {
    var homepageScript = document.createElement('script');
    homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260804-3';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);
})();
