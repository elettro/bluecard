(function () {
  var currentPath = (window.location.pathname || '/').replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  if (currentPath !== '/bluecard/interactive-hologram') return;
  if (document.getElementById('hologram-classroom-carousel')) return;

  var historySection = document.getElementById('program-overview');
  if (!historySection || !historySection.parentNode) return;

  var imageBase = '/bluecard/images/interactive-hologram/16x9-classroom/';
  var images = [];
  for (var i = 1; i <= 20; i += 1) {
    images.push(imageBase + '16x9-images-20-set-classrooms---%20(' + i + ').png');
  }

  var section = document.createElement('section');
  section.id = 'hologram-classroom-carousel';
  section.className = 'bc-classroom-carousel-section';
  section.innerHTML = `
<style>
.bc-classroom-carousel-section{padding:82px 0;background:linear-gradient(180deg,#f7f9fe 0%,#edf3ff 100%);overflow:hidden}.bc-classroom-carousel-wrap{width:min(1320px,calc(100% - 32px));margin:0 auto}.bc-classroom-carousel-head{display:flex;justify-content:space-between;gap:28px;align-items:end;margin-bottom:30px}.bc-classroom-carousel-title{margin:0;color:#17306f;font-size:clamp(34px,4.5vw,56px);line-height:1.02;letter-spacing:-.035em}.bc-classroom-carousel-note{max-width:450px;margin:0;color:#5d6a86;font-size:16px;line-height:1.6}.bc-classroom-carousel-shell{position:relative;padding:0 58px}.bc-classroom-carousel-viewport{overflow:hidden;border-radius:24px;touch-action:pan-y}.bc-classroom-carousel-track{display:flex;transition:transform .55s ease;will-change:transform}.bc-classroom-carousel-slide{flex:0 0 33.333333%;padding:9px}.bc-classroom-carousel-card{overflow:hidden;border:1px solid rgba(37,71,155,.14);border-radius:20px;background:#fff;box-shadow:0 14px 34px rgba(14,32,79,.11);cursor:zoom-in;transition:transform .2s ease,box-shadow .2s ease}.bc-classroom-carousel-card:hover{transform:translateY(-3px);box-shadow:0 20px 44px rgba(14,32,79,.16)}.bc-classroom-carousel-card img{display:block;width:100%;aspect-ratio:16/9;object-fit:cover;background:#e8eef8}.bc-classroom-carousel-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:4;width:48px;height:48px;border:1px solid rgba(37,71,155,.18);border-radius:50%;background:#fff;color:#24489e;box-shadow:0 10px 24px rgba(14,32,79,.15);font-size:28px;line-height:1;cursor:pointer}.bc-classroom-carousel-prev{left:0}.bc-classroom-carousel-next{right:0}.bc-classroom-carousel-meta{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:18px;color:#5d6a86;font-size:14px;font-weight:800}.bc-classroom-carousel-progress{width:min(240px,46vw);height:5px;border-radius:999px;background:#d8e1f3;overflow:hidden}.bc-classroom-carousel-progress span{display:block;height:100%;width:5%;background:#25479b;transition:width .35s ease}.bc-classroom-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(5,14,38,.93);backdrop-filter:blur(8px)}.bc-classroom-modal.is-open{display:flex}.bc-classroom-modal img{display:block;max-width:94vw;max-height:88vh;width:auto;height:auto;object-fit:contain;border-radius:10px;background:#fff;box-shadow:0 30px 90px rgba(0,0,0,.5)}.bc-classroom-modal-close,.bc-classroom-modal-nav{position:fixed;border:1px solid rgba(255,255,255,.38);border-radius:50%;background:rgba(255,255,255,.13);color:#fff;cursor:pointer}.bc-classroom-modal-close{top:18px;right:20px;width:48px;height:48px;font-size:28px}.bc-classroom-modal-nav{top:50%;transform:translateY(-50%);width:50px;height:50px;font-size:28px}.bc-classroom-modal-prev{left:18px}.bc-classroom-modal-next{right:18px}.bc-classroom-modal-count{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);padding:8px 14px;border:1px solid rgba(255,255,255,.24);border-radius:999px;background:rgba(255,255,255,.13);color:#fff;font-size:14px;font-weight:900}@media(max-width:980px){.bc-classroom-carousel-slide{flex-basis:50%}}@media(max-width:700px){.bc-classroom-carousel-section{padding:64px 0}.bc-classroom-carousel-wrap{width:min(100% - 20px,1320px)}.bc-classroom-carousel-head{display:block;margin-bottom:24px}.bc-classroom-carousel-note{margin-top:12px}.bc-classroom-carousel-shell{padding:0}.bc-classroom-carousel-slide{flex-basis:86%;padding:7px}.bc-classroom-carousel-arrow{display:none}.bc-classroom-modal{padding:12px}.bc-classroom-modal-nav{display:none}.bc-classroom-modal-close{top:10px;right:10px}}
</style>
<div class="bc-classroom-carousel-wrap">
  <div class="bc-classroom-carousel-head">
    <div>
      <h2 class="bc-classroom-carousel-title">In the Classroom</h2>
    </div>
    <p class="bc-classroom-carousel-note">See what the program looks like in schools and classrooms. Swipe on mobile or tablet, use the arrows on desktop, and select any image to view it larger.</p>
  </div>
  <div class="bc-classroom-carousel-shell">
    <button class="bc-classroom-carousel-arrow bc-classroom-carousel-prev" type="button" aria-label="Previous classroom images">‹</button>
    <div class="bc-classroom-carousel-viewport">
      <div class="bc-classroom-carousel-track" aria-label="Hologram classroom photo carousel"></div>
    </div>
    <button class="bc-classroom-carousel-arrow bc-classroom-carousel-next" type="button" aria-label="Next classroom images">›</button>
  </div>
  <div class="bc-classroom-carousel-meta"><span class="bc-classroom-carousel-count">1 / 20</span><div class="bc-classroom-carousel-progress" aria-hidden="true"><span></span></div></div>
</div>`;

  historySection.parentNode.insertBefore(section, historySection);

  var track = section.querySelector('.bc-classroom-carousel-track');
  images.forEach(function (src, index) {
    var slide = document.createElement('div');
    slide.className = 'bc-classroom-carousel-slide';
    slide.innerHTML = '<div class="bc-classroom-carousel-card" role="button" tabindex="0" data-index="' + index + '"><img src="' + src + '" alt="Interactive hologram classroom photo ' + (index + 1) + '" loading="lazy"></div>';
    track.appendChild(slide);
  });

  var slides = Array.from(section.querySelectorAll('.bc-classroom-carousel-slide'));
  var cards = Array.from(section.querySelectorAll('.bc-classroom-carousel-card'));
  var prev = section.querySelector('.bc-classroom-carousel-prev');
  var next = section.querySelector('.bc-classroom-carousel-next');
  var count = section.querySelector('.bc-classroom-carousel-count');
  var progress = section.querySelector('.bc-classroom-carousel-progress span');
  var index = 0;
  var autoTimer = null;
  var resumeTimer = null;
  var touchStartX = 0;

  function visibleCount() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 980) return 2;
    return 3;
  }

  function render() {
    var visible = visibleCount();
    slides.forEach(function (slide) { slide.style.flexBasis = (100 / visible) + '%'; });
    track.style.transform = 'translateX(-' + (index * (100 / visible)) + '%)';
    count.textContent = (index + 1) + ' / ' + images.length;
    progress.style.width = (((index + 1) / images.length) * 100) + '%';
  }

  function goTo(newIndex) {
    index = (newIndex + images.length) % images.length;
    render();
  }

  function startAuto() {
    window.clearInterval(autoTimer);
    autoTimer = window.setInterval(function () { goTo(index + 1); }, 6000);
  }

  function pauseThenResume() {
    window.clearInterval(autoTimer);
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startAuto, 6000);
  }

  prev.addEventListener('click', function () { goTo(index - 1); pauseThenResume(); });
  next.addEventListener('click', function () { goTo(index + 1); pauseThenResume(); });
  window.addEventListener('resize', render);

  var viewport = section.querySelector('.bc-classroom-carousel-viewport');
  viewport.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    window.clearInterval(autoTimer);
  }, { passive: true });
  viewport.addEventListener('touchend', function (event) {
    var delta = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(delta) > 35) goTo(index + (delta > 0 ? 1 : -1));
    pauseThenResume();
  }, { passive: true });
  viewport.addEventListener('mouseenter', function () { window.clearInterval(autoTimer); });
  viewport.addEventListener('mouseleave', startAuto);

  var modal = document.createElement('div');
  modal.className = 'bc-classroom-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Classroom image full-size viewer');
  modal.innerHTML = '<button class="bc-classroom-modal-close" type="button" aria-label="Close image viewer">×</button><button class="bc-classroom-modal-nav bc-classroom-modal-prev" type="button" aria-label="Previous image">‹</button><img alt=""><button class="bc-classroom-modal-nav bc-classroom-modal-next" type="button" aria-label="Next image">›</button><div class="bc-classroom-modal-count"></div>';
  document.body.appendChild(modal);

  var modalImage = modal.querySelector('img');
  var modalCount = modal.querySelector('.bc-classroom-modal-count');
  var modalIndex = 0;

  function openModal(newIndex) {
    modalIndex = (newIndex + images.length) % images.length;
    modalImage.src = images[modalIndex];
    modalImage.alt = 'Interactive hologram classroom photo ' + (modalIndex + 1);
    modalCount.textContent = (modalIndex + 1) + ' / ' + images.length;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    window.clearInterval(autoTimer);
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    startAuto();
  }

  cards.forEach(function (card, cardIndex) {
    card.addEventListener('click', function () { openModal(cardIndex); });
    card.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(cardIndex);
      }
    });
  });

  modal.querySelector('.bc-classroom-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.bc-classroom-modal-prev').addEventListener('click', function () { openModal(modalIndex - 1); });
  modal.querySelector('.bc-classroom-modal-next').addEventListener('click', function () { openModal(modalIndex + 1); });
  modal.addEventListener('click', function (event) { if (event.target === modal) closeModal(); });
  document.addEventListener('keydown', function (event) {
    if (!modal.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeModal();
    if (event.key === 'ArrowLeft') openModal(modalIndex - 1);
    if (event.key === 'ArrowRight') openModal(modalIndex + 1);
  });

  render();
  startAuto();
})();
