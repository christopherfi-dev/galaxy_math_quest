#!/usr/bin/env python3
"""Battle thread. Builds the game's piece (GMQBattleOwn, between the GMQ BATTLE markers in prototypes/card_battle_own.html):
it puts the current battle page inside it (PAGE) and the current starter-pack rule (STARTER block), then copies the demo to docs/battle/own.html.
Run after any change to prototypes/card_battle.html:   python3 checks/battle_piece_build.py
   --check   only says whether the piece is up to date (exit 1 if not)."""
import json, os, re, shutil, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(HERE, '..')
battle = open(os.path.join(ROOT, 'prototypes', 'card_battle.html'), encoding='utf-8').read()
p = os.path.join(ROOT, 'prototypes', 'card_battle_own.html')
own = open(p, encoding='utf-8').read()
lit = json.dumps(battle, ensure_ascii=False).replace('</', '<\\/').replace('<!--', '<\\!--').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029')
starter = re.search(r'/\* STARTER-BEGIN.*?\*/\n(.*?)/\* STARTER-END \*/', battle, re.S).group(1)
new = re.sub(r'/\*PAGE-BEGIN\*/.*?/\*PAGE-END\*/', lambda m: '/*PAGE-BEGIN*/' + lit + '/*PAGE-END*/', own, count=1, flags=re.S)
new = re.sub(r'(/\* STARTER-BEGIN \*/\n).*?(/\* STARTER-END \*/)', lambda m: m.group(1) + starter + m.group(2), new, count=1, flags=re.S)
live = os.path.join(ROOT, 'docs', 'battle', 'own.html')
current = new == own and os.path.exists(live) and open(live, encoding='utf-8').read() == own
if '--check' in sys.argv:
    print('the piece is up to date' if current else 'the piece is OUT OF DATE: run python3 checks/battle_piece_build.py'); sys.exit(0 if current else 1)
if new != own: open(p, 'w', encoding='utf-8').write(new)
shutil.copyfile(p, live)
print('built the piece:', len(new), 'bytes;', 'changed' if new != own else 'no change', '-> docs/battle/own.html')
