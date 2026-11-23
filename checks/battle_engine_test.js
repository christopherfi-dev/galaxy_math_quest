// Battle thread, step C. Plays Marc's rules, computer against computer, for every combination of switches.
// Run:  node checks/battle_engine_test.js [battles for each combination, default 2]
// The last line is "ALL OK" or the list of what failed.
const fs = require('fs'), path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '..', 'prototypes', 'card_battle.html'), 'utf8');
const DATA = JSON.parse(html.match(/<script id="carddata" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const B = new Function(html.match(/\/\* ENGINE-BEGIN[\s\S]*?\/\* ENGINE-END \*\//)[0] + '\nreturn GMQBattle;')();
B.load(DATA);
const PER = parseInt(process.argv[2] || '2', 10);
const bad = {}; let checks = 0;
function fail(what, info) { if (!bad[what]) { bad[what] = 0; console.log('FAIL ' + what + (info ? ': ' + info : '')); } bad[what]++; }
function ok(cond, what, info) { checks++; if (!cond) fail(what, info); }
const KINDS = ['standard', 'guardian', 'striker', 'lucky'];
function combos() { let out = [{}]; B.SWITCHES.forEach(s => { const next = []; out.forEach(o => s.values.forEach(v => { const n = Object.assign({}, o); n[s.key] = v[0]; next.push(n); })); out = next; }); return out; }
let seed = 12345; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
const stats = { battles: 0, rounds: [], win: [0, 0], none: 0, both: 0, limit: 0, stuck: 0, silenced: 0, lastLead: [0, 0], held: 0, backUp: 0, pierced: 0, piercedBy: 0, firstLoss: {} };

function play(opts, k0, k1, sd, keep) {
  const S = B.newBattle(opts, k0, k1, sd), size = B.cardCount(S.P[0]);
  const start = S.P.map(p => p.deck.concat(p.hand).sort().join(','));
  ok(size === 39 + Math.min(opts.spies, 7) + opts.guards + (opts.upgrades ? 5 : 0), 'each deck starts with the right number of cards', size);
  ok(S.P.every(p => p.deck.concat(p.hand).filter(B.isSpy).length === Math.min(opts.spies, 7) && p.deck.concat(p.hand).filter(B.isGuard).length === opts.guards), 'each deck has the Spy and Guard cards the switches say');
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
      ok(me.deck.concat(me.hand).sort().join(',') === start[i], 'no card is doubled or lost');
      ok(me.parts.every(q => q.hp >= 0 && (!opts.repairCap || q.hp <= q.max)), 'HP never goes below 0, or above full when the cap is on');
      ok(me.shield >= 0 && (!opts.shieldCap || me.shield <= 100), 'the shield never goes below 0, or above 100 when the cap is on', me.shield);
      // the card played was in the hand
      ok(before.hand[i].indexOf(L.card[i]) >= 0, 'the card played came from the hand');
      // Weapons lost: no attack, whatever the card
      ok(L.snap.wep[i] ? L.atk[i] >= 15 : L.atk[i] === 0, 'a ship without Weapons does not attack; every other ship does, a ship that dodges too', JSON.stringify(L.atk));
      ok(!L.away[i] || (c.ops.some(o => o.op === 'block_dodge') && L.snap.sg[i]), 'a ship dodges only when it played a dodge card and has its Shield Generator');
      if (c.ops.some(o => o.op === 'block_dodge') && L.snap.sg[i] && !(opts.kindBlock && !opts.shieldKind && B.card(L.card[d]).type === 'attack' && B.rank(L.card[i]) < B.rank(L.card[d]))) ok(L.away[i], 'a dodge card that works makes the ship dodge');
      // Shield Generator lost: no block
      ok(L.snap.sg[i] || L.block[i] === 0, 'a ship without its Shield Generator cannot block');
      // Marc, 22 November: a lower card cannot block a higher attack card
      if (opts.kindBlock && B.card(L.card[d]).type === 'attack' && B.rank(L.card[i]) < B.rank(L.card[d])) {
        if (!opts.shieldKind) ok(L.block[i] === 0, 'with the old rule switched on, a lower block card does not block a higher attack card at all', B.card(L.card[i]).name + ' against ' + B.card(L.card[d]).name);
        else ok(L.block[i] >= 0 && L.block[i] <= Math.max(0, L.atk[d] - L.special[d]), 'a lower block card blocks no more than the ship\'s own attack: never the part a higher attack card adds', JSON.stringify([L.block[i], L.atk[d], L.special[d]]));
      }
      { const cd = B.card(L.card[d]), mult = cd.ops.some(o => o.op === 'atk_double' || o.op === 'atk_round100'); ok(L.atk[d] === 0 || L.special[d] === (mult ? L.atk[d] : L.bonus[d]), 'the card\'s part of an attack is what it adds, or the whole attack when it doubles or rounds up the AP', JSON.stringify([cd.name, L.atk[d], L.bonus[d], L.special[d]])); }
      ok(!L.capped[i] || (opts.shieldKind && opts.kindBlock && B.rank(L.card[i]) < B.rank(L.card[d])), 'a block is only held to the ship\'s own attack when the attack card is of a higher kind');
      if (!opts.kindBlock && L.snap.sg[i] && c.ops.some(o => o.op === 'block')) ok(L.block[i] > 0 || L.raised[i] > 0, 'with the rule off, any block card blocks, or puts the shield back up');
      // Marc's idea of 22 November: a block card on a broken shield puts the shield back up, when that choice is on
      if (L.raised[i] > 0) ok(opts.shieldRebuild === 'blocks' && L.snap.sg[i] && L.block[i] === 0 && L.snap.shield[i] === (opts.shieldCap ? Math.min(100, L.raised[i]) : L.raised[i]) && c.ops.some(o => /^block/.test(o.op)), 'a block card puts the shield back up only with that choice on, only with a Shield Generator, and then it does not also block', JSON.stringify([opts.shieldRebuild, L.raised, L.block, L.snap.shield]));
      if (opts.shieldRebuild === 'reborn' && before.shield[i] === 0 && !c.ops.some(o => o.op === 'shield_rebuild')) ok(L.snap.shield[i] === 0, 'with "Shield Reborn only", no other card puts a broken shield back up', c.name);
      if (keep && before.shield[i] === 0 && L.snap.shield[i] > 0) stats.backUp++;
      if (opts.kindGuard && B.isGuard(L.card[i]) && B.isSpy(L.card[d]) && B.rank(L.card[i]) < B.rank(L.card[d])) ok(!L.stopped[d], 'with that switch on, a common Guard does not stop a higher Spy');
      if (!opts.kindGuard && B.isGuard(L.card[i]) && B.isSpy(L.card[d])) ok(L.stopped[d], 'a Guard stops any Spy that is on the table with it');
      // Power Module lost: no healing (upgrade cards are not healing)
      if (!L.snap.pm[i] && c.type !== 'upgrade') ok(L.snap.hp[i].every((h, x) => h <= before.hp[i][x]), 'a ship without its Power Module cannot repair');
      if (!L.snap.pm[i] && opts.shieldIsHealing && !L.raised[i]) ok(L.snap.shield[i] <= before.shield[i], 'a ship without its Power Module cannot add to its shield');
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
      if (L.snap.shieldOn[i] && L.snap.skind[i] < 0) ok(L.pierce[i] === 0, 'nothing goes through the shield a battle starts with');
      if (!opts.shieldKind) ok(L.pierce[i] === 0 && L.pierce[d] === 0, 'with the switch off, nothing ever goes through a shield');
      ok(!L.noStrike[i] || B.turnOrder(S), 'a strike is only held back when attacks land in turn order');
      ok(!L.noStrike[i] || i === L.leader, 'only the ship that went first can be spared the strike back');
      // Marc, 22 November: the part a higher attack card adds goes through a lower shield that a card put up
      const pc = L.pierce[i];
      if (pc > 0) {
        ok(opts.shieldKind && opts.kindBlock && L.snap.shieldOn[i] && L.snap.skind[i] >= 0 && B.card(L.card[d]).type === 'attack' && B.rank(L.card[d]) > L.snap.skind[i], 'an attack goes through a shield only when a card put that shield up and the attack card is of a higher kind', JSON.stringify([L.snap.skind, B.card(L.card[d]).name]));
        ok(pc <= L.special[d] && pc <= thr, 'only the card\'s part goes through: what it adds, or the whole attack if it multiplies the AP', pc + ' of ' + L.special[d]);
        const held = thr - pc, took = hpAfter.reduce((s, h, x) => s + (L.snap.hp[i][x] - h), 0);
        ok(me.shield === (held > L.snap.shield[i] ? 0 : L.snap.shield[i] - held), 'the ship\'s own AP goes into the shield, and nothing of it carries over', JSON.stringify([L.snap.shield[i], held, me.shield]));
        ok(took > 0 && took <= pc && hpAfter.every((h, x) => h <= L.snap.hp[i][x]), 'what goes through lands on the parts, and no more than that', took + ' of ' + pc);
        if (keep) { stats.pierced++; stats.piercedBy += pc; }
      } else if (L.noStrike[i]) {
        ok(thr > 0 && S.P[d].parts.every(q => q.hp === 0), 'a strike is held back only when the ship that fired it has lost its last part');
        ok(hpAfter.every((h, x) => h === L.snap.hp[i][x]) && me.shield === L.snap.shield[i], 'a ship beaten first does not strike back: the other ship is not touched');
        ok(S.over && S.over.winner === i, 'the ship whose attack landed first wins', JSON.stringify(S.over));
      } else if (L.snap.shieldOn[i]) {
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
    if (B.turnOrder(S)) ok(!(b[0] && b[1]), 'when attacks land in turn order, the two ships are never beaten in the same round');
    if (!b[0] && !b[1]) ok(S.round - 1 >= opts.roundLimit || (!B.canHurt(S, 0) && !B.canHurt(S, 1)), '"nobody wins" without a beaten ship only at the limit, or when neither can hurt the other');
  }
  if (keep) {
    stats.battles++; stats.rounds.push(S.round - 1);
    if (S.over.winner >= 0) stats.win[S.over.winner]++; else { stats.none++; if (S.P.every(p => p.parts.every(q => q.hp === 0))) stats.both++; else if (S.round - 1 >= opts.roundLimit) stats.limit++; else stats.stuck++; }
    const sil = S.log.findIndex(l => !l.snap.wep[0] || !l.snap.wep[1]); if (sil >= 0 && sil < 8) stats.silenced++;
    const last = S.log[S.log.length - 1]; if (S.over.winner >= 0) { stats.lastLead[S.over.winner === last.leader ? 0 : 1]++; if (last.noStrike[0] || last.noStrike[1]) stats.held++; }
  }
  return S;
}
function kinds() { return [0, 1, 2, 3, 4].map(() => KINDS[Math.floor(rnd() * 4)]); }

const all = combos();
console.log('     ' + all.length + ' combinations of switches, ' + PER + ' battles each');
all.forEach((o, n) => { for (let i = 0; i < PER; i++) play(o, kinds(), kinds(), n * 1000 + i + 1, false); });
// the default rules, many times, with Standard ships: the numbers Marc will see
const D = B.defaults(), STD = ['standard', 'standard', 'standard', 'standard', 'standard'];
[['nobody', 'gentle'], ['nobody', 'clever'], ['turn', 'gentle'], ['turn', 'clever']].forEach(pair => {
  const level = pair[1], O = Object.assign({}, D, { cpu: level, bothFall: pair[0] });
  Object.assign(stats, { battles: 0, rounds: [], win: [0, 0], none: 0, both: 0, limit: 0, stuck: 0, silenced: 0, lastLead: [0, 0], held: 0, backUp: 0 });
  for (let i = 0; i < 4000; i++) play(O, STD, STD, 900000 + i, true);
  stats.rounds.sort((a, b) => a - b);
  const n = stats.battles, pct = x => Math.round(1000 * x / n) / 10;
  console.log('     ' + (pair[0] === 'nobody' ? 'default rules (both attacks land together)' : 'the switch "attacks land in turn order"') + ', two Standard ships, two ' + level + ' computer players, ' + n + ' battles:');
  console.log('       the last round: the ship that went first in it won ' + pct(stats.lastLead[0]) + '%, the ship that answered won ' + pct(stats.lastLead[1]) + '%; a ship was beaten before it could strike back in ' + pct(stats.held) + '%');
  if (pair[0] === 'turn') ok(stats.both === 0, 'with attacks in turn order, no battle ends with both ships beaten');
  if (pair[0] === 'nobody') ok(stats.held === 0, 'with the default rules, no strike is ever held back');
  console.log('       rounds: shortest ' + stats.rounds[0] + ', middle ' + stats.rounds[n >> 1] + ', longest ' + stats.rounds[n - 1]);
  console.log('       first ship wins ' + pct(stats.win[0]) + '%, second ship wins ' + pct(stats.win[1]) + '%, nobody wins ' + pct(stats.none) + '%');
  console.log('       nobody wins because: both beaten together ' + pct(stats.both) + '%, the round limit ' + pct(stats.limit) + '%, neither can hurt the other ' + pct(stats.stuck) + '%');
  console.log('       a ship has lost its Weapons by round 8 in ' + pct(stats.silenced) + '% of battles');
  ok(Math.abs(stats.win[0] - stats.win[1]) / n < 0.06, 'neither seat has an edge', pct(stats.win[0]) + ' against ' + pct(stats.win[1]));
});
// Marc's rule of 22 November: a shield card puts a broken Main Shield back up, and so stops one whole attack. Measured against the two narrower rules.
[['reborn', 'only Shield Reborn puts the shield back up (the page before Marc\'s rule)'], ['any', 'only a card that adds to the Main Shield puts it back up'], ['blocks', 'Marc\'s rule, the page now: any block card and any card that adds to the Main Shield puts it back up']].forEach(v => {
  ['gentle', 'clever'].forEach(level => {
    const O = Object.assign({}, D, { cpu: level, shieldRebuild: v[0] });
    Object.assign(stats, { battles: 0, rounds: [], win: [0, 0], none: 0, both: 0, limit: 0, stuck: 0, silenced: 0, lastLead: [0, 0], held: 0, backUp: 0 });
    for (let i = 0; i < 2000; i++) play(O, STD, STD, 600000 + i, true);
    stats.rounds.sort((a, b) => a - b);
    const n = stats.battles, pct = x => Math.round(1000 * x / n) / 10;
    console.log('     ' + v[1] + ', two ' + level + ' players, ' + n + ' battles: rounds shortest ' + stats.rounds[0] + ', middle ' + stats.rounds[n >> 1] + ', 9 in 10 done by ' + stats.rounds[Math.floor(n * 0.9)] + ', longest ' + stats.rounds[n - 1] + '; a shield came back ' + (Math.round(10 * stats.backUp / n) / 10) + ' times in a battle; nobody wins ' + pct(stats.none) + '% (the round limit ' + pct(stats.limit) + '%); the last round\'s leader wins ' + pct(stats.lastLead[0]) + '%');
  });
});
// Marc's rule of 22 November: a shield a card puts up has that card's kind, and the part a higher attack card adds goes through it
[[false, 'any shield stops any attack (the page before)'], [true, 'Marc\'s rule, the page now: a higher attack card\'s own part goes through a lower shield']].forEach(v => {
  ['gentle', 'clever'].forEach(level => {
    const O = Object.assign({}, D, { cpu: level, shieldKind: v[0] });
    Object.assign(stats, { battles: 0, rounds: [], win: [0, 0], none: 0, both: 0, limit: 0, stuck: 0, silenced: 0, lastLead: [0, 0], held: 0, backUp: 0, pierced: 0, piercedBy: 0 });
    for (let i = 0; i < 2000; i++) play(O, STD, STD, 640000 + i, true);
    stats.rounds.sort((a, b) => a - b);
    const n = stats.battles;
    console.log('     ' + v[1] + ', two ' + level + ' players, ' + n + ' battles: rounds middle ' + stats.rounds[n >> 1] + ', 9 in 10 done by ' + stats.rounds[Math.floor(n * 0.9)] + ', longest ' + stats.rounds[n - 1] + '; an attack went through a shield ' + (Math.round(100 * stats.pierced / n) / 100) + ' times in a battle' + (stats.pierced ? ', for ' + Math.round(stats.piercedBy / stats.pierced) + ' points each time' : '') + '; nobody wins ' + stats.none);
  });
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
(function () {
  let first = [0, 0];
  for (let i = 0; i < 2000; i++) { const S = B.newBattle(D, STD, STD, 31000 + i); first[S.leader]++; const l0 = S.leader; B.autoRound(S); ok(S.over || S.leader === 1 - l0, 'the lead passes to the other player each round'); }
  console.log('     who leads round 1, in 2000 battles: you ' + first[0] + ', the enemy ' + first[1]);
  ok(Math.abs(first[0] - first[1]) < 200, 'who leads round 1 is chance');
})();
['gentle', 'clever'].forEach(level => {
  const O = Object.assign({}, D, { cpu: level }); let w = [0, 0, 0];
  for (let i = 0; i < 6000; i++) { const S = B.newBattle(O, STD, STD, 510000 + i), first = S.leader; let g = 0; while (!S.over && g++ < 200) B.autoRound(S); w[S.over.winner < 0 ? 2 : (S.over.winner === first ? 0 : 1)]++; }
  console.log('     two ' + level + ' players, 6000 battles: the one who went first in round 1 wins ' + Math.round(w[0] / 60) + '%, the one who went second wins ' + Math.round(w[1] / 60) + '%, nobody ' + Math.round(w[2] / 60) + '%');
});
// a battle is the same battle when it is played again from the same seed (so a saved game can be trusted)
const a = play(D, STD, STD, 4242, false), b = play(D, STD, STD, 4242, false);
ok(JSON.stringify(a.log) === JSON.stringify(b.log), 'the same seed gives the same battle');
// the rules by hand: four small cases with known answers
(function () {
  const S = B.newBattle(Object.assign({}, D, { spies: 7, guard: 'blind', shieldRebuild: 'reborn' }), STD, STD, 7);
  ok(B.shipAP(S.P[0]) === 55 && S.P[0].parts.reduce((t, q) => t + q.hp, 0) === 100, 'a Standard ship has 100 HP and 55 AP');
  function force(i, id) { const p = S.P[i]; let h = p.hand.indexOf(id); if (h < 0) { const d = p.deck.indexOf(id); p.deck.splice(d, 1); p.deck.push(p.hand[0]); p.hand[0] = id; h = 0; } return h; }
  function round(c0, c1, ch) { B.startRound(S, force(0, c0), force(1, c1)); B.doSwap(S, 0); B.doSwap(S, 1); B.steps(S).forEach(st => { const req = B.need(S, st); B.run(S, st, req ? (ch && ch[st.k + (st.a === undefined ? st.d : st.a)]) || B.cpuChoose(S, req) : null); }); return S.log[S.log.length - 1]; }
  let L = round('A06', 'D02');   // +10 against block 10
  ok(L.atk[0] === 65 && L.through[1] === 55 && S.P[1].shield === 45, 'Tens Torpedo against Ten-Tile Wall: 65, less 10, leaves the shield at 45', JSON.stringify([L.atk, L.through, S.P[1].shield]));
  ok(L.atk[1] === 55 && S.P[0].shield === 45, 'a plain attack of 55 leaves a shield of 45');
  L = round('A01', 'A01');       // 60 each against shields of 45: both break, nothing carries over
  ok(S.P[0].shield === 0 && S.P[1].shield === 0 && S.P[0].parts.every(q => q.hp === q.max), 'an attack bigger than the shield breaks it and is soaked up whole');
  L = round('R05', 'S02', { spy1: [3] });   // shield card on a broken shield; Spy of 4 on Weapons
  ok(S.P[0].shield === 0, 'with "Shield Reborn only", a plain shield card does not rebuild a broken shield');
  ok(S.P[0].parts[3].hp === 6 - Math.min(6, 0) || S.P[0].parts[3].hp <= 6, 'a Spy hits the part its owner chooses');
  const w = S.P[0].parts[3].hp; S.P[0].parts[3].hp = 0;
  L = round('A08', 'A01');
  ok(L.atk[0] === 0, 'with Weapons at 0, an attack card does nothing');
  S.P[0].parts[3].hp = w;
  L = round('A12', 'D09');
  ok(L.atk[0] === 100 && L.through[1] === 0, 'Hundred Cannon makes 100; Vanishing Act lets nothing through', JSON.stringify([L.atk, L.through]));
})();
// Marc's rule of 22 November, each case in a fresh battle: which card can block which
(function () {
  function duel(c0, c1, setup, opts) {
    const S = B.newBattle(Object.assign({}, D, { spies: 7, guard: 'swap' }, opts || {}), STD, STD, 99);
    if (setup) setup(S);
    const h = [c0, c1].map((id, i) => { const p = S.P[i]; let x = p.hand.indexOf(id); if (x < 0) { const d = p.deck.indexOf(id); p.deck.splice(d, 1); p.deck.push(p.hand[0]); p.hand[0] = id; x = 0; } return x; });
    B.startRound(S, h[0], h[1]); B.steps(S).forEach(st => { const req = B.need(S, st); B.run(S, st, req ? B.cpuChoose(S, req) : null); });
    return S.log[0];
  }
  // Marc, 22 November (evening): a lower shield card still stops the ship's regular AP; only the part a higher card adds gets past it
  // "unless the gold card is multiplying the normal AP attack": then the whole attack is the card's, and a lower card stops none of it
  let L = duel('A12', 'D02'); ok(L.atk[0] === 100 && L.special[0] === 100 && L.block[1] === 0 && L.capped[1] && L.through[1] === 100, 'Ten-Tile Wall (common) against Hundred Cannon (epic, works on the AP itself): it stops none of the 100', JSON.stringify([L.atk, L.block, L.through]));
  L = duel('A11', 'D06'); ok(L.atk[0] === 110 && L.block[1] === 0 && L.through[1] === 110, 'Meteor Net (rare) against Doubling Drive (epic, doubles the AP): it stops none of the 110');
  L = duel('A08', 'D02'); ok(L.block[1] === 10 && L.through[1] === 65, 'Ten-Tile Wall (common) against Twin Tens (rare): it still blocks 10');
  L = duel('A08', 'D06'); ok(L.block[1] === 20 && L.through[1] === 55, 'a rare block card blocks a rare attack card');
  L = duel('A01', 'D06'); ok(L.block[1] === 20 && L.through[1] === 40, 'a rare block card blocks a common attack card');
  L = duel('A01', 'D02'); ok(L.block[1] === 10 && L.through[1] === 50, 'a common block card blocks a common attack card');
  L = duel('R01', 'D02'); ok(L.block[1] === 10 && L.through[1] === 45, 'any block card blocks a plain attack, when no attack card is played');
  L = duel('A12', 'D09'); ok(L.atk[0] === 100 && L.through[1] === 0, 'the epic block card blocks an epic attack card whole');
  L = duel('A12', 'A10'); ok(L.block[1] === 0 && L.atk[1] === 65, 'Hit and Hide (rare) against Hundred Cannon (epic): its block stops nothing, and it still adds 10 to its own attack');
  L = duel('A08', 'A10'); ok(L.block[1] === 10 && L.through[1] === 65, 'Hit and Hide (rare) against Twin Tens (rare): blocks its 10');
  // dodge cards (Marc, 22 and 23 November): Wormhole Zip (common) and Triple Illusion (rare)
  L = duel('A01', 'D11'); ok(L.through[1] === 0 && L.atk[1] === 55 && L.through[0] === 55 && L.away[1], 'Wormhole Zip (common) against Spark Shot (common): the whole attack misses, and the ship that dodged still fires its 55', JSON.stringify([L.through, L.atk]));
  L = duel('R01', 'D11'); ok(L.through[1] === 0 && L.atk[1] === 55, 'Wormhole Zip against a plain attack: it misses, and the dodger fires');
  L = duel('A08', 'D11'); ok(L.block[1] === 55 && L.through[1] === 20 && L.atk[1] === 55, 'Wormhole Zip (common) against Twin Tens (rare, 55 + 20): the ship\'s 55 misses, the card\'s 20 still hits', JSON.stringify([L.block, L.through]));
  L = duel('A08', 'D12'); ok(L.through[1] === 0, 'Triple Illusion (rare) against Twin Tens (rare): the whole attack misses');
  L = duel('A11', 'D12'); ok(L.through[1] === 110 && L.block[1] === 0, 'Triple Illusion (rare) against Doubling Drive (epic, doubles the AP): the whole 110 still hits');
  L = duel('A01', 'D11', S => { S.P[1].parts[2].hp = 0; }); ok(L.through[1] === 60 && L.atk[1] > 0 && !L.away[1], 'with its Shield Generator lost, a ship cannot dodge: it is hit, and it fires as usual', JSON.stringify([L.through, L.atk]));
  // the old rule, kept on the switch
  L = duel('A12', 'D02', null, { shieldKind: false }); ok(L.block[1] === 0 && L.through[1] === 100, 'with the old rule switched on: a common block card does not block an epic attack card at all');
  L = duel('A08', 'D02', null, { shieldKind: false }); ok(L.block[1] === 0 && L.through[1] === 75, 'with the old rule switched on: a common block card does not block a rare attack card at all');
})();
// Marc's idea of 22 November, by hand: a shield card on a broken shield
(function () {
  function one(opts, c0, c1) {
    const S = B.newBattle(Object.assign({}, D, { guard: 'blind' }, opts), STD, STD, 77); S.P[0].shield = 0;
    const pick = [c0, c1].map((id, i) => { const p = S.P[i]; let x = p.hand.indexOf(id); if (x < 0) { const d = p.deck.indexOf(id); p.deck.splice(d, 1); p.deck.push(p.hand[0]); p.hand[0] = id; x = 0; } return x; });
    B.startRound(S, pick[0], pick[1]); B.steps(S).forEach(st => { const req = B.need(S, st); B.run(S, st, req ? B.cpuChoose(S, req) : null); });
    return S;
  }
  const whole = S => S.P[0].parts.every(q => q.hp === q.max);
  const lostHP = S => S.P[0].parts.reduce((s, q) => s + (q.max - q.hp), 0);
  let S = one({ shieldRebuild: 'reborn' }, 'R05', 'A01'); ok(!whole(S) && S.P[0].shield === 0, 'with "Shield Reborn only": Shield Spark on a broken shield does nothing, and the hit lands on the parts');
  ok(B.defaults().shieldRebuild === 'blocks', 'the page starts on Marc\'s rule: any shield card puts a broken shield back up');
  S = one({}, 'D10', 'A01'); ok(whole(S) && S.log[0].raised[0] === 16 && S.P[0].shield === 0, 'the page as it starts: Card Wall with four other cards puts up a shield of 16, and the whole hit goes into it', JSON.stringify([S.log[0].raised, S.P[0].shield]));
  S = one({}, 'R15', 'A01'); ok(whole(S) && S.log[0].snap.shield[0] === 100 && S.P[0].shield === 40, 'Shield Reborn on a broken shield puts it back to full, 100; a hit of 60 then leaves 40', JSON.stringify([S.log[0].snap.shield, S.P[0].shield]));
  S = one({ shieldRebuild: 'reborn' }, 'R15', 'A01'); ok(S.log[0].snap.shield[0] === 100, 'Shield Reborn goes back to full under every choice of the switch');
  (function () { const T = B.newBattle(Object.assign({}, D, { guard: 'blind' }), STD, STD, 78); T.P[0].shield = 35; const p = T.P[0]; let x = p.hand.indexOf('R15'); if (x < 0) { const d = p.deck.indexOf('R15'); p.deck.splice(d, 1); p.deck.push(p.hand[0]); p.hand[0] = 'R15'; x = 0; } let y = T.P[1].hand.indexOf('R01'); if (y < 0) { const d = T.P[1].deck.indexOf('R01'); T.P[1].deck.splice(d, 1); T.P[1].deck.push(T.P[1].hand[0]); T.P[1].hand[0] = 'R01'; y = 0; } B.startRound(T, x, y); B.steps(T).forEach(st => { const req = B.need(T, st); B.run(T, st, req ? B.cpuChoose(T, req) : null); }); ok(T.log[0].snap.shield[0] === 100, 'Shield Reborn on a shield of 35 puts it to 100, not 135 and not 85', String(T.log[0].snap.shield[0])); })();
  S = one({}, 'R06', 'A01'); ok(whole(S) && S.log[0].snap.shield[0] === 12 && S.P[0].shield === 0, 'the page as it starts: Nano Shield with four other cards puts up a shield of 12, and the whole hit goes into it', JSON.stringify([S.log[0].snap.shield, S.P[0].shield]));
  S = one({ shieldRebuild: 'any' }, 'R05', 'A01'); ok(whole(S) && S.P[0].shield === 0 && S.log[0].snap.shield[0] === 10, 'with "only a card that adds to the Main Shield": Shield Spark puts up a shield of 10, it soaks the whole hit of 60, and breaks', JSON.stringify([S.P[0].shield, S.log[0].snap.shield]));
  S = one({ shieldRebuild: 'any' }, 'D01', 'A01'); ok(!whole(S) && S.log[0].block[0] === 8 && S.log[0].raised[0] === 0, 'with "only a card that adds to the Main Shield": a block card still only blocks');
  S = one({ shieldRebuild: 'blocks' }, 'D01', 'A01'); ok(whole(S) && S.P[0].shield === 0 && S.log[0].raised[0] === 8 && S.log[0].block[0] === 0 && S.log[0].through[0] === 60, 'Marc\'s rule: Dust Screen puts up a shield of 8, it soaks the whole hit of 60, and breaks', JSON.stringify([S.P[0].shield, S.log[0].raised, S.log[0].through]));
  S = one({ shieldRebuild: 'blocks', shieldKind: false }, 'D01', 'A08'); ok(!whole(S) && S.log[0].raised[0] === 0 && lostHP(S) === 75, 'with the kind-of-shield switch off: a common block card does nothing against a rare attack card, and all 75 lands');
  // Marc's example: a common shield of 8, a rare card that adds 20: the ship's 55 goes into the shield, the 20 goes through
  S = one({}, 'D01', 'A08'); ok(S.log[0].raised[0] === 8 && S.log[0].snap.skind[0] === 0 && S.log[0].pierce[0] === 20 && S.P[0].shield === 0 && lostHP(S) === 20, 'Dust Screen (common) against Twin Tens (rare, +20): the shield of 8 soaks the ship\'s 55, and exactly 20 goes through to the parts', JSON.stringify([S.log[0].raised, S.log[0].pierce, S.P[0].shield, lostHP(S)]));
  S = one({}, 'D01', 'A01'); ok(S.log[0].pierce[0] === 0 && lostHP(S) === 0, 'Dust Screen (common) against Spark Shot (common): stopped whole');
  S = one({}, 'D06', 'A08'); ok(S.log[0].snap.skind[0] === 1 && S.log[0].pierce[0] === 0 && lostHP(S) === 0, 'Meteor Net (rare) against Twin Tens (rare): stopped whole');
  S = one({}, 'D06', 'A11'); ok(S.log[0].pierce[0] === 110 && S.P[0].shield === 20 && lostHP(S) > 0, 'a rare shield of 20 against Doubling Drive (epic, doubles the AP): the whole 110 goes through, and the shield is not touched', JSON.stringify([S.log[0].pierce, S.P[0].shield, lostHP(S)]));
  S = one({}, 'R15', 'A12'); ok(S.log[0].snap.skind[0] === 2 && S.log[0].pierce[0] === 0 && lostHP(S) === 0, 'Shield Reborn makes an epic shield: nothing goes through it, not even Hundred Cannon');
  S = one({}, 'R05', 'A12'); ok(S.log[0].snap.skind[0] === 0 && S.log[0].pierce[0] === 100 && S.P[0].shield === 10 && lostHP(S) > 0, 'a common shield of 10 against Hundred Cannon (epic, works on the AP itself): the whole 100 goes through', JSON.stringify([S.log[0].pierce, S.P[0].shield]));
  (function () { const T = B.newBattle(Object.assign({}, D, { guard: 'blind' }), STD, STD, 79); const pick = ['R01', 'A11'].map((id, i) => { const p = T.P[i]; let x = p.hand.indexOf(id); if (x < 0) { const dd = p.deck.indexOf(id); p.deck.splice(dd, 1); p.deck.push(p.hand[0]); p.hand[0] = id; x = 0; } return x; }); B.startRound(T, pick[0], pick[1]); B.steps(T).forEach(st => { const req = B.need(T, st); B.run(T, st, req ? B.cpuChoose(T, req) : null); }); ok(T.log[0].pierce[0] === 0 && T.P[0].shield === 0 && T.P[0].parts.every(q => q.hp === q.max), 'the shield a battle starts with has no kind: Doubling Drive (110) breaks it and is soaked up whole', JSON.stringify([T.log[0].pierce, T.P[0].shield])); })();
  S = one({ shieldRebuild: 'blocks' }, 'D09', 'A01'); ok(whole(S) && S.log[0].raised[0] === 0 && S.log[0].through[0] === 0, 'Vanishing Act still blocks everything and puts up no shield');
})();
// Marc's ruling of 22 November: attacks land in turn order; a ship that loses its last part does not strike back
(function () {
  function last(opts, leader, setup, c0, c1, ch) {
    const S = B.newBattle(Object.assign({}, D, opts), STD, STD, 321); S.leader = leader;
    S.P.forEach(p => { p.shield = 0; p.parts.forEach((q, x) => { q.hp = x === 3 ? 1 : 0; }); });
    if (setup) setup(S);
    const pick = [c0, c1].map((id, i) => { const p = S.P[i]; if (id === 'spy') id = p.deck.concat(p.hand).filter(B.isSpy)[0]; let x = p.hand.indexOf(id); if (x < 0) { const d = p.deck.indexOf(id); p.deck.splice(d, 1); p.deck.push(p.hand[0]); p.hand[0] = id; x = 0; } return x; });
    S.said = []; B.startRound(S, pick[0], pick[1]); B.steps(S).forEach(st => { const req = B.need(S, st); const R = B.run(S, st, req ? (ch && ch[st.k + (st.a === undefined ? st.d : st.a)]) || B.cpuChoose(S, req) : null); S.said = S.said.concat(R.lines); });
    return S;
  }
  const hp = (S, i) => S.P[i].parts.map(q => q.hp).join(',');
  let S = last({ bothFall: 'turn' }, 0, null, 'A01', 'A01');
  ok(S.over && S.over.winner === 0 && hp(S, 0) === '0,0,0,1,0' && hp(S, 1) === '0,0,0,0,0' && S.log[0].noStrike[0] && /The enemy's ship is beaten before it can strike back/.test(S.said.join(' ')), 'each ship has one part left and you went first: you win, and are not hit', JSON.stringify([S.over, hp(S, 0), hp(S, 1)]));
  S = last({ bothFall: 'turn' }, 1, null, 'A01', 'A01');
  ok(S.over && S.over.winner === 1 && hp(S, 1) === '0,0,0,1,0' && hp(S, 0) === '0,0,0,0,0' && S.log[0].noStrike[1] && /Your ship is beaten before it can strike back/.test(S.said.join(' ')), 'the same with the enemy first: the enemy wins, and is not hit', JSON.stringify([S.over, hp(S, 0), hp(S, 1)]));
  ok(B.defaults().bothFall === 'nobody', 'the page starts with both attacks landing together');
  S = last({}, 0, null, 'A01', 'A01');
  ok(S.over && S.over.winner === -1 && hp(S, 0) === '0,0,0,0,0' && hp(S, 1) === '0,0,0,0,0' && !S.log[0].noStrike[0], 'as the page starts: each ship has one part left, both attacks land, both are beaten and nobody wins', JSON.stringify([S.over, hp(S, 0), hp(S, 1)]));
  S = last({ guard: 'blind', bothFall: 'turn' }, 0, null, 'A01', 'A01');
  ok(S.over && S.over.winner === -1, 'with both cards put down together there is no leader, so both attacks land together', JSON.stringify(S.over));
  // the first hit takes the other ship's Weapons but not its last part: it had already fired, so its attack still lands
  S = last({ bothFall: 'turn' }, 0, T => { T.P[0].shield = 100; T.P[1].parts[0].hp = 20; }, 'A01', 'A01', { land1: [0, 0, 0, 25, 0] });
  ok(!S.over && S.P[1].parts[3].hp === 0 && S.P[1].parts[0].hp === 20 && S.P[0].shield === 100 - S.log[0].atk[1] && S.log[0].atk[1] === 30 && !S.log[0].noStrike[0], 'a ship that loses its Weapons, but not its last part, to the first hit still strikes back that round', JSON.stringify([S.over, hp(S, 1), S.P[0].shield, S.log[0].atk]));
  // two Spies: the leader's acts first
  S = last({ bothFall: 'turn' }, 1, null, 'spy', 'spy');
  ok(S.over && S.over.winner === 1 && hp(S, 1) === '0,0,0,1,0' && /Your ship is beaten\. Its Spy does nothing/.test(S.said.join(' ')), 'two Spies and one part each: the Spy of the player who went first acts first, and the other Spy does nothing', JSON.stringify([S.over, hp(S, 0), hp(S, 1), S.said]));
})();
const names = Object.keys(bad);
console.log('     ' + checks + ' checks made');
console.log(names.length ? 'FAILED: ' + names.map(k => k + ' (' + bad[k] + ')').join('; ') : 'ALL OK');
process.exit(names.length ? 1 : 0);
