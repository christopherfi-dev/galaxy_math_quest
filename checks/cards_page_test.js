// The cards page, played as a child, at iPad sideways (1180 x 745), iPad upright (820 x 1180) and phone (390 x 760).   (the cards thread, 26 November 2026)
//   - a card earned: it fills the picture; the desk holds only "Add to my cards" (and "Read to me"); the card rises and turns in 2 seconds or less; a tap skips it;
//     Add waits while a bar fills (the game's reading time); every word beside the card is the card's own (its words, its kind, why it was given)
//   - nothing runs off the card or out of the picture: the card's lines stay inside the card; the words beside it need no scrolling, even for the longest card, a double and a long reason
//   - a double says so, and what a double is for; the count of cards found does not go up
//   - the page closed while a card shows, and opened again: the card shows again; once added, it does not
//   - the book with 0, 2 and 150 cards: the count; empty shapes; NO name or face of a card not found anywhere in the page (words, labels); tap an empty shape; tap a card to read it; Back keeps the place
//   - a card waiting in the book (closed before it was added): a face-down "New!" shape, no name, until it is tapped
//   - the station's 15 cards as one pack: face down; turn one, turn all; read one; add them all
//   - old saves: swap (the same kinds), keep (shown as first cards), map (Laser Cannon becomes Spark Shot)
//   - challenge battles: a card won (shown as earned); a card lost (it leaves the book after OK)
//   - the desk taken by something else while a card shows: the card goes, and stays waiting
// Run: node checks/cards_page_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path'), fs = require('fs');
const OUT = process.argv[2], FILE = 'file://' + path.resolve(__dirname, '..', 'docs', 'cards', 'index.html');
(async () => {
  const b = await chromium.launch(), bad = [], errs = []; let checks = 0;
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errs.push(name + ': ' + m.text()); });
    const ok = (c, what) => { checks++; if (!c) bad.push(`${name}: ${what}`); return c; };
    const shot = async n => { if (OUT) { await p.waitForTimeout(250); await p.screenshot({ path: path.join(OUT, `cards_${name}_${n}.png`) }); } };
    const go = async q => { await p.goto(FILE + q); await p.waitForTimeout(350); };
    const ST = () => p.evaluate(() => JSON.parse(JSON.stringify(GMQ_DEMO.state())));
    const deskText = () => p.evaluate(() => document.getElementById('toy').innerText.trim());
    const layer = () => p.evaluate(() => { const L = document.querySelector('.gmqc'); if (!L) return null; const r = L.getBoundingClientRect(), pr = document.getElementById('pic').getBoundingClientRect(); return { r: [r.left, r.top, r.width, r.height], pic: [pr.left + 2, pr.top + 2, pr.width - 4, pr.height - 4], html: L.innerHTML, text: L.innerText }; });
    // the words beside a card, and does anything spill?
    const fits = () => p.evaluate(() => { const L = document.querySelector('.gmqc'), lr = L.getBoundingClientRect(), wd = document.querySelector('.gmqc-big:not([style*="none"]) .gmqc-words') || document.querySelector('.gmqc-words'), cw = wd.parentNode.querySelector('.gmqc-cw').getBoundingClientRect(), wr = wd.getBoundingClientRect();
      const inside = r => r.left >= lr.left - 1 && r.top >= lr.top - 1 && r.right <= lr.right + 1 && r.bottom <= lr.bottom + 1;
      const face = wd.parentNode.querySelector('.gmqc-face svg'); let spill = [];
      if (face) { const sr = face.getBoundingClientRect(), k = 250 / sr.width; face.querySelectorAll('text').forEach(t => { const r = t.getBoundingClientRect(), x0 = (r.left - sr.left) * k, x1 = (r.right - sr.left) * k, y0 = (r.top - sr.top) * k, y1 = (r.bottom - sr.top) * k; if (x0 < 12 || x1 > 238 || y0 < 12 || y1 > 338) spill.push(t.textContent + ' [' + [x0, y0, x1, y1].map(Math.round) + ']'); }); }
      return { scroll: wd.scrollHeight - wd.clientHeight, cardIn: inside(cw), wordsIn: inside(wr), overlap: !(wr.left >= cw.right - 1 || wr.top >= cw.bottom - 1), spill, fs: parseFloat(wd.style.fontSize), words: wd.innerText, cardW: cw.width }; });
    try {
      // ---------- 1. a card earned, with the real animation ----------
      await go('?fresh=1&seed=4242'); ok(!(await layer()), 'nothing covers the picture before a card is earned'); await shot('0_idle');
      const t0 = Date.now(); await p.click('#d-task'); await p.waitForTimeout(120);
      let L = await layer(); ok(L && Math.abs(L.r[2] - L.pic[2]) < 3 && Math.abs(L.r[3] - L.pic[3]) < 3, `the card fills the picture (layer ${L && L.r.map(Math.round)}, picture ${L && L.pic.map(Math.round)})`);
      { const btns = await p.$$eval('#toy button', bs => bs.map(x => x.textContent.trim())); ok(btns.length === 2 && /Read/.test(btns[0]) && btns[1] === 'Read to me', `the desk holds only the button (and Read to me): ${btns.join(' | ')}`);
        ok(await p.$eval('#gmqc-add', x => x.disabled), 'Add waits at first ("Read…")'); ok(!(await p.$('#toy p, #toy h3')), 'no words on the desk while the card shows'); }
      await p.waitForFunction(() => document.querySelector('.gmqc-words.in'), null, { timeout: 4000 }); const tAnim = Date.now() - t0;
      ok(tAnim <= 2100, `the card rises, turns over and shows its words within 2 seconds (${tAnim} ms)`); await shot('1_card');
      const s1 = await ST(), c1 = s1.cards[0], e1 = await p.evaluate(id => { const e = GMQCards.get(id); return { text: e.text, rarity: e.rarity, name: e.name, kind: GMQCards.words.kind[e.rarity] }; }, c1.id);
      let F = await fits(); ok(F.words.indexOf(e1.text) >= 0, 'the words beside the card are the card\'s own words'); ok(F.words.indexOf(e1.kind) >= 0, `the kind beside the card is the card's kind (${e1.kind})`);
      ok(F.words.indexOf('For the Asteroid Field task, in the Shield Bay.') >= 0, 'it says why the child got it'); ok(F.words.indexOf(e1.name) >= 0, 'it names the card');
      ok(c1.unseen === 1, 'the card is already in the save, marked as not yet seen');
      const waitMs = await p.evaluate(() => { const t = document.querySelector('.gmqc-words').innerText.replace(/\s+/g, ' ').trim().split(' ').length; return GMQCards.rule.wait(t); });
      const tR = Date.now(); await p.waitForFunction(() => !document.getElementById('gmqc-add').disabled, null, { timeout: 6000 }); const tRead = Date.now() - tR + tAnim - 1300;
      ok(Math.abs(tRead - waitMs) < 600, `Add waits about the game's reading time (${waitMs} ms; measured about ${tRead} ms)`); ok(/Add to my cards/.test(await p.textContent('#gmqc-add')), 'then it says "Add to my cards"');
      await p.click('#gmqc-add'); await p.waitForTimeout(600); ok(!(await layer()), 'Add closes the card'); ok(!(await ST()).cards[0].unseen, 'the card is added: seen'); ok(/Earn a card/.test(await deskText()), 'the desk returns to the game');
      // a tap skips the animation
      await p.click('#d-task'); await p.waitForTimeout(150); { const pt = await p.evaluate(() => { const r = document.getElementById('pic').getBoundingClientRect(); return [r.left + r.width * .5, r.top + r.height * .5]; }); await p.touchscreen.tap(pt[0], pt[1]); }
      await p.waitForTimeout(60); ok(await p.evaluate(() => !!document.querySelector('.gmqc-flip.on') && !!document.querySelector('.gmqc-words.in')), 'a tap on the picture skips the animation');
      // ---------- 2. closed while the card shows, and opened again ----------
      const idClosed = (await ST()).cards[1].id; await go('?seed=4242'); await p.waitForTimeout(200);      /* the same child, without ?fresh */
      ok(!!(await layer()) && (await ST()).cards[1].unseen === 1, 'closed while the card showed, and opened again: the card shows again');
      ok(await p.evaluate(id => document.querySelector('.gmqc-words').innerText.indexOf(GMQCards.get(id).name) >= 0, idClosed), 'it is the same card');
      await p.waitForFunction(() => !document.getElementById('gmqc-add').disabled, null, { timeout: 7000 }); await p.click('#gmqc-add'); await p.waitForTimeout(500); await go('?seed=4242'); await p.waitForTimeout(200);
      ok(!(await layer()), 'once added, it does not show again after the page is opened again');
      // ---------- 3. the longest words, a double, a long reason: nothing spills ----------
      await go('?seed=4242&fast=1');
      const longest = await p.evaluate(() => GMQCards.list().filter(e => e.group === 'battle').sort((a, b) => b.text.length - a.text.length)[0].id);
      await p.evaluate(id => { const S = GMQ_DEMO.state(); const r0 = GMQCards.record(id, 'x'); delete r0.unseen; S.cards.push(r0); const r = GMQCards.record(id, 'For opening the gear door in the black cave, by the light of the Clockmaker’s lantern, after the tide table.'); S.cards.push(r);
        GMQCards.show(GMQ_DEMO.host, r, r.why, function () { GMQ_DEMO.idle(); }); }, longest);
      await p.waitForTimeout(400); F = await fits();
      ok(/A double!/i.test(F.words) && /Now you have 2\./.test(F.words), 'a double says so: "A double!", "Now you have 2."'); ok(/spare/.test(F.words), 'a double says what a double is for');
      ok(F.scroll <= 1, `the longest card, a double and a long reason fit beside the card with no scrolling (font ${F.fs}px, ${F.scroll}px over)`); ok(F.fs >= 13, `the words are 13 pixels or more (${F.fs})`);
      ok(F.cardIn && F.wordsIn && !F.overlap, 'the card and its words stay inside the picture and do not overlap'); ok(!F.spill.length, 'no line runs off the card: ' + F.spill.join(' | '));
      ok(F.cardW >= (name === 'phone' ? 140 : 280), `the card is big (${Math.round(F.cardW)} pixels wide)`); await shot('2_double');
      { const before = await p.evaluate(() => { const S = GMQ_DEMO.state(), m = {}; S.cards.forEach(c => { if (c.id && !c.unseen) m[c.id] = 1; }); return Object.keys(m).length; });
        ok(/Cards found: /.test(F.words) && F.words.indexOf('Cards found: ' + (before) + ' of') >= 0, 'the count of cards found does not go up for a double'); }
      await p.click('#gmqc-add'); await p.waitForTimeout(300);
      // every battle card, face and words, at this size: no spill
      { const spills = await p.evaluate(async () => { const out = []; const ids = GMQCards.list().map(e => e.id);
          for (const id of ids) { const r = GMQCards.record(id, 'For the Coordinate Plotting task, in the Navigation Bay.'); GMQ_DEMO.state().cards.push(r); await new Promise(res => { GMQCards.show(GMQ_DEMO.host, r, r.why, () => res()); setTimeout(() => {
            const wd = document.querySelector('.gmqc-words'), face = document.querySelector('.gmqc-face svg'); if (wd.scrollHeight - wd.clientHeight > 1) out.push(id + ' words need scrolling');
            const sr = face.getBoundingClientRect(), k = 250 / sr.width; face.querySelectorAll('text').forEach(t => { const r = t.getBoundingClientRect(), x0 = (r.left - sr.left) * k, x1 = (r.right - sr.left) * k, y0 = (r.top - sr.top) * k, y1 = (r.bottom - sr.top) * k; if (x0 < 12 || x1 > 238 || y0 < 12 || y1 > 338) out.push(id + ': "' + t.textContent + '" runs off the card [' + [x0, y0, x1, y1].map(Math.round) + ']'); });
            if (wd.innerText.indexOf(GMQCards.get(id).text) < 0 && GMQCards.get(id).group !== 'part') out.push(id + ': the words beside it are not its own');
            document.getElementById('gmqc-add').click(); }, 120); }); }
          GMQ_DEMO.state().cards.length = 0; return out; });
        ok(!spills.length, `all ${await p.evaluate(() => GMQCards.list().length)} cards (battle cards, parts, upgrades), one by one: nothing spills, words are the card's own: ` + spills.slice(0, 6).join('; ')); }
      // ---------- 4. the book: 0 cards ----------
      await go('?fresh=1&fast=1&seed=77'); await p.click('#d-book'); await p.waitForTimeout(300); L = await layer();
      const names = await p.evaluate(() => GMQCards.list().map(e => e.name));
      ok(/Cards found: 0 of 47/.test(L.text), 'the book with no cards: "Cards found: 0 of 47"'); ok(/No cards yet/.test(L.text), 'it says how to earn the first card');
      ok((await p.$$('.gmqc-empty')).length === 47, 'every card is an empty shape'); ok(!names.some(n => L.html.indexOf(n) >= 0), 'no card\'s name or face is in the page before it is found (words and labels)');
      ok(Math.abs(L.r[3] - L.pic[3]) < 3, 'the book fills the picture'); await shot('3_book0');
      await p.click('.gmqc-empty'); ok(/not found yet/.test(await p.textContent('#gmqc-msg')), 'an empty shape, tapped: "not found yet"');
      await p.click('#gmqc-close'); await p.waitForTimeout(200); ok(!(await layer()), 'Close my cards closes the book');
      // ---------- 5. the book: 2 cards ----------
      for (let i = 0; i < 2; i++) { await p.click('#d-task'); await p.waitForTimeout(250); await p.click('#gmqc-add'); await p.waitForTimeout(150); }
      await p.click('#d-book'); await p.waitForTimeout(300); L = await layer(); const two = (await ST()).cards.map(c => c.n);
      ok(new RegExp('Cards found: ' + new Set((await ST()).cards.map(c => c.id)).size + ' of 47').test(L.text), 'the book with 2 cards counts them');
      ok(two.every(n => L.text.indexOf(n) >= 0), 'both cards are in the book, with their names'); ok(!names.filter(n => two.indexOf(n) < 0).some(n => L.html.indexOf(n) >= 0), 'no other card\'s name or face is in the page');
      ok((await p.$$('.gmqc-nw')).length === 1, 'the newest card is marked New'); await shot('4_book2');
      ok(await p.$$eval('.gmqc-sec', ss => ss.every(sec => { const t = [...sec.querySelectorAll('.gmqc-tile')]; const fe = t.findIndex(x => x.classList.contains('gmqc-empty')); return fe < 0 || t.slice(fe).every(x => x.classList.contains('gmqc-empty')); })), 'in each kind, the child\'s own cards come before the shapes still to find');
      ok(/Still to find: \d+/.test(L.text), 'it says how many are still to find');
      await p.click('.gmqc-tile[data-o]'); await p.waitForTimeout(300); F = await fits(); ok(F.scroll <= 1 && F.cardIn && F.wordsIn, 'a card from the book, read big: it fits'); ok(/How you got it/i.test(F.words), 'it says how the child got it');
      await shot('5_read'); await p.click('#gmqc-next'); await p.waitForTimeout(200); ok(/2 of 2/i.test((await fits()).words), 'Next shows the next card'); await p.click('#gmqc-back'); await p.waitForTimeout(200); ok(!!(await p.$('.gmqc-bk')), 'Back to my cards');
      await p.click('#gmqc-close'); await p.waitForTimeout(200);
      // ---------- 6. a card waiting in the book ----------
      await p.evaluate(() => { const S = GMQ_DEMO.state(), id = GMQCards.pick(9, 'epic', S.cards); S.cards.push(GMQCards.record(id, 'For finishing every job on Chronosia.')); });
      await p.evaluate(() => GMQCards.book(GMQ_DEMO.host, GMQ_DEMO.state().cards, () => GMQ_DEMO.idle())); await p.waitForTimeout(300);
      { const wn = await p.evaluate(() => GMQ_DEMO.state().cards[GMQ_DEMO.state().cards.length - 1].n); L = await layer(); ok(/Waiting for you/.test(L.text) && L.html.indexOf(wn) < 0, 'a card not yet added waits face down in the book, with no name');
        await shot('6_waiting'); await p.click('.gmqc-wait'); await p.waitForTimeout(400); ok((await fits()).words.indexOf(wn) >= 0, 'tapped, it shows as a card earned');
        await p.click('#gmqc-add'); await p.waitForTimeout(400); L = await layer(); ok(L && L.text.indexOf(wn) >= 0 && !/Waiting for you/.test(L.text), 'added, the book shows it in its place'); await p.click('#gmqc-close'); await p.waitForTimeout(200); }
      // ---------- 7. the book: 150 cards ----------
      await go('?fresh=1&fast=1&many=150'); const tB = Date.now(); await p.click('#d-book'); await p.waitForSelector('.gmqc-tile'); const tBook = Date.now() - tB; L = await layer();
      ok(/Cards found: 47 of 47/.test(L.text), 'a book of 150 cards: 47 of 47 found'); ok((await p.$$('.gmqc-x2')).length > 20, 'doubles show how many (×2, ×3...)'); ok(tBook < 3000, `it opens quickly (${tBook} ms)`);
      { const capOver = await p.$$eval('.gmqc-cap', cs => cs.filter(c => c.scrollWidth > c.clientWidth + 1).length), tileW = await p.$eval('.gmqc-tile', t => t.getBoundingClientRect().width);
        ok(!capOver, 'no name under a card runs wider than the card'); ok(tileW >= 90, `a card in the book is ${Math.round(tileW)} pixels wide`); }
      await shot('7_book150'); await p.click('[data-j="epic"]'); await p.waitForTimeout(200); ok(await p.$eval('.gmqc-bk', x => x.scrollTop > 0), 'Epic jumps down to the epic cards'); await shot('7b_epic');
      await p.click('#gmqc-close'); await p.waitForTimeout(200);
      // ---------- 8. the station's 15 cards as one pack ----------
      await go('?fresh=1&fast=1&arrive=pack&seed=5');
      { let none = true; for (let i = 0; i < 14; i++) { await p.click('#d-task'); await p.waitForTimeout(40); if (await layer()) none = false; } ok(none, 'no card after each task, in the pack way'); }
      await p.click('#d-task'); await p.waitForTimeout(400); ok((await p.$$('.gmqc-pt')).length === 15, 'after the 15th task: a pack of 15 cards, face down');
      ok(await p.$$eval('.gmqc-pt', ts => ts.every(t => /face down/.test(t.getAttribute('aria-label')))), 'every card says face down until turned');
      ok(await p.evaluate(() => GMQCards.starterNeeds(GMQ_DEMO.state().cards).length === 0), 'the pack holds a Spy, a Guard, a rare and an epic card'); await shot('8_pack');
      await p.click('.gmqc-pt'); await p.waitForTimeout(300); ok(!/face down/.test(await p.getAttribute('.gmqc-pt', 'aria-label')), 'a tap turns a card over');
      await p.click('#gmqc-all'); await p.waitForTimeout(300); ok(!!(await p.$('#gmqc-add')), 'Turn them all, then "Add them to my cards"'); await shot('8b_turned');
      await p.click('.gmqc-pt'); await p.waitForTimeout(300); F = await fits(); ok(F.scroll <= 1 && F.cardIn, 'a card from the pack, read big'); await p.click('#gmqc-back'); await p.waitForTimeout(200);
      await p.click('#gmqc-add'); await p.waitForTimeout(300); ok((await ST()).cards.filter(c => !c.unseen).length === 15, 'all 15 are added');
      // ---------- 9. old saves ----------
      await go('?fresh=1&fast=1&old=6&oldway=swap&seed=8'); ok((await p.$$('.gmqc-pt')).length === 6, 'an old save, swap: its 6 old cards come as 6 new cards, face down');
      ok(/The cards are new/.test((await layer()).text), 'it says the cards are new'); await p.click('#gmqc-all'); await p.waitForTimeout(200); await shot('9_old_swap'); await p.click('#gmqc-add'); await p.waitForTimeout(200);
      { const cs = (await ST()).cards; ok(cs.length === 6 && cs.every(c => c.id && c.was), 'each old card became a new one, and remembers its old name');
        ok(cs.map(c => c.r).join() === 'common,common,rare,common,gold,common', 'each keeps its kind: ' + cs.map(c => c.r).join()); }
      await go('?fast=1&oldway=swap'); ok(!(await layer()), 'opened again: the swap does not happen twice');
      await go('?fresh=1&fast=1&old=6&oldway=keep&seed=8'); ok(!(await layer()), 'keep: nothing changes when the game opens'); await p.click('#d-book'); await p.waitForTimeout(300);
      L = await layer(); ok(/First cards/.test(L.text) && /Laser Cannon/.test(L.text), 'keep: the old cards are in the book as first cards'); await shot('9b_old_keep');
      await p.click('[data-k="old"] .gmqc-tile'); await p.waitForTimeout(250); ok(/before the new set/.test((await fits()).words), 'an old card, read: it says it is from before the new set'); await p.click('#gmqc-back'); await p.click('#gmqc-close');
      await go('?fresh=1&fast=1&old=6&oldway=map&seed=8'); await p.click('#gmqc-all'); await p.click('#gmqc-add'); await p.waitForTimeout(200);
      ok((await ST()).cards[0].n === 'Spark Shot', 'map: Laser Cannon becomes Spark Shot (the card that grew from it)');
      // ---------- 10. challenge battles ----------
      await go('?fresh=1&fast=1&seed=31'); await p.click('#d-win').catch(async () => { await p.click('summary'); await p.click('#d-win'); }); await p.waitForTimeout(300);
      { const cs = await ST(), c = cs.cards[cs.cards.length - 1]; ok(c && (c.r === 'rare' || c.r === 'gold'), 'a card won in a challenge battle is rare or epic'); ok(/challenge battle/.test((await fits()).words), 'it says where it came from'); await shot('10_won'); await p.click('#gmqc-add'); await p.waitForTimeout(200);
        await p.click('summary'); await p.click('#d-lose'); await p.waitForTimeout(300); L = await layer(); ok(/A card leaves your book/i.test(L.text) && /Goes to your classmate/.test(L.text), 'a card lost: it says it leaves, and where it goes'); await shot('10b_lost');
        ok(/empty again/.test(L.text), 'it says its place is empty again'); await p.click('#gmqc-add'); await p.waitForTimeout(200); ok(!(await ST()).cards.some(x => x.id === c.id), 'after OK, it has left the book'); }
      // ---------- 11. the desk taken by something else ----------
      await p.click('#d-task'); await p.waitForTimeout(200); await p.evaluate(() => { document.getElementById('toy').innerHTML = '<p>Something else</p>'; }); await p.waitForTimeout(900);
      ok(!(await layer()) && (await ST()).cards.slice(-1)[0].unseen === 1, 'the desk taken by something else: the card goes from the picture and stays waiting');
    } catch (e) { bad.push(name + ': stopped: ' + e.message.split('\n')[0]); if (OUT) await p.screenshot({ path: path.join(OUT, `cards_${name}_fault.png`) }); }
    await ctx.close();
  }
  await b.close();
  errs.forEach(e => bad.push('page error: ' + e));
  console.log(`checks: ${checks}`); bad.forEach(x => console.log('FAIL ' + x)); console.log(bad.length ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad.length ? 1 : 0);
})();
