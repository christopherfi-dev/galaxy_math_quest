<?php
/* Sets the teacher password for the GMQ world server. Run it once on the server, from this folder:
       php set-teacher-password.php "your password here"
   It stores only a scrambled form of the password (a hash) in the data folder. */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit("Run this from the command line.\n"); }
$pw = $argv[1] ?? ''; if (strlen($pw) < 8) exit("Give a password of at least 8 characters, in quotes.\n");
$config = file_exists(__DIR__ . '/../api/config.php') ? (require __DIR__ . '/../api/config.php') : [];
$data = rtrim((string)($argv[2] ?? $config['data_dir'] ?? (__DIR__ . '/../api/data')), '/');
if (!is_dir($data)) mkdir($data, 0770, true);
file_put_contents("$data/teacher.json", json_encode(['password_hash' => password_hash($pw, PASSWORD_DEFAULT), 'tries' => 0, 'locked_until' => 0], JSON_PRETTY_PRINT), LOCK_EX);
if (!file_exists("$data/.htaccess")) file_put_contents("$data/.htaccess", "Require all denied\nDeny from all\n");
echo "The teacher password is set. Data folder: $data\n";
