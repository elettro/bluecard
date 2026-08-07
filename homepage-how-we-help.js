(function () {
  var currentPath = (window.location.pathname || '/').replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  var legacyLoaded = false;

  function loadClassroomCarousel() {
    if (currentPath !== '/bluecard/interactive-hologram') return;
    if (document.querySelector('script[data-bc-classroom-carousel]')) return;
    var classroomScript = document.createElement('script');
    classroomScript.src = '/bluecard/interactive-hologram-classroom-carousel.js?v=20260807-1';
    classroomScript.defer = true;
    classroomScript.setAttribute('data-bc-classroom-carousel', 'true');
    document.body.appendChild(classroomScript);
  }

  function afterLegacy() {
    if (legacyLoaded) return;
    legacyLoaded = true;
    loadClassroomCarousel();
  }

  var legacyScript = document.createElement('script');
  legacyScript.src = 'https://cdn.jsdelivr.net/gh/elettro/bluecard@5b458752db375679004be2cf3f99a25db9dd17e6/homepage-how-we-help.js';
  legacyScript.onload = afterLegacy;
  legacyScript.onerror = afterLegacy;
  document.body.appendChild(legacyScript);
})();
