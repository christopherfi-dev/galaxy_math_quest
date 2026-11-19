// The picture stays still.   [Source: Marc, 2026-11-19]
//
// Marc, watching his class: "We don't want the playing area to move up or down and move away from the screen.
// It keeps jumping around." "All of that stuff below the buttons, about the number of ship parts and all of that,
// is not needed on the main screen." "They don't need a keyboard. Unless it only appears when they type."
//
// So on an iPad the screen has two fixed parts: the picture, and a desk. This test plays through the moments
// that used to move things, on four iPad screens, a classroom board and a laptop, and checks after each one:
//   1. the picture is in exactly the same place, at exactly the same size
//   2. the page has not scrolled, and cannot scroll
//   3. nothing sits on the picture: not the number keys, not the letter keys, not the task
//   4. keys are on the screen only when a child is typing (the box was tapped) or a task asks for a number
//   5. the counts (secrets, parts, tasks, cards) are not on the main screen. They are under More, My ship.
//   6. a task opens on the desk in place of the box and the word rows. When it closes they are back where they were.
//   7. in a task, the question, the answer box, Check and the words after a wrong answer can all be seen
// A phone is too small for two fixed parts. It keeps the old layout, and the test checks a task still works there.
//
// Run:  node checks/still_picture_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), errs = [], bad = [], notes = [];
  const SCREENS = [['iPad sideways', 1180, 745, true], ['iPad mini sideways', 1133, 670, true], ['iPad upright', 820, 1100, true], ['iPad mini upright', 744, 1050, true], ['classroom board', 1920, 1080, false], ['laptop', 1366, 700, false]];
  for (const [name, w, h, touch] of SCREENS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(500);
    await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); }); await p.waitForTimeout(700);
    const look = () => p.evaluate(() => {
      const R = e => { if (!e || e.hidden) return null; const r = e.getBoundingClientRect(); return r.width && r.height ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null; };
      const hit = (a, c) => !!(a && c && a.l < c.r - 1 && c.l < a.r - 1 && a.t < c.b - 1 && c.t < a.b - 1), id = x => document.getElementById(x);
      const st = R(document.querySelector('.stage')), pad = R(id('pad')), kb = R(id('kb')), toy = R(id('toy')), side = R(id('side')), status = R(id('status'));
      const inToy = e => { const r = R(e); return !!(r && toy && r.t >= toy.t - 1 && r.b <= toy.b + 1 && !hit(r, pad)); };
      return { stage: st && [st.l, st.t, st.r - st.l, st.b - st.t].map(Math.round).join(','), scrollY: Math.round(window.scrollY), canScroll: document.documentElement.scrollHeight - window.innerHeight,
        pad: !!pad, kb: !!kb, padOnPic: hit(pad, st), kbOnPic: hit(kb, st), toyOnPic: hit(toy, st), toyOnDesk: !!(toy && side && toy.l >= side.l - 1 && toy.r <= side.r + 1 && toy.t >= side.t - 1 && toy.b <= side.b + 1),
        counts: !!(status && status.b > 0 && status.t < window.innerHeight), box: !!R(id('say')), verbs: (() => { const r = R(id('verbs')); return r ? [r.l, r.t].map(Math.round).join(',') : null; })(),
        q: inToy(document.querySelector('#toy .q')), ans: inToy(id('ans') || document.querySelector('#toy input')), btn: inToy(id('try')), msg: id('msg') && id('msg').textContent ? inToy(id('msg')) : null, kbOnBox: hit(kb, R(id('say'))) };
    });
    let first = null, verbs0 = null, n = 0;
    const step = async (label, want = {}) => { await p.waitForTimeout(320); const v = await look(); n++;
      if (!first) { first = v.stage; verbs0 = v.verbs; }
      const fail = t => bad.push(`${name}: ${label}: ${t}`);
      if (v.stage !== first) fail(`the picture moved or changed size: ${first} became ${v.stage}`);
      if (v.scrollY !== 0) fail(`the page scrolled by ${v.scrollY}`); if (v.canScroll > 2) fail(`the page can scroll by ${v.canScroll}`);
      if (v.padOnPic) fail('the number keys are on the picture'); if (v.kbOnPic) fail('the letter keys are on the picture'); if (v.toyOnPic) fail('the task is on the picture');
      if (v.counts !== !!want.counts) fail(want.counts ? 'the counts are not shown under My ship' : 'the counts are on the main screen');
      if (v.pad !== !!want.pad) fail(want.pad ? 'no number keys for a number task' : 'number keys on the screen with no number to type');
      if (touch && v.kb !== !!want.kb) fail(want.kb ? 'no letter keys after the box was tapped' : 'letter keys on the screen though nobody is typing');
      if (v.kb && v.kbOnBox) fail('the letter keys cover the box');
      if (want.task) { if (!v.toyOnDesk) fail('the task is not on the desk'); if (v.box) fail('the box and the word rows are still there beside the task'); if (!v.q && !want.noq) fail('the question cannot be seen'); if (want.pad && !v.ans) fail('the answer box cannot be seen'); if (want.pad && !v.btn) fail('Check cannot be seen'); if (want.msg && v.msg !== true) fail('the words after a wrong answer cannot be seen'); }
      else { if (!v.box) fail('the box is not on the screen'); if (v.verbs !== verbs0) fail(`the word rows moved: ${verbs0} became ${v.verbs}`); }
      if (out) await p.screenshot({ path: path.join(out, `still_${name.replace(/\W+/g, '_')}_${String(n).padStart(2, '0')}_${label.replace(/\W+/g, '_')}.png`) }); return v; };
    const tapOrClick = sel => touch ? p.tap(sel) : p.click(sel);
    const type = async v => { await p.fill('#ans', String(v)); await p.click('#try'); };
    const openGrid = () => p.evaluate(() => { widget = { kind: 'grid', hits: 0, need: 3, tries: 0, g: 5, e: 8, next: nextGrid }; nextGrid(); });

    await step('start');
    await tapOrClick('#verbs .word'); await step('a doing word tapped');
    await tapOrClick('#cmd'); await step('the box tapped', { kb: true });
    await p.fill('#cmd', 'look ship'); await p.press('#cmd', 'Enter'); await step('a command sent');
    await p.evaluate(() => menuOpen('ship')); await step('More, My ship', { counts: true });
    await p.evaluate(() => menuOpen(null)); await step('My ship closed');
    await openGrid(); await step('a task opens', { task: true, pad: true });
    await tapOrClick('#ans'); await step('the answer box tapped', { task: true, pad: true });
    await type(7); await step('a wrong answer', { task: true, pad: true, msg: true });
    await type(40); await step('a right answer, next step', { task: true, pad: true });
    await type(10); await step('step 3', { task: true, pad: true });
    await type(8); await step('step 3, the other reading', { task: true, pad: true, msg: true });
    await p.click('#leave'); await step('the task left');
    // a task with no number to type: no keys at all
    await p.evaluate(() => startSpecies()); await step('a tapping task', { task: true });
    await p.click('#leave'); await step('the tapping task left');
    // the other kinds of place keep the same picture and the same desk
    await p.evaluate(() => goSpace()); await p.waitForTimeout(500); verbs0 = (await look()).verbs; await step('in space');
    await p.evaluate(() => goVoltara()); await p.waitForTimeout(500); verbs0 = (await look()).verbs; await step('on Voltara');
    await p.evaluate(() => startStones()); await step('a Voltara tapping task', { task: true });
    await p.click('#leave'); await step('the Voltara tapping task left');
    await p.evaluate(() => startShort()); await step('a Voltara number task', { task: true, pad: true });
    await p.click('#leave'); await step('the Voltara task left');
    await p.evaluate(() => goChronosia()); await p.waitForTimeout(500); verbs0 = (await look()).verbs; await step('on Chronosia');
    await p.evaluate(() => startBook(1)); await step('the Council book open', { task: true });
    await p.click('#leave'); await step('the book closed');
    // Planet Xylophora: walking with the camera, the survey post (a number), marking a floor, the order board
    await p.evaluate(() => goXylophora()); await p.waitForTimeout(600); verbs0 = (await look()).verbs; await step('on Xylophora');
    await p.evaluate(() => { xGo(10, 14); }); await p.waitForTimeout(3200); verbs0 = (await look()).verbs; await step('walking on Xylophora');
    await p.evaluate(() => { XY().saw.skin = 1; act('use post'); }); await p.waitForTimeout(2200); await step('the survey post', { task: true, pad: true });
    await p.click('#leave'); await p.waitForTimeout(200); verbs0 = (await look()).verbs; await step('the post left');
    await p.evaluate(() => { act('use board'); }); await p.waitForTimeout(1500); await step('the order board', { task: true, noq: true });      /* a board to read, with no question on it */
    await p.click('#leave'); await p.waitForTimeout(200); await p.evaluate(() => { XY().done.skin = true; act('build home'); }); await p.waitForTimeout(2600); verbs0 = (await look()).verbs; await step('marking a floor');
    notes.push(`${name}: ${n} moments, picture at ${first}`);
    await ctx.close();
  }
  // a phone keeps the old layout: a task opens under the picture, and its answer box and Check are on the screen
  { const ctx = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 1, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => errs.push('phone: ' + e.message));
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); } catch (e) {} }); await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(500);
    await p.evaluate(() => { if (S.mode === 'intro') skipIntro(); }); await p.waitForTimeout(600);
    await p.evaluate(() => { widget = { kind: 'grid', hits: 0, need: 3, tries: 0, g: 5, e: 8, next: nextGrid }; nextGrid(); }); await p.waitForTimeout(300); await p.tap('#ans'); await p.waitForTimeout(300);
    const v = await p.evaluate(() => { const t = document.getElementById('toy'), vis = e => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= window.innerHeight; }; return { inConsole: !!t.closest('.console'), desk: document.body.classList.contains('desk'), ans: vis(document.getElementById('ans')), btn: vis(document.getElementById('try')), counts: (() => { const r = document.getElementById('status').getBoundingClientRect(); return r.height > 0; })() }; });
    if (!v.inConsole || v.desk) bad.push('phone: the phone should keep the old layout'); if (!v.ans || !v.btn) bad.push('phone: the answer box or Check is off the screen'); if (v.counts) bad.push('phone: the counts are on the main screen');
    await p.fill('#ans', '40'); await p.click('#try'); await p.waitForTimeout(200); if (!(await p.evaluate(() => widget && widget.hits === 1))) bad.push('phone: a right answer did not count');
    notes.push('phone: old layout, a task works'); await ctx.close(); }
  await b.close();
  notes.forEach(x => console.log(x));
  if (bad.length) { console.log('\nFAILED:'); bad.forEach(x => console.log('  ' + x)); }
  console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  console.log(bad.length || errs.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad.length || errs.length ? 1 : 0);
})();
