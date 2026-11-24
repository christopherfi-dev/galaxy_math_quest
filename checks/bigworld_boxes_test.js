// The big world's number boxes: a box that holds one try is empty after the try.   [Marc, 24 November, with a photo of the Orchard Machine:
// "After you try one stone, the number should vanish. The 2 stays there. I type 5, now it's 25."]
// Page: prototypes/big_world.html.
//
// On three screens, at a machine whose plate is burnt: tap 2, pull the lever, wait for the machine. The box is empty; the machine's own picture
// still shows what went in. Then tap 5: the box says 5, not 25. A second test with 5 runs as 5.
// And at the machine that shares [Marc, 24 November: "I've tried like 6 numbers. None work"]: three numbers it hands back, one after another, and the Mender
// by the machine names one it takes (never the rule); that number goes through. Once only.
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
    // the share machine: three hand-backs, then the Mender's number
    await p.click('#task [data-b="leave"]').catch(() => {}); await readAll();
    const sh = await p.evaluate(() => { const N = window.__bw.NUM(), site = Object.keys(N.at).find(k => N.at[k].op === 'share'), t = TH['m_' + site]; delete S.mach[site]; P.route = [];      /* a fresh machine: nothing tried yet */ P.px = t.stand[0]; P.py = t.stand[1]; cam.x = P.px + .5; cam.y = P.py + .5; see(); drawWords(); command('use machine'); return { site, n: N.at[site].n }; });
    await p.waitForTimeout(300); await readAll(); await p.waitForFunction(() => window.__bw.task() && window.__bw.task().kind === 'machine', null, { timeout: 8000 });
    const misses = [1, 5, 7, 11, 13, 17].filter(v => v % sh.n !== 0).slice(0, 3); let tip = null;
    for (const v of misses) { await tap('clr'); for (const d of String(v)) await tap(d); await p.click('#task [data-b="pull"]'); await p.waitForFunction(() => window.__bw.idle(), null, { timeout: 15000 }); await p.waitForTimeout(250);
      const r = await p.evaluate(() => window.__bw.READ.q.length ? window.__bw.READ.q.join(' ') : ''); if (r) { tip = r; await readAll(); } }
    const k = tip && +(/took (\d+)/.exec(tip) || [])[1];
    say(!!k, `${name}: after three hand-backs at the share machine (÷ ${sh.n}) nobody named a number: "${tip}"`); say(!tip || !/share|÷|divid|times|×/i.test(tip), `${name}: the Mender's words give the rule away: "${tip}"`);
    if (k) { say(k % sh.n === 0 && misses.indexOf(k) < 0, `${name}: the Mender named ${k}, which the machine does not take or was tried`); await tap('clr'); for (const d of String(k)) await tap(d); await p.click('#task [data-b="pull"]'); await p.waitForFunction(() => window.__bw.idle(), null, { timeout: 15000 }); await p.waitForTimeout(250); await readAll();
      const m3 = await p.evaluate(() => window.__bw.task().msg); say(new RegExp(k + ' went in').test(m3), `${name}: the Mender's number ${k} did not go through: "${m3}"`); }
    say(!errs.length, `${name}: errors: ${errs.join(' | ')}`);
    console.log(`  ${name}: after "2, pull" the box is "${after}"; then "5, pull": ${msg2}`);
    await ctx.close(); }
  await b.close();
  console.log(bad.length ? `\nFAILED (${bad.length})` : '\nok: on three screens a test empties the box, and the next number starts fresh; after three hand-backs a Mender names a number that goes through, and not the rule');
  process.exit(bad.length ? 1 : 0); })();
