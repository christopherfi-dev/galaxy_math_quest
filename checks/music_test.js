// Music (version 88).   [Source: Marc, 2026-11-22: "Do music... Each world or each place get their own music ..for now."]   [Proposal: the tunes are ours, written in the game]
//   THE TUNES, as data: every voice of a tune has the same number of eighths; every token is a note, "-", "." or "x"; every note is in the tune's key
//     (its pitch classes) and in a range a speaker can play (MIDI 30 to 100); every tune has a speed from 50 to 140; every voice has a sound in it.
//   WHERE: each world has its own tune (the station, space, Voltara, the 20 small worlds, Chronosia, Xylophora, the mission ship, Lengthar),
//     the start screens have one, and Chronosia's dark cave and workshop share a darker one. No tune is unused.
//   PLAY, on three screens: off at first, and no sound is made; the Music button turns it on, and notes are played; the tune follows the cadet from
//     world to world; it is softer while a task box is open; off stops it; on is remembered after the game is closed, and starts again at the first tap
//     (an iPad allows sound only after a tap); Sound and Music are separate switches; both buttons fit on the screen.
// What this cannot check: how the music sounds. Only a person can hear that.
// Run: node checks/music_test.js [folder for screenshots]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const out = process.argv[2], b = await chromium.launch({ args: ['--autoplay-policy=user-gesture-required'] }), bad = [], errs = [], FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html');
  let first = true;
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true }), p = await ctx.newPage();
    p.on('pageerror', e => errs.push(name + ': ' + e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(name + ': ' + m.text()); });
    await p.addInitScript(() => { window.GMQ_NO_CARDPOP = true; try { if (!localStorage.getItem('gmq-test-set')) { localStorage.setItem('gmq-test-set', '1'); localStorage.setItem('gmq-cards', 'off'); } } catch (e) {} });
    await p.goto(FILE); await p.waitForTimeout(400);
    const ok = (c, what) => { if (!c) bad.push(`${name}: ${what}`); };
    if (first) {      // ---- the tunes, as data
      first = false;
      const d = await p.evaluate(() => { const f = [], ids = Object.keys(TUNES); for (const id of ids) { const T = TUNES[id], P = musParse(id);
          if (!(T.bpm >= 50 && T.bpm <= 140)) f.push(`${id}: speed ${T.bpm}`);
          P.voices.forEach((v, k) => { if (v.n !== P.n) f.push(`${id} voice ${k}: ${v.n} eighths, not ${P.n}`); v.tk.forEach(t => { if (!/^([A-G](#|b)?\d|-|\.|x)$/.test(t)) f.push(`${id} voice ${k}: the token "${t}"`); });
            if (!v.ev.some(Boolean)) f.push(`${id} voice ${k}: no sound in it`); if (v.tick && v.ev.some(e => e && e.m !== 'x')) f.push(`${id} voice ${k}: a click voice with a note`);
            if (!v.tick) v.ev.forEach(e => { if (!e) return; if (e.m === 'x') f.push(`${id} voice ${k}: a click in a note voice`); else { if (e.m < 30 || e.m > 100) f.push(`${id} voice ${k}: note ${e.m} out of range`); if (T.pcs.indexOf(((e.m % 12) + 12) % 12) < 0) f.push(`${id} voice ${k}: note ${e.m} is not in the key`); } }); }); }
        const want = { intro: 'title', arrive: 'title', station: 'station', space: 'space', planet: 'voltara', world: 'worlds', xylo: 'xylo', star: 'star', len: 'len' }, keep = S.mode, keepAt = C().at, used = new Set();
        for (const m of Object.keys(want)) { S.mode = m; const t = musPick(); used.add(t); if (t !== want[m]) f.push(`mode ${m}: tune ${t}, not ${want[m]}`); }
        S.mode = 'chrono'; for (const [at, t0] of [['map', 'chrono'], ['tower', 'chrono'], ['cave', 'cave'], ['shop', 'cave']]) { C().at = at; const t = musPick(); used.add(t); if (t !== t0) f.push(`Chronosia, ${at}: tune ${t}, not ${t0}`); }
        S.mode = keep; C().at = keepAt; ids.forEach(id => { if (!used.has(id)) f.push(`the tune ${id} is never played`); });
        const sig = new Set(ids.map(id => TUNES[id].v[0].s)); if (sig.size !== ids.length) f.push('two tunes share a melody');
        return { f, n: ids.length }; });
      d.f.forEach(x => bad.push('tunes: ' + x)); console.log(`${d.n} tunes checked: ${d.f.length} faults.`);
    }
    // ---- off at first
    ok(await p.evaluate(() => !MUS.on && !MUS.timer && $('mus').textContent === 'Music: off'), 'music is off at first');
    await p.evaluate(() => { skipIntro(); }); await p.mouse.click(w / 2, 60); await p.waitForTimeout(300);
    ok(await p.evaluate(() => !MUS.timer && MUS.count === 0), 'a tap with music off plays nothing');
    // ---- the button is on screen and the two switches are separate
    await p.evaluate(() => { const m = $('more') || document.querySelector('[data-fold]'); }); const box = await p.locator('#mus').boundingBox();
    ok(box && box.width > 40 && box.x >= 0 && box.x + box.width <= w + 1, 'the Music button fits on the screen');
    // ---- on
    await p.locator('#mus').scrollIntoViewIfNeeded(); await p.locator('#mus').click(); await p.waitForTimeout(1500);
    ok(await p.evaluate(() => MUS.on && !!MUS.timer && $('mus').textContent === 'Music: on' && getKeep('gmq-music') === 'on'), 'the button turns music on, and it is kept');
    ok(await p.evaluate(() => !soundOn), 'Sound stays off when Music is on');
    await p.locator('#snd').click(); ok(await p.evaluate(() => soundOn && $('snd').textContent === 'Sound: on' && MUS.on), 'Sound turns on by itself, and Music stays on'); await p.locator('#snd').click(); ok(await p.evaluate(() => !soundOn && $('snd').textContent === 'Sound: off'), 'Sound turns off again');
    const c1 = await p.evaluate(() => MUS.count); ok(c1 > 0, 'notes are played: ' + c1); ok(await p.evaluate(() => MUS.tune === 'station' && AC.state === 'running'), 'the station tune plays');
    if (out) await p.screenshot({ path: path.join(out, `music_${name}_on.png`) });
    // ---- it follows the cadet
    for (const [go, t] of [['goChronosia()', 'chrono'], ["C().at = 'cave'", 'cave'], ['goXylophora()', 'xylo'], ['goLengthar()', 'len'], ['goVoltara()', 'voltara'], ['goSpace()', 'space']]) {
      const r = await p.evaluate(g => { try { (0, eval)(g); return ''; } catch (e) { return e.message; } }, go); if (r) { ok(false, `${go}: ${r}`); continue; }
      await p.waitForTimeout(400); ok(await p.evaluate(t => MUS.tune === t, t), `after ${go} the tune is ${t}: ${await p.evaluate(() => MUS.tune)}`); }
    // ---- softer while a task box is open
    await p.evaluate(() => { goChronosia(); }); await p.waitForTimeout(300);
    ok(await p.evaluate(() => MUS.want === 1), 'full loudness with nothing open');
    await p.evaluate(() => { fAsk({ where: 'Chronosia', title: 'A test', ask: '', q: '2 + 2?', unit: '', on: () => 'no' }); }); await p.waitForTimeout(300);
    ok(await p.evaluate(() => MUS.want < .5), 'softer while a task box is open'); await p.evaluate(() => closeToy()); await p.waitForTimeout(300); ok(await p.evaluate(() => MUS.want === 1), 'loud again after');
    // ---- remembered, and waits for a tap
    await p.reload(); await p.waitForTimeout(600);
    ok(await p.evaluate(() => MUS.on && !MUS.timer && $('mus').textContent === 'Music: on'), 'after closing and opening: still on, waiting for a tap');
    await p.mouse.click(w / 2, 60); await p.waitForTimeout(800); ok(await p.evaluate(() => !!MUS.timer && MUS.count > 0), 'the first tap starts it');
    // ---- off
    await p.locator('#mus').scrollIntoViewIfNeeded(); await p.locator('#mus').click(); await p.waitForTimeout(200); const c2 = await p.evaluate(() => MUS.count); await p.waitForTimeout(800);
    ok(await p.evaluate(c => !MUS.on && !MUS.timer && MUS.count === c && getKeep('gmq-music') === 'off', c2), 'off stops it, and is kept');
    if (out) { await p.locator('#mus').scrollIntoViewIfNeeded(); await p.screenshot({ path: path.join(out, `music_${name}_buttons.png`) }); }
    await ctx.close();
  }
  await b.close(); for (const e of errs) bad.push('PAGE ERROR ' + e);
  console.log(bad.length ? 'FAULTS:\n  ' + bad.join('\n  ') : 'Music: every check passed, on three screens.'); console.log('RESULT: ' + (bad.length ? 'FAIL' : 'PASS')); process.exit(bad.length ? 1 : 0);
})();
