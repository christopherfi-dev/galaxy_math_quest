// Plays the whole of Operation Stardust (the mission ship in Galaxy Databa) in prototypes/kis_station_sketch.html.   [Proposal]
//
// NUMBERS (once, on the iPad screen):
//   - the game's own numbers for seeds 1 to 2,000 give the same check number as checks/stardust_quest_check.py
//   - every open square on the ship can be walked to; every thing can be stood beside; no thing blocks a door
// PLAY (iPad sideways, iPad upright, a phone), each with a different cadet's numbers
//   (one where a room is too hot, one where the cold room is too warm, one where a room is too cold):
//   dock from space; rooms are dark until entered; the greenhouse water (too few cans, too many, right); the radio pattern;
//   Mission Control gives the purpose; five thermometers read by walking; one written down wrong;
//   SEE IT FIRST: an old chart (about lamps, not warmth) is on the wall before the cadet draws one; copying it does not work; a glass tank shows what a gauge means;
//   the question after the chart names the sign above each thermometer, and says too hot or too cold (Marc could not tell what "breaks its plate" asked);
//   the wall chart: bars set by tapping the picture; "3 of the five do not match", then 1, then right;
//   which room breaks its plate: wrong room, too few degrees, too many, right;
//   the fuel log: the gravity month, the long run and a clear month are all refused, then the solar wind;
//   the pump before Mission Control says so; three gauges; one tank short, one right, one over; then all full;
//   the locker: food that goes bad (one kind, two kinds), 11 packs, too little, too much, an empty locker, numbers kept, then exactly enough;
//   what the crew ate: wrong kind, too few units, too many, right; cleared for launch and the epic card;
//   dead ends; tapping a thing, a wall and a far square; the right thermometer when two are in view;
//   the counts; the teacher's log; a reload; fly away; dock again;
//   the Mission button: on the ship it shows Operation Stardust, never Voltara's list; it lists only what the cadet has been asked so far;
//   away from Voltara and the ship it says "Voltara mission"; a game saved before version 51 still shows its jobs.
// Along the way it checks what Marc asked of every big quest:
//   - no wrong answer, and no hint, ever shows the right number
//   - the picture does not move or change size (iPad screens), and the page never scrolls
//   - what is drawn is what is true: the red line of each thermometer, each bar, and each gauge needle are looked at as pixels
// Answers are worked out here from the cadet's raw numbers, by this file's own sums, not by asking the game for its answer.
//
// Run:  node checks/stardust_test.js [folder for screenshots]
// Needs Node with Playwright and Chromium.
const { chromium } = require('playwright'); const path = require('path');
const CHECK = 26692101;      // the same number is in checks/stardust_quest_check.py
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [], notes = [];
  for (const [name, w, h, kind] of [['ipad', 1180, 745, 'seed'], ['ipad-tall', 820, 1100, 'food'], ['phone', 390, 760, 'cold']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${String(got).slice(0, 240)}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 250; i++) { if (await p.evaluate(() => !SM.route.length && !SM.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { if (await p.isVisible('#cmd')) { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); } else await p.evaluate(t => act(t), t); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(170); return last(); };
    const walk = async (x, y) => { await p.evaluate(([x, y]) => { sGo(x, y); }, [x, y]); await idle(); await p.waitForTimeout(300); };
    const room = async k => { const r = await p.evaluate(k => SRM[k].r, k); await walk(r[0] + 3, r[1] + 3); };
    const still = async () => { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(400); };
    const tapTile = async (x, y) => { await still(); const pt = await p.evaluate(([x, y]) => { const r = cv.getBoundingClientRect(); return [r.left + (x - SM.cx + .5) * SM.ts, r.top + (y - SM.cy + .5) * SM.ts, r.right, r.bottom, r.left, r.top]; }, [x, y]);
      if (pt[0] < pt[4] + 1 || pt[0] > pt[2] - 1 || pt[1] < pt[5] + 1 || pt[1] > pt[3] - 1) { bad.push(`${name}: square ${x},${y} is not on the screen to tap`); return; } await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(160); await idle(); await p.waitForTimeout(160); };
    const type = async n => { await p.fill('#ans', String(n)); await p.click('#try'); await p.waitForTimeout(220); };
    const msg = () => p.evaluate(() => ($('msg') || {}).textContent || '');
    const toyText = () => p.evaluate(() => $('toy').innerText);
    const back = async () => { if (await p.evaluate(() => !!widget)) { await p.click('#leave'); await p.waitForTimeout(200); } };
    const shot = async n => { if (out) await p.screenshot({ path: path.join(out, `stardust_${name}_${n}.png`) }); };
    const stage = () => p.evaluate(() => { const r = document.querySelector('.stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round).join(',') + '|' + Math.round(window.scrollY); });
    const pixel = (x, y) => p.evaluate(([x, y]) => Array.from(cx.getImageData(Math.round(x), Math.round(y), 1, 1).data).slice(0, 3), [x, y]);
    const isRed = c => c[0] > 200 && c[1] < 130 && c[2] < 120;

    if (name === 'ipad') {      // ---- the numbers
      const n = await p.evaluate(() => { let k = 0; for (let s = 1; s <= 2000; s++) { const v = sNums(s); k = (k + v.temp.reduce((a, x) => a + x, 0) * 7 + v.bad * 3 + v.off * 5 + v.T + v.shelf.reduce((a, f, i) => a + f[0].charCodeAt(0) * (i + 1), 0) + v.wm * 11 + v.gm * 13 + v.lm * 17 + v.fuel.reduce((a, x) => a + x, 0) + v.dist.reduce((a, x) => a + x, 0) + v.tanks.reduce((a, x, i) => a + x.need * (i + 2), 0) + SBOTH.indexOf(v.fell) * 19 + v.by + v.fresh[0] + v.fresh[1] + v.store[0] + v.store[1] + v.cans * 23 + v.next * 29) % 1000000007; }
        skipIntro(); goStardust(); const c = SD(), seen = {}, q = [[c.x, c.y]]; seen[c.y * SW + c.x] = 1; while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (sOpen(nx, ny) && !seen[ny * SW + nx]) { seen[ny * SW + nx] = 1; q.push([nx, ny]); } } }
        let open = 0, reach = 0; for (let y = 0; y < SH; y++) for (let x = 0; x < SW; x++) if (sOpen(x, y)) { open++; if (seen[y * SW + x]) reach++; }
        return { check: k, open, reach, noSpot: ST.filter(t => !sSpot(t)).map(t => t.id), offRoom: ST.filter(t => !sThingRoom(t) || sThingRoom(t) === 'hall').map(t => t.id), doors: SDOOR.filter(d => !sOpen(d[0], d[1] - 1) || !sOpen(d[0], d[1] + 1)).length, things: ST.length, therms: ST.filter(t => t.id.indexOf('th_') === 0).map(t => sThingRoom(t)).join(',') }; });
      ok(n.check === CHECK, `the game's numbers give check number ${n.check}, the Python check gives ${CHECK}`); ok(n.open === n.reach, `${n.open - n.reach} open squares cannot be reached`);
      ok(!n.noSpot.length && !n.offRoom.length && n.doors === 0, `things nobody can stand beside: ${n.noSpot}; things outside a room: ${n.offRoom}; blocked doors: ${n.doors}`); ok(n.therms === 'control,living,green,food,engine', `each of the five rooms needs its own thermometer: ${n.therms}`);
      notes.push(`numbers: check number ${n.check}; ${n.reach} of ${n.open} open squares can be reached; ${n.things} things, each with a place to stand`);
    }

    try {
    // ---- from space, with this cadet's own numbers
    await p.evaluate(kind => { skipIntro(); goSpace(); S.at = 'metrica'; SP.to = null; const c = SD(); if (kind === 'seed') c.seed = 4242; else { let s = kind === 'food' ? 100 : 500; while (kind === 'food' ? SRK[sNums(s).bad] !== 'food' : sNums(s).hot) s++; c.seed = s; } save(); drawWords(); }, kind); await p.waitForTimeout(300);
    expect(await say('dock'), /The mission ship is in Galaxy Databa\. Fly there first/, 'docking from the wrong galaxy');
    await p.evaluate(() => { S.at = 'databa'; SP.to = null; save(); drawWords(); }); await p.waitForTimeout(200);
    ok(await p.evaluate(() => hereWords().some(x => x[0] === 'dock')), 'Galaxy Databa should offer the mission ship');
    const cards0 = await p.evaluate(() => S.cards.length);
    expect(await say('dock'), /You dock with the mission ship/, 'docking'); ok(await p.evaluate(() => S.mode === 'star' && SD().x === 22 && SD().y === 13 && $('place').textContent === 'Airlock'), 'should stand in the airlock');
    const st0 = await stage();
    const mission = async () => { const y0 = await p.evaluate(() => window.scrollY); await p.evaluate(() => menuOpen('mission')); await p.waitForTimeout(250); const o = await p.evaluate(() => ({ btn: $('m_mission').hidden ? null : $('m_mission').textContent, shown: !$('mission').hidden && getComputedStyle($('mission')).display !== 'none', text: $('mission').innerText, rows: Array.from(document.querySelectorAll('#mission .star')).map(e => (e.classList.contains('lit') ? '[x] ' : '[ ] ') + e.textContent) })); await p.evaluate(y => { menuOpen(null); window.scrollTo(0, y); }, y0); await p.waitForTimeout(200); await p.evaluate(y => window.scrollTo(0, y), y0); return o; };
    { const m = await mission(); ok(m.btn === 'Mission' && m.shown && /Operation Stardust: 0 of 5 jobs/.test(m.text) && /Nobody has asked you for anything yet/.test(m.text) && !m.rows.length && !/Voltara/.test(m.text), `on the ship the Mission button should show Operation Stardust, with nothing asked yet: ${JSON.stringify(m).slice(0, 200)}`); }
    const v = await p.evaluate(() => { const v = sNums(SD().seed); return { temp: v.temp, p: v.p, shelf: v.shelf, fuel: v.fuel, dist: v.dist, tanks: v.tanks.map(t => [t.b, t.k]), first: v.first, last: v.last, beds: v.beds, each: v.each, can: v.can, sig: v.sig, plates: SRK.map(k => [SRM[k].lo, SRM[k].hi]), rooms: SRK.map(k => SRM[k].n), short: SRK.map(k => SRM[k].s), caps: STK.map(t => t[1]), tnames: STK.map(t => t[0]), months: SMON, both: SBOTH }; });
    // this file's own sums
    const badI = v.temp.findIndex((t, i) => t < v.plates[i][0] || t > v.plates[i][1]), off = v.temp[badI] > v.plates[badI][1] ? v.temp[badI] - v.plates[badI][1] : v.plates[badI][0] - v.temp[badI];
    const T = 4 * v.p * 3, good = v.shelf.map((f, i) => i).filter(i => v.shelf[i][2] >= 12), spoil = v.shelf.map((f, i) => i).filter(i => v.shelf[i][2] < 12); let fill = null;
    for (let a = 0; a <= 10 && !fill; a++) for (let b2 = 0; b2 <= 10 && !fill; b2++) for (let c2 = 0; c2 <= 10 && !fill; c2++) for (let d = 0; d <= 10 && !fill; d++) if (a * v.shelf[good[0]][1] + b2 * v.shelf[good[1]][1] + c2 * v.shelf[good[2]][1] + d * v.shelf[good[3]][1] === T) fill = [a, b2, c2, d];
    const wm = v.fuel.map((f, i) => i).filter(i => v.fuel[i] === Math.max(...v.fuel) && v.dist[i] === Math.min(...v.dist))[0], lm = v.dist.indexOf(Math.max(...v.dist)), gm = v.fuel.indexOf(Math.min(...v.fuel)), clear = [0, 1, 2, 3, 4, 5].find(i => i !== wm && i !== lm && i !== gm);
    const need = v.tanks.map((t, i) => v.caps[i] / t[0] * (t[0] - t[1])), falls = v.both.map(k => v.first[k] - v.last[k]), by = Math.max(...falls), fell = falls.indexOf(by), cans = v.beds * v.each / v.can, next = v.sig[3] + (v.sig[1] - v.sig[0]);
    ok(badI >= 0 && v.temp.filter((t, i) => t < v.plates[i][0] || t > v.plates[i][1]).length === 1 && fill && wm >= 0 && falls.filter(f => f === by).length === 1, 'this cadet\'s numbers should have one answer to each question');
    const noAnswer = (t, what, re) => { if (re.test(t)) bad.push(`${name}: ${what} shows an answer: "${t}"`); };
    const fillLocker = async arr => { for (let i = 0; i < 6; i++) await p.fill('#l' + i, arr[i] ? String(arr[i]) : ''); await p.click('#try'); await p.waitForTimeout(220); }, packs = o => { const a = [0, 0, 0, 0, 0, 0]; Object.keys(o).forEach(k => { a[+k] = o[k]; }); return a; };
    await shot('1_dock');

    // ---- the start: dark rooms, a first nudge, dead ends
    expect(await say('hint'), /Somebody on this ship needs you\. Look for a screen that is switched on/, 'the first nudge'); expect(await say('look'), /Airlock, on the mission ship\..*Your own ship is clamped here/, 'look, in the airlock');
    expect(await say('use chart'), /You have not found that yet/, 'the wall chart before the Control Room is found'); expect(await say('talk chief'), /not found that yet/, 'the Chief before she is found');
    expect(await say('leave'), /walk to your own ship in the airlock\. Then type: fly/, 'leave'); expect(await say('dance'), /./, 'a word that means nothing here'); expect(await say('look ship'), /Your own little ship, clamped to the airlock/, 'look ship');
    ok(await p.evaluate(() => SD().seen.join() === 'lock'), 'only the airlock should be known at the start');
    await walk(22, 13); await say('north'); ok(await p.evaluate(() => SD().x === 22 && SD().y === 10), 'north should walk three squares, to the airlock door'); await say('north'); await say('north');
    ok(await p.evaluate(() => $('place').textContent === 'Greenhouse' && SD().seen.indexOf('green') >= 0 && SD().seen.indexOf('hall') >= 0 && SD().seen.indexOf('control') < 0), 'three times north should end in the Greenhouse, with the corridor known and the Control Room still dark');
    ok(await p.evaluate(() => hereWords().map(x => x[1]).join() === 'watering can,plant beds,thermometer'), 'the Here row should list what is in the Greenhouse');

    // ---- the greenhouse: litres
    expect(await say('look plants'), /The soil looks dry/, 'dry plants'); expect(await say('take plants'), /The crew will need every leaf/, 'the plants are not yours'); expect(await say('talk plants'), /You talk to the plant beds\. No answer/, 'plants do not talk');
    await say('use can'); ok(await p.evaluate(() => widget && widget.kind === 'sask'), 'the can should ask a question'); expect(await toyText(), new RegExp(`${v.beds} plant beds\\. Each bed drinks ${v.each} litres a day\\. This can holds ${v.can} litres`), 'the note on the can'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the can opened: ${st0} became ${await stage()}`);
    await type(cans - 1); { const t = await last(); expect(t, /The water runs out\. Some beds are still dry/, 'too few cans'); noAnswer(t, 'too few cans', new RegExp(`\\b${cans}\\b`)); } ok(await p.evaluate(() => !widget), 'a wrong count of cans should close the box');
    await say('use can'); await type(cans + 2); { const t = await last(); expect(t, /you have water left over/, 'too many cans'); noAnswer(t, 'too many cans', new RegExp(`\\b${cans}\\b`)); }
    await say('use can'); await type(cans); expect(await last(), new RegExp(`You carry ${cans} full cans\\. Every bed gets its ${v.each} litres\\..*You earn a card`), 'the right cans'); expect(await say('look plants'), /bright and wet/, 'wet plants');
    await say('use thermometer'); ok(await p.evaluate(() => SD().at === 'th' && SD().k === 'green' && $('place').textContent === 'A thermometer'), 'the Greenhouse thermometer should open'); ok(!/\d/.test(await toyText()), 'the thermometer task must not print any number');
    await still(); { const g = await p.evaluate(() => SM.geo), Y = t => g.B - (g.B - g.top) * t / 40, t = v.temp[2]; ok(isRed(await pixel(g.X, Y(t) + 4)) && !isRed(await pixel(g.X, Y(t) - 4)), `the Greenhouse thermometer should show ${t}: its red line should end there`); } await shot('2_thermometer');
    if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the thermometer opened: ${st0} became ${await stage()}`);
    expect(await toyText(), /A thermometer, with a sign above it\. Nobody has asked you about it yet\./, 'before Mission Control asks, a thermometer only shows itself'); ok(await p.locator('#ans').count() === 0, 'no clipboard box before Mission Control asks'); await p.click('#leave'); await p.waitForTimeout(150);

    // ---- the living quarters: a pattern on the radio; one reading written down wrong
    await room('living'); expect(await say('use bunks'), /The bunk is hard\. Space is not a hotel/, 'the bunks'); expect(await say('take bunks'), /bolted down/, 'the bunks stay'); expect(await say('push bunks'), /It does not move/, 'pushing the bunks');
    await say('use radio'); expect(await toyText(), new RegExp(`${v.sig.join(' beeps\\. ')} beeps\\. Then it waits`), 'the signal'); await type(next + 1); { const t = await last(); expect(t, /starts again from the beginning/, 'a wrong answer to the signal'); noAnswer(t, 'the wrong signal reply', new RegExp(`\\b${next}\\b`)); }
    await say('talk radio'); await type(next); expect(await last(), new RegExp(`You send ${next} beeps\\..*Somebody out there can count! You earn a card`), 'the right answer to the signal'); expect(await say('use radio'), /something beeps it back/, 'the radio afterwards');
    await say('use thermometer'); ok(await p.evaluate(() => SD().k === 'living'), 'the nearest thermometer should be the one in this room'); ok(await p.locator('#ans').count() === 0, 'still no clipboard box'); await p.click('#leave'); await p.waitForTimeout(150);

    // ---- the Control Room: the purpose, and no steps
    await room('control'); { const t = await say('talk mission'); expect(t, /How warm is each of the five rooms\? Send us a chart\. And what went wrong with the fuel on the last trip\? The Central Computer has the record/, 'Mission Control gives the purpose'); noAnswer(t, 'Mission Control', /thermometer|plate|\bsigns?\b|scale|step of|solar/i); }
    { const m = await mission(); ok(m.rows.length === 2 && /^\[ \] A chart for Mission Control/.test(m.rows[0]) && /^\[ \] Find what went wrong with the fuel/.test(m.rows[1]), `after Mission Control speaks, the Mission panel should hold its two jobs and no others: ${m.rows.join(' | ')}`); noAnswer(m.text.replace(/Your clipboard:[^\n]*/, ''), 'the Mission panel', new RegExp(`\\b(${v.temp.join('|')}|${T})\\b|thermometer|sign|scale`)); ok(!/Your clipboard/.test(m.text), 'no clipboard yet'); }
    // ---- now the thermometers ask for the clipboard, and say why  [Source: Marc, 2026-11-20]
    await room('green'); await say('use thermometer'); expect(await toyText(), /Mission Control wants to know how warm each room is\. Read the thermometer\./, 'the thermometer says why');
    await p.click('#try'); expect(await msg(), /Type a number first/, 'an empty reading'); await type(v.temp[2]); expect(await last(), new RegExp(`You write on your clipboard: Greenhouse, ${v.temp[2]} degrees`), 'writing a reading down');
    await room('living'); await say('use thermometer'); await type(v.temp[1] + 2); await room('control');
    { const m = await mission(); expect(m.text, new RegExp(`Your clipboard: Control \\? · Living ${v.temp[1] + 2} · Green ${v.temp[2]}`), 'the Mission panel keeps the clipboard'); }
    expect(await say('use pump'), /not found that yet/, 'the pump before the Engine Room is found'); await say('look chart'); ok(await p.evaluate(() => SD().at === 'old' && $('place').textContent === 'The wall chart'), 'look chart should show last trip\'s chart'); expect(await toyText(), /An old chart is still pinned here\. It is about lamps: how many each room has\.[\s\S]*It ends three lines above 20\. Each line is a step of 2\. So the Greenhouse has 26 lamps/, 'the finished chart, with one bar read aloud'); noAnswer((await toyText()).replace(/Maths word[^\n]*/, ''), 'the old chart must not be about warmth, or a cadet will compare it with this trip', /degree|warm|temperature|last trip/i);
    await still(); { const g = await p.evaluate(() => sGeo(0, sTop(), vw, vh, 5)), x = g.L + g.cw * 2.5, Y = t => g.B - (g.B - g.T) * t / 40, c1 = await pixel(x, Y(26) + 5), c0 = await pixel(x, Y(26) - 5); ok(c1[0] > 130 && c1[2] > 160 && !(c0[0] > 130 && c0[1] > 150 && c0[2] > 160), 'on last trip\'s chart the Greenhouse bar should end at 26, as the words say'); } await shot('3a_last_trips_chart'); await back();
    { const seen = []; for (let i = 0; i < 4; i++) seen.push(await say('hint')); expect(seen[0], /Every room has a thermometer/, 'chart nudge 1'); expect(seen[1], /step of 2/, 'chart nudge 2'); expect(seen[2], /Above every thermometer is a sign\. Read the signs again/, 'chart nudge 3'); expect(seen[3], /That is all the help there is/, 'no more chart nudges'); seen.forEach(t => noAnswer(t, 'a chart nudge', new RegExp(`\\b(${v.temp.join('|')}|${v.rooms[badI]})\\b`))); }
    await say('use thermometer'); await type(v.temp[0]);
    await say('use chart'); ok(await p.evaluate(() => SD().at === 'old' && /Start a new chart/.test($('try').textContent)), 'the first time, the chart should show last trip\'s chart before a new one is started'); await p.click('#try'); await p.waitForTimeout(250);
    ok(await p.evaluate(() => SD().at === 'chart' && SD().sawOld && widget && widget.kind === 'schart' && $('place').textContent === 'The wall chart'), 'the wall chart should open'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the chart opened: ${st0} became ${await stage()}`);
    expect(await p.evaluate(() => $('sclip').textContent), new RegExp(`Control ${v.temp[0]} · Living ${v.temp[1] + 2} · Green ${v.temp[2]} · Food \\? · Engine \\?`), 'the clipboard on the chart');
    const setBar = async (i, val) => { await still(); const pt = await p.evaluate(([i, val]) => { const g = sGeo(0, sTop(), vw, vh, 5), r = cv.getBoundingClientRect(); return [r.left + g.L + g.cw * (i + .5), r.top + g.B - (g.B - g.T) * val / 40]; }, [i, val]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(140); };
    const barShown = async (i, val) => { const g = await p.evaluate(() => { const g = sGeo(0, sTop(), vw, vh, 5); return g; }), x = g.L + g.cw * (i + .5), Y = t => g.B - (g.B - g.T) * t / 40, c1 = await pixel(x, Y(val) + 5), c0 = await pixel(x, Y(val) - 5); return c1[2] > 200 && c1[0] < 160 && !(c0[2] > 200 && c0[0] < 160 && c0[1] > 150); };
    { const OLD = [20, 22, 26, 4, 24], d = OLD.filter((t, i) => t !== v.temp[i]).length; for (let i = 0; i < 5; i++) await setBar(i, OLD[i]); ok(await p.evaluate(o => SD().bars.join() === o.join(), OLD), 'the bars should copy last trip\'s chart'); await p.click('#try'); await p.waitForTimeout(200); expect(await msg(), new RegExp(`${d} of the five bars do(es)? not match`), 'copying last trip\'s chart does not work'); ok(d >= 1, 'last trip\'s chart can never be this trip\'s'); await setBar(3, 0); await setBar(4, 0); }
    await setBar(0, v.temp[0]); await setBar(1, v.temp[1] + 2); await setBar(2, v.temp[2]); ok(await p.evaluate(([a, b2, c2]) => SD().bars.join() === [a, b2, c2, 0, 0].join(), [v.temp[0], v.temp[1] + 2, v.temp[2]]), `tapping the chart should set the bars: ${await p.evaluate(() => SD().bars.join())}`);
    await p.waitForTimeout(200); ok(await barShown(0, v.temp[0]) && await barShown(2, v.temp[2]), 'the bars drawn should end where they were set'); await shot('3_chart');
    await p.click('#try'); await p.waitForTimeout(200); { const t = await msg(); expect(t, /3 of the five bars do not match/, 'three bars wrong'); noAnswer(t, 'the chart reply', new RegExp(`${v.rooms.join('|')}|Living|Green|Food|Engine|\\b(${v.temp.join('|')})\\b`)); }
    await p.click('#leave'); await p.waitForTimeout(200); expect(await last(), /Your bars are kept/, 'stepping back from the chart');
    expect(await say('talk mission'), /How warm is each of the five rooms\? Send us a chart/, 'Mission Control says the purpose again, as often as it is asked');

    // ---- the fuel log, before the chart is done: any order
    expect(await say('look computer'), /the fuel and the distance of the last trip, month by month/, 'look computer');
    await say('use computer'); ok(await p.evaluate(() => SD().at === 'fuel' && $('place').textContent === 'The Central Computer'), 'the fuel log should open'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the fuel log opened: ${st0} became ${await stage()}`); await still(); await shot('4_fuel_log');
    { const one = await p.evaluate(() => SM.one); ok(one === (name === 'phone'), `two charts should show at once on an iPad, one at a time on a phone: one at a time is ${one}`); if (one) { const pt = await p.evaluate(() => { const r = cv.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(250); ok(await p.evaluate(() => SM.flip === true && !!widget), 'a tap on the picture should flip to the second chart'); await shot('4b_fuel_log_chart2'); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(200); ok(await p.evaluate(() => SM.flip === false), 'a second tap should flip back'); } }
    await p.click('#try'); expect(await msg(), /Tap a month first/, 'no month chosen');
    const wrongMonth = new RegExp(`${v.months[wm]}|solar|wind`);
    await p.click(`#smons button[data-i="${gm}"]`); await p.click('#try'); { const t = await msg(); expect(t, /A planet pulled the ship along that month\. Nothing went wrong/, 'the gravity month'); noAnswer(t, 'the gravity month reply', wrongMonth); }
    await p.click(`#smons button[data-i="${lm}"]`); await p.click('#try'); { const t = await msg(); expect(t, /The long run to the far moon\. Nothing went wrong/, 'the month of the long run'); noAnswer(t, 'the long run reply', wrongMonth); }
    await p.click(`#smons button[data-i="${clear}"]`); await p.click('#try'); { const t = await msg(); expect(t, /Clear skies\. Nothing went wrong/, 'a clear month'); noAnswer(t, 'the clear month reply', wrongMonth); }
    await p.click('#leave'); await p.waitForTimeout(200);
    { const a = await say('hint'), b2 = await say('hint'); expect(a, /Each line up|Every room has|Under every|That is all/, 'in the Control Room the chart comes first'); }
    await room('food'); await say('use thermometer'); ok(await p.evaluate(() => SD().k === 'food'), 'the Food Storage thermometer'); await type(v.temp[3]);
    await room('engine'); expect(await say('use pump'), /No fuel to be pumped until Mission Control says so/, 'the pump before the fuel log is solved'); expect(await say('push pipes'), /The pipes do not move/, 'the pipes'); expect(await say('use pipes'), /Bong\. Nothing happens/, 'knocking on a pipe'); expect(await say('take thermometer'), /screwed to the wall/, 'a thermometer stays');
    await say('use thermometer'); ok(await p.evaluate(() => SD().k === 'engine'), 'the Engine Room thermometer'); await still(); { const g = await p.evaluate(() => SM.geo), Y = t => g.B - (g.B - g.top) * t / 40, t = v.temp[4]; ok(isRed(await pixel(g.X, Y(t) + 4)) && !isRed(await pixel(g.X, Y(t) - 4)), `the Engine Room thermometer should show ${t}`); } await type(v.temp[4]);

    // ---- QUEST 1, the wall chart
    await room('control'); await say('use chart'); ok(await p.evaluate(([a, b2, c2]) => SD().bars.join() === [a, b2, c2, 0, 0].join(), [v.temp[0], v.temp[1] + 2, v.temp[2]]), 'the bars should be kept');
    await setBar(3, v.temp[3]); await setBar(4, v.temp[4]); await p.click('#try'); await p.waitForTimeout(200); { const t = await msg(); expect(t, /1 of the five bars does not match/, 'one bar wrong'); noAnswer(t, 'the chart reply', new RegExp(`${v.rooms.join('|')}|Living|Green|Food|Engine`)); }
    await p.click('#leave'); await p.waitForTimeout(200); await room('living'); await say('use thermometer'); ok(await p.evaluate(t => $('ans').value === String(t), v.temp[1] + 2), 'the thermometer should show what was written before'); await type(v.temp[1]);
    await room('control'); await say('use chart'); await setBar(1, v.temp[1]); await p.click('#try'); await p.waitForTimeout(300);
    ok(await p.evaluate(() => SD().barsOk && !!$('srooms') && !!$('ans')), 'a right chart should bring the question'); expect(await toyText(), /Now look at the sign above each thermometer\. One room is too hot or too cold for its sign\. Which room\? By how many degrees\?/, 'the question after the chart names the sign, and where it is'); noAnswer(await toyText(), 'the question after the chart', new RegExp(`\\b${off}\\b`));
    await p.click('#try'); expect(await msg(), /Tap a room first/, 'no room chosen'); const otherRoom = (badI + 1) % 5;
    await p.click(`#srooms button[data-i="${otherRoom}"]`); await type(off); { const t = await msg(); expect(t, new RegExp(`Engineers hurry to the ${v.rooms[otherRoom]}\\. It is just as its sign says`), 'the wrong room'); noAnswer(t, 'the wrong room reply', new RegExp(v.rooms[badI])); }
    await p.click(`#srooms button[data-i="${badI}"]`); await type(off - 1); { const t = await msg(); expect(t, /is still not as its sign says/, 'too few degrees'); noAnswer(t, 'the too-few reply', new RegExp(`\\b${off}\\b`)); }
    await type(off + 2); { const t = await msg(); expect(t, new RegExp(`But it is not ${off + 2} degrees out`), 'too many degrees'); noAnswer(t, 'the too-many reply', new RegExp(`\\b${off}\\b`)); }
    await type(off); expect(await last(), new RegExp(`Engineers turn the dial ${off} degrees\\. Now the ${v.rooms[badI]} is as its sign says\\..*You earn a card`), 'the right room and degrees');
    ok(await p.evaluate(() => SD().done.chart && !widget && SD().at === 'map'), 'the chart should be done'); expect(await say('look chart'), /One of them is red/, 'the chart afterwards'); expect(await say('talk mission'), /We still need to know what went wrong with the fuel/, 'Mission Control after the chart');

    // ---- QUEST 3, the fuel
    { const a = await say('hint'), b2 = await say('hint'), c2 = await say('hint'); expect(a, /Two charts\. One shows the fuel burned/, 'fuel nudge 1'); expect(b2, /In a good month, a ship goes far on its fuel/, 'fuel nudge 2'); expect(c2, /That is all the help there is/, 'no more fuel nudges'); [a, b2].forEach(t => noAnswer(t, 'a fuel nudge', wrongMonth)); }
    await say('use computer'); await p.click(`#smons button[data-i="${wm}"]`); await p.click('#try'); await p.waitForTimeout(250); expect(await last(), new RegExp(`Mission Control looks up ${v.months[wm]}\\. "A solar wind!.*Now fill the tanks, cadet\\. Every one to the top, and not a drop over`), 'the month of the solar wind');
    ok(await p.evaluate(() => SD().done.month && !SD().done.fuel && !widget), 'the month should be found, the fuel not yet done'); expect(await say('talk mission'), /The tanks, cadet\. Every one to the top/, 'Mission Control after the month');
    await say('use computer'); expect(await toyText(), new RegExp(`${v.months[wm]} was the month of the solar wind`), 'the computer afterwards'); await back();
    await room('engine'); { const seen = []; for (let i = 0; i < 5; i++) seen.push(await say('hint')); expect(seen[0], /Look at the small glass tank in this room\. Its gauge shows the same thing as its glass/, 'tank nudge 1 points at something to look at'); expect(seen[1], /cut into equal parts\. Count the parts/, 'tank nudge 2'); expect(seen[2], /How many litres is one part/, 'tank nudge 3'); expect(seen[3], /How many parts are still empty/, 'tank nudge 4'); expect(seen[4], /That is all the help there is/, 'no more tank nudges'); seen.forEach(t => noAnswer(t, 'a tank nudge', new RegExp(`\\b(${need.join('|')})\\b`))); }
    await say('look glass tank'); ok(await p.evaluate(() => SD().at === 'glass' && $('place').textContent === 'The glass tank'), 'the glass tank should open'); expect(await toyText(), /cut it into 5 equal parts\. Fuel fills 3 of them\. The gauge under it shows the same thing: its needle is on the third mark of five/, 'the glass tank shows what a gauge means'); noAnswer(await toyText(), 'the glass tank', /litre/i); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the glass tank opened: ${st0} became ${await stage()}`); await still(); await shot('5a_glass_tank'); await back(); expect(await say('take glass'), /bolted to the floor/, 'the glass tank stays');
    for (let i = 0; i < 3; i++) { await say(`look ${v.tnames[i].toLowerCase()} tank`); ok(await p.evaluate(i => SD().at === 'tank' && SD().k === i && $('place').textContent === 'A fuel gauge', i), `the ${v.tnames[i]} gauge should open`); ok(!/\d/.test(await toyText()), 'a gauge task must not print any number'); await still();
      { const g = await p.evaluate(() => SM.geo), x = g.L + (g.R - g.L) * v.tanks[i][1] / v.tanks[i][0], c1 = await pixel(x, g.y - g.nh * .7); ok(g.b === v.tanks[i][0] && g.k === v.tanks[i][1] && c1[0] > 220 && c1[1] > 140 && c1[2] < 120, `the ${v.tnames[i]} needle should stand at part ${v.tanks[i][1]} of ${v.tanks[i][0]}`); } if (i === 0) { await shot('5_gauge'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the gauge opened: ${st0} became ${await stage()}`); } await back(); }
    await say('use pump'); ok(await p.evaluate(() => widget && widget.kind === 'spump' && !!$('p0') && !!$('p1') && !!$('p2')), 'the pump should have three dials'); noAnswer(await toyText(), 'the pump', new RegExp(`\\b(${need.join('|')})\\b`));
    await p.click('#try'); expect(await msg(), /Set a dial for every tank that is not full/, 'empty dials');
    await p.fill('#p0', String(need[0] - 10)); await p.fill('#p1', String(need[1])); await p.fill('#p2', String(need[2] + 1)); await p.click('#try'); await p.waitForTimeout(250);
    { const t = await last(); expect(t, /The Main needle stops short of FULL\. The Backup tank is full\. The Reserve tank overflows\. Fuel runs across the floor!/, 'one short, one right, one over'); noAnswer(t, 'the pump reply', /\d/); } ok(await p.evaluate(() => SD().tank.join() === '0,1,0' && !widget), 'only the Backup tank should be full');
    await say('use pump'); ok(await p.evaluate(() => !$('p1') && /is full/.test($('toy').innerText)), 'a full tank needs no dial'); await p.fill('#p0', String(need[0])); await p.fill('#p2', String(need[2])); await p.click('#try'); await p.waitForTimeout(250);
    expect(await last(), /Three needles on FULL, and a dry floor\. "Fuel is go," says Mission Control\. You earn a card/, 'all tanks full'); ok(await p.evaluate(() => SD().done.fuel), 'the fuel should be done'); expect(await say('use pump'), /All three tanks are full/, 'the pump afterwards');
    await say('look main tank'); expect(await toyText(), /The needle is on FULL/, 'a full gauge'); await back();

    // ---- QUEST 2, the last-quarter locker
    await room('food'); { const t = await say('talk chief'); expect(t, new RegExp(`There are four of us\\. Each one needs ${v.p} energy points a month\\. Nothing in the locker may go bad before the trip ends\\. And there must be exactly enough\\. The locker is small: ten packs of any one food, and no more`), 'the Chief gives the facts'); noAnswer(t, 'the Chief', new RegExp(`\\b${T}\\b`)); }
    { const m = await mission(); ok(m.rows.length === 4 && /^\[x\] A chart for Mission Control/.test(m.rows[0]) && /^\[x\] Fill every tank to the top/.test(m.rows[1]) && /^\[ \] Fill the locker for months ten, eleven and twelve/.test(m.rows[2]) && /^\[ \] Which kind of food fell the most/.test(m.rows[3]) && /Operation Stardust: 2 of 5 jobs/.test(m.text), `after the Chief speaks, the Mission panel should hold four jobs, two of them done: ${m.rows.join(' | ')}`); expect(m.text, new RegExp(`The Chief said: four people, ${v.p} energy points each a month, for months ten to twelve`), 'the Mission panel keeps what the Chief said'); noAnswer(m.text.replace(/Your clipboard:[^\n]*/, ''), 'the Mission panel', new RegExp(`\\b(${T}|${by})\\b|${v.both[fell]}`)); }
    expect(await say('look locker'), /A crate holds 10 packs\. Each crate has a label/, 'look locker');
    await say('use locker'); ok(await p.evaluate(() => widget && widget.kind === 'slocker' && document.querySelectorAll('#toy tbody tr').length === 6), 'the locker should list six foods'); noAnswer(await toyText(), 'the locker', new RegExp(`\\b${T}\\b`)); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the locker opened: ${st0} became ${await stage()}`); await shot('6_locker');
    await p.click('#try'); expect(await msg(), /The locker is empty/, 'an empty locker');
    await fillLocker(packs({ [good[0]]: 3, [spoil[0]]: 1 })); { const t = await msg(); expect(t, /One kind of food has gone bad\. Nobody can eat it/, 'one food that goes bad'); noAnswer(t, 'the gone-bad reply', new RegExp(`${v.shelf[spoil[0]][0]}|\\b${T}\\b`)); }
    await fillLocker(packs({ [spoil[0]]: 2, [spoil[1]]: 2 })); expect(await msg(), /Two kinds of food have gone bad\. Nobody can eat them/, 'two foods that go bad');
    await fillLocker(packs({ [good[0]]: 11 })); expect(await msg(), /A crate holds 10 packs at most/, 'eleven packs');
    await fillLocker(packs({ [good[0]]: 2 })); { const t = await msg(); expect(t, /The food is good\. But it runs out before the trip ends/, 'too little'); noAnswer(t, 'the too-little reply', /\d/); }
    await fillLocker(packs({ [good[0]]: 10, [good[1]]: 10, [good[2]]: 10, [good[3]]: 10 })); { const t = await msg(); expect(t, /The food is good\. But there is too much\. The door will not shut/, 'too much'); noAnswer(t, 'the too-much reply', /\d/); }
    await p.click('#leave'); await p.waitForTimeout(200); expect(await last(), /Your numbers are kept/, 'stepping back from the locker'); await say('use locker'); ok(await p.evaluate(g => $('l' + g).value === '10', good[0]), 'the packs typed should be kept');
    const tries0 = await p.evaluate(() => SD().tries.larder);
    await fillLocker(packs({ [good[0]]: fill[0], [good[1]]: fill[1], [good[2]]: fill[2], [good[3]]: fill[3] })); expect(await last(), /Everything in it is good\. On the last day of month twelve the crew eats the last pack\. Exactly enough!.*You earn a card/, 'exactly enough'); ok(await p.evaluate(() => SD().done.larder), 'the locker should be done'); ok(tries0 === 4, `wrong tries counted: ${tries0}, should be 4 (eleven packs and an empty locker do not count)`);
    expect(await say('use locker'), /The last-quarter locker is sealed/, 'the locker afterwards');

    // ---- QUEST 4, what the crew ate
    expect(await say('talk chief'), /One more thing\. My screen shows what the last crew ate.*Which kind\? By how many units\?/, 'the Chief asks about the charts');
    { const a = await say('hint'), b2 = await say('hint'), c2 = await say('hint'); expect(a, /Find the kinds of food that are on both charts/, 'food nudge 1'); expect(b2, /how much at the start\? How much at the end\?/, 'food nudge 2'); expect(c2, /That is all the help there is/, 'no more food nudges'); [a, b2].forEach(t => noAnswer(t, 'a food nudge', new RegExp(`${v.both[fell]}|\\b${by}\\b`))); }
    await say('use screen'); ok(await p.evaluate(() => SD().at === 'eaten' && $('place').textContent === 'The Supply Chief’s screen'), 'in Food Storage, "screen" should mean the Chief\'s screen'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved when the food charts opened: ${st0} became ${await stage()}`); await still(); await shot('7_food_charts');
    await p.click('#try'); expect(await msg(), /Tap a kind of food first/, 'no kind chosen'); const otherKind = (fell + 1) % 4;
    await p.click(`#skinds button[data-i="${otherKind}"]`); await type(by); { const t = await msg(); expect(t, new RegExp(`Another kind fell further than ${v.both[otherKind].toLowerCase()}`), 'the wrong kind'); noAnswer(t, 'the wrong kind reply', new RegExp(v.both[fell])); }
    await p.click(`#skinds button[data-i="${fell}"]`); await type(by - 50); { const t = await msg(); expect(t, new RegExp(`it fell by more than ${by - 50}`), 'too few units'); noAnswer(t, 'the too-few reply', new RegExp(`\\b${by}\\b`)); }
    await type(by + 50); { const t = await msg(); expect(t, new RegExp(`did not fall by as much as ${by + 50}`), 'too many units'); noAnswer(t, 'the too-many reply', new RegExp(`\\b${by}\\b`)); }
    await type(by); expect(await last(), new RegExp(`"${v.both[fell]}\\. Down by ${by} units," says the Supply Chief\\..*You earn a card`), 'the kind that fell the most'); expect(await say('use screen'), new RegExp(`Pack more ${v.both[fell].toLowerCase()}`), 'the screen afterwards'); expect(await say('talk chief'), /The stores are ready\. Thank you, cadet/, 'the Chief at the end');

    // ---- tapping: a thing, a wall, a far square; the right thermometer when two are in view
    await walk(12, 8); await tapTile(17, 6); ok(await p.evaluate(() => SD().at === 'th' && SD().k === 'living'), `tapping the Living Quarters thermometer from the corridor should open that one, not a nearer one: ${await p.evaluate(() => SD().k)}`); await back();
    await walk(13, 4); await tapTile(9, 4); ok(await p.evaluate(() => SD().x === 10 && SD().y === 4), 'tapping a wall should walk up to it'); await tapTile(9, 4); expect(await last(), /A wall/, 'tapping a wall beside you'); await tapTile(11, 5); ok(await p.evaluate(() => SD().x === 11 && SD().y === 5), 'tapping a far square should walk there');
    await tapTile(16, 1); expect(await last(), /The bunk is hard/, 'tapping the bunks should use them');

    // ---- lift-off
    expect(await say('go control room'), /You walk to the Control Room/, 'go, with a room\'s name'); ok(await p.evaluate(() => sRoomAt(SD().x, SD().y) === 'control'), 'should stand in the Control Room');
    const gold0 = await p.evaluate(() => S.cards.filter(c => c.r === 'gold').length);
    expect(await say('talk mission'), /Rooms, fuel, food\. All clear! Operation Stardust is go\..*You earn an epic card/, 'cleared for launch'); ok(await p.evaluate(g => SD().done.launch && S.cards.filter(c => c.r === 'gold').length === g + 1, gold0), 'a gold card for the launch');
    expect(await say('talk mission'), /The ship is on its way/, 'Mission Control afterwards'); expect(await say('hint'), /The mission ship is on its way\. You can still look around/, 'the nudge at the end');
    const end = await p.evaluate(() => ({ count: sCount(), cards: S.cards.length, chip: Array.from(document.querySelectorAll('.chip')).map(c => c.textContent).filter(t => /Stardust/.test(t)).join(), log: S.log.filter(l => /^Stardust/.test(l.what)).map(l => l.what + ' | ' + l.skill + ' | ' + l.result) }));
    ok(end.count === 5 && /Stardust 5 of 5/.test(end.chip), `the count should be 5 of 5: ${end.count}, chip "${end.chip}"`); ok(end.cards - cards0 === 7, `cards earned: ${end.cards - cards0}, should be 7 (four quests, the water, the signal, the gold card)`);
    ok(end.log.length === 7 && end.log.some(l => /the wall chart \| .*3\.MD\.3.* \| solved on try 7, with 3 nudges/.test(l)) && end.log.some(l => /the last-quarter locker \| .*3\.NBT\.3.* \| solved on try 5, with 0 nudges/.test(l)) && end.log.some(l => /the fuel \| .*3\.NF\.2.*\| solved on try 5, with 6 nudges/.test(l)) && end.log.some(l => /what the crew ate \| .*3\.MD\.3.* \| solved on try 4, with 2 nudges/.test(l)) && end.log.some(l => /the greenhouse \| .*3\.MD\.2/.test(l)) && end.log.some(l => /the signal \| .*3\.OA\.9/.test(l)), `the teacher's log should hold every job, its skill, tries and nudges: ${end.log.join(' // ')}`);
    { const m = await mission(); ok(/Operation Stardust: 5 of 5 jobs/.test(m.text) && m.rows.length === 5 && m.rows.every(r => /^\[x\]/.test(r)) && /Lift-off/.test(m.rows[4]), `at the end the Mission panel should show five jobs done: ${m.rows.join(' | ')}`); }
    await shot('8_end');

    // ---- a reload, fly away, dock again
    await p.reload(); await p.waitForTimeout(700); ok(await p.evaluate(() => S.mode === 'star' && sRoomAt(SD().x, SD().y) === 'control' && SM.px === SD().x && SD().done.launch && SD().at === 'map' && SD().seen.length === 7), 'a reload should keep the place, the rooms found and the jobs done');
    expect(await say('fly'), /You undock from the mission ship\. Galaxy Databa glows around you/, 'flying away'); ok(await p.evaluate(() => S.mode === 'space' && S.at === 'databa'), 'back in Galaxy Databa');
    await p.waitForTimeout(200); ok(await p.evaluate(() => $('m_mission').hidden === !S.v), 'in space, with no Voltara mission, there is no Mission button');
    await p.evaluate(() => { V(); save(); drawStatus(); }); await p.waitForTimeout(250); { const m = await mission(); ok(m.btn === 'Voltara mission' && /Mission Voltara/.test(m.text) && !/Stardust/.test(m.text), `away from Voltara the button should say whose mission it holds: "${m.btn}"`); }
    expect(await say('dock'), /You dock with the mission ship/, 'docking again'); ok(await p.evaluate(() => SD().done.launch && SD().x === 22 && SD().y === 13), 'the jobs done should be kept; the cadet stands in the airlock again');
    await p.waitForTimeout(200); { const m = await mission(); ok(m.btn === 'Mission' && /Operation Stardust: 5 of 5 jobs/.test(m.text) && !/Mission Voltara/.test(m.text), `back on the ship, with a Voltara mission as well, the Mission button should still show Operation Stardust: "${m.btn}" ${m.text.slice(0, 60)}`); }
    await p.evaluate(() => { const c = SD(); delete c.heardM; delete c.heardC; drawMission(); }); { const m = await mission(); ok(m.rows.length === 5, `a game saved before version 51 (no heard marks) should still list its jobs: ${m.rows.length}`); }
    ok(await p.evaluate(() => !!$('t_std') && typeof goStardust === 'function'), 'the teacher\'s shortcut should exist'); if (name !== 'phone') ok((await stage()) === st0, `the picture moved by the end: ${st0} became ${await stage()}`);
    notes.push(`${name}: seed ${await p.evaluate(() => SD().seed)}; ${v.rooms[badI]} off by ${off}; locker ${T} points; wind in ${v.months[wm]}; tanks ${need.join(', ')} litres; ${v.both[fell]} fell by ${by}; all four quests and both side jobs played; ${end.cards - cards0} cards`);
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]} ${(e.stack || '').split('\n').filter(l => /stardust_test/.test(l)).slice(0, 1).join('').trim()}`); }
    await ctx.close();
  }
  await b.close(); notes.forEach(x => console.log(x));
  if (bad.length) { console.log('\nFAILED:'); bad.forEach(x => console.log('  ' + x)); }
  console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none'));
  console.log(bad.length || errs.length ? 'RESULT: FAIL' : 'RESULT: PASS');
  process.exit(bad.length || errs.length ? 1 : 0);
})().catch(e => { console.error('FAILED', e.message.split('\n').slice(0, 3).join(' | '), (e.stack || '').split('\n').filter(l => /stardust_test/.test(l)).slice(0, 2).join(' | ')); process.exit(1); });
