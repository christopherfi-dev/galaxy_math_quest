// How big each station room is drawn (tile size ts) at three picture sizes, on an iPad held sideways (1180x745). A measure, not a pass/fail check.
// Used for proposals/GMQ_Picture_Size_v1_2026-11-26.md. Run: node checks/room_size_measure.js
const { chromium } = require('playwright'); const path = require('path');
(async () => { const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1180, height: 745 } }); const p = await ctx.newPage();
 await p.addInitScript(() => { ['gmq-cards','gmq-hazards','gmq-rats','gmq-wisps','gmq-flyin'].forEach(k => localStorage.setItem(k,'off')); });
 await p.goto('file://' + path.resolve('prototypes/kis_station_sketch.html')); await p.waitForTimeout(500); await p.evaluate(() => skipIntro()); await p.waitForTimeout(300);
 const rooms = await p.evaluate(() => Object.keys(ROOMS)); const sizes = { now: null, B_words_beside: [748, 727], C_full: [1164, 729], C_full_caption: [1164, 629] };
 const res = {};
 for (const [lab, wh] of Object.entries(sizes)) {
   if (wh) await p.evaluate(([w, h]) => { cv.style.position = 'fixed'; cv.style.left = '8px'; cv.style.top = '8px'; cv.style.width = w + 'px'; cv.style.height = h + 'px'; cv.style.zIndex = 50; size(); }, wh);
   for (const r of rooms) { await p.evaluate(r => { S.room = r; const R = ROOMS[r]; snap = true; }, r); await p.waitForTimeout(120); const t = await p.evaluate(() => [ts, vw, vh]); (res[r] = res[r] || {})[lab] = t[0]; }
 }
 console.log('room'.padEnd(12), Object.keys(sizes).map(s => s.padEnd(16)).join(''));
 for (const r of rooms) console.log(r.padEnd(12), Object.keys(sizes).map(s => (res[r][s].toFixed(1) + (s === 'now' ? '' : ' x' + (res[r][s] / res[r].now).toFixed(2))).padEnd(16)).join(''));
 await b.close(); })();
