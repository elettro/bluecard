from pathlib import Path

path = Path("global-layout.css")
text = path.read_text(encoding="utf-8")

marker = """  .bluecard-nav.is-open .bluecard-nav-toggle span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
"""
replacement = marker + """  .bluecard-nav.is-open .bluecard-nav-logo {
    display: none;
  }
  .bluecard-nav.is-open .bluecard-nav-mobile-bar {
    min-height: 52px;
    padding-top: 4px;
    padding-bottom: 4px;
    justify-content: flex-end;
  }
"""

if marker not in text:
    raise SystemExit("Mobile navigation marker not found")

path.write_text(text.replace(marker, replacement, 1), encoding="utf-8")
