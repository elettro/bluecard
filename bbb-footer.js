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

  var badgeReady = addBbbBadge();
  if (!badgeReady) {
    var observer = new MutationObserver(function () {
      if (addBbbBadge()) observer.disconnect();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function ensureFaqNavLink() {
    var moreParent = Array.from(document.querySelectorAll('#bc-global-nav .menu > li.menu-item-has-children')).find(function (item) {
      var parentLink = item.querySelector(':scope > a');
      return parentLink && parentLink.textContent.trim() === 'More';
    });
    if (!moreParent) return false;

    var submenu = moreParent.querySelector(':scope > .sub-menu');
    if (!submenu) return false;
    if (submenu.querySelector('a[href="/bluecard/faqs/"]')) return true;

    var item = document.createElement('li');
    item.innerHTML = '<a href="/bluecard/faqs/">FAQs</a>';
    var contactItem = Array.from(submenu.children).find(function (li) {
      var a = li.querySelector('a');
      return a && a.textContent.trim() === 'Contact Us';
    });
    if (contactItem) submenu.insertBefore(item, contactItem);
    else submenu.appendChild(item);
    return true;
  }

  if (!ensureFaqNavLink()) {
    var navObserver = new MutationObserver(function () {
      if (ensureFaqNavLink()) navObserver.disconnect();
    });
    navObserver.observe(document.documentElement, { childList: true, subtree: true });
  }

  function ensureHomepageHeadingStyles() {
    if (document.getElementById('bc-homepage-heading-fixes')) return;
    var style = document.createElement('style');
    style.id = 'bc-homepage-heading-fixes';
    style.textContent = [
      '@media (min-width:1024px){',
      '.bc-facts-heading-wrap{max-width:none!important;flex:1 1 auto!important;min-width:0!important}',
      '.bc-facts-heading{white-space:nowrap!important;font-size:clamp(2.35rem,3.25vw,3.25rem)!important;line-height:1.05!important;letter-spacing:-0.035em!important}',
      '.bc-impact-heading{white-space:nowrap!important;font-size:2.5rem!important;line-height:1.05!important;letter-spacing:-0.025em!important}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function patchHomepage() {
    var path = window.location.pathname.replace(/\/+$/, '');
    if (path !== '/bluecard' && path !== '') return;

    var main = document.querySelector('main');
    if (!main) return;

    Array.from(main.querySelectorAll('#faq, .bc-faq')).forEach(function (faqSection) {
      faqSection.remove();
    });

    ensureHomepageHeadingStyles();

    var sections = Array.from(main.querySelectorAll(':scope > section'));

    var factsSection = sections.find(function (section) {
      var heading = section.querySelector('h2');
      if (!heading) return false;
      var text = heading.textContent.trim();
      return text === 'What most people don’t know about Holocaust Survivors' || text === 'Facts About Holocaust Survivors We Serve';
    });

    if (factsSection) {
      var factsHeading = factsSection.querySelector('h2');
      factsHeading.textContent = 'Facts About Holocaust Survivors We Serve';
      factsHeading.classList.add('bc-facts-heading');
      if (factsHeading.parentElement) factsHeading.parentElement.classList.add('bc-facts-heading-wrap');

      var factsGrid = factsSection.querySelector('.grid');
      if (factsGrid) {
        factsGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-8';

        factsGrid.querySelectorAll('[data-bc-fact-extra]').forEach(function (card) {
          card.remove();
        });

        if (!factsGrid.querySelector('[data-bluecard-age-card]')) {
          var ageCard = document.createElement('div');
          ageCard.setAttribute('data-bluecard-age-card', 'true');
          ageCard.className = 'bg-surface-container-lowest p-10 rounded-xl ghost-border';
          ageCard.innerHTML = '<div class="mb-6 text-primary"><span class="material-symbols-outlined text-4xl" aria-hidden="true">elderly</span></div><h3 class="text-4xl font-headline font-bold text-primary mb-4">80+</h3><p class="text-on-surface-variant leading-relaxed text-lg">All Holocaust survivors we serve are over the age of 80.</p>';
          factsGrid.appendChild(ageCard);
        }

        if (!factsGrid.querySelector('[data-bluecard-poverty-card]')) {
          var povertyCard = document.createElement('div');
          povertyCard.setAttribute('data-bluecard-poverty-card', 'true');
          povertyCard.className = 'bg-surface-container-lowest p-10 rounded-xl ghost-border';
          povertyCard.innerHTML = '<div class="mb-6 text-primary"><span class="material-symbols-outlined text-4xl" aria-hidden="true">account_balance_wallet</span></div><h3 class="text-4xl font-headline font-bold text-primary mb-4">More than half</h3><p class="text-on-surface-variant leading-relaxed text-lg">Fall 200% below the federal poverty line.</p>';
          factsGrid.appendChild(povertyCard);
        }
      }
    }

    var impactSection = sections.find(function (section) {
      var heading = section.querySelector('h2');
      if (!heading) return false;
      var text = heading.textContent.trim();
      return text === 'Our Impact' || text === 'Our Impact Since 1934';
    });

    if (impactSection) {
      var impactHeading = impactSection.querySelector('h2');
      impactHeading.textContent = 'Our Impact Since 1934';
      impactHeading.classList.add('bc-impact-heading');

      var impactPanel = impactHeading.parentElement;
      var impactGrid = impactPanel ? impactPanel.querySelector('.grid') : null;
      if (impactGrid) {
        var existingCards = impactGrid.children;
        if (existingCards.length > 0) {
          var firstCard = existingCards[0];
          var metric = firstCard.querySelector('.font-headline');
          var description = firstCard.querySelector('p');
          if (metric) metric.textContent = '3,000+';
          if (description) description.textContent = 'Actively serving 3000+ survivor households.';
        }

        if (!impactGrid.querySelector('[data-bluecard-people-card]')) {
          var peopleCard = document.createElement('div');
          peopleCard.setAttribute('data-bluecard-people-card', 'true');
          peopleCard.className = 'bg-white/10 border border-white/15 rounded-2xl p-6';
          peopleCard.innerHTML = '<span class="material-symbols-outlined text-4xl mb-5" aria-hidden="true">diversity_3</span><div class="font-headline text-3xl font-extrabold mb-2">3M</div><p class="text-on-primary/85 leading-relaxed">People served since 1934</p>';
          impactGrid.appendChild(peopleCard);
        }

        if (!impactGrid.querySelector('[data-bluecard-cancer-card]')) {
          var cancerCard = document.createElement('div');
          cancerCard.setAttribute('data-bluecard-cancer-card', 'true');
          cancerCard.className = 'bg-white/10 border border-white/15 rounded-2xl p-6';
          cancerCard.innerHTML = '<span class="material-symbols-outlined text-4xl mb-5" aria-hidden="true">health_and_safety</span><div class="font-headline text-3xl font-extrabold mb-2">$7M</div><p class="text-on-primary/85 leading-relaxed">In aid to survivors battling cancer</p>';
          impactGrid.appendChild(cancerCard);
        }
      }
    }

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
