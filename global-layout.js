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
  baseScript.src = '/bluecard/global-layout-base.js?v=20260804-8';
  baseScript.onload = function () {
    if (isHomepage) applyHomepageUpdates();

    var homepageScript = document.createElement('script');
    homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260804-8';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);

  function applyInteractiveHologramUpdates() {
    var overviewSection = document.getElementById('program-overview');
    if (overviewSection) {
      overviewSection.className = 'bc-section bc-section-soft bc-history-tech';
      overviewSection.innerHTML = `
<style>
.bc-history-tech .bc-history-header{max-width:900px;margin:0 auto 38px;text-align:center}.bc-history-tech .bc-history-header h2{margin:0;color:var(--bc-blue-dark);font-size:clamp(38px,5vw,64px);line-height:1.02;letter-spacing:-.035em}.bc-history-tech .bc-history-panel{overflow:hidden;background:#fff;border:1px solid var(--bc-line);border-radius:30px;box-shadow:var(--bc-shadow)}.bc-history-tech .bc-history-copy{padding:clamp(30px,5vw,58px)}.bc-history-tech .bc-history-copy h3{margin:0 0 24px;color:#9d1f1f;font-size:clamp(30px,4vw,48px);line-height:1.05;letter-spacing:-.025em}.bc-history-tech .bc-history-copy p{margin:0 0 18px;color:#394867;font-size:18px;line-height:1.72}.bc-history-tech .bc-history-copy p:last-of-type{margin-bottom:0}.bc-history-tech .bc-history-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;padding:0 clamp(30px,5vw,58px) clamp(34px,5vw,58px)}.bc-history-tech .bc-history-step{min-height:210px;padding:28px;border-radius:22px;background:linear-gradient(180deg,#f7fbff 0%,#edf3ff 100%);border:1px solid rgba(37,71,155,.15);text-align:center}.bc-history-tech .bc-history-step-number{width:58px;height:58px;margin:0 auto 18px;border-radius:50%;display:grid;place-items:center;background:var(--bc-blue);color:#fff;font-size:22px;font-weight:900;box-shadow:0 12px 24px rgba(37,71,155,.22)}.bc-history-tech .bc-history-step h4{margin:0 0 10px;color:var(--bc-blue-dark);font-size:22px;line-height:1.1}.bc-history-tech .bc-history-step p{margin:0;color:var(--bc-muted);font-size:16px;line-height:1.55}.bc-history-tech .bc-history-pillars{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:18px;padding:24px 30px;background:linear-gradient(135deg,#25479b 0%,#17306f 100%);color:#fff;font-size:clamp(18px,2.5vw,27px);font-weight:900;letter-spacing:.16em;text-transform:uppercase}.bc-history-tech .bc-history-pillar-star{color:#b8cdfa}@media(max-width:820px){.bc-history-tech .bc-history-steps{grid-template-columns:1fr}.bc-history-tech .bc-history-step{min-height:0}.bc-history-tech .bc-history-pillars{gap:10px;letter-spacing:.1em}}
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
      supportSection.className = 'bc-section bc-section-light bc-advisory-panel';
      supportSection.innerHTML = `
<style>
.bc-advisory-panel .bc-section-head{max-width:980px;margin-bottom:42px}.bc-advisory-panel-layout{display:grid;grid-template-columns:minmax(280px,.78fr) minmax(0,1.22fr);gap:28px;align-items:stretch}.bc-panel-chair-card,.bc-panel-members-card{border:1px solid var(--bc-line);border-radius:26px;background:linear-gradient(180deg,#fff 0%,#f5f8ff 100%);box-shadow:var(--bc-shadow-soft)}.bc-panel-chair-card{display:flex;flex-direction:column;justify-content:center;min-height:330px;padding:40px;text-align:center;background:linear-gradient(145deg,#17306f 0%,#294fa5 100%);color:#fff}.bc-panel-label{margin-bottom:18px;font-size:13px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#bcd0ff}.bc-panel-chair-name{margin:0;font-size:clamp(30px,4vw,48px);line-height:1.05;font-weight:900;color:#fff}.bc-panel-members-card{padding:34px}.bc-panel-members-card .bc-panel-label{color:var(--bc-blue)}.bc-panel-members-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.bc-panel-member{display:flex;align-items:center;min-height:74px;padding:16px 18px;border:1px solid rgba(37,71,155,.13);border-radius:16px;background:#fff;color:var(--bc-blue-dark);font-size:18px;font-weight:800;box-shadow:0 8px 20px rgba(14,32,79,.06)}@media(max-width:820px){.bc-advisory-panel-layout{grid-template-columns:1fr}.bc-panel-chair-card{min-height:250px}.bc-panel-members-grid{grid-template-columns:1fr}}
</style>
<div class="bc-container">
  <div class="bc-section-head">
    <div class="bc-section-kicker">Education Support</div>
    <h2>The Blue Card Holocaust Education Advisory Panel</h2>
  </div>
  <div class="bc-advisory-panel-layout">
    <article class="bc-panel-chair-card">
      <div class="bc-panel-label">Panel Chair</div>
      <h3 class="bc-panel-chair-name">Michael Berenbaum</h3>
    </article>
    <div class="bc-panel-members-card">
      <div class="bc-panel-label">Panel Members</div>
      <div class="bc-panel-members-grid">
        <div class="bc-panel-member">Mehnaz Afridi</div>
        <div class="bc-panel-member">Dr. Eva Fogelman</div>
        <div class="bc-panel-member">Sofija Grandakovska</div>
        <div class="bc-panel-member">Robin Hizme</div>
        <div class="bc-panel-member">Michael Miller</div>
        <div class="bc-panel-member">Mitchell Pinsky</div>
        <div class="bc-panel-member">Joseph Potasnik</div>
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
.bc-masha-quote-section{background:linear-gradient(135deg,#003f7d 0%,#0b56a4 100%);color:#fff;padding:72px 24px}.bc-masha-quote-wrap{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:64px;align-items:center}.bc-masha-quote-copy{min-width:0}.bc-masha-quote-mark{display:block;font-family:Georgia,serif;font-size:82px;line-height:.55;color:#a8c8ff;margin-bottom:24px}.bc-masha-quote-text{margin:0;font-family:"Plus Jakarta Sans",sans-serif;font-size:clamp(32px,4.5vw,54px);font-style:italic;font-weight:700;line-height:1.12;letter-spacing:-.025em}.bc-masha-quote-rule{width:72px;height:4px;background:#a8c8ff;margin:34px 0 22px}.bc-masha-quote-name{margin:0;font-family:Inter,sans-serif;font-size:16px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:#d6e3ff}.bc-masha-quote-photo{width:300px;height:360px;border-radius:26px;overflow:hidden;border:4px solid rgba(255,255,255,.18);box-shadow:0 24px 54px rgba(0,20,50,.35)}.bc-masha-quote-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:center top}@media(max-width:820px){.bc-masha-quote-section{padding:58px 20px}.bc-masha-quote-wrap{grid-template-columns:1fr;gap:38px;text-align:center}.bc-masha-quote-rule{margin:30px auto 20px}.bc-masha-quote-photo{width:min(100%,300px);height:340px;margin:0 auto;grid-row:1}.bc-masha-quote-mark{margin-bottom:18px}}
</style>
<div class="bc-masha-quote-wrap">
  <div class="bc-masha-quote-copy">
    <span class="bc-masha-quote-mark" aria-hidden="true">“</span>
    <blockquote class="bc-masha-quote-text">No survivor should face their final years alone, without dignity, without hope.</blockquote>
    <div class="bc-masha-quote-rule"></div>
    <p class="bc-masha-quote-name">— Masha Pearl, Executive Director</p>
  </div>
  <div class="bc-masha-quote-photo">
    <img src="https://bluecardfund.org/wp-content/uploads/2025/02/111-VGindiphotosm-768x768.jpg" alt="Masha Pearl, Executive Director of The Blue Card">
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
