// Space hazards (quick sums against the clock) and kinder replies to doing words the game has no use for.
// [Source: Marc, 2026-11-18: asteroids, space worms, solar winds, a wormhole; four addition levels; a speed to hit; a record for each player; "cut down the tree" said "use a verb"]
//   - the sum makers: 5,000 rounds for each level. Every sum fits its level. No sum comes twice in a round.
//   - a hazard is played with the number pad: passed, a slip, too slow, flown around. A flight always goes on.
//   - the record (level, best time, tries) is kept after a reload. The teacher switch turns hazards off.
//   - "cut down the tree", "climb", "kick", "dig a hole" get a real answer in all three kinds of place.
// Run: node checks/space_hazards_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(250); return last(); };
    const expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const arrive = async () => { for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !SP.to && !!S.at)) return; await p.waitForTimeout(100); } bad.push(name + ': the ship never arrived'); };
    const key = async d => { await p.tap(`#padkeys button[data-k="${d}"]`); };
    const answer = async (wrongFirst) => { const q = await p.evaluate(() => widget.qs[widget.i]), a = String(q[0] + q[1]);
      if (wrongFirst) { const wr = String(q[0] + q[1] === 10 ? 11 : q[0] + q[1] + (a.length === 1 && q[0] + q[1] === 9 ? -1 : 1)); for (const d of wr.slice(0, a.length)) await key(d); await p.waitForTimeout(60); }
      for (const d of a) await key(d); await p.waitForTimeout(40); };
    const playAll = async () => { await p.tap('#hzgo'); await p.waitForTimeout(150); for (let i = 0; i < 10; i++) await answer(false); await p.waitForTimeout(200); };

    if (name === 'ipad') {   // ---- the sum makers
      const gen = await p.evaluate(() => { const res = { bad: [], n: 0 }; for (let lvl = 1; lvl <= 4; lvl++) for (let k = 0; k < 5000; k++) { const qs = fluRound(lvl), seen = {};
        if (qs.length !== 10) res.bad.push(`level ${lvl}: a round of ${qs.length}`);
        for (const [a, b] of qs) { res.n++; const s = a + b, key = Math.min(a, b) + '+' + Math.max(a, b); if (seen[key]) res.bad.push(`level ${lvl}: ${key} twice`); seen[key] = 1; let good;
          if (lvl === 1) good = a >= 1 && b >= 1 && s <= 10; else if (lvl === 2) good = a >= 1 && b >= 1 && a <= 10 && b <= 10 && s >= 11 && s <= 20;
          else if (lvl === 3) good = a >= 10 && b >= 10 && a % 10 + b % 10 <= 9 && s <= 99; else good = a >= 10 && b >= 10 && a % 10 + b % 10 >= 10 && s <= 99;
          if (!good && res.bad.length < 8) res.bad.push(`level ${lvl}: ${a} + ${b}`); } } return res; });
      ok(gen.n === 200000, 'sum makers: expected 200,000 sums, got ' + gen.n); gen.bad.slice(0, 8).forEach(x => bad.push('sum makers: ' + x));
      console.log(`sum makers: ${gen.n.toLocaleString()} sums checked, ${gen.bad.length} wrong`);
    }

    // ---- into space, hazards on
    await p.evaluate(() => { skipIntro(); goSpace(); }); await p.waitForTimeout(200);
    ok(await p.evaluate(() => hereWords().some(x => x[0] === 'practice')), 'no "quick sums" word in the Here row');
    expect(await say('fly to metrica'), /something is in the way/i, 'a flight should meet a hazard');
    ok(await p.evaluate(() => widget && widget.kind === 'haz' && widget.lvl === 1 && !SP.to), 'level 1 hazard should be open, and the ship should wait');
    expect(await p.textContent('#toy'), /Asteroid field[\s\S]*Count on[\s\S]*10 sums in 40 seconds/, 'the first screen shows the hazard, the quick way and the goal');
    if (out) await p.screenshot({ path: path.join(out, `hazard_${name}_1_tip.png`) });
    await p.tap('#hzgo'); await p.waitForTimeout(200);
    ok(await p.evaluate(() => !$('pad').hidden && $('ans').getAttribute('inputmode') === 'none'), 'the number pad should be up, with no full keyboard');
    const vis = await p.evaluate(() => { const r = $('hzq').getBoundingClientRect(), pr = $('pad').getBoundingClientRect(); return { inView: r.top >= 0 && r.bottom <= innerHeight, clear: pr.left >= r.right || pr.top >= r.bottom || pr.bottom <= r.top || pr.right <= r.left || pr.left > $('ans').getBoundingClientRect().right }; });
    ok(vis.inView, 'the sum is not in view'); ok(vis.clear, 'the number pad covers the sum');
    // On an iPad a task takes the desk, so there is no box to type in during a hazard (sketch version 43). On a phone the box is still there and the game says where you are.
    if (await p.isVisible('#cmd')) expect(await say('fly to databa'), /space hazard/i, 'typing during a hazard'); else ok(await p.evaluate(() => document.body.classList.contains('desk') && !!document.getElementById('leave')), 'during a hazard on an iPad the desk should hold only the hazard, with its own way out');
    await answer(true); ok(await p.evaluate(() => widget.miss === 1 && widget.i === 1), 'a wrong answer should count one slip, then the right one moves on');
    if (out) await p.screenshot({ path: path.join(out, `hazard_${name}_2_sum.png`) });
    for (let i = 1; i < 10; i++) await answer(false); await p.waitForTimeout(250);
    expect(await last(), /made it through the asteroid field.*rare card.*space worms.*fly on to Galaxy Metrica/i, 'passing level 1');
    let st = await p.evaluate(() => ({ f: S.flu, cards: S.cards.map(c => c.r), log: S.log[S.log.length - 1], to: SP.to, w: !!widget }));
    ok(st.f.lvl === 2 && st.f.pass[1] === 1 && st.f.best[1] >= 1 && st.f.tries[1] === 1, 'record after a pass: ' + JSON.stringify(st.f)); ok(st.cards[st.cards.length - 1] === 'rare', 'a first pass earns a rare card');
    expect(st.log.result, /passed: 10 sums in \d+ s \(goal 40 s\), 1 slips, slowest: \d+ \+ \d+/, 'the log line for a pass'); ok(st.to === 'metrica' && !st.w, 'the flight should go on after the hazard');
    await arrive(); ok(await p.evaluate(() => S.at === 'metrica'), 'should arrive at Metrica');

    // ---- too slow: the level stays, the flight still goes on
    await p.evaluate(() => { HAZ[2].secs0 = HAZ[2].secs; HAZ[2].secs = 2; }); await say('fly to databa');
    ok(await p.evaluate(() => widget && widget.lvl === 2), 'the next flight should meet level 2'); expect(await p.textContent('#toy'), /Space worms[\s\S]*Make ten/, 'level 2 screen');
    await p.tap('#hzgo'); await p.waitForTimeout(100); await answer(false); await p.waitForTimeout(2400);
    expect(await last(), /Too slow this time. You did 1 of 10.*Make ten first.*fly on to Galaxy Databa/i, 'too slow');
    st = await p.evaluate(() => ({ f: S.flu, n: S.cards.length, log: S.log[S.log.length - 1], to: SP.to })); ok(st.f.lvl === 2 && !st.f.pass[2] && st.f.tries[2] === 1, 'record after a fail: ' + JSON.stringify(st.f));
    expect(st.log.result, /not yet: 1 of 10 sums in 2 s/, 'the log line for a fail'); ok(st.to === 'databa', 'a failed hazard must not stop the flight'); await arrive();
    await p.evaluate(() => { HAZ[2].secs = HAZ[2].secs0; });

    // ---- fly around it, then a reload keeps the record
    await say('fly to numerix'); await p.tap('#leave'); await p.waitForTimeout(200); expect(await last(), /long way around.*fly on to Galaxy Numerix/i, 'fly around it'); ok(await p.evaluate(() => S.flu.lvl === 2 && SP.to === 'numerix'), 'flying around keeps the level and goes on'); await arrive();
    await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(400);
    ok(await p.evaluate(() => S.flu && S.flu.lvl === 2 && S.flu.pass[1] === 1 && S.flu.tries[2] === 1), 'the record should be kept after a reload');

    // ---- practice by typing; an old level again gives no card unless it is a new best
    await say('practice 1'); ok(await p.evaluate(() => widget && widget.lvl === 1 && widget.dest === null), '"practice 1" should open level 1'); const n0 = await p.evaluate(() => { S.flu.best[1] = 1; return S.cards.length; });
    await playAll(); expect(await last(), /made it through.*Your best is 1 seconds/i, 'an old level again'); ok(await p.evaluate(n => S.cards.length === n && !SP.to, n0), 'no new card for an old level that is not a new best, and no flight');
    await say('practice 4'); ok(await p.evaluate(() => widget && widget.lvl === 2), '"practice 4" must not skip ahead'); await p.tap('#leave'); await p.waitForTimeout(150);

    // ---- levels 2, 3 and 4: the last one earns gold, and then flights are clear
    for (const [lvl, dest, re] of [[2, 'metrica', /space worms.*rare card.*solar wind/i], [3, 'databa', /solar wind.*rare card.*wormhole pull/i], [4, 'geometrica', /wormhole pull.*gold card.*every hazard/i]]) {
      await say('fly to ' + dest); ok(await p.evaluate(l => widget && widget.lvl === l, lvl), `flight should meet level ${lvl}`); if (lvl >= 3) expect(await p.textContent('#toy'), /Tens first\. Then ones\. Then add\./, `level ${lvl} shows tens first`);
      if (out && lvl === 4) await p.screenshot({ path: path.join(out, `hazard_${name}_3_wormhole.png`) });
      await playAll(); expect(await last(), re, `passing level ${lvl}`); await arrive(); }
    st = await p.evaluate(() => ({ f: S.flu, last: S.cards[S.cards.length - 1].r })); ok(st.f.lvl === 5 && st.last === 'gold', 'after level 4: ' + JSON.stringify(st));
    expect(await say('fly to numerix'), /You fly to Galaxy Numerix/, 'no hazard once all four are passed'); ok(await p.evaluate(() => !widget), 'no hazard screen once all are passed'); await arrive();

    // ---- the teacher switch
    await p.evaluate(() => { S.flu = { lvl: 1, best: {}, tries: {}, pass: {} }; const c = $('hazOn'); c.checked = false; c.onchange(); });
    expect(await say('fly to metrica'), /You fly to Galaxy Metrica/, 'hazards off: a plain flight'); ok(await p.evaluate(() => !widget && getKeep('gmq-hazards') === 'off'), 'hazards off should be remembered'); await arrive();

    // ---- doing words the game has no use for
    await p.evaluate(() => { goStation(); }); await p.waitForTimeout(300);
    const sThing = await p.evaluate(() => { const id = Object.keys(OBJ).find(i => OBJ[i].room === S.room && objOn(OBJ[i])); return [OBJ[id].words[0], OBJ[id].label]; });
    expect(await say('cut down the ' + sThing[0]), new RegExp(`You have no tool to cut the ${sThing[1]}\\. It stays as it is\\. Here you can: look, take, open, push or use\\.`), 'station: cut');
    expect(await say('kick ' + sThing[0]), /Cadets do no harm\. You leave the .* alone\./, 'station: kick'); expect(await say('hug ' + sThing[0]), /You try to hug the .*\. Nothing happens\. Here you can/, 'station: hug');
    expect(await say('blorp ' + sThing[0]), /Start with a doing word: look, take, open, push or use\./, 'station: a word the game does not know'); expect(await say('dig a hole'), /You dig at the floor/, 'station: dig a hole');
    await p.evaluate(() => { goVoltara(); }); await p.waitForTimeout(400);
    const vThing = await p.evaluate(() => { const t = vThings().find(t => t.x != null); return [t.words[0], t.label]; });
    expect(await say('cut down the ' + vThing[0]), /You have no tool to cut the .*\. It stays as it is\. Here you can: look, take, push, use, talk or dig\./, 'Voltara: cut'); expect(await say('paint ' + vThing[0]), /You try to paint the /, 'Voltara: paint'); expect(await say('knock ' + vThing[0]), /You try to knock on the /, 'Voltara: knock');
    await p.evaluate(() => { goSpace(); landWorld(Object.keys(TR)[3]); }); await p.waitForTimeout(400);
    const wThing = await p.evaluate(() => { const t = wThings(wKit(WORLD().at)).find(t => t.id !== 'ship' && t.id !== 'creature'); return [t.words[0], t.label]; });
    expect(await say('chop ' + wThing[0]), /You have no tool to chop the .*Here you can: look, touch, take or talk\./, 'small world: chop'); expect(await say('dig a hole'), /You dig a small hole\. Nothing is under it/, 'small world: dig a hole');
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
