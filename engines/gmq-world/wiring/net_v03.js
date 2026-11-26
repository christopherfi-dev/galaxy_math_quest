/* The game's NET block, wired for server 0.3: proposals/GMQ_Server_Wiring_v1_2026-11-26.md, section 1, as exact changes.
   From the server thread, 26 November. For the main thread, who alone edits the game file.
   Each change is [the text in the game today (it must be there exactly once), the text to put in its place, why].
   checks/server_wiring_test.js applies them to a COPY of the game and plays it against the server in a browser.
   To apply them to the game:  node engines/gmq-world/wiring/apply.js prototypes/kis_station_sketch.html
   (it refuses if any old text is missing or found twice, and changes nothing then). No ?. and no ??: older iPads. */
module.exports = [
  [
`const NET = { api: '', found: false, on: false, name: '', ai: false, tm: 0, names: 'approve' }, NETKEY = 'gmq-net-cadet';`,
`const NET = { api: '', found: false, on: false, name: '', ai: false, tm: 0, names: 'approve', rev: 0, seen: {} }, NETKEY = 'gmq-net-cadet', NETREV = 'gmq-net-rev';
/* [server 0.3] the server counts each cadet's saves (rev). This device remembers the count it last had, so it knows when the server's game is newer. */
function netRevOf(name) { try { const d = JSON.parse(localStorage.getItem(NETREV) || 'null'); return d && d.name === name ? d.rev : -1; } catch (e) { return -1; } }
function netRevSet(name, rev) { NET.rev = rev || 0; try { localStorage.setItem(NETREV, JSON.stringify({ name, rev: NET.rev })); } catch (e) {} }
function netMark() { const a = 'abcdefghijkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)]; return s; }      /* a card's own mark (not rnd(): the game's own dice stay as they are) */
/* start the page again with the server's game (a new device, a newer game, or "Bring it here") */
function netTake(r, note) { try { sessionStorage.setItem(NETKEY, r.name || NET.name); if (note) sessionStorage.setItem('gmq-net-note', note);
    [localStorage, sessionStorage].forEach(st => { if (r.state) { r.state.ship = (r.ship && r.ship.name) || r.state.ship || ''; r.state.t = Date.now(); st.setItem(KEY, JSON.stringify(r.state)); } else st.removeItem(KEY); }); } catch (e) {}
  netRevSet(r.name || NET.name, r.rev); return location.reload(); }
/* news from battles while the cadet was away: said once, in the log */
function netNews(list) { let any = false; (list || []).forEach(n => { const k = n.at + n.say; if (NET.seen[k]) return; NET.seen[k] = 1; any = true; say(n.say); }); if (any) netCall({ action: 'news_seen' }); }
/* the cadet logged in on another device after this one: this one stops saving, and offers to bring the game back */
function netMoved() { NET.on = false; NET.moved = true; clearTimeout(NET.tm); $('netstate').textContent = 'not saving here'; widget = { kind: 'moved' };
  toy(\`<p class="eyebrow">Galaxy Math Quest</p><h3>Your game is open on another iPad.</h3><p class="q">You logged in there after this iPad, so this iPad has stopped saving. To play here, bring your game to this iPad.</p>
    <div class="field"><button class="btn" type="button" id="try">Bring it here</button></div><div class="msg bad" id="msg" role="status"></div>\`);
  $('try').onclick = async () => { const r = await netCall({ action: 'claim' }); if (!r || !r.ok) { $('msg').textContent = (r && r.error) || 'The server did not answer. Try again.'; return; } netTake(r); }; }`,
  'NET keeps the server\'s count of saves; helpers for the new answers'],
  [
`function netAdopt(r) { let mine = false; try { mine = sessionStorage.getItem(NETKEY) === r.name; } catch (e) {}`,
`function netAdopt(r) { let mine = false; try { const had = netRevOf(r.name); mine = sessionStorage.getItem(NETKEY) === r.name && (had < 0 || had >= (r.rev || 0)); } catch (e) {}      /* [server 0.3] keep this device's game only if it is at least as new as the server's */`,
  'a device that reloads takes the server\'s game when the server\'s is newer (today it keeps its older one, and can never save it)'],
  [
`    try { sessionStorage.setItem(NETKEY, r.name); [localStorage, sessionStorage].forEach(st => { if (r.state) { r.state.ship = (r.ship && r.ship.name) || ''; r.state.t = Date.now(); st.setItem(KEY, JSON.stringify(r.state)); } else st.removeItem(KEY); }); } catch (e) {} return location.reload(); }`,
`    return netTake(r); }`,
  'taking the server\'s game also remembers its count, so the page does not take it again and again'],
  [
`NET.on = true; NET.name = r.name; NET.ai = !!r.ai; if (r.names) NET.names = r.names; if (widget && widget.kind === 'login') closeToy(); netShip(r.ship); $('netbar').hidden = false; $('netname').textContent = r.name; $('netstate').textContent = ''; if (!r.state) netPush(); }`,
`NET.on = true; NET.moved = false; NET.name = r.name; NET.ai = !!r.ai; if (r.names) NET.names = r.names; netRevSet(r.name, r.rev); if (widget && (widget.kind === 'login' || widget.kind === 'moved')) closeToy(); netShip(r.ship); $('netbar').hidden = false; $('netname').textContent = r.name; $('netstate').textContent = '';
  let marked = false; (S.cards || []).forEach(c => { if (c && typeof c === 'object' && !c.u) { c.u = netMark(); marked = true; } }); if (marked) save();      /* [server 0.3] every card its own mark, so it can be put up in a challenge */
  try { const note = sessionStorage.getItem('gmq-net-note'); if (note) { sessionStorage.removeItem('gmq-net-note'); say(note); } } catch (e) {}
  netNews(r.news); if (r.newest === false) return netMoved(); if (!r.state) netPush(); }`,
  'remember the count; give old cards a mark; say why the game changed; say the news; if another device holds the game, ask before the child plays'],
  [
`const r = await netCall({ action: 'save', state: S });`,
`const r = await netCall({ action: 'save', state: S, rev: NET.rev, caps: ['rev', 'cards'] });`,
  'every save says which count of saves it builds on'],
  [
`if (r && r.ok) { $('netstate').textContent = 'saved'; netShip(r.ship); } else if (r && r.status === 401)`,
`if (r && r.ok) { $('netstate').textContent = 'saved'; netRevSet(NET.name, r.rev); if (r.cards) { S.cards = r.cards; save(); drawCards(); } netShip(r.ship); netNews(r.news); }
    else if (r && r.status === 409 && r.moved) netMoved();
    else if (r && r.status === 409 && r.newer) { NET.on = false; netCall({ action: 'load' }).then(x => { if (x && x.ok) netTake(x, 'Your Commander changed your game.'); }); }
    else if (r && r.status === 401)`,
  'the two refusals get their own words and a way forward, instead of "not saved yet: no connection"; cards that moved in a battle reach the book'],
  [
`S.cards.push({ r, n: pick(DECK[r]) }); save(); drawCards(S.cards.length - 1);`,
`S.cards.push({ r, n: pick(DECK[r]), u: netMark() }); save(); drawCards(S.cards.length - 1);`,
  'each new card gets its own mark (when the cards thread\'s GMQCards.record takes over, give its card a mark the same way)'],
  [
`if (rude(name, true)) { m.textContent = 'Please use your own name.'; return; } m.textContent = '';`,
`m.textContent = '';      /* [server 0.3.1] the server checks the name: whole words only, so real names such as Siriporn, Pornthip or Poo are not refused */`,
  'the page\'s own check refused common Thai names (Pornthip, Siriporn, Supaporn, Kanokporn) and nicknames (Poo, Pee, Bum, Fu); the server now decides, and says "Please use your own name." for a real curse'],
  [
`  if (widget && widget.kind === 'login') return;`,
`  if (widget && (widget.kind === 'login' || widget.kind === 'moved')) return;`,
  'nothing can be typed or tapped behind the "another iPad" box, as behind the log in (the same line is in act() and in the picture\'s tap: 2 places)', 2],
  [
`if (typeof NET !== 'undefined' && NET.on) netPush(); }`,
`if (typeof NET !== 'undefined' && (NET.on || NET.moved)) netPush(); }`,
  'a device that has stopped saving still tells netPush when the game changes...'],
  [
`function netPush(now) { if (!NET.on) return; clearTimeout(NET.tm);`,
`function netPush(now) { if (!NET.on) { if (NET.moved && !(widget && widget.kind === 'moved')) netMoved(); return; } clearTimeout(NET.tm);`,
  '...so if another box took the place of "another iPad" (My cards, a task), the box comes back before any play is lost'],
];
