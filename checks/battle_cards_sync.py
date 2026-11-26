#!/usr/bin/env python3
"""Battle thread. docs/battle/cards.json is the one card list. This copies it into the two battle pages
(prototypes/card_battle.html and prototypes/card_battle_cards.html), then copies each prototype to docs/battle/.
Run after every edit of cards.json:   python3 checks/battle_cards_sync.py
Then run:                              python3 checks/battle_cards_set_check.py"""
import json, os, re, shutil
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
src = os.path.join(ROOT, 'docs', 'battle', 'cards.json')
data = json.load(open(src, encoding='utf-8'))          # fails loudly if the file is not good JSON
def dump(d):
    # one card on each line, so a page and a diff stay readable
    out = []
    for k, v in d.items():
        if isinstance(v, list) and v and isinstance(v[0], dict):
            out.append(' ' + json.dumps(k) + ': [\n' + ',\n'.join('  ' + json.dumps(x, ensure_ascii=False) for x in v) + '\n ]')
        else:
            out.append(' ' + json.dumps(k) + ': ' + json.dumps(v, ensure_ascii=False))
    return '{\n' + ',\n'.join(out) + '\n}'
text = dump(data)
assert json.loads(text) == data
if open(src, encoding='utf-8').read() != text + '\n': open(src, 'w', encoding='utf-8').write(text + '\n'); print('tidied', os.path.relpath(src))
assert '</' not in text, 'the card list must not hold "</": it would end the page script'
block = '<script id="carddata" type="application/json">\n' + text + '\n</script>'
for page, live in (('card_battle.html', 'index.html'), ('card_battle_cards.html', 'cards.html')):
    p = os.path.join(ROOT, 'prototypes', page)
    h = open(p, encoding='utf-8').read()
    h2, n = re.subn(r'<script id="carddata" type="application/json">.*?</script>', lambda m: block, h, count=1, flags=re.S)
    assert n == 1, page + ' has no card list block'
    if h2 != h: open(p, 'w', encoding='utf-8').write(h2)
    shutil.copyfile(p, os.path.join(ROOT, 'docs', 'battle', live))
    print('synced', page, '->', 'docs/battle/' + live, '(changed)' if h2 != h else '(no change)')
