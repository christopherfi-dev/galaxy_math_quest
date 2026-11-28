// Voltara's chapter closes (version 104).   [Source: Marc, 2026-11-27, on Grok's feedback that the energy plan became an endless "make the same plan again" loop:
//   "I agree on most of this" and "Do your recommendations"]. Played in the game's own morning report, at iPad sideways and phone:
//   - before the Council's choice, both goals met changes nothing new (the story is not done)
//   - after it, a morning with both goals met: the Council comes out to the tower, says Voltara shines and that other worlds need the cadet, and points to the ship
//     in the Landing Meadow; a card says why; the hint points to the ship; the Council's own words change; the mission has a tenth step, now done
//   - the plan table still opens: a child may stay and plan another day; a later day that misses a goal, and one that meets both, say the right thing
//   - a child who never meets both goals: three days after the Council's choice, the hint names the ship and says Voltara stays as they leave it
//   - a game saved before version 104 (the choice made, no record of the day): counted from its next morning report
// Run: node checks/voltara_shine_test.js
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  for (const [name, w, h] of [['ipad', 1180, 745], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { window.GMQ_NO_CARDPOP = true; try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); localStorage.setItem('gmq-words', 'open'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(500);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 200)}"`); };
    const last = () => p.evaluate(() => (lines[lines.length - 1] || {}).text || '');
    const report = async (happy, unhappy, expected) => { await p.evaluate(([hh, uu, e]) => { widget = { kind: 'log', step: 0, tries: 0, miss: 0, pp: { happy: hh, unhappy: uu, harms: [], smoke: 0 }, mood: hh - uu, sp: 0, gives: [], expected: e, theft: 0, actual: Math.min(2000, e), lost: 0 }; logStep(); }, [happy, unhappy, expected]);
      if (Math.min(happy, unhappy) > 0 && happy !== unhappy) { await p.fill('#ans', String(Math.abs(happy - unhappy))); await p.click('#try'); await p.waitForTimeout(150); }
      await p.fill('#ans', String(expected)); await p.click('#try'); await p.waitForTimeout(400); return last(); };
    try {
      await p.evaluate(() => { skipIntro(); goVoltara(); const v = V(); Object.assign(v, { crossed: true, met: true, count: true, need: { R: 1, C: 1, I: 1 }, short: true, plan: [0], planDay: 4, lost: true, houses: true, day: 4, supply: 1700, hist: [] }); delete v.final; delete v.shone; delete v.finalDay; save(); });
      // before the Council's choice: both goals, but the story is not done
      expect(await report(1500, 400, 1700), /The city needs a plan for today\.$/, 'both goals before the choice: nothing new yet'); ok(await p.evaluate(() => !V().shone), 'not closed before the choice');
      // a game saved before 104: the choice made, no day recorded
      await p.evaluate(() => { V().final = true; delete V().finalDay; save(); });
      expect(await report(1000, 600, 1700), /The city needs a plan for today\.$/, 'a day missing a goal'); ok(await p.evaluate(() => V().finalDay === V().day), 'an old save is counted from its next morning');
      // three days later, still no both goals: the hint names the ship
      await p.evaluate(() => { const v = V(); v.day = v.finalDay + 3; v.planDay = v.day - 1; save(); });
      expect(await p.evaluate(() => planetHint()), /fly on from your ship, in the Landing Meadow, at any time\. Voltara stays as you leave it\./, 'the hint after three days');
      ok(await p.evaluate(() => !vDone('shone') || (V().hist || []).some(d => d.okP && d.okE)), 'the tenth step follows the days');
      // the morning both goals are met: the chapter closes
      const cards0 = await p.evaluate(() => S.cards.length);
      const said = await report(1500, 400, 1700);
      expect(said, /The Council comes out to the tower\. "Voltara shines\.[^"]*Other worlds need you, Commander\." Your ship waits in the Landing Meadow\. Fly on, or stay and plan another day\. You earn a card\./, 'the Council closes the chapter');
      ok(await p.evaluate(n => V().shone && S.cards.length === n + 1 && /For making Voltara shine\./.test(S.cards[S.cards.length - 1].why), cards0), 'shone, and a card that says why');
      ok(await p.evaluate(() => vDone('shone') && STEPS.length === 10), 'the tenth mission step is done');
      await p.evaluate(() => { V().planDay = V().day - 1; }); expect(await p.evaluate(() => planetHint()), /^Voltara shines\. Your ship waits in the Landing Meadow: fly on when you are ready\./, 'the hint points to the ship');
      expect(await p.evaluate(() => councilSays()), /We can make our own plans now, Commander\. Thank you\. Other worlds need you\./, 'the Council\'s words change');
      // stay and plan another day
      await p.evaluate(() => { closeToy(); startPlan(); }); ok(await p.evaluate(() => widget && widget.kind === 'plan'), 'the plan table still opens'); await p.evaluate(() => closeToy());
      expect(await report(900, 600, 1500), /The city needs a plan for today\. Your ship waits in the Landing Meadow when you are ready\./, 'a later day missing a goal');
      expect(await report(1500, 400, 1700), /Voltara shines again\. Your ship waits in the Landing Meadow\. Or plan another day\./, 'a later day meeting both');
      ok(await p.evaluate(n => S.cards.length === n + 1, cards0), 'only one card for the chapter');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Voltara\'s chapter closes: every check passed, on two screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
