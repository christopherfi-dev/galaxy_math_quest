// The big world's signposts, used as a child would use them.   [Second picture review, 23 November: a sign blocked the very way it named]
// Page: prototypes/big_world.html.
//
// At every signpost, on three screens (iPad sideways, iPad upright, phone), in a fresh game:
//   - the cadet stands where a child stands to read it; "look sign" reads THIS sign (the nearest)
//   - for every "PLACE, direction" on it: "go <direction>" walks, and its first step is that way
//   - "go <place>" (the sign's own word, e.g. "go village") walks too, before the place has ever been on the screen
//   - no error on the page
// The cadet is put on the sign's standing square directly (this is a check of the signs, not of the walk there; the play test walks).
// Run:  node checks/bigworld_signs_test.js [page.html] [--shots folder]     (about 90 seconds)
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'));
const SHOTS = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
const STEP = { north: [0, -1], south: [0, 1], east: [1, 0], west: [-1, 0] };
(async () => {
  const b = await chromium.launch(); let n = 0;
  for (const [name, w, h] of [['sideways', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    const fresh = async () => { await p.goto(URL + '?seed=5&fastread=1'); await p.evaluate(() => localStorage.clear()); await p.goto(URL + '?seed=5&fastread=1'); await p.waitForFunction(() => window.__bw && window.__bw.S());
      for (let i = 0; i < 30; i++) { if (!(await p.evaluate(() => window.__bw.READ.q.length > 0))) break; await p.click('#readok'); await p.waitForTimeout(30); } };
    const put = (x, y) => p.evaluate(([x, y]) => { P.route = []; P.then = null; P.px = x; P.py = y; P.dir = 'down'; cam.x = x + .5; cam.y = y + .5; see(); drawWords(); }, [x, y]);
    const at = () => p.evaluate(() => [Math.round(P.px), Math.round(P.py)]);
    const type = async t => { await p.fill('#cmd', t); await p.click('#go'); await p.waitForTimeout(80); await p.waitForFunction(() => window.__bw.idle(), null, { timeout: 30000 }); await p.waitForTimeout(80);
      const out = []; for (let i = 0; i < 10; i++) { const r = await p.evaluate(() => window.__bw.READ.q.length > 0 ? window.__bw.READ.q[window.__bw.READ.i] : null); if (r === null) break; out.push(r); await p.click('#readok'); await p.waitForTimeout(30); }
      return out.join(' ') + ' ' + (await p.evaluate(() => document.getElementById('log') ? document.getElementById('log').innerText : '')); };
    const signs = await (async () => { await fresh(); return p.evaluate(() => THINGS.filter(t => t.kind === 'sign').map(t => ({ id: t.id, x: t.x, y: t.y, stand: t.stand, look: t.look }))); })();
    for (const sg of signs) {
      const parts = sg.look.replace(/^The sign says: /, '').split('.').map(s => s.trim()).filter(Boolean).map(s => ({ place: s.split(',')[0], dir: (/(north|south|east|west)/.exec(s) || [])[1] }));
      // read it
      await fresh(); await put(sg.stand[0], sg.stand[1]); await p.waitForTimeout(250);
      const read = await type('look sign'); say(read.indexOf(sg.look.replace(/^The sign says: /, '').split('.')[0]) >= 0, `${name}, ${sg.id}: "look sign" did not read this sign: ${read.slice(0, 120)}`);
      if (SHOTS) await p.screenshot({ path: path.join(SHOTS, `${name}_${sg.id}.png`) });
      for (const pt of parts) {
        // the direction
        await fresh(); await put(sg.stand[0], sg.stand[1]); await p.waitForTimeout(150);
        const route = await p.evaluate(d => { command('go ' + d); return P.route.slice(0, 1); }, pt.dir); await p.waitForFunction(() => window.__bw.idle(), null, { timeout: 30000 });
        const end = await at(), v = STEP[pt.dir]; n++;
        say(route.length === 1 && route[0][0] === sg.stand[0] + v[0] && route[0][1] === sg.stand[1] + v[1], `${name}, ${sg.id}: "go ${pt.dir}" (to ${pt.place}) did not step ${pt.dir} from the sign; it ended at ${end}`);
        // the place's own word
        const word = pt.place.split(' ').pop().toLowerCase();
        await fresh(); await put(sg.stand[0], sg.stand[1]); await p.waitForTimeout(150);
        const said = await type('go ' + word), end2 = await at(); n++;
        say(end2[0] !== sg.stand[0] || end2[1] !== sg.stand[1], `${name}, ${sg.id}: "go ${word}" did not walk: ${said.slice(-160)}`);
      }
    }
    say(!errs.length, `${name}: errors on the page: ${errs.join(' | ')}`);
    await ctx.close(); }
  await b.close();
  console.log(bad.length ? `\nFAILED (${bad.length} of ${n} walks and the reads)` : `\nok: at every signpost, on three screens, "look sign" reads it, and every direction and place word on it walks the way it says (${n} walks)`);
  process.exit(bad.length ? 1 : 0); })();
