(function () {
  if (document.body && document.body.hasAttribute('data-bc-layout-exception')) return;

  const UPCOMING_EVENTS_URL = '/bluecard/upcoming-events/';
  const SPEAKERS_BUREAU_URL = '/bluecard/speakers-bureau/';

  var navTarget = document.getElementById('bc-global-nav');
  if (navTarget) {
    navTarget.innerHTML = `
<div class="bc-top-donate-strip" role="region" aria-label="Donate call to action">
  <a class="bc-top-donate-btn" href="/bluecard/donate/" rel="noopener noreferrer" target="_blank">DONATE</a>
  <div class="bc-top-contact" aria-label="The Blue Card contact information">
    <a class="bc-top-contact-link" href="tel:2122392251">
      <svg class="bc-top-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6.6 10.8c1.7 3.4 4.2 5.9 7.6 7.6l2.5-2.5c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.9 22 2 13.1 2 2c0-.6.4-1 1-1h3.8c.6 0 1 .4 1 1 0 1.4.2 2.7.6 4 .1.4 0 .9-.3 1.2l-2.5 2.6Z"></path></svg>
      <span>212.239.2251</span>
    </a>
    <a class="bc-top-contact-link" href="mailto:info@bluecard.org">
      <svg class="bc-top-contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M3 5h18c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H3c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1Zm9 7.2L4.7 7H4v.8l8 5.7 8-5.7V7h-.7L12 12.2Z"></path></svg>
      <span>info@bluecard.org</span>
    </a>
  </div>
</div>
<nav class="bluecard-nav" aria-label="Main Navigation">
  <div class="bluecard-nav-mobile-bar">
    <a class="bluecard-nav-logo" href="/bluecard/index.html" aria-label="The Blue Card home">
      <img src="/bluecard/images/logo/blue-card-logo-fullsize-.png" alt="The Blue Card">
    </a>
    <button class="bluecard-nav-toggle" type="button" aria-expanded="false" aria-controls="bluecard-main-menu" aria-label="Toggle navigation menu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="bluecard-nav-inner">
    <a class="site-logo" href="/bluecard/index.html" aria-label="The Blue Card home">
      <img src="/bluecard/images/logo/blue-card-logo-fullsize-.png" alt="The Blue Card">
    </a>
    <ul class="menu" id="bluecard-main-menu">
    <li><a href="/bluecard/index.html">Home</a></li>
    <li class="menu-item-has-children"><a href="/bluecard/who-we-are/index.html">Who We Are</a><ul class="sub-menu"><li><a href="/bluecard/our-mission/index.html">Our Mission</a></li><li><a href="/bluecard/our-supporters/">Our Supporters</a></li><li><a href="/bluecard/blog/index.html">Blog</a></li></ul></li>
    <li class="menu-item-has-children"><a href="https://elettro.github.io/bluecard/how-we-help">How We Help</a><ul class="sub-menu"><li><a href="/bluecard/emergency-cash-assistance/">Emergency Cash Assistance</a></li><li><a href="/bluecard/dental-and-medical-assistance/">Dental and Medical Assistance</a></li><li><a href="/bluecard/telephone-response-system/">Telephone Response System</a></li><li><a href="/bluecard/ongoing-assistance/">Ongoing Assistance</a></li><li><a href="/bluecard/medication-assistance-grant/">Medication Assistance Grant</a></li><li><a href="/bluecard/cost-plus-drug-company/">Cost Plus Drug Company</a></li><li><a href="/bluecard/siggi-b-wilzig-fighting-cancer-together-program/">Siggi B. Wilzig Fighting Cancer Together Program</a></li><li><a href="/bluecard/health-and-wellbeing/">Health &amp; Wellbeing</a></li><li><a href="/bluecard/natural-disaster-relief/">Natural Disaster Relief</a></li></ul></li>
    <li class="menu-item-has-children"><a href="/bluecard/apply-here/">Apply Here</a><ul class="sub-menu"><li><a href="/bluecard/new-applicant/">New Applicant</a></li><li><a href="/bluecard/current-beneficiaries/">Current Beneficiaries</a></li><li><a href="/bluecard/referring-agencies/">Referring Agencies</a></li><li><a href="/bluecard/resources/">Resources</a></li></ul></li>
    <li class="menu-item-has-children"><a href="/bluecard/become-involved/">Become Involved</a><ul class="sub-menu"><li><a href="/bluecard/donate/">Donate</a></li><li><a href="/bluecard/bnei-mitzvah-simcha-project">B’nei Mitzvah Simcha Project</a></li><li><a href="/bluecard/team-blue-card/">Team Blue Card</a></li><li><a href="/bluecard/young-leadership/">Young Leadership</a></li><li><a href="/bluecard/volunteering/">Volunteering</a></li><li><a href="/bluecard/virtual-volunteering/">Virtual Volunteering</a></li><li><a href="${UPCOMING_EVENTS_URL}">Upcoming Events</a></li><li><a href="https://bluecardcoffee.org/" target="_blank" rel="noopener noreferrer">Blue Card Coffee</a></li></ul></li>
    <li class="menu-item-has-children"><a href="/bluecard/education-outreach/">Holocaust Education</a><ul class="sub-menu"><li><a href="/bluecard/interactive-hologram/">Interactive Hologram</a></li><li><a href="/bluecard/education-outreach/">Resources For Caretakers</a></li><li><a href="/bluecard/speakers-bureau/">Speakers Bureau</a></li><li><a href="/bluecard/special-tribute/index.html">Special Tribute</a></li></ul></li>
    <li class="menu-item-has-children"><a class="bluecard-nav-parent" href="#" aria-haspopup="true">Media</a><ul class="sub-menu"><li><a href="/bluecard/press/">Press</a></li><li><a href="/bluecard/podcast/">Podcast</a></li><li><a href="/bluecard/video-links/">Video Library</a></li></ul></li>
    <li class="menu-item-has-children"><a href="/bluecard/contact/">Contact</a><ul class="sub-menu"><li><a href="/bluecard/sitemap/">Site Map</a></li></ul></li>
    </ul>
  </div>
</nav>`;

    var currentPath = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
    var navLinks = navTarget.querySelectorAll('.menu > li > a');
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#') return;
      var linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, '') || '/';
      if (linkPath === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });

    var nav = navTarget.querySelector('.bluecard-nav');
    var navToggle = navTarget.querySelector('.bluecard-nav-toggle');
    var navParents = navTarget.querySelectorAll('a.bluecard-nav-parent[href="#"]');
    navParents.forEach(function (parent) {
      parent.addEventListener('click', function (event) {
        event.preventDefault();
      });
    });


    if (nav && navToggle) {
      navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
        nav.classList.toggle('is-open', !expanded);
      });
    }
  }

  var footerTarget = document.getElementById('bc-global-footer');
  if (footerTarget) {
    footerTarget.innerHTML = `
<div class="bc-global-wrap"><footer class="bc-footer"><div class="bc-footer-inner"><div class="bc-footer-top"><div class="bc-footer-brand"><a class="bc-footer-logo-link" href="/bluecard/index.html" aria-label="The Blue Card home"><img class="bc-footer-logo" src="/bluecard/images/logo/blue-card-logo-fullsize-.png" alt="The Blue Card"></a><p>Assisting Holocaust Survivors in Need</p><img class="bc-security" src="/bluecard/images/footer/verified-secure.gif" alt="Verified and secured"></div><div class="bc-footer-col"><h4>The Blue Card</h4><ul><li><a href="/bluecard/our-mission/index.html">Our Mission</a></li><li><a href="/bluecard/our-supporters/">Our Supporters</a></li><li><a href="/bluecard/calendars/">Calendars</a></li><li><a href="/bluecard/past-events/index.html">Past Events</a></li><li><a href="/bluecard/special-tribute/index.html">Special Tribute</a></li><li><a href="/bluecard/video-links/">The Blue Card Videos</a></li><li><a href="/newsletters/">Newsletters</a></li><li><a href="/bluecard/apply-here/">How to Apply</a></li><li><a href="/bluecard/new-applicant/">New Applicant</a></li><li><a href="/bluecard/current-beneficiaries/">Current Beneficiaries</a></li><li><a href="/bluecard/referring-agencies/">Referring Agencies</a></li><li><a href="/bluecard/resources/">Resources</a></li></ul></div><div class="bc-footer-col"><h4>Get Involved</h4><ul><li><a href="/bluecard/become-involved/">Become Involved</a></li><li><a href="/bluecard/donate/">Donate</a></li><li><a href="/bluecard/bnei-mitzvah-simcha-project">B’nei Mitzvah Simcha Project</a></li><li><a href="/bluecard/team-blue-card/">Team Blue Card</a></li><li><a href="/bluecard/young-leadership/">Young Leadership</a></li><li><a href="/bluecard/volunteering/">Volunteering</a></li><li><a href="/bluecard/virtual-volunteering/">Virtual Volunteering</a></li><li><a href="${UPCOMING_EVENTS_URL}">Upcoming Events</a></li><li><a href="https://bluecardcoffee.org/">Blue Card Coffee</a></li></ul></div><div class="bc-footer-col"><h4><a href="https://elettro.github.io/bluecard/how-we-help">How We Help</a></h4><ul><li><a href="/bluecard/emergency-cash-assistance/">Emergency Cash Assistance</a></li><li><a href="/bluecard/dental-and-medical-assistance/">Dental and Medical Assistance</a></li><li><a href="/bluecard/telephone-response-system/">Telephone Response System</a></li><li><a href="/bluecard/ongoing-assistance/">Ongoing Assistance</a></li><li><a href="/bluecard/medication-assistance-grant/">The Blue Card's Medication Assistance Grant</a></li><li><a href="/bluecard/cost-plus-drug-company/">Cost Plus Drug Company</a></li><li><a href="/bluecard/siggi-b-wilzig-fighting-cancer-together-program/">Siggi B. Wilzig Fighting Cancer Together Program</a></li><li><a href="/bluecard/health-and-wellbeing/">Health &amp; Wellbeing</a></li><li><a href="/bluecard/natural-disaster-relief/">Natural Disaster Relief</a></li><li><a href="/bluecard/education-outreach/">Education &amp; Outreach</a></li><li><a href="${SPEAKERS_BUREAU_URL}">Speakers Bureau</a></li></ul></div><div class="bc-footer-col"><h4>More Information</h4><ul><li><a href="/bluecard/blog/index.html">Blog / News</a></li><li><a href="/bluecard/press/">Press</a></li><li><a href="/bluecard/interactive-hologram/">Interactive Hologram</a></li><li><a href="/bluecard/video-links/">Video Links</a></li><li><a href="/bluecard/board-members/">Board Members</a></li><li><a href="/bluecard/staff/">Staff Members</a></li><li><a href="/report-to-the-community/">Report to the Community</a></li><li><a href="/990-financials/">990 &amp; Financials</a></li><li><a href="https://app.candid.org/profile/6907262/the-blue-card-inc-13-1623910" target="_blank" rel="noopener noreferrer">Guidestar</a></li><li><a href="/bluecard/annual-report/">Annual Report</a></li></ul></div></div><div class="bc-badges"><a href="https://www.bbb.org/" target="_blank" rel="noopener noreferrer" aria-label="BBB Accredited Charity"><img src="/bluecard/images/footer/BBB-150x150.webp" alt="BBB Accredited Charity"></a><a href="https://www.charitywatch.org/" target="_blank" rel="noopener noreferrer" aria-label="America's Best Charities"><img src="/bluecard/images/footer/logo-bestin-blue-card-fund-150x150.png" alt="America's Best Charities"></a><a href="https://app.candid.org/profile/6907262/the-blue-card-inc-13-1623910" target="_blank" rel="noopener noreferrer" aria-label="Candid Gold Transparency 2025"><img src="/bluecard/images/footer/image0-150x150.webp" alt="Candid Gold Transparency 2025"></a><a href="https://www.charitynavigator.org/ein/131623910" target="_blank" rel="noopener noreferrer" aria-label="Charity Navigator Four Star Charity"><img src="/bluecard/images/footer/Charity-Navigator-Logo.webp" alt="Charity Navigator Four Star Charity"></a></div><div class="bc-footer-bottom"><div class="bc-footer-legal">The Blue Card is a 501(c)(3) organization and our tax ID number is 13-1623910.</div><div class="bc-footer-copy">© 2026 The Blue Card. All rights reserved.</div><div class="bc-footer-social" aria-label="The Blue Card social media links"><a href="https://www.facebook.com/TheBlueCard/" target="_blank" rel="noopener noreferrer" aria-label="The Blue Card on Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2V10H8v3h2.5v8h3z"></path></svg></a><a href="https://www.instagram.com/bluecard1934/" target="_blank" rel="noopener noreferrer" aria-label="The Blue Card on Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm9.4 1.5a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path></svg></a><a href="https://twitter.com/TheBlueCard" target="_blank" rel="noopener noreferrer" aria-label="The Blue Card on X"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.3L6.6 21H3.5l7.3-8.3L1.4 3h6.2l4.3 5.7L18.9 3Zm-1.1 16h1.7L6.7 4.9H5l12.8 14.1Z"></path></svg></a><a href="https://www.youtube.com/channel/UCHKI9z16MJZ5v6vsxnqEbgw" target="_blank" rel="noopener noreferrer" aria-label="The Blue Card on YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23 12s0-3.3-.4-4.8a3.1 3.1 0 0 0-2.2-2.2C18.8 4.5 12 4.5 12 4.5s-6.8 0-8.4.5a3.1 3.1 0 0 0-2.2 2.2C1 8.7 1 12 1 12s0 3.3.4 4.8a3.1 3.1 0 0 0 2.2 2.2c1.6.5 8.4.5 8.4.5s6.8 0 8.4-.5a3.1 3.1 0 0 0 2.2-2.2c.4-1.5.4-4.8.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z"></path></svg></a><a href="https://www.linkedin.com/company/the-blue-card-inc/" target="_blank" rel="noopener noreferrer" aria-label="The Blue Card on LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6.3 8.2a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2ZM4.4 9.8h3.8V21H4.4V9.8Zm6.2 0H14v1.5h.1c.5-.9 1.8-1.9 3.7-1.9 4 0 4.7 2.6 4.7 6V21h-3.8v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-3.8V9.8Z"></path></svg></a></div><div class="bc-footer-policies" style="grid-column:1 / -1;"><a href="https://bluecardfund.org/terms-conditions/">Terms &amp; Conditions</a> | <a href="/bluecard/sms-opt-in-policy/">SMS Opt-In Policy</a> | <a href="/bluecard/privacy-policy/">Privacy Policy</a> | <a href="/sitemap/">Sitemap</a></div></div></div></footer></div>`;
  }
})();
