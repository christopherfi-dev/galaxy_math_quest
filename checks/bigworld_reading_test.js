// The big world's reading card: in the middle of the screen, higher up; OK sleeps as long as in the main game (up to 3.5 seconds).   [Marc, 24 November:
// "The students don't realize they need to read the text boxes. They must be in the middle of the screen higher up. And they must have that 4-5 second
//  timer that the main game has. To force them to read and not just click click click"]
// Page: prototypes/big_world.html (the real wait: no fastread here).
//
// On three screens (iPad sideways, iPad upright, phone), with touch, in a fresh game:
//   1  the first story card: in the middle of the screen (left to right), its top in the upper 30%, all on the screen; the rest of the screen dimmed
//   2  OK sleeps ("Read…") for the main game's time: half a second and 0.16 seconds a word, at most 3.5 seconds; then says Next or OK
//   3  while it sleeps: a tap on the dimmed picture shakes the card and does nothing else; Enter does nothing; "Read to me" can be tapped
//   4  Next brings the next page, asleep again; the last OK takes the card and the dimming away
//   5  while the picture is moving (as when the fleet sails), new words wait, and come when it stops
//   6  at a finished example (Elder Rivet's painted board), the words do not hide what they explain: on an iPad the board is drawn below the card;
//      on a phone the card sits just below the picture. The screen over the board is not dimmed.   [Marc, 24 November: "They keep trying to touch the board."]
// Run:  node checks/bigworld_reading_test.js     (about a minute)
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'));
const bad = [], say = (ok, what) => { if (!ok) { bad.push(what); console.log('  FAULT: ' + what); } };
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of [['iPad sideways', 1180, 745], ['iPad upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    await p.goto(URL + '?seed=3'); await p.evaluate(() => localStorage.clear()); await p.goto(URL + '?seed=3'); await p.waitForFunction(() => window.__bw && window.__bw.READ.q.length > 0);
    const t0 = Date.now();
    const st = () => p.evaluate(() => { const r = document.getElementById('read').getBoundingClientRect(), v = document.getElementById('veil'), vr = v ? v.getBoundingClientRect() : null, ok = document.getElementById('readok');
      return { card: [r.left, r.top, r.right, r.bottom], shown: !document.getElementById('read').hidden, veil: !!v && !v.hidden && vr.width >= innerWidth - 1 && vr.height >= innerHeight - 1, asleep: ok.disabled, lab: (document.getElementById('readlab') || ok).textContent,
        i: window.__bw.READ.i, n: window.__bw.READ.q.length, page: window.__bw.READ.q[window.__bw.READ.i] || '', nudge: document.getElementById('read').classList.contains('nudge'), say: !document.getElementById('readsay').disabled }; });
    // 1. where it is
    let s = await st(); const cx = (s.card[0] + s.card[2]) / 2;
    say(s.shown && s.veil, `${name}: the first card is not shown over a dimmed screen`);
    say(Math.abs(cx - w / 2) <= 3, `${name}: the card is not in the middle of the screen (its middle is at ${Math.round(cx)}, the screen's at ${w / 2})`);
    say(s.card[1] >= 0 && s.card[1] <= h * .3, `${name}: the card's top is at ${Math.round(s.card[1])}px, not in the upper 30% of the screen`);
    say(s.card[0] >= 0 && s.card[2] <= w && s.card[3] <= h, `${name}: the card is not all on the screen`);
    // 2 and 3. asleep, and what a tap does meanwhile
    say(s.asleep && /Read/.test(s.lab), `${name}: OK is awake at once ("${s.lab}")`); say(s.say, `${name}: "Read to me" cannot be tapped while OK sleeps`);
    await p.touchscreen.tap(Math.min(60, w / 4), h - 30); await p.waitForTimeout(60); s = await st();
    say(s.nudge && s.i === 0 && s.shown, `${name}: a tap on the dimmed screen did not just shake the card`);
    await p.keyboard.press('Enter'); await p.waitForTimeout(60); s = await st(); say(s.i === 0, `${name}: Enter moved on while OK slept`);
    const words = s.page.trim().split(/\s+/).length, want = Math.min(3500, 500 + words * 160);      /* the main game's readPage */
    await p.waitForFunction(() => !document.getElementById('readok').disabled, null, { timeout: 8000 }); const woke = Date.now() - t0;
    say(woke >= 1000 && woke <= 3900 && Math.abs(woke - want) <= 450, `${name}: OK woke after ${woke} ms for ${words} words (it should be about ${Math.round(want)})`);
    s = await st(); say(/Next|OK/.test(s.lab), `${name}: awake, the button says "${s.lab}"`);
    // 4. Next: asleep again; then read the rest, the way a child must
    await p.locator('#readok').tap(); await p.waitForTimeout(80); s = await st(); say(s.i === 1 && s.asleep, `${name}: Next did not bring page 2 with OK asleep again`);
    for (let k = 0; k < 12; k++) { s = await st(); if (!s.shown) break; await p.waitForFunction(() => !document.getElementById('readok').disabled, null, { timeout: 8000 }); await p.locator('#readok').tap(); await p.waitForTimeout(120); }
    s = await st(); say(!s.shown && !s.veil, `${name}: after the last OK the card or the dimming stays`);
    // 5. a moving picture holds new words until it stops
    const held = await p.evaluate(() => { PIC = { title: 'a test', t0: performance.now(), busy() { return performance.now() - this.t0 < 1500; }, draw() {} }; tell(['A test card, to wait until the picture stops.']); return { held: window.__bw.READ.q.length > 0 && document.getElementById('read').hidden }; });
    say(held.held, `${name}: words came over a moving picture`);
    await p.waitForTimeout(1900); s = await st(); say(s.shown && s.asleep, `${name}: the held words did not come when the picture stopped`);
    await p.evaluate(() => { PIC = null; });
    // 6. the painted board
    await p.evaluate(() => { READ.q = []; READ.then = null; showMural(); }); await p.waitForTimeout(400);
    const mu = await p.evaluate(() => { const r = document.getElementById('read').getBoundingClientRect(), c = document.getElementById('cv').getBoundingClientRect(); return { cardTop: r.top, cardBottom: r.bottom, picTop: PICTOP + c.top, picBottom: c.bottom, clear: document.getElementById('veil').classList.contains('clear') }; });
    if (w <= 560) say(mu.cardTop >= mu.picBottom - 1, `${name}: at the painted board the card covers the picture (card from ${Math.round(mu.cardTop)}, picture to ${Math.round(mu.picBottom)})`);
    else say(mu.picTop >= mu.cardBottom, `${name}: at the painted board the board starts at ${Math.round(mu.picTop)}, under the card (which ends at ${Math.round(mu.cardBottom)})`);
    say(mu.clear, `${name}: the painted board is dimmed under the card`);
    say(!errs.length, `${name}: errors: ${errs.join(' | ')}`);
    console.log(`  ${name}: card at ${s.card.slice(0, 4).map(Math.round).join(', ')}; OK woke after ${woke} ms for ${words} words`);
    await ctx.close(); }
  await b.close();
  console.log(bad.length ? `\nFAILED (${bad.length})` : '\nok: on three screens the card is in the middle, high up, over a dimmed screen; OK sleeps as long as in the main game; a tap meanwhile only shakes it; held words wait for a moving picture');
  process.exit(bad.length ? 1 : 0); })();
