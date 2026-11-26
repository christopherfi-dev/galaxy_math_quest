<?php
/* =====================================================================
   GALAXY MATH QUEST - WORLD SERVER v0.2: cards between classmates   [Proposal; every choice marked [pick] waits for Marc]

   Loaded by gmq-world-api.php only. Everything here is OFF until the teacher turns it on, for each class, on the Commander's Desk.

   1. The class card board: which cards classmates have found. A classmate is shown by their ship name (a name they chose and
      the teacher approved), never their first name, unless the teacher sets the class to first names.  [pick: ship names]
   2. Decks: a cadet chooses whether classmates may battle their deck. Off until the cadet turns it on.  [pick: each child opts in]
   3. Battles against a classmate's saved deck, played by the computer on the challenger's iPad. Nobody has to be online together.
      - friendly: nothing at stake
      - challenge [Source: Marc, 23 November]: both put up one rare or epic card, chosen at random from their deck. The challenger
        sees both cards before agreeing. The winner gets both. A tie moves nothing.
      - The teacher picks what happens to the classmate who is away (Marc's decision):
          'swap'      the winner takes both cards, as in Marc's rule
          'away-safe' the classmate who is away never loses a card: if the challenger wins, they get a copy of it
   The battle's rules are Marc's and the battle thread's. This file keeps decks, picks the cards at stake, moves cards after a
   battle, and tells the classmate who was away. It does not play the battle and cannot check who won.
   ===================================================================== */

function salt(): string { global $DATA; $f = "$DATA/salt.txt"; if (!is_file($f)) @file_put_contents($f, token(16), LOCK_EX); return (string)@file_get_contents($f); }
/* a classmate is named to other children by this mark, never by their first name or file name */
function hid(string $code, string $id): string { return substr(hash_hmac('sha256', "$code/$id", salt()), 0, 12); }
function shown(array $s, array $class): string { return ($class['show'] ?? 'ship') === 'first' ? (string)$s['name'] : (string)($s['ship']['name'] ?? ''); }
function cardName(array $c): string { return (string)($c['n'] ?? ($c['id'] ?? 'a card')); }
/* A deck holds battle cards (and upgrade cards); ship parts are for the ship. With the card list, a card the list does not know is left out. */
function inDeck(array $c): bool { if (catalogue()['n'] === 0) return true; $k = known($c); return $k !== null && $k['group'] !== 'ship part'; }
function deckOf(array $s): array {
    $book = array_values(array_filter(cardsOf($s['state']), 'inDeck')); $want = $s['deck']['uids'] ?? null; if (!is_array($want)) return $book;
    $by = []; foreach ($book as $c) if (uidOk($c['u'] ?? null)) $by[$c['u']] = $c; $out = []; foreach ($want as $u) if (isset($by[$u])) $out[] = $by[$u]; return $out;
}
function partsOf(array $s): array { if (catalogue()['n'] === 0) return []; return array_values(array_filter(cardsOf($s['state']), static function ($c) { $k = known($c); return $k !== null && $k['group'] === 'ship part'; })); }
/* the cards that may be put up in a challenge: rare or epic battle cards (the list decides the kind), each with its own mark */
function stakes(array $deck): array { return array_values(array_filter($deck, static function ($c) { $k = known($c); return uidOk($c['u'] ?? null) && in_array(cardKind($c), ['rare', 'epic'], true) && ($k === null || $k['group'] === 'battle card'); })); }
function openPath(string $code): string { global $DATA; return "$DATA/battles/" . slug($code, 12) . '/open.json'; }
function battleLog(string $code, array $b): void { global $DATA; $d = "$DATA/battles/" . slug($code, 12); if (!is_dir($d)) @mkdir($d, 0770, true); @file_put_contents("$d/log-" . date('Y-m') . '.jsonl', json_encode($b, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX); }
function news(array &$s, string $text): void { $n = is_array($s['news'] ?? null) ? $s['news'] : []; $n[] = ['at' => date('c'), 'say' => $text]; $s['news'] = array_slice($n, -20); }
/* battles that were never finished end with nothing moved  [pick: a battle left unfinished is not a loss] */
function late(array $b): bool { return strtotime((string)$b['started']) < time() - BATTLE_MINUTES * 60; }
function expireOpen(string $code, array $open): array {        // call only while holding the class lock: it writes
    $n = count($open);
    foreach ($open as $bid => $b) if (late($b)) { $b['status'] = $b['status'] === 'offered' ? 'not taken' : 'not finished'; $b['ended'] = date('c'); battleLog($code, $b); unset($open[$bid]); }
    if (count($open) !== $n) writeJson(openPath($code), $open);
    return $open;
}
/* a card leaves one book and arrives in another. Both books are fixed now, and both ledgers remember it for iPads that still show the old book. */
/* The card that arrives carries why it came and unseen: 1, as the cards thread's book keeps a card (GMQCards.record),
   so the game's card pop-up shows it by itself, with its reason. */
function moveCard(array &$from, array &$to, array $card, bool $copy, string $why = ''): ?array {
    $u = (string)($card['u'] ?? ''); $have = false; foreach (cardsOf($from['state']) as $c) if (($c['u'] ?? '') === $u) $have = true;
    if (!$have) return null;                                                         // it is no longer there: nothing moves
    if ($copy) { $card['u'] = 'c' . token(5); }
    else {
        $from['ledger']['gone'][] = $u; $from['ledger']['came'] = array_values(array_filter($from['ledger']['came'] ?? [], static function ($c) use ($u) { return ($c['u'] ?? '') !== $u; }));
        $from['state']['cards'] = array_values(array_filter($from['state']['cards'], static function ($c) use ($u) { return !is_array($c) || ($c['u'] ?? '') !== $u; }));
        $from['summary'] = summary($from['state']);
    }
    if ($why !== '') { $card['why'] = $why; $card['unseen'] = 1; }
    $nu = $card['u']; $to['ledger']['gone'] = array_values(array_diff($to['ledger']['gone'] ?? [], [$nu])); $to['ledger']['came'][] = $card;
    if (!is_array($to['state'])) $to['state'] = ['cards' => []]; if (!is_array($to['state']['cards'] ?? null)) $to['state']['cards'] = [];
    $to['state']['cards'][] = $card; $to['summary'] = summary($to['state']);
    return $card;
}

/* what the challenger's page needs to open a battle (battle_start answers it; rivals answers it again for a battle still open) */
function offer(array $b, array $me, array $them): array {
    return ['ok' => true, 'battle' => $b['bid'], 'kind' => $b['kind'], 'rule' => $b['rule'], 'status' => $b['status'], 'seed' => $b['seed'], 'minutes' => BATTLE_MINUTES,
        'you' => ['deck' => deckOf($me), 'parts' => partsOf($me), 'stake' => $b['a']['stake']], 'rival' => ['name' => $b['b']['name'], 'deck' => deckOf($them), 'parts' => partsOf($them), 'stake' => $b['b']['stake']]];
}

function cardsAction(string $action, array $in, string $code, string $id, array $class): void {
    $share = shareOf($class); $path = studentPath($code, $id);

    if ($action === 'board') {
        if (!$share['board']) out(['ok' => true, 'off' => true, 'cards' => []]);
        $map = []; $mates = 0;
        foreach (cadetsOf($code) as $s) {
            if ($s['id'] === $id) continue; $mates++; $label = shown($s, $class); $keys = [];
            foreach (cardsOf($s['state']) as $c) $keys[cardKey($c)] = cardKind($c);
            foreach ($keys as $k => $r) { if (!isset($map[$k])) $map[$k] = ['key' => $k, 'kind' => $r, 'found_by' => 0, 'names' => []]; $map[$k]['found_by']++; if ($label !== '' && count($map[$k]['names']) < 5) $map[$k]['names'][] = $label; }
        }
        ksort($map); out(['ok' => true, 'classmates' => $mates, 'show' => $share['show'], 'cards' => array_values($map)]);
    }

    if ($action === 'deck') {                                   // { open: true/false, uids: [the cards in my deck] or null for my whole book }
        $s = withLocks([cadetLock($code, $id)], static function () use ($path, $in) {
            $s = needStudent(); $book = []; foreach (cardsOf($s['state']) as $c) if (uidOk($c['u'] ?? null)) $book[$c['u']] = true;
            if (array_key_exists('open', $in)) $s['deck']['open'] = (bool)$in['open'];
            if (array_key_exists('uids', $in)) { if ($in['uids'] === null) $s['deck']['uids'] = null; elseif (is_array($in['uids'])) $s['deck']['uids'] = array_values(array_unique(array_filter($in['uids'], static function ($u) use ($book) { return is_string($u) && isset($book[$u]); }))); }
            writeJson($path, $s); return $s;
        });
        out(['ok' => true, 'deck' => ['open' => !empty($s['deck']['open']), 'cards' => deckOf($s)]]);
    }

    /* TEST PAGE ONLY (cards-test.html), and only when the teacher has turned on the test page for this class: a pretend cadet
       is given the starter pack once, so battles can be tried before the game hands out the new cards. The cards come through
       the ledger, so the cadet's game keeps them on any device. */
    if ($action === 'test_starter') {
        if (!$share['test_tools']) fail('The test page is off for this class.', 403);
        if (catalogue()['n'] === 0) fail('The card list (api/cards.json) is missing.', 503);
        $res = withLocks([cadetLock($code, $id)], static function () use ($path) {
            $s = needStudent(); foreach (cardsOf($s['state']) as $c) if (known($c)) fail('You already have cards from the new list.', 409);
            $seed = is_array($s['state']) && is_numeric($s['state']['seed'] ?? null) ? (int)$s['state']['seed'] : random_int(1, 2147483646);
            $cat = catalogue(); $got = [];
            foreach (starterPack($seed) as $cid) { $e = $cat['id'][$cid]; $card = ['id' => $cid, 'n' => $e['name'], 'r' => $e['rarity'] === 'epic' ? 'gold' : $e['rarity'], 'u' => 's' . token(5)]; $got[] = $card;
                $s['ledger']['came'][] = $card; if (!is_array($s['state'])) $s['state'] = ['cards' => []]; if (!is_array($s['state']['cards'] ?? null)) $s['state']['cards'] = []; $s['state']['cards'][] = $card; }
            $s['summary'] = summary($s['state']); writeJson($path, $s); logLine('test starter pack given'); return $got;
        });
        out(['ok' => true, 'cards' => $res]);
    }

    if (in_array($action, ['rivals', 'battle_start', 'battle_accept', 'battle_cancel', 'battle_end'], true) && $share['battles'] === 'off') fail('Battles are switched off for this class.', 403);

    if ($action === 'rivals') {
        $me = needStudent(); $open = readJson(openPath($code)) ?? []; $busy = []; $mine = null;
        foreach ($open as $b) if (!late($b)) { $busy[$b['a']['id']] = true; $busy[$b['b']['id']] = true;
            if ($b['a']['id'] === $id) { $them = readJson(studentPath($code, (string)$b['b']['id'])) ?? ['state' => null]; $mine = offer($b, $me, $them); } }
        $list = [];
        foreach (cadetsOf($code) as $s) {
            if ($s['id'] === $id || empty($s['deck']['open']) || shown($s, $class) === '') continue;           // only a classmate who said yes, with a name they chose
            $deck = deckOf($s); if (!$deck) continue;
            $list[] = ['rival' => hid($code, $s['id']), 'name' => shown($s, $class), 'deck' => count($deck), 'friendly' => true,
                'challenge' => in_array($share['battles'], ['swap', 'away-safe'], true) && count(stakes($deck)) > 0, 'busy' => !empty($busy[$s['id']])];
        }
        usort($list, static function ($a, $b) { return strcmp($a['name'], $b['name']); });
        out(['ok' => true, 'battles' => $share['battles'], 'can_challenge' => count(stakes(deckOf($me))) > 0, 'rivals' => $list, 'mine' => $mine]);
    }

    if ($action === 'battle_start') {                           // { rival, kind: 'friendly' | 'challenge' }
        $kind = (string)($in['kind'] ?? 'friendly'); if (!in_array($kind, ['friendly', 'challenge'], true)) fail('Which kind of battle?');
        if ($kind === 'challenge' && !in_array($share['battles'], ['swap', 'away-safe'], true)) fail('Only friendly battles are on in this class.', 403);
        $rid = ''; foreach (cadetsOf($code) as $s) if (hash_equals(hid($code, $s['id']), (string)($in['rival'] ?? ''))) $rid = $s['id'];
        if ($rid === '' || $rid === $id) fail('That classmate is not here.', 404);
        $offer = withLocks([classLock($code), cadetLock($code, $id), cadetLock($code, $rid)], static function () use ($code, $id, $rid, $kind, $class, $share, $path) {
            $me = needStudent(); $them = readJson(studentPath($code, $rid)); if (!$them || empty($them['deck']['open']) || shown($them, $class) === '') fail('That classmate is not taking battles now.', 403);
            $open = expireOpen($code, readJson(openPath($code)) ?? []);
            foreach ($open as $b) { if ($b['a']['id'] === $id || $b['b']['id'] === $id) fail('Finish your other battle first.', 409); if ($b['a']['id'] === $rid || $b['b']['id'] === $rid) fail('That classmate is in another battle. Try again soon.', 409); }
            $starts = array_values(array_filter($me['starts'] ?? [], static function ($t) { return $t > time() - 3600; })); if (count($starts) >= BATTLES_PER_HOUR) fail('That is enough battles for one hour. Try again later.', 429);
            $mine = deckOf($me); $theirs = deckOf($them); if (!$mine) fail('You need cards in your deck first.'); if (!$theirs) fail('That deck is empty.');
            $b = ['bid' => token(6), 'kind' => $kind, 'rule' => $kind === 'challenge' ? $share['battles'] : 'none', 'started' => date('c'), 'status' => $kind === 'challenge' ? 'offered' : 'on', 'seed' => random_int(1, 2147483646),
                'a' => ['id' => $id, 'name' => shown($me, $class), 'stake' => null], 'b' => ['id' => $rid, 'name' => shown($them, $class), 'stake' => null]];
            if ($kind === 'challenge') {
                $sa = stakes($mine); $sb = stakes($theirs); if (!$sa) fail('You need a rare or epic card in your deck to challenge.'); if (!$sb) fail('That deck has no rare or epic card to put up.');
                $b['a']['stake'] = $sa[random_int(0, count($sa) - 1)]; $b['b']['stake'] = $sb[random_int(0, count($sb) - 1)];          // chosen at random from each deck [Source: Marc]
            }
            $open[$b['bid']] = $b; writeJson(openPath($code), $open); $starts[] = time(); $me['starts'] = $starts; writeJson($path, $me);
            return offer($b, $me, $them);
        });
        out($offer);
    }

    if ($action === 'battle_accept' || $action === 'battle_cancel' || $action === 'battle_end') {
        $bid = (string)($in['battle'] ?? ''); $open = readJson(openPath($code)) ?? []; $b0 = $open[$bid] ?? null;
        if (!$b0 || $b0['a']['id'] !== $id) fail('That battle is not open.', 404);
        $rid = (string)$b0['b']['id'];
        $res = withLocks([classLock($code), cadetLock($code, $id), cadetLock($code, $rid)], static function () use ($action, $code, $id, $rid, $bid, $in, $path) {
            $open = readJson(openPath($code)) ?? []; $b = $open[$bid] ?? null; if (!$b || $b['a']['id'] !== $id) fail('That battle is not open.', 404);
            if ($action === 'battle_accept') { if ($b['status'] !== 'offered') fail('That battle has already begun.', 409); $b['status'] = 'on'; $b['accepted'] = date('c'); $open[$bid] = $b; writeJson(openPath($code), $open); return ['ok' => true, 'status' => 'on']; }
            if ($action === 'battle_cancel') { if ($b['status'] !== 'offered') fail('A battle that has begun must be finished.', 409); $b['status'] = 'backed out'; $b['ended'] = date('c'); battleLog($code, $b); unset($open[$bid]); writeJson(openPath($code), $open); return ['ok' => true, 'status' => 'backed out']; }
            /* battle_end: { battle, result: 'won' | 'lost' | 'tie' }, from the challenger's side */
            if ($b['status'] !== 'on') fail('Agree to the battle first.', 409);
            $result = (string)($in['result'] ?? ''); if (!in_array($result, ['won', 'lost', 'tie'], true)) fail('Who won?');
            $me = needStudent(); $them = readJson(studentPath($code, $rid)); $who = $b['a']['name'] !== '' ? $b['a']['name'] : 'A classmate'; $moved = null;
            if (!$them) { $b['status'] = 'classmate removed'; $b['ended'] = date('c'); battleLog($code, $b); unset($open[$bid]); writeJson(openPath($code), $open); return ['ok' => true, 'status' => 'done', 'result' => $result, 'moved' => null, 'cards' => $me['state']['cards'] ?? []]; }
            $theirName = $b['b']['name'] !== '' ? $b['b']['name'] : 'a classmate';
            if ($b['kind'] === 'challenge' && $result === 'won') $moved = moveCard($them, $me, $b['b']['stake'], $b['rule'] === 'away-safe', $b['rule'] === 'away-safe' ? "A copy, won from $theirName's deck in a challenge." : "Won from $theirName's deck in a challenge.");
            if ($b['kind'] === 'challenge' && $result === 'lost') $moved = moveCard($me, $them, $b['a']['stake'], false, "Your deck won it from $who in a challenge.");
            if ($b['kind'] === 'friendly') news($them, $result === 'won' ? "$who had a friendly battle with your deck. $who won." : ($result === 'lost' ? "$who had a friendly battle with your deck. Your deck won!" : "$who had a friendly battle with your deck. It was a tie."));
            elseif ($result === 'tie') news($them, "$who challenged your deck. It was a tie. No card moved.");
            elseif ($result === 'lost') news($them, $moved ? "$who challenged your deck, and your deck won! You got " . cardName($moved) . '.' : "$who challenged your deck, and your deck won!");
            elseif ($b['rule'] === 'away-safe') news($them, "$who challenged your deck and won. You keep all your cards." . ($moved ? ' ' . $who . ' got a copy of ' . cardName($moved) . '.' : ''));
            else news($them, $moved ? "$who challenged your deck and won. " . cardName($moved) . " went to $who." : "$who challenged your deck and won.");
            $b['status'] = 'done'; $b['result'] = $result; $b['ended'] = date('c'); $b['moved'] = $moved; $lg = $in['log'] ?? null;                                    // what the battle says happened, in words (the battle piece), for the teacher; kept small
            $b['log'] = is_string($lg) ? substr(preg_replace('/[^\P{C}\n]/u', '', $lg) ?? '', 0, 20000) : (is_array($lg) && strlen((string)json_encode($lg)) <= 20000 ? $lg : null);
            writeJson($path, $me); writeJson(studentPath($code, $rid), $them); battleLog($code, $b); unset($open[$bid]); writeJson(openPath($code), $open);
            return ['ok' => true, 'status' => 'done', 'result' => $result, 'moved' => $moved, 'cards' => $me['state']['cards'] ?? []];
        });
        out($res);
    }
    fail('Unknown action.', 404);
}

/* the teacher sees every card and every battle, with first names */
function teacherCards(string $action, string $code, array $class): void {
    global $DATA;
    if ($action === 't_board') {
        $map = []; foreach (cadetsOf($code) as $s) { $keys = []; foreach (cardsOf($s['state']) as $c) $keys[cardKey($c)] = cardKind($c);
            foreach ($keys as $k => $r) { if (!isset($map[$k])) $map[$k] = ['key' => $k, 'kind' => $r, 'found_by' => 0, 'names' => []]; $map[$k]['found_by']++; $map[$k]['names'][] = $s['name']; } }
        ksort($map); out(['ok' => true, 'cards' => array_values($map)]);
    }
    $open = array_filter(readJson(openPath($code)) ?? [], static function ($b) { return !late($b); }); $done = [];
    foreach ([date('Y-m', strtotime('first day of last month')), date('Y-m')] as $m) { $f = "$DATA/battles/" . slug($code, 12) . "/log-$m.jsonl"; if (is_file($f)) foreach (file($f, FILE_IGNORE_NEW_LINES) ?: [] as $l) { $d = json_decode($l, true); if (is_array($d)) $done[] = $d; } }
    $names = []; foreach (cadetsOf($code) as $s) $names[$s['id']] = $s['name'];
    $tidy = static function ($b) use ($names) { return ['when' => $b['ended'] ?? $b['started'], 'kind' => $b['kind'], 'rule' => $b['rule'], 'status' => $b['status'], 'result' => $b['result'] ?? null,
        'a' => $names[$b['a']['id']] ?? $b['a']['id'], 'b' => $names[$b['b']['id']] ?? $b['b']['id'], 'stakes' => [$b['a']['stake'] ? cardName($b['a']['stake']) : null, $b['b']['stake'] ? cardName($b['b']['stake']) : null], 'moved' => !empty($b['moved']) ? cardName($b['moved']) : null, 'log' => is_string($b['log'] ?? null) ? substr($b['log'], 0, 6000) : null]; };
    out(['ok' => true, 'open' => array_values(array_map($tidy, $open)), 'done' => array_reverse(array_slice(array_map($tidy, $done), -100))]);
}
