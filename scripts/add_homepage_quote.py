from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

sentence = 'The Blue Card provides direct financial assistance to Holocaust survivors in need, helping them afford essentials like food, healthcare, and daily living support.'
old = '<p class="text-xl md:text-2xl text-on-primary/90 leading-relaxed mb-12 max-w-2xl">\n                        ' + sentence + '\n                    </p>\n<div class="flex flex-wrap gap-4">'
quote_text = 'The Blue Card didn\'t just pay my medical bills; they saw me. They remembered me when I felt the world had forgotten.'
new = '<p class="text-xl md:text-2xl text-on-primary/90 leading-relaxed mb-8 max-w-2xl">\n                        ' + sentence + '\n                    </p>\n<figure class="max-w-2xl mb-10 pl-6 border-l-4 border-primary-fixed-dim">\n<p class="text-xl md:text-2xl italic font-semibold text-on-primary leading-relaxed">&ldquo;' + quote_text + '&rdquo;</p>\n<figcaption class="mt-4 text-sm md:text-base font-bold uppercase tracking-[0.14em] text-primary-fixed-dim">&mdash; Sarah G., Holocaust Survivor</figcaption>\n</figure>\n<div class="flex flex-wrap gap-4">'

if old not in text:
    raise SystemExit('Homepage introduction marker not found')

path.write_text(text.replace(old, new, 1), encoding='utf-8')
