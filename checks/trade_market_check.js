// Galactic Trade as a market: the number rule, checked on 20,000 seeds.   Run:  node checks/trade_market_check.js [seeds] [file]
// It reads the rule from the page itself (docs/trade/index.html, between "GMQ TRADE: start" and "GMQ TRADE: end"), so it checks the code children play.
// Once the main thread has put the piece into the game, give the game's file instead:  node checks/trade_market_check.js 20000 prototypes/kis_station_sketch.html
// It takes about a minute for 20,000 seeds.
// The rule's own judge is not trusted: every choice on every board is worked out again here, by separate code.
// What must hold (HANDOFF_Trade_2026-11-23.md, 5e, and the trade thread's own additions):
//   1. every number a child sees or works out is within 1,000 (pays, fuel, gems left after fuel, gems after a trip, after buying)
//   2. distances are tens (10 to 70), so fuel is 2 x a ten (3.NBT.3); the letters, distances and colours are the game's own (TR, TR_ORDER, TR_COL)
//   3. on every board there is one best choice, at least 20 gems ahead of the next
//   4. the biggest pay is not part of the best choice on at least half the boards, and is part of it on some (so "never take the biggest" is not a rule either)
//   5. on every trip after the first there is an offer that loses gems (it pays less than its fuel), on a planet 50 light-years or more away
//   6. the glow stone can be bought after two or three good trips, never one, and never more than four
//   7. no child is ever left unable to fly: every board has two or more planets they can afford; below 60 gems the Council sends 100
//   2b. Planets I, O and Q are never offered (on the desk they read as a word, or as zero); offered planets sit apart on the map
//   8. no pay is already round (none ends in 0): a child who rounds to compare is choosing to, and the exact count is real adding
//   9. a child who always takes the biggest pay does worse than one who works it out (the check that the rule does not flatter itself);
//      so does a child who always takes the nearest planets (no one shortcut works)
//  10. the worked example in the handoff (5c) and the page's own solved example (Tavi's stalls), worked out again
const fs = require('fs'), path = require('path'), ROOT = path.join(__dirname, '..');
const html = fs.readFileSync(path.resolve(ROOT, process.argv[3] || 'docs/trade/index.html'), 'utf8');
const block = html.slice(html.indexOf('/* ===== GMQ TRADE: start ====='), html.indexOf('/* ===== GMQ TRADE: end ===== */'));
if (!block || block.length < 1000) { console.log('FAIL: the GMQ TRADE block was not found in docs/trade/index.html'); process.exit(1); }
const GMQTrade = new Function(block + '\nreturn GMQTrade;')(), RULE = GMQTrade.rule, K = RULE.K, LY = RULE.LY, SEEDS = +(process.argv[2] || 20000);
let fails = 0; const fail = m => { if (fails < 25) console.log('  FAIL: ' + m); fails++; };
const say = m => console.log(m);

// ---- 2. the game's own planets: letters, distances, places in the fan, colours ----
const game = fs.readFileSync(path.join(ROOT, 'prototypes/kis_station_sketch.html'), 'utf8');
const tr = {}; for (const m of (game.match(/const TR = \{\}; \[([\s\S]*?)\]\.forEach/) || [0, ''])[1].matchAll(/\['([A-T])', (\d+), (\d+)\]/g)) tr[m[1]] = +m[2];
const trOrder = ((game.match(/const TR_ORDER = \[([^\]]*)\]/) || [0, ''])[1].match(/[A-T]/g) || []).join('');
const trCol = ((game.match(/TR_COL = \[([^\]]*)\]/) || [0, ''])[1].match(/#[0-9a-f]{6}/gi) || []).join(',');
if (Object.keys(tr).length !== 20) fail('could not read the game\'s TR');
for (const n in tr) { if (RULE.DIST[n] !== tr[n]) fail(`Planet ${n}: the page says ${RULE.DIST[n]}, the game says ${tr[n]}`); if (LY[n] !== Math.floor((tr[n] + 5) / 10) * 10) fail(`Planet ${n}: light-years are not its distance to the nearest ten`); if (LY[n] < 10 || LY[n] > 70 || LY[n] % 10) fail(`Planet ${n}: ${LY[n]} light-years is not a ten from 10 to 70`); if (RULE.fuelOf(n) !== 2 * LY[n]) fail(`Planet ${n}: fuel is not 2 x its light-years`); }
if (RULE.ORDER.join('') !== trOrder) fail('the fan order is not the game\'s TR_ORDER');
if (!block.includes(trCol.split(',').map(c => `'${c}'`).join(', '))) fail('the planet colours are not the game\'s TR_COL');
say(`Planets: the 20 letters, distances, fan order and colours match the game's TR, TR_ORDER and TR_COL. Light-years: ${[...new Set(Object.values(LY))].sort((a, b) => a - b).join(', ')}.`);

// ---- 10. the worked examples ----
// the handoff's 5c: the Council's 100 gems; A 180 at 20, B 240 at 40, C 130 at 10, D 290 at 50, E 150 at 30 (its own letters, not the map's)
{ const ex = [['A', 180, 20], ['B', 240, 40], ['C', 130, 10], ['D', 290, 50], ['E', 150, 30]], B = 100, res = [];
  for (let m = 1; m < 32; m++) { const pick = ex.filter((e, i) => m & (1 << i)); if (pick.length > 3) continue; const fuel = pick.reduce((a, e) => a + 2 * e[2], 0); res.push({ who: pick.map(e => e[0]).join('+'), fuel, end: fuel <= B ? B - fuel + pick.reduce((a, e) => a + e[1], 0) : null }); }
  const ok = res.filter(r => r.end !== null).sort((a, b) => b.end - a.end), get = w => res.find(r => r.who === w);
  if (ok[0].who !== 'B+C' || ok[0].end !== 370) fail('handoff 5c: B and C are not the best at 370'); if (get('A+C').end !== 350) fail('handoff 5c: A and C'); if (get('D').end !== 290) fail('handoff 5c: D alone'); if (get('A+B').end !== null) fail('handoff 5c: A and B should be too far');
  say(`Handoff 5c, worked again: best ${ok[0].who} ${ok[0].end}; next ${ok[1].who} ${ok[1].end}; D alone ${get('D').end}; A+B fuel ${get('A+B').fuel}, too far. As the note says.`); }
// the page's solved example: Tavi's stalls, coins and rent
{ const D = GMQTrade.demo, res = [];
  for (let m = 1; m < 16; m++) { const pick = D.stalls.filter((s, i) => m & (1 << i)); if (pick.length > D.baskets) continue; const rent = pick.reduce((a, s) => a + s[2], 0); res.push({ who: pick.map(s => s[0]).join('+'), rent, end: rent <= D.coins ? D.coins - rent + pick.reduce((a, s) => a + s[1], 0) : null }); }
  const ok = res.filter(r => r.end !== null).sort((a, b) => b.end - a.end), get = w => res.find(r => r.who === w), text = D.lines.join(' | ');
  if (ok[0].who !== 'blue+yellow' || ok[0].end !== 63 || ok[1].end >= 63) fail('Tavi: blue and yellow are not the one best choice at 63');
  if (get('red').end !== 52 || !text.includes('0 + 52 = 52')) fail('Tavi: red alone'); if (get('blue').end !== 39 || !text.includes('10 − 6 = 4.  4 + 35 = 39')) fail('Tavi: blue alone, with coins left over');
  if (!text.includes('0 + 35 + 28 = 63')) fail('Tavi: blue and yellow line');
  if (get('blue+green').rent !== 13 || !text.includes('6 + 7 = 13')) fail('Tavi: blue and green rent'); if (get('yellow+green').rent !== 11 || !text.includes('4 + 7 = 11')) fail('Tavi: yellow and green rent');
  if (D.stalls.some(s => /^[A-Z]$/.test(s[0]))) fail('Tavi: a stall named by a letter can be mixed up with a planet');
  const big = D.stalls.slice().sort((a, b) => b[1] - a[1])[0][0]; if (ok[0].who.includes(big)) fail('Tavi: the biggest pay should not be in her best choice');
  say(`Tavi's paper, worked again: every choice of 1 or 2 stalls: ${res.map(r => r.who + (r.end === null ? ' too much rent' : ' ' + r.end)).join(', ')}. Best ${ok[0].who} ${ok[0].end}. The red stall earns most and is not in it.`); }

// ---- the boards: every choice worked out again by this code ----
function every(offers, B) { const out = []; for (let m = 1; m < 1 << offers.length; m++) { const pick = offers.filter((o, i) => m & (1 << i)); if (pick.length > K.crates) continue;
  const fuel = pick.reduce((a, o) => a + 2 * LY[o.n], 0), pay = pick.reduce((a, o) => a + o.pay, 0); out.push({ m, pick, fuel, pay, fits: fuel <= B, left: B - fuel, end: B - fuel + pay }); } return out; }
let minApart = 9, minLoss = 999, maxLoss = 0, boards = 0, nearTrap = 0, decoy = 0, eased = 0, maxTries = 0, maxNum = 0, minMargin = 999, lossFar = 0, laterBoards = 0, roundPays = 0, gifts = 0, fulls = 0, nulls = 0; const distinct1 = new Set(), distinctAll = new Set(), margins = [];
let others = 0;
function board(seed, trip, B) { const b = RULE.boardFor(seed, trip, B); if (!b) { nulls++; fail(`no board for seed ${seed}, trip ${trip}, ${B} gems`); return null; } if (b.other) others++;
  boards++; maxTries = Math.max(maxTries, b.tries); if (b.eased) eased++; const o = b.offers, key = JSON.stringify(o); distinctAll.add(key); if (trip === 1) distinct1.add(key);
  if (o.length !== K.offers) fail('a board without 5 offers'); if (new Set(o.map(x => x.n)).size !== o.length || o.some(x => x.n === K.stone)) fail('a board repeats a planet, or offers Planet R');
  if (o.some(x => 'IOQ'.includes(x.n))) fail('a board offers I, O or Q (they read as a word, or as zero)');
  { const P = n => { const a = (-78 + RULE.ORDER.indexOf(n) * (156 / 19)) * Math.PI / 180, r = .2 + .8 * LY[n] / 71; return [Math.sin(a) * r, Math.cos(a) * r]; }, ns = o.map(x => x.n).concat([K.stone]);
    for (let i = 0; i < ns.length; i++) for (let k = i + 1; k < ns.length; k++) { const d = Math.hypot(P(ns[i])[0] - P(ns[k])[0], P(ns[i])[1] - P(ns[k])[1]); minApart = Math.min(minApart, d); if (d < .16) fail(`seed ${seed}: Planets ${ns[i]} and ${ns[k]} sit too close on the map`); } }
  o.forEach(x => { if (x.pay < 2 * LY[x.n]) { minLoss = Math.min(minLoss, 2 * LY[x.n] - x.pay); maxLoss = Math.max(maxLoss, 2 * LY[x.n] - x.pay); } });
  o.forEach(x => { if (x.pay % 10 === 0) roundPays++; if (x.pay < 40 || x.pay > 399) fail(`seed ${seed}: a pay of ${x.pay}`); maxNum = Math.max(maxNum, x.pay); });
  if (o.filter(x => 2 * LY[x.n] <= B).length < 2) fail(`seed ${seed} trip ${trip}: fewer than two planets the child can afford`);
  const all = every(o, B), fit = all.filter(c => c.fits).sort((a, c) => c.end - a.end), best = fit[0], margin = best.end - fit[1].end;
  all.forEach(c => { maxNum = Math.max(maxNum, c.pay, c.fits ? c.end : 0, c.fuel); if (c.fits && c.end > 999) fail(`seed ${seed}: a trip could end with ${c.end} gems`); });
  if (B >= K.full) fail(`seed ${seed}: a trade trip with ${B} gems`);
  margins.push(margin); minMargin = Math.min(minMargin, margin); if (margin < 20) fail(`seed ${seed} trip ${trip}: the best is only ${margin} ahead`);
  const big = o.reduce((a, x, i) => x.pay > o[a].pay ? i : a, 0); if (!best.pick.includes(o[big])) decoy++;
  { let f = 0, p = 0, k = 0; o.slice().sort((a, c) => LY[a.n] - LY[c.n] || c.pay - a.pay).forEach(x => { if (k < K.crates && f + 2 * LY[x.n] <= B) { f += 2 * LY[x.n]; p += x.pay; k++; } }); if (B - f + p <= best.end - 30) nearTrap++; }
  if (trip > 1) { laterBoards++; if (o.some(x => x.pay < 2 * LY[x.n] && LY[x.n] >= 50)) lossFar++; else fail(`seed ${seed} trip ${trip}: no far offer that loses gems`); }
  if (best.end !== b.judge.best.end) fail(`seed ${seed}: the rule's own best (${b.judge.best.end}) is not the best worked out here (${best.end})`);
  return { o, all, fit, best }; }

// ---- the children: five ways of choosing, played through the whole market as the page plays it ----
const KINDS = { best: 'works out every plan', bigPay: 'takes the biggest pay first', nearest: 'takes the nearest planets first', leftover: 'takes the biggest pay minus fuel first', guess: 'picks any plan that fits' };
const R = {}; for (const k in KINDS) R[k] = { stone: {}, both: {}, trips: [], maxGems: 0 };
const pick1 = (b, order, B) => { let f = 0, p = 0, n = 0; for (const i of order) { const x = b.o[i], c = 2 * LY[x.n]; if (n < K.crates && f + c <= B) { f += c; p += x.pay; n++; } } return B - f + p; };
const stoneTrips = {}, bothTrips = {};
for (let seed = 1; seed <= SEEDS; seed++) {
  const r = RULE.rng(seed * 31 + 7);
  for (const kind in KINDS) { let g = K.gift, trip = 1, tr = 0, stone = 0, sup = 0;
    while ((!stone || !sup) && tr < 16) {
      if (!stone && g >= 2 * LY[K.stone] + K.stonePrice) { g -= 2 * LY[K.stone]; maxNum = Math.max(maxNum, g); g -= K.stonePrice; stone = tr; continue; }
      if (!sup && g >= K.supplies) { g -= K.supplies; sup = tr; continue; }
      if (g >= K.full) { fulls++; fail(`seed ${seed} (${kind}): ${g} gems and nothing left to buy`); break; }
      if (g < K.low) { g += K.gift; gifts++; }
      const b = board(seed, trip, g); if (!b) break; const o = b.o, idx = o.map((x, i) => i);
      let end;
      if (kind === 'best') end = b.best.end;
      else if (kind === 'bigPay') end = pick1(b, idx.slice().sort((a, c) => o[c].pay - o[a].pay), g);
      else if (kind === 'nearest') end = pick1(b, idx.slice().sort((a, c) => LY[o[a].n] - LY[o[c].n] || o[c].pay - o[a].pay), g);
      else if (kind === 'leftover') end = pick1(b, idx.slice().sort((a, c) => (o[c].pay - 2 * LY[o[c].n]) - (o[a].pay - 2 * LY[o[a].n])), g);
      else end = b.fit[Math.floor(r() * b.fit.length)].end;
      g = end; tr++; trip++; maxNum = Math.max(maxNum, g); R[kind].maxGems = Math.max(R[kind].maxGems, g); }
    const s = stone || 'never', bo = stone && sup ? tr : 'never'; R[kind].stone[s] = (R[kind].stone[s] || 0) + 1; R[kind].both[bo] = (R[kind].both[bo] || 0) + 1; R[kind].trips.push([stone || 99, stone && sup ? tr : 99]); }
}
const pct = (a, b) => (100 * a / b).toFixed(1) + '%', mean = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(2);
say(`\nBoards made: ${boards} (${SEEDS} seeds x 5 kinds of child). Different boards: ${distinctAll.size}; different first-trip boards: ${distinct1.size} of ${SEEDS} seeds.`);
say(`Most draws for one board: ${maxTries}. Boards where the decoy had to be turned the other way: ${eased}. Boards that could not be made: ${nulls}. Boards taken from a nearby seed: ${others}.`);
say(`Biggest number a child sees or works out: ${maxNum} (must be under 1,000).   Pays ending in 0: ${roundPays} (must be 0).`);
margins.sort((a, b) => a - b); say(`Offered planets sit at least ${minApart.toFixed(2)} of the map's radius apart (and from Planet R): their rings never touch.`);
say(`The best choice leads the next by at least ${minMargin} gems (median ${margins[margins.length >> 1]}).`);
say(`The biggest pay is NOT part of the best choice on ${pct(decoy, boards)} of boards (must be 50% or more, and under 100%).`);
say(`Taking the nearest planets first comes home 30 gems or more behind the best on ${pct(nearTrap, boards)} of boards.`);
say(`A losing offer loses ${minLoss} to ${maxLoss} gems. Trips after the first with a far offer that loses gems: ${lossFar} of ${laterBoards}.   Gifts from the Council (below 60 gems): ${gifts}.   Children stuck with 600+ gems and nothing to buy: ${fulls}.`);
say('\nTrade trips before the glow stone, and before both things on the list, for each kind of child:');
for (const k in KINDS) say(`  ${(k + ':').padEnd(10)} ${KINDS[k].padEnd(38)} stone ${JSON.stringify(R[k].stone)}   both ${JSON.stringify(R[k].both)}   most gems ${R[k].maxGems}`);
const bs = R.best.trips, bp = R.bigPay.trips; let worseStone = 0, worseBoth = 0, better = 0;
bs.forEach((t, i) => { if (bp[i][0] > t[0]) worseStone++; if (bp[i][1] > t[1]) worseBoth++; if (bp[i][1] < t[1]) better++; });
say(`\nThe child who takes the biggest pay, against the one who works it out: needs more trips for the stone on ${pct(worseStone, SEEDS)} of seeds, more for both on ${pct(worseBoth, SEEDS)}, fewer on ${pct(better, SEEDS)}.`);
say(`Mean trips for both: works it out ${mean(bs.map(t => t[1]))}, biggest pay ${mean(bp.map(t => t[1]).filter(x => x < 99))}, nearest ${mean(R.nearest.trips.map(t => t[1]).filter(x => x < 99))}, any plan ${mean(R.guess.trips.map(t => t[1]).filter(x => x < 99))}.`);
// the rules on the stone (6) and the comparison (9)
if (Object.keys(R.best.stone).some(k => k !== '2' && k !== '3')) fail('a child who works it out cannot buy the stone after 2 or 3 trips: ' + JSON.stringify(R.best.stone));
if (Object.keys(R.leftover.stone).some(k => +k > 4 || k === '1' || k === 'never')) fail('a careful child (biggest pay minus fuel) needs more than four trips, or one: ' + JSON.stringify(R.leftover.stone));
if (Object.keys(R.bigPay.stone).some(k => k === '1')) fail('the stone after one trip');
if (maxNum > 999) fail('a number over 999'); if (minLoss < 15) fail('an offer loses only ' + minLoss + ' gems: too small to notice'); if (roundPays) fail('pays that end in 0'); if (decoy < boards / 2 || decoy === boards) fail('the biggest pay is the best too often, or never');
if (worseBoth < SEEDS * .5) fail('the child who takes the biggest pay is not worse off on half the seeds');
if (better > SEEDS * .02) fail('the child who takes the biggest pay does better too often');
if (+mean(R.nearest.trips.map(t => t[1]).filter(x => x < 99)) <= +mean(bs.map(t => t[1])) + .3) fail('the child who takes the nearest planets does about as well as one who works it out');
console.log(fails ? `\nRESULT: FAIL (${fails})` : '\nRESULT: PASS'); process.exit(fails ? 1 : 0);
