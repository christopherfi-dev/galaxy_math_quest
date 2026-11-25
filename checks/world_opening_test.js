// The big world's start in the sample (prototypes/world_opening_kit.js), played as a child would.   [Proposal, 24 November 2026]
// [Source: Marc, 24 November: "Can you add a skip intro?" and "we should show the ship on the meadow and then a character standing next to them"]
// Note: proposals/GMQ_Cast_In_Game_v1_2026-11-24.md, section 3c.
//
// Why it exists: checks/bigworld_play_test.js (the big world thread's) expects the practice machine straight after the story:
// "no lesson at the ship after the story". With the new start, a Mender's welcome on the meadow comes first, so that one check fails there,
// by design; everything after it passes. This test checks the new start instead, on three screens:
//   1  six story pages, no sums; the first five over space, the sixth over the meadow (the place name says so)
//   2  the welcome: two pages from "A Mender", no task open, the walking map behind, the Mender drawn beside the ship
//   3  then the practice machine, with "We use machines like this one…", and the Mender shows 3 making 5
//   4  a first time on this iPad: no "Skip the start"; the cadet cannot walk away during the welcome
//   5  an iPad that has finished the start before: "Skip the start" shows, small, inside the card; a tap skips the story, the welcome and the lesson,
//      the Mender's last line says where to go, the skip is in the mission report, and the cadet can walk
//   6  #skip at the end of the address shows it on a first time too (for the teacher)
//   7  the card still fits the screen, and nothing asks the network
//   8  "shows" means a child can see it (not only the button's hidden setting); after the start it never shows again, and a late tap does nothing
//      [added 25 November: the button had been seen on every card]
// Run:  node checks/world_opening_test.js [page]      (default: prototypes/world_look_sample.html)
const { chromium } = require('playwright'); const path = require('path');
const FILE = process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'world_look_sample.html'), URL = 'file://' + path.resolve(FILE);
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['iPad sideways', 1180, 745], ['iPad upright', 820, 1180], ['phone', 390, 760]]) {
    console.log('--- ' + name);
    // a first time on this iPad
    let ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
    p.on('request', r => { if (!/^file:|^data:|fonts\.(googleapis|gstatic)\.com/.test(r.url())) errs.push('asked the network: ' + r.url()); });
    await p.goto(URL + '?seed=11&fastread=1'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    const st = () => p.evaluate(() => ({ reading: reading(), i: READ.i, n: READ.q.length, who: READ.who, page: READ.q[READ.i] || '', pic: PIC && PIC.title, place: document.getElementById('place').textContent, task: TASK && TASK.kind, skip: (e => e.offsetWidth > 0 && getComputedStyle(e).display !== 'none')(document.getElementById('readskip')), greeting: OPENING.greeting }));
    const ok = async () => { await p.click('#readok'); await p.waitForTimeout(120); };
    let s = await st(); say(s.reading && s.n === 6 && s.who === 'Mission', `${name}: the story does not start with 6 pages`); say(!s.skip, `${name}: Skip the start shows on a first time`);
    const pages = []; for (let i = 0; i < 5; i++) { pages.push((await st()).page); s = await st(); say(s.pic === 'Galaxy Patternox', `${name}: story page ${i + 1} is not over space`); await ok(); }
    s = await st(); pages.push(s.page); say(s.i === 5 && /green meadow/.test(s.page) && s.place === 'Mender Meadow', `${name}: the last story page does not show the meadow (${s.place})`);
    say(!pages.some(t => /\d\s*[×+−÷]\s*\d/.test(t)), `${name}: there is a sum in the story`);
    await ok(); s = await st();
    say(s.reading && s.who === 'A Mender' && /^Welcome to Planet Algora/.test(s.page) && !s.task && !s.pic && s.greeting, `${name}: the welcome is not on the meadow: ${JSON.stringify(s)}`);
    say(!(await p.evaluate(() => { command('go north'); return P.route.length > 0; })), `${name}: the cadet could walk away during the welcome`);
    const card = await p.evaluate(() => { const r = document.getElementById('read').getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom, innerWidth, innerHeight]; });
    say(card[0] >= 0 && card[1] >= 0 && card[2] <= card[4] + 1 && card[3] <= card[5] + 1, `${name}: the welcome's card is off the screen: ${card}`);
    await ok(); s = await st(); say(/^Before you go anywhere/.test(s.page) && !s.task, `${name}: the second welcome page is wrong: ${s.page}`);
    await ok(); s = await st(); say(s.task === 'lesson' && s.pic === 'The practice machine' && /^We use machines like this one/.test(s.page), `${name}: the practice machine does not follow the welcome: ${JSON.stringify(s)}`);
    await ok(); await p.waitForFunction(() => window.__bw.S().lesson && window.__bw.S().lesson.step === 1, null, { timeout: 15000 }).catch(() => say(false, `${name}: the Mender did not run the practice machine`));
    s = await st(); say(/put in 3\. Out came 5/.test(s.page), `${name}: the Mender did not show 3 making 5: ${s.page}`);
    if (errs.length) say(false, `${name}: ${errs.join(' | ')}`); await ctx.close();
    // an iPad that has finished the start before
    ctx = await b.newContext({ viewport: { width: w, height: h } }); await ctx.addInitScript(() => { try { localStorage.setItem('gmq-bigworld-looksample-seenstart', '1'); } catch (e) {} });
    p = await ctx.newPage(); p.on('pageerror', e => say(false, `${name}: ${e.message}`)); await p.goto(URL + '?seed=12&fastread=1'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    const sk = await p.evaluate(() => { const r = document.getElementById('readskip').getBoundingClientRect(), c = document.getElementById('read').getBoundingClientRect(); return { shown: (e => e.offsetWidth > 0 && getComputedStyle(e).display !== 'none')(document.getElementById('readskip')), inside: r.left >= c.left && r.right <= c.right + 1 && r.top >= c.top, small: r.width < c.width * .6 }; });
    say(sk.shown && sk.inside && sk.small, `${name}: Skip the start does not show small inside the card: ${JSON.stringify(sk)}`);
    await p.click('#readskip'); await p.waitForTimeout(300);
    const after = await p.evaluate(() => ({ intro: S.intro, done: !!S.flags.lessonDone, page: READ.q[READ.i] || '', who: READ.who, task: !!TASK, report: (S.log || []).some(l => /Skipped the start/.test(l.what)) }));
    say(after.intro === 9 && after.done && !after.task && /Elder Thimble needs help/.test(after.page) && after.who === 'A Mender' && after.report, `${name}: the skip did not land the cadet ready to go: ${JSON.stringify(after)}`);
    say(!(await p.evaluate(() => (e => e.offsetWidth > 0 && getComputedStyle(e).display !== 'none')(document.getElementById('readskip')))), `${name}: Skip the start still shows on the card after the skip`);
    await p.click('#readok'); await p.waitForTimeout(150);
    say(await p.evaluate(() => { command('go north'); return P.route.length > 0 || reading(); }), `${name}: after the skip the cadet cannot walk`);
    const late = await p.evaluate(() => { tell(['A later card.'], null, 'Mission'); const v = (e => e.offsetWidth > 0 && getComputedStyle(e).display !== 'none')(document.getElementById('readskip')); const n = (S.log || []).length; OPENING.skip(); return { v, again: (S.log || []).length !== n, page: READ.q[READ.i] }; });
    say(!late.v && !late.again && late.page === 'A later card.', `${name}: Skip the start shows on a later card, or works there: ${JSON.stringify(late)}`);
    await ctx.close();
    // #skip: the teacher's way, on a first time
    ctx = await b.newContext({ viewport: { width: w, height: h } }); p = await ctx.newPage(); await p.goto(URL + '?seed=13&fastread=1#skip'); await p.waitForFunction(() => window.__bw && window.__bw.S());
    say(await p.evaluate(() => (e => e.offsetWidth > 0 && getComputedStyle(e).display !== 'none')(document.getElementById('readskip'))), `${name}: #skip does not show Skip the start`); await ctx.close();
  }
  console.log(bad.length ? `world_opening_test: ${bad.length} FAULT(S)` : 'world_opening_test: all pass: the story, then the welcome on the meadow, then the practice machine; Skip the start only once seen (or #skip), on three screens');
  await b.close(); process.exit(bad.length ? 1 : 0);
})();
