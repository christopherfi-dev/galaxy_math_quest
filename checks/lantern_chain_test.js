// The black cave and the lantern across the planets (version 96): the Chronosia build list's stages 3 and 4.
//   [Source: Marc, 2026-11-23: "A black cave. Need lantern. Lanterns are made on another planet... They need soft sand... Use math to calculate how much sand.
//    Told they need a glow stone... Finally go to cave. Somehow leads to an epic card." The glow stone from a trader at Galactic Trade; grams are fine.]
//   [Proposal: the Chronosia story note, tasks 9 to 12 and section 5a] Played as a child plays it, at iPad sideways, iPad upright and phone size:
//   THE NUMBERS, worked out again here a different way, on 20,000 seeds each: the tide table (walked minute by minute), the gear door, the sand.
//   THE CHAIN: the black cave (a glow stone lights only your hand) → the broken lantern → the Keeper knows its mark → Nomad Hollow on Voltara → soft sand on
//     Xylophora (the leaf print first) → the scale (too little, too much, then right; the picture never shows a total) → a glow stone from the trader → the lantern
//     → the tide table (full of water, half way and back, the first and last safe minute) → the gear door (too few, too many, right: the epic card) → the workshop
//     (the plans, the last page, the Long Spring, the small door) → the lamp room → out by the stone door, and back in.
//   ANOTHER ORDER: soft sand first, before the lantern is known; Voltara's own glow stone, no trader; the Keeper never asked.
//   ALSO: closing the game in the cave, the workshop and the lamp room; old saves (the cave's old question answered; the stone door opened; the old gear door
//     opened; the leaf print dug); every line said passes the kind-words check.
// Run: node checks/lantern_chain_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], said = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  const open = async (name, w, h) => { const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); ['gmq-cards', 'gmq-hazards', 'gmq-rats', 'gmq-wisps', 'gmq-flyin'].forEach(k => localStorage.setItem(k, 'off')); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(400); return p; };
  // ---- the numbers, on 20,000 seeds
  { const p = await open('numbers', 800, 600); const r = await p.evaluate(() => { const bad = [], seen = { tide: {}, gear: {}, sand: {} };
      for (let i = 1; i <= 20000; i++) { const seed = i * 7 + 3, T = cTide(seed), g = cGearsN(seed); seen.tide[[T.W, T.out1, T.in2, T.out2, T.in3].join()] = 1; seen.gear[g.big + '/' + g.a] = 1;
        const gaps = [T.in2 - T.out1, T.in3 - T.out2], ok = []; for (let s = 0; s < 720; s++) { const dry = (T.out1 <= s && s < T.in2) || (T.out2 <= s && s < T.in3), nxt = s < T.in2 ? T.in2 : T.in3; if (dry && s + T.W <= nxt) ok.push(s); if ((dry && s + T.W <= nxt) !== tideOk(T, s) && bad.length < 8) bad.push(`tide ${seed}: the game and a minute-by-minute walk disagree at ${s}`); }
        if (gaps.filter(x => x >= T.W).length !== 1) bad.length < 8 && bad.push(`tide ${seed}: ${gaps} with a walk of ${T.W}`); if (!ok.length || ok[ok.length - 1] - ok[0] !== ok.length - 1) bad.length < 8 && bad.push(`tide ${seed}: the safe minutes are not one stretch`);
        if (ok.filter(s => s % 5 === 0).length < 2) bad.length < 8 && bad.push(`tide ${seed}: fewer than two safe starts on a five`); if (T.in3 >= 600 || T.now < 50 || T.now >= T.out1 || [T.out1, T.in2, T.out2, T.in3].some(x => x % 5)) bad.length < 8 && bad.push(`tide ${seed}: a time out of range`);
        if (g.big !== g.a * g.k || g.a < 4 || g.a > 9 || g.k < 3 || g.k > 8 || g.big > 72) bad.length < 8 && bad.push(`gear ${seed}: ${JSON.stringify(g)}`); }
      for (let i = 1; i <= 20000; i++) { S.c = S.c || {}; const keep = S.c.seed; S.c.seed = i * 7 + 3; const n = lanNums(), t = 4 * n.p + n.L; S.c.seed = keep; seen.sand[n.p + '/' + n.L] = 1;
        if (t % 10 || t > 1000 || n.p + n.L === t || 4 * n.p === t || Math.floor(t / 100) > 9) bad.length < 8 && bad.push(`sand: ${JSON.stringify(n)}`); }
      return { bad, tides: Object.keys(seen.tide).length, gears: Object.keys(seen.gear).length, sands: Object.keys(seen.sand).length }; });
    if (r.bad.length) bad.push('numbers: ' + r.bad.join(' | ')); console.log(`Numbers: 20,000 seeds each. ${r.tides} different tide tables, ${r.gears} gear doors, ${r.sands} sand recipes. ${r.bad.length} bad.`); await p.context().close(); }
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const p = await open(name, w, h), ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); }, no = (got, re, what) => { if (re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = async () => { const t = await p.evaluate(() => lines[lines.length - 1].text || ''); said.push(t); return t; };
    const idle = async () => { for (let i = 0; i < 300; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const shot = async n => { if (out) { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(400); await p.screenshot({ path: path.join(out, `lantern_${name}_${n}.png`) }); } };
    const has = i => p.evaluate(i => S.inv.includes(i), i), at = () => p.evaluate(() => C().at), msg = async () => { const t = (await p.textContent('#msg')).trim(); said.push(t); return t; };
    const toChron = async () => { await p.evaluate(() => { closeToy(); goChronosia(); C().seen = new Array(CW * CH).fill('1').join(''); save(); }); await p.waitForTimeout(300); };
    try {
      await p.evaluate(() => { skipIntro(); }); await toChron();
      // ---- the black cave
      await say('go to cave'); ok(await at() === 'cave', 'into the cave'); expect(await last(), /Daylight reaches only the way in\. Beyond it, the cave is black\. In the daylight lies a broken lantern\./, 'the cave is black (R18)');
      ok(!(await p.evaluate(() => cThings('cave').some(t => t.id === 'wall' || t.id === 'passage'))), 'no wall table and no passage to be seen in the dark');
      expect(await say('go down'), /You take one step into the dark\. You cannot see your own feet\. You need a light\./, 'the dark, with no light');
      await p.evaluate(() => give('stone')); expect(await say('look dark'), /It lights your hand\. The dark swallows the rest\./, 'a glow stone lights only your hand (fault 17)'); expect(await say('use dark'), /You need a bigger light\./, 'a glow stone is not enough');
      await p.evaluate(() => { PL.x = .5; }); await shot('1_black_cave_glow_stone');
      expect(await say('hint'), /Look at the broken lantern by the way in\./, 'the first hint'); expect(await say('look lantern'), /maker's mark: a number in a ring\./, 'the broken lantern and its tag');
      expect(await say('take lantern'), /Someone could mend it\. Who made it\?/, 'take the broken lantern'); ok(await has('blantern'), 'the broken lantern is in the bag'); expect(await say('hint'), /The Tower Keeper knows old things\./, 'the hint points to the Keeper');
      await say('leave'); await say('go to tower'); expect(await say('talk keeper'), /Nomad work\. The Clockmaker carried it\.[\s\S]*on Voltara now/, 'the Keeper knows the mark'); no(await say('talk keeper'), /Nomad work/, 'and says it once');
      await say('leave'); await say('go to cave'); expect(await say('hint'), /The Nomads made the lantern\. They live on Voltara, in Nomad Hollow\./, 'the cave hint after the Keeper');
      // ---- Voltara: Nomad Hollow
      await p.evaluate(() => { closeToy(); goVoltara(); V().sc = 'hollow'; PL.x = .7; save(); }); await p.waitForTimeout(300); expect(await say('hint'), /The glassmaker by the furnace knows that lantern\./, 'the Voltara hint');
      expect(await say('talk glassmaker'), /Our mark! We made this lantern[\s\S]*round cacti stand in a ring/, 'the glassmaker knows the lantern, and where the sand is'); await shot('2_hollow');
      // ---- Xylophora: the print first, then soft sand
      await p.evaluate(() => { closeToy(); goXylophora(); const c = XY(); c.x = XDIG[0]; c.y = XDIG[1]; save(); }); await p.waitForTimeout(300);
      expect(await say('dig'), /leaf print|square leaf/, 'the first dig: the leaf print'); ok(!(await has('sand')), 'no sand yet'); expect(await say('take sand'), /soft as flour\. You fill a sack with it\./, 'then soft sand'); ok(await has('sand'), 'a sack of soft sand');
      expect(await say('dig'), /The sand under it is soft as flour\./, 'one sack is enough');
      // ---- the scale
      await p.evaluate(() => { closeToy(); goVoltara(); V().sc = 'hollow'; PL.x = .7; save(); }); await p.waitForTimeout(300); expect(await say('talk glassmaker'), /The glassmaker leads you to the furnace\./, 'the glassmaker says something as the scale opens'); ok(await p.evaluate(() => widget && widget.kind === 'scale'), 'the scale opens');
      const n = await p.evaluate(() => lanNums()), want = 4 * n.p + n.L, put = async v => { const c = [Math.floor(v / 100), Math.floor(v % 100 / 50), Math.floor(v % 50 / 10)], now = await p.evaluate(() => S.lant.on.slice()); for (let i = 0; i < 3; i++) { for (let k = now[i]; k > c[i]; k--) await p.click(`#toy [data-sub="${i}"]`); for (let k = now[i]; k < c[i]; k++) await p.click(`#toy [data-add="${i}"]`); } };
      ok(await p.locator('#stageview #lscale').count() === 1, 'the scale fills the picture'); { const t = await p.evaluate(() => document.body.innerText); ok(!new RegExp('\\b' + want + '\\b').test(t), 'nothing shows the total'); expect(t, new RegExp(`Each pane takes ${n.p} grams of sand\\. The lantern has 4 panes\\. The lens takes ${n.L} grams\\.`), 'the recipe'); expect(t, /A jar takes 2 scoops of 30 grams/, 'a finished example first'); }
      await p.click('#try'); expect(await msg(), /Put weights on the scale first\./, 'an empty scale');
      await put(want - 10); await shot('3_scale'); await p.click('#try'); await p.waitForTimeout(150); expect(await msg(), /The glass runs out before the last pane is whole\./, 'too little sand');
      await put(want + 50); await p.click('#try'); await p.waitForTimeout(150); expect(await msg(), /thick and cloudy/, 'too much sand'); ok(await has('sand'), 'a wrong pour loses nothing');
      await put(want); await p.click('#try'); await p.waitForTimeout(250); expect(await last(), /four clear panes and a round lens[\s\S]*needs a whole glow stone\." You earn a card\.( You have a glow stone\. Talk to the glassmaker again\.)?$/, 'the right weight'); ok(!(await has('sand')), 'the sand is used'); ok(await p.evaluate(() => S.log.some(l => /glass for the Clockmaker/.test(l.what) && /3\.MD\.2/.test(l.skill) && /try 3/.test(l.result))), 'the teacher\'s log');
      // ---- a glow stone from the trader (this cadet gave theirs away first, to test the trader)
      await p.evaluate(() => { S.inv = S.inv.filter(i => i !== 'stone'); save(); }); expect(await say('talk glassmaker'), /Voltaran traders sell glow stones at the trade beacon, for 200 gems\./, 'the glassmaker names the trader');
      await p.evaluate(() => { closeToy(); goSpace(); S.at = 'numerix'; SP.to = null; S.tTrade = 1; TRADE().gems = 120; save(); }); await p.waitForTimeout(300);
      ok(await p.evaluate(() => hereWords().some(x => x[0] === 'buy glow stone')), 'the trader is a word to tap'); expect(await say('buy glow stone'), /"Glow stones! 200 gems each\." You have 120 gems\./, 'not enough gems');
      await p.evaluate(() => { TRADE().gems = 250; save(); }); expect(await say('buy glow stone'), /You pay 200 gems\.[\s\S]*glows as far as your hand\./, 'buy a glow stone'); ok(await has('stone') && await p.evaluate(() => TRADE().gems === 50), 'the stone, and 50 gems left');
      await p.evaluate(() => { closeToy(); goVoltara(); V().sc = 'hollow'; PL.x = .7; save(); }); await p.waitForTimeout(300); expect(await say('talk glassmaker'), /behind the new glass\. The lantern blazes\.[\s\S]*You have a lantern\./, 'the lantern is made');
      ok(await has('lantern') && !(await has('stone')) && !(await has('blantern')), 'the lantern in the bag; the stone and the broken lantern gone into it');
      await p.evaluate(() => { if (!S.secrets.includes('stone')) S.secrets.push('stone'); save(); }); await p.reload(); await p.waitForTimeout(700); ok(!(await has('stone')) && await has('lantern'), 'opened again: the glow stone does not come back out of the lantern');
      ok(await p.evaluate(() => vLit()), 'the lantern lights Voltara\'s tunnel too');
      // ---- the cave, lit: the tide table
      await toChron(); await say('go to cave'); expect(await last(), /Your lantern lights the cave\.[\s\S]*Water fills it\./, 'the cave, lit'); ok(await p.evaluate(() => cThings('cave').some(t => t.id === 'wall') && cThings('cave').some(t => t.id === 'passage')), 'the wall table and the passage show by lantern light');
      expect(await say('hint'), /Read the table on the wall\./, 'the cave hint, lit'); await p.evaluate(() => { PL.x = .45; }); await shot('4_cave_lit');
      await say('use passage'); ok(await p.evaluate(() => widget && widget.kind === 'tide'), 'the passage asks for the minute'); ok(await p.locator('#stageview #ctide').count() === 1, 'the table fills the picture');
      const T = await p.evaluate(() => cTide(C().seed)), hm = m => [Math.floor(m / 60) % 12 || 12, m % 60], safe = []; for (let s = T.out1; s < T.in3; s++) if (await p.evaluate(([T, s]) => tideOk(T, s), [T, s])) safe.push(s);
      { const t = await p.locator('#stageview #ctide').textContent(); ok(t.includes(String(hm(T.out1)[0]) + ':' + String(hm(T.out1)[1]).padStart(2, '0')), 'the table shows when the water goes out'); expect(await p.textContent('#toy'), new RegExp(`My walk down takes ${T.W} minutes`), 'the walk'); expect(await p.textContent('#toy'), /Like the bridge gate[\s\S]*In time\./, 'a finished example first'); }
      await shot('5_tide');
      const step = async m => { const [hh, mm] = hm(m); await p.fill('#ah', String(hh)); await p.fill('#am', String(mm).padStart(2, '0')); await p.click('#try'); await p.waitForTimeout(250); };
      await p.fill('#ah', '13'); await p.fill('#am', '00'); await p.click('#try'); expect(await msg(), /not a time a clock can show/, 'a time that cannot be');
      await step(T.out1 - 5); expect(await msg(), /The passage is full of water\. You wade back\./, 'too early: still full'); ok(!(await p.evaluate(() => CK().tide)), 'a wrong minute changes nothing');
      const lastSafe = safe[safe.length - 1]; await step(lastSafe + 5); expect(await msg(), /Half way down, the water comes in\. It rises to your knees\. You wade back\./, 'dry, but too late: half way and back');
      await step(lastSafe); await p.waitForTimeout(400); ok(await p.evaluate(() => CK().tide), 'the last safe minute is right (the walk ends as the water comes in)');
      expect(await p.evaluate(() => lines.slice(-3).map(l => l.text || '').join(' | ')), /with dry feet\. You know the dry times now\. You earn a card\./, 'the dry walk');
      // ---- the gear door
      ok(await p.evaluate(() => widget && widget.kind === 'gear2'), 'the gear door comes next'); const G = await p.evaluate(() => widget.g); expect(await p.textContent('#toy'), new RegExp(`big wheel with ${G.big} teeth[\\s\\S]*small wheel with ${G.a} teeth[\\s\\S]*Three turns, and the bar is across`), 'the gear door, with a finished example');
      const turn = async n2 => { await p.fill('#ans', String(n2)); await p.click('#try'); await p.waitForTimeout(400); if (n2 === G.k) await shot('6_gears_turning'); for (let i = 0; i < 60; i++) { if (await p.evaluate(() => !widget || !widget.an)) break; await p.waitForTimeout(100); } await p.waitForTimeout(200); };
      await turn(G.k - 1); expect(await msg(), /The bolt stops short\./, 'too few turns'); await turn(G.k + 1); expect(await msg(), /goes past the mark\. The bolt springs back\./, 'too many turns');
      const gold0 = await p.evaluate(() => S.cards.filter(c => c.r === 'gold').length); await turn(G.k); ok(await at() === 'shop', 'the right turns open the door to the workshop');
      ok(await p.evaluate(g => S.cards.filter(c => c.r === 'gold').length === g + 1, gold0), 'the epic card inside'); expect(await p.evaluate(() => lines.slice(-3).map(l => l.text || '').join(' | ')), /You earn an EPIC card\./, 'the epic card is said');
      // ---- the workshop
      await shot('7_workshop'); { const near = await p.evaluate(() => cThings('shop').map(t => t.id + '@' + t.x).join()); ok(/plans@0\.1,.*bench@0\.24|bench@0\.24.*plans@0\.1/.test(near) || /bench@0\.24/.test(near), 'the workshop things sit over their drawings: ' + near); } expect(await say('look plans'), /41, 38, 52, 35, 39\. The sixth has no tally\./, 'the makers\' marks'); expect(await say('look bench'), /I asked for a night guard\. The Council said no\. So I leave my guard for you\./, 'the last page');
      expect(await say('take spring'), /It fits an engine core\. The Council has the last one\./, 'the Long Spring'); ok(await has('spring'), 'the spring in the bag');
      expect(await say('use small door'), /You slide the bolt back\./, 'the small door'); expect(await say('go stair'), /The Lamp Room\./, 'up the stair'); expect(await say('look lamp'), /It lights this room, and no more\./, 'the lamp');
      await p.reload(); await p.waitForTimeout(700); ok(await at() === 'stair', 'closed and opened again in the lamp room');
      await say('leave'); ok(await at() === 'map', 'out by the stone door'); ok(await p.evaluate(() => { const s = fStand('chrono', FINDS.chrono.find(f => f.id === 'door')); return C().x === s[0] && C().y === s[1]; }), 'outside the stone door');
      expect(await say('look door'), /stands open\. A small lamp room is behind it\./, 'the stone door from outside'); await say('go door'); ok(await at() === 'stair', 'in by the stone door'); await say('go down'); ok(await at() === 'shop', 'down to the workshop');
      await p.reload(); await p.waitForTimeout(700); ok(await at() === 'shop', 'closed and opened again in the workshop'); await say('leave'); ok(await at() === 'cave', 'the workshop leads back to the cave'); expect(await say('go down'), /You walk down the passage, in a dry minute\./, 'once is enough: no more tide');
      await say('leave'); await say('leave');
      // ---- old saves
      await p.evaluate(() => { const c = C(); c.fk = { cave: 1, door: 1 }; S.inv = S.inv.filter(i => i !== 'lantern'); S.inv.push('stone'); save(); }); await p.reload(); await p.waitForTimeout(700); await toChron();
      await say('go to cave'); expect(await last(), /The cave is black now\. Whatever lit it before has gone out\./, 'an old save that answered the old wall'); expect(await say('go down'), /You need a bigger light\./, 'it cannot reach the workshop with a glow stone'); await say('leave');
      expect(await say('look door'), /stands open/, 'an old save that opened the stone door'); await say('go door'); ok(await at() === 'stair', 'into the lamp room'); expect(await say('go down'), /bolted from the other side/, 'the old stone door is not a way round'); await say('leave');
      await p.evaluate(() => { const c = C(); c.fk = { gears: 1 }; S.inv.push('lantern'); save(); }); await say('go to cave'); await say('use passage'); ok(await p.evaluate(() => widget && widget.kind === 'tide'), 'an old save past the old gear door still reads the tide once'); await step(lastSafe); await p.waitForTimeout(500); ok(await at() === 'shop', 'then goes straight down, with no second gear door');
      await shot('8_old_save');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    { const rude = await p.evaluate(t => t.filter(x => rude(x)), said); if (rude.length) bad.push(name + ': unkind words: ' + rude.join(' | ')); }
    await p.context().close(); }
  { // ---- ANOTHER ORDER: Xylophora's sand first, before anyone mentions a lantern; Voltara's own glow stone (no trader); the Keeper never asked
    const name = 'other order', p = await open(name, 1180, 745), ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const idle = async () => { for (let i = 0; i < 300; i++) { if (await p.evaluate(() => !CM.route.length && !CM.then && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); const r = await p.evaluate(() => lines[lines.length - 1].text || ''); said.push(r); return r; };
    try {
      await p.evaluate(() => { skipIntro(); goXylophora(); const c = XY(); c.x = XDIG[0]; c.y = XDIG[1]; save(); }); await p.waitForTimeout(300); await say('dig'); expect(await say('dig'), /You fill a sack with it\./, 'soft sand can be taken before the lantern is known');
      await p.evaluate(() => { closeToy(); goVoltara(); V().sc = 'hollow'; PL.x = .7; save(); }); await p.waitForTimeout(300); expect(await say('talk glassmaker'), /We make glass\. Our little lights are crumbs of glow stone behind glass\./, 'the glassmaker, before the lantern');
      await p.evaluate(() => { give('stone'); if (!S.secrets.includes('stone')) S.secrets.push('stone'); save(); });      // Voltara's tall-tree glow stone, a secret there
      await p.evaluate(() => { closeToy(); goChronosia(); C().seen = new Array(CW * CH).fill('1').join(''); save(); }); await p.waitForTimeout(300); await say('go to cave'); await say('take lantern'); ok(await p.evaluate(() => S.inv.includes('blantern')), 'the broken lantern');
      await p.evaluate(() => { closeToy(); goVoltara(); V().sc = 'hollow'; PL.x = .7; save(); }); await p.waitForTimeout(300); expect(await say('talk glassmaker'), /leads you to the furnace/, 'sand already in the bag: the scale opens at once, with no need to visit the Keeper');
      const n = await p.evaluate(() => lanNums()), want = 4 * n.p + n.L, c = [Math.floor(want / 100), Math.floor(want % 100 / 50), Math.floor(want % 50 / 10)]; for (let i = 0; i < 3; i++) for (let k = 0; k < c[i]; k++) await p.click(`#toy [data-add="${i}"]`); await p.click('#try'); await p.waitForTimeout(300);
      expect(await p.evaluate(() => lines[lines.length - 1].text || ''), /You have a glow stone\. Talk to the glassmaker again\./, 'right first time, with a glow stone already');
      expect(await say('talk glassmaker'), /You have a lantern\./, 'the lantern, from Voltara\'s own stone'); ok(await p.evaluate(() => S.inv.includes('lantern') && !S.inv.includes('stone') && TRADE().gems === 0), 'no gems were spent');
      await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(() => S.inv.includes('lantern') && !S.inv.includes('stone')), 'opened again: still one lantern, no loose stone');
      await p.evaluate(() => { closeToy(); goChronosia(); save(); }); await p.waitForTimeout(300); await say('go to cave'); expect(await say('look passage'), /Water fills it\./, 'the cave by lantern light');
    } catch (e) { bad.push(`${name}: stopped: ${String(e.message).split('\n')[0]}`); }
    await p.context().close(); }
  await b.close(); if (errs.length) bad.push('script errors: ' + [...new Set(errs)].slice(0, 5).join(' | '));
  console.log(`${said.length} lines read.`); console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'The black cave and the lantern: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
