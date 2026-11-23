// The three streets of Voltara can be read.  [Source: Marc, 2026-11-18: "Neighborhood 1 / Neighborhood 2 is confusing"; the signs were dark; it was hard to tell what to do]
//   - no place is called "Neighborhood". Every place has a name, a picture, words to see, and happy/unhappy values.
//   - on iPad sizes every place wears a sign with its name and its number. No sign covers another. No sign leaves the picture or sits on the street's title.
//   - the board invites a tap only while it is the next thing to do, and then shows the street's total.
//   - a game saved with the old names carries on.
// Run: node checks/street_signs_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = []; let signs = 0;
  for (const [name, w, h, wantNames] of [['ipad-wide', 1180, 820, true], ['ipad-tall', 820, 1180, true], ['ipad-old-wide', 1024, 768, true], ['ipad-old-tall', 768, 1024, true], ['board', 1920, 1080, true], ['phone', 390, 760, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-rats', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    if (name === 'ipad-wide') {
      const data = await p.evaluate(() => ({ names: SPOTS.map(s => s.name), noIcon: SPOTS.filter(s => !SPOT_ICON[s.name]).map(s => s.name), noSay: SPOTS.filter(s => !SPOT_SAY[s.name] || !VAL[s.name]).map(s => s.name), extra: Object.keys(VAL).concat(Object.keys(SPOT_SAY), Object.keys(SPOT_ICON)).filter(n => !SPOTS.some(s => s.name === n) && n !== NOMAD.name), totals: 'RCI'.split('').map(k => [CITY[k].total, CITY[k].places.reduce((a, q) => a + q[1], 0)]) }));
      ok(data.names.length === 21 && new Set(data.names).size === 21, '21 different places expected'); ok(!data.names.some(n => /neighbou?rhood/i.test(n)), 'a place is still called Neighborhood');
      ok(!data.noIcon.length, 'no picture for: ' + data.noIcon); ok(!data.noSay.length, 'no words or values for: ' + data.noSay); ok(!data.extra.length, 'words for places that do not exist: ' + data.extra);
      data.totals.forEach(([say, sum]) => ok(say === sum, `a street total is ${say} but its places add to ${sum}`)); ok(data.totals.map(t => t[0]).join() === '750,880,590', 'street totals changed: ' + data.totals);
      const mig = await p.evaluate(() => { skipIntro(); S.v = { sc: 'homes', need: {}, rules: 21, day: 2, hist: [{ day: 1, dark: ['Neighborhood 1', 'Zoo', 'Neighborhood 2'] }] }; return V().hist[0].dark.join(); }); ok(mig === 'Round Houses,Zoo,Stilt Houses', 'an old saved game should take the new names: ' + mig);
      await p.evaluate(() => { S.v = null; });
    }
    await p.evaluate(() => { skipIntro(); goVoltara(); const v = V(); v.crossed = true; v.met = true; v.count = true; v.need = {}; PL.to = null; PL.fade = 0; save(); });
    for (const sc of ['homes', 'shops', 'works']) {
      await p.evaluate(sc => { V().sc = sc; PL.x = .5; }, sc); await p.waitForTimeout(350);
      const r = await p.evaluate(() => ({ plates: drawStreet.plates.map(q => ({ x0: q.X - q.pw / 2, x1: q.X + q.pw / 2, y0: q.py, y1: q.py + q.ph, top: q.top, lines: q.lines, need: q.need })), w: vw, h: vh, n: CITY[VSC[V().sc].k].places.map(q => q[0]) }));
      ok(r.plates.length === r.n.length, `${sc}: a sign for every place`); signs += r.plates.length;
      r.plates.forEach((q, i) => { const nm = r.n[i]; if (wantNames) ok(q.lines.join(' ') === nm, `${sc}: the sign for ${nm} reads "${q.lines.join(' ')}"`); else ok(q.lines.length === 0, `${sc}: a small screen shows numbers only`);
        ok(q.x0 >= 0 && q.x1 <= r.w && q.y0 >= 0, `${sc}: the sign for ${nm} leaves the picture`); ok(q.y1 <= q.top, `${sc}: the sign for ${nm} sits on its own roof`);
        if (wantNames) ok(q.y0 >= 52 || q.x0 > r.w * .45, `${sc}: the sign for ${nm} sits on the street's title (top ${Math.round(q.y0)})`);
        r.plates.forEach((o, j) => { if (j > i && q.x0 < o.x1 && o.x0 < q.x1 && q.y0 < o.y1 && o.y0 < q.y1) bad.push(`${name}: ${sc}: the signs for ${nm} and ${r.n[j]} overlap`); }); });
      if (out && (name === 'ipad-wide' || name === 'ipad-tall' || name === 'phone')) await p.screenshot({ path: path.join(out, `street_${name}_${sc}.png`) });
    }
    // the board: read it, add, and the total stays on it
    await p.evaluate(() => { V().sc = 'works'; PL.x = .12; act('use board'); }); await p.waitForTimeout(1800);
    const toy = await p.textContent('#toy'); ok(/Factory\s*200[\s\S]*Solar Power Plant\s*250[\s\S]*Gas Station\s*40/.test(toy), 'the board lists each place with its number: ' + toy.slice(0, 160));
    await p.fill('#ans', '590'); await p.tap('#try'); await p.waitForTimeout(400); ok(await p.evaluate(() => V().need.I === true && !widget), 'the right total should close the board');
    await p.evaluate(() => { V().sc = 'homes'; PL.x = .12; act('look round houses'); }); await p.waitForTimeout(1800);
    const said = await p.evaluate(() => lines[lines.length - 1].text); ok(/^Round Houses\. It uses 200 energy\./.test(said), 'look round houses: ' + said);
    await ctx.close();
  }
  await b.close(); console.log(`${signs} signs checked on 6 screen sizes`); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
