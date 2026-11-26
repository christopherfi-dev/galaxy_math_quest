<?php
/* =====================================================================
   GALAXY MATH QUEST - WORLD SERVER v0.2   (by Claude, for Marc to try on a TEST folder first)

   What it does
     - remembers each cadet: a class code, a name and a 4-digit number open their own saved game on any device
     - keeps the teacher's codes for the real-life tasks on the server, not in the page
     - holds a new ship name until the teacher approves it
     - gives the teacher a view of the whole class, and copies of games that went back, to bring back
     - can pass what a cadet types to the AI, inside the constraint file, and checks the reply before a child sees it
     - (new in 0.2) a class card board, and battles against a classmate's saved deck, played by the computer.
       Both are OFF until the teacher turns them on. The battle's rules are Marc's: the server only keeps decks,
       picks the cards at stake, and moves cards after a battle.

   What changed from 0.1, and why  [found by checks/server_class_test.js: 14 pretend cadets, two iPads each]
     - every file is written whole, then swapped in, so nobody reads a half-written file
       (0.1 told a playing cadet "Please log in" 3 to 8 times in one test run, and the class view lost a cadet)
     - each cadet's file is locked while it is changed, so a code and a save at the same moment both stay
       (0.1 lost a passed real-life code in 1 or 2 of 14 cadets)
     - only the newest log in of a cadet may save their game. An older iPad that wakes up cannot write its
       old game over the newer one (0.1 did, for all 14 cadets)
     - log ins live in the data folder for a school day, not 24 minutes
     - a health check and a first-time setup, so the teacher password can be set without a command line

   What it does not do yet
     - mark the maths. The page still does that.
     - check who won a battle. The page says so. A child with the know-how could claim a win. (See the report.)

   It is built like the Math Skills engine: PHP, flat JSON files, a session, and the AI key in api/config.php,
   which stays on the server and is never copied anywhere. It runs on PHP 7.4 or newer.

   One address, POST, JSON in and JSON out:  { "action": "...", ... }
   ===================================================================== */
declare(strict_types=1);
error_reporting(E_ALL); ini_set('display_errors', '0');

const VERSION = '0.2';
$CONFIG = file_exists(__DIR__ . '/config.php') ? (require __DIR__ . '/config.php') : [];
if (!is_array($CONFIG)) $CONFIG = [];
$DATA = rtrim((string)($CONFIG['data_dir'] ?? (__DIR__ . '/data')), '/');
const MAX_STATE_BYTES = 300000;
const MAX_TRIES = 5;            // wrong numbers before a cadet is locked out for a while (the Math Skills engine uses 5 too)
const LOCK_SECONDS = 600;
const DEFAULT_CODES = ['calib' => 805, 'starmap' => 314, 'target' => 936, 'alloc' => 446, 'choice' => 728];
const MAX_BACKUPS = 5;
define('BATTLE_MINUTES', max(0.05, (float)($CONFIG['battle_minutes'] ?? 20)));     // a battle not finished in this time ends with nothing moved  [pick]
const BATTLES_PER_HOUR = 6;     // a cadet may start this many battles in an hour  [pick]

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
if (!empty($CONFIG['allow_origin'])) {                      // only needed when the page is served from another site
    header('Access-Control-Allow-Origin: ' . $CONFIG['allow_origin']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { out(['ok' => false, 'error' => 'Use POST.'], 405); }

/* ---------------------------------------------------------------- small tools */
function out(array $a, int $code = 200): void { http_response_code($code); echo json_encode($a, JSON_UNESCAPED_UNICODE); exit; }
function fail(string $msg, int $code = 400, array $more = []): void { out(['ok' => false, 'error' => $msg] + $more, $code); }
function slug(string $s, int $max = 24): string { return substr(preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($s))) ?? '', 0, $max); }
function readJson(string $path): ?array { if (!is_file($path)) return null; $t = @file_get_contents($path); $d = json_decode($t === false ? '' : $t, true); return is_array($d) ? $d : null; }
/* The whole file is written beside the old one, then swapped in. A reader sees the old file or the new one, never half of one. */
function writeJson(string $path, array $d): void {
    $dir = dirname($path); if (!is_dir($dir) && !@mkdir($dir, 0770, true) && !is_dir($dir)) fail('The server could not save.', 500);
    $tmp = $path . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (@file_put_contents($tmp, json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)) === false || !@rename($tmp, $path)) { @unlink($tmp); fail('The server could not save.', 500); }
}
/* One lock file for each thing that is changed. Locks are always taken in the same (sorted) order, so two requests can never wait for each other for ever. */
function withLocks(array $names, callable $fn) {
    global $DATA; $names = array_values(array_unique($names)); sort($names); $held = [];
    if (!is_dir("$DATA/locks")) @mkdir("$DATA/locks", 0770, true);
    foreach ($names as $n) { $h = @fopen("$DATA/locks/" . preg_replace('/[^a-z0-9\-]/', '', $n) . '.lock', 'c'); if (!$h || !flock($h, LOCK_EX)) fail('The server is busy. Try again.', 503); $held[] = $h; }
    try { return $fn(); } finally { foreach ($held as $h) { flock($h, LOCK_UN); fclose($h); } }
}
function cadetLock(string $code, string $id): string { return 'cadet-' . slug($code, 12) . '-' . slug($id, 24); }
function classLock(string $code): string { return 'class-' . slug($code, 12); }
function classPath(string $code): string { global $DATA; return "$DATA/classes/" . slug($code, 12) . '.json'; }
function studentPath(string $code, string $id): string { global $DATA; return "$DATA/students/" . slug($code, 12) . '/' . slug($id, 24) . '.json'; }
function cadetsOf(string $code): array { global $DATA; $all = []; foreach (glob("$DATA/students/" . slug($code, 12) . '/*.json') ?: [] as $f) { $s = readJson($f); if ($s) $all[] = $s; } return $all; }
function logLine(string $what): void { global $DATA; @mkdir("$DATA/logs", 0770, true); @file_put_contents("$DATA/logs/" . date('Y-m') . '.log', date('c') . ' ' . $what . "\n", FILE_APPEND | LOCK_EX); }
function token(int $bytes = 8): string { return bin2hex(random_bytes($bytes)); }
/* The data folder should be outside the web folder. If it is inside, these two files keep it shut on servers that read them. The teacher's page checks it from outside. */
function guardData(): void {
    global $DATA; if (!is_dir($DATA)) @mkdir($DATA, 0770, true);
    if (is_dir($DATA) && !is_file("$DATA/.htaccess")) @file_put_contents("$DATA/.htaccess", "<IfModule mod_authz_core.c>\n  Require all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\n  Deny from all\n</IfModule>\n");
    if (is_dir($DATA) && !is_file("$DATA/index.html")) @file_put_contents("$DATA/index.html", '');
}
guardData();

/* ---------------------------------------------------------------- log ins: kept in the data folder, for a school day */
$HOURS = max(1, min(24 * 30, (int)($CONFIG['session_hours'] ?? 10)));        // [pick] 10 hours: a cadet logs in once a school day
$SESS = "$DATA/sessions"; if (!is_dir($SESS)) @mkdir($SESS, 0700, true);
if (is_dir($SESS) && is_writable($SESS)) { session_save_path($SESS); ini_set('session.gc_probability', '1'); ini_set('session.gc_divisor', '100'); }
ini_set('session.gc_maxlifetime', (string)($HOURS * 3600)); ini_set('session.use_strict_mode', '1');
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
$cpath = rtrim(str_replace('\\', '/', dirname((string)($_SERVER['SCRIPT_NAME'] ?? '/api/x.php'))), '/') . '/';       // the cookie belongs to this folder only, so a test folder and a class folder never share a log in
session_name('gmqworld');
session_set_cookie_params(['lifetime' => $HOURS * 3600, 'path' => $cpath, 'secure' => $https, 'httponly' => true, 'samesite' => 'Lax']);
session_start();

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > MAX_STATE_BYTES + 20000) { out(['ok' => false, 'error' => 'Too big.'], 413); }
$in = json_decode($raw, true);
if (!is_array($in)) { out(['ok' => false, 'error' => 'Send JSON.'], 400); }
$action = (string)($in['action'] ?? '');

/* Kind words only. The same check as the page, so a changed page cannot get a rude name past it. */
function rude(string $t, bool $strict = false): bool {
    static $leet = ['0' => 'o', '1' => 'i', '3' => 'e', '4' => 'a', '5' => 's', '7' => 't', '8' => 'b', '@' => 'a', '$' => 's', '!' => 'i', '+' => 't', '|' => 'i'];
    static $any = '/(f+[uv]+c*k|f+c+k|p+h+u+c*k|s+h+[iy]+t|b+[iy]+t+c+h|b+[iy]+a+t+c+h|c+u+n+t|n+[iy]+g+g+[ae]|w+h+o+r+e|s+l+u+t|b+a+s+t+a+r+d|p+e+n+[iy]+s|v+a+g+[iy]+n|b+o+o+b|p+u+s+s+y|p+o+r+n|w+a+n+k|t+w+a+t|a+s+s+h+o+l+e|a+r+s+e+h+o+l+e|d+[iy]+c+k+h+e+a+d|(dumb|jack|bad|smart|kick|fat|butt|kiss)a+s+s|j+e+r+k+o+f|d+o+u+c+h+e|r+e+t+a+r+d|m+o+f+o|b+o+l+l+o+c+k|b+u+g+g+e+r|f+a+g+g|d+[iy]+l+d+o|b+u+t+t+h+o+l+e|b+u+t+t+h+e+a+d|p+o+o+p+h+e+a+d|b+u+l+l+s+h|s+h+[iy]+z|s+u+c+k+s|s+u+c+k+e+r)/';
    static $whole = ['ass', 'asses', 'arse', 'sex', 'sexy', 'cock', 'cocks', 'dick', 'dicks', 'damn', 'damned', 'dammit', 'crap', 'crappy', 'craps', 'piss', 'pissed', 'pissing', 'fag', 'fags', 'hell', 'butt', 'butts', 'bum', 'bums', 'booty', 'poo', 'poop', 'poops', 'poopy', 'pee', 'fart', 'farts', 'farty', 'tit', 'tits', 'titty', 'titties', 'prick', 'shag', 'hoe', 'hoes', 'turd', 'turds', 'wtf', 'stfu', 'omfg', 'lmfao', 'fml', 'fu', 'fk', 'fck', 'fuk', 'suck', 'stupid', 'idiot', 'idiots', 'dumb', 'dummy', 'loser', 'losers', 'ugly', 'moron', 'jerk', 'jerks', 'hate', 'bloody', 'bugger', 'git', 'nazi', 'kkk'];
    $bad = static function (string $w) use ($any, $whole): bool { return $w !== '' && (preg_match($any, $w) === 1 || in_array($w, $whole, true)); };
    $words = [];
    foreach (preg_split('/\s+/', strtolower(trim($t))) ?: [] as $w) { if ($w === '' || preg_match('/^[0-9]+$/', $w)) continue; $w = preg_replace('/[^a-z]/', '', strtr($w, $leet)) ?? ''; if ($w !== '') $words[] = $w; }
    foreach ($words as $w) if ($bad($w)) return true;
    $run = '';
    foreach (array_merge($words, ['']) as $w) { if (strlen($w) === 1) { $run .= $w; } else { if ($bad($run)) return true; $run = ''; } }
    return $strict && count($words) > 1 && $bad(implode('', $words));
}
function cleanName(string $s, int $max): string { $s = trim(preg_replace('/\s+/', ' ', preg_replace('/[^A-Za-z0-9 ]/', '', $s) ?? '') ?? ''); return substr(ucwords(strtolower($s)), 0, $max); }

/* ---------------------------------------------------------------- cards in a saved game
   A card in the game is { r: kind, n: name } today; a catalogue card adds id. For cards that can move between classmates,
   the page also gives each card its own mark u (letters and digits). The kinds: common, rare, and epic (saved as "gold"). */
function cardKey(array $c): string { return (string)($c['id'] ?? ($c['n'] ?? '')); }
function cardKind(array $c): string { $r = (string)($c['r'] ?? ''); return $r === 'gold' ? 'epic' : $r; }
/* A card as other children may see it: only its id, name, kind and mark, in plain letters. The page wrote it, so it is cleaned first. */
function cleanCard(array $c): array {
    $o = []; if (isset($c['id']) && is_scalar($c['id'])) $o['id'] = substr(preg_replace('/[^A-Za-z0-9_\-]/', '', (string)$c['id']) ?? '', 0, 40);
    if (isset($c['n']) && is_scalar($c['n'])) $o['n'] = substr(trim(preg_replace('/[^A-Za-z0-9 \'\-]/', '', (string)$c['n']) ?? ''), 0, 40);
    $r = (string)($c['r'] ?? ''); $o['r'] = in_array($r, ['common', 'rare', 'gold', 'epic'], true) ? $r : 'common';
    if (uidOk($c['u'] ?? null)) $o['u'] = (string)$c['u'];
    foreach (['id', 'n'] as $k) if (isset($o[$k]) && $o[$k] === '') unset($o[$k]);
    return $o;
}
function cardsOf(?array $state): array { $out = []; if (!is_array($state) || !is_array($state['cards'] ?? null)) return $out; foreach ($state['cards'] as $c) if (is_array($c)) { $c = cleanCard($c); if (cardKey($c) !== '') $out[] = $c; } return $out; }
function uidOk($u): bool { return is_string($u) && preg_match('/^[A-Za-z0-9]{6,20}$/', $u) === 1; }
/* Cards that moved in a battle are written in the cadet's ledger. Every save passes through it, so an iPad that still shows an
   old card book cannot bring back a card that left, or lose one that came. Applying it twice changes nothing. */
function applyLedger(array &$s, ?array $state): array {
    if (!is_array($state)) return [$state, false];
    $gone = array_flip($s['ledger']['gone'] ?? []); $came = $s['ledger']['came'] ?? []; $seen = []; $kept = []; $changed = false;
    foreach (is_array($state['cards'] ?? null) ? $state['cards'] : [] as $c) {
        if (!is_array($c)) { $changed = true; continue; }
        $u = $c['u'] ?? null;
        if (uidOk($u)) { if (isset($gone[$u]) || isset($seen[$u])) { $changed = true; continue; } $seen[$u] = true; }      // a card that left, or the same card twice
        $kept[] = $c;
    }
    foreach ($came as $c) { $u = (string)($c['u'] ?? ''); if (isset($gone[$u]) || isset($seen[$u])) continue; $kept[] = $c; $seen[$u] = true; $changed = true; }
    // both lists are kept for good (a few bytes for each battle), so even a very old card book is put right
    if ($changed) $state['cards'] = $kept;
    return [$state, $changed];
}

/* What the teacher's class view shows for one cadet. Worked out from the saved game, so the page cannot simply claim it. */
function summary(?array $state): ?array {
    if (!is_array($state)) return null;
    $done = is_array($state['done'] ?? null) ? count(array_filter($state['done'])) : 0;
    $v = is_array($state['v'] ?? null) ? $state['v'] : null; $hist = $v && is_array($v['hist'] ?? null) ? $v['hist'] : []; $last = $hist ? end($hist) : null;
    $ending = null;
    if (is_array($last)) { $p = ($last['mood'] ?? 0) >= 600; $e = ($last['actual'] ?? 0) >= 1650; $ending = $p && $e ? 'Voltara shines' : ($p ? 'Happy, but short of power' : ($e ? 'Power, but not happy' : 'Worse off')); }
    $t = is_array($state['trade'] ?? null) ? $state['trade'] : null; $kinds = ['common' => 0, 'rare' => 0, 'epic' => 0];
    foreach (cardsOf($state) as $c) { $k = cardKind($c); if (isset($kinds[$k])) $kinds[$k]++; }
    return ['where' => (string)($state['mode'] ?? ''), 'room' => (string)($state['room'] ?? ''), 'tasks' => min(15, $done), 'parts' => is_array($state['parts'] ?? null) ? min(5, count($state['parts'])) : 0,
        'cards' => count(cardsOf($state)), 'card_kinds' => $kinds, 'secrets' => is_array($state['secrets'] ?? null) ? count($state['secrets']) : 0,
        'voltara_day' => $v ? (int)($v['day'] ?? 0) : 0, 'voltara' => $ending, 'gems' => $t ? (int)($t['gems'] ?? 0) : 0, 'trade_best' => $t ? (int)($t['best'] ?? 0) : 0,
        'hazards' => is_array($state['flu'] ?? null) ? max(0, min(4, (int)($state['flu']['lvl'] ?? 1) - 1)) : 0];
}
/* A rough size of a game, only to notice when a save makes a game go back (a new game by mistake, or an old iPad). */
function progress(?array $state): int { $m = summary($state); if (!$m) return 0; return $m['tasks'] * 5 + $m['parts'] * 5 + $m['cards'] + $m['secrets'] + $m['voltara_day'] + (int)floor($m['trade_best'] / 1000); }
function backup(array &$s, ?array $state, string $why): void {
    if (!is_array($state) || progress($state) === 0) return;
    $b = is_array($s['backups'] ?? null) ? $s['backups'] : [];
    if ($b && ($b[0]['why'] ?? '') === $why && strtotime((string)$b[0]['at']) > time() - 600) array_shift($b);   // one copy per reason in ten minutes is enough
    array_unshift($b, ['at' => date('c'), 'why' => $why, 'summary' => summary($state), 'state' => $state]); $s['backups'] = array_slice($b, 0, MAX_BACKUPS);
}

/* ---------------------------------------------------------------- the cadet */
function needStudent(): array {
    if (empty($_SESSION['class']) || empty($_SESSION['id'])) fail('Please log in.', 401);
    $s = readJson(studentPath($_SESSION['class'], $_SESSION['id'])); if (!$s) fail('Please log in.', 401); return $s;
}
function newest(array $s): bool { return empty($s['login']) || hash_equals((string)$s['login'], (string)($_SESSION['lg'] ?? '')); }
/* what every cadet answer carries: the game, its count of saves, and news from battles while the cadet was away */
function cadetOut(array $s, array $class, array $more = []): array {
    return ['ok' => true, 'name' => $s['name'], 'class' => $class['name'] ?? '', 'state' => $s['state'], 'rev' => (int)($s['rev'] ?? 0), 'saved_at' => $s['saved_at'], 'ship' => $s['ship'], 'ai' => aiOn(),
        'names' => $class['names'] ?? 'approve', 'share' => shareOf($class), 'news' => array_values($s['news'] ?? []), 'version' => VERSION] + $more;
}
function shareOf(array $class): array { return ['board' => !empty($class['board']), 'battles' => (string)($class['battles'] ?? 'off'), 'show' => (string)($class['show'] ?? 'ship')]; }

if ($action === 'health') {                                     // anyone may ask: it says what works, never a path, a key or a name
    $probe = ''; $word = '';
    $writable = is_dir($DATA) && is_writable($DATA); $root = realpath((string)($_SERVER['DOCUMENT_ROOT'] ?? '')) ?: ''; $real = realpath($DATA) ?: '';
    $inside = $root !== '' && $real !== '' && strpos($real . '/', rtrim($root, '/') . '/') === 0;
    if ($inside && $writable) { $word = token(6); @file_put_contents("$DATA/probe.txt", $word); $probe = substr($real, strlen(rtrim($root, '/'))) . '/probe.txt'; }
    $t = readJson("$DATA/teacher.json"); $file = (string)($CONFIG['constraint_file'] ?? (__DIR__ . '/constraints/gmq-world.txt'));
    out(['ok' => true, 'version' => VERSION, 'php' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION, 'php_ok' => version_compare(PHP_VERSION, '7.4.0', '>='), 'config' => file_exists(__DIR__ . '/config.php'),
        'data_writable' => $writable, 'data_inside_web' => $inside, 'probe_url' => $probe, 'probe_word' => $probe ? $word : '', 'sessions_ok' => is_dir($SESS) && is_writable($SESS), 'session_hours' => $HOURS,
        'teacher_set' => (bool)($t && !empty($t['password_hash'])), 'setup_ready' => !empty($CONFIG['setup_code']), 'constraint_file' => is_file($file), 'ai' => aiOn() ? (string)$CONFIG['ai']['provider'] : 'off', 'https' => $https]);
}
if ($action === 'join') {
    $code = slug((string)($in['class'] ?? ''), 12); $name = cleanName((string)($in['name'] ?? ''), 16); $pin = (string)($in['pin'] ?? '');
    $class = $code === '' ? null : readJson(classPath($code)); if (!$class) fail('That class code is not known. Ask your teacher.', 404);
    if (strlen($name) < 2) fail('Type your name: letters only, at least 2.');
    if (rude($name, true)) fail('Please use your own name.');
    if (!preg_match('/^[0-9]{4}$/', $pin)) fail('Your secret number has 4 digits.');
    $id = slug($name); $path = studentPath($code, $id); $lg = token();
    $s = withLocks([cadetLock($code, $id)], static function () use ($path, $class, $code, $id, $name, $pin, $lg) {
        $s = readJson($path);
        if (!$s) {
            if (!empty($class['closed'])) fail('This class is not taking new cadets. Ask your teacher.', 403);
            if (count(glob(dirname($path) . '/*.json') ?: []) >= 60) fail('This class is full.', 403);
            $s = ['id' => $id, 'name' => $name, 'pin_hash' => password_hash($pin, PASSWORD_DEFAULT), 'tries' => 0, 'locked_until' => 0, 'created' => date('c'), 'state' => null, 'saved_at' => null, 'rev' => 0,
                'ship' => ['name' => '', 'wants' => '', 'status' => 'none'], 'codes_ok' => [], 'news' => [], 'ledger' => ['gone' => [], 'came' => []], 'deck' => ['open' => false, 'uids' => null]];
            logLine("new cadet $code/$id");
        } else {
            if (($s['locked_until'] ?? 0) > time()) fail('Too many wrong tries. Wait ten minutes, or ask your teacher.', 429);
            if (!password_verify($pin, (string)$s['pin_hash'])) { $s['tries'] = ($s['tries'] ?? 0) + 1; if ($s['tries'] >= MAX_TRIES) { $s['locked_until'] = time() + LOCK_SECONDS; $s['tries'] = 0; logLine("locked $code/$id"); } writeJson($path, $s); fail('That is not the secret number for this name.', 403); }
            $s['tries'] = 0;
        }
        $s['login'] = $lg; $s['login_at'] = date('c');               // this device is now the one that saves; an older one is told the game moved
        writeJson($path, $s); return $s;
    });
    session_regenerate_id(true); $_SESSION = ['class' => $code, 'id' => $id, 'lg' => $lg, 'joined' => time()];
    out(cadetOut($s, $class));
}
if ($action === 'logout') { $_SESSION = []; session_destroy(); out(['ok' => true]); }

/* everything below needs a cadet who is logged in, or the teacher */
if (in_array($action, ['load', 'save', 'claim', 'code', 'name', 'ask', 'board', 'deck', 'rivals', 'battle_start', 'battle_accept', 'battle_cancel', 'battle_end', 'news_seen'], true)) {
    $code = (string)($_SESSION['class'] ?? ''); $id = (string)($_SESSION['id'] ?? ''); needStudent();
    $class = readJson(classPath($code)) ?? ['name' => '']; $path = studentPath($code, $id);

    if ($action === 'load') { $s = needStudent(); out(cadetOut($s, $class, ['newest' => newest($s)])); }

    if ($action === 'claim') {                                     // "Bring my game to this iPad": this log in becomes the one that saves, and takes the newest game
        $s = withLocks([cadetLock($code, $id)], static function () use ($path) { $s = needStudent(); $s['login'] = (string)($_SESSION['lg'] ?? token()); $_SESSION['lg'] = $s['login']; writeJson($path, $s); return $s; });
        out(cadetOut($s, $class, ['newest' => true]));
    }

    if ($action === 'save') {
        $state = $in['state'] ?? null; if (!is_array($state)) fail('Nothing to save.');
        if (strlen(json_encode($state) ?: '') > MAX_STATE_BYTES) fail('That game is too big to save.', 413);
        $hasRev = array_key_exists('rev', $in) && is_int($in['rev']); $caps = is_array($in['caps'] ?? null) ? array_values(array_intersect($in['caps'], ['rev', 'cards'])) : null;
        $res = withLocks([cadetLock($code, $id)], static function () use ($path, $state, $hasRev, $in, $caps) {
            $s = needStudent();
            /* 1. an older iPad: the cadet has logged in somewhere newer since. Its game is not written over the newer one. */
            if (!newest($s)) { if (progress($state) > progress($s['state'])) { backup($s, $state, 'from another iPad, not kept'); writeJson($path, $s); }
                return [409, ['ok' => false, 'moved' => true, 'error' => 'Your game is open on another iPad. Log out and in again to bring it here.']]; }
            /* 2. the server's game changed since this page last had it (the teacher cleared or brought back a game) */
            if ($hasRev && (int)$in['rev'] !== (int)($s['rev'] ?? 0)) return [409, ['ok' => false, 'newer' => true, 'error' => 'There is a newer game on the server.', 'state' => $s['state'], 'rev' => (int)($s['rev'] ?? 0)]];
            if (!$hasRev && !empty($s['reset_at']) && (int)($_SESSION['joined'] ?? 0) < (int)$s['reset_at']) return [409, ['ok' => false, 'newer' => true, 'error' => 'Your Commander changed your game. Log out and in again.']];
            /* 3. keep it */
            $state['ship'] = (string)($s['ship']['name'] ?? '');                         // the ship's name is the server's to give: only an approved name is kept
            if (isset($state['botName']) && rude((string)$state['botName'], true)) $state['botName'] = '';
            [$state, $changed] = applyLedger($s, $state);
            if (progress($state) < progress($s['state'])) backup($s, $s['state'], 'before the game went back');
            $s['state'] = $state; $s['saved_at'] = date('c'); $s['summary'] = summary($state); $s['rev'] = (int)($s['rev'] ?? 0) + 1; $s['caps'] = $caps ?? [];      // what this page can do; an old page says nothing
            writeJson($path, $s);
            return [200, ['ok' => true, 'saved_at' => $s['saved_at'], 'rev' => $s['rev'], 'ship' => $s['ship'], 'news' => array_values($s['news'] ?? [])] + ($changed ? ['cards' => $state['cards']] : [])];
        });
        out($res[1], $res[0]);
    }
    if ($action === 'code') {                                     // a real-life task: the teacher's code is checked here, and is never sent to the page
        $task = (string)($in['task'] ?? ''); $codes = ($class['codes'] ?? []) + DEFAULT_CODES; if (!isset($codes[$task])) fail('That task has no code.');
        $right = withLocks([cadetLock($code, $id)], static function () use ($path, $task, $codes, $in) {
            $s = needStudent(); if (($s['code_lock'] ?? 0) > time()) fail('Too many wrong codes. Go and see your Commander.', 429);
            $right = (string)($in['code'] ?? '') === (string)$codes[$task];
            if ($right) { $s['codes_ok'][$task] = date('c'); $s['code_tries'] = 0; } else { $s['code_tries'] = ($s['code_tries'] ?? 0) + 1; if ($s['code_tries'] >= 8) { $s['code_lock'] = time() + 300; $s['code_tries'] = 0; } }
            writeJson($path, $s); return $right;
        });
        out(['ok' => true, 'right' => $right]);
    }
    if ($action === 'name') {                                     // a new ship name waits for the teacher, unless the class is set to accept names by itself
        $want = cleanName((string)($in['ship'] ?? ''), 12); if ($want === '') fail('Type a name for your ship.');
        if (rude($want, true) || rude((string)($in['ship'] ?? ''), true)) out(['ok' => true, 'status' => 'refused', 'say' => 'The paint will not stick. Pick a kind name.']);
        $s = withLocks([cadetLock($code, $id)], static function () use ($path, $want, $class) {
            $s = needStudent();
            if (($class['names'] ?? 'approve') === 'auto') $s['ship'] = ['name' => $want, 'wants' => '', 'status' => 'ok']; else $s['ship'] = ['name' => (string)($s['ship']['name'] ?? ''), 'wants' => $want, 'status' => 'waiting'];
            writeJson($path, $s); return $s;
        });
        out(['ok' => true, 'status' => $s['ship']['status'], 'ship' => $s['ship']]);
    }
    if ($action === 'news_seen') { withLocks([cadetLock($code, $id)], static function () use ($path) { $s = needStudent(); $s['news'] = []; writeJson($path, $s); }); out(['ok' => true]); }
    if ($action === 'ask') askAI($class);
    require __DIR__ . '/gmq-world-cards.php';                     // the class card board and battles
    cardsAction($action, $in, $code, $id, $class);
}

/* ---------------------------------------------------------------- the AI: how the world answers what nobody planned for */
function aiOn(): bool { global $CONFIG; return !empty($CONFIG['ai']['provider']) && ($CONFIG['ai']['provider'] === 'mock' || !empty($CONFIG['ai']['key'])); }
/* The reply is checked before a child sees it. The AI may describe. It may not give numbers the world did not give it, mark, reward, or run long. */
function checkReply(string $reply, string $slice): array {
    $r = trim(preg_replace('/\s+/', ' ', strip_tags($reply)) ?? ''); $r = trim(preg_replace('/\[[A-Z]+:[^\]]*\]/', '', $r) ?? '');          // tags are for the server, not the child
    if ($r === '') return [false, 'empty'];
    if (strlen($r) > 420) return [false, 'too long'];
    $sentences = preg_split('/(?<=[.!?])\s+/', $r) ?: []; if (count($sentences) > 4) return [false, 'too many sentences'];
    foreach ($sentences as $sn) if (str_word_count($sn) > 16) return [false, 'a sentence is too long'];
    if (preg_match_all('/\d[\d,]*/', $r, $m)) foreach ($m[0] as $n) { $n = str_replace(',', '', $n); if (!preg_match('/(?<![\d,])' . preg_quote($n, '/') . '(?![\d])/', str_replace(',', '', $slice))) return [false, "a number the world did not give: $n"]; }
    if (preg_match('/\b(the answer is|correct|well done|you (earn|win|get) a card|gold card|as an ai|language model)\b/i', $r)) return [false, 'marks, rewards or steps out of the world'];
    if (rude($r)) return [false, 'unkind words'];
    if (preg_match('/[^\x20-\x7E\x{2018}\x{2019}\x{201C}\x{201D}\x{2026}\x{2014}]/u', $r)) return [false, 'odd characters'];
    return [true, $r];
}
function askModel(string $system, string $user): ?string {
    global $CONFIG; $ai = $CONFIG['ai'] ?? [];
    if (($ai['provider'] ?? '') === 'mock') { $f = $ai['mock_file'] ?? ''; return is_string($f) && is_file($f) ? trim((string)file_get_contents($f)) : 'You look around. Nothing answers.'; }
    $ch = curl_init(rtrim((string)($ai['url'] ?? 'https://api.deepseek.com/v1'), '/') . '/chat/completions');        // the same kind of address the Math Skills engine calls
    curl_setopt_array($ch, [CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 20, CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $ai['key']],
        CURLOPT_POSTFIELDS => json_encode(['model' => (string)($ai['model'] ?? 'deepseek-v4-flash'), 'temperature' => 0.7, 'max_tokens' => 160, 'messages' => [['role' => 'system', 'content' => $system], ['role' => 'user', 'content' => $user]]])]);
    $res = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
    if ($res === false || $code !== 200) { logLine("ai http $code"); return null; }
    $d = json_decode((string)$res, true); return is_array($d) ? (string)($d['choices'][0]['message']['content'] ?? '') : null;
}
function askAI(array $class): void {
    global $CONFIG, $in; if (!aiOn()) out(['ok' => true, 'say' => null, 'why' => 'The AI is switched off.']);
    $text = substr(trim((string)($in['text'] ?? '')), 0, 80); $slice = substr(trim((string)($in['slice'] ?? '')), 0, 3000);
    if ($text === '' || $slice === '') fail('Nothing to ask.'); if (rude($text)) out(['ok' => true, 'say' => null, 'why' => 'unkind words']);
    $now = time(); $_SESSION['asks'] = array_values(array_filter($_SESSION['asks'] ?? [], static function ($t) use ($now) { return $t > $now - 60; })); if (count($_SESSION['asks']) >= 12) out(['ok' => true, 'say' => null, 'why' => 'too many questions in one minute']); $_SESSION['asks'][] = $now;
    $who = $_SESSION['class'] . '/' . $_SESSION['id']; session_write_close();                       // the AI can take seconds: this device's saves must not wait for it
    $file = (string)($CONFIG['constraint_file'] ?? (__DIR__ . '/constraints/gmq-world.txt')); $system = is_file($file) ? (string)file_get_contents($file) : ''; if ($system === '') out(['ok' => true, 'say' => null, 'why' => 'The constraint file is missing.']);
    $reply = askModel($system, "MODE: EXPLORE\nWORLD SLICE:\n$slice\n\nTHE CADET TYPES: $text"); if ($reply === null) out(['ok' => true, 'say' => null, 'why' => 'The AI did not answer.']);
    [$good, $r] = checkReply($reply, $slice . ' ' . $text); logLine('ask ' . $who . ' ' . ($good ? 'ok' : "refused: $r"));
    out(['ok' => true, 'say' => $good ? $r : null, 'why' => $good ? null : $r]);
}

/* ---------------------------------------------------------------- the teacher */
function setupTries(string $file, string $word, string $typed): void {     // five wrong setup words lock the door for ten minutes
    $t = readJson($file) ?? []; if (($t['locked_until'] ?? 0) > time()) fail('Too many wrong tries. Wait ten minutes.', 429);
    if (!hash_equals($word, $typed)) { $t['tries'] = ($t['tries'] ?? 0) + 1; if ($t['tries'] >= MAX_TRIES) { $t['locked_until'] = time() + LOCK_SECONDS; $t['tries'] = 0; } writeJson($file, $t); fail('That is not the setup word in config.php.', 403); }
}
if ($action === 't_setup') {                                     // the first time only: the setup word from config.php lets the teacher choose a password, with no command line
    $t = readJson("$DATA/teacher.json"); if ($t && !empty($t['password_hash'])) fail('The teacher password is already set.', 409);
    $word = (string)($CONFIG['setup_code'] ?? ''); if (strlen($word) < 6) fail('First write a setup word (6 letters or more) in api/config.php, on the server.', 503);
    setupTries("$DATA/setup.json", $word, (string)($in['setup_code'] ?? ''));
    $pw = (string)($in['password'] ?? ''); if (strlen($pw) < 8) fail('Choose a teacher password of at least 8 characters.');
    writeJson("$DATA/teacher.json", ['password_hash' => password_hash($pw, PASSWORD_DEFAULT), 'tries' => 0, 'locked_until' => 0, 'set' => date('c')]); @unlink("$DATA/setup.json"); logLine('teacher password set from the Desk');
    session_regenerate_id(true); $_SESSION = ['teacher' => true]; out(['ok' => true, 'ai' => aiOn()]);
}
if ($action === 't_login') {
    $t = readJson("$DATA/teacher.json"); if (!$t || empty($t['password_hash'])) fail('No teacher password is set on the server yet.', 503, ['setup' => true]);
    if (($t['locked_until'] ?? 0) > time()) fail('Too many wrong tries. Wait ten minutes.', 429);
    if (!password_verify((string)($in['password'] ?? ''), (string)$t['password_hash'])) { $t['tries'] = ($t['tries'] ?? 0) + 1; if ($t['tries'] >= MAX_TRIES) { $t['locked_until'] = time() + LOCK_SECONDS; $t['tries'] = 0; } writeJson("$DATA/teacher.json", $t); fail('That is not the teacher password.', 403); }
    $t['tries'] = 0; writeJson("$DATA/teacher.json", $t); session_regenerate_id(true); $_SESSION = ['teacher' => true]; out(['ok' => true, 'ai' => aiOn()]);
}
if (strpos($action, 't_') === 0) {
    if (empty($_SESSION['teacher'])) fail('Teacher log in needed.', 401);
    $code = slug((string)($in['class'] ?? ''), 12);
    if ($action === 't_classes') { $list = []; foreach (glob("$DATA/classes/*.json") ?: [] as $f) { $c = readJson($f); if ($c) $list[] = ['code' => $c['code'], 'name' => $c['name'], 'cadets' => count(glob("$DATA/students/{$c['code']}/*.json") ?: [])]; } out(['ok' => true, 'classes' => $list]); }
    if ($action === 't_new_class') {
        $name = substr(trim(preg_replace('/[^A-Za-z0-9 \-]/', '', (string)($in['name'] ?? '')) ?? ''), 0, 30); if ($name === '') fail('Give the class a name.');
        do { $new = ''; for ($i = 0; $i < 5; $i++) $new .= 'abcdefghjkmnpqrstuvwxyz23456789'[random_int(0, 30)]; } while (is_file(classPath($new)));   // no letters that look like numbers
        writeJson(classPath($new), ['code' => $new, 'name' => $name, 'created' => date('c'), 'codes' => DEFAULT_CODES, 'names' => 'approve', 'closed' => false, 'board' => false, 'battles' => 'off', 'show' => 'ship']); logLine("new class $new"); out(['ok' => true, 'code' => $new, 'name' => $name]);
    }
    $class = readJson(classPath($code)); if (!$class) fail('No such class.', 404);
    if ($action === 't_class') {
        $rows = []; foreach (cadetsOf($code) as $s) $rows[] = ['id' => $s['id'], 'name' => $s['name'], 'saved_at' => $s['saved_at'], 'ship' => $s['ship'], 'codes_ok' => array_keys($s['codes_ok'] ?? []), 'locked' => ($s['locked_until'] ?? 0) > time(),
            'summary' => $s['summary'] ?? null, 'backups' => count($s['backups'] ?? []), 'deck_open' => !empty($s['deck']['open'])];
        usort($rows, static function ($a, $b) { return strcmp($a['name'], $b['name']); });
        out(['ok' => true, 'class' => ['code' => $class['code'], 'name' => $class['name'], 'codes' => ($class['codes'] ?? []) + DEFAULT_CODES, 'names' => $class['names'] ?? 'approve', 'closed' => !empty($class['closed'])] + shareOf($class), 'cadets' => $rows]);
    }
    if ($action === 't_set') {
        withLocks([classLock($code)], static function () use ($code, $in) {
            $class = readJson(classPath($code)) ?? [];
            if (isset($in['codes']) && is_array($in['codes'])) foreach (DEFAULT_CODES as $k => $_) if (isset($in['codes'][$k]) && preg_match('/^[0-9]{3,4}$/', (string)$in['codes'][$k])) $class['codes'][$k] = (int)$in['codes'][$k];
            if (isset($in['names']) && in_array($in['names'], ['approve', 'auto'], true)) $class['names'] = $in['names'];
            if (isset($in['closed'])) $class['closed'] = (bool)$in['closed'];
            if (isset($in['board'])) $class['board'] = (bool)$in['board'];
            if (isset($in['battles']) && in_array($in['battles'], ['off', 'friendly', 'swap', 'away-safe'], true)) $class['battles'] = $in['battles'];
            if (isset($in['show']) && in_array($in['show'], ['ship', 'first'], true)) $class['show'] = $in['show'];
            writeJson(classPath($code), $class);
        });
        out(['ok' => true]);
    }
    if ($action === 't_board' || $action === 't_battles') { require __DIR__ . '/gmq-world-cards.php'; teacherCards($action, $code, $class); }
    $id = slug((string)($in['id'] ?? '')); $path = studentPath($code, $id); if (!is_file($path)) fail('No such cadet.', 404);
    if ($action === 't_name') {
        $s = withLocks([cadetLock($code, $id)], static function () use ($path, $in) { $s = readJson($path); if (!$s) fail('No such cadet.', 404);
            if (!empty($in['ok']) && ($s['ship']['wants'] ?? '') !== '') $s['ship'] = ['name' => $s['ship']['wants'], 'wants' => '', 'status' => 'ok']; else $s['ship'] = ['name' => (string)($s['ship']['name'] ?? ''), 'wants' => '', 'status' => 'refused'];
            if (is_array($s['state'])) $s['state']['ship'] = $s['ship']['name']; writeJson($path, $s); return $s; });
        out(['ok' => true, 'ship' => $s['ship']]);
    }
    if ($action === 't_backups') { $s = readJson($path) ?? []; $list = []; foreach ($s['backups'] ?? [] as $i => $b) $list[] = ['n' => $i, 'at' => $b['at'], 'why' => $b['why'], 'summary' => $b['summary']]; out(['ok' => true, 'now' => $s['summary'] ?? null, 'backups' => $list]); }
    if ($action === 't_reset' || $action === 't_restore') {
        $what = $action === 't_restore' ? 'restore' : (string)($in['what'] ?? '');
        if ($what === 'remove') { withLocks([cadetLock($code, $id)], static function () use ($path) { @unlink($path); }); logLine("removed $code/$id"); out(['ok' => true]); }
        if (!in_array($what, ['number', 'game', 'restore'], true)) fail('Reset what?');
        withLocks([cadetLock($code, $id)], static function () use ($path, $what, $in) {
            $s = readJson($path); if (!$s) fail('No such cadet.', 404);
            if ($what === 'number') { $new = (string)($in['pin'] ?? ''); if (!preg_match('/^[0-9]{4}$/', $new)) fail('The new secret number needs 4 digits.'); $s['pin_hash'] = password_hash($new, PASSWORD_DEFAULT); $s['tries'] = 0; $s['locked_until'] = 0; }
            else {
                $take = null;
                if ($what === 'restore') { $n = (int)($in['n'] ?? -1); $b = $s['backups'] ?? []; if (!isset($b[$n])) fail('No such copy.', 404); $take = $b[$n]['state']; array_splice($b, $n, 1); $s['backups'] = $b; }
                backup($s, $s['state'], $what === 'restore' ? 'before you brought back an older copy' : 'before you cleared it');
                $s['state'] = $take; $s['saved_at'] = $take ? date('c') : null; $s['summary'] = summary($take); if ($what === 'game') $s['codes_ok'] = [];
                $s['rev'] = (int)($s['rev'] ?? 0) + 1; $s['reset_at'] = time();       // an iPad that still shows the old game cannot save it over this one
            }
            writeJson($path, $s);
        });
        logLine("reset $what $code/$id"); out(['ok' => true]);
    }
}
fail('Unknown action.', 404);
