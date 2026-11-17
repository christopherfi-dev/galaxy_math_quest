<?php
/* =====================================================================
   GALAXY MATH QUEST - WORLD SERVER v0.1   (a first version, by Claude, for Marc to try)

   What it does
     - remembers each cadet: a class code, a name and a 4-digit number open their own saved game on any device
     - keeps the teacher's codes for the real-life tasks on the server, not in the page
     - holds a new ship name until the teacher approves it
     - gives the teacher a view of the whole class
     - can pass what a cadet types to the AI, inside the constraint file, and checks the reply before a child sees it

   What it does not do yet
     - mark the maths. The page still does that. Moving the checks here is the next big step.

   It is built like the Math Skills engine: PHP, flat JSON files, a session, and the AI key in api/config.php,
   which stays on the server and is never copied anywhere.

   One address, POST, JSON in and JSON out:  { "action": "...", ... }
   ===================================================================== */
declare(strict_types=1);
error_reporting(E_ALL); ini_set('display_errors', '0');

$CONFIG = file_exists(__DIR__ . '/config.php') ? (require __DIR__ . '/config.php') : [];
$DATA = rtrim((string)($CONFIG['data_dir'] ?? (__DIR__ . '/data')), '/');
const MAX_STATE_BYTES = 300000;
const MAX_TRIES = 5;            // wrong numbers before a cadet is locked out for a while (the Math Skills engine uses 5 too)
const LOCK_SECONDS = 600;
const DEFAULT_CODES = ['calib' => 805, 'starmap' => 314, 'target' => 936, 'alloc' => 446, 'choice' => 728];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if (!empty($CONFIG['allow_origin'])) {                      // only needed when the page is served from another site
    header('Access-Control-Allow-Origin: ' . $CONFIG['allow_origin']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { exit; }
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { out(['ok' => false, 'error' => 'Use POST.'], 405); }

session_name('gmqworld');
session_start(['cookie_httponly' => true, 'cookie_samesite' => 'Lax']);

$raw = file_get_contents('php://input') ?: '';
if (strlen($raw) > MAX_STATE_BYTES + 20000) { out(['ok' => false, 'error' => 'Too big.'], 413); }
$in = json_decode($raw, true);
if (!is_array($in)) { out(['ok' => false, 'error' => 'Send JSON.'], 400); }
$action = (string)($in['action'] ?? '');

/* ---------------------------------------------------------------- small tools */
function out(array $a, int $code = 200): void { http_response_code($code); echo json_encode($a, JSON_UNESCAPED_UNICODE); exit; }
function fail(string $msg, int $code = 400): void { out(['ok' => false, 'error' => $msg], $code); }
function slug(string $s, int $max = 24): string { return substr(preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($s))) ?? '', 0, $max); }
function readJson(string $path): ?array { if (!is_file($path)) return null; $t = file_get_contents($path); $d = json_decode($t === false ? '' : $t, true); return is_array($d) ? $d : null; }
function writeJson(string $path, array $d): void { $dir = dirname($path); if (!is_dir($dir)) mkdir($dir, 0770, true); if (file_put_contents($path, json_encode($d, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) fail('The server could not save.', 500); }
function classPath(string $code): string { global $DATA; return "$DATA/classes/" . slug($code, 12) . '.json'; }
function studentPath(string $code, string $id): string { global $DATA; return "$DATA/students/" . slug($code, 12) . '/' . slug($id, 24) . '.json'; }
function needStudent(): array { if (empty($_SESSION['class']) || empty($_SESSION['id'])) fail('Please log in.', 401); $s = readJson(studentPath($_SESSION['class'], $_SESSION['id'])); if (!$s) fail('Please log in.', 401); return $s; }
function needTeacher(): void { if (empty($_SESSION['teacher'])) fail('Teacher log in needed.', 401); }
function logLine(string $what): void { global $DATA; @mkdir("$DATA/logs", 0770, true); @file_put_contents("$DATA/logs/" . date('Y-m') . '.log', date('c') . ' ' . $what . "\n", FILE_APPEND | LOCK_EX); }

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

/* What the teacher's class view shows for one cadet. Worked out from the saved game, so the page cannot simply claim it. */
function summary(array $state): array {
    $done = is_array($state['done'] ?? null) ? count(array_filter($state['done'])) : 0;
    $v = is_array($state['v'] ?? null) ? $state['v'] : null; $hist = $v && is_array($v['hist'] ?? null) ? $v['hist'] : []; $last = $hist ? end($hist) : null;
    $ending = null;
    if (is_array($last)) { $p = ($last['mood'] ?? 0) >= 600; $e = ($last['actual'] ?? 0) >= 1650; $ending = $p && $e ? 'Voltara shines' : ($p ? 'Happy, but short of power' : ($e ? 'Power, but not happy' : 'Worse off')); }
    $t = is_array($state['trade'] ?? null) ? $state['trade'] : null;
    return ['where' => (string)($state['mode'] ?? ''), 'room' => (string)($state['room'] ?? ''), 'tasks' => min(15, $done), 'parts' => is_array($state['parts'] ?? null) ? min(5, count($state['parts'])) : 0,
        'cards' => is_array($state['cards'] ?? null) ? count($state['cards']) : 0, 'secrets' => is_array($state['secrets'] ?? null) ? count($state['secrets']) : 0,
        'voltara_day' => $v ? (int)($v['day'] ?? 0) : 0, 'voltara' => $ending, 'gems' => $t ? (int)($t['gems'] ?? 0) : 0, 'trade_best' => $t ? (int)($t['best'] ?? 0) : 0];
}

/* ---------------------------------------------------------------- the cadet */
if ($action === 'join') {
    $code = slug((string)($in['class'] ?? ''), 12); $name = cleanName((string)($in['name'] ?? ''), 16); $pin = (string)($in['pin'] ?? '');
    $class = readJson(classPath($code)); if ($code === '' || !$class) fail('That class code is not known. Ask your teacher.', 404);
    if (strlen($name) < 2) fail('Type your name: letters only, at least 2.');
    if (rude($name, true)) fail('Please use your own name.');
    if (!preg_match('/^[0-9]{4}$/', $pin)) fail('Your secret number has 4 digits.');
    $id = slug($name); $path = studentPath($code, $id); $s = readJson($path);
    if (!$s) {
        if (!empty($class['closed'])) fail('This class is not taking new cadets. Ask your teacher.', 403);
        if (count(glob(dirname($path) . '/*.json') ?: []) >= 60) fail('This class is full.', 403);
        $s = ['id' => $id, 'name' => $name, 'pin_hash' => password_hash($pin, PASSWORD_DEFAULT), 'tries' => 0, 'locked_until' => 0, 'created' => date('c'), 'state' => null, 'saved_at' => null, 'ship' => ['name' => '', 'wants' => '', 'status' => 'none'], 'codes_ok' => []];
        writeJson($path, $s); logLine("new cadet $code/$id");
    } else {
        if (($s['locked_until'] ?? 0) > time()) fail('Too many wrong tries. Wait ten minutes, or ask your teacher.', 429);
        if (!password_verify($pin, (string)$s['pin_hash'])) { $s['tries'] = ($s['tries'] ?? 0) + 1; if ($s['tries'] >= MAX_TRIES) { $s['locked_until'] = time() + LOCK_SECONDS; $s['tries'] = 0; logLine("locked $code/$id"); } writeJson($path, $s); fail('That is not the secret number for this name.', 403); }
        if (!empty($s['tries'])) { $s['tries'] = 0; writeJson($path, $s); }
    }
    session_regenerate_id(true); $_SESSION = ['class' => $code, 'id' => $id];
    out(['ok' => true, 'name' => $s['name'], 'class' => $class['name'], 'state' => $s['state'], 'saved_at' => $s['saved_at'], 'ship' => $s['ship'], 'ai' => aiOn(), 'names' => $class['names'] ?? 'approve']);
}
if ($action === 'load') { $s = needStudent(); out(['ok' => true, 'name' => $s['name'], 'state' => $s['state'], 'saved_at' => $s['saved_at'], 'ship' => $s['ship'], 'ai' => aiOn()]); }
if ($action === 'save') {
    $s = needStudent(); $state = $in['state'] ?? null; if (!is_array($state)) fail('Nothing to save.');
    if (strlen(json_encode($state) ?: '') > MAX_STATE_BYTES) fail('That game is too big to save.', 413);
    $state['ship'] = (string)($s['ship']['name'] ?? '');                       // the ship's name is the server's to give: only an approved name is kept
    if (isset($state['botName']) && rude((string)$state['botName'], true)) $state['botName'] = '';
    $s['state'] = $state; $s['saved_at'] = date('c'); $s['summary'] = summary($state);
    writeJson(studentPath($_SESSION['class'], $_SESSION['id']), $s); out(['ok' => true, 'saved_at' => $s['saved_at'], 'ship' => $s['ship']]);
}
if ($action === 'code') {                                                         // a real-life task: the teacher's code is checked here, and is never sent to the page
    $s = needStudent(); $task = (string)($in['task'] ?? ''); $class = readJson(classPath($_SESSION['class'])) ?? []; $codes = ($class['codes'] ?? []) + DEFAULT_CODES;
    if (!isset($codes[$task])) fail('That task has no code.');
    if (($s['code_lock'] ?? 0) > time()) fail('Too many wrong codes. Go and see your Commander.', 429);
    $right = (string)($in['code'] ?? '') === (string)$codes[$task];
    if ($right) { $s['codes_ok'][$task] = date('c'); $s['code_tries'] = 0; } else { $s['code_tries'] = ($s['code_tries'] ?? 0) + 1; if ($s['code_tries'] >= 8) { $s['code_lock'] = time() + 300; $s['code_tries'] = 0; } }
    writeJson(studentPath($_SESSION['class'], $_SESSION['id']), $s); out(['ok' => true, 'right' => $right]);
}
if ($action === 'name') {                                                         // a new ship name waits for the teacher, unless the class is set to accept names by itself
    $s = needStudent(); $want = cleanName((string)($in['ship'] ?? ''), 12); if ($want === '') fail('Type a name for your ship.');
    if (rude($want, true) || rude((string)($in['ship'] ?? ''), true)) out(['ok' => true, 'status' => 'refused', 'say' => 'The paint will not stick. Pick a kind name.']);
    $class = readJson(classPath($_SESSION['class'])) ?? [];
    if (($class['names'] ?? 'approve') === 'auto') $s['ship'] = ['name' => $want, 'wants' => '', 'status' => 'ok']; else $s['ship'] = ['name' => (string)($s['ship']['name'] ?? ''), 'wants' => $want, 'status' => 'waiting'];
    writeJson(studentPath($_SESSION['class'], $_SESSION['id']), $s); out(['ok' => true, 'status' => $s['ship']['status'], 'ship' => $s['ship']]);
}
if ($action === 'logout') { $_SESSION = []; session_destroy(); out(['ok' => true]); }

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
if ($action === 'ask') {
    $s = needStudent(); if (!aiOn()) out(['ok' => true, 'say' => null, 'why' => 'The AI is switched off.']);
    $text = substr(trim((string)($in['text'] ?? '')), 0, 80); $slice = substr(trim((string)($in['slice'] ?? '')), 0, 3000);
    if ($text === '' || $slice === '') fail('Nothing to ask.'); if (rude($text)) out(['ok' => true, 'say' => null, 'why' => 'unkind words']);
    $now = time(); $_SESSION['asks'] = array_values(array_filter($_SESSION['asks'] ?? [], static fn($t) => $t > $now - 60)); if (count($_SESSION['asks']) >= 12) out(['ok' => true, 'say' => null, 'why' => 'too many questions in one minute']); $_SESSION['asks'][] = $now;
    $file = (string)($CONFIG['constraint_file'] ?? (__DIR__ . '/constraints/gmq-world.txt')); $system = is_file($file) ? (string)file_get_contents($file) : ''; if ($system === '') out(['ok' => true, 'say' => null, 'why' => 'The constraint file is missing.']);
    $reply = askModel($system, "MODE: EXPLORE\nWORLD SLICE:\n$slice\n\nTHE CADET TYPES: $text"); if ($reply === null) out(['ok' => true, 'say' => null, 'why' => 'The AI did not answer.']);
    [$good, $r] = checkReply($reply, $slice . ' ' . $text); logLine('ask ' . $_SESSION['class'] . '/' . $_SESSION['id'] . ' ' . ($good ? 'ok' : "refused: $r"));
    out(['ok' => true, 'say' => $good ? $r : null, 'why' => $good ? null : $r]);
}

/* ---------------------------------------------------------------- the teacher */
if ($action === 't_login') {
    $t = readJson("$DATA/teacher.json"); if (!$t || empty($t['password_hash'])) fail('No teacher password is set on the server yet. Run tools/set-teacher-password.php.', 503);
    if (($t['locked_until'] ?? 0) > time()) fail('Too many wrong tries. Wait ten minutes.', 429);
    if (!password_verify((string)($in['password'] ?? ''), (string)$t['password_hash'])) { $t['tries'] = ($t['tries'] ?? 0) + 1; if ($t['tries'] >= MAX_TRIES) { $t['locked_until'] = time() + LOCK_SECONDS; $t['tries'] = 0; } writeJson("$DATA/teacher.json", $t); fail('That is not the teacher password.', 403); }
    $t['tries'] = 0; writeJson("$DATA/teacher.json", $t); session_regenerate_id(true); $_SESSION = ['teacher' => true]; out(['ok' => true, 'ai' => aiOn()]);
}
if (strpos($action, 't_') === 0) {
    needTeacher(); $code = slug((string)($in['class'] ?? ''), 12);
    if ($action === 't_classes') { $list = []; foreach (glob("$DATA/classes/*.json") ?: [] as $f) { $c = readJson($f); if ($c) $list[] = ['code' => $c['code'], 'name' => $c['name'], 'cadets' => count(glob("$DATA/students/{$c['code']}/*.json") ?: [])]; } out(['ok' => true, 'classes' => $list]); }
    if ($action === 't_new_class') {
        $name = substr(trim(preg_replace('/[^A-Za-z0-9 \-]/', '', (string)($in['name'] ?? '')) ?? ''), 0, 30); if ($name === '') fail('Give the class a name.');
        do { $new = ''; for ($i = 0; $i < 5; $i++) $new .= 'abcdefghjkmnpqrstuvwxyz23456789'[random_int(0, 30)]; } while (is_file(classPath($new)));   // no letters that look like numbers
        writeJson(classPath($new), ['code' => $new, 'name' => $name, 'created' => date('c'), 'codes' => DEFAULT_CODES, 'names' => 'approve', 'closed' => false]); logLine("new class $new"); out(['ok' => true, 'code' => $new, 'name' => $name]);
    }
    $class = readJson(classPath($code)); if (!$class) fail('No such class.', 404);
    if ($action === 't_class') {
        $rows = []; foreach (glob("$DATA/students/$code/*.json") ?: [] as $f) { $s = readJson($f); if ($s) $rows[] = ['id' => $s['id'], 'name' => $s['name'], 'saved_at' => $s['saved_at'], 'ship' => $s['ship'], 'codes_ok' => array_keys($s['codes_ok'] ?? []), 'locked' => ($s['locked_until'] ?? 0) > time(), 'summary' => $s['summary'] ?? null]; }
        usort($rows, static fn($a, $b) => strcmp($a['name'], $b['name'])); out(['ok' => true, 'class' => ['code' => $class['code'], 'name' => $class['name'], 'codes' => ($class['codes'] ?? []) + DEFAULT_CODES, 'names' => $class['names'] ?? 'approve', 'closed' => !empty($class['closed'])], 'cadets' => $rows]);
    }
    if ($action === 't_set') {
        if (isset($in['codes']) && is_array($in['codes'])) foreach (DEFAULT_CODES as $k => $_) if (isset($in['codes'][$k]) && preg_match('/^[0-9]{3,4}$/', (string)$in['codes'][$k])) $class['codes'][$k] = (int)$in['codes'][$k];
        if (isset($in['names']) && in_array($in['names'], ['approve', 'auto'], true)) $class['names'] = $in['names'];
        if (isset($in['closed'])) $class['closed'] = (bool)$in['closed'];
        writeJson(classPath($code), $class); out(['ok' => true]);
    }
    $id = slug((string)($in['id'] ?? '')); $s = readJson(studentPath($code, $id)); if (!$s) fail('No such cadet.', 404);
    if ($action === 't_name') { if (!empty($in['ok']) && ($s['ship']['wants'] ?? '') !== '') $s['ship'] = ['name' => $s['ship']['wants'], 'wants' => '', 'status' => 'ok']; else $s['ship'] = ['name' => (string)($s['ship']['name'] ?? ''), 'wants' => '', 'status' => 'refused']; if (is_array($s['state'])) $s['state']['ship'] = $s['ship']['name']; writeJson(studentPath($code, $id), $s); out(['ok' => true, 'ship' => $s['ship']]); }
    if ($action === 't_reset') {
        $what = (string)($in['what'] ?? '');
        if ($what === 'number') { $new = (string)($in['pin'] ?? ''); if (!preg_match('/^[0-9]{4}$/', $new)) fail('The new secret number needs 4 digits.'); $s['pin_hash'] = password_hash($new, PASSWORD_DEFAULT); $s['tries'] = 0; $s['locked_until'] = 0; }
        elseif ($what === 'game') { $s['state'] = null; $s['saved_at'] = null; $s['summary'] = null; $s['codes_ok'] = []; }
        elseif ($what === 'remove') { @unlink(studentPath($code, $id)); logLine("removed $code/$id"); out(['ok' => true]); }
        else fail('Reset what?');
        writeJson(studentPath($code, $id), $s); logLine("reset $what $code/$id"); out(['ok' => true]);
    }
}
fail('Unknown action.', 404);
