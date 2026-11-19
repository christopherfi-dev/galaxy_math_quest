// One screen: the picture, the box and the word rows are all in view, and everything else waits behind a small menu.
// [Source: Marc, 2026-11-19, with a photo of a student's iPad mini held sideways: "this entire bottom screen pops up. It should be hidden until they
//  want to see it. There's a lot of information here they do not need popping up all the time. This should be like a little mini menu."]
// What the photo showed: the word rows were below the bottom of the screen, so a child had to scroll to reach them and lost the picture.
//   - on four iPad screens, a classroom board and a laptop: the picture, the box, Do, Go, Here, the bag and the More row are all on the screen at once,
//     on the station, on a Voltara street (the longest Here row) and on Chronosia's map. Held sideways, the page cannot scroll at all.
//   - the mission, the ship's parts, the cards and the teacher's things are hidden until their button in the More row is tapped. One opens at a time.
//   - a new card puts a dot on My cards. The Mission button appears only once there is a mission. The teacher's buttons still work from their panel.
// Run: node checks/one_screen_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch(), bad = [], errs = [];
  for (const [name, w, h, touch] of [['ipad-mini-sideways', 1133, 670, true], ['ipad-sideways', 1180, 750, true], ['ipad-mini-upright', 744, 1050, true], ['ipad-upright', 820, 1100, true], ['board', 1920, 1000, true], ['laptop', 1366, 700, false]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch, deviceScaleFactor: 1 }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { try { localStorage.setItem('gmq-cards', 'off'); localStorage.setItem('gmq-hazards', 'off'); localStorage.setItem('gmq-rats', 'off'); localStorage.setItem('gmq-wisps', 'off'); } catch (e) {} });
    await p.goto('file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html')); await p.waitForTimeout(300);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    const view = () => p.evaluate(() => { window.scrollTo(0, 0); const H = innerHeight, W = innerWidth, R = id => { const e = document.getElementById(id); if (!e || e.hidden) return null; const q = e.getBoundingClientRect(); return q.height ? [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)] : null; }, o = {}; ['cv', 'cmd', 'verbs', 'dirs', 'nouns', 'bag', 'menu'].forEach(id => { o[id] = R(id); });
      const outside = Object.keys(o).filter(id => o[id] && (o[id][1] < 0 || o[id][3] > H + 1 || o[id][0] < 0 || o[id][2] > W + 1)); return { outside, o, H, page: document.documentElement.scrollHeight, cv: [document.getElementById('cv').clientWidth, document.getElementById('cv').clientHeight], shown: Array.from(document.querySelectorAll('#panels > *')).filter(e => getComputedStyle(e).display !== 'none').map(e => e.id) }; });
    try {
    const sideways = w > h && w >= 900;
    for (const [where, go] of [['the station', () => { skipIntro(); }], ['a Voltara street', () => { goVoltara(); const v = V(); v.crossed = true; v.met = true; v.count = true; vGo('homes', .3); PL.fade = 0; drawWords(); }], ['Chronosia\'s map', () => { goChronosia(); C().seen = new Array(CW * CH).fill('1').join(''); drawWords(); }]]) {
      await p.evaluate(go); await p.waitForTimeout(700); const v = await view();
      ok(!v.outside.length, `${where}: off the screen: ${v.outside.join(', ')} (screen ${v.H} tall; ${JSON.stringify(v.o)})`); ok(v.cv[1] >= 280 && v.cv[0] >= 500, `${where}: the picture is too small: ${v.cv}`); ok(!v.shown.length, `${where}: these panels should be hidden until asked for: ${v.shown}`);
      if (sideways) ok(v.page <= v.H + 1, `${where}: held sideways the page should not scroll at all: page ${v.page}, screen ${v.H}`);
      if (out && where !== 'Chronosia\'s map') await p.screenshot({ path: path.join(out, `onescreen_${name}_${where.replace(/[^a-z]+/gi, '_')}.png`) }); }
    // the picture must not jump about as the rows change from place to place
    if (!sideways) { const hs = []; for (const sc of ['homes', 'plaza', 'meadow', 'homes']) { await p.evaluate(sc => { goVoltara(); vGo(sc, .3); PL.fade = 0; drawWords(); }, sc); await p.waitForTimeout(400); hs.push(await p.evaluate(() => document.querySelector('.console').offsetHeight)); } ok(hs[1] === hs[0] && hs[2] === hs[0] && hs[3] === hs[0], 'the picture should keep its size as the word rows change: ' + hs); }
    // ---- the More row
    await p.evaluate(() => { goStation(); S.v = null; drawStatus(); }); await p.waitForTimeout(400); let m = await p.evaluate(() => Array.from(document.querySelectorAll('#menu .mbtn')).filter(x => !x.hidden).map(x => x.textContent).join()); ok(m === 'My ship,My cards,Teacher', 'with no mission yet the More row shows My ship, My cards, Teacher: ' + m);
    ok(await p.evaluate(() => /Sketch version \d+/.test($('t_ver').textContent) && $('t_ver').getBoundingClientRect().height > 0), 'the version number should stay in view');
    await p.click('#m_ship'); await p.waitForTimeout(250); let s2 = await view(); ok(s2.shown.join() === 'status,partsbox' && await p.evaluate(() => $('m_ship').classList.contains('on') && /Your ship/.test($('partsbox').textContent) && /Parts \d of 5/.test($('status').textContent)), 'My ship should open the counts and the ship panel: ' + s2.shown);
    await p.click('#m_cards'); await p.waitForTimeout(250); s2 = await view(); ok(s2.shown.join() === 'cards', 'My cards should close the ship panel and open the cards: ' + s2.shown); await p.click('#m_cards'); await p.waitForTimeout(250); s2 = await view(); ok(!s2.shown.length, 'a second tap should close the panel: ' + s2.shown);
    await p.evaluate(() => { card('rare'); drawStatus(); }); await p.waitForTimeout(250); ok(await p.evaluate(() => $('m_cards').classList.contains('new') && !$('m_ship').classList.contains('new')), 'a new card should put a dot on My cards'); await p.click('#m_cards'); await p.waitForTimeout(250); ok(await p.evaluate(() => !$('m_cards').classList.contains('new') && /Your cards: 1/.test($('cards').textContent)), 'opening My cards clears the dot and shows the card'); await p.click('#m_cards');
    await p.click('#m_teacher'); await p.waitForTimeout(250); s2 = await view(); ok(s2.shown.join() === 'teacherbox' && await p.evaluate(() => $('t_volt').getBoundingClientRect().height > 0), 'Teacher should show the teacher\'s buttons'); await p.evaluate(() => menuOpen('teacher')); await p.waitForTimeout(120); await p.click('#t_volt'); await p.waitForTimeout(500); ok(await p.evaluate(() => S.mode === 'planet'), 'Go to Voltara still works from the Teacher panel');
    m = await p.evaluate(() => Array.from(document.querySelectorAll('#menu .mbtn')).filter(x => !x.hidden).map(x => x.textContent).join()); ok(m === 'Mission,My ship,My cards,Teacher', 'once on Voltara the More row also shows Mission: ' + m); await p.click('#m_mission'); await p.waitForTimeout(250); s2 = await view(); ok(s2.shown.join() === 'mission' && await p.evaluate(() => /Mission Voltara/.test($('mission').textContent)), 'Mission should open the mission steps: ' + s2.shown);
    await p.reload(); await p.waitForTimeout(500); s2 = await view(); ok(!s2.shown.length, 'after a reload every panel is closed again');
    } catch (e) { bad.push(`${name}: the test stopped: ${String(e.message).split('\n')[0]}`); }
    await ctx.close();
  }
  await b.close(); bad.forEach(x => console.log('FAILED ' + x)); console.log('console errors: ' + (errs.length ? errs.join(' | ') : 'none')); console.log('RESULT: ' + (bad.length || errs.length ? 'FAIL' : 'PASS')); process.exit(bad.length || errs.length ? 1 : 0);
})();
