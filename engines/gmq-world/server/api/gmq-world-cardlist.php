<?php
/* =====================================================================
   GALAXY MATH QUEST - WORLD SERVER: the card list   (loaded by gmq-world-api.php; never opened by itself)
   Pure functions only, so a check can load this file alone (checks/server_cards_check.js).
   ===================================================================== */
declare(strict_types=1);

/* The card list (the battle thread's docs/battle/cards.json, copied to api/cards.json). Without it, the server trusts the page's kind. */
function catalogue(): array {
    static $cat = null; if ($cat !== null) return $cat; global $CONFIG;
    $cat = ['n' => 0, 'id' => [], 'name' => [], 'starter' => null, 'cards' => []];
    $f = (string)($CONFIG['cards_file'] ?? (__DIR__ . '/cards.json')); $t = is_file($f) ? @file_get_contents($f) : false; $d = $t === false ? null : json_decode($t, true); if (!is_array($d)) return $cat;
    foreach (['cards' => 'battle card', 'upgrades' => 'upgrade', 'parts' => 'ship part'] as $list => $group) foreach (is_array($d[$list] ?? null) ? $d[$list] : [] as $c) {
        if (!is_array($c) || !isset($c['id'], $c['name'])) continue;
        $e = ['id' => (string)$c['id'], 'name' => (string)$c['name'], 'group' => $group, 'type' => (string)($c['type'] ?? ''), 'rarity' => (string)($c['rarity'] ?? ''), 'part' => (string)($c['part'] ?? '')];
        $cat['id'][$e['id']] = $e; $cat['name'][strtolower($e['name'])] = $e['id']; if ($list === 'cards') $cat['cards'][] = $e;
    }
    $cat['n'] = count($cat['id']); $cat['starter'] = is_array($d['starter_pack'] ?? null) ? $d['starter_pack'] : null;
    return $cat;
}
/* which card of the list this is, by its id or its name; null for a card the list does not know (the 6 old cards) */
function known(array $c): ?array { $cat = catalogue(); $id = (string)($c['id'] ?? ''); if ($id !== '' && isset($cat['id'][$id])) return $cat['id'][$id];
    $n = strtolower(trim((string)($c['n'] ?? ''))); return $n !== '' && isset($cat['name'][$n]) ? $cat['id'][$cat['name'][$n]] : null; }
/* The starter pack, by the battle thread's rule (cards.json, starter_pack), made exactly as GMQBattleOwn.starter(seed) makes it,
   so the same seed gives the same 15 cards on the server and in the game. Checked against the JavaScript on many seeds (server_cards_check.js). */
function starterPack(int $seed): array {
    $cat = catalogue(); if (!$cat['starter'] || !is_array($cat['starter']['slots'] ?? null)) return [];
    $s = (abs($seed) % 2147483646) + 1; $used = []; $out = [];
    $r = static function () use (&$s): float { $s = ($s * 16807) % 2147483647; return ($s - 1) / 2147483646; };
    foreach ($cat['starter']['slots'] as $sl) {
        $types = is_array($sl['type'] ?? null) ? $sl['type'] : [(string)($sl['type'] ?? '')];
        $pool = array_values(array_filter($cat['cards'], static function ($c) use ($types, $sl, &$used) { return in_array($c['type'], $types, true) && $c['rarity'] === (string)($sl['rarity'] ?? '') && empty($used[$c['id']]); }));
        for ($k = 0; $k < (int)($sl['count'] ?? 0) && count($pool); $k++) { $i = (int)floor($r() * count($pool)); $c = array_splice($pool, $i, 1)[0]; $used[$c['id']] = 1; $out[] = $c['id']; }
    }
    return $out;
}
