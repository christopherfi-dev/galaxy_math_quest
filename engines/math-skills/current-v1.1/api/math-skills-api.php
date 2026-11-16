<?php
// math-skills-api.php v1.1 — Forked from api.php v4.2
// Math Skills Engine only. No room system, no history verification, no web search.
// Place in /educational-engines/api/
//
// v1.0: Fork. 8-band/6-domain gates, INJECT_SKILLS filename loading, deepseek-v4-flash
// v1.1: Session auth (set in math_verify/math_create, checked in initialize/math_save)
//       CORS locked to constraintlayer.ai; rate-limited math_verify (5 attempts)
//       Last-match ANSWER extraction; skip extraction on truncated responses
//       CHECK verification: server computes [CHECK:expr] and overrides a wrong LLM answer
//       Constraint reminder every 5 turns with server question count
//       Strengthened SYSTEM NOTE when ANSWER tag is missing
//       Gate reselection clears loaded skills; explicit SYSTEM NOTE when a skill file is missing/empty
//       normalizeAnswer: thousands separators (1,000), currency ($), percent (%) handled correctly
//       Session report parser handles SELF-CORRECTED and both " - " and " — " delimiters

// Session configuration
$sessionPath = __DIR__ . '/sessions';
if (!is_dir($sessionPath)) {
    @mkdir($sessionPath, 0700, true);
}
session_save_path($sessionPath);
ini_set('session.gc_maxlifetime', 14400);
ini_set('session.cookie_lifetime', 14400);
session_start();
set_time_limit(0);

header('Access-Control-Allow-Origin: https://constraintlayer.ai');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Load API key
$configFile = __DIR__ . '/config.php';
if (file_exists($configFile)) {
    require_once $configFile;
    $DEEPSEEK_API_KEY = defined('DEEPSEEK_API_KEY') ? DEEPSEEK_API_KEY : null;
} else {
    $DEEPSEEK_API_KEY = getenv('DEEPSEEK_API_KEY');
}

if (!$DEEPSEEK_API_KEY) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'API configuration missing']);
    exit;
}

// Input validation
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid input']);
    exit;
}

$action = $input['action'] ?? 'continue';
$sessionId = $input['session_id'] ?? null;

if (!$sessionId) {
    $sessionId = uniqid('session_', true);
}

$sessionKey = session_id() . '_mathskills_' . $sessionId;

// Math student storage
$mathStudentsDir = __DIR__ . '/math-students';
if (!is_dir($mathStudentsDir)) {
    @mkdir($mathStudentsDir, 0755, true);
}

// ============================================================
// ANSWER VERIFICATION FUNCTIONS
// ============================================================

function normalizeAnswer($input) {
    $input = trim(strtolower($input));
    
    // Strip LaTeX fraction formatting
    $input = preg_replace('/\\\\frac\{([^}]+)\}\{([^}]+)\}/', '$1/$2', $input);
    $input = str_replace(['\\(', '\\)', '\\[', '\\]'], '', $input);
    
    // Strip currency and percent symbols and words
    $input = str_replace(['$', '%'], '', $input);
    $input = preg_replace('/\b(percent|dollars?)\b/', '', $input);
    $input = trim(preg_replace('/\s+/', ' ', $input));
    
    // Thousands separators: 1,000 / 12,345,678 / 1,234.5
    if (preg_match('/^-?\d{1,3}(,\d{3})+(\.\d+)?$/', $input)) {
        $input = str_replace(',', '', $input);
    }
    // Decimal comma only when 1-2 digits follow: 3,5 / 3,75
    elseif (preg_match('/^-?\d+,\d{1,2}$/', $input)) {
        $input = str_replace(',', '.', $input);
    }
    
    // Fractions: "19 / 28" -> "19/28"
    $input = preg_replace('/\s*\/\s*/', '/', $input);
    
    // Leading decimal: ".5" -> "0.5"
    if (strpos($input, '.') === 0) {
        $input = '0' . $input;
    }
    
    return $input;
}

function answersMatch($expected, $student) {
    $expected = normalizeAnswer($expected);
    $student = normalizeAnswer($student);
    
    if ($expected === $student) return true;
    
    $eVal = toDecimal($expected);
    $sVal = toDecimal($student);
    
    if ($eVal !== null && $sVal !== null) {
        return abs($eVal - $sVal) < 0.0001;
    }
    
    // Fuzzy matching for word answers (shape names, math terms)
    if ($eVal === null && $sVal === null && strlen($expected) > 2 && strlen($student) > 2) {
        $distance = levenshtein($expected, $student);
        if ($distance <= 2) return true;
    }
    
    return false;
}

function toDecimal($input) {
    $input = trim($input);
    
    if (is_numeric($input)) {
        return floatval($input);
    }
    
    // Simple fraction: 3/4
    if (preg_match('/^(-?\d+)\s*\/\s*(\d+)$/', $input, $m)) {
        if (floatval($m[2]) == 0) return null;
        return floatval($m[1]) / floatval($m[2]);
    }
    
    // Mixed number: "2 1/3"
    if (preg_match('/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/', $input, $m)) {
        if (floatval($m[3]) == 0) return null;
        $whole = floatval($m[1]);
        $frac = floatval($m[2]) / floatval($m[3]);
        return $whole >= 0 ? $whole + $frac : $whole - $frac;
    }
    
    return null;
}

// Safe arithmetic expression evaluator — no eval(), whitelist-validated
// Handles + - * / and parentheses. Returns float result or null if invalid.
function evalMathExpression($expr) {
    // Whitelist: digits, operators, parens, decimal, spaces only
    if (!preg_match('/^[0-9+\-*\/().\s]+$/', $expr)) return null;
    $expr = preg_replace('/\s+/', '', $expr);
    if ($expr === '') return null;
    
    // Tokenize: split on operators and parens, keeping them
    $tokens = preg_split('/(?<=[-+*\/()])|(?=[-+*\/()])/', $expr, -1, PREG_SPLIT_NO_EMPTY);
    
    // Shunting-yard: infix to RPN
    $output = [];
    $ops = [];
    $prec = ['+' => 1, '-' => 1, '*' => 2, '/' => 2];
    foreach ($tokens as $t) {
        if (is_numeric($t)) {
            $output[] = floatval($t);
        } elseif (isset($prec[$t])) {
            while (!empty($ops) && end($ops) !== '('
                && isset($prec[end($ops)]) && $prec[end($ops)] >= $prec[$t]) {
                $output[] = array_pop($ops);
            }
            $ops[] = $t;
        } elseif ($t === '(') {
            $ops[] = $t;
        } elseif ($t === ')') {
            while (!empty($ops) && end($ops) !== '(') {
                $output[] = array_pop($ops);
            }
            if (empty($ops)) return null;
            array_pop($ops);
        } else {
            return null;
        }
    }
    while (!empty($ops)) {
        $op = array_pop($ops);
        if ($op === '(' || $op === ')') return null;
        $output[] = $op;
    }
    
    // Evaluate RPN
    $stack = [];
    foreach ($output as $token) {
        if (is_float($token)) {
            $stack[] = $token;
        } else {
            if (count($stack) < 2) return null;
            $b = array_pop($stack);
            $a = array_pop($stack);
            switch ($token) {
                case '+': $stack[] = $a + $b; break;
                case '-': $stack[] = $a - $b; break;
                case '*': $stack[] = $a * $b; break;
                case '/':
                    if ($b == 0) return null;
                    $stack[] = $a / $b;
                    break;
            }
        }
    }
    if (count($stack) !== 1) return null;
    return $stack[0];
}

// ============================================================
// BAND AND DOMAIN MAPPINGS
// ============================================================

$BAND_MAP = [
    1 => '161-170',
    2 => '171-180',
    3 => '181-190',
    4 => '191-200',
    5 => '201-210',
    6 => '211-220',
    7 => '221-230',
    8 => '231-240'
];

$DOMAIN_MAP = [
    1 => 'AlgebraicConcepts',
    2 => 'NumberSense',
    3 => 'Computation',
    4 => 'Measurement',
    5 => 'Geometry',
    6 => 'Data'
];

// ============================================================
// ACTION: INITIALIZE
// ============================================================

if ($action === 'initialize') {
    $constraintFile = __DIR__ . '/constraints/math-skills.txt';
    
    if (!file_exists($constraintFile)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Engine configuration not found']);
        exit;
    }
    
    $systemPrompt = file_get_contents($constraintFile);
    
    if (empty($systemPrompt)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Engine configuration empty']);
        exit;
    }
    
    // Load Solon constraint discipline
    $solonFile = __DIR__ . '/constraints/solon.txt';
    if (file_exists($solonFile)) {
        $solonBootstrap = file_get_contents($solonFile);
        if (!empty($solonBootstrap)) {
            $systemPrompt = $solonBootstrap . "\n\n---\n\n" . $systemPrompt;
        }
    }
    
    // Inject student's previous progress if student param provided
    $studentName = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['student'] ?? '');
    if (!empty($studentName)) {
        // Require authentication before loading student data
        if (($_SESSION['math_authenticated_student'] ?? '') !== $studentName) {
            http_response_code(403);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Not authenticated. Please log in.']);
            exit;
        }
        $studentFile = $mathStudentsDir . '/' . $studentName . '.json';
        if (file_exists($studentFile)) {
            $studentData = json_decode(file_get_contents($studentFile), true);
            if ($studentData && !empty($studentData['skills'])) {
                $progressBlock = "\n\n---\n\nSTUDENT PREVIOUS PROGRESS (loaded from server):\n\n";
                
                $passed = [];
                $selfCorrected = [];
                $remediated = [];
                $failed = [];
                foreach ($studentData['skills'] as $skill => $status) {
                    if ($status === 'PASSED') $passed[] = $skill;
                    elseif ($status === 'SELF-CORRECTED') $selfCorrected[] = $skill;
                    elseif ($status === 'REMEDIATED') $remediated[] = $skill;
                    elseif ($status === 'FAILED-FOUNDATIONAL') $failed[] = $skill;
                }
                
                if (!empty($passed)) {
                    $progressBlock .= "Previously PASSED (" . count($passed) . " skills):\n";
                    foreach ($passed as $s) { $progressBlock .= "- " . $s . "\n"; }
                    $progressBlock .= "\n";
                }
                if (!empty($selfCorrected)) {
                    $progressBlock .= "Previously SELF-CORRECTED (" . count($selfCorrected) . " skills) — re-probe these:\n";
                    foreach ($selfCorrected as $s) { $progressBlock .= "- " . $s . "\n"; }
                    $progressBlock .= "\n";
                }
                if (!empty($remediated)) {
                    $progressBlock .= "Previously REMEDIATED (" . count($remediated) . " skills):\n";
                    foreach ($remediated as $s) { $progressBlock .= "- " . $s . "\n"; }
                    $progressBlock .= "\n";
                }
                if (!empty($failed)) {
                    $progressBlock .= "Previously FAILED-FOUNDATIONAL (" . count($failed) . " skills):\n";
                    foreach ($failed as $s) { $progressBlock .= "- " . $s . "\n"; }
                    $progressBlock .= "\n";
                }
                
                $progressBlock .= "Do not re-test PASSED or REMEDIATED skills unless the student requests review. "
                    . "Re-probe SELF-CORRECTED skills (one question each — if correct, upgrade to PASSED; if wrong, enter TEACH). "
                    . "Focus on untested skills. "
                    . "FAILED-FOUNDATIONAL skills may be re-attempted if the student has moved to a lower RIT band.";
                
                $systemPrompt .= $progressBlock;
            }
        }
        $_SESSION[$sessionKey . '_student'] = $studentName;
    }
    
    // Initialize conversation
    $initMessage = 'Session seed: ' . rand(1000, 9999) . '. Every question must end with [ANSWER:X] tag. Begin.';
    
    $_SESSION[$sessionKey] = [
        ['role' => 'system', 'content' => $systemPrompt],
        ['role' => 'user', 'content' => $initMessage]
    ];
    
    $messages = $_SESSION[$sessionKey];

// ============================================================
// ACTION: CONTINUE
// ============================================================

} elseif ($action === 'continue') {
    if (!isset($_SESSION[$sessionKey])) {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Session expired. Please restart.']);
        exit;
    }
    
    $messages = $_SESSION[$sessionKey];
    if (!isset($input['message']) || $input['message'] === '') {
        http_response_code(400);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'No message provided']);
        exit;
    }
    
    $userMessage = $input['message'];
    $messages[] = ['role' => 'user', 'content' => $userMessage];
    
    // --------------------------------------------------------
    // SERVER-SIDE ANSWER VERIFICATION
    // --------------------------------------------------------
    
    $expectedAnswerKey = $sessionKey . '_expected_answer';
    if (isset($_SESSION[$expectedAnswerKey])) {
        $expectedAnswer = $_SESSION[$expectedAnswerKey];
        $studentInput = trim($userMessage);
        
        $systemCommands = ['yes', 'no', 'end', 'finish', 'skip', 'idk', 'why'];
        $isDebugPhrase = (stripos($studentInput, 'solon is the architect') !== false);
        $isSessionPaste = (stripos($studentInput, 'SESSION REPORT') !== false);
        $isDebugCommand = (stripos($studentInput, 'debug') !== false);
        $isEndDebug = (stripos($studentInput, 'end debug') !== false);
        
        if (!in_array(strtolower($studentInput), $systemCommands)
            && !$isDebugPhrase && !$isSessionPaste && !$isDebugCommand && !$isEndDebug) {
            
            if (answersMatch($expectedAnswer, $studentInput)) {
                $messages[count($messages) - 1]['content'] = $studentInput
                    . "\n[SYSTEM VERIFICATION: Pre-computed answer is " . $expectedAnswer
                    . ". Student answered " . $studentInput
                    . ". MATCH = CORRECT. Respond with brief confirmation and present next question from your plan.]";
            } else {
                $messages[count($messages) - 1]['content'] = $studentInput
                    . "\n[SYSTEM VERIFICATION: Pre-computed answer is " . $expectedAnswer
                    . ". Student answered " . $studentInput
                    . ". NO MATCH = INCORRECT. If in ASSESS mode, enter PROBE. If in PROBE or TEACH, handle per protocol.]";
            }
        }
        
        unset($_SESSION[$expectedAnswerKey]);
        
    } else {
        // No stored answer — inject SYSTEM NOTE only if a math question was asked
        $lastAssistantMsg = '';
        for ($i = count($messages) - 2; $i >= 0; $i--) {
            if ($messages[$i]['role'] === 'assistant') {
                $lastAssistantMsg = $messages[$i]['content'];
                break;
            }
        }
        
        if (preg_match('/=\s*$/', $lastAssistantMsg)) {
            $studentInput = trim($userMessage);
            $systemCommands = ['yes', 'no', 'end', 'finish', 'skip', 'idk', 'why'];
            $isDebugPhrase = (stripos($studentInput, 'solon is the architect') !== false);
            $isSessionPaste = (stripos($studentInput, 'SESSION REPORT') !== false);
            $isDebugCommand = (stripos($studentInput, 'debug') !== false);
            $isEndDebug = (stripos($studentInput, 'end debug') !== false);
            
            if (!in_array(strtolower($studentInput), $systemCommands)
                && !$isDebugPhrase && !$isSessionPaste && !$isDebugCommand && !$isEndDebug) {
                $messages[count($messages) - 1]['content'] = $studentInput
                    . "\n[SYSTEM NOTE: No pre-computed answer was stored for this question. "
                    . "Your previous response was MISSING the [ANSWER:X] tag — this is a constraint violation. "
                    . "Server verification unavailable. Compute the correct answer silently. "
                    . "Compare to the student's answer. If correct, respond with brief confirmation "
                    . "then present the next question. If incorrect, handle per current mode protocol. "
                    . "CRITICAL: Your next response MUST end with = followed by [ANSWER:X]. "
                    . "The = symbol must NEVER appear without [ANSWER:X] immediately after it.]";
            }
        }
    }
    
    // --------------------------------------------------------
    // CONSTRAINT DRIFT PREVENTION
    // Re-inject condensed constraints every 5 turns
    // --------------------------------------------------------
    
    $turnKey = $sessionKey . '_turn_count';
    $_SESSION[$turnKey] = ($_SESSION[$turnKey] ?? 0) + 1;
    $turnCount = $_SESSION[$turnKey];
    
    if ($turnCount % 5 === 0) {
        $messages[count($messages) - 1]['content'] .=
            "\n[CONSTRAINT REMINDER: "
            . "Assess skills in file order. Skip PASSED and REMEDIATED. "
            . "Re-probe SELF-CORRECTED. "
            . "Probe before classifying errors — never enter TEACH from a single wrong answer. "
            . "Every question ends with [ANSWER:X] tag — no exceptions. "
            . "One computation per prompt in TEACH mode. "
            . "Check prerequisite before teaching. "
            . "Mastery gate = 3 consecutive correct. "
            . "Grade 3 reading level. Max 12 words per sentence. "
            . "No markdown formatting. "
            . "Continuation gate after every 10 assessment questions (probes, teaching, mastery do not count). "
            . "Server total question count this session: " . ($_SESSION[$sessionKey . '_question_count'] ?? 0) . ".]";
    }
    
    // --------------------------------------------------------
    // SERVER-SIDE SKILL PRE-LOADING
    // Gate detection: load skills BEFORE API call
    // --------------------------------------------------------
    
    $lastAssistantMsg = '';
    for ($i = count($messages) - 2; $i >= 0; $i--) {
        if ($messages[$i]['role'] === 'assistant') {
            $lastAssistantMsg = $messages[$i]['content'];
            break;
        }
    }
    
    // Gate 1: Band selection — store band number, clear skills for reload
    if (preg_match('/Pick your level/i', $lastAssistantMsg)
        && preg_match('/^[1-8]$/', trim($userMessage))) {
        $_SESSION[$sessionKey . '_band'] = intval(trim($userMessage));
        unset($_SESSION[$sessionKey . '_skills_loaded']);
        unset($_SESSION[$sessionKey . '_domain']);
    }
    
    // Gate 2: Domain selection — store domain number, clear skills for reload
    if (preg_match('/Pick a math area/i', $lastAssistantMsg)
        && preg_match('/^[1-6]$/', trim($userMessage))) {
        $_SESSION[$sessionKey . '_domain'] = intval(trim($userMessage));
        unset($_SESSION[$sessionKey . '_skills_loaded']);
    }
    
    // When both band and domain are stored, load skills into system prompt
    if (isset($_SESSION[$sessionKey . '_band'])
        && isset($_SESSION[$sessionKey . '_domain'])
        && !isset($_SESSION[$sessionKey . '_skills_loaded'])) {
        
        $bandNum = $_SESSION[$sessionKey . '_band'];
        $domainNum = $_SESSION[$sessionKey . '_domain'];
        
        $bandPrefix = $BAND_MAP[$bandNum] ?? null;
        $domainSuffix = $DOMAIN_MAP[$domainNum] ?? null;
        
        if ($bandPrefix && $domainSuffix) {
            $filename = $bandPrefix . '_' . $domainSuffix . '.txt';
            
            // Sanitize: alphanumeric, hyphens, underscores, period only
            if (preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
                $skillFile = __DIR__ . '/constraints/skills/' . $filename;
                $skillsLoaded = false;
                
                if (file_exists($skillFile)) {
                    $skills = file_get_contents($skillFile);
                    if (!empty(trim($skills))) {
                        $messages[0]['content'] .= "\n\n---\n\nSKILL INVENTORY (Band "
                            . $bandPrefix . ", " . $domainSuffix . "):\n\n" . $skills;
                        $_SESSION[$sessionKey . '_skills_loaded'] = true;
                        $skillsLoaded = true;
                    }
                }
                
                if (!$skillsLoaded) {
                    // No skills for this combination — tell LLM explicitly
                    $messages[count($messages) - 1]['content'] .=
                        "\n[SYSTEM NOTE: No skill inventory exists for " . $filename
                        . ". Execute Gate 4: tell the student you don't have questions "
                        . "for that area at this level and re-present the domain list.]";
                    // Clear domain so next selection triggers fresh pre-loading
                    unset($_SESSION[$sessionKey . '_domain']);
                }
            }
        }
    }
    
    // Save session immediately to preserve user message on process death
    $_SESSION[$sessionKey] = $messages;
    
    // Truncate for API call — preserve system prompt + last N messages
    $maxMessages = 100;
    $apiMessages = $messages;
    if (count($apiMessages) > $maxMessages) {
        $systemMsg = array_slice($apiMessages, 0, 1);
        $recent = array_slice($apiMessages, -($maxMessages - 1));
        $apiMessages = array_merge($systemMsg, $recent);
    }

// ============================================================
// ACTION: RESET
// ============================================================

} elseif ($action === 'reset') {
    unset($_SESSION[$sessionKey]);
    // Clear gate and tracking state
    unset($_SESSION[$sessionKey . '_band']);
    unset($_SESSION[$sessionKey . '_domain']);
    unset($_SESSION[$sessionKey . '_skills_loaded']);
    unset($_SESSION[$sessionKey . '_expected_answer']);
    unset($_SESSION[$sessionKey . '_student']);
    unset($_SESSION[$sessionKey . '_turn_count']);
    unset($_SESSION[$sessionKey . '_question_count']);
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'session_id' => $sessionId]);
    exit;

// ============================================================
// MATH STUDENT ACTIONS
// ============================================================

} elseif ($action === 'math_exists') {
    header('Content-Type: application/json');
    $student = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['student'] ?? '');
    if (empty($student)) {
        echo json_encode(['error' => 'No student specified']);
        exit;
    }
    echo json_encode(['exists' => file_exists($mathStudentsDir . '/' . $student . '.json')]);
    exit;

} elseif ($action === 'math_create') {
    header('Content-Type: application/json');
    $student = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['student'] ?? '');
    $password = $input['password'] ?? '';
    if (empty($student)) {
        echo json_encode(['error' => 'No student specified']);
        exit;
    }
    if (empty($password)) {
        echo json_encode(['error' => 'Password required']);
        exit;
    }
    $studentFile = $mathStudentsDir . '/' . $student . '.json';
    if (file_exists($studentFile)) {
        echo json_encode(['error' => 'Name already taken']);
        exit;
    }
    $studentData = [
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'created' => date('c'),
        'last_session' => null,
        'sessions' => [],
        'skills' => [],
        'last_report' => null
    ];
    if (file_put_contents($studentFile, json_encode($studentData, JSON_PRETTY_PRINT), LOCK_EX)) {
        $_SESSION['math_authenticated_student'] = $student;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Could not create student']);
    }
    exit;

} elseif ($action === 'math_verify') {
    header('Content-Type: application/json');
    $student = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['student'] ?? '');
    $password = $input['password'] ?? '';
    if (empty($student)) {
        echo json_encode(['error' => 'No student specified']);
        exit;
    }
    $studentFile = $mathStudentsDir . '/' . $student . '.json';
    if (!file_exists($studentFile)) {
        echo json_encode(['error' => 'Student not found']);
        exit;
    }
    $data = json_decode(file_get_contents($studentFile), true);
    if (!$data || empty($data['password_hash'])) {
        echo json_encode(['success' => true]);
        exit;
    }
    // Rate limiting: 5 failed attempts per student per session
    $verifyKey = 'math_verify_fails_' . $student;
    $failCount = $_SESSION[$verifyKey] ?? 0;
    if ($failCount >= 5) {
        http_response_code(429);
        echo json_encode(['error' => 'Too many attempts. Please wait.']);
        exit;
    }
    if (password_verify($password, $data['password_hash'])) {
        unset($_SESSION[$verifyKey]);
        $_SESSION['math_authenticated_student'] = $student;
        echo json_encode(['success' => true]);
    } else {
        $_SESSION[$verifyKey] = $failCount + 1;
        http_response_code(403);
        echo json_encode(['error' => 'Wrong password']);
    }
    exit;

} elseif ($action === 'math_load') {
    header('Content-Type: application/json');
    $student = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['student'] ?? '');
    $password = $input['password'] ?? '';
    if (empty($student)) {
        echo json_encode(['error' => 'No student specified']);
        exit;
    }
    $studentFile = $mathStudentsDir . '/' . $student . '.json';
    if (!file_exists($studentFile)) {
        echo json_encode(['last_report' => null, 'skills' => [], 'sessions' => []]);
        exit;
    }
    $data = json_decode(file_get_contents($studentFile), true);
    if ($data && !empty($data['password_hash'])) {
        if (!password_verify($password, $data['password_hash'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Wrong password']);
            exit;
        }
    }
    unset($data['password_hash']);
    echo json_encode($data);
    exit;

} elseif ($action === 'math_save') {
    header('Content-Type: application/json');
    $student = preg_replace('/[^a-zA-Z0-9_-]/', '', $input['student'] ?? '');
    $report = $input['report'] ?? '';
    if (empty($student)) {
        echo json_encode(['error' => 'No student specified']);
        exit;
    }
    if (empty($report)) {
        echo json_encode(['error' => 'No report to save']);
        exit;
    }
    $studentFile = $mathStudentsDir . '/' . $student . '.json';
    if (!file_exists($studentFile)) {
        echo json_encode(['error' => 'Student not found']);
        exit;
    }
    // Session-based auth: only the authenticated student's session can save
    if (($_SESSION['math_authenticated_student'] ?? '') !== $student) {
        http_response_code(403);
        echo json_encode(['error' => 'Not authenticated for this student']);
        exit;
    }
    
    $fp = fopen($studentFile, 'c+');
    if ($fp && flock($fp, LOCK_EX)) {
        fseek($fp, 0);
        $raw = stream_get_contents($fp);
        $data = json_decode($raw, true);
        if (!$data) {
            flock($fp, LOCK_UN);
            fclose($fp);
            echo json_encode(['error' => 'Corrupt student file']);
            exit;
        }
        
        // Parse skills from report
        $newSkills = [];
        $currentStatus = null;
        $lines = explode("\n", $report);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, 'PASSED:') === 0) { $currentStatus = 'PASSED'; continue; }
            if (strpos($line, 'SELF-CORRECTED:') === 0) { $currentStatus = 'SELF-CORRECTED'; continue; }
            if (strpos($line, 'REMEDIATED:') === 0) { $currentStatus = 'REMEDIATED'; continue; }
            if (strpos($line, 'IN-PROGRESS:') === 0) { $currentStatus = 'IN-PROGRESS'; continue; }
            if (strpos($line, 'FAILED-FOUNDATIONAL:') === 0) { $currentStatus = 'FAILED-FOUNDATIONAL'; continue; }
            if (strpos($line, 'TEACHER-ROUTED:') === 0) { $currentStatus = null; continue; }
            if (strpos($line, 'NOT YET TESTED:') === 0) { $currentStatus = null; continue; }
            if (strpos($line, 'RECOMMENDATION:') === 0) { $currentStatus = null; continue; }
            if (strpos($line, 'SESSION REPORT') === 0) { $currentStatus = null; continue; }
            if (strpos($line, 'Domain:') === 0) { $currentStatus = null; continue; }
            if (strpos($line, 'RIT Band:') === 0) { $currentStatus = null; continue; }
            if (strpos($line, 'SKILLS ASSESSED:') === 0) { $currentStatus = null; continue; }
            
            // Extract skill name from lines starting with "- "
            if ($currentStatus && strpos($line, '- ') === 0) {
                $skillName = substr($line, 2);
                // Strip metadata after " - " delimiter
                $dashPos = strpos($skillName, ' - ');
                if ($dashPos !== false) {
                    $skillName = substr($skillName, 0, $dashPos);
                }
                // Also check em dash for backward compatibility
                $emDashPos = strpos($skillName, ' — ');
                if ($emDashPos !== false) {
                    $skillName = substr($skillName, 0, $emDashPos);
                }
                $skillName = trim($skillName);
                if (!empty($skillName)) {
                    $newSkills[$skillName] = $currentStatus;
                }
            }
        }
        
        // Merge new skills into cumulative record
        if (!isset($data['skills']) || !is_array($data['skills'])) {
            $data['skills'] = [];
        }
        foreach ($newSkills as $skill => $status) {
            $data['skills'][$skill] = $status;
        }
        
        // Extract domain and band from report
        $domain = '';
        $band = '';
        foreach ($lines as $line) {
            if (strpos(trim($line), 'Domain:') === 0) {
                $domain = trim(substr(trim($line), 7));
            }
            if (strpos(trim($line), 'RIT Band:') === 0) {
                $band = trim(substr(trim($line), 9));
            }
        }
        
        $data['sessions'][] = [
            'date' => date('c'),
            'domain' => $domain,
            'band' => $band,
            'report' => $report
        ];
        
        $data['last_session'] = date('c');
        $data['last_report'] = $report;
        
        fseek($fp, 0);
        ftruncate($fp, 0);
        fwrite($fp, json_encode($data, JSON_PRETTY_PRINT));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
        
        echo json_encode(['success' => true]);
    } else {
        if ($fp) fclose($fp);
        echo json_encode(['error' => 'Could not save']);
    }
    exit;

} else {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Invalid action']);
    exit;
}

// ============================================================
// SSE STREAMING
// ============================================================

function processSSEDataLine($jsonStr, &$finishReason, &$fullResponse) {
    if ($jsonStr === '[DONE]') return;
    
    $chunk = json_decode($jsonStr, true);
    if (!$chunk) return;
    
    if (isset($chunk['choices'][0]['delta']['content'])) {
        $content = $chunk['choices'][0]['delta']['content'];
        $fullResponse .= $content;
        echo "data: " . json_encode(['content' => $content]) . "\n\n";
        flush();
    }
    
    if (isset($chunk['choices'][0]['finish_reason']) && $chunk['choices'][0]['finish_reason'] !== null) {
        $finishReason = $chunk['choices'][0]['finish_reason'];
    }
}

// Prepare API request
if (!isset($apiMessages)) {
    $apiMessages = $messages;
}

$apiData = [
    'model' => 'deepseek-v4-flash',
    'messages' => $apiMessages,
    'max_tokens' => 8192,
    'temperature' => 0.0,
    'stream' => true
];

// Log directory
$logDir = __DIR__ . '/logs';
if (!is_dir($logDir)) {
    @mkdir($logDir, 0755, true);
}

$debugLog = $logDir . '/debug_' . date('Y-m-d') . '.log';
@file_put_contents($debugLog, json_encode([
    'timestamp' => date('c'),
    'type' => 'REQUEST',
    'engine' => 'math-skills',
    'model' => $apiData['model'],
    'max_tokens' => $apiData['max_tokens'],
    'message_count' => count($messages)
], JSON_PRETTY_PRINT) . "\n\n", FILE_APPEND | LOCK_EX);

// Set SSE headers
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');

if (ob_get_level()) ob_end_flush();
flush();

// Single API call — no tool loop needed
$buffer = '';
$finishReason = null;
$fullResponse = '';

$ch = curl_init('https://api.deepseek.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $DEEPSEEK_API_KEY
]);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($apiData));
curl_setopt($ch, CURLOPT_TIMEOUT, 0);

curl_setopt($ch, CURLOPT_WRITEFUNCTION, function($curl, $data) use (&$buffer, &$finishReason, &$fullResponse) {
    $buffer .= $data;
    $lines = explode("\n", $buffer);
    $buffer = array_pop($lines);
    
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || $line === ':' || strpos($line, ': keep-alive') === 0) {
            continue;
        }
        if (strpos($line, 'data: ') === 0) {
            processSSEDataLine(substr($line, 6), $finishReason, $fullResponse);
        }
    }
    
    return strlen($data);
});

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Process remaining buffer
if (!empty($buffer)) {
    $buffer = trim($buffer);
    if (strpos($buffer, 'data: ') === 0) {
        processSSEDataLine(substr($buffer, 6), $finishReason, $fullResponse);
    }
}

if ($result === false || $curlError || $httpCode !== 200) {
    echo "data: " . json_encode(['error' => 'API request failed']) . "\n\n";
    echo "data: [DONE]\n\n";
    flush();
    error_log('Math-skills API error: ' . ($curlError ?: 'HTTP ' . $httpCode));
    exit;
}

// Detect truncation
if ($finishReason === 'length') {
    echo "data: " . json_encode(['warning' => 'response_truncated']) . "\n\n";
    flush();
    error_log('TOKEN CEILING HIT: math-skills session=' . $sessionId
        . ' — response truncated at max_tokens=8192. Tags may be missing.');
}

echo "data: [DONE]\n\n";
flush();

// ============================================================
// POST-STREAM PROCESSING
// ============================================================

if (!empty($fullResponse)) {
    // Extract expected answer and independently verify arithmetic via CHECK
    // Skip on truncated responses — tag may be incomplete or missing
    if ($finishReason !== 'length'
        && preg_match_all('/\[ANSWER:(.*?)\]/', $fullResponse, $answerMatches)) {
        $lastAnswer = trim(end($answerMatches[1]));
        
        // Independent arithmetic verification: if CHECK expression present,
        // server computes it and overrides LLM's answer if they disagree.
        // Pairs last ANSWER with last CHECK — valid under one-question-per-response.
        if (preg_match_all('/\[CHECK:(.*?)\]/', $fullResponse, $checkMatches)) {
            $lastCheck = trim(end($checkMatches[1]));
            $computed = evalMathExpression($lastCheck);
            if ($computed !== null) {
                $computedStr = (floor($computed) == $computed)
                    ? (string)(int)$computed : (string)$computed;
                if (!answersMatch($lastAnswer, $computedStr)) {
                    error_log("CHECK OVERRIDE session=$sessionId: LLM=$lastAnswer server=$computedStr expr=$lastCheck");
                    $lastAnswer = $computedStr;
                }
            }
        }
        
        $_SESSION[$sessionKey . '_expected_answer'] = $lastAnswer;
        // Increment total question counter for assessment tracking
        $_SESSION[$sessionKey . '_question_count'] = ($_SESSION[$sessionKey . '_question_count'] ?? 0) + 1;
    }
    
    // Deferred skill injection — fallback if server-side pre-loading missed
    // Only fires if skills were NOT already pre-loaded
    if (!isset($_SESSION[$sessionKey . '_skills_loaded'])
        && preg_match('/\[INJECT_SKILLS:([a-zA-Z0-9_\-\.]+)\]/', $fullResponse, $skillMatch)) {
        $filename = $skillMatch[1];
        
        // Sanitize
        if (preg_match('/^[a-zA-Z0-9_\-\.]+$/', $filename)) {
            $skillFile = __DIR__ . '/constraints/skills/' . $filename;
            if (file_exists($skillFile)) {
                $skills = file_get_contents($skillFile);
                if (!empty($skills)) {
                    $currentMessages = $_SESSION[$sessionKey];
                    $currentMessages[0]['content'] .= "\n\n---\n\nSKILL INVENTORY:\n\n" . $skills;
                    $_SESSION[$sessionKey] = $currentMessages;
                    $messages[0]['content'] = $currentMessages[0]['content'];
                    $_SESSION[$sessionKey . '_skills_loaded'] = true;
                }
            }
        }
    }
    
    // Strip ALL system tags from stored response
    $cleanResponse = preg_replace('/\s*\[ANSWER:.*?\]/', '', $fullResponse);
    $cleanResponse = preg_replace('/\s*\[CHECK:.*?\]/', '', $cleanResponse);
    $cleanResponse = preg_replace('/\s*\[INJECT_SKILLS:.*?\]/', '', $cleanResponse);
    $messages[] = ['role' => 'assistant', 'content' => $cleanResponse];
    $_SESSION[$sessionKey] = $messages;
}

// Analytics logging
$logFile = $logDir . '/' . date('Y-m-d') . '.log';
@file_put_contents($logFile, json_encode([
    'timestamp' => date('c'),
    'session_id' => $sessionId,
    'engine' => 'math-skills',
    'action' => $action,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
]) . "\n", FILE_APPEND | LOCK_EX);

exit;
?>