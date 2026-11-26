// The big world's pictures: no two words drawn on top of each other, and no word off the picture.   [Marc, 25 November, with a photo of the baker's oven on an
// iPad and a MacBook: "trays for 5  4 trays: 20.  5 trays: 25." drawn over "no number of full trays". "This happens when the baker is talking."]
// Page: prototypes/big_world.html (or a page named on the command line).
//
// It watches every word the canvas draws (fillText, which the page's text() uses), with its real size on the screen. For every picture the page has, at every
// step of its talk (READ.i 0 to 7, since a finished example adds a row on each page), on six screens (iPad sideways and upright, a phone, two MacBook windows
// and the class board), it reports:
//   - two words whose boxes overlap (the same word drawn twice in one place, for an outline, is allowed)
//   - a word that runs off the picture
// A picture it cannot draw is reported too, with the error.
// Run:  node checks/bigworld_picture_words_check.js [page.html]     (about a minute)
const { chromium } = require('playwright');
const path = require('path');
const URL = 'file://' + path.resolve(process.argv.find(a => /\.html$/.test(a)) || path.resolve(__dirname, '..', 'prototypes', 'big_world.html'));
const SIZES = [['iPad sideways', 1180, 745], ['iPad upright', 820, 1180], ['phone', 390, 760], ['MacBook', 1440, 790], ['small MacBook', 1280, 700], ['class board', 1920, 1080]];
const bad = []; let pics = 0, steps = 0;
(async () => {
  const b = await chromium.launch();
  for (const [name, w, h] of SIZES) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }), p = await ctx.newPage(), errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(URL + '?seed=7&fastread=1'); await p.evaluate(() => localStorage.clear()); await p.goto(URL + '?seed=7&fastread=1');
    await p.waitForFunction(() => window.__bw && window.__bw.S()); await p.waitForTimeout(300);
    // a cadet far into the game, so every picture has what it draws; no card up (the card would not change the picture)
    await p.evaluate(() => { ['lessonDone', 'metElder', 'gotPouch', 'metKeeper', 'sawE3', 'sawBaker'].forEach(setFlag); if (S.pouch === null || S.pouch === undefined) S.pouch = NUM.start;
      READ.q = []; READ.then = null; document.getElementById('read').hidden = true; document.getElementById('veil').hidden = true;
      const fill = cx.fillText.bind(cx); window.__words = [];
      cx.fillText = function (t, x, y, mw) { const m = cx.measureText(String(t)), T = cx.getTransform(), a = T.transformPoint({ x: x - m.actualBoundingBoxLeft, y: y - m.actualBoundingBoxAscent }), z = T.transformPoint({ x: x + m.actualBoundingBoxRight, y: y + m.actualBoundingBoxDescent });
        if (String(t).trim()) window.__words.push({ t: String(t), x0: Math.min(a.x, z.x), x1: Math.max(a.x, z.x), y0: Math.min(a.y, z.y), y1: Math.max(a.y, z.y) }); return fill(t, x, y, mw); }; });
    const makers = await p.evaluate(() => Object.getOwnPropertyNames(window).filter(k => /^[a-z][A-Za-z]*Pic$/.test(k) && typeof window[k] === 'function'));
    const cases = [];
    for (const mk of makers) { if (mk === 'machinePic') { cases.push({ mk, args: ['lesson'] }); for (const s of await p.evaluate(() => SITES.slice())) cases.push({ mk, args: [s] }); } else { cases.push({ mk, args: [] }); if (await p.evaluate(mk => { try { return 'open' in window[mk](); } catch (e) { return false; } }, mk)) cases.push({ mk, args: [], open: true }); } }      /* a picture that can open (the Makers' box) is drawn open too */
    for (const c of cases) {
      let drew = false;
      for (let i = 0; i <= 7; i++) {
        const r = await p.evaluate(async ([mk, args, i, open]) => { try { PIC = window[mk](...(mk === 'machinePic' && args[0] === 'lesson' ? ['lesson', typeof LESSON !== 'undefined' ? LESSON : undefined] : args)); if (open) PIC.open = true; } catch (e) { return { err: 'could not make: ' + e.message }; }
          READ.i = i; const d = PIC.draw; let got = null; PIC.draw = function () { window.__words = []; const out = d.apply(this, arguments); got = window.__words.slice(); return out; };
          await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 30))));
          if (PIC.busy) for (let k = 0; k < 40 && PIC.busy(); k++) await new Promise(res => setTimeout(res, 100));      /* a moving picture: judge it when it stops */
          await new Promise(res => requestAnimationFrame(() => requestAnimationFrame(res)));
          const title = (PIC.title || '') + (open ? ', open' : ''); PIC = null; return { words: got, W: cx.canvas.width, H: cx.canvas.height, title }; }, [c.mk, c.args, i, !!c.open]);
        if (r.err) { bad.push(`${name}: ${c.mk}(${c.args.join(', ')}): ${r.err}`); break; }
        if (!r.words) { bad.push(`${name}: ${c.mk}(${c.args.join(', ')}) drew nothing`); break; }
        drew = true; steps++;
        const ws = r.words, label = `${name}, "${r.title}" (${c.mk}${c.args.length ? ' ' + c.args.join(' ') : ''}), page ${i + 1}`;
        for (const q of ws) if (q.x0 < -1 || q.y0 < -1 || q.x1 > r.W + 1 || q.y1 > r.H + 1) bad.push(`${label}: "${q.t}" runs off the picture`);
        for (let a = 0; a < ws.length; a++) for (let z = a + 1; z < ws.length; z++) { const A = ws[a], Z = ws[z];
          if (A.t === Z.t && Math.abs(A.x0 - Z.x0) < 4 && Math.abs(A.y0 - Z.y0) < 4) continue;      /* the same word twice in one place: an outline */
          const ox = Math.min(A.x1, Z.x1) - Math.max(A.x0, Z.x0), oy = Math.min(A.y1, Z.y1) - Math.max(A.y0, Z.y0);
          if (ox > 2 && oy > 2) bad.push(`${label}: "${A.t}" and "${Z.t}" are drawn over each other`); }
      }
      if (drew) pics++;
    }
    if (errs.length) bad.push(`${name}: errors on the page: ${errs.join(' | ')}`);
    await ctx.close(); }
  await b.close();
  const uniq = [...new Set(bad)];
  console.log(uniq.length ? `FAILED (${uniq.length}):\n  ` + uniq.join('\n  ') : `ok: ${pics} pictures, ${steps} pages of them, on six screens: no two words on top of each other, no word off the picture`);
  process.exit(uniq.length ? 1 : 0); })();
