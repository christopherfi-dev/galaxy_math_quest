// Galactic Trade in the game: the trade thread's market, wired in (version 100).   [Source: Marc, 2026-11-26: "I agree with your things"; his class:
//   "the two that I chosen before were [crossed] off... I feel like it should refresh each time to new worlds and new products and new values"]
// The market's own maths and pages are tested on its page (checks/trade_market_test.js) and its rule on 20,000 seeds (checks/trade_market_check.js,
// which can read the game's copy). This test checks the WIRING, played as a child at iPad sideways, iPad upright and phone:
//   - the beacon is silent until Voltara has an energy plan
//   - the beacon (a tap on the picture, or "trade") opens the market: the story first, no box to fill; the place's name steps aside so it hides no planet card
//   - the board is drawn in the game's picture: every pay and distance; a tap on a planet's card loads a crate, a second tap takes it off
//   - a trip on the best plan, worked out here: the fuel and what is left, typed; the flight; the count; "came home with"
//   - closing the game in the middle of a flight and opening it again: the trip goes on, the fuel is not paid twice
//   - the next trip is a NEW board (new planets or new pay): no planet is crossed off
//   - leaving: the words name the planets the child can land on now; "small worlds" lists them; "land on X" lands; a planet not traded with is refused
//   - the status shows the market's gems; the mission panel counts the trips
//   - a version 97 save (a season of 2,000 gems): the market starts fresh with the Council's gift, and the 2,000 is not shown
//   - "buy glow stone" opens the market, with Planet R's price; the glassmaker names Planet R and 300 gems
// Run: node checks/galactic_trade_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {}
      window.GMQ_FAST_TRADE = true; const f = CanvasRenderingContext2D.prototype.fillText; window.__drawn = new Set(); CanvasRenderingContext2D.prototype.fillText = function (t) { try { window.__drawn.add(String(t)); } catch (e) {} return f.apply(this, arguments); }; });
    await p.goto(FILE); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 160)}"`); };
    const last = () => p.evaluate(() => (lines[lines.length - 1] || {}).text || ''), say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(300); return last(); };
    const desk = () => p.evaluate(() => $('toy').hidden ? '' : $('toy').innerText);
    const M = () => p.evaluate(() => JSON.parse(JSON.stringify(S.market || {})));
    const drawn = async () => { await p.evaluate(() => { window.__drawn = new Set(); }); await p.waitForTimeout(200); return p.evaluate(() => Array.from(window.__drawn)); };
    const shot = async n => { if (out) { await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, `trade_${name}_${n}.png`) }); } };
    const click = async sel => { try { await p.click(sel, { timeout: 8000 }); } catch (e) { if (out) await p.screenshot({ path: path.join(out, `trade_${name}_fault.png`) }); throw new Error('no ' + sel + ' to tap (step ' + await p.evaluate(() => S.market && S.market.step) + '; ' + await p.evaluate(s2 => { const e = document.querySelector(s2); if (!e) return 'not on the page'; const r = e.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return 'at ' + Math.round(r.left) + ',' + Math.round(r.top) + ' under ' + (top ? top.id || top.className || top.tagName : 'nothing'); }, sel) + ')'); } await p.waitForTimeout(120); };
    const waitStep = async st => { await p.waitForFunction(s2 => S.market && S.market.step === s2, st, { timeout: 30000 }); await p.waitForTimeout(100); };
    const LY = await p.evaluate(() => GMQTrade.rule.LY);
    const best = m => { let top = null; for (let k = 1; k < 32; k++) { const pick = [0, 1, 2, 3, 4].filter(i => k & (1 << i)); if (pick.length > 3) continue; const fuel = pick.reduce((a, i) => a + 2 * LY[m.board.offers[i].n], 0), pay = pick.reduce((a, i) => a + m.board.offers[i].pay, 0);
      if (fuel <= m.gems && (!top || m.gems - fuel + pay > top.end)) top = { pick, fuel, pay, end: m.gems - fuel + pay }; } return top; };
    const trip = async (reload) => { let m = await M(); const t = best(m); for (const i of t.pick) await click(`#toy .chips .btn[data-i="${i}"]`); await click('#try'); ok((await M()).step === 'pump', 'Fly opens the fuel step'); if (reload) { await p.click('#ans'); await shot('3a_fuel'); }
      await p.fill('#ans', String(t.fuel)); await p.fill('#ans2', String(m.gems - t.fuel)); await click('#try'); expect(await p.textContent('#msg'), /^Right/, 'the right fuel and what is left are taken'); await click('#trfly');
      if (reload) { await p.reload(); await p.waitForTimeout(700); m = await M(); ok(m.step === 'fly' && m.gems === t.end - t.pay, `closed mid-flight: still flying, fuel paid once (step ${m.step}, gems ${m.gems})`); ok(!(await p.evaluate(() => !!widget)), 'after opening again, the market waits for the beacon');
        expect(await say('trade'), /trade board opens/, 'the beacon opens the market again'); }
      await waitStep('count'); m = await M(); await p.fill('#ans', String(t.end)); await click('#try'); await waitStep('result'); expect(await desk(), new RegExp('came home with ' + t.end), 'the result'); return t; };
    try {
      await p.evaluate(() => { skipIntro(); goSpace(); S.tTrade = false; if (S.v) S.v.plan = null; save(); }); await p.waitForTimeout(300);
      expect(await say('trade'), /silent/, 'the beacon before Voltara\'s plan');
      await p.evaluate(() => { S.tTrade = true; save(); }); await p.waitForTimeout(400);
      // the beacon, tapped on the picture
      { const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + .2 * vw, r.top + .26 * vh]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(400); }
      ok(await p.evaluate(() => widget && widget.kind === 'market'), 'tapping the beacon opens the market'); let d = await desk(); expect(d, /Energy Council/, 'the story comes first'); ok(!(await p.$('#toy input')), 'no box to fill on the first screen');
      ok(await p.evaluate(() => getComputedStyle(document.querySelector('.hud')).display === 'none'), 'the place name steps aside while the market is open'); await shot('1_call');
      for (let k = 0; k < 5 && (await M()).step !== 'plan'; k++) await click('#try');
      let m = await M(); ok(m.step === 'plan' && m.gems === 100, `the first board, with the Council's 100 gems (step ${m.step}, gems ${m.gems})`);
      { const pic = await drawn(); m.board.offers.forEach(o => { ok(pic.includes('pays ' + o.pay + ' gems'), `the picture shows Planet ${o.n}'s pay`); ok(pic.includes(LY[o.n] + ' light-years'), `the picture shows Planet ${o.n}'s light-years`); }); }
      await shot('2_board');
      // a tap on the first planet card loads a crate; a second tap takes it off (the card's place worked out as the market lays it out)
      { const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(), mm = Math.min(vw, vh), fs = Math.max(12, Math.min(17, mm * .025)), pad = Math.max(6, mm * .012), cols = vw >= 560 ? 5 : 3, cw = (vw - pad * (cols + 1)) / cols, cfs = Math.max(11, Math.min(fs, cw / 9.2)), ch = cfs * 4.6, off = (vw - cols * cw - (cols + 1) * pad) / 2; return [r.left + off + pad + cw / 2, r.top + pad + ch / 2]; });
        await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(150); ok((await M()).sel.indexOf(0) >= 0, 'a tap on a planet card loads a crate'); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(150); ok(!(await M()).sel.length, 'a second tap takes it off'); }
      const first = m.board.offers.map(o => o.n + o.want + o.pay).join();
      // trip 1, the game closed in the middle of the flight
      const t1 = await trip(true); await shot('3_result');
      await click('#try'); await waitStep('plan'); m = await M(); ok(m.board.offers.map(o => o.n + o.want + o.pay).join() !== first, 'the next trip is a new board');
      ok(!(await p.evaluate(() => [...document.querySelectorAll('#toy .chips .btn')].some(b => b.disabled))), 'no planet is crossed off on the second trip'); await shot('4_trip2');
      // leaving: the planets sold to can be landed on
      const soldTo = await p.evaluate(() => GMQTrade.visited(S.market)); ok(soldTo.length === t1.pick.length, 'the planets sold to: ' + soldTo.join());
      await click('#trleave'); ok(await p.evaluate(() => !widget && $('toy').hidden), 'Leave closes the market'); ok(await p.evaluate(() => getComputedStyle(document.querySelector('.hud')).display !== 'none'), 'the place name is back');
      { const l = await last(); ok(/You can land on/.test(l) && soldTo.every(n => l.indexOf('Planet ' + n) >= 0), 'leaving names the planets to land on: ' + l); }
      expect(await p.evaluate(() => hereWords().map(x => x[1]).join(' | ')), /small worlds/, 'the Here row offers the small worlds');
      expect(await p.evaluate(() => $('status').textContent), new RegExp('Gems ' + t1.end), 'the status shows the market\'s gems');
      expect(await say('small worlds'), /planets you have traded with/i, '"small worlds"'); expect(await desk(), new RegExp('Planet ' + soldTo[0]), 'the list of small worlds'); await shot('5_small_worlds'); await p.evaluate(() => closeToy());
      const notYet = Object.keys(await p.evaluate(() => TR)).find(n => soldTo.indexOf(n) < 0 && 'AIOQ'.indexOf(n) < 0);
      expect(await say('land on ' + notYet.toLowerCase()), new RegExp(`You have not traded with Planet ${notYet} yet`), 'a planet not traded with');
      await say('land on ' + soldTo[0].toLowerCase()); ok(await p.evaluate(n => S.mode === 'world' && WORLD().at === n, soldTo[0]), 'landing on a planet sold to');
      await p.evaluate(() => { goSpace(); }); await p.waitForTimeout(300);
      // the glow stone: the old word now opens the market, with Planet R's price
      await p.evaluate(() => { S.inv = S.inv.filter(i => i !== 'stone' && i !== 'lantern'); if (!S.inv.includes('blantern')) S.inv.push('blantern'); save(); });
      expect(await say('buy glow stone'), /Planet R sells glow stones, for 300 gems/, 'buy glow stone'); ok(await p.evaluate(() => widget && widget.kind === 'market'), 'and the market opens'); await click('#trleave');
      expect(await p.evaluate(() => { LANT().glass = 1; return vGlass(); }), /Planet R.*300 gems/, 'the glassmaker names Planet R and 300 gems');
      // a version 97 save: a season of 2,000 gems
      await p.evaluate(() => { delete S.market; S.trade = { scan: ['B', 'C'], seen: ['B'], trip: 3, gems: 2000, log: [{ trip: 1 }], season: 1, best: 2000, brief: true, demo: true }; save(); }); await p.reload(); await p.waitForTimeout(700);
      await say('trade'); for (let k = 0; k < 5 && (await M()).step !== 'plan'; k++) await click('#try'); m = await M(); ok(m.gems === 100 && m.lastSeason === 2000, `an old season: the market starts fresh (gems ${m.gems}, last season ${m.lastSeason})`);
      await click('#trlog'); d = await desk(); ok(/older season/i.test(d) && !/2,000|2000/.test(d), 'the log names an older season, without its 2,000 gems');
      ok(await p.evaluate(() => { const c = document.querySelector('#toy table.log td'); if (!c) return false; const col = getComputedStyle(c).color.match(/\d+/g).map(Number); return col[0] + col[1] + col[2] > 500 && getComputedStyle(c.closest('table')).display === 'table'; }), "the ship's log is light words on the dark desk"); await shot('6_log');
      await click('#try'); await click('#trleave');
      expect(await p.evaluate(() => worldsOpen().join()), /B,C/, 'the planets scanned in the old season can still be landed on');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Galactic Trade, the market in the game: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
