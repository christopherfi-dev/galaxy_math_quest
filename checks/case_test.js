// The time portal case on Chronosia: clues in three places, a case board with a grid, and a choice.  [Source: Marc, 2026-11-20, his "Gallery Mysteries, Case 1":
// "This could be like 5-6 different houses, different skills. Interactive."]
//   THE DATA, for 5,000 cadets, worked out again here a different way:
//     - each clue rules out one person, by that person's own rule; exactly one person is left, and it is the one who went
//     - the clocks: last night's trip is the right length, never exactly 45 minutes, and back before midnight
//     - the needle is never exactly one half; the place is never "Chronosia, today"; the four people each go about a quarter of the time
//   PLAY, on an iPad and a phone (a different cadet on each):
//     - the crack is in the sky; the map's "look" says so
//     - the board first: the Council's note and the finished example; the casebook says "not written yet"
//     - the portal: read the clocks, write the minutes; the chart house: tap a point, the map names it, write it; the danger meter: tap a night, write the needle
//     - the board: an unfinished grid, a grid with four people left, a grid with nobody left, a wrong person named (the alibi points to a place, never a number), the right person
//     - the choice (tell on one screen, keep the secret on the other) leaves its mark: the sky, the portal, the map's "look", the person's words in the Council Hall
//     - closed and opened again, it is all still there
// Run: node checks/case_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h, seed] of [['ipad', 1180, 745, 4242], ['phone', 390, 760, 777]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps'].forEach(k => localStorage.setItem(k, 'off')); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 250; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const msg = () => p.locator('#msg').innerText(), shot = async n => { if (out) { await p.waitForTimeout(400); await p.screenshot({ path: path.join(out, `case_${name}_${n}.png`) }); } };

    if (name === 'ipad') {      // ---- the data
      const d = await p.evaluate(() => { skipIntro(); const res = { bad: [], who: {}, mins: {} }, B = m => { if (res.bad.length < 6) res.bad.push(m); };
        const P = FCASE.places, rule = { Sara: k => P.find(o => o.n === k.place.n).on, Tim: k => !P.find(o => o.n === k.place.n).other, Alex: k => k.a / k.b <= 0.5, Zara: k => k.log[3].t1 - k.log[3].t0 <= 45 };
        for (let i = 1; i <= 5000; i++) { const k = fCase(i * 31 + 7), left = FCASE.who.filter(n => rule[n](k)); res.who[k.W] = (res.who[k.W] || 0) + 1;
          if (left.length !== 1 || left[0] !== k.W) B(`cadet ${i}: ${left.join(', ') || 'nobody'} left, but ${k.W} went`);
          const L4 = k.log.find(r => r.d === 'Last night'); if (!L4 || L4.t1 - L4.t0 !== k.mins || k.mins === 45 || L4.t1 >= 1440 || L4.t0 < 19 * 60 || L4.t0 % 5 || k.mins % 5) B(`cadet ${i}: last night's clocks are wrong`);
          if (k.log.filter(r => r.d === 'Last night').length !== 1 || k.nights.filter(n => n.d === 'Last night').length !== 1 || k.log.some(r => /Oct/.test(r.d)) || k.nights[3].a !== k.a) B(`cadet ${i}: last night is not clear`);
          if (k.a * 2 === k.b || k.a < 1 || k.a >= k.b || [4, 6, 8].indexOf(k.b) < 0 || k.nights.some(n => n.a < 0 || n.a > k.b)) B(`cadet ${i}: the needle is wrong`);
          if (k.place.home || !P.some(o => o.x === k.place.x && o.y === k.place.y && o.n === k.place.n)) B(`cadet ${i}: the dial points nowhere useful`); }
        if (new Set(P.map(o => o.x + ',' + o.y)).size !== P.length) B('two places share a point'); res.check = fCheck('chrono'); return res; });
      if (d.bad.length) bad.push('the case data: ' + d.bad.join(' | ')); if (d.check.length) bad.push('the game\'s own check: ' + d.check.join(' | '));
      const share = Object.keys(d.who).map(n => d.who[n] / 50); if (Object.keys(d.who).length !== 4 || share.some(s => s < 20 || s > 30)) bad.push('the four do not each go about a quarter of the time: ' + JSON.stringify(d.who));
      console.log(`5,000 cases worked out again: ${d.bad.length} bad. Who went: ${JSON.stringify(d.who)}.`);
    }
    await p.evaluate(s => { skipIntro(); goChronosia(); C().seed = s; C().seen = new Array(CW * CH).fill('1').join(''); save(); }, seed); await p.waitForTimeout(400); await idle();
    const K = await p.evaluate(() => { const k = fCase(C().seed); return { W: k.W, mins: k.mins, x: k.place.x, y: k.place.y, n: k.place.n, a: k.a, b: k.b, t0: k.log[3].t0 }; });
    expect(await say('look'), /Stripes of colour fill the sky\. A thin crack runs across them\./, 'the crack is in the map\'s look'); await shot('1_map');
    // ---- the board first
    await say('use case'); ok(await p.locator('#toy .fcell').count() === 12, 'the grid has 12 boxes'); const board = await p.locator('#toy').innerText();
    expect(board, /Last night someone used the time portal, and did not sign the log\. Today the crack in the sky grew again, and the quakes began\.[\s\S]*Only Wen has two ✓[\s\S]*Away for: not written yet[\s\S]*Went to: not written yet[\s\S]*Danger needle: not written yet/, 'the note, the finished example and an empty casebook');
    expect(board, /Must stay on Chronosia all week[\s\S]*Cannot go to other dimensions[\s\S]*No risky trips without a chaperone[\s\S]*Cannot be away longer than 45 minutes/, 'the four rules'); await shot('2_board');
    await p.click('#try'); expect(await msg(), /^Fill every box with ✓ or ✗ first\.$/, 'an unfinished grid'); await p.click('#leave');
    // ---- the portal: the clocks and the dial
    await say('use portal'); const portal = await p.locator('#toy').innerText(); ok(await p.locator('#stageview svg svg').count() === 8, 'the log shows eight clocks, big, in the picture');
    expect(portal, new RegExp(`The dial still shows \\(${K.x}, ${K.y}\\)`), 'the dial'); ok(!new RegExp(`\\b${K.mins} minutes`).test(portal), 'the portal does not say the minutes'); await shot('3_portal');
    await p.click('#try'); expect(await msg(), /^Type the minutes first\.$/, 'no minutes typed'); await p.fill('#ans', String(K.mins)); await p.click('#try'); await p.waitForTimeout(200);
    expect(await last(), new RegExp(`^You write in your casebook: away for ${K.mins} minutes\\.$`), 'the minutes go in the casebook');
    // ---- the chart house: tap a point
    await say('use chart'); const tap = async (x, y) => { await p.locator('#fmap').scrollIntoViewIfNeeded(); await p.waitForTimeout(100); const pt = await p.evaluate(([x, y]) => { const s = document.querySelector('#fmap'), q = s.createSVGPoint(); q.x = FMX + x * FMS; q.y = FMY - y * FMS; const r = q.matrixTransform(s.getScreenCTM()); return [r.x, r.y]; }, [x, y]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(150); return p.locator('#fpt').innerText(); };
    await p.click('#try'); expect(await msg(), /^Tap a point on the map first\.$/, 'no point tapped');
    expect(await tap(0, 0), /^\(0, 0\): empty space$/, 'an empty point'); expect(await tap(1, 1), /^\(1, 1\): Chronosia, today$/, 'home'); expect(await tap(K.y, K.x), /^\(\d, \d\): /, 'the swapped point is read as what it is');
    expect(await tap(K.x, K.y), new RegExp(`^\\(${K.x}, ${K.y}\\): ${K.n.replace(/[-.]/g, '\\$&')}$`), 'the dial\'s point'); await shot('4_chart'); await p.click('#try'); await p.waitForTimeout(200);
    expect(await last(), new RegExp(`the trip went to ${K.n.replace(/[-.]/g, '\\$&')}\\.$`), 'the place goes in the casebook');
    // ---- the danger meter: tap a night, read the needle
    await say('use meter'); ok(await p.locator('#fmeter svg').count() === 0, 'no needle until a night is tapped'); await p.locator('#fnights button').nth(3).click(); await p.waitForTimeout(150);
    ok(await p.locator('#fmeter svg line').count() === K.b + 2, 'the line is cut into the right number of parts'); expect(await p.locator('#fmeter').innerText(), /The needle, last night\./, 'last night\'s needle, with no date (v94, rule R20)'); await shot('5_meter');
    await p.fill('#ans', '9'); await p.fill('#ans2', '8'); await p.click('#try'); expect(await msg(), /never past 1/, 'a needle past 1'); await p.fill('#ans', String(K.a * 2)); await p.fill('#ans2', String(K.b * 2)); await p.click('#try'); await p.waitForTimeout(200);
    expect(await last(), new RegExp(`the needle was at ${K.a * 2}/${K.b * 2}\\.$`), 'an equal fraction is written as the child wrote it');
    // ---- the board: grids that do not work, a wrong name, the right name
    await say('use case'); expect(await p.locator('#toy').innerText(), new RegExp(`Away for: ${K.mins} minutes[\\s\\S]*Went to: ${K.n.replace(/[-.]/g, '\\$&')}[\\s\\S]*Danger needle: ${K.a * 2}/${K.b * 2}`), 'the casebook shows what the child wrote');
    const setGrid = async g => { for (const [n, row] of Object.entries(g)) for (let i = 0; i < 3; i++) { const want = row[i], cell = p.locator(`#toy .fcell[data-n="${n}"][data-i="${i}"]`); for (let k = 0; k < 3; k++) { const t = (await cell.innerText()).trim(); if ((want === 1 && t === '✓') || (want === 2 && t === '✗')) break; await cell.click(); } } };
    const who = ['Sara', 'Tim', 'Alex', 'Zara'], col = { Sara: 1, Tim: 1, Alex: 2, Zara: 0 }, truth = {}; who.forEach(n => { truth[n] = [1, 1, 1]; if (n !== K.W) truth[n][col[n]] = 2; });
    const allTicks = {}; who.forEach(n => { allTicks[n] = [1, 1, 1]; }); await setGrid(allTicks); await p.click('#try'); expect(await msg(), /^4 people have three ✓\. Go back and check your clues\.$/, 'four people left');
    const none = {}; who.forEach(n => { none[n] = [2, 1, 1]; }); await setGrid(none); await p.click('#try'); expect(await msg(), /^Nobody has three ✓\. Go back and check your clues\.$/, 'nobody left');
    const wrongOne = who.find(n => n !== K.W), wrong = {}; who.forEach(n => { wrong[n] = n === wrongOne ? [1, 1, 1] : [2, 2, 2]; }); await setGrid(wrong); await p.click('#try');
    const alibi = await msg(); expect(alibi, new RegExp(`^You name ${wrongOne}\\. .* Look again at (the chart house|the danger meter|the time portal's log)\\.$`), 'a wrong name gets an alibi that points to a place'); ok(!/\d/.test(alibi), 'the alibi holds no number');
    await setGrid(truth); await shot('6_grid'); await p.click('#try'); await p.waitForTimeout(250); expect(await p.locator('#toy').innerText(), new RegExp(`${K.W} used the portal[\\s\\S]*What will you do\\?`), 'the right name: who, why, and a choice');
    if (K.W === 'Tim') expect(await p.locator('#toy').innerText(), new RegExp(K.n.replace(/[-.]/g, '\\$&')), 'Tim names the place');
    await p.click('#leave'); await say('use case'); ok(await p.locator('#tell').count() === 1, 'the choice waits until it is made');
    const ipad = name === 'ipad'; await p.click(ipad ? '#tell' : '#keep'); await p.waitForTimeout(300);
    expect(await last(), ipad ? /the portal is locked by night\. Missions go by day\.[\s\S]*Once the day turns and night comes, the crack can mend\. The Council trusts you now: it will share its notes with you\. You earn a card\.$/ : /promises never to go again\. Only you two know\. The crack stays in the sky\. \w+ whispers: "I owe you\. I will help you, when I can\." You earn a card\.$/, 'the choice');
    expect(await p.evaluate(() => JSON.stringify(S.log[S.log.length - 1])), new RegExp(`the time portal case.*named ${K.W} after 2 tries, with 0 nudges; casebook clues right: 3 of 3; chose: ${ipad ? 'tell the Council' : 'keep the secret'}`), 'the teacher\'s log');
    expect(await say('look'), ipad ? /A thin crack runs across them\. A river[\s\S]*The time portal is locked by night\.$/ : /A thin crack runs across them\.[\s\S]*Only you know who used the portal\.$/, 'the choice leaves its mark on the map');
    expect(await say('look portal'), ipad ? /Locked by night/ : /Its dial points home/, 'the portal after the choice'); expect(await say('use case'), /^Case closed\./, 'the board after the case'); await shot('7_after');
    await say('go to hall'); expect(await say('talk ' + K.W.toLowerCase()), ipad ? /You were right to tell them/ : /Thank you for keeping my secret/, `${K.W} remembers`); ok(!/secret|right to tell/.test(await say('talk ' + K.W.toLowerCase())), 'and says it once'); await say('leave');
    await p.reload(); await p.waitForTimeout(500); ok(await p.evaluate(() => C().cs.done) === K.W && await p.evaluate(() => !!C().fk['case_' + (C().cs.choice)]), 'all of it is kept after the game is opened again');
    await ctx.close();
  }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The time portal case: every check passed.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
