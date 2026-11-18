// Planet Chronosia: a map you walk on, with places you step into.  [Source: Marc, 2026-11-18: "Let us try B. For Chronosia."]
//   NUMBERS, worked out again here and compared with the game's own answers:
//     - the eight clocks, the six quakes and quake 7, the Council's timetable, who goes on which mission
//     - the Tortoise and Cougar questions, which differ for each cadet, on 20,000 seeds each
//     - the map: every place can be walked to from the ship; the grove is hidden behind one gap
//   PLAY: land, explore the mist, find the hidden grove, do all six quests with the number pad boxes, read the Council's book,
//     dig up the sundial, taste the fruit, earn the gold card, reload, fly away, land again from space.
// Run: node checks/chronosia_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h] of [['ipad', 1180, 820], ['ipad-tall', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-wisps', 'off'); /* the wisps have their own test: time_wisps_test.js */ } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); }, expect = (got, re, what) => { if (!re.test(String(got))) bad.push(`${name}: ${what}: got "${got}"`); };
    const last = () => p.evaluate(() => lines[lines.length - 1].text || '');
    const idle = async () => { for (let i = 0; i < 200; i++) { if (await p.evaluate(() => !CM.route.length && PL.to == null && !PL.then)) return; await p.waitForTimeout(80); } bad.push(name + ': still walking'); };
    const say = async t => { await p.fill('#cmd', t); await p.press('#cmd', 'Enter'); await p.waitForTimeout(150); await idle(); await p.waitForTimeout(150); return last(); };
    const tapTile = async (x, y) => { await p.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); }); await p.waitForTimeout(60); const pt = await p.evaluate(([x, y]) => { const g = cGeo(), r = cv.getBoundingClientRect(); return [r.left + g.ox + (x + .5) * g.ts, r.top + g.oy + (y + .5) * g.ts]; }, [x, y]); await p.touchscreen.tap(pt[0], pt[1]); await p.waitForTimeout(120); await idle(); await p.waitForTimeout(150); };

    if (name === 'ipad') {      // ---- the numbers
      const n = await p.evaluate(() => { skipIntro(); const res = { bad: [], seeds: 0 }, B = m => res.bad.push(m);
        if (CMAP.length !== CH || CMAP.some(r => r.length !== CW)) B('the map is not 20 by 13');
        // every place can be reached from the ship; the grove only through its gap
        const reach = block => { const seen = {}, q = [[7, 10]]; seen['7,10'] = 1; while (q.length) { const [x, y] = q.shift(); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy, k = nx + ',' + ny; if (seen[k] || !cOpen(nx, ny) || (block && nx === block[0] && ny === block[1])) continue; seen[k] = 1; q.push([nx, ny]); } } return seen; };
        const all = reach(null); Object.keys(CPL).forEach(k => { const pl = CPL[k]; if (cTile(pl.x, pl.y) !== k) B(`place ${pl.name} is not where the map says`); if (!all[pl.x + ',' + pl.y]) B(`cannot walk to ${pl.name}`); if (!cOpen(pl.out[0], pl.out[1]) || Math.abs(pl.out[0] - pl.x) + Math.abs(pl.out[1] - pl.y) !== 1) B(`the way out of ${pl.name} is wrong`); });
        if (!all['17,10'] || cTile(17, 10) !== 'X') B('cannot walk to the stone ring'); if (cTile(17, 2) !== 'F' || !all['17,3']) B('cannot reach the fruit tree');
        if (reach([11, 3])['11,2']) B('the grove should have only one way in'); if (reach([4, 8])['3,5'] !== undefined && reach([4, 8])['4,5']) B('the bridge should be the only way north');
        // the clocks: minutes past 59 make a new hour; hours past 23 start a new day
        const fix = t => { let [hh, mm] = t.split(':').map(Number); const real = mm <= 59 && hh <= 24; hh += Math.floor(mm / 60); mm %= 60; hh %= 24; return { real, h: hh, m: mm }; }, cs = CQ.clocks.steps();
        if (cs.length !== 12) B('clocks: 12 steps expected, got ' + cs.length); cs.forEach((s2, i) => { const t = (s2.q.match(/shows (\d+:\d+)|(\d+:\d+) is really/) || []).slice(1).find(Boolean); if (s2.kind === 'yn') { if (fix(t).real !== s2.ans) B(`clock ${t}: real or not is wrong`); } if (s2.kind === 'time') { const f = fix(t); if (!s2.ans.some(a => a[0] === f.h && a[1] === f.m)) B(`clock ${t}: ${f.h}:${f.m} is not accepted`); s2.ans.forEach(a => { if (!((a[0] === f.h || a[0] === f.h - 12) && a[1] === f.m)) B(`clock ${t}: accepts a wrong time ${a}`); }); } });
        if (cs.filter(s2 => s2.kind === 'yn' && s2.ans).length !== 3 || cs.filter(s2 => s2.kind === 'time').length !== 4) B('clocks: 3 fine and 4 to fix expected, after the first one shown');
        // the quakes [Source]: each lasts 5 minutes longer; 30 calm minutes between them
        const Q = CQUAKES; Q.forEach((q, i) => { if (q[1] - q[0] !== 5 * (i + 1)) B(`quake ${i + 1} does not last ${5 * (i + 1)} minutes`); if (i && q[0] - Q[i - 1][1] !== 30) B(`the calm before quake ${i + 1} is not 30 minutes`); });
        if (h12(Q[0][0]) !== '12:49' || h12(Q[5][1]) !== '5:04') B('the quake table does not start at 12:49 and end at 5:04'); const qs = CQ.quakes.steps(), q7s = Q[5][1] + 30, q7e = q7s + 35;
        const want = [null, 10, 15, 20, 25, 30, 5, 30, [Math.floor(q7s / 60) % 12, q7s % 60], 35, [Math.floor(q7e / 60) % 12, q7e % 60]]; qs.forEach((s2, i) => { if (!i) return; const a = s2.kind === 'time' ? s2.ans[0].join(':') : String(s2.ans[0]), e = Array.isArray(want[i]) ? want[i].join(':') : String(want[i]); if (a !== e) B(`quake step ${i + 1}: the game says ${a}, worked out again ${e}`); });
        if (want[8].join(':') !== '5:34' || want[10].join(':') !== '6:9') B('quake 7 should be 5:34 to 6:09');
        // the timetable and the people [Source]
        const pages = Object.keys(CTT).map(Number), owned = {}; Object.keys(CWHO).forEach(nm => CWHO[nm].pages.forEach(pg => { owned[pg] = (owned[pg] || 0) + 1; })); if (pages.join() !== '3,4,5,6,7,8,9,10' || pages.some(pg => owned[pg] !== 1 || !CBOOK[pg])) B('each of the 8 missions should belong to one person, and have a page in the book');
        const dur = pg => CTT[pg][4] - CTT[pg][3], ps = CQ.plan.steps(), exp = [dur(6), dur(7), dur(5), dur(10)]; if (exp.join() !== '90,45,60,20') B('durations should be 90, 45, 60, 20: ' + exp); exp.forEach((d, i) => { if (ps[i].ans[0] !== d) B(`plan step ${i + 1} should be ${d}`); });
        const clash = []; pages.forEach(a => pages.forEach(c2 => { if (a < c2 && CTT[a][2] === CTT[c2][2] && CTT[a][3] < CTT[c2][4] && CTT[c2][3] < CTT[a][4]) clash.push([a, c2, Math.min(CTT[a][4], CTT[c2][4]) - Math.max(CTT[a][3], CTT[c2][3])]); }));
        const oct4 = clash.filter(c2 => CTT[c2[0]][2] === 'Oct 4'); if (oct4.length !== 1 || oct4[0].slice(0, 2).join() !== '4,5' || oct4[0][2] !== 15 || ps[4].ans.join() !== '4,5' || ps[5].ans[0] !== 15) B('the Oct 4 clash should be pages 4 and 5, for 15 minutes');
        Object.keys(CWHO).forEach(nm => { const [a, c2] = CWHO[nm].pages; if (clash.some(k => k[0] === Math.min(a, c2) && k[1] === Math.max(a, c2))) B(`${nm}'s own two missions clash`); });
        const off = CWHO.Sara.pages.filter(pg => CTT[pg][0] !== 'Chronosia'); if (off.length !== 1 || ps[6].ans[0] !== off[0]) B('Sara should miss the one mission that is not on Chronosia');
        const long = CWHO.Zara.pages.filter(pg => dur(pg) > 45); if (long.length !== 1 || ps[7].ans[0] !== long[0]) B('Zara should miss the one mission longer than 45 minutes');
        if (ps[8].ans[0] !== 7 || !/asteroid/.test(CBOOK[7][2]) || /asteroid/.test(CBOOK[8][2])) B('Alex: the asteroid should be on page 7 only'); if (CWHO.Tim.pages.some(pg => CTT[pg][1] !== 'same') || ps[9].ans[0] !== 0) B('Tim: both missions should be in the same dimension, so the answer is 0');
        CQ.match.steps().forEach((s2, i) => { if (s2.ans.join() !== CWHO[Object.keys(CWHO)[i]].pages.join()) B('match step ' + i); });
        // numbers that differ for each cadet
        for (let seed = 1; seed <= 20000; seed++) { res.seeds++; const t = cTort(seed), g = cCoug(seed); if (t.length !== 3 || g.length !== 3) { B('seed ' + seed + ': 3 questions each'); continue; }
          t.forEach((q, i) => { const tot = q.h * 60 + q.m + q.d, okq = q.m % 5 === 0 && q.d % 5 === 0 && q.d >= 10 && q.d <= 55 && q.m >= 5 && q.m <= 55 && q.h >= 1 && q.ans[0] === Math.floor(tot / 60) && q.ans[1] === tot % 60 && q.ans[0] <= 11 && (i === 0 ? q.m + q.d < 60 : q.m + q.d >= 60); if (!okq && res.bad.length < 12) B(`tortoise seed ${seed}: ${JSON.stringify(q)}`); });
          const hs = g.map(x => x[0]); if (new Set(hs).size !== 3 || hs.some(x => x < 1 || x > 12) || [0, 30].indexOf(g[0][1]) < 0 || [15, 45].indexOf(g[1][1]) < 0 || g[2][1] % 5 !== 0 || g[2][1] % 15 === 0) { if (res.bad.length < 12) B(`cougar seed ${seed}: ${JSON.stringify(g)}`); } }
        return res; });
      n.bad.forEach(x => bad.push('numbers: ' + x)); console.log(`numbers: the clocks, quakes, timetable and map checked; ${n.seeds.toLocaleString()} seeds for the Tortoise and the Cougar; ${n.bad.length} wrong`);
    }

    try {
    // ---- play
    await p.evaluate(() => { skipIntro(); goSpace(); }); await p.waitForTimeout(200);
    await say('fly to metrica'); for (let i = 0; i < 100; i++) { if (await p.evaluate(() => S.at === 'metrica' && !SP.to)) break; await p.waitForTimeout(100); }
    expect(await last(), /Planet Chronosia is open/, 'arriving at Metrica'); ok(await p.evaluate(() => hereWords().some(x => x[0] === 'land')), 'a "land on Chronosia" word at Metrica');
    expect(await say('land'), /You land on Planet Chronosia/, 'landing from space'); ok(await p.evaluate(() => S.mode === 'chrono' && C().at === 'map' && C().x === 7 && C().y === 10), 'should be on the map by the ship');
    ok(await p.evaluate(() => !cFound('K') && !cFound('G') && !cFound('H') && cSeen(8, 10)), 'at the start the places are hidden in mist'); expect(await say('go to tower'), /not found that place yet/, 'a place in the mist cannot be named');
    if (out) await p.screenshot({ path: path.join(out, `chronosia_${name}_1_land.png`) });
    expect(await say('go north'), /You walk north/, 'go north'); expect(await say('go north'), /river is in the way|You walk north/, 'the river blocks'); expect(await say('dig'), /small hole/, 'dig on plain ground');
    expect(await say('cut down the trees'), /nothing here to cut|does not know/i, 'cut on the map'); expect(await say('look'), /seen from above.*found no places yet/, 'look on the map');
    await tapTile(4, 9); await tapTile(4, 6); ok(await p.evaluate(() => C().y <= 6 && cFound('K')), 'crossing the bridge by tapping should find the Clock Tower');
    ok(await p.evaluate(() => hereWords().some(x => x[0] === 'go to tower')), 'a found place becomes a word to tap');
    // the Clock Tower
    await tapTile(3, 5); ok(await p.evaluate(() => C().at === 'tower'), 'tapping the tower walks in'); expect(await last(), /The Clock Tower\. A tall tower/, 'tower words');
    expect(await say('use door'), /Eight gears hold it shut/, 'the door is shut at first'); expect(await say('talk keeper'), /Fix the eight small clocks/, 'the keeper gives the job'); expect(await say('hug keeper'), /You try to hug the Tower Keeper/, 'a doing word with no use');
    const play = async (id, opts) => { opts = opts || {}; for (let guard = 0; guard < 40; guard++) { const s2 = await p.evaluate(() => widget && widget.kind === 'cq' ? { kind: widget.steps[widget.i].kind, ans: widget.steps[widget.i].ans, i: widget.i, n: widget.steps.length } : null); if (!s2) return;
        if (opts.wrongAt === s2.i && !opts.didWrong) { opts.didWrong = true; if (s2.kind === 'yn') { await p.tap(s2.ans ? '#no' : '#yes'); } else { await p.fill('#ah', '59'); if (s2.kind !== 'num') await p.fill('#am', '59'); await p.tap('#try'); } await p.waitForTimeout(120); ok(await p.evaluate(() => /\w/.test($('msg').textContent) && widget.i === widget.steps.length - widget.steps.length + widget.i), `${id}: a wrong answer should give a hint`); ok(await p.evaluate(i => widget.i === i, s2.i), `${id}: a wrong answer must not move on`); continue; }
        if (opts.leaveAt === s2.i && !opts.didLeave) { opts.didLeave = true; await p.tap('#leave'); await p.waitForTimeout(150); ok(await p.evaluate(([id, i]) => !widget && C().prog[id] === i, [id, s2.i]), `${id}: leaving should keep the place`); await say(opts.again); await p.waitForTimeout(200); ok(await p.evaluate(i => widget && widget.i === i, s2.i), `${id}: coming back should go on from step ${s2.i + 1}`); continue; }
        if (s2.kind === 'info') await p.tap('#try'); else if (s2.kind === 'yn') await p.tap(s2.ans ? '#yes' : '#no'); else if (s2.kind === 'num') { await p.fill('#ah', String(s2.ans[0])); await p.tap('#try'); } else if (s2.kind === 'time') { const a = s2.ans[s2.ans.length - 1]; await p.fill('#ah', String(a[0])); await p.fill('#am', String(a[1]).padStart(2, '0')); await p.tap('#try'); } else { await p.fill('#ah', String(s2.ans[1])); await p.fill('#am', String(s2.ans[0])); await p.tap('#try'); }
        await p.waitForTimeout(90); } bad.push(`${name}: ${id}: the quest did not end`); };
    await say('use board'); await p.waitForTimeout(200);     ok(await p.evaluate(() => widget && widget.id === 'clocks'), 'the board should open the clocks'); if (out && name !== 'phone' && await p.$('#try')) { await p.tap('#try'); await p.waitForTimeout(150); await p.screenshot({ path: path.join(out, `chronosia_${name}_2_clocks.png`) }); }
    const cards0 = await p.evaluate(() => S.cards.length); await play('clocks', { wrongAt: 2, leaveAt: 5, again: 'use board' }); await p.waitForTimeout(250);
    expect(await last(), /great clock ticks again.*You earn a card/, 'clocks done'); ok(await p.evaluate(n => C().done.clocks && S.cards.length === n + 1 && C().miss.clocks === 1, cards0), 'clocks: done, one card, one slip counted');
    expect(await say('use door'), /You climb the stairs/, 'the door opens after the clocks'); expect(await say('leave'), /step back out/, 'leave a place'); ok(await p.evaluate(() => C().at === 'map' && C().x === 4 && C().y === 5), 'leaving puts you by the door');
    // the Quake Station
    await tapTile(4, 3); await say('go to quake'); ok(await p.evaluate(() => C().at === 'quake'), 'walk to the Quake Station by name'); await say('use log'); await play('quakes'); await p.waitForTimeout(200); expect(await last(), /quake 7 begins at 5:34 and ends at 6:09/, 'quakes done'); await say('leave');
    // the hidden grove: walk east along the path, the gap shows
    await tapTile(11, 4); ok(await p.evaluate(() => cFound('G')), 'walking the long path should show the grove through the gap'); await say('go to grove'); ok(await p.evaluate(() => C().at === 'grove'), 'walk into the grove');
    expect(await say('cut down the tree'), /You have no tool to cut the old tree/, 'cut down the tree, in the grove'); expect(await say('dig a hole'), /You dig a small hole/, 'dig a hole, in the grove');
    await say('talk tortoise'); await play('tortoise', { wrongAt: 2 }); await p.waitForTimeout(200); expect(await last(), /walks off, backward/, 'tortoise done'); await say('leave');
    // the Council Hall: the book, who goes where, the timetable
    await say('go to hall'); ok(await p.evaluate(() => C().at === 'hall'), 'walk to the hall'); expect(await say('talk sara'), /Senior Historian.*ancient civilizations.*round table/, 'Sara tells you what she loves');
    await say('use book'); await p.waitForTimeout(200); ok(await p.evaluate(() => widget && widget.kind === 'book'), 'the book opens'); for (let i = 0; i < 6; i++) await p.tap('#nx'); await p.waitForTimeout(100);
    expect(await p.textContent('#toy'), /page 7 of 10[\s\S]*Save the Dinosaurs[\s\S]*A big asteroid is going to hit them/, 'page 7 of the book, in Marc\'s words'); if (out && name !== 'phone') await p.screenshot({ path: path.join(out, `chronosia_${name}_3_book.png`) }); await p.tap('#leave');
    await p.evaluate(() => { $('bookOn').checked = false; $('bookOn').onchange(); }); expect(await say('use book'), /out on loan.*Ask your teacher/, 'book switched off: printed copies only'); await p.evaluate(() => { $('bookOn').checked = true; $('bookOn').onchange(); });
    await say('use table'); await p.waitForTimeout(200); ok(await p.evaluate(() => widget && widget.id === 'match'), 'the table starts with who goes where'); await play('match', { wrongAt: 0 }); await p.waitForTimeout(200); expect(await last(), /Each member has two missions/, 'match done');
    expect(await say('talk zara'), /pages 5 and 10/, 'after the match, a member names their pages'); await say('use table'); await p.waitForTimeout(200); ok(await p.evaluate(() => widget && widget.id === 'plan'), 'then the table gives the timetable');
    if (out && name !== 'phone') { await p.evaluate(() => { widget.i = 4; cqShow(); }); await p.waitForTimeout(150); await p.screenshot({ path: path.join(out, `chronosia_${name}_4_timetable.png`) }); await p.evaluate(() => { widget.i = 0; cqShow(); }); }
    await play('plan'); await p.waitForTimeout(200); expect(await last(), /Sara goes to the Time Capsule.*Tim can go to both/, 'plan done'); await say('leave');
    // Cougar Rock, the fruit and the sundial
    expect(await say('go to rock'), /not found that place yet/, 'Cougar Rock is still in the mist'); await tapTile(4, 9); await tapTile(11, 10); await say('go to rock'); ok(await p.evaluate(() => C().at === 'ridge'), 'walk to Cougar Rock'); await say('use cougar'); await p.waitForTimeout(200);
    if (out && name !== 'phone' && await p.$('#try')) { await p.tap('#try'); await p.waitForTimeout(150); await p.screenshot({ path: path.join(out, `chronosia_${name}_5_cougar.png`) }); } const before = await p.evaluate(() => S.cards.map(c => c.r));
    await play('cougar'); await p.waitForTimeout(250); expect(await last(), /last job on Chronosia.*Timekeeper Cadet.*gold card/, 'all six done: the gold card'); const after = await p.evaluate(() => S.cards.map(c => c.r)); ok(after.length === before.length + 2 && after[after.length - 1] === 'gold', 'the last quest gives a card and a gold card');
    expect(await p.textContent('#status'), /Chronosia 6 of 6/, 'the status row'); await say('leave'); await tapTile(17, 10); expect(await last(), /ground sounds hollow/, 'the stone ring hints'); expect(await say('dig'), /old sundial.*You earn a card/, 'dig up the sundial'); expect(await say('dig'), /dug here before/, 'dig twice');
    await tapTile(4, 9); await tapTile(4, 7); await tapTile(16, 4); expect(await say('taste fruit'), /walk to the TimeTweak tree|TimeTweak fruit/, 'fruit'); await idle(); await p.waitForTimeout(300); expect(await last(), /everything runs backward/, 'tasting the fruit');
    if (out) await p.screenshot({ path: path.join(out, `chronosia_${name}_6_map.png`) });
    // the record is kept; fly away; land again
    await p.waitForTimeout(300); await p.reload(); await p.waitForTimeout(500); ok(await p.evaluate(() => S.mode === 'chrono' && Object.keys(CQ).every(q => C().done[q]) && C().finds.length === 2 && C().gold === true), 'everything should be kept after a reload');
    expect(await say('fly'), /You walk to your ship|You lift off/, 'fly from anywhere'); for (let i = 0; i < 150; i++) { if (await p.evaluate(() => S.mode === 'space')) break; await p.waitForTimeout(100); } ok(await p.evaluate(() => S.mode === 'space' && S.at === 'metrica'), 'flying leaves you at Galaxy Metrica');
    expect(await say('land'), /You land on Planet Chronosia/, 'land again'); expect(await say('hint'), /Every job on Chronosia is done/, 'the hint when all is done'); expect(await say('go to hall'), /The Council Hall\. A hall of tall pillars/, 'found places stay found');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]} (last words: "${await last().catch(() => '?')}")`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
