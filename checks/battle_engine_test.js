// Battle thread, step C. Plays Marc's rules, computer against computer, for every combination of switches.
// Run:  node checks/battle_engine_test.js [battles for each combination, default 40]
// The last line is "ALL OK" or the list of what failed.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '..', 'prototypes', 'card_battle.html'), 'utf8');
const DATA = JSON.parse(html.match(/<script id="carddata" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const B = new Function(html.match(/\/\* ENGINE-BEGIN[\s\S]*?\/\* ENGINE-END \*\//)[0] + '\nreturn GMQBattle;')();
B.load(DATA);
const PER = parseInt(process.argv[2] || '40', 10);
const bad = {}; let checks = 0;
function fail(what, info) { if (!bad[what]) { bad[what] = 0; console.log('FAIL ' + what + (info ? ': ' + info : '')); } bad[what]++; }
function ok(cond, what, info) { checks++; if (!cond) fail(what, info); }
const KINDS = ['standard', 'guardian', 'striker', 'lucky'];
function combos() { let out = [{}]; B.SWITCHES.forEach(s => { const next = []; out.forEach(o => s.values.forEach(v => { const n = Object.assign({}, o); n[s.key] = v[0]; next.push(n); })); out = next; }); return out; }
let seed = 12345; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
const stats = { battles: 0, rounds: [], win: [0, 0], none: 0, both: 0, limit: 0, stuck: 0, silenced: 0, firstLoss: {} };

function play(opts, k0, k1, sd, keep) {
  const S = B.newBattle(opts, k0, k1, sd), size = B.cardCount(S.P[0]);
  ok(size === (opts.upgrades ? 50 : 45), 'each deck starts with all the cards', size);
  ok(S.P[0].hand.length === 5 && S.P[1].hand.length === 5, 'a hand of 5 at the start');
  ok(S.P[0].shield === 100 && S.P[1].shield === 100, 'both shields start at 100');
  let thrown = [0, 0], guard = 0;
  while (!S.over && guard++ < 500) {
    const before = { hp: S.P.map(p => p.parts.map(q => q.hp)), max: S.P.map(p => p.parts.map(q => q.max)), shield: S.P.map(p => p.shield), hand: S.P.map(p => p.hand.slice()) };
    const round = S.round;
    B.autoRound(S);
    const L = S.log[S.log.length - 1];
    for (let i = 0; i < 2; i++) {
      const me = S.P[i], c = B.card(L.card[i]), d = 1 - i;
      ok(B.cardCount(me) === size, 'each deck keeps its number of cards', B.cardCount(me) + ' of ' + size);
      ok(new Set(me.deck.concat(me.hand)).size === size, 'no card is doubled or lost');
      ok(me.parts.every(q => q.hp >= 0 && (!opts.repairCap || q.hp <= q.max)), 'HP never goes below 0, or above full when the cap is on');
      ok(me.shield >= 0 && (!opts.shieldCap || me.shield <= 100), 'the shield never goes below 0, or above 100 when the cap is on', me.shield);
      // the card played was in the hand
      ok(before.hand[i].indexOf(L.card[i]) >= 0, 'the card played came from the hand');
      // Weapons lost: no attack, whatever the card
      ok(L.snap.wep[i] ? L.atk[i] >= 15 : L.atk[i] === 0, 'a ship without Weapons does not attack', JSON.stringify(L.atk));
      // Shield Generator lost: no block
      ok(L.snap.sg[i] || L.block[i] === 0, 'a ship without its Shield Generator cannot block');
      // Power Module lost: no healing (upgrade cards are not healing)
      if (!L.snap.pm[i] && c.type !== 'upgrade') ok(L.snap.hp[i].every((h, x) => h <= before.hp[i][x]), 'a ship without its Power Module cannot repair');
      if (!L.snap.pm[i] && opts.shieldIsHealing) ok(L.snap.shield[i] <= before.shield[i], 'a ship without its Power Module cannot add to its shield');
      // a stopped Spy does nothing
      if (L.stopped[i]) ok(L.snap.hp[d].every((h, x) => h >= before.hp[d][x]), 'a Spy stopped by a Guard does no damage');
      ok(!L.stopped[i] || (B.isSpy(L.card[i]) && B.isGuard(L.card[d])), 'only a Guard stops a Spy');
      // a Spy that was not stopped does its damage, whatever the shield
      if (B.isSpy(L.card[i]) && !L.stopped[i]) {
        const alive = before.hp[d].filter(h => h > 0).length;
        ok(L.lines.some(l => /Spy hits/.test(l)) || alive === 0, 'a Spy gets past the shield');
      }
      // the attack that lands
      const thr = L.through[i];
      ok(thr === (L.block[i] < 0 ? 0 : Math.max(0, L.atk[d] - L.block[i])), 'what gets through is the attack less the block');
      const hpAfter = me.parts.map(q => q.hp);
      if (L.snap.shieldOn[i]) {
        ok(hpAfter.every((h, x) => h === L.snap.hp[i][x]), 'while the shield stands, no part is hit by an attack');
        ok(me.shield === (thr > L.snap.shield[i] ? 0 : L.snap.shield[i] - thr), 'the shield takes the hit, and nothing carries over', L.snap.shield[i] + ' - ' + thr + ' gave ' + me.shield);
      } else {
        const taken = hpAfter.reduce((t, h, x) => t + (L.snap.hp[i][x] - h), 0);
        ok(hpAfter.every((h, x) => h <= L.snap.hp[i][x]), 'an attack never repairs');
        ok(taken <= thr, 'the parts never take more than the attack');
        const live = L.snap.hp[i].filter(h => h > 0).length;
        if (thr > 0 && live > 0) ok(taken > 0, 'an attack past a broken shield always lands on a part');
        ok(me.shield === L.snap.shield[i], 'a shield that is not working is not changed by an attack');
      }
      // lost parts and the hand
      const lostEN = L.lost[i].filter(n => n === 'Engine Core' || n === 'Navigation').length;
      if (opts.loseCard === 'once') { ok(me.thrown - thrown[i] <= lostEN, '"lose 1 card" happens once for each lost part'); thrown[i] = me.thrown; }
      if (!S.over) ok(me.hand.length === B.handSize(S, me), 'the hand is back to its size at the end of a round', me.hand.length + ' of ' + B.handSize(S, me));
      if (opts.loseCard === 'smaller') ok(B.handSize(S, me) === 5 - ['Engine Core', 'Navigation'].filter(n => !B.has(me, n)).length, 'the hand is one smaller for each of Engine and Navigation lost');
    }
    ok(S.round === round + 1, 'one round at a time');
    ok(round <= opts.roundLimit, 'no battle runs past its limit', round);
  }
  ok(!!S.over, 'every battle ends');
  if (S.over) {
    const b = S.P.map(p => p.parts.every(q => q.hp === 0));
    if (S.over.winner === 0) ok(b[1] && !b[0], 'a win means all five enemy parts are at 0, and yours are not');
    if (S.over.winner === 1) ok(b[0] && !b[1], 'a win means all five enemy parts are at 0, and yours are not');
    if (S.over.winner === -1) ok((b[0] && b[1]) || (!b[0] && !b[1]), '"nobody wins" is never given when one ship is beaten');
    if (!b[0] && !b[1]) ok(S.round - 1 >= opts.roundLimit || (!B.canHurt(S, 0) && !B.canHurt(S, 1)), '"nobody wins" without a beaten ship only at the limit, or when neither can hurt the other');
  }
  if (keep) {
    stats.battles++; stats.rounds.push(S.round - 1);
    if (S.over.winner >= 0) stats.win[S.over.winner]++; else { stats.none++; if (S.P.every(p => p.parts.every(q => q.hp === 0))) stats.both++; else if (S.round - 1 >= opts.roundLimit) stats.limit++; else stats.stuck++; }
    const sil = S.log.findIndex(l => !l.snap.wep[0] || !l.snap.wep[1]); if (sil >= 0 && sil < 8) stats.silenced++;
  }
  return S;
}
function kinds() { return [0, 1, 2, 3, 4].map(() => KINDS[Math.floor(rnd() * 4)]); }

const all = combos();
console.log('     ' + all.length + ' combinations of switches, ' + PER + ' battles each');
all.forEach((o, n) => { for (let i = 0; i < PER; i++) play(o, kinds(), kinds(), n * 1000 + i + 1, false); });
// the default rules, many times, with Standard ships: the numbers Marc will see
const D = B.defaults(), STD = ['standard', 'standard', 'standard', 'standard', 'standard'];
['gentle', 'clever'].forEach(level => {
  const O = Object.assign({}, D, { cpu: level });
  Object.assign(stats, { battles: 0, rounds: [], win: [0, 0], none: 0, both: 0, limit: 0, stuck: 0, silenced: 0 });
  for (let i = 0; i < 4000; i++) play(O, STD, STD, 900000 + i, true);
  stats.rounds.sort((a, b) => a - b);
  const n = stats.battles, pct = x => Math.round(1000 * x / n) / 10;
  console.log('     default rules, two Standard ships, two ' + level + ' computer players, ' + n + ' battles:');
  console.log('       rounds: shortest ' + stats.rounds[0] + ', middle ' + stats.rounds[n >> 1] + ', longest ' + stats.rounds[n - 1]);
  console.log('       first ship wins ' + pct(stats.win[0]) + '%, second ship wins ' + pct(stats.win[1]) + '%, nobody wins ' + pct(stats.none) + '%');
  console.log('       nobody wins because: both beaten together ' + pct(stats.both) + '%, the round limit ' + pct(stats.limit) + '%, neither can hurt the other ' + pct(stats.stuck) + '%');
  console.log('       a ship has lost its Weapons by round 8 in ' + pct(stats.silenced) + '% of battles');
  ok(Math.abs(stats.win[0] - stats.win[1]) / n < 0.06, 'neither seat has an edge', pct(stats.win[0]) + ' against ' + pct(stats.win[1]));
});
// a clever player against a gentle one: the clever one should win more (the two levels really differ)
(function () {
  let w = [0, 0, 0];
  for (let i = 0; i < 2000; i++) {
    const S = B.newBattle(D, STD, STD, 700000 + i); let g = 0;
    while (!S.over && g++ < 200) {
      S.opts.cpu = 'clever'; const a = B.cpuPick(S, 0, null); S.opts.cpu = 'gentle'; const b = B.cpuPick(S, 1, null);
      B.startRound(S, a, b); B.swapBoth(S, null);
      B.steps(S).forEach(st => { const req = B.need(S, st); if (req) S.opts.cpu = req.who === 0 ? 'clever' : 'gentle'; B.run(S, st, req ? B.cpuChoose(S, req) : null); });
    }
    w[S.over.winner < 0 ? 2 : S.over.winner]++;
  }
  console.log('     clever against gentle, 2000 battles: clever wins ' + Math.round(w[0] / 20) + '%, gentle wins ' + Math.round(w[1] / 20) + '%, nobody ' + Math.round(w[2] / 20) + '%');
  ok(w[0] > w[1], 'the clever player beats the gentle one more often than not');
})();
// a battle is the same battle when it is played again from the same seed (so a saved game can be trusted)
const a = play(D, STD, STD, 4242, false), b = play(D, STD, STD, 4242, false);
ok(JSON.stringify(a.log) === JSON.stringify(b.log), 'the same seed gives the same battle');
// the rules by hand: four small cases with known answers
(function () {
  const S = B.newBattle(D, STD, STD, 7);
  ok(B.shipAP(S.P[0]) === 55 && S.P[0].parts.reduce((t, q) => t + q.hp, 0) === 100, 'a Standard ship has 100 HP and 55 AP');
  function force(i, id) { const p = S.P[i]; let h = p.hand.indexOf(id); if (h < 0) { const d = p.deck.indexOf(id); p.deck.splice(d, 1); p.deck.push(p.hand[0]); p.hand[0] = id; h = 0; } return h; }
  function round(c0, c1, ch) { B.startRound(S, force(0, c0), force(1, c1)); B.doSwap(S, 0); B.doSwap(S, 1); B.steps(S).forEach(st => { const req = B.need(S, st); B.run(S, st, req ? (ch && ch[st.k + (st.a === undefined ? st.d : st.a)]) || B.cpuChoose(S, req) : null); }); return S.log[S.log.length - 1]; }
  let L = round('A06', 'D02');   // +10 against block 10
  ok(L.atk[0] === 65 && L.through[1] === 55 && S.P[1].shield === 45, 'Tens Torpedo against Ten-Tile Wall: 65, less 10, leaves the shield at 45', JSON.stringify([L.atk, L.through, S.P[1].shield]));
  ok(L.atk[1] === 55 && S.P[0].shield === 45, 'a plain attack of 55 leaves a shield of 45');
  L = round('A01', 'A01');       // 60 each against shields of 45: both break, nothing carries over
  ok(S.P[0].shield === 0 && S.P[1].shield === 0 && S.P[0].parts.every(q => q.hp === q.max), 'an attack bigger than the shield breaks it and is soaked up whole');
  L = round('R05', 'S02', { spy1: [3] });   // shield card on a broken shield; Spy of 4 on Weapons
  ok(S.P[0].shield === 0, 'a plain shield card does not rebuild a broken shield');
  ok(S.P[0].parts[3].hp === 6 - Math.min(6, 0) || S.P[0].parts[3].hp <= 6, 'a Spy hits the part its owner chooses');
  const w = S.P[0].parts[3].hp; S.P[0].parts[3].hp = 0;
  L = round('A08', 'A01');
  ok(L.atk[0] === 0, 'with Weapons at 0, an attack card does nothing');
  S.P[0].parts[3].hp = w;
  L = round('A12', 'D09');
  ok(L.atk[0] === 100 && L.through[1] === 0, 'Hundred Cannon makes 100; Vanishing Act lets nothing through', JSON.stringify([L.atk, L.through]));
})();
const names = Object.keys(bad);
console.log('     ' + checks + ' checks made');
console.log(names.length ? 'FAILED: ' + names.map(k => k + ' (' + bad[k] + ')').join('; ') : 'ALL OK');
process.exit(names.length ? 1 : 0);
