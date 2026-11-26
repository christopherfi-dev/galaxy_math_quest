// Chronosia's things lead to each other (version 87).   [Source: Marc, 2026-11-22: the tortoise, the cougar, the pond, the key and the cave "doesn't connect to
// anything"; "Touching the cave should have you go into the cave because it's a new place"; "connecting all these things together... not just weird standalone".]
// [Proposal: all of it] Three trails, played as a child plays them, by tapping and by typing, at iPad size and at phone size:
//   THE CAVE [v96]: a tap on the cave walks there and goes in. It is black: no wall table and no passage can be seen, and a glow stone lights only your hand.
//     The hint points to the broken lantern. With the lantern (the chain, the tide table and the gear door are played in checks/lantern_chain_test.js),
//     the passage leads into the Clockmaker's workshop. The plan shows the cougar's keyhole.
//     Leave goes back to the cave, then to the map, beside the cave. Closed and opened again inside the workshop: still there, and Leave still works.
//   THE KEY: the sundial, the boat, the tin box. The tin box gives the clockmaker's key. The key will not turn in a stopped cougar. Wound, the cougar takes
//     the key and goes to guard the time portal: the rock is empty, the key leaves the bag, the crack leaves the sky, the portal says so, the case's ending says so.
//   THE POND: "swim" and "dive" in the pond say why not yet and point to the tortoise. The tortoise, its job done, is cold. A glow stone is not warm.
//     A warm stone from Cougar Rock (by tap). The tortoise tells the pond's secret. The dive brings up the Clockmaker's note, which can be read again from the bag.
//   ALSO: a save from before version 87 gets the key it had earned. A save made in the cave or the workshop reads "on the map" to the class link (version 81).
// Shortcut, said plainly: the tortoise's and the cougar's own quests are marked done here. They are played in full by checks/chronosia_test.js.
// Run: node checks/chronosia_links_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  const open = async (name, w, h) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-words', 'open'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(300); return p; };
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const p = await open(name, w, h);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 250; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const unfocus = async () => { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(60); };
    const tapTile = async (x, y) => { await unfocus(); const pt = await p.evaluate(([x, y]) => { const g = cGeo(), r = cv.getBoundingClientRect(); return [r.left + g.ox + (x + .5) * g.ts, r.top + g.oy + (y + .5) * g.ts]; }, [x, y]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); };
    const tapThing = async id => { await unfocus(); const pt = await p.evaluate(id => { const t = cThings(C().at).find(t => t.id === id), r = cv.getBoundingClientRect(); return t ? [r.left + t.x * vw, r.top + vh * .7] : null; }, id); if (!pt) return bad.push(`${name}: no ${id} to tap here`); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(200); };
    const tapCorner = async () => { await unfocus(); const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + vw * .08, r.top + vh * .95]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(300); await idle(); };
    const answer = async v => { await p.fill('#ans', String(v)); await p.click('#try'); await p.waitForTimeout(200); };
    const shot = async n => { if (out) { await p.waitForTimeout(600); await p.screenshot({ path: path.join(out, `links_${name}_${n}.png`) }); } };
    const has = i => p.evaluate(i => S.inv.includes(i), i), fk = () => p.evaluate(() => Object.assign({}, CK())), at = () => p.evaluate(() => C().at);
    const q = id => p.evaluate(id => { const f = FINDS.chrono.find(f => f.id === id), s = f.at ? fStand('chrono', f) : []; return { a: fQ('chrono', f).a, stand: s }; }, id);
    const play = async (id, opts) => { opts = opts || {}; for (let guard = 0; guard < 40; guard++) { const s2 = await p.evaluate(() => widget && widget.kind === 'cq' ? { kind: widget.steps[widget.i].kind, ans: widget.steps[widget.i].ans, i: widget.i, n: widget.steps.length } : null); if (!s2) return;
        if (opts.wrongAt === s2.i && !opts.didWrong) { opts.didWrong = true; if (s2.kind === 'yn') { await p.tap(s2.ans ? '#no' : '#yes'); } else { await p.fill('#ah', '59'); if (s2.kind !== 'num') await p.fill('#am', '59'); await p.tap('#try'); } await p.waitForTimeout(120); ok(await p.evaluate(() => /\w/.test($('msg').textContent) && widget.i === widget.steps.length - widget.steps.length + widget.i), `${id}: a wrong answer should give a hint`); ok(await p.evaluate(i => widget.i === i, s2.i), `${id}: a wrong answer must not move on`); continue; }
        if (opts.leaveAt === s2.i && !opts.didLeave) { opts.didLeave = true; await p.tap('#leave'); await p.waitForTimeout(150); ok(await p.evaluate(([id, i]) => !widget && C().prog[id] === i, [id, s2.i]), `${id}: leaving should keep the place`); await say(opts.again); await p.waitForTimeout(200); ok(await p.evaluate(i => widget && widget.i === i, s2.i), `${id}: coming back should go on from step ${s2.i + 1}`); continue; }
        if (s2.kind === 'info') await p.tap('#try'); else if (s2.kind === 'yn') await p.tap(s2.ans ? '#yes' : '#no'); else if (s2.kind === 'num') { await p.fill('#ah', String(s2.ans[0])); await p.tap('#try'); } else if (s2.kind === 'time') { const a = s2.ans[s2.ans.length - 1]; await p.fill('#ah', String(a[0])); await p.fill('#am', String(a[1]).padStart(2, '0')); await p.tap('#try'); } else { await p.fill('#ah', String(s2.ans[1])); await p.fill('#am', String(s2.ans[0])); await p.tap('#try'); }
        await p.waitForTimeout(90); } bad.push(`${name}: ${id}: the quest did not end`); };
    await p.evaluate(() => { skipIntro(); goChronosia(); C().seen = new Array(CW * CH).fill('1').join(''); save(); }); await p.waitForTimeout(300);

    // ---- THE CAVE AND THE WORKSHOP [v96: the cave is black; the chain to the lantern, the tide table and the gear door are played in full by checks/lantern_chain_test.js]
    await tapTile(12, 9); ok(await at() === 'cave', 'a tap on the cave goes in'); expect(await last(), /^The Dark Cave\. A cave in the rock\. Daylight reaches only the way in\. Beyond it, the cave is black\./, 'the cave, before');
    ok(!(await p.evaluate(() => cThings('cave').some(t => t.id === 'passage' || t.id === 'wall'))), 'no passage and no wall table can be seen in the dark'); await shot('1_cave');
    await p.evaluate(() => give('stone'));      // the glow stone, a secret found on Voltara
    await tapThing('dark'); expect(await last(), /It lights your hand, and no more\./, 'a glow stone is not enough for the black cave'); ok(await p.locator('#ans').count() === 0 && await p.locator('#ah').count() === 0, 'no question in the dark');
    expect(await say('hint'), /Look at the broken lantern by the way in\./, 'the cave hint points to the broken lantern');
    await tapCorner(); ok(await at() === 'map', 'the corner goes back to the map');
    expect(await say('hint'), /The Clock Tower needs you\./, 'on the map, a main job comes first in the hint');
    await p.evaluate(() => { give('lantern'); const k = CK(); k.tide = 1; k.gears = 1; save(); });      // shortcut: the lantern, the tide and the gear door are played in checks/lantern_chain_test.js
    await say('go to cave'); ok(await at() === 'cave', 'typing "go to cave" goes in too'); expect(await say('look passage'), /The passage goes down to the open door\. The workshop is below\./, 'by lantern light');
    await shot('2_cave_lit'); await tapThing('passage'); ok(await at() === 'shop', 'the passage leads to the workshop'); await shot('3_workshop');
    expect(await say('hint'), /Look at the plan on the wall\./, 'the workshop hint');
    await tapThing('plan'); expect(await last(), /keyhole, shaped like a gear.*First wind its clock\. Then turn my guard key\. It will guard the time portal by night\./, 'the plan');
    expect(await say('use coat'), /Time portal\. One way\./, 'the coat');
    expect(await say('hint'), /Wind its clock first\./, 'the workshop hint after the plan');
    ok(await p.evaluate(() => { const j = JSON.parse(localStorage.getItem(KEY) || sessionStorage.getItem(KEY)); return j.c.at === 'map' && j.c.sub[0] === 'shop'; }), 'the save says "on the map", with a note for the workshop'); await p.reload(); await p.waitForTimeout(700); ok(await at() === 'shop', 'closed and opened again: still in the workshop');
    expect(await say('leave'), /^You walk back up the passage\. The Dark Cave\./, 'leave goes back to the cave'); ok(await at() === 'cave', 'in the cave');
    expect(await say('go down'), /You walk down the passage, in a dry minute\. The Clockmaker's Workshop\./, '"go down" goes in again');
    await tapCorner(); ok(await at() === 'cave', 'the corner in the workshop goes back to the cave');
    await say('leave'); ok(await at() === 'map', 'out on the map');

    // ---- THE KEY AND THE COUGAR
    for (const id of ['sundial', 'boat', 'tin']) { const f = await q(id); await say('use ' + id); ok(await p.locator('#ans').count() === 1, id + ' asks its question'); await answer(f.a); }
    ok(await has('clkey'), 'the tin box gives the key'); expect(await say('look tin'), /It is empty now\./, 'the tin box, after');
    expect(await say('look key'), /"Clockmaker" is scratched on it\./, 'the key can be looked at');
    await say('go to rock'); ok(await at() === 'ridge', 'at Cougar Rock');
    expect(await say('use key on cougar'), /will not turn while the cougar's clock is stopped\. Wind the clock first\./, 'a stopped cougar will not take the key'); ok(await p.evaluate(() => !widget), 'the key does not open the quest');
    await p.evaluate(() => { C().done.cougar = true; save(); });      // shortcut: the cougar's quest is played in checks/chronosia_test.js
    expect(await say('look cougar'), /keyhole, shaped like a gear/, 'the keyhole shows once it is wound');
    expect(await say('hint'), /Use the guard key on the cougar\./, 'the ridge hint (v94: "the guard key")');
    await tapThing('cougar'); expect(await last(), /runs to the time portal\. It sits down beside it\. It will guard it by night\..*Once the day turns and night comes, the crack can mend\.$/, 'the cougar goes on guard; the day is still stuck, so the crack stays (v94)');
    ok((await fk()).guard && !(await has('clkey')), 'the key stays in the cougar'); ok(await p.evaluate(() => cThings('ridge').map(t => t.id).join() === 'stones,rock'), 'the rock is empty');
    expect(await say('look'), /The rock is empty now\./, 'Cougar Rock, after'); await shot('4_ridge_empty');
    expect(await say('talk cougar'), /not here\. It guards the time portal now\./, 'talking to the empty rock'); await say('leave'); expect(await say('look'), /Stripes of colour fill the sky\. A thin crack runs across them\. A river/, 'the map, after: the crack stays while the day is stuck (v94)');
    await p.evaluate(() => { C().done.clocks = true; C().done.quakes = true; save(); }); expect(await say('look'), /Stripes of colour fill the sky\. A river/, 'the map, once the day turns'); ok(!/crack/.test(await last()), 'the crack is gone from the words once the day turns and the guard is on watch');
    expect(await say('look portal'), /The Clockwork Cougar sits beside it, on guard\./, 'the portal has its guard'); await shot('5_map_guard');
    { const endTxt = await p.evaluate(() => { fCaseEnd('chrono', fCase(C().seed)); $('keep').click(); return lines[lines.length - 1].text; }); expect(endTxt, /The cougar guards the portal by night, so no more trips can tear the sky\./, 'the case ending knows the guard'); ok(!/crack/.test(endTxt), 'no crack in the ending'); }

    // ---- THE POND, THE TORTOISE AND THE WARM STONE
    await say('go to grove'); ok(await at() === 'grove', 'in the grove');
    expect(await say('swim pond'), /too deep to hold your breath.*tortoise.*Maybe it knows a way\./, 'swim says why not yet');
    expect(await say('dive'), /too deep to hold your breath/, '"dive" on its own means the pond');
    await say('talk tortoise'); ok(await p.evaluate(() => widget && widget.kind === 'cq'), 'before its job, the tortoise asks for help with time');
    await p.evaluate(() => { closeToy(); C().done.tortoise = true; save(); });      // shortcut: the tortoise's quest is played in checks/chronosia_test.js
    expect(await say('talk tortoise'), /shivers.*Bring me something warm/, 'the tortoise is cold');
    await p.evaluate(() => give('stone')); expect(await say('give stone to tortoise'), /Pretty\. But it is not warm\./, 'a glow stone is not warm');
    expect(await say('hint'), /The stones at Cougar Rock are warm\./, 'the grove hint');
    await say('leave'); await say('go to rock'); await tapThing('stones'); expect(await last(), /You pick up a flat stone\. It is warm/, 'a tap picks up a warm stone'); ok(await has('wstone'), 'the warm stone is in the bag');
    await tapThing('stones'); expect(await last(), /already/, 'only one stone');
    expect(await say('swim'), /no water to swim in here/, 'nothing to swim in at the rock');
    await say('leave'); expect(await p.evaluate(() => cMore('map')), /You carry a warm stone\. The tortoise in the grove is cold\./, 'the map hint, once the main jobs are done');
    await say('go to grove'); await tapThing('tortoise'); expect(await last(), /You give the tortoise the warm stone\..*Time runs slow in that pond\..*Dive in\./, 'the tortoise tells its secret');
    ok((await fk()).tsecret && !(await has('wstone')), 'the stone is given');
    await tapThing('pond'); expect(await last(), /On the bottom lies a glass bottle\..*I hid the key in a tin box, on my little boat\./, 'the dive brings up the note'); ok(await has('cnote'), 'the note is in the bag'); await shot('6_grove');
    await tapThing('pond'); expect(await last(), /You dive again/, 'a second dive');
    expect(await say('read note'), /The Council said no\./, 'the note can be read again');
    expect(await say('hint'), /All is done here/, 'the grove is done');

    // ---- A SAVE FROM BEFORE VERSION 87
    await p.evaluate(() => { S.inv = S.inv.filter(i => i !== 'clkey'); const k = CK(); k.tin = 1; delete k.guard; save(); });
    await p.reload(); await p.waitForTimeout(700); ok(await has('clkey'), 'an old save gets the key it earned');

    // ---- THE GEAR DOOR'S NUMBERS
    await p.context().close();
  }
  await b.close();
  for (const e of errs) bad.push('PAGE ERROR ' + e);
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Chronosia links: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
