<?php
/* GMQ world server: settings. Copy this file to config.php ON THE SERVER and fill it in there.
   config.php may hold the AI key. It must never be copied off the server, put in a zip, or sent to anyone, in a chat or anywhere. */
return [
    // 1. Where the saved games live. Use a folder OUTSIDE the web folder, that the web server may write to (READ_ME_FIRST.md, step 3).
    //    Without this line they go in api/data, and the Commander's Desk shows in red if anyone can read them from the web.
    // 'data_dir' => '/var/www/gmq-test-data',

    // 2. A setup word of your own, 6 letters or more. On the Commander's Desk, the first time, it lets you choose the teacher password.
    //    Once the password is set, this word does nothing more, and you may delete the line.
    'setup_code' => '',

    // How long a cadet stays logged in, in hours, without logging in again. [pick: 10, one school day]
    // 'session_hours' => 10,

    // Only needed if the game page is on a different site than this API: for example the class link on GitHub Pages,
    // 'https://christopherfi-dev.github.io'. The page then keeps its log-in as a token (Safari blocks another site's cookie).
    // 'allow_origin' => 'https://christopherfi-dev.github.io',

    // The AI. Leave 'provider' empty to keep the AI switched off: the game then answers as it does now.
    // On a TEST folder, keep it off.
    'ai' => [
        'provider' => '',                                   // '' = off, 'openai-style' = on
        'url'      => 'https://api.deepseek.com/v1',        // the same service your Math Skills engine calls
        'model'    => 'deepseek-v4-flash',
        'key'      => '',                                   // only here, on the server, never anywhere else
    ],
    // 'constraint_file' => __DIR__ . '/constraints/gmq-world.txt',
];
