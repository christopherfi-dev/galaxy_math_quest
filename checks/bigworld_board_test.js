// The loading board's first use: the rules, then the baker's example only for a child who has not heard it.   [Marc, 25 November, through the story thread:
// the baker's 24 loaves played a second time at the board for a child who had already talked to the baker. "It's not needed."]
// Page: prototypes/big_world.html (or a page named on the command line).
//
// Two children, on an iPad held sideways, each in a fresh game, each already told the job by the harbour keeper:
//   A  talks to the baker first (his 5 pages), then uses the board: the rules only (no "24 loaves"), then the board opens.
//   B  uses the board without meeting the baker: the rules, then the baker's example (10 pages in all), then the board opens.
// And the keeper's plain words about the board, not "the Year Machine's hand" [the story thread, 25 November].
// Run:  node checks/bigworld_board_test.js [page.html]     (about 20 seconds)
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'));
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 1180, height: 745 } }), p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const readAll = async () => { const out = []; for (let i = 0; i < 40; i++) { const r = await p.evaluate(() => window.__bw.READ.q.length ? window.__bw.READ.q[window.__bw.READ.i] : null); if (r === null) break; out.push(r); await p.click('#readok'); await p.waitForTimeout(40); } return out; };
  const type = async t => { await p.fill('#cmd', t); await p.click('#go'); await p.waitForTimeout(100); await p.waitForFunction(() => window.__bw.idle() || window.__bw.READ.q.length > 0, null, { timeout: 20000 }); await p.waitForTimeout(100); return readAll(); };
  const fresh = async () => { await p.goto(URL + '?seed=9&fastread=1'); await p.evaluate(() => localStorage.clear()); await p.goto(URL + '?seed=9&fastread=1'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    await p.evaluate(() => setFlag('lessonDone')); await readAll();      /* the opening story, read through, as a child must (the first lesson is the play test's) */
    await p.evaluate(() => { setFlag('metElder'); S.gates.bridge = 1;
      const t = TH.harbour; P.route = []; P.px = t.stand[0]; P.py = t.stand[1]; cam.x = P.px + .5; cam.y = P.py + .5; see(); ACT.harbour(t); });
    await readAll(); const keeper = await type('talk keeper'); return keeper; };
  // the keeper's words
  const k = await fresh();
  say(k.some(x => /The board only showed them/.test(x)) && !k.some(x => /Year Machine's hand/.test(x)), `the keeper's words about the board: ${k.join(' / ')}`);
  say(k.some(x => /board that showed every load/.test(x)) && !k.some(x => /worked out every load/.test(x)), `the keeper says the board worked out the loads, then that it did not: ${k.join(' / ')}`);
  // A: the baker first
  const baker = await type('talk baker'); say(baker.some(x => /24 loaves/.test(x)) && await p.evaluate(() => S.flags.sawBaker === 1), `A: the baker did not tell his example: ${baker.join(' / ')}`);
  const a = await type('use board'), ta = await p.evaluate(() => window.__bw.task() && window.__bw.task().kind);
  say(a.some(x => /Rule one/.test(x)) && !a.some(x => /24 loaves/.test(x)) && ta === 'fleet', `A: after the baker, the board should give the rules only, then open (${a.length} pages; task ${ta}): ${a.join(' / ').slice(0, 300)}`);
  // B: no baker
  await fresh();
  const bb = await type('use board'), tb = await p.evaluate(() => window.__bw.task() && window.__bw.task().kind);
  say(bb.length === 10 && /Rule one/.test(bb[1]) && /24 loaves/.test(bb[5]) && tb === 'fleet', `B: without the baker, the board should give the rules, then his example, then open (${bb.length} pages; task ${tb})`);
  say(!errs.length, `errors on the page: ${errs.join(' | ')}`);
  await b.close();
  console.log(bad.length ? `\nFAILED (${bad.length})` : `\nok: the baker's example plays once only (A: ${a.length} pages at the board after the baker; B: ${bb.length} pages without him), and the keeper says plainly that the board only showed the loads`);
  process.exit(bad.length ? 1 : 0); })();
