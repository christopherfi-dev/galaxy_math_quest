// Are the card faces and the card list in the cards page the battle thread's own?   (the cards thread, 26 November 2026)
// The cards page (docs/cards/index.html) draws each card with the battle thread's drawing code, and gives cards from the battle thread's card list.
// It keeps a copy of both, so that it works as one file (and so the game can hold it). This check says when a copy is out of date.
//   1. The DRAW block (DRAW-BEGIN to DRAW-END) and the STARTER block (the starter pack's code) are the same as in docs/battle/cards.html.
//   2. The card list (<script id="gmqc-list">, window.GMQC_LIST) is the same as the battle thread's: docs/battle/cards.json when it exists, else the card data in docs/battle/cards.html.
//   3. The GMQ CARDS block has no ?. and no ?? (older iPads cannot read them), and it parses.
// Run:  node checks/cards_sync_check.js            check only
//       node checks/cards_sync_check.js --write    bring both copies up to date (only the cards thread runs this; it edits only docs/cards/index.html)
const fs = require('fs'), path = require('path');
const R = f => path.join(__dirname, '..', f), PAGE = R('docs/cards/index.html'), BATTLE = R('docs/battle/cards.html'), JSONF = R('docs/battle/cards.json');
const write = process.argv.includes('--write');
let page = fs.readFileSync(PAGE, 'utf8'); const battle = fs.readFileSync(BATTLE, 'utf8'); let bad = 0;
const say = (ok, what) => { console.log((ok ? 'ok   ' : 'FAIL ') + what); if (!ok) bad++; };
const DRAW = /\/\* DRAW-BEGIN[\s\S]*?\/\* DRAW-END \*\//;
const theirs = (battle.match(DRAW) || [''])[0], mine = (page.match(DRAW) || [''])[0];
say(!!theirs, 'the battle card page has its DRAW block');
const STB = /\/\* STARTER-BEGIN[\s\S]*?\/\* STARTER-END \*\//, theirsS = (battle.match(STB) || [''])[0], mineS = (page.match(STB) || [''])[0];
say(!!theirsS, 'the battle card page has its STARTER block (the starter pack)');
let listSrc, listName;
if (fs.existsSync(JSONF)) { listSrc = fs.readFileSync(JSONF, 'utf8').trim(); listName = 'docs/battle/cards.json'; }
else { listSrc = ((battle.match(/<script id="carddata" type="application\/json">\s*([\s\S]*?)\s*<\/script>/) || [0, ''])[1]).trim(); listName = 'the card data in docs/battle/cards.html'; }
let parsed = null; try { parsed = JSON.parse(listSrc); } catch (e) {}
say(!!parsed, 'the battle thread\'s list reads as JSON (' + listName + ')');
const LIST = /(<script id="gmqc-list">\nwindow\.GMQC_LIST =)([\s\S]*?)(;\n<\/script>)/, myList = ((page.match(LIST) || [0, 0, ''])[2]).trim();
if (write) {
  page = page.replace(DRAW, () => theirs).replace(STB, () => theirsS).replace(LIST, (m, a, b, c) => a + '\n' + listSrc + '\n' + c);
  fs.writeFileSync(PAGE, page); console.log('written: the DRAW block and the card list (' + listName + ') into docs/cards/index.html');
} else {
  say(mine === theirs, 'the cards page draws cards with the battle thread\'s own code (DRAW block identical)');
  say(mineS === theirsS, 'the cards page deals the starter pack with the battle thread\'s own code (STARTER block identical)');
  say(myList === listSrc, 'the cards page\'s list is the battle thread\'s list (' + listName + ')' + (myList === listSrc ? '' : ': run node checks/cards_sync_check.js --write'));
}
page = fs.readFileSync(PAGE, 'utf8');
const block = (page.match(/\/\* ===== GMQ CARDS: start =====[\s\S]*?\/\* ===== GMQ CARDS: end ===== \*\//) || [''])[0];
say(!!block, 'the page has the GMQ CARDS block between its two marked lines');
say(!/\?\.|\?\?/.test(block.replace(/\/\*[\s\S]*?\*\//g, '').replace(/'(?:[^'\\]|\\.)*'/g, "''")), 'the block has no ?. and no ??');
try { new Function(block + '\nreturn GMQCards;'); say(true, 'the block parses'); } catch (e) { say(false, 'the block parses: ' + e.message); }
for (const m of page.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)) { try { new Function(m[1]); } catch (e) { say(false, 'a script on the page parses: ' + e.message); } }
console.log(bad ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad ? 1 : 0);
