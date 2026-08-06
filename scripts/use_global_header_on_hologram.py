from pathlib import Path
import re

path = Path('interactive-hologram/index.html')
text = path.read_text(encoding='utf-8')

legacy_header_css = '''    /* Legacy local header/footer styles hidden in favor of global layout */
    .bc-top-donate-strip {
      display: none;
      background: var(--bc-red);
      padding: 9px 14px;
      text-align: center;
    }

    .bc-top-donate-strip a {
      color: #fff;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      font-size: 14px;
    }

'''

if legacy_header_css not in text:
    raise SystemExit('Legacy hologram header CSS block not found')
text = text.replace(legacy_header_css, '', 1)

text, style_count = re.subn(
    r'\n<style id="bc-mobile-dropdown-logo-hard-fix">.*?</style>\n',
    '\n',
    text,
    count=1,
    flags=re.S,
)
if style_count != 1:
    raise SystemExit('Page-specific mobile navigation style not found')

text, script_count = re.subn(
    r'\n<script id="bc-mobile-dropdown-logo-hard-fix-script">.*?</script>\n',
    '\n',
    text,
    count=1,
    flags=re.S,
)
if script_count != 1:
    raise SystemExit('Page-specific mobile navigation script not found')

old_css = '<link rel="stylesheet" href="../global-layout.css?v=20260804-13" />'
new_css = '<link rel="stylesheet" href="/bluecard/global-layout.css" />'
if old_css not in text:
    raise SystemExit('Hologram global stylesheet reference not found')
text = text.replace(old_css, new_css, 1)

old_js = '<script src="../global-layout.js?v=20260804-13"></script>'
new_js = '<script src="/bluecard/global-layout.js?v=20260805-2" defer></script>'
if old_js not in text:
    raise SystemExit('Hologram global layout script reference not found')
text = text.replace(old_js, new_js, 1)

path.write_text(text, encoding='utf-8')
