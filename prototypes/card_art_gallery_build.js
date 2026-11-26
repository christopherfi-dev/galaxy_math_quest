// Makes prototypes/card_art_gallery.html: every card's picture beside its name and words, for Marc to look at (and for the demo link, docs/lookdemo/cards/).   [Proposal, 26 November 2026]
// Reads prototypes/card_art.js and docs/battle/cards.json (the battle thread's), and puts both inside the page, so it works with no network.
// Run:  node prototypes/card_art_gallery_build.js [output.html]
const fs = require('fs'), path = require('path');
const here = __dirname, out = process.argv[2] ? path.resolve(process.argv[2]) : path.join(here, 'card_art_gallery.html');
const art = fs.readFileSync(path.join(here, 'card_art.js'), 'utf8').replace(/\nif \(typeof module[^\n]*\n/, '\n');
const cat = JSON.parse(fs.readFileSync(path.join(here, '..', 'docs', 'battle', 'cards.json'), 'utf8'));
const keep = { cards: cat.cards.map(c => ({ id: c.id, name: c.name, type: c.type, sym: c.sym, rarity: c.rarity, badge: c.badge, text: c.text, pic: c.pic, picture: c.picture })),
  parts: cat.parts.map(p => ({ id: p.id, name: p.name, kind: p.kind, hp: p.hp, ap: p.ap, pic: p.pic, picture: p.picture })), upgrades: cat.upgrades.map(u => ({ id: u.id, name: u.name, text: u.text, pic: u.pic, picture: u.picture })), version: cat.version };
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Card Pictures</title>
<style>
  :root { --bg: #eef2f7; --ink: #0e1626; --soft: #4a5872; --card: #fff; --line: #d5dce8; --common: #6f7f99; --rare: #3b82f6; --epic: #b8860b; }
  @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #0b1020; --ink: #e8edf5; --soft: #a5b1c6; --card: #151c30; --line: #26314b; --common: #9aa6b8; --rare: #6aa8ff; --epic: #f5c518; } }
  :root[data-theme="dark"] { --bg: #0b1020; --ink: #e8edf5; --soft: #a5b1c6; --card: #151c30; --line: #26314b; --common: #9aa6b8; --rare: #6aa8ff; --epic: #f5c518; }
  * { box-sizing: border-box; } body { margin: 0; background: var(--bg); color: var(--ink); font: 15px/1.4 system-ui, -apple-system, "Segoe UI", Arial, sans-serif; }
  header { padding: 20px 16px 8px; max-width: 1200px; margin: 0 auto; } h1 { margin: 0 0 6px; font-size: 24px; } p.lead { margin: 0 0 6px; color: var(--soft); max-width: 70ch; }
  nav { display: flex; flex-wrap: wrap; gap: 8px; padding: 8px 16px 14px; max-width: 1200px; margin: 0 auto; }
  nav button { font: inherit; font-weight: 600; border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 999px; padding: 6px 14px; min-height: 40px; cursor: pointer; }
  nav button[aria-pressed="true"] { background: var(--ink); color: var(--bg); }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; padding: 0 16px 32px; max-width: 1200px; margin: 0 auto; }
  .c { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 10px; display: flex; gap: 10px; }
  .pic { flex: none; width: 96px; height: 96px; } .pic svg { width: 100%; height: 100%; display: block; }
  .t { min-width: 0; } .n { font-weight: 700; } .meta { font-size: 12px; color: var(--soft); margin: 2px 0 4px; }
  .r { font-weight: 700; } .r.common { color: var(--common); } .r.rare { color: var(--rare); } .r.epic { color: var(--epic); }
  .w { font-size: 13px; } .pw { font-size: 12px; color: var(--soft); margin-top: 4px; font-style: italic; } .ok { font-size: 12px; margin-top: 4px; }
  footer { max-width: 1200px; margin: 0 auto; padding: 0 16px 28px; color: var(--soft); font-size: 13px; }
</style></head><body>
<header><h1>Card pictures</h1><p class="lead">One picture for every card in the battle thread's list (${keep.version}). Drawn in code, in the game's own style, so each is small and every number in a picture is exact. Where a picture counts something, the count is shown in green.</p></header>
<nav id="f"><button data-g="all" aria-pressed="true">All</button><button data-g="attack">Attack</button><button data-g="defence">Defence</button><button data-g="repair">Repair</button><button data-g="spy">Spy and Guard</button><button data-g="part">Ship parts</button><button data-g="upgrade">Upgrades</button></nav>
<main id="m"></main>
<footer>Pictures: <code>prototypes/card_art.js</code> (GMQArt.svg(pic)). Check: <code>checks/card_art_check.js</code>. Note: <code>proposals/GMQ_Card_Art_v1_2026-11-26.md</code>.</footer>
<script>
${art}
const CAT = ${JSON.stringify(keep)};
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const all = CAT.cards.map(c => ({ g: c.type === 'guard' ? 'spy' : c.type, id: c.id, name: c.name, meta: '<span class="r ' + c.rarity + '">' + c.rarity + '</span> · ' + c.type + (c.sym ? ' (' + c.sym + ')' : '') + ' · ' + esc(c.badge), text: c.text, pic: c.pic, picture: c.picture }))
  .concat(CAT.parts.map(p => ({ g: 'part', id: p.id, name: p.name, meta: p.kind + ' · HP ' + p.hp + ' · AP ' + p.ap, text: '', pic: p.pic, picture: p.picture })),
    CAT.upgrades.map(u => ({ g: 'upgrade', id: u.id, name: u.name, meta: 'upgrade', text: u.text, pic: u.pic, picture: u.picture })));
function show(gr) { document.getElementById('m').innerHTML = all.filter(c => gr === 'all' || c.g === gr).map(c => { const k = GMQArt.count(c.pic);
  return '<div class="c"><div class="pic">' + GMQArt.svg(c.pic) + '</div><div class="t"><div class="n">' + esc(c.name) + '</div><div class="meta">' + esc(c.id) + ' · ' + c.meta + '</div>' + (c.text ? '<div class="w">' + esc(c.text) + '</div>' : '')
    + '<div class="pw">' + esc(c.picture) + '</div>' + (k ? '<div class="ok" style="color:#1c8c4a">✓ ' + k.n + ' ' + esc(k.of) + '</div>' : '') + '</div></div>'; }).join(''); }
document.getElementById('f').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; [...document.querySelectorAll('#f button')].forEach(x => x.setAttribute('aria-pressed', x === b)); show(b.dataset.g); });
show('all');
</script></body></html>
`;
fs.writeFileSync(out, html); console.log('wrote ' + path.relative(process.cwd(), out) + ' (' + Math.round(html.length / 1024) + ' KB)');
