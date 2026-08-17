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

  function patchSpeakersBureau() {
    var path = (window.location.pathname || '').replace(/\/index\.html$/, '').replace(/\/+$/, '');
    if (path !== '/bluecard/speakers-bureau') return;

    var page = document.querySelector('.sb-page');
    var hero = page ? page.querySelector('.sb-hero') : null;
    if (!page || !hero || document.getElementById('sb-intro-carousel')) return;

    var style = document.createElement('style');
    style.id = 'sb-intro-carousel-styles';
    style.textContent = [
      '.sb-page{max-width:1280px!important;padding-top:48px!important;padding-bottom:26px!important}',
      '.sb-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(380px,.9fr);gap:48px;align-items:center}',
      '.sb-hero{max-width:none!important}',
      '.sb-intro{max-width:680px!important}',
      '.sb-carousel-shell{position:relative;width:100%;min-width:0}',
      '.sb-carousel{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;-webkit-overflow-scrolling:touch;touch-action:pan-y pinch-zoom;border-radius:22px;background:#eef4fa;box-shadow:0 16px 38px rgba(0,63,125,.14)}',
      '.sb-carousel::-webkit-scrollbar{display:none}',
      '.sb-carousel-slide{flex:0 0 100%;min-width:100%;scroll-snap-align:start;scroll-snap-stop:always}',
      '.sb-carousel-slide img{display:block;width:100%;height:360px;object-fit:cover;object-position:center 40%}',
      '.sb-carousel-btn{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.94);color:#003f7d;font-size:23px;line-height:1;display:grid;place-items:center;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18)}',
      '.sb-carousel-btn:hover,.sb-carousel-btn:focus{background:#fff;outline:2px solid rgba(0,85,165,.18)}',
      '.sb-carousel-btn.prev{left:12px}',
      '.sb-carousel-btn.next{right:12px}',
      '.sb-carousel-dots{display:flex;justify-content:center;gap:7px;margin-top:12px}',
      '.sb-carousel-dot{width:7px;height:7px;border-radius:50%;background:#b6c9dc;transition:transform .2s ease,background .2s ease}',
      '.sb-carousel-dot.is-active{background:#0b56a4;transform:scale(1.3)}',
      '@media (max-width:900px){.sb-hero-grid{grid-template-columns:1fr;gap:28px}.sb-carousel-slide img{height:auto;aspect-ratio:3/4;max-height:620px;object-fit:cover}.sb-carousel-shell{max-width:540px;margin:0 auto}}',
      '@media (max-width:560px){.sb-page{padding-top:34px!important}.sb-hero-grid{gap:24px}.sb-carousel-btn{width:32px;height:32px;font-size:21px}.sb-carousel-slide img{max-height:none}}'
    ].join('');
    document.head.appendChild(style);

    var grid = document.createElement('div');
    grid.className = 'sb-hero-grid';
    hero.parentNode.insertBefore(grid, hero);
    grid.appendChild(hero);

    var shell = document.createElement('div');
    shell.className = 'sb-carousel-shell';
    shell.id = 'sb-intro-carousel';
    shell.setAttribute('aria-label', 'Speakers Bureau photo carousel');

    var prev = document.createElement('button');
    prev.className = 'sb-carousel-btn prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous Speakers Bureau photo');
    prev.innerHTML = '&#8249;';

    var carousel = document.createElement('div');
    carousel.className = 'sb-carousel';

    for (var i = 1; i <= 11; i += 1) {
      var slide = document.createElement('div');
      slide.className = 'sb-carousel-slide';
      var img = document.createElement('img');
      img.src = '/bluecard/images/speakers-bureau/3x4-speaker-bureau-gallery---%20(' + i + ').png';
      img.alt = 'The Blue Card Speakers Bureau educational event photo';
      img.loading = i === 1 ? 'eager' : 'lazy';
      slide.appendChild(img);
      carousel.appendChild(slide);
    }

    var next = document.createElement('button');
    next.className = 'sb-carousel-btn next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next Speakers Bureau photo');
    next.innerHTML = '&#8250;';

    var dots = document.createElement('div');
    dots.className = 'sb-carousel-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (var d = 0; d < 11; d += 1) {
      var dot = document.createElement('span');
      dot.className = 'sb-carousel-dot' + (d === 0 ? ' is-active' : '');
      dots.appendChild(dot);
    }

    shell.appendChild(prev);
    shell.appendChild(carousel);
    shell.appendChild(next);
    shell.appendChild(dots);
    grid.appendChild(shell);

    var dotEls = Array.from(dots.children);
    var auto;

    function currentIndex() {
      var width = carousel.clientWidth || 1;
      return Math.max(0, Math.min(10, Math.round(carousel.scrollLeft / width)));
    }

    function updateDots() {
      var idx = currentIndex();
      dotEls.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === idx);
      });
    }

    function step(direction) {
      var width = carousel.clientWidth || 1;
      var idx = currentIndex() + direction;
      if (idx > 10) idx = 0;
      if (idx < 0) idx = 10;
      carousel.scrollTo({ left: idx * width, behavior: 'smooth' });
    }

    function restartAuto() {
      clearInterval(auto);
      auto = setInterval(function () { step(1); }, 4200);
    }

    prev.addEventListener('click', function () { step(-1); restartAuto(); });
    next.addEventListener('click', function () { step(1); restartAuto(); });
    carousel.addEventListener('scroll', function () { window.requestAnimationFrame(updateDots); }, { passive: true });
    shell.addEventListener('mouseenter', function () { clearInterval(auto); });
    shell.addEventListener('mouseleave', restartAuto);
    carousel.addEventListener('touchstart', function () { clearInterval(auto); }, { passive: true });
    carousel.addEventListener('touchend', restartAuto, { passive: true });
    window.addEventListener('resize', updateDots);
    restartAuto();
  }

  function patchHomepage() {
    var path = (window.location.pathname || '').replace(/\/index\.html$/, '').replace(/\/+$/, '');
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

    var educationHeading = Array.from(main.querySelectorAll('#core-programs .card h3')).find(function (heading) {
      var text = heading.textContent.trim();
      return text === 'Education & Outreach' || text === 'Education and Combating Hate' || text === 'Education & Combating Hate' || text === 'Interactive Holocaust Hologram Experience';
    });
    if (educationHeading) {
      var educationCard = educationHeading.closest('.card');
      var educationImage = educationCard ? educationCard.querySelector('.card-media img') : null;
      if (educationImage) {
        educationImage.src = '/bluecard/images/homepage/11x7-hologram-sonia-being-watched-in-classroom.png?v=20260816';
        educationImage.alt = 'Students viewing Holocaust survivor Sonia in an interactive classroom hologram experience';
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

  patchSpeakersBureau();
  patchHomepage();
})();
