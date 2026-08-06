from pathlib import Path

css_path = Path('global-layout.css')
css = css_path.read_text(encoding='utf-8')

old = '''.bluecard-nav .menu > li > a {
  position: relative;
}
.bluecard-nav .menu > li > a::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: #ffffff;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 280ms cubic-bezier(.22,.61,.36,1);
  pointer-events: none;
}
'''

new = '''.bluecard-nav .menu > li > a {
  position: relative;
  overflow: hidden;
}
.bluecard-nav .menu > li > a::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 2px;
  height: 3px;
  border-radius: 999px;
  background: #ffffff;
  opacity: 0;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 260ms cubic-bezier(.22,.61,.36,1), opacity 160ms ease;
  pointer-events: none;
  z-index: 2;
}
'''

old_hover = '''.bluecard-nav .menu > li:hover > a::after,
.bluecard-nav .menu > li:focus-within > a::after {
  transform: scaleX(1);
}
'''

new_hover = '''.bluecard-nav .menu > li:hover > a::after,
.bluecard-nav .menu > li:focus-within > a::after {
  opacity: 1;
  transform: scaleX(1);
}
'''

if old not in css:
    raise SystemExit('Navigation underline block not found')
if old_hover not in css:
    raise SystemExit('Navigation underline hover block not found')

css = css.replace(old, new, 1).replace(old_hover, new_hover, 1)
css = css.replace('height: 88px;\n    max-width: 390px;', 'height: 101px;\n    max-width: 449px;', 1)
css_path.write_text(css, encoding='utf-8')

base_path = Path('global-layout-base.js')
base = base_path.read_text(encoding='utf-8')
old_logo = '.bc-top-brand img{display:block!important;width:auto!important;height:88px!important;max-width:390px!important;object-fit:contain!important}'
new_logo = '.bc-top-brand img{display:block!important;width:auto!important;height:101px!important;max-width:449px!important;object-fit:contain!important}'
if old_logo not in base:
    raise SystemExit('Injected desktop logo sizing block not found')
base_path.write_text(base.replace(old_logo, new_logo, 1), encoding='utf-8')
