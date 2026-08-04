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
      }
    }
  }

  var baseScript = document.createElement('script');
  baseScript.src = '/bluecard/global-layout-base.js?v=20260804-4';
  baseScript.onload = function () {
    var homepageScript = document.createElement('script');
    homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260804-4';
    document.body.appendChild(homepageScript);
  };
  document.head.appendChild(baseScript);
})();
