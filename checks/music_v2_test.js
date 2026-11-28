// Music v2 (GMQMusic, docs/music/index.html).   [Brief: HANDOFF_Music_2026-11-28.md §5: "the piece starts, changes tune by place, goes quieter when busy, stops,
//   and never has more than its voice limit playing at once."]
//   THE TUNES, as data: each place and style has 16 chords, 16 low notes and 16 melody bars of 8 eighths (a verse and a chorus); every note is in the tune's key; melodies in range;
//     no melody is one of the old tunes' melodies.
//   CLICKS: in a minute of each song (drums off: a shaker is noise and jumps by nature), no jump between two samples bigger than 0.02 (one was found and fixed on 28 November: a note's volume began at full for one sample).
//   VARIATION, on 2,000 seeds for each tune and style (20 times round each): no two times round in a row are planned the same; every note played
//     (the melody changed, the bells, the music box, the blips) is in the tune's key; melodies stay in range; never more than LIMIT voices at once;
//     no chord, low note or melody note is ever dropped for lack of voices (only the small extra sounds may be).
//   QUIETER WHEN BUSY: a recording with "a task is open" from 20 to 40 seconds: the average in that time is at most 40% of the time before.
//   LIVE, in Chromium with sound allowed: off at first; on plays notes; the tune follows the place; busy turns it down; off fades it out and stops
//     the timer; the voice count never passes the limit; the page itself at iPad sideways, iPad upright and a phone, no sideways scrolling, no errors.
// What this cannot check: how it sounds. Only a person can hear that. And it runs on Chromium, not the iPads' WebKit.
// Run: node checks/music_v2_test.js [folder for screenshots]
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), vm = require('vm');
const FILE = 'file://' + path.resolve(__dirname, '..', 'docs', 'music', 'index.html');
(async () => {
  const shots = process.argv[2], b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }), bad = [], errs = [], ok = (c, what) => { if (!c) bad.push(what); };
  const p = await b.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(FILE); await p.waitForTimeout(300);

  // ---- the tunes, as data
  const data = await p.evaluate(() => { const f = [], T = GMQMusic.TUNES, n = { tunes: 0 }, olds = Object.keys(OLD_TUNES).map(k => OLD_TUNES[k].v[0].s.replace(/\|/g, ' ').split(/\s+/).filter(Boolean).join(' '));
    for (const id in T) for (const st of ['A', 'B']) { const P = GMQMusic.parse(id, st); if (!P) { f.push(`${id} ${st}: missing`); continue; } n.tunes++; const pcs = T[id].pcs, inKey = m => pcs.indexOf(m % 12) >= 0;
      if (P.n !== 16 || P.bass.length !== 16 || P.mel.length !== 16) f.push(`${id} ${st}: not 16 bars (a verse and a chorus)`);
      T[id][st].s.forEach((bar, i) => { const tk = bar.split(/\s+/).filter(Boolean); if (tk.length !== 8) f.push(`${id} ${st} bar ${i + 1}: ${tk.length} eighths`); tk.forEach(t => { if (!/^([A-G](#|b)?\d|-|\.)$/.test(t)) f.push(`${id} ${st}: token ${t}`); }); });
      P.chords.forEach((c, i) => c.forEach(m => { if (!inKey(m)) f.push(`${id}: chord ${i + 1} has ${m}, not in the key`); }));
      P.bass.forEach((m, i) => { if (!inKey(m)) f.push(`${id}: low note ${i + 1} not in the key`); if (m < 36 || m > 52) f.push(`${id}: low note ${m} out of range`); });
      P.mel.forEach((bar, i) => bar.forEach(e => { if (!inKey(e.m)) f.push(`${id} ${st}: melody note ${e.m} in bar ${i + 1} not in the key`); if (e.m < GMQMusic.MEL[0] || e.m > GMQMusic.MEL[1]) f.push(`${id} ${st}: melody note ${e.m} out of range`); }));
      const mine = T[id][st].s.join(' ').split(/\s+/).filter(Boolean).join(' '); if (olds.indexOf(mine) >= 0) f.push(`${id} ${st}: the melody is an old tune's`); }
    return { f, n: n.tunes }; });
  data.f.forEach(x => bad.push('tunes: ' + x)); console.log(`tunes: ${data.n} checked as data, ${data.f.length} faults`);

  // ---- variation and voices, on many seeds. The piece is run in Node with a stand-in for the browser's audio (it records what would be played; no sound).
  const SEEDS = 2000, vr = (() => { const page = fs.readFileSync(path.resolve(__dirname, '..', 'docs', 'music', 'index.html'), 'utf8'), src = page.slice(page.indexOf('/* GMQ MUSIC: start'), page.indexOf('/* GMQ MUSIC: end */'));
    const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} });
    const node = x => Object.assign({ connect() {}, disconnect() {}, start() {}, stop() {} }, x);
    const fake = () => ({ sampleRate: 3000, currentTime: 0, destination: node({}), createGain: () => node({ gain: param() }), createOscillator: () => node({ frequency: param(), detune: param(), setPeriodicWave() {} }), createPeriodicWave: () => ({}),
      createBiquadFilter: () => node({ frequency: param(), Q: param() }), createDelay: () => node({ delayTime: param() }), createConvolver: () => node({}), createBufferSource: () => node({}),
      createBuffer: (c, n) => ({ getChannelData: () => new Float32Array(n) }) });
    const box = { window: {}, document: { hidden: false }, performance: { now: () => 0 }, setTimeout: () => 0, Math, JSON }; vm.createContext(box); vm.runInContext(src + '\n;this.GMQMusic = GMQMusic;', box);
    const G = box.GMQMusic, T = G.TUNES, f = [], out = {};
    for (const id in T) for (const st of ['A', 'B']) { const P = G.parse(id, st), pcs = T[id].pcs; let maxV = 0, extraSkip = 0, notes = 0, same = 0, ops = {};
      for (let seed = 1; seed <= SEEDS; seed++) { const E = G.engine(fake(), null, seed); E.log = []; E.setTune(id, st, 0); let last = ''; const passLen = P.sd * 8 * P.n;
        for (let k = 0; k < 20; k++) { E.fill((k + 1) * passLen - .01); if (k && E.sig === last) same++; last = E.sig; }
        maxV = Math.max(maxV, E.max); extraSkip += E.skipped.extra; notes += E.notes; if (E.skipped.core) f.push(`${id} ${st} seed ${seed}: ${E.skipped.core} chord, low or melody notes dropped`);
        E.log.forEach(x => { if (x.glide || x.m === null) return; if (pcs.indexOf(x.m % 12) < 0) f.push(`${id} ${st} seed ${seed}: ${x.d} note ${x.m} not in the key`);
          if (x.d === 'mel' && (x.m < G.MEL[0] || x.m > G.MEL[1])) f.push(`${id} ${st} seed ${seed}: melody note ${x.m} out of range`); if (x.m > 100 || x.m < 30) f.push(`${id} ${st} seed ${seed}: note ${x.m} out of range`); });
        if (f.length > 30) break; }
      if (maxV > G.LIMIT) f.push(`${id} ${st}: ${maxV} voices at once`); if (same) f.push(`${id} ${st}: ${same} times a time round was planned the same as the one before`);
      out[id + '.' + st] = { maxVoices: maxV, extraSoundsDroppedPerSeed: +(extraSkip / SEEDS).toFixed(2), notesPerSeed: Math.round(notes / SEEDS) }; }
    return { f: f.slice(0, 30), out }; })();
  vr.f.forEach(x => bad.push('variation: ' + x)); console.log(`variation, ${SEEDS} seeds x 20 times round:`, JSON.stringify(vr.out));

  // ---- quieter when busy, and a change of place, recorded
  const busy = await p.evaluate(async () => { const r = await GMQMusic.render({ id: 'station', style: 'A', secs: 60, seed: 5, busyFrom: 20, busyTo: 40 }), d = r.buf.getChannelData(0), sr = r.buf.sampleRate;
    const rms = (a, z) => { let s = 0; for (let i = a * sr; i < z * sr; i++) s += d[i] * d[i]; return Math.sqrt(s / ((z - a) * sr)); };
    const c = await GMQMusic.render({ id: 'station', style: 'A', secs: 40, seed: 5, changeAt: 20, changeTo: 'voltara' }), s = await GMQMusic.render({ id: 'voltara', style: 'B', secs: 30, seed: 5, stopAt: 15 }), sd = s.buf.getChannelData(0);
    let tail = 0; for (let i = 17 * sr; i < 30 * sr; i++) tail = Math.max(tail, Math.abs(sd[i]));
    const clicks = {}; for (const id of ['station', 'voltara']) for (const st of ['A', 'B']) { const S = GMQMusic.TUNES[id][st], dr = S.drums; S.drums = 0; const x = await GMQMusic.render({ id, style: st, secs: 60, seed: 9 }), y = x.buf.getChannelData(0); S.drums = dr; let j = 0; for (let i = 1; i < y.length; i++) j = Math.max(j, Math.abs(y[i] - y[i - 1])); clicks[id + '.' + st] = +j.toFixed(4); }
    return { before: rms(5, 19), during: rms(23, 39), after: rms(45, 59), changeMax: c.max, stopTail: tail, limit: GMQMusic.LIMIT, clicks }; });
  for (const k in busy.clicks) ok(busy.clicks[k] < .02, `clicks: ${k} jumps ${busy.clicks[k]} between two samples (a click)`);
  console.log('largest jump between two samples (a click would be over 0.02):', JSON.stringify(busy.clicks));
  ok(busy.during <= .4 * busy.before, `busy: the average while a task is open is ${(busy.during / busy.before * 100).toFixed(0)}% of before (want 40% or less)`);
  ok(busy.after >= .6 * busy.before, `busy: after the task the music does not come back (${(busy.after / busy.before * 100).toFixed(0)}%)`);
  ok(busy.changeMax <= busy.limit, `a change of place: ${busy.changeMax} voices at once`);
  ok(busy.stopTail < 1e-3, `stop: still sounding 2 seconds after stop (${busy.stopTail})`);
  console.log(`busy: ${(busy.during / busy.before * 100).toFixed(0)}% of the average while a task is open; change of place: ${busy.changeMax} voices at most; after stop: ${busy.stopTail.toExponential(1)}`);

  // ---- live, with a real AudioContext
  const live = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), o = {}; let place = 'station', bz = false, maxV = 0;
    o.offFirst = !GMQMusic.isOn() && GMQMusic.stats().notes === 0;
    GMQMusic.setup({ pick: () => place, busy: () => bz }); GMQMusic.setStyle('A'); GMQMusic.setOn(true); const spy = setInterval(() => { maxV = Math.max(maxV, GMQMusic.stats().voices); }, 50);
    await w(2500); let s = GMQMusic.stats(); o.on = { tune: s.tune, notes: s.notes, voices: s.voices };
    place = 'voltara'; await w(1500); o.change = GMQMusic.stats().tune;
    bz = true; await w(1800); o.busyDuck = GMQMusic.stats().duck; bz = false; await w(1800); o.unDuck = GMQMusic.stats().duck;
    place = 'nowhere'; await w(2000); o.nowhere = GMQMusic.stats().tune; place = 'station';
    GMQMusic.stop(); await w(1200); s = GMQMusic.stats(); o.stopped = { on: GMQMusic.isOn(), master: s.master }; const n0 = s.notes; await w(800); o.after = GMQMusic.stats().notes - n0;
    clearInterval(spy); o.maxV = Math.max(maxV, GMQMusic.stats().max); return o; });
  ok(live.offFirst, 'live: not off at first');
  ok(live.on.tune === 'station.A' && live.on.notes > 0 && live.on.voices > 0, `live: on does not play the station (${JSON.stringify(live.on)})`);
  ok(live.change === 'voltara.A', `live: the tune does not follow the place (${live.change})`);
  ok(live.busyDuck < .4 && live.unDuck > .9, `live: busy does not turn it down and back (${live.busyDuck}, ${live.unDuck})`);
  ok(live.nowhere === null, 'live: a place with no tune still plays one');
  ok(!live.stopped.on && live.stopped.master < .01 && live.after === 0, `live: off does not stop it (${JSON.stringify(live.stopped)}, ${live.after} notes after)`);
  ok(live.maxV <= 28, `live: ${live.maxV} voices at once`);
  console.log('live:', JSON.stringify(live));

  // ---- the page on three screens
  for (const [name, w, h] of [['ipad', 1180, 745], ['upright', 820, 1180], ['phone', 390, 760]]) {
    const q = await b.newPage({ viewport: { width: w, height: h } }); q.on('pageerror', e => errs.push(name + ': ' + e.message)); await q.goto(FILE); await q.waitForTimeout(200);
    const m = await q.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, btn: Math.min(...[...document.querySelectorAll('button')].map(x => x.getBoundingClientRect().height)), audio: document.querySelectorAll('audio').length }));
    ok(m.sw <= m.cw, `${name}: the page scrolls sideways (${m.sw} > ${m.cw})`); ok(m.btn >= 44, `${name}: a button is only ${m.btn}px tall`); ok(m.audio === 6, `${name}: ${m.audio} recordings, not 6`);
    await q.click('button[data-id="station"][data-k="A"]'); await q.waitForTimeout(300); ok(await q.evaluate(() => /KIS Station, new A/.test(document.getElementById('now').textContent)), `${name}: tapping New A does not play it`);
    if (shots) { fs.mkdirSync(shots, { recursive: true }); await q.screenshot({ path: path.join(shots, `music_page_${name}.png`), fullPage: true }); }
    await q.close(); }

  ok(!errs.length, 'page errors: ' + errs.join('; '));
  await b.close();
  console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : 'all checks passed');
  console.log(bad.length ? 'RESULT: FAIL' : 'RESULT: PASS'); process.exit(bad.length ? 1 : 0);
})();
