from pathlib import Path

card_path = Path('homepage-how-we-help.js')
card = card_path.read_text(encoding='utf-8')
old_link = '<a class="bc-help-link" href="/bluecard/education-outreach/">Learn More</a>'
new_link = '<a class="bc-help-link" href="/bluecard/interactive-hologram/">Learn More</a>'
if old_link not in card:
    raise SystemExit('Education card link marker not found')
card_path.write_text(card.replace(old_link, new_link, 1), encoding='utf-8')

layout_path = Path('global-layout.js')
layout = layout_path.read_text(encoding='utf-8')
old_version = "homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260804-8';"
new_version = "homepageScript.src = '/bluecard/homepage-how-we-help.js?v=20260806-1';"
if old_version not in layout:
    raise SystemExit('Homepage carousel script version marker not found')
layout_path.write_text(layout.replace(old_version, new_version, 1), encoding='utf-8')
