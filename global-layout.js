(function () {
  var cacheBust = Date.now();
  var legacyScript = document.createElement('script');
  legacyScript.src = '/bluecard/global-layout-legacy.js?v=' + cacheBust;
  legacyScript.onload = function () {
    var bbbPatch = document.createElement('script');
    bbbPatch.src = '/bluecard/bbb-footer.js?v=' + cacheBust;
    document.body.appendChild(bbbPatch);
  };
  document.head.appendChild(legacyScript);

  function patchHomepage() {
    var path = window.location.pathname.replace(/\/+$/, '');
    if (path !== '/bluecard' && path !== '') return;

    var main = document.querySelector('main');
    if (!main) return;

    var sections = Array.from(main.querySelectorAll(':scope > section'));

    // Survivor facts section
    var factsSection = sections.find(function (section) {
      var heading = section.querySelector('h2');
      return heading && heading.textContent.trim() === 'What most people don’t know about Holocaust Survivors';
    });

    if (factsSection) {
      var factsHeading = factsSection.querySelector('h2');
      factsHeading.textContent = 'Facts About Holocaust Survivors We Serve';

      var factsGrid = factsSection.querySelector('.grid');
      if (factsGrid) {
        factsGrid.className = factsGrid.className
          .replace('md:grid-cols-3', 'md:grid-cols-2 xl:grid-cols-5');

        var ageCard = document.createElement('div');
        ageCard.className = 'bg-surface-container-lowest p-10 rounded-xl ghost-border';
        ageCard.innerHTML = '<div class="mb-6 text-primary"><span class="material-symbols-outlined text-4xl" aria-hidden="true">elderly</span></div><h3 class="text-4xl font-headline font-bold text-primary mb-4">80+</h3><p class="text-on-surface-variant leading-relaxed text-lg">All Holocaust survivors we serve are over the age of 80.</p>';

        var povertyCard = document.createElement('div');
        povertyCard.className = 'bg-surface-container-lowest p-10 rounded-xl ghost-border';
        povertyCard.innerHTML = '<div class="mb-6 text-primary"><span class="material-symbols-outlined text-4xl" aria-hidden="true">account_balance_wallet</span></div><h3 class="text-4xl font-headline font-bold text-primary mb-4">More than half</h3><p class="text-on-surface-variant leading-relaxed text-lg">Fall 200% below the federal poverty line.</p>';

        factsGrid.appendChild(ageCard);
        factsGrid.appendChild(povertyCard);
      }
    }

    // Impact section
    var impactSection = sections.find(function (section) {
      var heading = section.querySelector('h2');
      return heading && heading.textContent.trim() === 'Our Impact';
    });

    if (impactSection) {
      var impactHeading = impactSection.querySelector('h2');
      impactHeading.textContent = 'Our Impact Since 1934';
      impactHeading.classList.add('bc-impact-heading');

      if (!document.getElementById('bc-impact-heading-style')) {
        var impactStyle = document.createElement('style');
        impactStyle.id = 'bc-impact-heading-style';
        impactStyle.textContent = '@media (min-width:1024px){.bc-impact-heading{white-space:nowrap!important;font-size:2.5rem!important;line-height:1.05!important;letter-spacing:-0.025em!important}}';
        document.head.appendChild(impactStyle);
      }

      var impactPanel = impactHeading.parentElement;
      var impactGrid = impactPanel ? impactPanel.querySelector('.grid') : null;
      if (impactGrid) {
        var existingCards = impactGrid.children;
        if (existingCards.length > 0) {
          var firstCard = existingCards[0];
          var metric = firstCard.querySelector('.font-headline');
          var description = firstCard.querySelector('p');
          if (metric) metric.textContent = '3,000+';
          if (description) description.textContent = 'Actively serving survivor households.';
        }

        var peopleCard = document.createElement('div');
        peopleCard.className = 'bg-white/10 border border-white/15 rounded-2xl p-6';
        peopleCard.innerHTML = '<span class="material-symbols-outlined text-4xl mb-5" aria-hidden="true">diversity_3</span><div class="font-headline text-3xl font-extrabold mb-2">3M</div><p class="text-on-primary/85 leading-relaxed">People served since 1934</p>';

        var cancerCard = document.createElement('div');
        cancerCard.className = 'bg-white/10 border border-white/15 rounded-2xl p-6';
        cancerCard.innerHTML = '<span class="material-symbols-outlined text-4xl mb-5" aria-hidden="true">health_and_safety</span><div class="font-headline text-3xl font-extrabold mb-2">$7M</div><p class="text-on-primary/85 leading-relaxed">In aid to survivors battling cancer</p>';

        impactGrid.appendChild(peopleCard);
        impactGrid.appendChild(cancerCard);
      }
    }

    // Survivor video before How We Help
    var programsSection = document.getElementById('core-programs');
    if (programsSection && !document.getElementById('survivor-story-video')) {
      var videoSection = document.createElement('section');
      videoSection.id = 'survivor-story-video';
      videoSection.className = 'py-20 md:py-24 bg-surface';
      videoSection.innerHTML = '<div class="max-w-7xl mx-auto px-6"><div class="max-w-4xl mx-auto text-center mb-10"><span class="label-md font-label text-primary uppercase tracking-[0.2em] mb-4 block">Meet the Survivors We Serve</span><h2 class="font-headline text-4xl md:text-5xl font-extrabold text-on-surface mb-5">Their Stories Are Why We Serve</h2><p class="text-on-surface-variant text-lg leading-relaxed max-w-3xl mx-auto">Meet Holocaust survivors whose lives and experiences are at the heart of The Blue Card’s mission.</p></div><div class="max-w-5xl mx-auto overflow-hidden rounded-[28px] shadow-2xl shadow-primary/10 bg-black" style="aspect-ratio:16/9"><iframe src="https://player.vimeo.com/video/75878170?title=0&byline=0&portrait=0" title="The Blue Card Holocaust survivor video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy" style="width:100%;height:100%;border:0;display:block"></iframe></div></div>';
      programsSection.parentNode.insertBefore(videoSection, programsSection);
    }
  }

  patchHomepage();
})();