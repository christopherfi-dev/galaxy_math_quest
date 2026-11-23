// Plays Planet Lengthar in prototypes/kis_station_sketch.html, as a child would, on three screens.   [Proposal]
// Design: proposals/GMQ_Lengthar_Design_v2_2026-11-22.md. Numbers: checks/lengthar_check.js.
//
// It checks:
//   - the three arrival screens, each with a wait before Next (iPad sideways only)
//   - the Workshop sends you back for the finished example first; the example shows a peg from 0 to its length
//   - the rod: a wrong tap is caught; ½, ¼, ¾, 2/4 (on ½) and 4/4 (at the end); then ¾ is longer than ¼
//   - the Long Hall: a reading before the ruler is slid is caught; an answer half a centimetre out is caught;
//     the ruler is slid by a real tap at the start of the thing; eight things, each picture TRUE to its length
//   - leaving half-way and opening the game again keeps the things already measured
//   - the Matrix: a wrong count of Xs is caught; Xs are put by real taps (the same spot tapped again adds again); Take away the last X; the question is answered
//   - the Rift: three crystals, measured, then judged; a wrong judgement is caught; the true ruler is given
//   - the mission panel says 4 of 4; flying away; the report home is offered in space
//   - the picture is wide (it fills the stage), and nothing spills sideways
// Answers come from the cadet's numbers (lNums), but each picture is checked to show exactly those numbers.
//
// Run:  node checks/lengthar_test.js [folder for screenshots]     Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['sideways', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { window.GMQ_NO_PV = true; try { localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-cards', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(400);
    await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); }); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const idle = async () => { for (let i = 0; i < 150; i++) { if (await p.evaluate(() => PL.to == null && !PL.then)) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const lastN = n => p.evaluate(n => lines.slice(-n).map(l => l.text || '').join(' | '), n);
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return lastN(3); };
    const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${String(got).slice(0, 220)}"`); };
    const shot = async n => { if (out) await p.screenshot({ path: path.join(out, `len_${name}_${n}.png`) }); };
    const msg = () => p.evaluate(() => ($('msg') || {}).textContent || '');
    const V = () => p.evaluate(() => lNums(LEN().seed));
    const wide = async what => { const r = await p.evaluate(() => { const s = document.querySelector('#stageview svg.picsvg'), v = $('stageview'); if (!s || !v || v.hidden) return null; return [s.getBoundingClientRect().width, v.getBoundingClientRect().width, document.documentElement.scrollWidth > innerWidth + 1]; });
      ok(r && r[0] >= r[1] * .85 && !r[2], `${what}: the picture should fill the stage's width, with nothing spilling sideways: ${JSON.stringify(r)}`); };
    // a tap in a picture, at picture units (x, y) of the svg with this id
    const tapSvg = async (id, x, y) => { const pt = await p.evaluate(([id, x, y]) => { const s = $(id), q0 = s.createSVGPoint(); q0.x = x; q0.y = y; const q = q0.matrixTransform(s.getScreenCTM()); return [q.x, q.y]; }, [id, x, y]); await p.mouse.click(pt[0], pt[1]); await p.waitForTimeout(150); };
    const answer = async (n2) => { await p.fill('#ans', String(Math.floor(n2 / 2))); const on = await p.evaluate(() => $('half').getAttribute('aria-pressed') === 'true'); if (on !== (n2 % 2 === 1)) await p.click('#half'); await p.click('#try'); await p.waitForTimeout(200); };
    // the picture tells the truth: the thing's ends, in picture units, are exactly its length apart
    const truthful = async (len, mm, what) => { const r = await p.evaluate(() => { const s = $('lsvg'); if (!s) return null; const g = s.querySelector('g[transform]'), bb = g.getBBox(); return [bb.x, bb.x + bb.width]; });
      ok(r && Math.abs((r[1] - r[0]) - (len / 2 * LU_ + mm * LU_ / 10)) < 2.5, `${what}: the picture should be ${len / 2} cm${mm ? ' and ' + mm + ' mm' : ''} long: ${JSON.stringify(r)}`); };
    const LU_ = await p.evaluate(() => LU);

    // ---- landing, and the arrival screens
    /* landing from Galaxy Metrica. On the first screen, with reading cards on, as the Xylophora test does: the arrival screens follow the reading cards */
    if (name === 'sideways') await p.evaluate(() => { READ.on = true; skipIntro(); readOk(true); goSpace(); readOk(true); S.at = 'metrica'; SP.to = null; save(); });
    else await p.evaluate(() => { goSpace(); S.at = 'metrica'; SP.to = null; save(); });
    await p.fill('#cmd', 'land lengthar'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(400);
    if (name === 'sideways') { ok(await p.evaluate(() => widget && widget.kind === 'lintro'), 'the arrival screens should show first'); await shot('0_arrival');
      for (let i = 0; i < 3; i++) { ok(await p.evaluate(() => $('next').disabled), `arrival screen ${i + 1}: Next waits`); await p.waitForTimeout(5200); await p.click('#next'); await p.waitForTimeout(250); }
      ok(await p.evaluate(() => S.mode === 'len' && LEN().intro === 1), 'after the arrival screens, the cadet is on the strip');
      await p.evaluate(() => { READ.on = false; readOk(true); if (widget) closeToy(); }); await p.waitForTimeout(200); }      /* the rest is played with reading cards off, as the other play tests are */
    ok(await p.evaluate(() => S.mode === 'len' && LEN().sc === 'strip'), 'on the Landing Strip'); await shot('1_strip');
    expect(await say('hint'), /Talk to the Measuronian/, 'first hint');
    // ---- the Workshop sends you back for the example
    await say('go east'); expect(await say('use rod'), /shown you how we measure\? Go back west first/, 'the rod waits for the finished example');
    await say('go west'); await say('talk measuronian'); ok(await p.evaluate(() => widget && widget.kind === 'lex'), 'the finished example opens'); await wide('the example');
    { const v = await V(); await truthful(v.ex, 0, 'the example peg'); } await shot('2_example');
    for (let i = 0; i < 3; i++) { await p.click('#next'); await p.waitForTimeout(150); }
    ok(await p.evaluate(() => LEN().done.ex && !widget), 'the example is done');
    // ---- the rod
    await say('go east'); await say('use rod'); ok(await p.evaluate(() => !!$('go')), 'the rope example comes first'); await shot('3_rope'); await p.click('#go'); await p.waitForTimeout(150); await wide('the rod');
    const rodX = f => 100 + f * 800;
    await tapSvg('lrod', rodX(.3), 200); await p.click('#try'); expect(await msg(), /same length/, 'a half in the wrong place');
    await tapSvg('lrod', rodX(.5), 200); await p.click('#try'); await p.waitForTimeout(150);
    for (const m of (await V()).rodOrder) { await tapSvg('lrod', rodX(m === '1/4' ? .25 : .75), 200); await p.click('#try'); await p.waitForTimeout(150); }
    await tapSvg('lrod', rodX(.75), 200); await p.click('#try'); expect(await msg(), /Count the quarters/, '2/4 in the wrong place');
    await tapSvg('lrod', rodX(.5), 200); await p.click('#try'); await p.waitForTimeout(150); expect(await lastN(2), /2\/4 = ½/, '2/4 lands on ½');
    await tapSvg('lrod', rodX(1), 200); await p.click('#try'); await p.waitForTimeout(150); await shot('4_rod');
    await p.click('[data-c="1/4"]'); expect(await msg(), /Which part is longer/, 'a quarter is not longer'); await p.click('[data-c="3/4"]'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => LEN().done.rod && !widget), 'the rod is mended'); expect(await lastN(2), /You earn a card/, 'a card for the rod');
    // ---- the Long Hall
    await say('go east'); await say('use bench'); await wide('the Long Hall');
    for (let i = 0; i < 8; i++) { const v = await V(), len = v.L[i], mm = v.off[i];
      ok(await p.evaluate(i => widget && widget.kind === 'lhall' && LEN().i === i, i), `thing ${i + 1} is the one shown`); await truthful(len, mm, `thing ${i + 1}`);
      if (i === 0) { await answer(len); expect(await msg(), /Slide your ruler first|slide your ruler/, 'a reading before the ruler is slid'); await shot('5_measure'); }
      await tapSvg('lsvg', 100, 300); ok(await p.evaluate(() => widget.off === 0), `thing ${i + 1}: a tap at the start slides the ruler's 0 there`);
      if (i === 0 || i === 4) { await answer(len + 1); expect(await msg(), i === 4 ? /not exactly on a mark/ : /half mark|Close/, `thing ${i + 1}: half a centimetre out`); }
      if (i === 0) await shot('6_aligned');
      await answer(len); await p.waitForTimeout(150);
      if (i === 2) { await p.click('#leave'); await p.waitForTimeout(200); await p.reload(); await p.waitForTimeout(800);
        ok(await p.evaluate(() => S.mode === 'len' && LEN().sc === 'hall' && LEN().i === 3 && LEN().meas.length === 3), 'after closing the game, three things are still measured'); await say('use bench'); } }
    ok(await p.evaluate(() => LEN().done.hall && !widget), 'eight things measured'); expect(await lastN(2), /Eight true lengths/, 'the hall is done');
    // ---- the Matrix
    await say('go east'); await say('use matrix'); await wide('the Matrix'); await shot('7_matrix');
    { const v = await V(), X = k => 80 + k * 110;
      await tapSvg('lplot', X(1), 250); await p.click('#try'); expect(await msg(), /The line has 1 X\. You measured 8 things/, 'one X is not eight');
      await p.click('#undo'); await p.waitForTimeout(150); ok(await p.evaluate(() => LEN().plot.reduce((a, b) => a + b, 0) === 0), 'Take away the last X takes it away');
      for (let j = 0; j < 3; j++) await tapSvg('lplot', X(3), 200); ok(await p.evaluate(() => LEN().plot[3] === 3), 'three taps on the same spot make three Xs'); for (let j = 0; j < 3; j++) await p.click('#undo'); await p.waitForTimeout(150);
      for (let k = 0; k < 7; k++) { const n = v.L.filter(x => x === v.w0 - 1 + k).length; for (let j = 0; j < n; j++) await tapSvg('lplot', X(k), 200); }
      await shot('8_plot'); await p.click('#try'); await p.waitForTimeout(200); ok(await p.evaluate(() => LEN().plotOk === true), 'the plot is right');
      if (v.q.kind === 'most') { await answer(v.q.ans === v.w0 ? v.w0 + 1 : v.w0); expect(await msg(), /tallest stack/, 'a wrong "most common"'); await answer(v.q.ans); }
      else { await p.fill('#ans', String(v.q.ans === 8 ? 7 : v.q.ans + 1 > 8 ? v.q.ans - 1 : v.q.ans + 1)); await p.click('#try'); expect(await msg(), /Count only those/, 'a wrong count'); await p.fill('#ans', String(v.q.ans)); await p.click('#try'); }
      await p.waitForTimeout(300); ok(await p.evaluate(() => LEN().done.plot && !widget), 'the Matrix is fed'); }
    // ---- the Rift
    await say('go east'); await shot('9_rift'); await say('talk guardian');
    for (let i = 0; i < 3; i++) { const v = await V(); await truthful(v.G[i], 0, `crystal ${i + 1}`); await tapSvg('lsvg', 100, 300); await answer(v.G[i]); await p.waitForTimeout(150);
      if (i === 0) { await shot('10_judge'); await p.click(`[data-j="${v.tr[0] ? 0 : 1}"]`); expect(await msg(), /Are they the same/, 'a wrong judgement'); }
      await p.click(`[data-j="${v.tr[i] ? 1 : 0}"]`); await p.waitForTimeout(300); }
    ok(await p.evaluate(() => LEN().done.guard && S.inv.includes('tape') && S.inv.includes('sruler') && S.cards.some(c => c.r === 'gold')), 'the Guardian is gone; the ship\'s ruler, a measuring tape and an epic card'); await shot('11_done');
    ok(await p.evaluate(() => { const el = $('mission'); return !!el && /4 of 4/.test(lMissionHtml()); }), 'the mission panel says 4 of 4');
    expect(await say('hint'), /fly on/, 'the last hint');
    // ---- fly away; the report home is offered in space
    await say('go west'); await say('go west'); await say('go west'); await say('go west'); await say('fly'); await p.waitForTimeout(1400);
    ok(await p.evaluate(() => S.mode === 'space' && widget && widget.kind === 'home'), 'in space, the report home is offered'); await shot('12_report');
    await ctx.close();
  }
  await b.close();
  for (const e of errs) console.log('  PAGE ERROR', e);
  for (const t of bad) console.log('  PROBLEM', t);
  console.log(bad.length || errs.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad.length || errs.length ? 1 : 0);
})();
