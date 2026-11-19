// Read, then OK.  [Source: Marc, 2026-11-17: his daughter did not notice the words at the bottom. "She thinks it's just a click click click game."]
// Checks, at iPad and phone size, with touch:
//   - new words come up on a card over the picture, and the line below stays empty until OK
//   - OK is asleep at first, for a time that grows with the number of words, and nothing else can be done meanwhile
//   - OK drops the words to the line below
//   - words already read once do not stop the game again
//   - two messages at once share one card
//   - a task panel never has a card over it, and the result of a task does get one
//   - the teacher can switch the cards off
//   - the first steps on Voltara can be played with the cards on
// Run: node checks/reading_card_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const card = () => p.evaluate(() => { const c = $('card'), r = $('cardbox').getBoundingClientRect(), s = document.querySelector('.stage').getBoundingClientRect(), o = $('cardok').getBoundingClientRect(); return { open: READ.open, shown: !c.hidden && !c.classList.contains('drop'), text: $('cardtext').innerText.trim(), paras: $('cardtext').children.length, okOff: $('cardok').disabled, wait: READ.wait, log: (document.querySelector('#log .new') || {}).textContent || '', inStage: r.top >= s.top - 1 && r.bottom <= s.bottom + 1 && r.left >= s.left - 1 && r.right <= s.right + 1, okOnScreen: o.bottom <= innerHeight && o.top >= 0, font: parseFloat(getComputedStyle(document.querySelector('#cardtext p') || document.body).fontSize) }; });
    const type = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(250); };
    const idle = async () => { for (let i = 0; i < 150; i++) { if (await p.evaluate(() => (S.mode !== 'planet' || (PL.to == null && !PL.then)) && !(P.route && P.route.length) && !P.then)) return; await p.waitForTimeout(100); } };
    const ok = async () => { for (let i = 0; i < 60 && (await p.evaluate(() => $('cardok').disabled)); i++) await p.waitForTimeout(100); await p.locator('#cardok').tap(); await p.waitForTimeout(480); };
    // 1. the first words of the game come up on a card
    await p.evaluate(() => skipIntro()); await p.waitForTimeout(200); let c = await card();
    if (!c.open || !c.shown || !/limps into the dock/.test(c.text) || c.log || !c.okOff || !c.inStage || !c.okOnScreen || c.font < 17) bad.push(name + ': the first card: ' + JSON.stringify(c));
    if (out) await p.screenshot({ path: path.join(out, `card_${name}_1.png`) });
    // 2. while it is up: OK is asleep, a typed command is not done, a tap on the picture does nothing
    await p.locator('#cardok').tap({ force: true }).catch(() => {}); if (!(await card()).open) bad.push(name + ': OK worked before it woke up');
    const before = await p.evaluate(() => JSON.stringify([S.x, S.y, S.room, lines.length])); await p.locator('#cmd').fill('look crate'); await p.press('#cmd', 'Enter'); await p.waitForTimeout(200);
    const st = await p.locator('.stage').boundingBox(); await p.touchscreen.tap(st.x + st.width * .5, st.y + st.height * .3); await p.waitForTimeout(500);
    if ((await p.evaluate(() => JSON.stringify([S.x, S.y, S.room, lines.length]))) !== before || !(await card()).open) bad.push(name + ': something happened while the card was up');
    // 3. the wait grows with the words, and has a top
    const waits = await p.evaluate(() => { const r = []; ['Short one.', 'This one has quite a few more words in it than the first one did.', new Array(60).join('word ')].forEach(t => { READ.q = []; readShow(t); r.push(READ.wait); }); READ.q = []; readShow('Your ship limps into the dock. The station is a mess. Look around.'); return r; });
    if (!(waits[0] < waits[1] && waits[1] < waits[2]) || waits[0] < 600 || waits[2] > 3500) bad.push(name + ': the waiting times are wrong: ' + waits.join(', '));
    // 4. OK drops the words to the line below
    await ok(); c = await card(); if (c.open || c.shown || !/limps into the dock/.test(c.log)) bad.push(name + ': after OK the words should be on the line below: ' + JSON.stringify(c));
    // 5. new words stop the game; words read before do not
    await type('look crate'); await idle(); await p.waitForTimeout(200); c = await card(); const firstLook = c.text; if (!c.open || !c.text) bad.push(name + ': a new answer should come up on a card'); await ok();
    await type('look crate'); await idle(); await p.waitForTimeout(200); c = await card(); if (c.open || c.log !== firstLook) bad.push(name + ': words already read should go straight to the line below: ' + JSON.stringify(c));
    // 6. two messages at once share one card. Enter is OK on a keyboard.
    await p.evaluate(() => { say('The first new thing happens.'); say('Then a second new thing happens.'); }); c = await card(); if (c.paras !== 2) bad.push(name + ': two messages should share one card, got ' + c.paras);
    for (let i = 0; i < 60 && (await p.evaluate(() => $('cardok').disabled)); i++) await p.waitForTimeout(100); await p.keyboard.press('Enter'); await p.waitForTimeout(480); if ((await card()).open) bad.push(name + ': Enter should be OK');
    // 7. Voltara with the cards on: land, eat, take, walk, feed the fish. A task panel has no card over it. Its result does.
    await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(150); await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.locator('#t_volt').tap(); await p.waitForTimeout(900); c = await card(); if (!c.open || !/Teacher shortcut/.test(c.text)) bad.push(name + ': arriving on Voltara should show a card: ' + JSON.stringify(c)); if (out) await p.screenshot({ path: path.join(out, `card_${name}_2_voltara.png`) }); await ok();
    let cards = 0; for (const t of ['eat fruit', 'take fruit', 'go east', 'give fruit to fish']) { await type(t); await idle(); await p.waitForTimeout(250); if ((await card()).open) { cards++; await ok(); } }
    if (cards < 3 || !(await p.evaluate(() => V().fed || V().stones || S.secrets.includes('fruit')))) bad.push(name + `: playing Voltara with cards on: ${cards} cards`);
    await type('talk fish'); await idle(); await p.waitForTimeout(300); c = await card(); const toyOpen = await p.evaluate(() => !$('toy').hidden); if (!toyOpen || c.open) bad.push(name + ': a task panel should open with no card over it: ' + JSON.stringify([toyOpen, c.open]));
    await p.locator('#leave').tap(); await p.waitForTimeout(250); c = await card(); if (!c.open || !/step back/.test(c.text)) bad.push(name + ': leaving a task says something new, so it should show a card'); await ok();
    // 8. the teacher can switch the cards off, and the choice is kept
    await p.evaluate(() => { if (typeof menuOpen === 'function') menuOpen('teacher'); const d = document.querySelector('details'); if (d) d.open = true; }); await p.waitForTimeout(150); await p.locator('#cardsOn').uncheck(); await p.evaluate(() => say('A brand new line with the cards switched off.')); c = await card(); if (c.open || !/brand new line/.test(c.log)) bad.push(name + ': with the cards off, words should go to the line below');
    await p.reload(); await p.waitForTimeout(400); if (await p.evaluate(() => READ.on || $('cardsOn').checked)) bad.push(name + ': the off switch was not kept'); await p.evaluate(() => { if (typeof menuOpen === 'function') menuOpen('teacher'); const d = document.querySelector('details'); if (d) d.open = true; }); await p.waitForTimeout(150); await p.locator('#cardsOn').check(); if (!(await p.evaluate(() => READ.on))) bad.push(name + ': the cards could not be switched back on');
    console.log(`${name}: reading cards checked`); await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0]); process.exit(1); });
