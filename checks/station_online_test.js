// The station's four real-life tasks, played on screen.  [Source: Marc, 2026-11-20: "For the meantime, change all the station tasks so everything is online."]
// Also the two small fixes of the same day: Xylophora names the survey post; the mission ship says when the child's own clipboard shows two rooms out of range.
//   - Shield Calibration: deal tokens onto 5 sections (put and take back); a pile left, unequal sections, a wrong count, then the right one
//   - Star Map (Marc's design of 2026-11-21): the task told first; the kinds of star; paint all 24 by tapping; the values only after painting;
//     a path through 10 to 14 stars; add up the radiation; 2,000 cadets' maps checked (stars far enough apart to tap)
//   - Target Practice: throws land where aimed, or next door; the total is never shown; a wrong sum, too few, odd, past 40, then an even total from 32 to 40
//   - Power Allocation (Marc's page 5-2): only the blocks on his table; the usual way needs a third thousand; too many hundreds; one short; then every block used
//   - the teacher switch brings back the real-life steps and codes, and the purple markers
// Run: node checks/station_online_test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps'].forEach(k => localStorage.setItem(k, 'off')); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(300); await p.evaluate(() => skipIntro()); await p.waitForTimeout(200);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const msg = async () => (await p.locator('#msg').count()) ? p.locator('#msg').innerText() : '', open = async id => { await p.evaluate(id => say(slipFor(id)), id); await p.waitForTimeout(150); }, check = async () => { await p.click('#try'); await p.waitForTimeout(120); return msg(); };
    const done = id => p.evaluate(id => !!S.done[id] && !widget, id), last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    // ---- no purple, and the ship panel says so
    ok(await p.evaluate(() => !REALON.on && TASKS.every(t => !isReal(t))), 'the four start on screen'); await p.evaluate(() => menuOpen('ship')); expect(await p.locator('#partsbox').innerText(), /Every task is played here\./, 'the ship panel');
    // ---- Shield Calibration
    await open('calib'); expect(await p.locator('#toy').innerText(), /Shield · task 3 of 3[\s\S]*Share \d+ power tokens equally/i, 'calibration opens on screen'); ok(!/code/i.test(await p.locator('#toy').innerText()), 'no teacher code');
    const N = await p.evaluate(() => S.tok), E = N / 5, picTap = async (x, y) => { const r = await p.evaluate(() => { window.scrollTo(0, 0); const b = cv.getBoundingClientRect(); return [b.left, b.top]; }); await p.touchscreen.tap(r[0] + x, r[1] + y); await p.waitForTimeout(25); };
    await p.waitForTimeout(200); expect(await p.evaluate(() => $('place').textContent), /^The token mat$/, 'the mat fills the picture');
    const tap = async i => { const pt = await p.evaluate(i => { const g = widget.geo, a = -Math.PI / 2 + (i + .5) * 2 * Math.PI / 5; return [g.ccx + Math.cos(a) * g.R * .6, g.ccy + Math.sin(a) * g.R * .6]; }, i); await picTap(pt[0], pt[1]); };
    expect(await check(), /^Some tokens are still in the pile\.$/, 'a pile left'); for (let k = 0; k < N; k++) await tap(k < E + 1 ? 0 : 1 + (k % 4));
    expect(await p.locator('#olpile').innerText(), /^The pile is empty\.$/, 'the pile empties'); expect(await check(), /^The sections are not equal yet/, 'unequal sections');
    await p.click('#oltake'); for (let k = 0; k < N; k++) for (let i = 0; i < 5; i++) await tap(i); await p.click('#olput'); for (let k = 0; k < N; k++) await tap(k % 5);
    ok(await p.evaluate(N => widget.put.every(x => x === N / 5), N), 'tapping the picture deals the tokens: ' + await p.evaluate(() => widget.put.join()));
    await p.fill('#ans', String(E + 1)); expect(await check(), /^Count the tokens on one section again\.$/, 'a wrong count'); await p.fill('#ans', String(E)); await check();
    ok(await done('calib'), 'calibration passes'); expect(await last(), new RegExp(`${N} tokens, ${E} on each of the 5 sections[\\s\\S]*You earn a card`), 'the words');
    expect(await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])), /Shield Calibration.*Sharing equally.*"tries":4/, 'the log (an early check with tokens left counts as a try)');
    // ---- Star Map  [Source: Marc, 2026-11-21]: learn the kinds, paint every star, then add up the radiation on a path through 10 to 14 stars
    const sm = await p.evaluate(() => { const keep = S.olseed, res = { bad: [], n: {} }; for (let i = 1; i <= 2000; i++) { S.olseed = i; const sky = olSky(), path = olPath(sky); res.n[path.length] = 1;
        if (sky.length !== 24) res.bad.push(`cadet ${i}: ${sky.length} stars`); sky.forEach((p, a) => { if (p[0] < 14 || p[0] > 326 || p[1] < 14 || p[1] > 206) res.bad.push(`cadet ${i}: a star off the map`); sky.forEach((q, b) => { if (a < b && Math.hypot(p[0] - q[0], p[1] - q[1]) <= 26) res.bad.push(`cadet ${i}: two stars too close to tap`); }); });
        if (path.length < 10 || path.length > 14 || new Set(path).size !== path.length || path.some((v, k) => k && sky[path[k - 1]][0] > sky[v][0])) res.bad.push(`cadet ${i}: a bad path ${path}`); } S.olseed = keep; return res; });
    if (sm.bad.length) bad.push(name + ': star maps: ' + sm.bad.slice(0, 4).join(' | ')); if (Object.keys(sm.n).length !== 5) bad.push(name + ': paths should run through 10 to 14 stars: ' + Object.keys(sm.n));
    await open('starmap'); const st = await p.locator('#toy').innerText(); expect(st, /stars give off solar radiation[\s\S]*How strong must your shield be\?[\s\S]*Red dwarf[\s\S]*Blue giant/, 'the task, told first, and the kinds of star');
    ok(!/\b(1|5|10|25) (points|radiation)|Radiation from each kind/.test(st), 'the values stay hidden until the painting is done'); expect(await check(), /^Some stars are not painted yet\.$/, 'nothing painted');
    expect(await p.evaluate(() => $('place').textContent), /^The star map$/, 'the star map fills the picture');
    const paint = async (i, k) => { await p.locator(`#olpots button[data-k="${k}"]`).click(); const pt = await p.evaluate(i => { const g = olGeo(340, 220), q = widget.sky[i]; return [g.ox + q[0] * g.s, g.oy + q[1] * g.s]; }, i); await picTap(pt[0], pt[1]); };
    for (let i = 0; i < 24; i++) await paint(i, i < 20 ? 1 : 0); expect(await check(), /^Use every kind of star, at least 3 of each\.$/, 'one kind only');
    await p.click('#leave'); await open('starmap'); ok(await p.evaluate(() => S.sm.k.filter(k => k === 1).length === 20), 'the painting is kept');
    for (let i = 0; i < 24; i++) await paint(i, i % 4); ok(await p.evaluate(() => S.sm.k.every((k, i) => k === i % 4)), 'every star is painted where it was tapped: ' + await p.evaluate(() => S.sm.k.join(''))); await check();
    const smText = await p.locator('#toy').innerText(); expect(smText, /Mission Control has drawn your ship's path\. It flies past 1[0-4] stars\.[\s\S]*Red dwarf 1 · Yellow star 5 · White star 10 · Blue giant 25[\s\S]*The 25s together make 100/, 'the path, the values, and a finished example about gems');
    ok(await p.evaluate(() => S.sm.path.length >= 10 && $('place').textContent === 'The star map'), 'the path is drawn on the map in the picture'); const tot = await p.evaluate(() => S.sm.path.reduce((a, i) => a + [1, 5, 10, 25][S.sm.k[i]], 0)), n = await p.evaluate(() => S.sm.path.length);
    await p.fill('#ans', String(tot - 1)); expect(await check(), /^Too weak\./, 'too weak'); await p.fill('#ans', String(tot + 5)); expect(await check(), /^Stronger than it needs to be\./, 'too strong');
    await p.click('#leave'); await open('starmap'); ok(await p.evaluate(() => !!S.sm.path && /Mission Control has drawn/.test($('toy').textContent)), 'the path is kept'); await p.fill('#ans', String(tot)); await check(); ok(await done('starmap'), 'star map passes');
    expect(await last(), new RegExp(`Your shield is set to ${tot}\\.`), 'the shield');
    // ---- Target Practice: throws land where aimed while Math.random is high
    await open('target'); await p.evaluate(() => { window._r = Math.random; Math.random = () => .9; }); const thr = async n => { await p.locator(`#ol9 button[data-n="${n}"]`).click(); await p.waitForTimeout(40); };
    expect(await check(), /^Throw first\.$/, 'no throws'); for (const n of [9, 9, 9]) await thr(n); ok(!/27/.test(await p.locator('#toy').innerText()), 'the total is never shown'); expect(await p.locator('#olhits').innerText(), /You aim at 9\. Hit! Your hits: 9, 9, 9\./, 'the hits');
    await p.fill('#ans', '26'); expect(await check(), /^Add your hits again\.$/, 'a wrong sum'); await p.fill('#ans', '27'); expect(await check(), /^Keep throwing/, 'too few'); await thr(4); await p.fill('#ans', '31'); expect(await check(), /reach 32/, '31 is too few'); await thr(4); await p.fill('#ans', '35'); expect(await check(), /^Your total is odd\./, 'odd');
    await thr(9); await p.fill('#ans', '44'); expect(await check(), /past 40/, 'past 40'); await p.click('#olnew'); expect(await p.locator('#olhits').innerText(), /No throws yet/, 'a new round');
    { const pt = await p.evaluate(() => { const g = widget.geo; return [g.ox + 2.5 * g.c, g.oy + .5 * g.c]; }); await picTap(pt[0], pt[1]); expect(await p.locator('#olhits').innerText(), /You aim at 9\. Hit!/, 'a tap on the wall in the picture throws'); await p.click('#olnew'); }
    await p.evaluate(() => { Math.random = () => .1; }); await thr(5); expect(await p.locator('#olhits').innerText(), /You aim at 5\. It lands on [2468]\./, 'a throw can land next door'); await p.evaluate(() => { Math.random = () => .9; });
    const first = await p.evaluate(() => widget.hits[0]); let sum = first; for (const n of [9, 9, 9]) { await thr(n); sum += n; } while (sum < 32 || sum % 2) { const n = sum + 9 <= 40 ? 9 : (40 - sum) % 2 === 0 ? 40 - sum : 1; await thr(n); sum += n; }
    await p.fill('#ans', String(sum)); await check(); ok(await done('target'), 'target practice passes with ' + sum); await p.evaluate(() => { Math.random = window._r; });
    // ---- Power Allocation  [Source: Marc's page 5-2]: four systems, and only the blocks on his table (2 thousands, 20 hundreds, 40 tens, 60 ones)
    await open('alloc'); expect(await p.locator('#toy').innerText(), /After the storm, the ship has 4,460 units of power left\. Four systems need it\.[\s\S]*A finished example\. A trader needs small bags/, 'the task, told first, and an example about gems');
    ok(await p.evaluate(() => olPicOn() && widget.pic.kind === 'bench' && $('place').textContent === 'The power table'), 'the power table fills the picture');
    const fill = async rows => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) await p.fill(`#ol${i}${j}`, String(rows[i][j])); };
    expect(await check(), /^Fill every box/, 'empty boxes'); await fill([[1, 2, 3, 7], [1, 1, 9, 3], [1, 0, 9, 7], [0, 9, 3, 3]]); expect(await check(), /^The table has only 2 1000-blocks\. You used 3\.$/, 'the usual way needs 3 thousands');
    await fill([[0, 12, 3, 7], [1, 1, 9, 3], [1, 0, 9, 7], [0, 9, 3, 3]]); expect(await check(), /^The table has only 20 100-blocks\. You used 22\.$/, 'too many hundreds');
    await fill([[0, 10, 19, 46], [1, 1, 9, 3], [1, 0, 9, 7], [0, 9, 3, 3]]); expect(await check(), /^1 of the 4 systems does not get exactly their units\.$/, 'one system one short');
    ok(await p.evaluate(() => JSON.stringify(olAllocVals()) === JSON.stringify([[0, 10, 19, 46], [1, 1, 9, 3], [1, 0, 9, 7], [0, 9, 3, 3]])), 'the picture reads what the child wrote');
    await p.click('#leave'); await open('alloc'); expect(await p.inputValue('#ol03'), /^46$/, 'the boxes are kept'); await p.fill('#ol03', '47'); await check(); ok(await done('alloc'), 'power allocation passes with every block used');
    // ---- the teacher switch
    await p.evaluate(() => { const c = $('realOn'); c.checked = true; c.onchange(); });      /* the switch sits in the teacher's closed notes */ ok(await p.evaluate(() => REALON.on && isReal(TASKS.find(t => t[0] === 'calib'))), 'the switch turns real-life tasks on');
    await p.evaluate(() => { delete S.done.calib; }); await open('calib'); expect(await p.locator('#toy').innerText(), /a real-life task[\s\S]*your teacher gives you a code/i, 'the real-life steps come back'); await p.click('#leave');
    if (name === 'ipad') { const q = await ctx.newPage(); await q.goto(FILE + '?real'); await q.waitForTimeout(300); ok(await q.evaluate(() => REALON.on), 'the link ending ?real turns them on'); await q.close(); }
    // ---- fix 1: Xylophora names the survey post
    await p.evaluate(() => { goXylophora(); const c = XY(); c.intro = 1; }); await p.waitForTimeout(300); await p.evaluate(() => { closeToy(); act('build home'); }); await p.waitForTimeout(200); expect(await last(), /They wait at the survey post for a count\./, 'Xylophora names the post');
    // ---- fix 2: the clipboard on the mission ship
    const clip = async mode => { await p.evaluate(mode => { goStardust(); const c = SD(), v = sNums(c.seed), r = {}; SRK.forEach((k, i) => { r[k] = v.temp[i]; });
      if (mode === 'two') { const g = SRK.find((k, i) => i !== v.bad); r[g] = SRM[g].hi + 1; } if (mode === 'none') r[SRK[v.bad]] = SRM[SRK[v.bad]].lo; c.sawOld = true; c.barsOk = true; c.bars = v.temp.slice(); c.rec = r; closeToy(); sChart(); }, mode); await p.waitForTimeout(150); return p.locator('#toy').innerText(); };
    ok(!/Read the thermometers again/.test(await clip('right')), 'a right clipboard gets no note');
    expect(await clip('two'), /It shows 2 rooms out of range\. Only one room is\. Read the thermometers again\./, 'two rooms out');
    expect(await clip('none'), /It shows no room out of range\./, 'no room out');
    await ctx.close();
  }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The station on screen, and the two small fixes: every check passed.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
