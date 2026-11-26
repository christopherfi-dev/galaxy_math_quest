# GMQ world server: version 0.2 (26 November 2026)

**Stage:** tested only on Claude's machine. It has never run on your site. **[Proposal]**
**It never touches your live server.** You upload it to a TEST folder yourself: `../READ_ME_FIRST.md`, with the zip `../GMQ_Server_Test_Folder.zip`.
Version 0.1 was built on 17 November. What changed, and why: `proposals/GMQ_Server_Report_v1_2026-11-26.md`.

## What it is

A small PHP server, built like your Math Skills engine: one API, flat JSON files, a login, and any key in a settings file that stays on the server. PHP 7.4 or newer.

| It does | It does not do yet |
|---|---|
| Remembers each cadet's game, on any device | Mark the maths. The page still does that. |
| Keeps your codes for the real-life tasks, so they are not in the page | Hold the world's facts. The page sends the AI its "world slice". |
| Holds a new ship name until you approve it | Check who won a battle. The page says so. |
| Shows you the whole class on one page, with older copies of a game to bring back | |
| Lets only the newest device of a cadet save, so an older iPad cannot spoil a newer game | |
| A server check, and a first-time password setup with no command line | |
| (Off until you turn it on) a class card board, and battles against a classmate's saved deck | |
| Passes what a cadet types to the AI, inside the constraint file, and checks the reply first (off) | |

## The files

| File | What it is |
|---|---|
| `index.html` | the folder's front page: Play, or the Commander's Desk |
| `teacher.html` | the Commander's Desk: the server check, your classes, every cadet, the settings, older copies, battles |
| `api/gmq-world-api.php` | the server |
| `api/gmq-world-cards.php` | the card board and battles. The server loads it; it is never opened by itself. |
| `api/config.sample.php` | settings. Copy it to `api/config.php` **on the server** and fill it in there. |
| `tools/set-teacher-password.php` | sets the teacher password from the command line, if you prefer that to the setup word |
| `../constraints/gmq-world.txt` | the constraint file the AI runs inside. In the zip it is in `api/constraints/`. |
| `../build_test_folder.sh` | builds the zip, with the class link's game as `play.html` |

`api/config.php` and the data folder are **never** in this repository or in a zip.

## How a cadet logs in [Proposal]

- You make a class on the Commander's Desk. It gets a 5-character class code.
- A cadet types the class code, their first name, and a 4-digit secret number they choose.
- The same three things open the same game on any device.
- **The newest log in saves.** When a cadet logs in on a second device, the first one can no longer save. Its game is not lost: if it held more than the server's, the server keeps it as an older copy you can bring back.
- A log in lasts a school day (10 hours) [pick], kept in the data folder. Version 0.1 lost log ins after 24 minutes without use.
- Five wrong secret numbers lock that name for ten minutes. You can give a cadet a new number.
- The server stores the number only as a hash, as your Math Skills engine stores passwords.
- Two cadets with the same first name in one class cannot both be "Mia". The second adds a letter: "Mia B".

## Older copies

The server keeps up to 5 older copies of each game, with why each was kept:
- **before the game went back:** a save that had less in it than the game before (a new game by mistake)
- **from another iPad, not kept:** an older device sent a game with more in it than the server's
- **before you cleared it**, **before you brought back an older copy**

On the Desk: "Older copies", then "Bring this back".

## Cards between classmates (off until you turn them on, for each class)

- **The class card board:** which cards classmates have found, and up to five finders, by ship name. [pick: ship names only]
- **Battles against a classmate's deck:** the computer plays the deck on the challenger's iPad, so nobody has to be online together. Only a cadet who turns on "classmates may battle my deck" can be battled. [pick]
  - **friendly only:** nothing at stake
  - **challenge: winner takes both** (Marc's rule): each side puts up one rare or epic card, picked at random from its deck. The challenger sees both before agreeing.
  - **challenge: away cadet keeps card:** the challenger can lose their card; the classmate who is away never loses one. If the challenger wins, they get a copy.
- A cadet whose deck was battled is told at their next log in.
- The game has no buttons for these yet. The cards thread, the battle thread and the main thread add them: `proposals/GMQ_Server_Wiring_v1_2026-11-26.md`.

## The AI, and how it is kept inside the world

- The AI is **off** until you set `provider` and a key in `config.php`. Keep it off on a test folder.
- When it is on, the page sends only the lines the game does not understand.
- The server sends the AI your constraint file, the place the cadet is in, and the cadet's words.
- **The reply is checked before a child sees it.** It is stopped if it has a number the world did not give, marks or gives an answer, hands out a card or a reward, is longer than 4 sentences or has a sentence over 16 words, has unkind words, or steps out of the world ("as an AI...").
- A cadet can ask at most 12 times a minute.
- The server does not yet act on the AI's tags (`[TRY]`, `[MOVE]`, `[TRACE]`): it removes them. So the AI can describe, and cannot change anything.

## To try it on your own computer

```
cd engines/gmq-world/server
cp api/config.sample.php api/config.php        # then set 'setup_code' to a word of your own
cp ../../../docs/index.html play.html
php -S localhost:8080
```

Open `http://localhost:8080/teacher.html`. The server check says what is missing.

## How it was tested (all on this machine)

| Test | What it plays |
|---|---|
| `checks/world_server_test.js` | (from 0.1, unchanged) the API: a cadet, a second device, a stranger, the teacher, the AI reply check. 40 checks. |
| `checks/world_online_test.js` | (from 0.1, unchanged) the game against the server in a browser |
| `checks/server_class_test.js` | 14 pretend cadets, two devices each, all at once (PHP with 8 workers); then the card board and about 20 battles at once while every device keeps saving |
| `checks/server_game_test.js` | the game as it is today against 0.2: two devices, leaving and coming back, the teacher clearing a game and bringing it back |
| `checks/server_desk_test.js` | the Commander's Desk in a browser, at three screen sizes, including a data folder anyone could read |
| `checks/server_zip_test.js` | the steps in `READ_ME_FIRST.md`, done on the zip itself |
| `checks/server_php_check.py` | every PHP file parses, and uses nothing newer than PHP 7.4 (a search; there is no PHP 7.4 here) |

**Not tested:** your host, a real iPad on school wifi, PHP 7.4 itself, a real AI model, and real children.
