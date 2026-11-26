// Battle thread, step B. Opens the new-cards page as a person would, at three screen sizes.
// Run:  node checks/battle_cards_page_test.js [folder for pictures]
// The last line is "ALL OK" or the list of what failed.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const FILE = 'file://' + path.resolve(__dirname, '..', 'prototypes', 'card_battle_cards.html');
const SHOTS = process.argv[2] || null;
const SIZES = [['ipad_sideways', 1180, 745], ['ipad_upright', 820, 1180], ['phone', 390, 760]];
const bad = [];
function want(label, ok, extra) { console.log((ok ? 'ok   ' : 'FAIL ') + label + (extra ? ': ' + extra : '')); if (!ok) bad.push(label); }

(async () => {
  const browser = await chromium.launch();
  for (const [name, w, h] of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: true });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(FILE);
    const info = await page.evaluate(() => {
      const d = window.GMQ_CARDS.data;
      const tiles = document.querySelectorAll('.tile').length;
      // every piece of text on every card must sit inside the card
      const out = [];
      document.querySelectorAll('.tile svg').forEach(svg => {
        const id = svg.parentNode.getAttribute('data-id');
        svg.querySelectorAll('text').forEach(t => {
          if (t.parentNode !== svg) return;   // a word inside a drawing (the STOP sign) is measured in the drawing's own space
          const b = t.getBBox();
          if (b.x < 16 || b.x + b.width > 234 || b.y < 15 || b.y + b.height > 336) out.push(id + ' "' + t.textContent + '" x ' + b.x.toFixed(0) + ' to ' + (b.x + b.width).toFixed(0));
        });
        // the badge text must fit inside its circle (radius 31, less the ring)
        const bd = svg.querySelector('.bd');
        if (bd) { const b = bd.getBBox(); if (b.width > 60) out.push(id + ' badge "' + bd.textContent + '" is ' + b.width.toFixed(0) + ' wide'); }
        // effect text must stay above the "needs" line and below the type label
        svg.querySelectorAll('.tx').forEach(t => { const b = t.getBBox(); if (svg.querySelector('.ty') && (b.y + b.height > 314 || b.y < 222)) out.push(id + ' text line at y ' + b.y.toFixed(0)); });
        // the symbol must not be covered by the number badge: the badge sits to the right of it
        const ty = svg.querySelector('.ty'); if (ty) { const b = ty.getBBox(); if (b.x + b.width > 160) out.push(id + ' type word runs under the badge'); }
        // on a part card, the description must stay between the number boxes and the footer
        if (svg.querySelector('.hp')) svg.querySelectorAll('.tx').forEach(t => { const b = t.getBBox(); if (b.y < 250 || b.y + b.height > 318) out.push(id + ' part text at y ' + b.y.toFixed(0)); });
      });
      const minTile = Math.min.apply(null, Array.from(document.querySelectorAll('.tile')).map(t => t.getBoundingClientRect().width));
      return { tiles, expect: d.parts.length + d.cards.length + d.upgrades.length + d.ideas.length, out, scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, minTile };
    });
    want(name + ': every card is drawn', info.tiles === info.expect, info.tiles + ' of ' + info.expect);
    want(name + ': no text leaves its card', info.out.length === 0, info.out.slice(0, 6).join(' | '));
    want(name + ': the page does not scroll sideways', info.scrollW <= info.clientW, info.scrollW + ' against ' + info.clientW);
    want(name + ': no script errors', errors.length === 0, errors.join(' | '));
    console.log('     smallest card on the page is ' + info.minTile.toFixed(0) + ' px wide');
    if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + '_top.png') }); await page.screenshot({ path: path.join(SHOTS, name + '_full.png'), fullPage: true }); }

    // open a card large, mark it, write a note
    await page.locator('.tile[data-id="A09"]').scrollIntoViewIfNeeded();
    await page.locator('.tile[data-id="A09"]').tap();
    const z = await page.evaluate(() => {
      const c = document.getElementById('zoomcard').getBoundingClientRect(), s = document.getElementById('zoomside').getBoundingClientRect();
      const btn = document.getElementById('zclose').getBoundingClientRect();
      return { open: document.getElementById('zoom').className === 'open', cw: c.width, ch: c.height, cl: c.left, cr: c.right, ct: c.top, cb: c.bottom, sb: s.bottom, st: s.top, sl: s.left, btnBottom: btn.bottom, vw: innerWidth, vh: innerHeight, name: document.getElementById('zname').textContent, overlap: !(s.left >= c.right - 1 || s.top >= c.bottom - 1) };
    });
    want(name + ': a tap opens the card large', z.open && /All Hands Fire/.test(z.name));
    want(name + ': the large card is inside the screen', z.cl >= 0 && z.cr <= z.vw + 1 && z.ct >= 0 && z.cb <= z.vh + 1, JSON.stringify([z.cl, z.ct, z.cr, z.cb]));
    want(name + ': the large card is at least 250 px wide', z.cw >= 250, z.cw.toFixed(0));
    want(name + ': the buttons do not cover the card', !z.overlap);
    want(name + ': the side panel is inside the screen', z.sb <= z.vh + 1 && z.st >= 0, z.st.toFixed(0) + ' to ' + z.sb.toFixed(0) + ' of ' + z.vh);
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, name + '_zoom.png') });
    await page.locator('.picks .btn[data-p="change"]').tap();
    await page.locator('#znote').fill('make it +4 for each part');
    await page.locator('#znext').tap();
    const nextName = await page.locator('#zname').textContent();
    want(name + ': Next goes to the next card', /Hit and Hide/.test(nextName), nextName);
    await page.locator('.picks .btn[data-p="drop"]').tap();
    await page.locator('#zclose').scrollIntoViewIfNeeded();
    await page.locator('#zclose').tap();
    const marks = await page.evaluate(() => [document.querySelector('.tile[data-id="A09"]').className, document.querySelector('.tile[data-id="A10"]').className, document.getElementById('count').textContent]);
    want(name + ': the marks show on the cards', /change/.test(marks[0]) && /drop/.test(marks[1]) && /Change 1/.test(marks[2]) && /Drop 1/.test(marks[2]), marks.join(' ; '));

    // close the page and open it again: the picks are still there
    // give the browser a moment to finish writing before the page is closed
    await page.evaluate(() => new Promise(r => setTimeout(r, 60)));
    await page.reload();
    const again = await page.evaluate(() => [document.querySelector('.tile[data-id="A09"]').className, JSON.stringify(window.GMQ_CARDS.picks())]);
    want(name + ': picks are kept after closing and opening', /change/.test(again[0]) && /make it \+4/.test(again[1]));

    // the filter, then the text to copy
    await page.locator('.chip[data-f="spy"]').tap();
    const shown = await page.evaluate(() => Array.from(document.querySelectorAll('#play .tile')).filter(t => t.style.display !== 'none').map(t => t.getAttribute('data-id')).join(','));
    const spyIds = await page.evaluate(() => window.GMQ_CARDS.data.cards.filter(c => c.type === 'spy').map(c => c.id).join(','));
    want(name + ': the Spy filter shows only Spy cards, and all of them', shown === spyIds && spyIds.split(',').length === 11, shown);
    await page.locator('.chip[data-f="all"]').tap();
    await page.locator('#copy').tap();
    const text = await page.locator('#out').inputValue();
    want(name + ': the copy text names the picks', /CHANGE \(1\)\n- A09 All Hands Fire : make it \+4 for each part/.test(text) && /DROP \(1\)\n- A10 Hit and Hide/.test(text), text.slice(0, 160).replace(/\n/g, ' / '));
    await ctx.close();
  }
  await browser.close();
  console.log(bad.length ? 'FAILED: ' + bad.join('; ') : 'ALL OK');
  process.exit(bad.length ? 1 : 0);
})();
