from pathlib import Path
import re

# 1. Update the hero callout copy and cache-bust the page's global layout script.
page_path = Path('interactive-hologram/index.html')
page = page_path.read_text(encoding='utf-8')
old_callout = 'It’s an opportunity for students to meet a real survivor, and hear her real voice.'
new_callout = 'An opportunity to meet a Holocaust survivor, and be witness to history through her story.'
if old_callout not in page:
    raise SystemExit('Existing hero callout copy not found')
page = page.replace(old_callout, new_callout, 1)
page, page_js_count = re.subn(
    r'(<script\b[^>]*\bsrc=["\'][^"\']*global-layout\.js)(?:\?[^"\']*)?(["\'])',
    r'\1?v=20260806-4\2',
    page,
    count=1,
    flags=re.I,
)
if page_js_count != 1:
    raise SystemExit('Interactive Hologram global-layout.js reference not found')
page_path.write_text(page, encoding='utf-8')

# 2. Left-align the dynamically rendered history section heading and refresh the follow-up script.
layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
old_header_css = '.bc-history-tech .bc-history-header{max-width:900px;margin:0 auto 38px;text-align:center}'
new_header_css = '.bc-history-tech .bc-history-header{max-width:980px;margin:0 0 38px;text-align:left}'
if old_header_css not in layout:
    raise SystemExit('Centered history heading CSS not found')
layout = layout.replace(old_header_css, new_header_css, 1)
layout, helper_count = re.subn(
    r"homepageScript\.src = '/bluecard/homepage-how-we-help\.js\?v=[^']+';",
    "homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260806-2';",
    layout,
    count=1,
)
if helper_count != 1:
    raise SystemExit('homepage-how-we-help.js version marker not found')
layout_path.write_text(layout, encoding='utf-8')

# 3. Remove all six visible number badges from the student benefit cards.
helper_path = Path('homepage-how-we-help.js')
helper = helper_path.read_text(encoding='utf-8')
helper, css_count = re.subn(
    r'\.bc-student-benefit-icon\{[^}]*\}',
    '',
    helper,
    count=1,
)
if css_count != 1:
    raise SystemExit('Student benefit number badge CSS not found')

helper, badge_count = re.subn(
    r'<div class="bc-student-benefit-icon" aria-hidden="true">0[1-6]</div>',
    '',
    helper,
)
if badge_count != 6:
    raise SystemExit(f'Expected to remove 6 student benefit number badges, removed {badge_count}')
helper_path.write_text(helper, encoding='utf-8')

print('Updated hologram callout, heading alignment, and six benefit cards.')
