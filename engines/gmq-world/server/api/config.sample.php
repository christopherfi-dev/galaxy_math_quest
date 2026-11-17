<?php
/* GMQ world server: settings. Copy this file to config.php ON THE SERVER and fill it in there.
   config.php holds the AI key. It must never be copied off the server, put in a zip, or sent to anyone. */
return [
    // where the saved games live. Best is a folder outside the web root. The default is api/data, protected by .htaccess.
    // 'data_dir' => '/home/yourname/gmq-data',

    // only needed if the game page is served from a different site than this API
    // 'allow_origin' => 'https://example.org',

    // the AI. Leave 'provider' empty to keep the AI switched off: the game then answers as it does now.
    'ai' => [
        'provider' => '',                                   // '' = off, 'openai-style' = on
        'url'      => 'https://api.deepseek.com/v1',        // the same service your Math Skills engine calls
        'model'    => 'deepseek-v4-flash',
        'key'      => '',                                   // paste the key here, on the server only
    ],
    // 'constraint_file' => __DIR__ . '/constraints/gmq-world.txt',
];
