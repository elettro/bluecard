from pathlib import Path

path = Path('global-layout.css')
text = path.read_text(encoding='utf-8')

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

if old not in text:
    raise SystemExit('Navigation underline block not found')
if old_hover not in text:
    raise SystemExit('Navigation underline hover block not found')

text = text.replace(old, new, 1).replace(old_hover, new_hover, 1)
path.write_text(text, encoding='utf-8')
