// The card pictures (prototypes/card_art.js) against the card list (docs/battle/cards.json).   [Proposal, 26 November 2026]
// Checks:
//   1  every picture key in the card list has a picture (battle cards, ship parts, upgrades)
//   2  every picture is a well-formed SVG, square, and opens in a browser
//   3  every number in a card's picture words is drawn exactly: the counted things are marked in the drawing, and the check counts the marks
//      ("two rows of seven" is 14; "ten ... and one more" is 11; "two beams, each with seven" is 14; "splitting into two" is 2)
//   4  a picture whose words name no number, but which shows a countable group, shows one of the card's own numbers (its badge or its words): a child who
//      counts the rocks in Moon Rock Wall must get 11, the number it blocks; Rally Cry's hearts are 5, the number it adds. Anything else is one thing, or too
//      many and too small to count (dust, the dots of the Nano Shield).
//   5  the only words in any picture are the ones its card's words name (100 on the Hundred Cannon, STOP on the guard's sign) or a card's own number
//   6  the whole set stays small enough for the game file (under 60 KB of code)
// Writes a sheet of every picture at a phone's card size to the folder given with --sheet (for looking at).
// Run:  node checks/card_art_check.js [cards.json] [--sheet folder]
const fs = require('fs'), path = require('path'); const { chromium } = require('playwright');
const ART = path.resolve(__dirname, '..', 'prototypes', 'card_art.js'), A = require(ART);
const CAT = process.argv.find(a => /\.json$/.test(a)) || path.resolve(__dirname, '..', 'docs', 'battle', 'cards.json');
const SHEET = process.argv.includes('--sheet') ? process.argv[process.argv.indexOf('--sheet') + 1] : null;
const cat = JSON.parse(fs.readFileSync(CAT, 'utf8'));
const all = cat.cards.map(c => ({ id: c.id, name: c.name, pic: c.pic, words: c.picture, badge: c.badge, text: c.text })).concat(cat.parts.map(p => ({ id: p.id, name: p.name, pic: p.pic, words: p.picture })), cat.upgrades.map(u => ({ id: u.id, name: u.name, pic: u.pic, words: u.picture })));
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20, dozen: 12 };
const n = w => (/^\d+$/.test(w) ? +w : NUM[w]);
function expected(words) {      /* the number a card's picture words ask to be drawn, or null */
  const t = words.toLowerCase().replace(/[,.]/g, ''), w = t.split(/\s+/);
  let m = /(\w+) rows of (\w+)/.exec(t); if (m && n(m[1]) && n(m[2])) return n(m[1]) * n(m[2]);
  m = /(\w+) beams each with (\w+)/.exec(t); if (m && n(m[1]) && n(m[2])) return n(m[1]) * n(m[2]);
  m = /splitting into (\w+)/.exec(t); if (m && n(m[1])) return n(m[1]);
  m = /(\w+) [\w ]*? and one more/.exec(t); if (m && n(m[1])) return n(m[1]) + 1;
  for (const x of w) { if (x === '100') continue; if (n(x)) return n(x); }
  return null; }
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  // 1
  const keys = new Set(A.keys()); all.forEach(c => say(A.has(c.pic), `${c.id} ${c.name}: no picture for "${c.pic}"`));
  const extra = [...keys].filter(k => !all.some(c => c.pic === k)); if (extra.length) console.log('  (pictures with no card in this list: ' + extra.join(', ') + ')');
  // 2 to 5, in a browser
  const res = await p.evaluate(list => list.map(c => { const doc = new DOMParser().parseFromString(c.svg, 'image/svg+xml'), err = doc.querySelector('parsererror'), s = doc.documentElement;
    return { id: c.id, ok: !err && s.nodeName === 'svg' && s.getAttribute('viewBox') === '0 0 100 100', marks: doc.querySelectorAll('g.n').length, texts: [...doc.querySelectorAll('text')].map(t => t.textContent) }; }),
    all.filter(c => A.has(c.pic)).map(c => ({ id: c.id, svg: A.svg(c.pic) })));
  let counted = 0;
  for (const r of res) { const c = all.find(x => x.id === r.id), want = expected(c.words);
    say(r.ok, `${c.id} ${c.name}: the picture is not a well-formed square SVG`);
    if (want != null) { counted++; say(r.marks === want, `${c.id} ${c.name}: the words say ${want} ("${c.words}"), the picture has ${r.marks} counted things`); }
    else if (r.marks) { const own = ((c.badge || '') + ' ' + (c.text || '')).match(/\d+/g) || []; counted++; say(own.map(Number).indexOf(r.marks) >= 0, `${c.id} ${c.name}: the picture shows ${r.marks} countable things, but the card's own numbers are ${own.join(', ') || 'none'} ("${c.words}")`); }
    for (const t of r.texts) say(c.words.indexOf(t) >= 0 || (c.badge && c.badge.replace(/[^0-9]/g, '') === t) || (c.id === 'R10' && t === '10'), `${c.id} ${c.name}: the picture has the words "${t}", which its card does not name`); }
  // 6
  const kb = fs.statSync(ART).size / 1024; say(kb < 60, `the card pictures are ${kb.toFixed(0)} KB of code, over 60`);
  if (SHEET) { fs.mkdirSync(SHEET, { recursive: true }); const size = 84;      /* about a card's picture on a phone */
    await p.setViewportSize({ width: 10 * (size + 8) + 16, height: 400 });
    await p.setContent(`<body style="margin:0;background:#fff;font:10px Arial"><div style="display:flex;flex-wrap:wrap;gap:8px;padding:8px">${all.map(c => `<div style="width:${size}px"><div style="width:${size}px;height:${size}px">${A.svg(c.pic)}</div><div style="height:24px;overflow:hidden">${c.id} ${c.name}</div></div>`).join('')}</div></body>`);
    await p.screenshot({ path: path.join(SHEET, 'card_art_sheet.png'), fullPage: true }); console.log('  sheet: ' + path.join(SHEET, 'card_art_sheet.png')); }
  console.log(bad.length ? `card_art_check: ${bad.length} FAULT(S)` : `card_art_check: all pass: ${all.length} pictures, one for each card (${cat.cards.length} battle cards, ${cat.parts.length} ship parts, ${cat.upgrades.length} upgrades); ${counted} numbers in the words, each drawn exactly; ${kb.toFixed(0)} KB of code`);
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
