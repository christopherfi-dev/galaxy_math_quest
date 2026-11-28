// Music v2: record the tunes to sound files Marc can play on his phone, and measure them.   [Brief: HANDOFF_Music_2026-11-28.md §4]
//   Records 60 seconds (or the seconds given) of each tune, old and new, in headless Chromium (OfflineAudioContext: no speakers needed), from docs/music/index.html.
//   All files get ONE shared gain, so the loudest file peaks at -1 dB: old and new keep their true loudness against each other.
//   Measures, at the loudness the game plays them: the peak, the average (RMS) over the whole minute, the most voices at once,
//   and the time Chromium took to make one minute of music (on this computer, not an iPad: compare old and new, not the numbers themselves).
//   Also measures the game's own beep (beep(880, .1), a right answer) for comparison.
// Writes docs/music/samples/<name>.mp3 and docs/music/samples/measures.json.  Needs Playwright and ffmpeg.
// Run: node checks/music_v2_render.js [ids, comma separated; default: station,voltara] [seconds; default 60]
const { chromium } = require('playwright'), path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const IDS = (process.argv[2] || 'station,voltara').split(','), SECS = +(process.argv[3] || 60), OUT = path.resolve(__dirname, '..', 'docs', 'music', 'samples');
(async () => {
  const b = await chromium.launch(), p = await b.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '..', 'docs', 'music', 'index.html'));
  const jobs = []; IDS.forEach(id => { jobs.push([id + '_old', { old: 1, id }]); if (/* has new tunes */ true) ['A', 'B'].forEach(s => jobs.push([id + '_' + s, { id, style: s }])); });
  const have = await p.evaluate(() => Object.keys(GMQMusic.TUNES));
  const list = jobs.filter(([, j]) => j.old || have.indexOf(j.id) >= 0);
  const meas = await p.evaluate(async ({ list, SECS }) => {
    window.REC = {}; const res = {};
    function stats(buf) { let pk = 0, ss = 0, n = 0; for (let c = 0; c < buf.numberOfChannels; c++) { const d = buf.getChannelData(c); for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > pk) pk = a; ss += d[i] * d[i]; n++; } } return { peak: pk, rms: Math.sqrt(ss / n) }; }
    for (const [name, j] of list) { const r = j.old ? await oldRender({ id: j.id, secs: SECS }) : await GMQMusic.render({ id: j.id, style: j.style, secs: SECS, seed: 20261128 });
      window.REC[name] = r.buf; res[name] = Object.assign(stats(r.buf), { ms: Math.round(r.ms), maxVoices: r.max, notes: r.notes, skipped: r.skipped || null }); }
    const bp = await beepRender(); res.beep = stats(bp.buf); return res; }, { list, SECS });
  const topPeak = Math.max(...list.map(([n]) => meas[n].peak)), gain = Math.pow(10, -1 / 20) / topPeak;
  for (const [name] of list) {
    const b64 = await p.evaluate(({ name, gain }) => { const buf = window.REC[name], L = buf.getChannelData(0), R = buf.getChannelData(1), n = L.length, out = new Int16Array(n * 2);
      for (let i = 0; i < n; i++) { out[2 * i] = Math.max(-32767, Math.min(32767, Math.round(L[i] * gain * 32767))); out[2 * i + 1] = Math.max(-32767, Math.min(32767, Math.round(R[i] * gain * 32767))); }
      const u8 = new Uint8Array(out.buffer); let s = ''; for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000)); return btoa(s); }, { name, gain });
    const pcm = Buffer.from(b64, 'base64'), raw = path.join(OUT, name + '.raw'); fs.writeFileSync(raw, pcm);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', '44100', '-ac', '2', '-i', raw, '-codec:a', 'libmp3lame', '-b:a', '128k', path.join(OUT, name + '.mp3')]); fs.unlinkSync(raw);
  }
  const db = x => (20 * Math.log10(x)).toFixed(1) + ' dB';
  const report = { made: new Date().toISOString().slice(0, 10), seconds: SECS, sharedGainForFiles: +gain.toFixed(2), note: 'peak and rms are at the loudness the game plays them (dBFS); ms: Chromium time to make the music, on the build computer', tunes: {} };
  for (const [name] of list) { const m = meas[name]; report.tunes[name] = { peak: db(m.peak), rms: db(m.rms), maxVoices: m.maxVoices, notes: m.notes, msPerMinute: Math.round(m.ms * 60 / SECS), skipped: m.skipped }; }
  report.gameBeep = { peak: db(meas.beep.peak) };
  fs.writeFileSync(path.join(OUT, 'measures.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify(report, null, 1)); if (errs.length) console.log('PAGE ERRORS:', errs);
  await b.close(); console.log(errs.length ? 'RESULT: FAIL' : 'RESULT: PASS');
})();
