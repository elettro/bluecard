(function () {
  var currentPath = (window.location.pathname || '/').replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  var isHomepage = currentPath === '/bluecard' || currentPath === '/';
  var isInteractiveHologram = currentPath === '/bluecard/interactive-hologram';

  if (isHomepage) {
    var antiFlickerStyle = document.createElement('style');
    antiFlickerStyle.id = 'homepage-quote-antiflicker';
    antiFlickerStyle.textContent = '#homepage-survivor-cta{display:none!important;}';
    document.head.appendChild(antiFlickerStyle);

    Array.from(document.querySelectorAll('main blockquote')).forEach(function (quote) {
      if (quote.textContent.indexOf("The Blue Card didn't just pay my medical bills") !== -1) {
        var section = quote.closest('section');
        if (section) section.remove();
      }
    });
  }

  if (isInteractiveHologram) applyInteractiveHologramUpdates();

  var baseScript = document.createElement('script');
  baseScript.src = '/bluecard/global-layout-base.js?v=20260806-3';
  baseScript.onload = function () {
    if (isHomepage) applyHomepageUpdates();

    var homepageScript = document.createElement('script');
    homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260806-2';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);

  function applyInteractiveHologramUpdates() {
    var overviewSection = document.getElementById('program-overview');
    if (overviewSection) {
      overviewSection.className = 'bc-section bc-section-soft bc-history-tech';
      overviewSection.innerHTML = `
<style>
.bc-history-tech .bc-history-header{max-width:980px;margin:0 0 38px;text-align:left}.bc-history-tech .bc-history-header h2{margin:0;color:var(--bc-blue-dark);font-size:clamp(38px,5vw,64px);line-height:1.02;letter-spacing:-.035em}.bc-history-tech .bc-history-panel{overflow:hidden;background:#fff;border:1px solid var(--bc-line);border-radius:30px;box-shadow:var(--bc-shadow)}.bc-history-tech .bc-history-copy{padding:clamp(30px,5vw,58px)}.bc-history-tech .bc-history-copy h3{margin:0 0 24px;color:#9d1f1f;font-size:clamp(30px,4vw,48px);line-height:1.05;letter-spacing:-.025em}.bc-history-tech .bc-history-copy p{margin:0 0 18px;color:#394867;font-size:18px;line-height:1.72}.bc-history-tech .bc-history-copy p:last-of-type{margin-bottom:0}.bc-history-tech .bc-history-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding:0 clamp(30px,5vw,58px) clamp(34px,5vw,58px)}.bc-history-tech .bc-history-step{min-height:210px;padding:28px;border-radius:22px;background:linear-gradient(180deg,#f7fbff 0%,#edf3ff 100%);border:1px solid rgba(37,71,155,.15);text-align:center}.bc-history-tech .bc-history-step-number{width:58px;height:58px;margin:0 auto 18px;border-radius:50%;display:grid;place-items:center;background:var(--bc-blue);color:#fff;font-size:22px;font-weight:900;box-shadow:0 12px 24px rgba(37,71,155,.22)}.bc-history-tech .bc-history-step h4{margin:0 0 10px;color:var(--bc-blue-dark);font-size:22px;line-height:1.1}.bc-history-tech .bc-history-step p{margin:0;color:var(--bc-muted);font-size:16px;line-height:1.55}.bc-history-tech .bc-history-pillars{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:18px;padding:24px 30px;background:linear-gradient(135deg,#25479b 0%,#17306f 100%);color:#fff;font-size:clamp(18px,2.5vw,27px);font-weight:900;letter-spacing:.16em;text-transform:uppercase}.bc-history-tech .bc-history-pillar-star{color:#b8cdfa}@media(max-width:820px){.bc-history-tech .bc-history-steps{grid-template-columns:1fr}.bc-history-tech .bc-history-step{min-height:0}.bc-history-tech .bc-history-pillars{gap:10px;letter-spacing:.1em}}
</style>
<div class="bc-container">
  <div class="bc-history-header">
    <h2>Where History Meets Technology</h2>
  </div>

  <div class="bc-history-panel">
    <div class="bc-history-copy">
      <h3>Join Us In Making History Matter!</h3>
      <p>Sonia Warshawski, a Holocaust survivor, shares her powerful story of survival and resilience in the award-winning documentary <em>Big Sonia</em>. This film serves as a catalyst for meaningful discussions around antisemitism, empathy, and the importance of standing up to all forms of hate.</p>
      <p>Building on this, The Blue Card’s Innovative Holocaust Education Program brings Sonia’s testimony to life through cutting-edge holographic technology. Using an interactive HoloPod system, students and participants of all ages experience a lifelike projection of Sonia recounting her experiences, allowing for a deeply personal and immersive learning experience.</p>
      <p>This program gives participants the opportunity to hear a firsthand account of the Holocaust, reflect, engage, and better understand why confronting hatred remains so critical today.</p>
    </div>

    <div class="bc-history-steps" aria-label="Interactive Holocaust education program steps">
      <article class="bc-history-step">
        <div class="bc-history-step-number">1</div>
        <h4>View</h4>
        <p>Watch <em>Big Sonia</em>, a powerful documentary about survivor Sonia Warshawski.</p>
      </article>
      <article class="bc-history-step">
        <div class="bc-history-step-number">2</div>
        <h4>Interact</h4>
        <p>Engage with Sonia’s story through a lifelike hologram experience.</p>
      </article>
      <article class="bc-history-step">
        <div class="bc-history-step-number">3</div>
        <h4>Discuss</h4>
        <p>Explore lessons on empathy, antisemitism, and standing up to hate.</p>
      </article>
    </div>

    <div class="bc-history-pillars" aria-label="Program pillars">
      <span>Educate</span>
      <span class="bc-history-pillar-star" aria-hidden="true">★</span>
      <span>Reflect</span>
      <span class="bc-history-pillar-star" aria-hidden="true">★</span>
      <span>Inspire</span>
    </div>
  </div>
</div>`;
    }

    var supportSection = document.getElementById('program-support');
    if (supportSection) {
      var existingPostcards = document.getElementById('postcards-to-sonia');
      if (existingPostcards) existingPostcards.remove();

      var postcardsSection = document.createElement('section');
      postcardsSection.id = 'postcards-to-sonia';
      postcardsSection.className = 'bc-postcards-section';
      postcardsSection.innerHTML = `
<style>
.bc-postcards-section{padding:88px 0;background:linear-gradient(180deg,#fff 0%,#f5f8ff 100%);overflow:hidden}.bc-postcards-wrap{width:min(1240px,calc(100% - 32px));margin:0 auto}.bc-postcards-head{display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:30px}.bc-postcards-kicker{color:#25479b;font-size:13px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px}.bc-postcards-title{margin:0;color:#17306f;font-size:clamp(34px,4.5vw,56px);line-height:1.02;letter-spacing:-.035em}.bc-postcards-note{max-width:430px;margin:0;color:#5d6a86;font-size:16px;line-height:1.6}.bc-postcards-shell{position:relative}.bc-postcards-track{display:grid;grid-auto-flow:column;grid-auto-columns:min(74vw,780px);gap:22px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;overscroll-behavior-inline:contain;scrollbar-width:none;padding:6px max(0px,calc((100% - min(74vw,780px))/2)) 24px;touch-action:pan-x pan-y;-webkit-overflow-scrolling:touch}.bc-postcards-track::-webkit-scrollbar{display:none}.bc-postcard-slide{scroll-snap-align:center;background:#fff;border:1px solid rgba(37,71,155,.14);border-radius:24px;box-shadow:0 16px 42px rgba(14,32,79,.12);overflow:hidden;cursor:zoom-in;transition:transform .2s ease,box-shadow .2s ease}.bc-postcard-slide:hover{transform:translateY(-3px);box-shadow:0 22px 52px rgba(14,32,79,.16)}.bc-postcard-slide img{display:block;width:100%;height:min(62vw,560px);object-fit:contain;background:#fff}.bc-postcards-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:52px;height:52px;border-radius:50%;border:1px solid rgba(255,255,255,.7);background:rgba(23,48,111,.92);color:#fff;display:grid;place-items:center;font-size:28px;line-height:1;cursor:pointer;box-shadow:0 10px 28px rgba(12,31,75,.22);transition:.2s ease}.bc-postcards-arrow:hover{background:#25479b;transform:translateY(-50%) scale(1.05)}.bc-postcards-prev{left:10px}.bc-postcards-next{right:10px}.bc-postcards-dots{display:flex;justify-content:center;gap:9px;margin-top:2px;flex-wrap:wrap}.bc-postcards-dot{width:10px;height:10px;border-radius:50%;border:0;padding:0;background:#c4d2ed;cursor:pointer;transition:.2s ease}.bc-postcards-dot.is-active{width:28px;border-radius:999px;background:#25479b}.bc-postcards-modal{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(5,14,38,.92);backdrop-filter:blur(8px)}.bc-postcards-modal.is-open{display:flex}.bc-postcards-modal-image{max-width:96vw;max-height:90vh;width:auto;height:auto;object-fit:contain;box-shadow:0 28px 80px rgba(0,0,0,.48);border-radius:10px;background:#fff}.bc-postcards-modal-close{position:fixed;top:18px;right:20px;width:48px;height:48px;border:1px solid rgba(255,255,255,.45);border-radius:50%;background:rgba(255,255,255,.14);color:#fff;font-size:28px;line-height:1;cursor:pointer;display:grid;place-items:center}.bc-postcards-modal-count{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);color:#fff;font-size:14px;font-weight:800}.bc-postcards-modal-nav{position:fixed;top:50%;transform:translateY(-50%);width:48px;height:48px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:26px;cursor:pointer}.bc-postcards-modal-prev{left:18px}.bc-postcards-modal-next{right:18px}@media(max-width:760px){.bc-postcards-section{padding:66px 0}.bc-postcards-wrap{width:min(100% - 20px,1240px)}.bc-postcards-head{display:block;margin-bottom:24px}.bc-postcards-note{margin-top:12px}.bc-postcards-track{grid-auto-columns:88vw;gap:14px;padding-left:calc((100% - 88vw)/2);padding-right:calc((100% - 88vw)/2)}.bc-postcard-slide img{height:76vw;max-height:520px}.bc-postcards-arrow{display:none}.bc-postcards-modal{padding:12px}.bc-postcards-modal-nav{display:none}.bc-postcards-modal-close{top:10px;right:10px}}
</style>
<div class="bc-postcards-wrap">
  <div class="bc-postcards-head">
    <div>
      <div class="bc-postcards-kicker">Sonia's Story</div>
      <h2 class="bc-postcards-title">Postcards to Sonia</h2>
    </div>
    <p class="bc-postcards-note">Swipe or use the arrows to explore the postcards. Select any image to view it full size.</p>
  </div>
  <div class="bc-postcards-shell">
    <button class="bc-postcards-arrow bc-postcards-prev" type="button" aria-label="Previous postcard">‹</button>
    <div class="bc-postcards-track" tabindex="0" aria-label="Postcards to Sonia image carousel">
      <figure class="bc-postcard-slide" data-index="0"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-1a.jpg" alt="Postcards to Sonia, image 1" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="1"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia%20(1).jpg" alt="Postcards to Sonia, image 2" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="2"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia%20(3).jpg" alt="Postcards to Sonia, image 3" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="3"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia%20(4).jpg" alt="Postcards to Sonia, image 4" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="4"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia%20(5).jpg" alt="Postcards to Sonia, image 5" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="5"><img src="/bluecard/images/interactive-hologram/postcards/postcard-to-sonia-6.png" alt="Postcards to Sonia, image 6" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="6"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-8.png" alt="Postcards to Sonia, image 7" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="7"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-9.png" alt="Postcards to Sonia, image 8" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="8"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-10.png" alt="Postcards to Sonia, image 9" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="9"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-11.png" alt="Postcards to Sonia, image 10" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="10"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-12.png" alt="Postcards to Sonia, image 11" loading="lazy"></figure>
      <figure class="bc-postcard-slide" data-index="11"><img src="/bluecard/images/interactive-hologram/postcards/postcards-to-sonia-13.png" alt="Postcards to Sonia, image 12" loading="lazy"></figure>
    </div>
    <button class="bc-postcards-arrow bc-postcards-next" type="button" aria-label="Next postcard">›</button>
  </div>
  <div class="bc-postcards-dots" aria-label="Choose postcard">
    <button class="bc-postcards-dot is-active" type="button" aria-label="Postcard 1" data-index="0"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 2" data-index="1"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 3" data-index="2"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 4" data-index="3"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 5" data-index="4"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 6" data-index="5"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 7" data-index="6"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 8" data-index="7"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 9" data-index="8"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 10" data-index="9"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 11" data-index="10"></button>
    <button class="bc-postcards-dot" type="button" aria-label="Postcard 12" data-index="11"></button>
  </div>
</div>`;
      supportSection.parentNode.insertBefore(postcardsSection, supportSection);

      var modal = document.createElement('div');
      modal.className = 'bc-postcards-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Postcard full-size viewer');
      modal.innerHTML = '<button class="bc-postcards-modal-close" type="button" aria-label="Close full-size image">×</button><button class="bc-postcards-modal-nav bc-postcards-modal-prev" type="button" aria-label="Previous image">‹</button><img class="bc-postcards-modal-image" alt=""><button class="bc-postcards-modal-nav bc-postcards-modal-next" type="button" aria-label="Next image">›</button><div class="bc-postcards-modal-count"></div>';
      document.body.appendChild(modal);

      var track = postcardsSection.querySelector('.bc-postcards-track');
      var slides = Array.from(postcardsSection.querySelectorAll('.bc-postcard-slide'));
      var dots = Array.from(postcardsSection.querySelectorAll('.bc-postcards-dot'));
      var prevButton = postcardsSection.querySelector('.bc-postcards-prev');
      var nextButton = postcardsSection.querySelector('.bc-postcards-next');
      var modalImage = modal.querySelector('.bc-postcards-modal-image');
      var modalCount = modal.querySelector('.bc-postcards-modal-count');
      var currentIndex = 0;
      var autoTimer = null;
      var resumeTimer = null;
      var touchStartX = 0;

      function updateDots(index) {
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }

      function goToSlide(index, behavior) {
        currentIndex = (index + slides.length) % slides.length;
        var slide = slides[currentIndex];
        if (slide && track) {
          track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: behavior || 'smooth' });
        }
        updateDots(currentIndex);
      }

      function startAuto() {
        window.clearInterval(autoTimer);
        autoTimer = window.setInterval(function () {
          goToSlide(currentIndex + 1, 'smooth');
        }, 6000);
      }

      function pauseAndResumeAuto() {
        window.clearInterval(autoTimer);
        window.clearTimeout(resumeTimer);
        resumeTimer = window.setTimeout(startAuto, 6000);
      }

      function openModal(index) {
        currentIndex = (index + slides.length) % slides.length;
        var image = slides[currentIndex].querySelector('img');
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCount.textContent = (currentIndex + 1) + ' / ' + slides.length;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        pauseAndResumeAuto();
      }

      function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        startAuto();
      }

      slides.forEach(function (slide, index) {
        slide.addEventListener('click', function () { openModal(index); });
      });

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          goToSlide(Number(dot.getAttribute('data-index')), 'smooth');
          pauseAndResumeAuto();
        });
      });

      if (prevButton) prevButton.addEventListener('click', function () { goToSlide(currentIndex - 1, 'smooth'); pauseAndResumeAuto(); });
      if (nextButton) nextButton.addEventListener('click', function () { goToSlide(currentIndex + 1, 'smooth'); pauseAndResumeAuto(); });

      if (track) {
        track.addEventListener('touchstart', function (event) {
          touchStartX = event.touches[0].clientX;
          window.clearInterval(autoTimer);
        }, { passive: true });
        track.addEventListener('touchend', function (event) {
          var touchEndX = event.changedTouches[0].clientX;
          var delta = touchStartX - touchEndX;
          if (Math.abs(delta) > 35) goToSlide(currentIndex + (delta > 0 ? 1 : -1), 'smooth');
          pauseAndResumeAuto();
        }, { passive: true });
        track.addEventListener('mouseenter', function () { window.clearInterval(autoTimer); });
        track.addEventListener('mouseleave', startAuto);
        track.addEventListener('focusin', function () { window.clearInterval(autoTimer); });
        track.addEventListener('focusout', startAuto);
      }

      modal.querySelector('.bc-postcards-modal-close').addEventListener('click', closeModal);
      modal.querySelector('.bc-postcards-modal-prev').addEventListener('click', function () { openModal(currentIndex - 1); });
      modal.querySelector('.bc-postcards-modal-next').addEventListener('click', function () { openModal(currentIndex + 1); });
      modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });
      document.addEventListener('keydown', function (event) {
        if (!modal.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeModal();
        if (event.key === 'ArrowLeft') openModal(currentIndex - 1);
        if (event.key === 'ArrowRight') openModal(currentIndex + 1);
      });

      goToSlide(0, 'auto');
      startAuto();

      supportSection.className = 'bc-section bc-advisory-legacy-section';
      supportSection.innerHTML = `
<style>
.bc-advisory-legacy-section{padding:88px 0;background:#f7f9fe}
.bc-advisory-legacy{position:relative;overflow:hidden;padding:clamp(48px,7vw,90px);border:1px solid rgba(255,255,255,.2);border-radius:34px;color:#fff;background:radial-gradient(circle at 20% 10%,#3966b9 0%,#173b7a 42%,#0f2857 100%);box-shadow:0 22px 60px rgba(14,45,100,.16)}
.bc-advisory-legacy:before{content:"1934";position:absolute;right:-12px;bottom:-56px;color:rgba(255,255,255,.045);font-size:clamp(180px,26vw,390px);font-weight:800;letter-spacing:-.08em;line-height:.8;pointer-events:none}
.bc-advisory-legacy-head,.bc-advisory-legacy-layout{position:relative;z-index:2}
.bc-advisory-legacy-eyebrow{font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#b9cdf3}
.bc-advisory-legacy-title{max-width:920px;margin:14px 0 0;color:#fff;font-size:clamp(38px,5vw,68px);font-weight:900;line-height:1.02;letter-spacing:-.045em}
.bc-advisory-legacy-layout{display:grid;grid-template-columns:300px minmax(0,1fr);gap:52px;margin-top:44px}
.bc-advisory-legacy-chair{padding:32px 0 32px 28px;border-left:2px solid #adc5ef}
.bc-advisory-legacy-chair-label{font-size:12px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#afc7f1}
.bc-advisory-legacy-chair-name{margin-top:16px;color:#fff;font-family:inherit;font-size:34px;font-weight:800;line-height:1.08;letter-spacing:-.02em}
.bc-advisory-legacy-members{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 34px}
.bc-advisory-legacy-member{padding:16px 0;border-bottom:1px solid rgba(255,255,255,.18);color:#f2f6ff;font-family:inherit;font-size:21px;font-weight:700;line-height:1.25}
@media(max-width:820px){.bc-advisory-legacy-section{padding:66px 0}.bc-advisory-legacy{padding:38px 28px}.bc-advisory-legacy-layout{grid-template-columns:1fr;gap:34px;margin-top:42px}.bc-advisory-legacy-chair{padding:24px 0 24px 22px}.bc-advisory-legacy-members{grid-template-columns:1fr}}
@media(max-width:520px){.bc-advisory-legacy{padding:30px 20px;border-radius:24px}.bc-advisory-legacy-title{font-size:36px}.bc-advisory-legacy-chair-name{font-size:30px}.bc-advisory-legacy-member{font-size:19px}.bc-advisory-legacy:before{right:-20px;bottom:-22px;font-size:190px}}
</style>
<div class="bc-container">
  <div class="bc-advisory-legacy">
    <div class="bc-advisory-legacy-head">
      <div class="bc-advisory-legacy-eyebrow">Education Support</div>
      <h2 class="bc-advisory-legacy-title">The Blue Card Holocaust Education Advisory Panel</h2>
    </div>
    <div class="bc-advisory-legacy-layout">
      <div class="bc-advisory-legacy-chair">
        <div class="bc-advisory-legacy-chair-label">Panel Chair</div>
        <div class="bc-advisory-legacy-chair-name">Michael Berenbaum</div>
      </div>
      <div class="bc-advisory-legacy-members" aria-label="Panel members">
        <div class="bc-advisory-legacy-member">Mehnaz Afridi</div>
        <div class="bc-advisory-legacy-member">Dr. Eva Fogelman</div>
        <div class="bc-advisory-legacy-member">Sofija Grandakovska</div>
        <div class="bc-advisory-legacy-member">Robin Hizme</div>
        <div class="bc-advisory-legacy-member">Michael Miller</div>
        <div class="bc-advisory-legacy-member">Mitchell Pinsky</div>
        <div class="bc-advisory-legacy-member">Joseph Potasnik</div>
      </div>
    </div>
  </div>
</div>`;
    }
  }

  function applyHomepageUpdates() {
    var injectedSurvivorCta = document.getElementById('homepage-survivor-cta');
    if (injectedSurvivorCta) injectedSurvivorCta.remove();

    Array.from(document.querySelectorAll('main blockquote')).forEach(function (quote) {
      if (quote.textContent.indexOf("The Blue Card didn't just pay my medical bills") !== -1) {
        var section = quote.closest('section');
        if (section) section.remove();
      }
    });

    var podcastHeading = Array.from(document.querySelectorAll('main h2')).find(function (heading) {
      return heading.textContent.trim() === 'The Longevity Paradox of Holocaust Survivors';
    });
    if (podcastHeading) {
      var podcastSection = podcastHeading.closest('section');
      if (podcastSection) podcastSection.remove();
    }

    var helpHeading = Array.from(document.querySelectorAll('main h2')).find(function (heading) {
      return heading.textContent.trim() === 'How You Can Help';
    });

    if (helpHeading) {
      var helpSection = helpHeading.closest('section');
      if (helpSection) {
        helpSection.innerHTML = `
<div class="max-w-7xl mx-auto px-6">
  <div class="text-center mb-16">
    <h2 class="font-headline text-4xl font-bold text-on-surface mb-4">How You Can Help</h2>
    <p class="text-on-surface-variant max-w-2xl mx-auto text-lg">Your support translates directly into dignity for those who have suffered most.</p>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    <div class="bg-surface-container-lowest p-7 rounded-xl ghost-border text-center flex flex-col h-full">
      <span class="material-symbols-outlined text-primary text-4xl mb-6" aria-hidden="true">volunteer_activism</span>
      <h3 class="text-xl font-bold mb-4">Donate</h3>
      <p class="text-on-surface-variant text-sm mb-8 flex-grow">Provide direct financial assistance to Holocaust survivors in need.</p>
      <a class="donate-rollover text-primary font-bold uppercase text-xs tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1 transition-all" href="/bluecard/donate/" rel="noopener noreferrer" target="_blank">Donate Now</a>
    </div>
    <div class="bg-surface-container-lowest p-7 rounded-xl ghost-border text-center flex flex-col h-full">
      <span class="material-symbols-outlined text-primary text-4xl mb-6" aria-hidden="true">celebration</span>
      <h3 class="text-xl font-bold mb-4">B’nei Mitzvah Simcha Project</h3>
      <p class="text-on-surface-variant text-sm mb-8 flex-grow">Turn a meaningful milestone into support for Holocaust survivors.</p>
      <a class="text-primary font-bold uppercase text-xs tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1 transition-all" href="/bluecard/bnei-mitzvah-simcha-project">Learn More</a>
    </div>
    <div class="bg-surface-container-lowest p-7 rounded-xl ghost-border text-center flex flex-col h-full">
      <span class="material-symbols-outlined text-primary text-4xl mb-6" aria-hidden="true">directions_run</span>
      <h3 class="text-xl font-bold mb-4">Team Blue Card</h3>
      <p class="text-on-surface-variant text-sm mb-8 flex-grow">Raise funds through athletic events and community challenges.</p>
      <a class="text-primary font-bold uppercase text-xs tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1 transition-all" href="/bluecard/team-blue-card/">Join the Team</a>
    </div>
    <div class="bg-surface-container-lowest p-7 rounded-xl ghost-border text-center flex flex-col h-full">
      <span class="material-symbols-outlined text-primary text-4xl mb-6" aria-hidden="true">groups</span>
      <h3 class="text-xl font-bold mb-4">Volunteering</h3>
      <p class="text-on-surface-variant text-sm mb-8 flex-grow">Give your time and skills to help survivors feel supported and remembered.</p>
      <a class="text-primary font-bold uppercase text-xs tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1 transition-all" href="/bluecard/volunteering/">Volunteer</a>
    </div>
    <div class="bg-surface-container-lowest p-7 rounded-xl ghost-border text-center flex flex-col h-full">
      <span class="material-symbols-outlined text-primary text-4xl mb-6" aria-hidden="true">coffee</span>
      <h3 class="text-xl font-bold mb-4">Blue Card Coffee</h3>
      <p class="text-on-surface-variant text-sm mb-8 flex-grow">Support Holocaust survivors through every purchase.</p>
      <a class="text-primary font-bold uppercase text-xs tracking-widest border-b-2 border-primary/20 hover:border-primary pb-1 transition-all" href="https://bluecardcoffee.org/" rel="noopener noreferrer" target="_blank">Visit Blue Card Coffee</a>
    </div>
  </div>
</div>`;

        var existingMashaSection = document.getElementById('homepage-masha-quote');
        if (existingMashaSection) existingMashaSection.remove();

        var mashaSection = document.createElement('section');
        mashaSection.id = 'homepage-masha-quote';
        mashaSection.className = 'bc-masha-quote-section';
        mashaSection.innerHTML = `
<style>
.bc-masha-quote-section{background:linear-gradient(135deg,#003f7d 0%,#0b56a4 100%);color:#fff;padding:72px 24px}.bc-masha-quote-wrap{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:64px;align-items:center}.bc-masha-quote-copy{min-width:0}.bc-masha-quote-mark{display:block;font-family:Georgia,serif;font-size:82px;line-height:.55;color:#a8c8ff;margin-bottom:24px}.bc-masha-quote-text{margin:0;font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(32px,4.5vw,54px);font-style:italic;font-weight:700;line-height:1.12;letter-spacing:-.025em}.bc-masha-quote-close{display:block;text-align:right;font-family:Georgia,serif;font-size:82px;line-height:.55;color:#a8c8ff;margin:18px 0 -4px}.bc-masha-quote-rule{width:72px;height:4px;background:#a8c8ff;margin:34px 0 22px}.bc-masha-quote-name{margin:0;font-family:Inter,sans-serif;font-size:16px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#d6e3ff}.bc-masha-quote-photo{width:300px;height:360px;border-radius:26px;overflow:hidden;border:4px solid rgba(255,255,255,.18);box-shadow:0 24px 54px rgba(0,20,50,.35)}.bc-masha-quote-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top}@media(max-width:820px){.bc-masha-quote-section{padding:58px 20px}.bc-masha-quote-wrap{grid-template-columns:1fr;gap:38px;text-align:center}.bc-masha-quote-rule{margin:30px auto 20px}.bc-masha-quote-photo{width:min(100%,300px);height:340px;margin:0 auto;grid-row:1}.bc-masha-quote-mark{margin-bottom:18px}.bc-masha-quote-close{text-align:center;margin-top:16px}}
</style>
<div class="bc-masha-quote-wrap">
  <div class="bc-masha-quote-copy">
    <span class="bc-masha-quote-mark" aria-hidden="true">“</span>
    <blockquote class="bc-masha-quote-text">No survivor should face their final years alone, without dignity, without hope.</blockquote>
    <span class="bc-masha-quote-close" aria-hidden="true">”</span>
    <div class="bc-masha-quote-rule"></div>
    <p class="bc-masha-quote-name">— Masha Pearl, Executive Director</p>
  </div>
  <div class="bc-masha-quote-photo">
    <img src="/bluecard/images/staff/masha_pearl-vertical-photo.jpg" alt="Masha Pearl, Executive Director of The Blue Card">
  </div>
</div>`;
        helpSection.insertAdjacentElement('afterend', mashaSection);
      }
    }

    var supportersSection = document.querySelector('main .homepage-supporters');
    if (supportersSection) supportersSection.remove();

    var antiFlickerStyle = document.getElementById('homepage-quote-antiflicker');
    if (antiFlickerStyle) antiFlickerStyle.remove();
  }
})();
