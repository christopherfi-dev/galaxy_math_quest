// Galactic Trade in the sketch: Voltara's second task, set in space.  [Source: Marc's Task 2 and its Trade Data Sheet]
// Plays a whole trading season at iPad and phone size, with touch, and works every answer out from the rules written again here.
//   - the beacon is silent until Voltara has an energy plan (or the teacher shortcut is used)
//   - [v97] a briefing first: Voltara's SOS, the goods in the hold, the goal (Marc's Task 2 page); then the idea; a planet must be scanned (rounded) before it can go on a route
//   - [v97] no running total: the child adds the route's fuel; the game never works out the tokens or the cost for the child; the route is drawn from Voltara to each planet
//   - halfway distances get the "halfway goes up" help
//   - a route that needs too much fuel is refused
//   - trip 1 is free; later trips pay 200 gems for every 10 tokens; a planet that costs more than it pays is reported as a loss
//   - tapping a planet on the map does the same as tapping its button
//   - the season summary, and a new season that keeps the scans
// Run: node checks/galactic_trade_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
const P = { A: [12, 507], B: [26, 812], C: [33, 1209], D: [18, 459], E: [44, 1004], F: [5, 307], G: [22, 709], H: [25, 756], I: [45, 1408], J: [17, 608], K: [37, 1337], L: [53, 889], M: [28, 467], N: [66, 3129], O: [52, 2764], P: [71, 1583], Q: [48, 945], R: [59, 2221], S: [41, 1896], T: [64, 1007] };
const r = (n, m) => Math.floor((n + m / 2) / m) * m, fuel = n => r(P[n][0], 10), pay = n => r(P[n][1], 100), fmt = n => n.toLocaleString('en-US');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-words', 'open'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const last = () => p.evaluate(() => lines[lines.length - 1].text || ''), say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(250); return last(); };
    const expect = (got, re, what) => { if (!re.test(got)) bad.push(`${name}: ${what}: got "${got}"`); }, ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const msg = () => p.textContent('#msg'), q = async () => (await p.textContent('#toy .q')).trim(), shot = async n => { if (out) { await p.waitForTimeout(400); await p.screenshot({ path: path.join(out, `trade_${name}_${n}.png`) }); } };
    const answer = async v => { await p.fill('#ans', String(v)); await p.click('#try'); await p.waitForTimeout(200); };
    const chip = n => p.locator(`#toy .wire[data-n="${n}"]`);
    const scan = async (n, wrongFirst) => { await chip(n).click(); await p.waitForTimeout(150); expect(await q(), new RegExp(`Planet ${n} is ${P[n][0]} light-years away\\. It pays ${fmt(P[n][1])} gems`), 'the scan question for ' + n);
      if (wrongFirst) { await p.fill('#ans', String(fuel(n) === Math.floor(P[n][0] / 10) * 10 ? fuel(n) + 10 : fuel(n) - 10)); await p.fill('#ans2', String(pay(n))); await p.click('#try'); expect(await msg(), P[n][0] % 10 === 5 ? /exactly halfway.*Halfway goes up/ : /Which is nearer/, 'the help for a wrong distance on ' + n);
        await p.fill('#ans', String(fuel(n))); await p.fill('#ans2', String(pay(n) + 100)); await p.click('#try'); expect(await msg(), /Which is nearer/, 'the help for wrong gems on ' + n); }
      await p.fill('#ans', String(fuel(n))); await p.fill('#ans2', String(pay(n))); await p.click('#try'); await p.waitForTimeout(150); expect(await p.textContent('#info'), new RegExp(`Planet ${n} is scanned: ${fuel(n)} tokens of fuel, ${fmt(pay(n))} gems`), 'scanned ' + n); };
    const flyRoute = async () => { const f = await p.evaluate(() => trFuel(widget.sel)); await p.click('#try'); await p.waitForTimeout(200); expect(await q(), /How many fuel tokens does it need in all\?/, 'the child adds the route\'s fuel (v97)'); await answer(f + 10); expect(await msg(), /Not yet\. Add the tokens for each planet/, 'a wrong fuel total'); await answer(f); return f; };
    const landed = async () => { await p.waitForFunction(() => widget && widget.kind === 'trade' && !widget.fly && widget.step !== 'fly', null, { timeout: 30000 }).catch(() => bad.push(name + ': the ship never arrived')); await p.waitForTimeout(200); };
    // 0. the beacon is silent until the city has a plan
    await p.evaluate(() => { skipIntro(); S.ended = true; S.mode = 'space'; S.at = 'numerix'; SP.x = GAL.numerix.x; SP.y = GAL.numerix.y; save(); }); await p.waitForTimeout(1500);
    expect(await say('trade'), /silent.*energy plan/, 'the beacon before Voltara has a plan'); if (await p.evaluate(() => !$('toy').hidden)) bad.push(name + ': the trade map opened too early');
    await p.evaluate(() => { V().plan = [0, 1]; save(); }); expect(await say('hint'), /trade beacon/, 'the hint names the beacon once it is open');
    await p.evaluate(() => { S.v = null; }); await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.locator('#t_space').tap(); await p.waitForTimeout(1600); expect(await last(), /Teacher shortcut.*trade beacon is open/, 'the teacher shortcut to space'); await shot('0_beacon');
    // 1. tap the beacon on the picture. The idea comes first.
    const st = await p.locator('.stage').boundingBox(); await p.touchscreen.tap(st.x + st.width * .2, st.y + st.height * .26); await p.waitForTimeout(300);
    expect(await p.textContent('#toy').catch(() => ''), /Voltara needs supplies[\s\S]*low on supplies[\s\S]*You have 3 trips\. Make as many gems as you can\./, 'the briefing first: why, and the goal (v97, from Marc\'s Task 2 page)'); await shot('1_brief'); await p.click('#try'); await p.waitForTimeout(200);
    expect(await p.textContent('#toy .eyebrow').catch(() => ''), /See it first/, 'then rounding to the nearest ten is shown'); await shot('1_demo'); await p.click('#try'); await p.waitForTimeout(200);
    expect(await q(), /You have 50 fuel tokens/, 'the plan for trip 1'); if ((await p.locator('#toy .wire').count()) !== 10) bad.push(name + ': trip 1 should offer the 10 near planets');
    // 2. scan, with wrong answers first. F is exactly halfway (5).
    await scan('A', true); await scan('F', true); await scan('C'); await scan('I'); await scan('G');
    await p.click('#try'); expect(await msg(), /Put a planet on your route/, 'an empty route');
    await chip('I').click(); await chip('A').click(); { const f = await p.evaluate(() => trFuel(widget.sel)); await p.click('#try'); await p.waitForTimeout(200); await answer(f); expect(await msg(), /Right\. But your ship has only 50 tokens\. Change the route\./, 'a route that is too far'); await p.click('#leave'); await p.waitForTimeout(150); } await chip('I').click();
    // tap Planet C on the map itself
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(150); const posC = await p.evaluate(() => trPos('C')), st2 = await p.locator('#cv').boundingBox(); if (st2.height < 150) bad.push(name + ': the star map is squeezed to ' + Math.round(st2.height) + ' px while planning'); await p.touchscreen.tap(st2.x + posC[0], st2.y + posC[1]); await p.waitForTimeout(200); await chip('F').click();
    const sel = await p.evaluate(() => widget.sel.slice().sort().join('')); if (sel !== 'ACF') bad.push(name + ': the route should be A, C and F after tapping C on the map: ' + sel);
    ok(!(await p.$('#used')) && !/of 50 tokens/.test(await p.textContent('#toy')), 'no running total of the fuel (v97: Marc\'s rule, never show the adding)'); await shot('2_plan');
    { const fit = await p.evaluate(() => { const t = $('toy').getBoundingClientRect(), bb = $('try').getBoundingClientRect(); return bb.bottom <= t.bottom + 1 && bb.top >= t.top; }); if (!fit && name === 'ipad') bad.push(name + ': the Fly button is cut off'); }
    const cards0 = await p.evaluate(() => S.cards.length); await flyRoute(); await p.waitForTimeout(300); await shot('3_flying'); await landed();
    const e1 = pay('A') + pay('C') + pay('F'); expect(await q(), /How many gems did you earn/, 'the selling sum'); await answer(e1 - 100); expect(await msg(), /Not yet/, 'a wrong sum'); await answer(e1);
    expect(await last(), new RegExp(`Trip 1 is done\\. You earned ${fmt(e1)} gems\\..*far planets are open.*200 gems for every 10 tokens.*You earn a card`), 'the end of trip 1'); if (e1 !== 2000) bad.push(name + ': A + C + F should earn 2,000');
    if ((await p.evaluate(() => S.cards.length)) !== cards0 + 1) bad.push(name + ': the first trip should give one card'); expect(await p.textContent('#status'), /Gems 2,000/, 'the gems chip');
    // 3. trip 2: the far planets, and fuel must be paid for
    expect(await say('trade'), /hail the trade beacon/, 'back to the beacon'); expect(await q(), /You have 2,000 gems\. Fuel costs 200 gems for every 10 tokens\. Your tank holds 100 tokens\./, 'the plan for trip 2'); ok(!/So you can buy/.test(await q()), 'the game does not work out the tokens for the child');
    if ((await p.locator('#toy .wire').count()) !== 20 || !(await chip('A').isDisabled())) bad.push(name + ': trip 2 should show 20 planets, with A already visited');
    await scan('O'); await scan('S'); await scan('N'); await chip('O').click(); await chip('S').click(); await chip('N').click(); { const f = await p.evaluate(() => trFuel(widget.sel)); await p.click('#try'); await p.waitForTimeout(200); await answer(f); expect(await msg(), /Right\. But your tank holds only 100 tokens\./, 'too much fuel on trip 2'); await p.click('#leave'); await p.waitForTimeout(150); } await chip('N').click(); await shot('4_trip2');
    const f2 = fuel('O') + fuel('S'); await flyRoute(); await p.waitForTimeout(200); expect(await q(), new RegExp(`needs ${f2} tokens\\. Every 10 tokens cost 200 gems`), 'the fuel question'); await answer(f2 * 2); expect(await msg(), /How many lots of 10 tokens\? Each lot costs 200\./, 'help with the fuel cost, with no worked sum'); await answer(f2 * 20); await landed();
    const e2 = pay('O') + pay('S'); await answer(e2); const left2 = 2000 - f2 * 20; expect(await q(), new RegExp(`You had 2,000 gems\\. The fuel cost ${fmt(f2 * 20)}\\. That left ${fmt(left2)}\\. Then you earned ${fmt(e2)}`), 'the gems question'); await answer(left2 + e2);
    const g2 = left2 + e2; expect(await last(), new RegExp(`Trip 2 is done\\. You now have ${fmt(g2)} gems`), 'the end of trip 2'); if (g2 !== 4900) bad.push(name + ': O + S should leave 4,900 gems, got ' + g2);
    // 4. trip 3: N and M. M costs more in fuel than it pays.
    await say('trade'); await scan('M'); await chip('N').click(); await chip('M').click(); const f3 = fuel('N') + fuel('M'); await flyRoute(); await p.waitForTimeout(200); await answer(f3 * 20); await landed();
    const e3 = pay('N') + pay('M'); await answer(e3); await answer(g2 - f3 * 20 + e3); const g3 = g2 - f3 * 20 + e3;
    expect(await last(), new RegExp(`Trip 3 is done\\. You now have ${fmt(g3)} gems\\. Planet M paid ${fmt(pay('M'))}, but its fuel cost ${fmt(fuel('M') * 20)}\\. You lost ${fuel('M') * 20 - pay('M')} gems there\\. Your trading season is over`), 'the end of trip 3, with the loss told');
    // 5. the season summary, and a new season
    await say('trade'); await p.waitForTimeout(200); const sum = await p.evaluate(() => $('toy').innerText.replace(/\s+/g, ' ')); await shot('5_season');
    if (!/Your trading season/.test(sum) || !new RegExp(`You finish with ${fmt(g3)} gems\\. You are a master trader`).test(sum) || !/record is 7,000/.test(sum) || !/1 A, C, F free 2,000 2,000/.test(sum)) bad.push(name + ': the season summary: ' + sum);
    await p.click('#try'); await p.waitForTimeout(200); const fresh = await p.evaluate(() => ({ trip: TRADE().trip, gems: TRADE().gems, seen: TRADE().seen.length, scans: TRADE().scan.length, best: TRADE().best, season: TRADE().season }));
    if (fresh.trip !== 1 || fresh.gems !== 0 || fresh.seen !== 0 || fresh.scans !== 9 || fresh.best !== g3 || fresh.season !== 2) bad.push(name + ': a new season: ' + JSON.stringify(fresh));
    await p.click('#leave'); await p.reload(); await p.waitForTimeout(600); const kept = await p.evaluate(() => S.trade && S.trade.season === 2 && S.trade.scan.length === 9 && S.mode === 'space'); if (!kept) bad.push(name + ': the trade was not saved');
    // 6. with a real plan on Voltara, the beacon opens without the shortcut, and landing still works
    await p.evaluate(() => { S.tTrade = false; V().plan = [0, 1, 3]; save(); }); expect(await say('trade'), /hail the trade beacon/, 'the beacon opens after an energy plan'); await p.click('#leave'); expect(await say('land'), /land on Planet Voltara/, 'landing still works');
    console.log(`${name}: a season of ${fmt(g3)} gems`); await ctx.close();
  }
  for (const t of bad) console.log('  PROBLEM', t);
  console.log('console errors:', errs.length ? errs : 'none'); console.log('RESULT:', !bad.length && !errs.length ? 'PASS' : 'FAIL'); await b.close();
})().catch(e => { console.error('FAILED', e.message.split('\n')[0], '| at', (String(e.stack).match(/galactic_trade_test.js:\d+:\d+/) || [''])[0], '|', (e.message.match(/[^\n]*intercepts pointer events[^\n]*/) || e.message.match(/[^\n]*not (visible|enabled|stable)[^\n]*/) || [''])[0].trim()); process.exit(1); });
