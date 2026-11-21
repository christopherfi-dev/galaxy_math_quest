// The station's four real-life tasks, played on screen.  [Source: Marc, 2026-11-20: "For the meantime, change all the station tasks so everything is online."]
// Also the two small fixes of the same day: Xylophora names the survey post; the mission ship says when the child's own clipboard shows two rooms out of range.
//   - Shield Calibration: deal tokens onto 5 sections (put and take back); a pile left, unequal sections, a wrong count, then the right one
//   - Star Map: the stars on the path are counted again here from the drawing itself, kind by kind; every star is right on the path or well away from it, for 2,000 cadets;
//     then Marc's code: each count times its kind's number, added up
//   - Target Practice: throws land where aimed, or next door; the total is never shown; a wrong sum, too few, odd, past 40, then an even total from 32 to 40
//   - Power Allocation: Marc's four numbers; too many thousand-blocks, a number built wrong, then built right with only 2
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
    const N = await p.evaluate(() => S.tok), E = N / 5, tap = async i => p.evaluate(i => document.querySelector(`#olmat path[data-i="${i}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true })), i);
    expect(await check(), /^Some tokens are still in the pile\.$/, 'a pile left'); for (let k = 0; k < N; k++) await tap(k < E + 1 ? 0 : 1 + (k % 4));
    expect(await p.locator('#olpile').innerText(), /^The pile is empty\.$/, 'the pile empties'); expect(await check(), /^The sections are not equal yet/, 'unequal sections');
    await p.click('#oltake'); for (let k = 0; k < N; k++) for (let i = 0; i < 5; i++) await tap(i); await p.click('#olput'); for (let k = 0; k < N; k++) await tap(k % 5);
    ok(await p.locator('#olmat circle').count() === N, 'every token is drawn as a dot'); ok(!/\b\d+\b/.test(await p.locator('#olmat').innerHTML().then(s => s.replace(/<[^>]*>/g, ''))), 'the mat shows no numbers');
    await p.fill('#ans', String(E + 1)); expect(await check(), /^Count the tokens on one section again\.$/, 'a wrong count'); await p.fill('#ans', String(E)); await check();
    ok(await done('calib'), 'calibration passes'); expect(await last(), new RegExp(`${N} tokens, ${E} on each of the 5 sections[\\s\\S]*You earn a card`), 'the words');
    expect(await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])), /Shield Calibration.*Sharing equally.*"tries":4/, 'the log (an early check with tokens left counts as a try)');
    // ---- Star Map: the data for 2,000 cadets, then one played
    const sm = await p.evaluate(() => { const keep = S.olseed, res = { bad: [], maps: {} }; for (let i = 0; i < 2000; i++) { S.olseed = i + 1; const M = olStarMap(), P = M.path;
        const seg = (q, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy); }, d = q => Math.min(seg(q, P[0], P[1]), seg(q, P[1], P[2]), seg(q, P[2], P[3]), seg(q, P[3], P[4]));
        const cnt = [0, 0, 0, 0, 0]; M.stars.forEach(s => { const dd = d(s); if (dd < .5) cnt[s[2]]++; else if (dd < 20) res.bad.push(`cadet ${i}: a star sits ${dd.toFixed(1)} from the path`); if (s[0] < 6 || s[0] > 334 || s[1] < 6 || s[1] > 214) res.bad.push(`cadet ${i}: a star is off the map`); });
        res.maps[JSON.stringify(M.path)] = 1; if (String(cnt) !== String(M.on) || cnt.some(c => c < 1 || c > 3)) res.bad.push(`cadet ${i}: on the path ${cnt}, game says ${M.on}`); } S.olseed = keep; res.on = olStarMap().on; res.n = Object.keys(res.maps).length; return res; });
    if (sm.bad.length) bad.push(name + ': star maps: ' + sm.bad.slice(0, 4).join(' | ')); if (sm.n < 1900) bad.push(name + ': only ' + sm.n + ' different star maps for 2,000 cadets');
    await open('starmap'); ok(await p.locator('#toy svg polyline').count() === 1, 'the path is drawn'); expect(await check(), /^Fill in all five/, 'empty boxes');
    for (let i = 0; i < 5; i++) await p.fill('#ol' + i, String(sm.on[i] + (i < 2 ? 1 : 0))); expect(await check(), /^2 of your 5 counts do not match the path\.$/, 'two wrong counts');
    for (let i = 0; i < 5; i++) await p.fill('#ol' + i, String(sm.on[i])); await check(); expect(await p.locator('#toy').innerText(), /Now the code\. Each kind of star has a number/, 'the code step [Source: his page]');
    const code = sm.on.reduce((a, n, i) => a + n * [2, 3, 4, 5, 6][i], 0); await p.click('#leave'); await open('starmap'); expect(await p.locator('#toy').innerText(), /Now the code/, 'the counts are kept');
    await p.fill('#ans', String(code + 1)); expect(await check(), /^That is not the code\. Check each multiplication, then the adding\.$/, 'a wrong code'); await p.fill('#ans', String(code)); await check(); ok(await done('starmap'), 'star map passes');
    expect(await last(), new RegExp(`The code is ${code}\.`), 'the code');
    // ---- Target Practice: throws land where aimed while Math.random is high
    await open('target'); await p.evaluate(() => { window._r = Math.random; Math.random = () => .9; }); const thr = async n => { await p.locator(`#ol9 button[data-n="${n}"]`).click(); await p.waitForTimeout(40); };
    expect(await check(), /^Throw first\.$/, 'no throws'); for (const n of [9, 9, 9]) await thr(n); ok(!/27/.test(await p.locator('#toy').innerText()), 'the total is never shown'); expect(await p.locator('#olhits').innerText(), /You aim at 9\. Hit! Your hits: 9, 9, 9\./, 'the hits');
    await p.fill('#ans', '26'); expect(await check(), /^Add your hits again\.$/, 'a wrong sum'); await p.fill('#ans', '27'); expect(await check(), /^Keep throwing/, 'too few'); await thr(4); await p.fill('#ans', '31'); expect(await check(), /reach 32/, '31 is too few'); await thr(4); await p.fill('#ans', '35'); expect(await check(), /^Your total is odd\./, 'odd');
    await thr(9); await p.fill('#ans', '44'); expect(await check(), /past 40/, 'past 40'); await p.click('#olnew'); expect(await p.locator('#olhits').innerText(), /No throws yet/, 'a new round');
    await p.evaluate(() => { Math.random = () => .1; }); await thr(5); expect(await p.locator('#olhits').innerText(), /You aim at 5\. It lands on [2468]\./, 'a throw can land next door'); await p.evaluate(() => { Math.random = () => .9; });
    const first = await p.evaluate(() => widget.hits[0]); let sum = first; for (const n of [9, 9, 9]) { await thr(n); sum += n; } while (sum < 32 || sum % 2) { const n = sum + 9 <= 40 ? 9 : (40 - sum) % 2 === 0 ? 40 - sum : 1; await thr(n); sum += n; }
    await p.fill('#ans', String(sum)); await check(); ok(await done('target'), 'target practice passes with ' + sum); await p.evaluate(() => { Math.random = window._r; });
    // ---- Power Allocation
    await open('alloc'); const fill = async rows => { for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) await p.fill(`#ol${i}${j}`, String(rows[i][j])); };
    expect(await check(), /^Fill every box/, 'empty boxes'); await fill([[1, 2, 3, 7], [1, 1, 9, 3], [1, 0, 9, 7], [0, 9, 3, 3]]); expect(await check(), /^You used 3 thousand-blocks\. You have only 2\.$/, 'three thousands');
    await fill([[1, 2, 3, 7], [0, 11, 9, 3], [1, 0, 9, 7], [0, 9, 3, 2]]); expect(await check(), /^1 of the 4 numbers is not built right\.$/, 'one built wrong');
    await fill([[1, 2, 3, 7], [0, 11, 9, 3], [1, 0, 9, 7], [0, 9, 3, 3]]); await check(); ok(await done('alloc'), 'power allocation passes');
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
