"""Build the bluecardfund.org -> bluecard.org redirect map.

Inputs (paths passed on the command line):
  all_old_pages.txt  every old page path (sitemap + Search Console), one per line
  gsc_pages.tsv      path<TAB>clicks<TAB>impressions from Search Console (16 months)
  wp_status.tsv      path<TAB>status<TAB>bytes for old /wp-content/uploads/ files
Outputs (written next to this script):
  redirects.json     {old_path: new_path} used by worker.js
  wp_vendor.txt      old upload paths to copy into the repo at the same path
Usage: python build_map.py <scratch_dir> <review_csv_path>
"""
import csv, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
S = sys.argv[1]
REVIEW = sys.argv[2]

SPEAKERS = '/speakers-bureau/'
TRIBUTE = '/special-tribute/'

PAGES = {
    '/': '/',
    # Who we are
    '/who-we-are/': '/who-we-are/',
    '/who-we-are/our-mission/': '/our-mission/',
    '/who-we-are/blue-card-videos/': '/video-library/',
    '/who-we-are/calendar/': '/calendars/',
    '/who-we-are/past-events/': '/past-events/',
    '/who-we-are/tribute/': TRIBUTE,
    '/who-we-are/our-partners/': '/who-we-are/our-partners/',
    '/the-hildegard-lash-foundation/': '/our-supporters/',
    '/staff-members/': '/staff/',
    '/board-members/': '/board-members/',
    '/contact/': '/contact/',
    '/keep-in-touch/': '/contact/',
    '/email-signup/': '/contact/',
    # How we help
    '/how-we-help/': '/how-we-help/',
    '/how-we-help/dental-and-medical-assistance/': '/dental-and-medical-assistance/',
    '/how-we-help/education-outreach/': '/education-outreach/',
    '/how-we-help/emergency-cash-assistance/': '/emergency-cash-assistance/',
    '/how-we-help/emergency-prevention/': '/emergency-assistance/',
    '/how-we-help/health-wellbeing/': '/health-well-being/',
    '/how-we-help/monthly-assistance/': '/ongoing-support/',
    '/how-we-help/siggi-b-wilzig-fighting-cancer-together-program/': '/siggi-b-wilzig-fighting-cancer-together-program/',
    '/how-we-help/ters/': '/telephone-response-system/',
    '/the-blue-cards-medication-assistance-grant/': '/medication-assistance-grant/',
    '/cost-plus-drug-company/': '/cost-plus-drug-company/',
    '/natural-disaster-relief/': '/natural-disaster-relief/',
    '/covid-19-response/': '/how-we-help/',
    '/covid-19-response/vaccine-resources/': '/resources/',
    '/hologram/': '/interactive-hologram/',
    # Social workers / applicants
    '/social-workers/': '/apply-here/',
    '/social-workers/new-applicant/': '/new-applicant/',
    '/social-workers/current-beneficiaries/': '/current-beneficiaries/',
    '/social-workers/referring-agencies/': '/referring-agencies/',
    '/social-workers/resources/': '/resources/',
    '/the-blue-card-2020-referral-application/': '/apply-here/',
    '/the-blue-card-2025-ters-application/': '/apply-here/',
    '/2025-the-blue-card-recertification-form/': '/apply-here/',
    # Become involved
    '/become-involved/': '/become-involved/',
    '/become-involved/donate/': '/donate/',
    '/donate/': '/donate/',
    '/donation-apple/': '/donate/',
    '/apple-new/': '/donate/',
    '/test-apple-pay/': '/donate/',
    '/donate-dev-dean/': '/donate/',
    '/donation-confirmation/': '/donate/',
    '/donation-failed/': '/donate/',
    '/payment-confirmation/': '/donate/',
    '/payment-failed/': '/donate/',
    '/stripe-checkout-result/': '/donate/',
    '/wpsd-thank-you/': '/donate/',
    '/donor-dashboard/': '/donate/',
    '/my-account/': '/donate/',
    '/cart/': '/donate/',
    '/checkout/': '/donate/',
    '/products/': '/donate/',
    '/coffee/': '/donate/',
    '/become-involved/team-blue-card/': '/team-blue-card/',
    '/2020-tcs-nyc-marathon-app-waiver/': '/team-blue-card/',
    '/charities-gain-traction-in-marathons/': '/blog/1.html',
    '/an-amazing-virtual-miami-marathon-2022/': '/blog/9.html',
    '/this-student-from-montreal-is-running-the-new-york-city-marathon-to-honour-holocaust-survivors/': '/blog/16.html',
    '/become-involved/volunteering/': '/volunteering/',
    '/become-involved/virtual-volunteering/': '/virtual-volunteering/',
    '/become-involved/greeting-card-program/': '/volunteering/',
    '/become-involved/bnai-mitzvah-simcha-project/': '/bnei-mitzvah-simcha-project/',
    '/become-involved/young-leadership/': '/young-leadership/',
    '/young-leadership-summer-cocktail-reception-event-photos-from-june-29th-2023/': '/young-leadership/',
    '/become-involved/upcoming-events/': '/upcoming-events/',
    '/upcoming-events/': '/upcoming-events/',
    '/holocaust-survivor-retreat/': '/past-events/',
    # Speakers (deep links open the speaker's profile)
    '/speakers-bureau/': SPEAKERS,
    '/igne-second/': SPEAKERS + '#inge-auerbacher',
    '/dr-william-freund/': SPEAKERS + '#dr-william-freund',
    '/olga-spiegel-2/': SPEAKERS + '#olga-spiegel',
    '/tom-jacobson/': SPEAKERS + '#tom-jacobson',
    '/robert-brajer/': SPEAKERS + '#robert-brajer',
    '/goldie-jacoby/': SPEAKERS + '#goldie-jacoby',
    '/sami-steigmann/': SPEAKERS + '#sami-steigmann',
    '/fred-schoenfeld/': SPEAKERS + '#fred-schoenfeld',
    '/lillian-feintuch/': SPEAKERS + '#lillian-feintuch',
    '/dolly-rabinowitz/': SPEAKERS + '#dolly-rabinovich',
    '/sonia-warshawski/': SPEAKERS + '#sonia-warshawski',
    # Survivor stories without their own new page
    '/eva-costabel-holocaust-survivor-story/': '/survivors/',
    '/freda-holocaust-survivor-story/': '/survivors/',
    '/boris-holocaust-survivor-story/': '/survivors/',
    '/claire-holocaust-survivor-story/': '/survivors/',
    '/category/survivor-story/': '/survivors/',
    '/tag/survivor/': '/survivors/',
    # Tributes
    '/blue-card-tribute-irene-hizme/': TRIBUTE,
    '/blue-card-tribute-edda-servi-machlin/': TRIBUTE,
    '/blue-card-tribute-frank-harris/': TRIBUTE,
    '/blue-card-tribute-margit-ulrich/': TRIBUTE,
    '/blue-card-tribute-mark-warren-babyatsky-m-d/': TRIBUTE,
    '/blue-card-tribute-elie-wiesel/': '/blog/5.html',
    '/richard-c-holbrooke-award-social-justice/': '/blog/5.html',
    '/tag/social-justice-award/': '/blog/5.html',
    '/category/tribute/': TRIBUTE,
    # Blog posts -> numbered posts on the new site
    '/blog/': '/blog/',
    '/holocaust-survivors-reflect-on-coronavirus-isolation/': '/blog/2.html',
    '/many-holocaust-survivors-are-struggling-amid-the-pandemic-heres-how-virtual-gatherings-are-helping/': '/blog/3.html',
    '/being-great-at-doing-good/': '/blog/4.html',
    '/blue-card-supports-holocaust-survivors-during-the-pandemic-jewish-times-baltimore/': '/blog/6.html',
    '/masha-pearl-dedicated-to-helping-holocaust-survivors/': '/blog/7.html',
    '/today-is-the-anniversary-of-kristallnachtnight-of-broken-glass/': '/blog/8.html',
    '/amazon-smile-help-the-blue-card-while-you-shop/': '/blog/10.html',
    '/holocaust-survivor-guide-thanking-the-blue-card-for-financial-assistance/': '/blog/11.html',
    '/in-memory-of-leo-rechter/': '/blog/12.html',
    '/yom-hashoah-2021-event-newsletter/': '/blog/13.html',
    '/seniorsmobility-org-a-website-created-to-help-seniors-stay-fit-and-healthy/': '/blog/14.html',
    '/famous-chef-delivers-meals-to-holocaust-survivors-during-pandemic/': '/blog/15.html',
    '/hanukkah-at-the-blue-card/': '/blog/17.html',
    '/the-blue-card-assistance-for-holocaust-survivors-in-ukraine/': '/blog/18.html',
    '/holocaust-survivors-by-masha-pearl/': '/blog/19.html',
    '/fear-of-forgetting-what-happens-when-last-holocaust-survivors-are-gone/': '/blog/20.html',
    '/la-memoire-de-la-shoah-quand-les-derniers-survivants-auront-disparu/': '/blog/21.html',
    '/la-memoire-de-la-shoah-quand-les-derniers-survivants-auront-disparu-2/': '/blog/22.html',
    '/isreali-hostages-released-reactions-from-holocaust-survivors/': '/blog/23.html',
    '/international-holocaust-remembrance-day-january-27-2021/': '/blog/',
    '/85th-anniversary-of-kristallnacht/': '/blog/8.html',
    # Press / media
    '/press/': '/press/',
    '/category/press/': '/press/',
    '/category/press/page/2/': '/press/',
    '/category/press/page/3/': '/press/',
    '/press-release/': '/press/',
    '/press-template/': '/press/',
    '/podcast-press-release-2/': '/podcast/',
    '/letter-to-optimum-2/': '/press/',
    '/holocaust-survivors-supported-by-the-blue-card-request-meeting-with-whoopi-goldberg-to-educate-address-recent-damaging-remarks-2/': '/press/',
    '/the-blue-card-partners-with-holocaust-survivor-and-artist-georgette-hancock-and-actor-activist-yuval-david-to-raise-funds-for-holocaust-survivors-in-ukraine/': '/press/',
    '/podcasts/': '/podcast/',
    '/vidlinks/': '/video-links/',
    '/newsletters/': '/newsletters/',
    '/2020-year-in-review/': '/newsletters/',
    # Financials / reports
    '/financials/': '/990-financials/',
    '/form-990/': '/990-financials/',
    '/annual-report/': '/report-to-the-community/',
    '/report-to-the-community/': '/report-to-the-community/',
    # Calendars
    '/calendar-2013-2014/': '/calendars/', '/calendar-2014-2015/': '/calendars/',
    '/calendar-2015-2016/': '/calendars/', '/calendar-2016-2017/': '/calendars/',
    '/calendar-2017-2018/': '/calendars/', '/calendar-2018-2019/': '/calendars/',
    '/calendar-2019-2020/': '/calendars/', '/calendar-2020-2021/': '/calendars/',
    '/calendar-2022-2023/': '/calendars/',
    # Legal / utility
    '/privacy-policy/': '/privacy-policy/',
    '/terms-and-conditions/': '/terms-and-conditions/',
    '/sms-opt-in/': '/sms-opt-in-policy/',
    '/site-map/': '/sitemap/',
    '/data-deletion-ig-app/': '/privacy-policy/',
    '/deauthorize-callback/': '/',
    '/template-single-pages/': '/',
    '/test/': '/', '/test-2/': '/',
}

# Old uploads: forms/financials/calendars go to the current page; the rest are copied as-is.
UPLOAD_RULES = [
    (re.compile(r'(referral|ters|recertification|application)', re.I), '/apply-here/'),
    (re.compile(r'(audited|990|char500|financial)', re.I), '/990-financials/'),
    (re.compile(r'calendar', re.I), '/calendars/'),
    (re.compile(r'report-to-the-community', re.I), '/report-to-the-community/'),
]

def main():
    old_pages = [l.strip() for l in open(os.path.join(S, 'all_old_pages.txt'), encoding='utf-8') if l.strip()]
    gsc = {}
    for l in open(os.path.join(S, 'gsc_pages.tsv'), encoding='utf-8'):
        p, c, i = l.rstrip('\n').split('\t'); gsc[p] = (int(c), int(i))
    wp = {}
    for l in open(os.path.join(S, 'wp_status.tsv'), encoding='utf-8'):
        p, st, n = l.rstrip('\n').split('\t'); wp[p] = st

    missing = [p for p in old_pages if p not in PAGES]
    if missing:
        sys.exit('UNMAPPED: ' + ', '.join(missing))

    redirects = dict(PAGES)
    vendor = []
    rows = []
    for p in sorted(wp):
        target = None
        for rx, t in UPLOAD_RULES:
            if rx.search(p.rsplit('/', 1)[-1]):
                target = t; break
        if target is None:
            target = p  # same path on bluecard.org
            if wp[p] != 'IN_REPO':
                vendor.append(p)
        redirects[p] = target

    # every target must exist on the new site (page, html file, or a vendored/in-repo upload)
    repo = os.path.abspath(os.path.join(HERE, '..', '..'))
    vend = set(vendor)
    bad = []
    for src, dst in redirects.items():
        path = dst.split('#')[0]
        f = os.path.join(repo, path.lstrip('/'))
        ok = os.path.isfile(os.path.join(f, 'index.html')) or os.path.isfile(f) or path in vend
        if not ok:
            bad.append((src, dst))
    if bad:
        sys.exit('TARGETS MISSING: ' + repr(bad))

    json.dump(redirects, open(os.path.join(HERE, 'redirects.json'), 'w', encoding='utf-8'), indent=1, ensure_ascii=False, sort_keys=True)
    open(os.path.join(HERE, 'wp_vendor.txt'), 'w', encoding='utf-8').write('\n'.join(vendor) + '\n')

    with open(REVIEW, 'w', newline='', encoding='utf-8-sig') as fh:
        w = csv.writer(fh)
        w.writerow(['Old URL (bluecardfund.org)', 'New URL (bluecard.org)', 'Google clicks (16 mo)', 'Google impressions (16 mo)', 'Type'])
        for src in sorted(redirects, key=lambda s: (-gsc.get(s, (0, 0))[0], -gsc.get(s, (0, 0))[1], s)):
            dst = redirects[src]
            kind = 'file (copied, same path)' if src == dst and src.startswith('/wp-content/') else ('file -> page' if src.startswith('/wp-content/') else ('same path' if src == dst else 'page -> page'))
            c, i = gsc.get(src, (0, 0))
            w.writerow(['https://bluecardfund.org' + src, 'https://bluecard.org' + dst, c, i, kind])
    print(f'{len(redirects)} redirects ({len(PAGES)} pages, {len(wp)} uploads); {len(vendor)} uploads to copy')

main()
