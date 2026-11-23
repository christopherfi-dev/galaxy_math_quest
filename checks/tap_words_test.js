// A tapped word goes into the box.
// [Source: Marc, 2026-11-19, feeding the Gumblefish: "I keep thinking I can just tap that word to add instead of typing. But it just talks about them.
//  And then I can't easily tap the word into the blank."]
//   - type "feed the", tap Gumblefish: the word is added and the command runs. Before, the typing was thrown away and the fish was only looked at.
//   - tap a doing word, a thing in the bag, then a thing in the place: three taps, no typing.
//   - tap a thing first: it waits in the box. A doing word after it runs. "Do it" looks at it.
//   - "feed gumblefish" uses the fruit the cadet carries. Each kind of place shows its own doing words. Whole-command words still run at once.
// Run: node checks/tap_words_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-flyin', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 200)}"`); };
    const idle = async () => { for (let i = 0; i < 120; i++) { if (await p.evaluate(() => PL.to == null && !PL.then && !(S.mode === 'station' && ((P.route && P.route.length) || P.then)) && !(S.mode === 'chrono' && CM.route.length))) return; await p.waitForTimeout(100); } bad.push(name + ': still walking'); };
    const st = async () => { await p.waitForTimeout(250); await idle(); await p.waitForTimeout(150); return p.evaluate(() => ({ last: lines[lines.length - 1].text || '', box: $('cmd').value })); };
    const here = async wd => { await p.tap(`#nouns button[data-w="${wd}"]`); return st(); }, verb = async v => { await p.tap(`#verbs .word[data-v="${v}"]`); return st(); }, bag = async i => { await p.tap(`#bag .word[data-i="${i}"]`); return st(); }, doIt = async () => { await p.tap('#say button[type="submit"]'); return st(); };
    const river = () => p.evaluate(() => { closeToy(); const v = V(); v.fed = false; v.crossed = false; if (!S.inv.includes('burst')) S.inv.push('burst'); drawBag(); vGo('river', .3); PL.fade = 0; $('cmd').value = ''; CHIPN = ''; });
    try {
    await p.evaluate(() => { skipIntro(); goVoltara(); }); await p.waitForTimeout(400);
    ok(await p.evaluate(() => Array.from(document.querySelectorAll('#verbs .word[data-v]')).map(x => x.dataset.v).join()) === 'look,take,use,give,talk,eat,dig,go', 'Voltara should show its own doing words, with give, talk, eat and dig');
    // ---- Marc's own moment: type "feed the", then tap the word
    await river(); await p.waitForTimeout(300); await p.fill('#cmd', 'feed the '); let r = await here('gumblefish'); expect(r.last, /Gulp! The Gumblefish spins/, 'typed "feed the", tapped Gumblefish');
    // ---- three taps, no typing: give, the fruit in the bag, the fish
    await river(); await p.waitForTimeout(300); r = await verb('give'); ok(r.box === 'give ', 'GIVE should start the box: "' + r.box + '"'); r = await bag('burst'); ok(r.box === 'give flavorburst to ', 'the fruit should be added, with "to": "' + r.box + '"'); expect(r.last, /Give the FlavorBurst to what\? Tap a thing\./, 'the game asks what to give it to');
    if (out) await p.screenshot({ path: path.join(out, `tapwords_${name}.png`) }); r = await here('gumblefish'); expect(r.last, /Gulp! The Gumblefish spins/, 'give, FlavorBurst, Gumblefish'); ok(r.box === '', 'the box is empty after a command runs');
    // ---- two taps: give, the fish. The fruit you carry is used.
    await river(); await p.waitForTimeout(300); await verb('give'); r = await here('gumblefish'); expect(r.last, /Gulp!/, 'give + Gumblefish should use the fruit you carry');
    await river(); await p.evaluate(() => { S.inv = S.inv.filter(i => i !== 'burst'); drawBag(); }); await p.fill('#cmd', 'feed gumblefish'); r = await doIt(); expect(r.last, /I only want a FlavorBurst\. They grow on the tree by your ship/, 'feeding with nothing to give says where the fruit grows');
    // ---- a thing first: it waits. Then a doing word runs it.
    await river(); await p.waitForTimeout(300); r = await here('gumblefish'); ok(r.box === 'gumblefish ', 'a thing tapped first should wait in the box: "' + r.box + '"'); expect(r.last, /Gumblefish\. Now tap a doing word\. Or tap Do it to look\./, 'the game says what to do next'); ok(!(await p.evaluate(() => V().fed)), 'nothing should have run yet');
    r = await verb('talk'); expect(r.last, /I am SO hungry|FlavorBurst/, 'thing first, then TALK'); ok(r.box === '', 'box empty after thing then doing word');
    // ---- a thing first, then Do it: look
    await river(); await p.waitForTimeout(300); await here('gumblefish'); r = await doIt(); expect(r.last, /A Gumblefish giggles in the sparkling river/, 'a thing alone, then Do it, looks at it');
    // ---- two things first, then the doing word
    await river(); await p.waitForTimeout(300); await bag('burst'); r = await here('gumblefish'); ok(r.box === 'flavorburst gumblefish ', 'two things wait together: "' + r.box + '"'); r = await verb('give'); expect(r.last, /Gulp!/, 'fruit, fish, then GIVE');
    // ---- typing after a tap is the child's own sentence: Do it must not add "look"
    await river(); await p.waitForTimeout(300); await here('gumblefish'); await p.fill('#cmd', 'gumblefish'); await p.type('#cmd', ' '); r = await doIt(); ok(!/giggles in the sparkling river/.test(r.last), 'typed text is not turned into "look": ' + r.last);
    // ---- look and eat with a doing word first still take one more tap
    await river(); await p.waitForTimeout(300); await verb('look'); r = await here('stones'); expect(r.last, /river is wide and deep|stepping stones/, 'LOOK then stepping stones');
    // ---- the station keeps its own doing words; use + bag + thing still works
    await p.evaluate(() => { goStation(); }); await p.waitForTimeout(500); ok(await p.evaluate(() => Array.from(document.querySelectorAll('#verbs .word[data-v]')).map(x => x.dataset.v).join()) === 'look,take,open,push,use,go', 'the station keeps look, take, open, push, use, go');
    const sThing = await p.evaluate(() => { const id = Object.keys(OBJ).find(i => OBJ[i].room === S.room && objOn(OBJ[i])); let it = S.inv.find(i => BAGHOME.station.includes(i)); if (!it) { it = 'wrench'; S.inv.push(it); } drawBag(); drawWords(); return { w: OBJ[id].words[0], item: it, iw: ITEM_WORDS[it][0], away: S.inv.filter(i => !BAGHOME.station.includes(i)).length }; });
    if (sThing.away) { ok(!(await p.$(`#bag .word[data-i="burst"]`)) && /\+ \d+ more/.test(await p.textContent('#bag')), 'station: things from Voltara wait behind "+ more"'); await p.tap('#bag [data-fold]'); ok(!!(await p.$('#bag .word[data-i="burst"]')), 'station: "+ more" opens the rest'); await p.tap('#bag [data-fold]'); }
    await verb('use'); r = await bag(sThing.item); ok(r.box === `use ${sThing.iw} on `, 'station: USE then a bag thing asks "on": "' + r.box + '"'); r = await here(sThing.w); ok(r.box === '' && r.last.length > 3, 'station: use, bag thing, place thing runs: ' + r.last);
    r = await here(sThing.w); ok(r.box === sThing.w + ' ', 'station: a thing first waits'); r = await verb('look'); ok(r.box === '' && r.last.length > 3, 'station: thing then LOOK runs');
    // ---- small world and Chronosia doing words; whole-command words still run at once
    await p.evaluate(() => { goSpace(); landWorld(Object.keys(TR)[2]); }); await p.waitForTimeout(500); ok(await p.evaluate(() => Array.from(document.querySelectorAll('#verbs .word[data-v]')).map(x => x.dataset.v).join()) === 'look,touch,take,talk,go', 'a small world shows look, touch, take, talk, go');
    await p.evaluate(() => { goChronosia(); C().seen = new Array(CW * CH).fill('1').join(''); drawWords(); }); await p.waitForTimeout(600); ok(await p.evaluate(() => Array.from(document.querySelectorAll('#verbs .word[data-v]')).map(x => x.dataset.v).join()) === 'look,use,talk,go', 'Chronosia shows look, use, talk, go');
    await p.evaluate(() => { drawWords(); }); r = await here('go to tower'); ok(await p.evaluate(() => C().at === 'tower' || CM.route.length > 0 || true) && r.box === '', 'a whole-command word runs at once'); await p.waitForTimeout(2500); ok(await p.evaluate(() => C().at === 'tower'), '"go to tower" word should walk into the Clock Tower');
    await verb('talk'); r = await here('keeper'); expect(r.last, /The keeper says/, 'Chronosia: TALK then Tower Keeper');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
