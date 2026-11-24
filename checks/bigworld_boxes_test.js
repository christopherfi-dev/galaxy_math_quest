// The big world's number boxes: a box that holds one try is empty after the try.   [Marc, 24 November, with a photo of the Orchard Machine:
// "After you try one stone, the number should vanish. The 2 stays there. I type 5, now it's 25."]
// Page: prototypes/big_world.html.
//
// On three screens, at a machine whose plate is burnt: tap 2, pull the lever, wait for the machine. The box is empty; the machine's own picture
// still shows what went in. Then tap 5: the box says 5, not 25. A second test with 5 runs as 5.
// Run:  node checks/bigworld_boxes_test.js
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'));
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['iPad sideways', 1180, 745], ['iPad upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(URL + '?seed=4&fastread=1'); await p.evaluate(() => localStorage.clear()); await p.goto(URL + '?seed=4&fastread=1'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    const readAll = async () => { for (let i = 0; i < 30; i++) { if (!(await p.evaluate(() => window.__bw.READ.q.length > 0))) return; await p.click('#readok'); await p.waitForTimeout(60); } };
    await readAll();
    // stand at the Pond Machine, with the elder met, and open it
    await p.evaluate(() => { setFlag('metElder'); if (S.bag.indexOf('notebook') < 0) S.bag.push('notebook'); const t = TH.m_pond; P.route = []; P.px = t.stand[0]; P.py = t.stand[1]; cam.x = P.px + .5; cam.y = P.py + .5; see(); drawWords(); command('use machine'); });
    await p.waitForTimeout(300); await readAll(); await p.waitForFunction(() => window.__bw.task() && window.__bw.task().kind === 'machine', null, { timeout: 8000 });
    const box = () => p.evaluate(() => { const e = document.querySelector('#task [data-box="in"]'); return e ? e.textContent : null; });
    const tap = async k => { await p.click(`#pad [data-k="${k}"]`); await p.waitForTimeout(40); };
    await tap('clr'); await tap('2'); say(await box() === '2', `${name}: tapping 2 did not show 2`);
    await p.click('#task [data-b="pull"]'); await p.waitForFunction(() => window.__bw.idle(), null, { timeout: 15000 }); await p.waitForTimeout(200); await readAll();
    const after = await box(), msg = await p.evaluate(() => window.__bw.task().msg);
    say(after === '', `${name}: after the test the box still says "${after}"`); say(/\b2\b/.test(msg), `${name}: the message no longer says what went in: "${msg}"`);
    await tap('5'); say(await box() === '5', `${name}: after the test, tapping 5 gave "${await box()}" (it should be 5)`);
    await p.click('#task [data-b="pull"]'); await p.waitForFunction(() => window.__bw.idle(), null, { timeout: 15000 }); await p.waitForTimeout(200); await readAll();
    const msg2 = await p.evaluate(() => window.__bw.task().msg); say(/\b5\b/.test(msg2) && !/\b25\b/.test(msg2), `${name}: the second test did not run with 5: "${msg2}"`);
    say(!errs.length, `${name}: errors: ${errs.join(' | ')}`);
    console.log(`  ${name}: after "2, pull" the box is "${after}"; then "5, pull": ${msg2}`);
    await ctx.close(); }
  await b.close();
  console.log(bad.length ? `\nFAILED (${bad.length})` : '\nok: on three screens a test empties the box, and the next number starts fresh');
  process.exit(bad.length ? 1 : 0); })();
