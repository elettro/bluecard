(function () {
  var currentPath = (window.location.pathname || '/').replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';

  if (currentPath === '/bluecard/interactive-hologram') {
    var steps = document.querySelector('.bc-history-steps');
    if (!steps) return;

    if (!document.getElementById('bc-hologram-reference-steps-style')) {
      var stepStyle = document.createElement('style');
      stepStyle.id = 'bc-hologram-reference-steps-style';
      stepStyle.textContent = `
.bc-history-tech .bc-history-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:34px;padding:8px clamp(30px,5vw,58px) clamp(40px,5vw,62px)}
.bc-history-tech .bc-history-step{min-height:0;padding:0;border:0;border-radius:0;background:transparent;text-align:center;box-shadow:none}
.bc-history-tech .bc-history-step-top{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px;color:#294ca4}
.bc-history-tech .bc-history-step-icon{width:64px;height:64px;display:block;flex:0 0 auto}
.bc-history-tech .bc-history-step-label{font-size:clamp(25px,2.6vw,36px);font-weight:900;line-height:1;letter-spacing:-.025em;text-transform:uppercase}
.bc-history-tech .bc-history-step-copy{min-height:126px;display:flex;align-items:center;justify-content:center;padding:20px 22px;border-radius:15px;background:#a71920;color:#fff;font-size:17px;font-weight:800;line-height:1.38;box-shadow:0 12px 28px rgba(126,15,22,.18);transition:transform .2s ease,box-shadow .2s ease}
.bc-history-tech .bc-history-step-copy em{color:inherit}
.bc-history-tech .bc-history-step:hover .bc-history-step-copy{transform:translateY(-2px);box-shadow:0 16px 34px rgba(126,15,22,.24)}
@media(max-width:820px){.bc-history-tech .bc-history-steps{grid-template-columns:1fr;gap:30px}.bc-history-tech .bc-history-step-copy{min-height:0}.bc-history-tech .bc-history-step-top{margin-bottom:12px}}
`;
      document.head.appendChild(stepStyle);
    }

    steps.innerHTML = `
<article class="bc-history-step">
  <div class="bc-history-step-top">
    <svg class="bc-history-step-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M4 32s10-16 28-16 28 16 28 16-10 16-28 16S4 32 4 32Z" fill="none" stroke="currentColor" stroke-width="4"/>
      <circle cx="32" cy="32" r="8" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M15 13l4 6M32 8v7M49 13l-4 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
    </svg>
    <span class="bc-history-step-label">Step 1</span>
  </div>
  <div class="bc-history-step-copy">View <em>Big Sonia</em>, a powerful documentary about survivor Sonia Warshawski.</div>
</article>
<article class="bc-history-step">
  <div class="bc-history-step-top">
    <svg class="bc-history-step-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M8 14h34a10 10 0 0 1 10 10v10a10 10 0 0 1-10 10H26L15 54V44H8A8 8 0 0 1 0 36V22a8 8 0 0 1 8-8Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="20" cy="29" r="3" fill="currentColor"/>
      <circle cx="30" cy="29" r="3" fill="currentColor"/>
      <circle cx="40" cy="29" r="3" fill="currentColor"/>
    </svg>
    <span class="bc-history-step-label">Step 2</span>
  </div>
  <div class="bc-history-step-copy">Interact with Sonia’s story through a lifelike hologram experience.</div>
</article>
<article class="bc-history-step">
  <div class="bc-history-step-top">
    <svg class="bc-history-step-icon" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M28 6c-12 0-21 9-21 21 0 8 4 14 10 18v9h22v-8c6-4 10-11 10-19C49 15 40 6 28 6Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <path d="M20 54v5h16v-5M53 10v8M49 14h8M51 29l6 4M45 3l4 6" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      <circle cx="28" cy="27" r="6" fill="none" stroke="currentColor" stroke-width="4"/>
      <path d="M28 17v4M28 33v4M18 27h4M34 27h4" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    </svg>
    <span class="bc-history-step-label">Step 3</span>
  </div>
  <div class="bc-history-step-copy">Discuss lessons on empathy, antisemitism, and standing up to hate.</div>
</article>`;
    return;
  }

  if (currentPath !== '/bluecard' && currentPath !== '/') return;

  var oldSection = document.getElementById('core-programs');
  if (!oldSection || document.getElementById('homepage-how-we-help')) return;

  var section = document.createElement('section');
  section.id = 'homepage-how-we-help';
  section.className = 'bc-help-section';
  section.innerHTML = `
<style>
.bc-help-section{padding:78px 20px 88px;background:linear-gradient(180deg,#f8fbfe 0%,#edf4fb 100%);overflow:hidden}.bc-help-wrap{max-width:1440px;margin:0 auto}.bc-help-head{text-align:center;margin:0 auto 34px;max-width:820px}.bc-help-eyebrow{display:block;margin-bottom:9px;font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#d59a2f}.bc-help-title{margin:0 0 12px;font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(38px,5vw,58px);line-height:1.05;font-weight:700}.bc-help-title a{color:#084b8c;text-decoration:none}.bc-help-title a:hover,.bc-help-title a:focus-visible{text-decoration:underline;text-underline-offset:7px}.bc-help-copy{margin:0;color:#5d7188;font-size:18px;line-height:1.6}.bc-help-shell{position:relative;padding:0 58px}.bc-help-viewport{overflow:hidden;border-radius:26px;touch-action:pan-y}.bc-help-track{display:flex;transition:transform .5s ease;will-change:transform}.bc-help-slide{flex:0 0 25%;padding:10px}.bc-help-card{height:100%;min-height:500px;display:flex;flex-direction:column;background:#fff;border:1px solid rgba(8,75,140,.1);border-radius:20px;overflow:hidden;box-shadow:0 14px 34px rgba(8,75,140,.12)}.bc-help-image{height:220px;overflow:hidden;background:#dce8f3}.bc-help-image img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .4s ease}.bc-help-card:hover .bc-help-image img{transform:scale(1.04)}.bc-help-body{display:flex;flex-direction:column;flex:1;padding:24px}.bc-help-body h3{margin:0 0 14px;color:#084b8c;font-family:"Plus Jakarta Sans",sans-serif;font-size:25px;line-height:1.13}.bc-help-body p{margin:0 0 24px;color:#5d7188;font-size:17px;line-height:1.58}.bc-help-link{display:inline-flex;align-items:center;justify-content:center;width:max-content;margin-top:auto;padding:12px 18px;border-radius:11px;background:#0b61b3;color:#fff;font-weight:800;text-decoration:none;box-shadow:0 8px 18px rgba(11,97,179,.22)}.bc-help-link:hover,.bc-help-link:focus-visible{background:#084b8c;transform:translateY(-2px)}.bc-help-arrow{position:absolute;top:50%;transform:translateY(-50%);z-index:3;width:48px;height:48px;border:1px solid rgba(8,75,140,.18);border-radius:50%;background:#fff;color:#0b61b3;box-shadow:0 10px 24px rgba(8,75,140,.14);font-size:28px;line-height:1;cursor:pointer}.bc-help-prev{left:0}.bc-help-next{right:0}.bc-help-dots{display:flex;justify-content:center;gap:9px;margin-top:22px}.bc-help-dot{width:10px;height:10px;padding:0;border:0;border-radius:50%;background:#bed1e5;cursor:pointer}.bc-help-dot.is-active{background:#0b61b3;transform:scale(1.18)}@media(max-width:1100px){.bc-help-slide{flex-basis:50%}}@media(max-width:700px){.bc-help-section{padding:58px 10px 68px}.bc-help-shell{padding:0 40px}.bc-help-slide{flex-basis:100%;padding:7px}.bc-help-image{height:210px}.bc-help-card{min-height:470px}.bc-help-arrow{width:38px;height:38px;font-size:22px}}
</style>
<div class="bc-help-wrap">
  <div class="bc-help-head">
    <span class="bc-help-eyebrow">Our Programs</span>
    <h2 class="bc-help-title"><a href="/bluecard/how-we-help/">How We Help</a></h2>
    <p class="bc-help-copy">Direct assistance, ongoing care, and education help Holocaust survivors live with dignity while ensuring future generations remember.</p>
  </div>
  <div class="bc-help-shell">
    <button class="bc-help-arrow bc-help-prev" type="button" aria-label="Previous program">‹</button>
    <div class="bc-help-viewport">
      <div class="bc-help-track">
        <div class="bc-help-slide"><article class="bc-help-card"><div class="bc-help-image"><img src="images/homepage/emergency-cash-assistance.png" alt="Emergency assistance for Holocaust survivors"></div><div class="bc-help-body"><h3>Emergency Assistance</h3><p>When a survivor faces a crisis, we respond within days.</p><a class="bc-help-link" href="/bluecard/emergency-assistance/index.html">Learn More</a></div></article></div>
        <div class="bc-help-slide"><article class="bc-help-card"><div class="bc-help-image"><img src="images/homepage/monthly-assistance.png" alt="Ongoing support for Holocaust survivors"></div><div class="bc-help-body"><h3>Ongoing Support</h3><p>Consistent medical and financial assistance so survivors live with independence and dignity.</p><a class="bc-help-link" href="/bluecard/ongoing-support/index.html">Learn More</a></div></article></div>
        <div class="bc-help-slide"><article class="bc-help-card"><div class="bc-help-image"><img src="images/homepage/health-welbeing.png" alt="Health and well-being support for Holocaust survivors"></div><div class="bc-help-body"><h3>Health and Well-being</h3><p>Person-centered, trauma-informed, whole-person care for survivors.</p><a class="bc-help-link" href="/bluecard/health-well-being/index.html">Learn More</a></div></article></div>
        <div class="bc-help-slide"><article class="bc-help-card"><div class="bc-help-image"><img src="images/homepage/telephone-assistance.png" alt="Medication assistance for Holocaust survivors"></div><div class="bc-help-body"><h3>Medication Assistance</h3><p>Grants and emergency aid to help survivors.</p><a class="bc-help-link" href="/bluecard/medication-assistance/index.html">Learn More</a></div></article></div>
        <div class="bc-help-slide"><article class="bc-help-card"><div class="bc-help-image"><img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&amp;fit=crop&amp;w=1200&amp;q=80" alt="Holocaust education and combating hate"></div><div class="bc-help-body"><h3>Education and Combating Hate</h3><p>Ensuring the next generation never forgets.</p><a class="bc-help-link" href="/bluecard/education-outreach/">Learn More</a></div></article></div>
      </div>
    </div>
    <button class="bc-help-arrow bc-help-next" type="button" aria-label="Next program">›</button>
  </div>
  <div class="bc-help-dots" aria-label="Program carousel navigation"></div>
</div>`;

  oldSection.replaceWith(section);

  var track = section.querySelector('.bc-help-track');
  var slides = Array.from(section.querySelectorAll('.bc-help-slide'));
  var prev = section.querySelector('.bc-help-prev');
  var next = section.querySelector('.bc-help-next');
  var dots = section.querySelector('.bc-help-dots');
  var index = 0;

  function visibleCount() {
    if (window.innerWidth <= 700) return 1;
    if (window.innerWidth <= 1100) return 2;
    return 4;
  }
  function maxIndex() { return Math.max(0, slides.length - visibleCount()); }
  function render() {
    index = Math.max(0, Math.min(index, maxIndex()));
    track.style.transform = 'translateX(-' + (index * (100 / visibleCount())) + '%)';
    Array.from(dots.children).forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === index);
    });
    prev.style.opacity = index === 0 ? '.45' : '1';
    next.style.opacity = index === maxIndex() ? '.45' : '1';
  }
  function buildDots() {
    dots.innerHTML = '';
    for (var i = 0; i <= maxIndex(); i += 1) {
      (function (dotIndex) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'bc-help-dot';
        dot.setAttribute('aria-label', 'Show program group ' + (dotIndex + 1));
        dot.addEventListener('click', function () { index = dotIndex; render(); });
        dots.appendChild(dot);
      })(i);
    }
  }
  prev.addEventListener('click', function () { index = index <= 0 ? maxIndex() : index - 1; render(); });
  next.addEventListener('click', function () { index = index >= maxIndex() ? 0 : index + 1; render(); });
  window.addEventListener('resize', function () { buildDots(); render(); });
  buildDots();
  render();
})();