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

        if (!document.getElementById('homepage-masha-quote')) {
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
    }

    var supportersSection = document.querySelector('main .homepage-supporters');
    if (supportersSection) supportersSection.remove();
  }

  var baseScript = document.createElement('script');
  baseScript.src = '/bluecard/global-layout-base.js?v=20260804-6';
  baseScript.onload = function () {
    var homepageScript = document.createElement('script');
    homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260804-6';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);
})();
