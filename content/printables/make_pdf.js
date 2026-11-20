// Prints a printable's .html to a .pdf, at true size.  Run: node content/printables/make_pdf.js GMQ_Chronosia_Old_Map_v1
const { chromium } = require('playwright'); const path = require('path');
(async () => { const name = process.argv[2], b = await chromium.launch(), p = await b.newPage(); await p.goto('file://' + path.join(__dirname, name + '.html'));
  await p.waitForFunction(() => !document.querySelector('canvas#map') || window.MAPDONE, null, { timeout: 90000 });      /* a map drawn by code must finish before printing */
  await p.pdf({ path: path.join(__dirname, name + '.pdf'), preferCSSPageSize: true, printBackground: true }); if (process.argv[3]) { await p.setViewportSize({ width: 1123, height: 794 }); await p.emulateMedia({ media: 'print' }); await p.screenshot({ path: process.argv[3], fullPage: true }); }
  await b.close(); console.log('wrote ' + name + '.pdf'); })();
