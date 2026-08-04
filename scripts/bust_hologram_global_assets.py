from pathlib import Path

path = Path("interactive-hologram/index.html")
text = path.read_text(encoding="utf-8")

replacements = {
    '<link rel="stylesheet" href="../global-layout.css" />': '<link rel="stylesheet" href="../global-layout.css?v=20260804-10" />',
    '<script src="../global-layout.js"></script>': '<script src="../global-layout.js?v=20260804-10"></script>',
}

for old, new in replacements.items():
    if old not in text:
        raise SystemExit(f"Marker not found: {old}")
    text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
