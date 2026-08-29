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

  function patchHomepageHelpImages() {
    if (currentPath !== '/bluecard' && currentPath !== '/') return;

    var imageMap = {
      'Ongoing Support': {
        src: '/bluecard/images/survivors/the-blue-card-survivor-images-16x9----%20(17).png',
        alt: 'Holocaust survivors supported by The Blue Card'
      },
      'Health and Well-being': {
        src: '/bluecard/images/survivors/the-blue-card-survivor-images-16x9----%20(27).png',
        alt: 'Holocaust survivors participating in a Blue Card wellbeing program'
      },
      'Medication Assistance': {
        src: '/bluecard/images/homepage/11x7-pharmacy-getting-prescriptions-v1.png',
        alt: 'Older adult receiving prescription medication from a pharmacist'
      },
      'Education and Combating Hate': {
        src: '/bluecard/images/homepage/education-combating-hate-classroom-1536x1024.png?v=20260829-2',
        alt: 'Students gathered around an interactive Holocaust survivor hologram classroom presentation'
      },
      'Education & Combating Hate': {
        src: '/bluecard/images/homepage/education-combating-hate-classroom-1536x1024.png?v=20260829-2',
        alt: 'Students gathered around an interactive Holocaust survivor hologram classroom presentation'
      },
      'Education & Outreach': {
        src: '/bluecard/images/homepage/education-combating-hate-classroom-1536x1024.png?v=20260829-2',
        alt: 'Students gathered around an interactive Holocaust survivor hologram classroom presentation'
      }
    };

    Array.from(document.querySelectorAll('.bc-help-card')).forEach(function (card) {
      var heading = card.querySelector('h3');
      var image = card.querySelector('.bc-help-image img');
      if (!heading || !image) return;
      var replacement = imageMap[heading.textContent.trim()];
      if (!replacement) return;
      image.src = replacement.src;
      image.alt = replacement.alt;
    });

    Array.from(document.querySelectorAll('#core-programs .card')).forEach(function (card) {
      var heading = card.querySelector('h3');
      var image = card.querySelector('.card-media img');
      if (!heading || !image) return;
      var replacement = imageMap[heading.textContent.trim()];
      if (!replacement) return;
      image.src = replacement.src;
      image.alt = replacement.alt;
    });
  }

  function afterLegacy() {
    if (legacyLoaded) return;
    legacyLoaded = true;
    patchHomepageHelpImages();
    setTimeout(patchHomepageHelpImages, 100);
    setTimeout(patchHomepageHelpImages, 500);
    setTimeout(patchHomepageHelpImages, 1200);
    loadClassroomCarousel();
  }

  var legacyScript = document.createElement('script');
  legacyScript.src = 'https://cdn.jsdelivr.net/gh/elettro/bluecard@5b458752db375679004be2cf3f99a25db9dd17e6/homepage-how-we-help.js';
  legacyScript.onload = afterLegacy;
  legacyScript.onerror = afterLegacy;
  document.body.appendChild(legacyScript);
})();