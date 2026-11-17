# GMQ world server — version 0.1 (2026-11-17)

**Stage:** a first version, tested only on Claude's machine. It has never run on your site. [Proposal]
**It never touches your live server.** You copy it there when you choose to.

## What it is

A small PHP server, built like your Math Skills engine: one API file, flat JSON files, a login, and the AI key in a config file that stays on the server.

| It does | It does not do yet |
|---|---|
| Remembers each cadet's game, on any device | Mark the maths. The page still does that. |
| Keeps your codes for the real-life tasks, so they are not in the page | Hold the world's facts. The page sends the AI its "world slice". |
| Holds a new ship name until you approve it | Run battles |
| Shows you the whole class on one page | |
| Passes what a cadet types to the AI, inside the constraint file, and checks the reply first | |

## The files

| File | What it is |
|---|---|
| `api/gmq-world-api.php` | the server |
| `api/config.sample.php` | settings. Copy it to `api/config.php` **on the server** and fill it in there. |
| `tools/set-teacher-password.php` | sets your teacher password. Run it once on the server. |
| `teacher.html` | the Commander's Desk: your class view |
| `../constraints/gmq-world.txt` | the constraint file the AI runs inside. Copy it to `api/constraints/` on the server. |

`api/config.php` and the `data` folder are **never** in this repository or in a zip.

## How a cadet logs in [Proposal]

- You make a class on the Commander's Desk. It gets a 5-character class code.
- A cadet types the class code, their first name, and a 4-digit secret number they choose.
- The same three things open the same game on any device.
- Five wrong secret numbers lock that name for ten minutes. You can give a cadet a new number.
- The server stores the number only as a hash, as your Math Skills engine stores passwords.

## To try it on your own computer

```
cd engines/gmq-world/server
cp api/config.sample.php api/config.php
php tools/set-teacher-password.php "a password of your own"
mkdir -p api/constraints && cp ../constraints/gmq-world.txt api/constraints/
php -S localhost:8080
```

Then open `http://localhost:8080/teacher.html`, make a class, and open the game at `http://localhost:8080/play.html`.
(`play.html` is the sketch. Copy `prototypes/kis_station_sketch.html` there. The sketch finds the server by itself when the two sit together.)

## To put it on your site, when you want to

1. Make a folder beside your other engines, for example `educational-engines/gmq/`.
2. Copy in `api/gmq-world-api.php`, `teacher.html`, and the sketch as `play.html`.
3. Copy `api/config.sample.php` to `api/config.php` there. Set `data_dir` to a folder **outside** the web root.
4. Copy `gmq-world.txt` to `api/constraints/`.
5. Run `php tools/set-teacher-password.php "..."` once.
6. Leave the AI off at first. Turn it on in `config.php` when you have read the constraint file.

## The AI, and how it is kept inside the world

- The AI is **off** until you set `provider` and a key in `config.php`.
- When it is on, the page sends only the lines the game does not understand.
- The server sends the AI your constraint file, the place the cadet is in, and the cadet's words.
- **The reply is checked before a child sees it.** It is stopped if it:
  - has a number the world did not give
  - marks an answer, or gives one
  - hands out a card or a reward
  - is longer than 4 sentences, or has a sentence over 16 words
  - has unkind words, or steps out of the world ("as an AI...")
- If it is stopped, the game answers as it does today. Every stop is written to the log, so you can see what the AI tried.
- A cadet can ask at most 12 times a minute.
- **Two limits of this first version.** The page, not the server, builds the "world slice" the AI is told about. And the server does not yet act on the AI's tags (`[TRY]`, `[MOVE]`, `[TRACE]`): it removes them. So for now the AI can describe, and cannot change anything. That is the safe half of your design. The other half comes when the world's facts move to the server.

## How it was tested

`node checks/world_server_test.js` starts PHP's own small server in a scratch folder and plays a cadet, a second device, a stranger and the teacher. 40 checks. All pass.
`node checks/world_online_test.js` plays the sketch itself against that server, in a browser.

**Not tested:** your host, real load from a class of 20, and a real AI model. The constraint file has still never been run against a model.

## What could prove this wrong

| Claim | Test |
|---|---|
| Flat files are enough for one class | 20 cadets saving at once. Your Math Skills engine already does this, so it should hold. |
| A name and a 4-digit number is safe enough | Ask: would a classmate guess it? The lock after five tries is the guard. |
| The reply check is strict enough | Turn the AI on for yourself only. Type odd things for ten minutes. Read the log of stops. |
