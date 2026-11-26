// GMQCards inside the real game, before the main thread wires it in.   (the cards thread, 26 November 2026)
// It opens the game file (it never edits it), adds the piece from docs/cards/index.html (between its marked lines) and the card list, and makes the host
// the wiring note describes, from the game's own functions: toy, closeToy, save, beep, speak, S.cards, the picture (.stage).
// Then, at iPad sideways (1180 x 745), iPad upright (820 x 1180) and phone (390 x 760):
//   - a card earned at the KIS Station: it fills the game's picture exactly, over the place name; the game's desk shows only its buttons; the words fit
//   - a reading card (say) opened while the card shows sits above it, so a message is never hidden
//   - Add: the picture is the game's again; the card is in the game's save (its key unchanged) and the old My cards list still draws it
//   - the book with 2 and with 150 cards, in the game's picture
//   - closed while the card shows and opened again: the card is still waiting (unseen) in the save
//   - the game takes its desk back (closeToy) while the card shows: the card leaves the picture, and stays waiting
// Run: node checks/cards_in_game_test.js [folder for screenshots] [game file]
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const OUT = process.argv[2], GAME = path.resolve(process.argv[3] || path.join(__dirname, '..', 'prototypes', 'kis_station_sketch.html')), FILE = 'file://' + GAME;
const page = fs.readFileSync(path.join(__dirname, '..', 'docs', 'cards', 'index.html'), 'utf8');
const BLOCK = (page.match(/\/\* ===== GMQ CARDS: start =====[\s\S]*?\/\* ===== GMQ CARDS: end ===== \*\//) || [''])[0], LIST = (page.match(/<script id="gmqc-list">([\s\S]*?)<\/script>/) || [0, ''])[1];
const HOST = `window.CARDS_HOST = { stage: () => document.querySelector('.stage'), toy: h => toy(h), closeToy: () => closeToy(), save: () => save(), beep: (f, d, t) => beep(f, d, t), speak: t => speak(t), cards: () => S.cards, get calm() { return true; } };
  GMQCards.use(window.GMQC_LIST);`;
(async () => {
  const b = await chromium.launch(), bad = [], errs = []; let checks = 0;
  if (!/GMQCards/.test(fs.readFileSync(GAME, 'utf8'))) console.log('(the game does not hold GMQCards yet: this test adds it)');
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_|net::/.test(m.text())) errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} window.GMQ_NO_PV = true; });
    const ok = (c, what) => { checks++; if (!c) bad.push(`${name}: ${what}`); return c; };
    const shot = async n => { if (OUT) { await p.waitForTimeout(250); await p.screenshot({ path: path.join(OUT, `ingame_${name}_${n}.png`) }); } };
    const boot = async () => { await p.goto(FILE); await p.waitForTimeout(500); if (!(await p.evaluate(() => typeof GMQCards !== 'undefined'))) await p.addScriptTag({ content: BLOCK + '\n' + LIST }); await p.addScriptTag({ content: HOST }); };
    const geo = () => p.evaluate(() => { const L = document.querySelector('.gmqc'), st = document.querySelector('.stage'); if (!L) return null; const r = L.getBoundingClientRect(), s = st.getBoundingClientRect(), pl = document.getElementById('place').getBoundingClientRect();
      const at = (x, y) => { const e = document.elementFromPoint(x, y); return e ? (e.closest('.gmqc') ? 'cards' : e.closest('#card') ? 'reading card' : e.id || e.tagName) : 'none'; };
      const wd = L.querySelector('.gmqc-words'), cw = L.querySelector('.gmqc-cw'); const cr = cw ? cw.getBoundingClientRect() : null;
      return { r: [r.left, r.top, r.width, r.height].map(Math.round), s: [s.left + st.clientLeft, s.top + st.clientTop, st.clientWidth, st.clientHeight].map(Math.round), centre: at(s.left + s.width / 2, s.top + s.height / 2), place: at(pl.left + pl.width / 2, pl.top + pl.height / 2),
        scroll: wd ? wd.scrollHeight - wd.clientHeight : 0, cardIn: cr ? cr.left >= r.left - 1 && cr.right <= r.right + 1 && cr.top >= r.top - 1 && cr.bottom <= r.bottom + 1 : true, cardW: cr ? Math.round(cr.width) : 0 }; });
    try {
      await boot(); await p.evaluate(() => { skipIntro(); S.storyTold = true; save(); }); await p.waitForTimeout(400); await p.evaluate(() => { try { readOk(true); } catch (e) {} });
      // a card earned at the station
      await p.evaluate(() => { const r = GMQCards.record(GMQCards.starterNext(rnd(2147483647), S.cards, 15, S.packSeed = S.packSeed || rnd(2147483646) + 1), 'For the Energy Grid task, in the Shield Bay.', { st: 1 }); S.cards.push(r); save(); drawCards(S.cards.length - 1);
        window.__done = null; GMQCards.show(CARDS_HOST, r, r.why, why => { window.__done = why; }); }); await p.waitForTimeout(400);
      let G = await geo(); ok(G && Math.abs(G.r[0] - G.s[0]) <= 2 && Math.abs(G.r[1] - G.s[1]) <= 2 && Math.abs(G.r[2] - G.s[2]) <= 2 && Math.abs(G.r[3] - G.s[3]) <= 2, `the card fills the game's picture exactly (card layer ${G && G.r}, picture ${G && G.s})`);
      ok(G.centre === 'cards' && G.place === 'cards', `it is on top of the picture and of the place name (${G.centre}, ${G.place})`); ok(G.scroll <= 1 && G.cardIn, `the words fit with no scrolling, and the card is inside the picture (${G.scroll})`);
      ok(G.cardW >= (name === 'phone' ? 140 : 250), `the card is big in the game's picture (${G.cardW} pixels wide)`);
      { const d = await p.evaluate(() => { const t = document.getElementById('toy'); return { hidden: t.hidden, btns: [...t.querySelectorAll('button')].map(x => x.textContent.trim()), text: t.innerText.replace(/\s+/g, ' ').trim(), vis: t.getBoundingClientRect().height > 0 }; });
        ok(!d.hidden && d.vis && d.btns.length === 2, `the game's desk shows only the card's buttons: ${d.btns.join(' | ')}`); ok(/^Read… Read to me$|^Add to my cards Read to me$/.test(d.text), `and no other words: "${d.text}"`); }
      await shot('1_card');
      // a reading card opened over it
      await p.evaluate(() => say('The radio crackles. This message must not hide under the card.')); await p.waitForTimeout(400);
      G = await geo(); const readOn = await p.evaluate(() => !document.getElementById('card').hidden);
      if (readOn) { const where = await p.evaluate(() => { const r = document.getElementById('cardbox').getBoundingClientRect(), e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return e && e.closest('#card') ? 'reading card' : 'covered'; });
        ok(where === 'reading card', 'a reading card opened while the card shows sits on top of it'); await shot('2_reading_on_top'); await p.evaluate(() => readOk(true)); await p.waitForTimeout(300); }
      else ok(true, 'reading cards are off on this device');
      // Add
      await p.waitForFunction(() => document.getElementById('gmqc-add') && !document.getElementById('gmqc-add').disabled, null, { timeout: 8000 }); await p.click('#gmqc-add'); await p.waitForTimeout(500);
      ok(!(await geo()) && (await p.evaluate(() => window.__done)) === 'added', 'Add: the card leaves the picture, and the game hears "added"');
      ok(await p.evaluate(() => document.getElementById('toy').hidden), 'the game\'s desk is the game\'s again (its words come back)');
      { const sv = await p.evaluate(() => { const k = Object.keys(localStorage).filter(x => /gmq-station-sketch-v6/.test(x))[0]; const s = k ? JSON.parse(localStorage.getItem(k)) : null; return { k, c: s && s.cards }; });
        ok(sv.k && sv.c && sv.c.length === 1 && sv.c[0].id && !sv.c[0].unseen, `the card is in the game's save (key ${sv.k}), added: ${JSON.stringify(sv.c && sv.c[0])}`);
        const old = await p.evaluate(() => { drawCards(); return document.getElementById('cards').innerText; }); ok(old.indexOf(sv.c[0].n) >= 0, 'the old My cards list still draws the new card by its name'); }
      // the book, 2 cards
      await p.evaluate(() => { const r = GMQCards.record(GMQCards.pick(rnd(2147483647), 'rare', S.cards), 'For finding a secret: the lost bolt.'); delete r.unseen; S.cards.push(r); save(); GMQCards.book(CARDS_HOST, S.cards, why => { window.__done = why; }); }); await p.waitForTimeout(400);
      G = await geo(); ok(G && Math.abs(G.r[3] - G.s[3]) <= 2 && G.centre === 'cards', 'the book fills the game\'s picture'); ok(/Cards found: 2 of/.test(await p.evaluate(() => document.querySelector('.gmqc').innerText)), 'the book counts 2 cards'); await shot('3_book2');
      await p.click('.gmqc-tile[data-o]'); await p.waitForTimeout(300); G = await geo(); ok(G.scroll <= 1 && G.cardIn, 'a card from the book, read big in the game\'s picture: it fits'); await shot('4_read');
      await p.click('#gmqc-back'); await p.click('#gmqc-close'); await p.waitForTimeout(300); ok(!(await geo()) && (await p.evaluate(() => window.__done)) === 'closed', 'Close my cards: the game hears "closed"');
      // the book, 150 cards
      await p.evaluate(() => { const ids = [].concat(GMQCards.pool('common'), GMQCards.pool('rare'), GMQCards.pool('epic')); for (let i = 0; i < 148; i++) { const r = GMQCards.record(i < ids.length ? ids[i] : GMQCards.pick(rnd(2147483647), GMQCards.rarity(rnd(1000) / 1000), S.cards), 'Made up for the test.'); delete r.unseen; S.cards.push(r); } save(); GMQCards.book(CARDS_HOST, S.cards, () => {}); });
      await p.waitForTimeout(600); { const tot = await p.evaluate(() => GMQCards.pool('common').length + GMQCards.pool('rare').length + GMQCards.pool('epic').length); ok(new RegExp('Cards found: ' + tot + ' of ' + tot).test(await p.evaluate(() => document.querySelector('.gmqc').innerText)), 'a book of 150 cards in the game'); } await shot('5_book150');
      ok(await p.evaluate(() => { const t = document.querySelector('.gmqc-tile').getBoundingClientRect(); return t.width >= 90; }), 'its cards are 90 pixels wide or more'); await p.click('#gmqc-close'); await p.waitForTimeout(200);
      // closed while a card shows, and opened again
      await p.evaluate(() => { S.cards.length = 0; const r = GMQCards.record(GMQCards.pick(5, 'epic', S.cards), 'For finishing every job on Chronosia.'); S.cards.push(r); save(); GMQCards.show(CARDS_HOST, r, r.why, () => {}); }); await p.waitForTimeout(300);
      await boot(); await p.waitForTimeout(300); ok(await p.evaluate(() => S.cards.length === 1 && S.cards[0].unseen === 1 && GMQCards.unseen(S.cards).length === 1), 'closed while the card showed, and opened again: it is still waiting in the save');
      // the game takes its desk back
      await p.evaluate(() => { readOk(true); GMQCards.show(CARDS_HOST, S.cards[0], S.cards[0].why, why => { window.__done = why; }); }); await p.waitForTimeout(300); await p.evaluate(() => closeToy()); await p.waitForTimeout(900);
      ok(!(await geo()) && (await p.evaluate(() => window.__done)) === 'gone' && (await p.evaluate(() => S.cards[0].unseen === 1)), 'the game takes its desk back (closeToy): the card leaves the picture, the game hears "gone", and the card stays waiting');
    } catch (e) { bad.push(name + ': stopped: ' + e.message.split('\n')[0]); if (OUT) await p.screenshot({ path: path.join(OUT, `ingame_${name}_fault.png`) }); }
    await ctx.close();
  }
  await b.close(); errs.forEach(e => bad.push('page error: ' + e));
  console.log(`checks: ${checks}`); bad.forEach(x => console.log('FAIL ' + x)); console.log(bad.length ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad.length ? 1 : 0);
})();
