// Hold to keep walking, in the big world sample (prototypes/world_walk_kit.js).   [Proposal, 25 November 2026]
// [Source: Marc, 25 November: "I can only tap to the edge of the screen so he walks like four steps then I need to tap again and tap again."]
// On a phone and an iPad held sideways:
//   1  a quick tap still walks to the square tapped, and stops there
//   2  a finger held to the right keeps the cadet walking right, well past the edge of the first screen
//   3  when the finger lifts, he stops (he does not walk on)
//   4  sliding the held finger steers him (down, then he goes down)
//   5  holding while words wait to be read does nothing
// Run:  node checks/world_walk_test.js [page]      (default: prototypes/world_look_sample.html)
const { chromium } = require('playwright'); const path = require('path');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'world_look_sample.html'), URL = 'file://' + path.resolve(FILE);
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['phone', 390, 760], ['iPad sideways', 1180, 745]]) {
    console.log('--- ' + name);
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(); p.on('pageerror', e => say(false, `${name}: ${e.message}`));
    await p.goto(URL + '?seed=21&fastread=1#skip'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    await p.click('#readskip'); await p.waitForTimeout(200); await p.click('#readok'); await p.waitForTimeout(200);
    const pos = () => p.evaluate(() => ({ x: P.px, y: P.py, route: P.route.length, reading: reading() }));
    const scr = (dx, dy) => p.evaluate(([dx, dy]) => { geo(); const r = cv.getBoundingClientRect(); return [r.left + (P.px + .5 + dx - V.ox) * V.ts, r.top + (P.py + .5 + dy - V.oy) * V.ts]; }, [dx, dy]);
    const idle = () => p.waitForFunction(() => !P.route.length, null, { timeout: 10000 }).catch(() => {});
    let a = await pos();
    // 1. a quick tap, 2 squares to the right
    let [x, y] = await scr(2, 0); await p.mouse.click(x, y); await p.waitForTimeout(100); await idle(); let c = await pos();
    say(Math.abs(c.x - a.x - 2) < .01 && Math.abs(c.y - a.y) < .01, `${name}: a quick tap did not walk 2 squares right: ${JSON.stringify([a, c])}`);
    // 2. hold to the right for 2.5 seconds
    a = await pos(); [x, y] = await scr(3, 0); await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(2500);
    c = await pos(); const cols = await p.evaluate(() => { geo(); return V.cols; });
    say(c.x - a.x > cols / 2 + 2, `${name}: holding did not keep him walking past the first screen's edge (${(c.x - a.x).toFixed(1)} squares, screen half ${(cols / 2).toFixed(1)})`);
    // 4. slide the finger down, still held: he turns down
    const y0 = c.y; [x, y] = await scr(0, 3); await p.mouse.move(x, y, { steps: 4 }); await p.waitForTimeout(900); c = await pos();
    say(c.y - y0 > 1.5, `${name}: sliding the held finger down did not steer him down (${(c.y - y0).toFixed(1)})`);
    // 3. lift: he stops
    await p.mouse.up(); await p.waitForTimeout(400); const s1 = await pos(); await p.waitForTimeout(800); const s2 = await pos();
    say(s1.x === s2.x && s1.y === s2.y && !s2.route, `${name}: he walked on after the finger lifted: ${JSON.stringify([s1, s2])}`);
    // 5. holding while words wait does nothing
    await p.evaluate(() => tell(['A test card.'], null, 'Mission')); a = await pos(); [x, y] = await scr(3, 0); await p.mouse.move(x, y); await p.mouse.down(); await p.waitForTimeout(800); await p.mouse.up(); c = await pos();
    say(c.x === a.x && c.y === a.y, `${name}: holding moved him while words waited to be read`);
    await ctx.close();
  }
  console.log(bad.length ? `world_walk_test: ${bad.length} FAULT(S)` : 'world_walk_test: all pass: a tap walks as before; holding keeps him walking past the screen\'s edge, steers with the finger, and stops when it lifts; on a phone and an iPad');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
