// Algora's tunes, checked as data.   [Brief 2: "a tune for each region, made in code, like the game's version 88"]
// It reads the tunes straight out of the page (MUSIC-BEGIN to MUSIC-END in prototypes/big_world.html).
// The same checks the game's own music test makes on its tunes:
//   - every voice of a tune has the same length, and the length is whole bars
//   - every note is in the tune's key (pcs) and in range (A1 to C7)
//   - no two tunes share a melody; none is a tune of the game's (the game's first voices are compared, if the game file is there)
//   - every tune is used by the page (musPick can return it)
//   - loudness is low: no voice louder than .06 (the game's beeps are louder)
// How it SOUNDS only a person can judge. The switch (off at first, on, off) is played in checks/bigworld_play_test.js.
//
// Run:  node checks/bigworld_music_check.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const page = fs.readFileSync(path.resolve(__dirname, '..', 'prototypes', 'big_world.html'), 'utf8'), a = page.indexOf('/*MUSIC-BEGIN'), b = page.indexOf('/*MUSIC-END*/');
if (a < 0 || b < 0) { console.log('FAILED: no MUSIC-BEGIN / MUSIC-END in the page'); process.exit(1); }
const src = page.slice(a, b), t0 = src.indexOf('const TUNES'), t1 = src.indexOf('const MUS = ');
const box = {}; vm.createContext(box); vm.runInContext(src.slice(t0, t1) + '\n;this.TUNES = TUNES;', box);
const TUNES = box.TUNES, bad = [], say = (ok, what) => { if (!ok) bad.push(what); }, B = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = tk => { const m = /^([A-G])([#b]?)(\d)$/.exec(tk); return m ? (+m[3] + 1) * 12 + B[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) : null; };
const melodies = {};
for (const id of Object.keys(TUNES)) { const T = TUNES[id]; say(T.bpm >= 50 && T.bpm <= 130, `${id}: bpm ${T.bpm}`); let len = null;
  T.v.forEach((vc, i) => { const bars = vc.s.split('|').map(x => x.trim().split(/\s+/).filter(Boolean)), toks = [].concat(...bars); if (len === null) len = toks.length; say(toks.length === len, `${id}: voice ${i + 1} has ${toks.length} steps, the first has ${len}`); say(new Set(bars.map(x => x.length)).size === 1, `${id}: voice ${i + 1} has bars of different lengths`);
    say(vc.v > 0 && vc.v <= .06, `${id}: voice ${i + 1} is too loud (${vc.v})`);
    toks.forEach(tk => { if (tk === '-' || tk === '.') return; if (tk === 'x') return say(!!vc.tick, `${id}: a click in a voice that is not a tick`); const m = midi(tk); say(m !== null, `${id}: "${tk}" is not a note`); if (m !== null) { say(T.pcs.indexOf(m % 12) >= 0, `${id}: ${tk} is not in the tune's key`); say(m >= 33 && m <= 96, `${id}: ${tk} is out of range`); } }); });
  melodies[id] = T.v[0].s.replace(/\s+/g, ' '); say(page.indexOf(`'${id}'`) >= 0 && new RegExp(`return [^;]*'${id}'|\\? '${id}'|: '${id}'`).test(page), `${id}: the page never plays this tune`); }
const ids = Object.keys(melodies); for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) say(melodies[ids[i]] !== melodies[ids[j]], `${ids[i]} and ${ids[j]} share a melody`);
try { const game = fs.readFileSync(path.resolve(__dirname, '..', 'prototypes', 'kis_station_sketch.html'), 'utf8'); for (const id of ids) say(game.indexOf(melodies[id]) < 0, `${id}: its melody is one of the game's own tunes`); } catch (e) { console.log('(the game file is not here; its tunes were not compared)'); }
console.log(`tunes: ${ids.join(', ')}`);
console.log(bad.length ? 'FAILED:\n  ' + bad.join('\n  ') : `ok: ${ids.length} tunes: every voice the same length, every note in its key, no two the same, none of the game's, all used, all quiet`);
process.exit(bad.length ? 1 : 0);
