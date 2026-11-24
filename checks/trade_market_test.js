// Galactic Trade as a market: a child's play, in a real browser, at iPad sideways (1180 x 745), iPad upright (820 x 1180) and phone (390 x 760).
// Run:  node checks/trade_market_test.js [folder for screenshots]
// It plays docs/trade/index.html as a child would (HANDOFF_Trade_2026-11-23.md, section 6):
//   - the story first, before any maths; the price list in view (on the desk and in the picture); the solved example before the first trip
//   - a route too far for the fuel; a wrong fuel, a wrong "left after fuel", then right; a wrong count twice, then right
//   - closing the page in the middle of a flight and opening it again (no fuel paid twice)
//   - a trip that loses gems, and the words that say so
//   - a trip to Planet R without enough gems for the stone (on one size): the fuel is spent, and the words say why
//   - the glow stone bought after two or three good trips; the supplies bought; the market's end
//   - no running total anywhere: every word drawn on the picture is recorded, and the desk is read, after every tap
//   - every number of the board is drawn in the picture (pays, light-years); every nudge ("Not yet") holds no number
//   - kind words on every line the child sees
//   - the ship's log, the full chest, the Council's gift, an old season, and a child who has a glow stone already (on one size each)
const { chromium } = require('playwright'), path = require('path'), fs = require('fs');
const FILE = 'file://' + path.resolve(__dirname, '..', 'docs', 'trade', 'index.html'), OUT = process.argv[2];
if (OUT) fs.mkdirSync(OUT, { recursive: true });
const LY = { A: 10, B: 30, C: 30, D: 20, E: 40, F: 10, G: 20, H: 30, I: 50, J: 20, K: 40, L: 50, M: 30, N: 70, O: 50, P: 70, Q: 50, R: 60, S: 40, T: 60 };
const HARSH = /\b(wrong|bad|fail|failed|stupid|silly|dumb|lazy|easy|obviously|just guess|no!|oops|careless|terrible|loser|you lost the game)\b/i;
const bad = [], errs = [], seen = new Set(); let shots = 0;
const fail = (size, m) => { bad.push(size + ': ' + m); console.log('  FAIL ' + size + ': ' + m); };

function plans(offers, B) { const out = []; for (let m = 1; m < 32; m++) { const pick = [0, 1, 2, 3, 4].filter(i => m & (1 << i)); if (pick.length > 3) continue;
  const fuel = pick.reduce((a, i) => a + 2 * LY[offers[i].n], 0), pay = pick.reduce((a, i) => a + offers[i].pay, 0); out.push({ pick, fuel, pay, fits: fuel <= B, end: B - fuel + pay }); } return out; }

async function run(b, size, w, h, seed, extra) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.addInitScript(() => { const f = CanvasRenderingContext2D.prototype.fillText; window.__drawn = new Set(); CanvasRenderingContext2D.prototype.fillText = function (t) { try { window.__drawn.add(String(t)); } catch (e) {} return f.apply(this, arguments); }; });
  p.on('pageerror', e => errs.push(size + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_|net::/.test(m.text())) errs.push(size + ' console: ' + m.text()); });
  const URL = FILE + '?fast=1&seed=' + seed + (extra || ''); await p.goto(URL + '&fresh=1'); await p.waitForFunction(() => window.GMQ_PAGE && document.querySelector('#toy h3'));
  const st = () => p.evaluate(() => JSON.parse(JSON.stringify(window.GMQ_PAGE.saved().state)));
  const bag = () => p.evaluate(() => JSON.parse(JSON.stringify(window.GMQ_PAGE.saved().bag)));
  const desk = async () => { const t = await p.evaluate(() => document.getElementById('toy').innerText); t.split('\n').map(s => s.trim()).filter(Boolean).forEach(s => seen.add(s)); return t; };
  const drawn = async () => { await p.evaluate(() => { window.__drawn = new Set(); }); await p.waitForTimeout(120); return p.evaluate(() => Array.from(window.__drawn)); };
  const shot = async n => { if (OUT) { await p.screenshot({ path: path.join(OUT, size + '_' + n + '.png') }); shots++; } };
  const click = async sel => { await p.click(sel); await p.waitForTimeout(60); };
  const step = async () => (await st()).step;
  const msg = async () => p.evaluate(() => { const m = document.getElementById('msg'); return m ? m.textContent : ''; });
  const nudge = async (what) => { const m = await msg(); seen.add(m); if (!/^Not yet\./.test(m)) fail(size, what + ': expected "Not yet", got "' + m + '"'); if (/\d/.test(m.replace(/2 gems for each light-year|costs 2 gems/g, ''))) fail(size, what + ': a nudge holds a number: "' + m + '"'); };      /* the one number allowed: the rate, 2 gems a light-year, which is on the desk already */
  const fill = async (id, v) => { await p.fill('#' + id, String(v)); };
  /* the desk and the picture after a tap on the board: no running total, and every number of the board in view */
  const noTotals = async (what) => { const s = await st(), o = s.board.offers, sel = s.sel, B = s.gems, d = await desk(), pic = await drawn();
    if (/\btotal\b|so far|in all you/i.test(d)) fail(size, what + ': the desk talks of a total');
    o.forEach(x => { if (!pic.includes('pays ' + x.pay + ' gems')) fail(size, what + ': the picture does not show Planet ' + x.n + "'s pay"); if (!pic.includes(LY[x.n] + ' light-years')) fail(size, what + ': the picture does not show Planet ' + x.n + "'s light-years"); });
    if (sel.length) { const fuel = sel.reduce((a, i) => a + 2 * LY[o[i].n], 0), pay = sel.reduce((a, i) => a + o[i].pay, 0), allowed = new Set([B, 300, 500, 2, 3, ...o.map(x => x.pay), ...Object.values(LY)]);
      [fuel, pay, B - fuel, B - fuel + pay].forEach(n => { if (allowed.has(n)) return; const re = new RegExp('(^|[^0-9])' + n + '([^0-9]|$)'); if (re.test(d)) fail(size, what + ': the desk shows ' + n + ', a sum of the plan'); if (pic.some(t => re.test(t))) fail(size, what + ': the picture shows ' + n + ', a sum of the plan'); }); }
    return { s, d, pic }; };
  const choose = async (pick) => { let s = await st(); for (const i of s.sel.slice()) if (pick.indexOf(i) < 0) { await click(`#toy .chips .btn[data-i="${i}"]`); await noTotals('taking a crate off'); }
    s = await st(); for (const i of pick) if (s.sel.indexOf(i) < 0) { await click(`#toy .chips .btn[data-i="${i}"]`); await noTotals('loading a crate'); } };
  const pumpRight = async (fuel, left) => { await fill('ans', fuel); await fill('ans2', left); await click('#try'); const m = await msg(); seen.add(m); if (!/^Right/.test(m)) fail(size, 'the right fuel and left were not taken: ' + m); await click('#trfly'); };
  const waitStep = async (want) => { await p.waitForFunction(w2 => window.GMQ_PAGE.saved().state.step === w2, want, { timeout: 20000 }); await p.waitForTimeout(60); };
  const countRight = async (wrongTwice) => { const s = await st(), o = s.board.offers, end = s.left + s.sel.reduce((a, i) => a + o[i].pay, 0); await desk();
    if (wrongTwice) { await fill('ans', end + 10); await click('#try'); await nudge('a wrong count'); await fill('ans', end - 1); await click('#try'); await nudge('a second wrong count'); }
    await fill('ans', end); await click('#try'); await waitStep('result'); const d = await desk(); if (!d.includes('came home with ' + end)) fail(size, 'the result does not say ' + end); return end; };
  /* one trade trip on the best plan (or the given one) */
  const trip = async (pick, opts) => { opts = opts || {}; const s = await st(); await choose(pick); await click('#try'); if (await step() !== 'pump') fail(size, 'Fly did not open the fuel');
    const o = s.board.offers, fuel = pick.reduce((a, i) => a + 2 * LY[o[i].n], 0);
    if (opts.wrong) { await fill('ans', fuel + 20); await click('#try'); await nudge('a wrong fuel'); await fill('ans', fuel); await fill('ans2', s.gems - fuel + 10); await click('#try'); await nudge('a wrong "left after fuel"'); }
    if (opts.shot) await shot('pump');
    await pumpRight(fuel, s.gems - fuel); await p.waitForTimeout(80);
    if (opts.reload) { const mid = await st(); if (mid.step !== 'fly') fail(size, 'not flying after paying'); await p.goto(URL); await p.waitForFunction(() => window.GMQ_PAGE && document.querySelector('#toy h3'));
      const again = await st(); if (again.step !== 'fly' || again.gems !== s.gems - fuel) fail(size, `after closing and opening mid-flight: step ${again.step}, gems ${again.gems} (should be fly, ${s.gems - fuel})`); await shot('reopened_midflight'); }
    else if (opts.shot) await shot('flying');
    await waitStep('count'); if (opts.shot) await shot('count');
    const end = await countRight(opts.wrong); return end; };
  const bestOf = async () => { const s = await st(); const all = plans(s.board.offers, s.gems).filter(x => x.fits).sort((a, c) => c.end - a.end); return all[0]; };

  // ---- the story, first ----
  let d = await desk(); if (!/Energy Council/.test(d) || await p.$('#toy input')) fail(size, 'the first screen is not the story'); await shot('1_call');
  await click('#try'); d = await desk(); if (!/500 gems/.test(d)) fail(size, 'the supplies price is not told'); await shot('2_hold');
  await click('#try'); d = await desk(); if (extra && /stone=1/.test(extra)) { if (!/glow stone already/.test(d)) fail(size, 'a child with a glow stone is not told so'); } else if (!/300 gems/.test(d)) fail(size, 'the glow stone price is not told'); if (!/gift/.test(d)) fail(size, 'the gift is not told'); await shot('3_list');
  const pic3 = await drawn(); if (!(extra && /stone=1/.test(extra)) && !pic3.some(t => /300 gems/.test(t))) fail(size, 'the picture does not show the glow stone price');
  await click('#try'); d = await desk(); if (!/2 gems for each light-year/.test(d) || !/paper/.test(d)) fail(size, 'the fuel rule or the paper is not told'); await shot('4_rules');
  await click('#try'); if (await step() !== 'demo') fail(size, 'no solved example before the first trip'); d = await desk(); const picD = await drawn(); if (!picD.some(t => /0 \+ 35 \+ 28 = 63/.test(t))) fail(size, "Tavi's paper is not drawn"); await shot('5_example');
  await click('#try'); if (await step() !== 'plan') fail(size, 'the first trip did not open'); let s = await st(); if (s.gems !== 100) fail(size, 'the Council gift is not 100 gems');
  const t0 = await noTotals('the first board'); if (!/To buy/.test(t0.d)) fail(size, 'no way to the price list from the board'); await shot('6_board');
  // tapping the picture: a card, then a planet on the map, each loads a crate, and a second tap takes it off (the layout is worked out as the page does)
  { const r = await p.evaluate(() => { const c = document.getElementById('cv').getBoundingClientRect(); return { x: c.left, y: c.top, w: c.width, h: c.height }; });
    const ORDER = 'FSJIGOBRCNPKTMLHQDEA'.split(''), vw = r.w, vh = r.h, mm = Math.min(vw, vh), fs = Math.max(12, Math.min(17, mm * .025)), pad = Math.max(6, mm * .012), cols = vw >= 560 ? 5 : 3, cw = (vw - pad * (cols + 1)) / cols, cfs = Math.max(11, Math.min(fs, cw / 9.2)), ch = cfs * 4.6;
    const off = (vw - cols * cw - (cols + 1) * pad) / 2, rows = Math.ceil(5 / cols), base = vh - fs * 2.7, rad = Math.max(40, Math.min(vw * .47, base - (rows * ch + (rows + 1) * pad + fs * .6))), n = s.board.offers[1].n;
    const a = (-78 + ORDER.indexOf(n) * (156 / 19)) * Math.PI / 180, rr = .2 + .8 * LY[n] / 71, X = vw / 2 + Math.sin(a) * rr * rad, Y = base - Math.cos(a) * rr * rad;
    await p.mouse.click(r.x + off + pad + cw / 2, r.y + pad + ch / 2); await p.waitForTimeout(60); await p.mouse.click(r.x + X, r.y + Y); await p.waitForTimeout(60);
    let q = await st(); if (q.sel.indexOf(0) < 0) fail(size, 'tapping a card did not load a crate'); if (q.sel.indexOf(1) < 0) fail(size, 'tapping a planet on the map did not load a crate');
    await noTotals('tapping the picture'); await p.mouse.click(r.x + off + pad + cw / 2, r.y + pad + ch / 2); await p.mouse.click(r.x + X, r.y + Y); await p.waitForTimeout(60);
    q = await st(); if (q.sel.length) fail(size, 'a second tap did not take the crates off'); }
  // a route too far
  const far = plans(s.board.offers, s.gems).filter(x => !x.fits && x.pick.length >= 2).sort((a, c) => a.pick.length - c.pick.length || a.fuel - c.fuel)[0];
  await choose(far.pick); await shot('7_chosen_too_far'); await click('#try'); await fill('ans', far.fuel); await click('#try'); let m = await msg(); seen.add(m); if (!/too far/.test(m)) fail(size, 'a route too far for the fuel is not said: ' + m); await shot('8_too_far'); await click('#trback');
  // a hint, when asked: no number
  for (let k = 0; k < 4; k++) { await click('#trhint'); m = await msg(); seen.add(m); if (/\d/.test(m)) fail(size, 'a hint holds a number: ' + m); }
  // trip 1: the best plan, with wrong answers first, and the page closed mid-flight
  let best = await bestOf(); let end = await trip(best.pick, { wrong: true, reload: true, shot: true }); await shot('9_result1');
  // the ship's log
  await click('#trlog'); d = await desk(); if (!/Every trip/.test(d) || !d.includes(String(end))) fail(size, 'the ship\'s log does not keep trip 1'); if (extra && /last=/.test(extra) && (!/older season/.test(d) || /2,000|2000/.test(d))) fail(size, 'the old season is not in the log, or its number is shown'); await shot('10_log'); await click('#try');
  // a trip to Planet R without enough for the stone (one size only)
  if (size === 'ipad_sideways') { await click('#trbuy'); await shot('11_to_buy'); s = await st();
    await click('#trsup'); m = await msg(); seen.add(m); if (!/Not enough yet/.test(m) || (await st()).gems !== s.gems) fail(size, 'supplies with too few gems: ' + m);
    if (/\b1?\d\d\b gems more|need \d/.test(m)) fail(size, 'the supplies message works out the difference for the child');
    await click('#trstone'); await fill('ans', 120); await fill('ans2', s.gems - 120); await click('#try'); m = await msg(); seen.add(m);
    if (!/land on Planet R/.test(m) || !/costs 300/.test(m)) fail(size, 'the stone pump did not put what is left beside the price: ' + m); await click('#trfly'); await waitStep('shome'); d = await desk(); if (!/not enough/.test(d) || !/fuel here cost 120/.test(d)) fail(size, 'not enough for the stone, and what the fuel cost, are not said'); await shot('12_not_enough');
    await click('#try'); await waitStep('plan'); s = await st(); if (s.gems !== end - 120) fail(size, 'the fuel to R was not spent'); end = s.gems; }
  // the next trips: one with a loss, then the best, until the stone and the supplies are bought
  let trips = 1, stoneAt = 0, lossSeen = false;
  for (let k = 0; k < 8; k++) {
    s = await st(); if (s.step === 'result') { await click('#try'); s = await st(); }
    if (s.step === 'done') break;
    const haveStone = (await bag()).stone;
    if (!haveStone && s.gems >= 420) { await click('#trbuy'); await click('#trstone'); await fill('ans', 120); await fill('ans2', s.gems - 120); await click('#try'); await click('#trfly'); await waitStep('spay'); await shot('13_stone_trader');
      const g = (await st()).gems; await fill('ans', g - 300 + 100); await click('#try'); await nudge('a wrong change at Planet R'); await fill('ans', g - 300); await click('#try'); if (!(await bag()).stone) fail(size, 'the glow stone was not given'); await shot('14_stone_bought');
      stoneAt = trips; await click('#try'); await p.waitForFunction(() => ['plan', 'done'].indexOf(window.GMQ_PAGE.saved().state.step) >= 0); continue; }
    if (s.bought && !s.bought.supplies && s.gems >= 500) { await click('#trbuy'); await click('#trsup'); await fill('ans', s.gems - 400); await click('#try'); await nudge('a wrong change for the supplies'); await fill('ans', s.gems - 500); await click('#try');
      d = await desk(); if (!/lights up/.test(d)) fail(size, 'Voltara does not light up'); await p.waitForTimeout(400); await shot('15_supplies'); await click('#try'); continue; }
    if (s.step !== 'plan') { fail(size, 'expected the board, found ' + s.step); break; }
    const o = s.board.offers, loss = o.findIndex(x => x.pay < 2 * LY[x.n]);
    let pick = (await bestOf()).pick;
    if (!lossSeen && loss >= 0 && 2 * LY[o[loss].n] <= s.gems) { const alt = plans(o, s.gems).filter(x => x.fits && x.pick.indexOf(loss) >= 0).sort((a, c) => c.end - a.end)[0]; if (alt) { pick = alt.pick; lossSeen = true; } }
    await trip(pick, { shot: trips === 1 && size !== 'ipad_sideways' }); trips++;
    d = await desk();
    if (lossSeen && /You lost \d+ gems at Planet [A-Z]\./.test(d)) { lossSeen = 'said'; await shot('16_loss'); }
  }
  if (lossSeen !== 'said') fail(size, 'a trip that lost gems was not played, or not said');
  if (!stoneAt && !(extra && /stone=1/.test(extra))) fail(size, 'the glow stone was never bought'); else if (stoneAt > 4) fail(size, 'the glow stone took ' + stoneAt + ' trips');
  s = await st(); if (s.step !== 'done') fail(size, 'the market did not end; step ' + s.step); else await shot('17_done');
  await p.close(); return { trips, stoneAt };
}

/* one size each: the full chest, the gift, a child with a stone already, an old season */
async function corners(b) { const size = 'states', p = await b.newPage({ viewport: { width: 1180, height: 745 } }); p.on('pageerror', e => errs.push(size + ': ' + e.message));
  const set = async (st) => { await p.goto(FILE + '?fast=1'); await p.evaluate(s2 => { localStorage.setItem('gmq-trade-page-v1', JSON.stringify({ state: s2, bag: {} })); }, st); await p.goto(FILE + '?fast=1'); await p.waitForFunction(() => window.GMQ_PAGE && document.querySelector('#toy h3')); return p.evaluate(() => document.getElementById('toy').innerText); };
  const base = { v: 1, seed: 99, step: 'plan', gems: 650, trip: 3, board: null, sel: [], left: 0, log: [], bought: { supplies: false, stone: false }, gifts: 0 };
  let d = await set(base); d.split('\n').forEach(x => seen.add(x.trim())); if (!/Buy something first/.test(d) || !/999/.test(d)) fail(size, 'a ship with 600 gems or more is not told to buy first'); if (OUT) await p.screenshot({ path: path.join(OUT, 'states_full_chest.png') });
  d = await set(Object.assign({}, base, { gems: 30 })); d.split('\n').forEach(x => seen.add(x.trim())); const g = await p.evaluate(() => window.GMQ_PAGE.saved().state.gems); if (!/sends 100 gems/.test(d) || g !== 130) fail(size, 'the Council gift below 60 gems: ' + g); if (OUT) await p.screenshot({ path: path.join(OUT, 'states_gift.png') });
  await p.close(); }

(async () => { const b = await chromium.launch(); const res = {};
  res.side = await run(b, 'ipad_sideways', 1180, 745, 4242, '&last=2000');
  res.up = await run(b, 'ipad_upright', 820, 1180, 31337);
  res.phone = await run(b, 'phone', 390, 760, 2026, '&stone=1');
  await corners(b); await b.close();
  for (const line of seen) if (HARSH.test(line)) fail('words', 'a harsh word: "' + line + '"');
  console.log(`Played at three sizes. Trade trips before the glow stone: sideways ${res.side.stoneAt} (after a wasted trip to R), upright ${res.up.stoneAt}, phone: had one already. Lines read: ${seen.size}. Screenshots: ${shots}.`);
  if (errs.length) { console.log('Page errors:\n  ' + errs.join('\n  ')); }
  console.log(bad.length || errs.length ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad.length || errs.length ? 1 : 0); })();
