# The class server: report, 26 November (with the night's work, section 9)

**From:** the server thread. **For:** Marc, and the main thread.
Everything is **[Proposal]** unless it says [Source]. My own choices without you are marked **[pick]**.

[Source: Marc, 26 November: "they can't battle each other yet unless we can start trying to set a test server for that.. So we need to be moving forward always."]

---

## 1. In short

- **The server from 17 November had four faults** that would have hurt a real class. A test with 14 pretend children, two iPads each, found all four. They are fixed in **version 0.2**.
- **A test folder is ready for you to upload yourself:** one zip, and plain steps (about 20 minutes). Made-up cadets only. Nothing else on your site changes.
- **Cards between classmates are built on the server,** off until you turn them on: a class card board, and battles against a classmate's saved deck. The game has no buttons for them yet. That needs the card book, the battle with your own cards, and the main thread's wiring.
- **Seven decisions are yours** (section 6). None blocks the test folder.

## 2. What a teacher and a child can do now

**On the test folder, once you upload it:**

| Who | Can |
|---|---|
| Teacher | Open the Commander's Desk and see a **server check**: each line green, or what to do. |
| Teacher | Set the teacher password the first time with a setup word, with **no command line**. |
| Teacher | Make a class; see every cadet; approve ship names; change task codes; give a new secret number. |
| Teacher | **Bring back an older copy** of a cadet's game (up to 5 are kept, each with why). |
| Teacher | Switch on the card board and battles, and pick the rule for battles (section 6). |
| Child | Log in with the class code, a first name and a 4-digit number. The game follows them to any device. |
| Child | Play on a second device. The older device can no longer save, so it cannot spoil the newer game. |

**Not yet, until the game is wired:** a child cannot see the card board or start a battle. And the older device's words are wrong: it says "not saved yet: no connection" (section 5).

## 3. The four faults, before and after

The same test, run on 0.1 three times, and on 0.2 five times. `checks/server_class_test.js`: 14 made-up cadets, two devices each, all at once.

| Fault in 0.1 | 0.1, three runs | 0.2, five runs |
|---|---|---|
| A child playing was told **"Please log in"**: the server read their file while it was half-written. In the game, the log-in box replaces the task. | 4, 6 and 11 times | never |
| The teacher's class view **missed a cadet** for a moment | 9 to 17 times | never |
| A passed **real-life code was lost** when a save landed at the same moment | 2, 3 and 7 of 14 cadets | none |
| An **older iPad wrote its old game over the newer one** when it woke up | 14 of 14 cadets | none (the older iPad is told the game moved) |

**Also changed in 0.2:**
- **Log ins last a school day** (10 hours) [pick]. In 0.1 they ended after 24 minutes without use, so a child back from break would be asked to log in again.
- **Saved games outside the web folder,** and the Desk checks it from outside. On a server that ignores `.htaccess` files (many do, by default), 0.1's saved games could have been opened by anyone who guessed a name.
- **A setup word** in the settings file sets the teacher password from the Desk. 0.1 needed a command, and a password typed in a command stays in the server's history.

## 4. Cards between classmates: the shape I picked [pick, then your decisions]

**The card book on the server.** Already true: the cards are in the saved game, which follows the child. What is new is that the server is in charge of cards that move between children. The page cannot simply give itself a classmate's card.

**The class card board.** Which cards classmates have found, with up to five finders.
- By **ship name** only (a name the child chose and you approved). A child with no approved ship name is counted, never named. [pick]
- No ranking, and no "who has the most". [Source: your rule, learning before speed]
- A card the child has not found shows only as an empty shape: "3 classmates found this". [Source: the cards brief]

**Battles against a classmate's saved deck.** The computer plays the classmate's deck on the challenger's iPad. Nobody has to be online at the same time.
- Only a child who turns on **"Classmates may battle my deck"** can be battled. [pick]
- **Friendly:** nothing at stake.
- **Challenge** [Source: your rule, 23 November]: each side puts up one rare or epic card, picked at random from its deck. The challenger sees both cards before agreeing, and may back out. The winner gets both. A tie moves nothing.
- The classmate who was away is told at their next log in, in short sentences: "Blue Fox challenged your deck, and your deck won! You got Void Vortex."
- One battle at a time; 6 battles an hour at most [pick]; a battle not finished in 20 minutes ends with nothing moved [pick].
- **Tested:** about 20 challenges at once among 12 pretend cadets, while every device kept saving. The class held exactly the same number of cards before and after, and no card was ever in two books.

## 5. What was tested, and what was not

**Tested, all on this machine** (`checks/RUN_ALL.md` has every line):

| Test | Result |
|---|---|
| `world_server_test.js`, `world_online_test.js` (from 17 November, unchanged) | pass against 0.2 |
| `server_class_test.js`: 14 cadets × 2 devices, then the card board and battles | pass, 5 runs of 5 |
| `server_game_test.js`: today's game against 0.2: two devices, leaving and coming back, the teacher clearing a game and bringing it back, a fresh browser | pass with version 99 (the class link) and version 100 |
| `server_desk_test.js`: the Desk in a browser; a data folder anyone could read (it says so in red); the first-time setup; settings; older copies; pictures at iPad sideways, iPad upright and phone | pass. I looked at the pictures. The first pictures showed menu words cut off; fixed, and the test now measures them. |
| `server_zip_test.js`: your steps, done word for word on the zip | pass |
| `server_php_check.py`: every PHP file parses, and uses nothing newer than PHP 7.4 | pass |

**What a child sees today when the game moves to another device** (from `server_game_test.js`): the older device's bar says "not saved yet: no connection". Reloading it opens its older game, which still cannot save. **Nothing is lost**, but the words are wrong and there is no way forward except "Log out". The fix is the main thread's (wiring note, 1b).

**Not tested:**
- **Your host:** Apache or nginx, its PHP version, its folder owners, https. The server check is built to tell you each of these.
- **PHP 7.4 itself.** This machine has PHP 8.3. The check is a search for newer features, not a run.
- **A real iPad on school wifi,** and real children.
- **Load beyond one class:** 14 cadets on PHP's small test server with 8 workers, not your Apache.
- **The 20-minute end of a battle.** Tested at 3 seconds.
- **The AI.** It stays off.

**Things that could prove this wrong:**
- **Your data folder on a network disk.** The server's locks may not work there. On a normal server disk they do.
- **A school network that blocks cookies from your site.** Then nobody can stay logged in. The Desk would still load; the game would ask again at every save.
- **Children sharing iPads without logging out.** The newest log in saves. If a child forgets to log out of the class board, the board can no longer save, which is safe but confusing.
- **The page reports who won a battle.** A child with the know-how could claim a win. Only a server that replays the battle can stop it (later).

## 6. Decisions for you

| # | Decision | Options, and what each costs |
|---|---|---|
| 1 | **The test folder: where, and when** | **A.** `educational-engines/gmq-test/` beside your Math Skills engine, with saved games in `/var/www/gmq-test-data` (the steps assume this) [pick]. **B.** Another address: tell me, and I change the steps. Either way you upload it yourself, when you choose. |
| 2 | **How classmates are named to each other** | **A.** Ship name only [pick]: a name the child chose and you approved; costs you an approval for each child. **B.** First names inside one class: simpler; more identifying, and you still see everything. The Desk has a switch for this. |
| 3 | **The first thing a class shares** | **A.** The card board first: nothing to win or lose. **B.** Friendly battles: a classmate's deck, nothing at stake. **C.** Challenges from the start. Each is one switch on the Desk. Battles of any kind need the battle with your own cards first (the battle thread). |
| 4 | **In a challenge, can a child lose a card while they are away?** | **A.** Yes, as your rule says: the winner takes both. Real stakes; a child may come back to find a card gone, and the news says why. **B.** No: the challenger can lose their card, but the classmate who is away never does; if the challenger wins, they get a copy. Kinder, but rare and epic cards slowly become more common. Both are built; the Desk switch picks. |
| 5 | **A challenge started and never finished** | **A.** Nothing moves after 20 minutes [pick]. A child could quit a battle they are losing. **B.** It counts as a loss. Stops quitting, but punishes a dropped connection or a flat battery. |
| 6 | **How long a log in lasts** | **A.** A school day, 10 hours [pick]: log in once each morning. **B.** A week: fewer log ins on a child's own iPad. **C.** Each lesson. One line in the settings file. |
| 7 | **What you see and can switch off** | Built: everything per class (board, battles and their rule, names, closed to new cadets), every battle with first names, older copies. **Do you also want** a switch for one child (no battles for this child), or a daily limit? |

Also still open from before: whether "Policeman" or "Guard" is the card's name (the battle thread's question).

## 7. Something to check on your live site (I did not look)

The Math Skills engine's notes in this repository say its student records sit in `api/math-students/`, inside the web folder. Many servers ignore `.htaccess` files by default. **Please check yourself, without me:** open your site's address for that folder in a browser. If it lists files, or a file opens, student records can be read by anyone. I never open your live site, and I have not tried.

## 8. Message for the main thread

> From the server thread, 26 November. Server 0.2 is in `engines/gmq-world/` (README, `READ_ME_FIRST.md`, the zip `GMQ_Server_Test_Folder.zip`, built by `build_test_folder.sh` with `docs/index.html` as `play.html`; rebuild it when the class link changes). Today's game works with it unchanged: `world_online_test.js` and `world_server_test.js` pass, and the new `server_game_test.js` passes with versions 99 and 100. Please read `proposals/GMQ_Server_Wiring_v1_2026-11-26.md`, section 1: about 30 lines in the NET block give clear words when a game moves to another device ("Your game is open on another iPad", "Bring it here") instead of "not saved yet: no connection", and prepare cards that move between classmates (a mark `u` on every card). Sections 2 and 3 are for the cards and battle threads. New checks: `server_class_test.js`, `server_game_test.js`, `server_desk_test.js`, `server_zip_test.js`, `server_php_check.py` (lines added at the end of `RUN_ALL.md`). Please add `proposals/GMQ_Server_*` to the zip if it is not already there through `proposals`. I edited no file of yours.

---

## 9. The night of 26 November (while you slept)

[Source: Marc: "Push what you can. Keep checking for updates. You have 3 hours to work."]

**Two other threads landed things the server was waiting for,** and the server now uses both:
- **The battle thread's card list** (118 cards, `docs/battle/cards.json`) and **its battle against a classmate's saved deck.** The battle shows both cards at stake first, with "I agree" and "Back out". Then the computer flies the classmate's own deck.
- **The cards thread's card pop-up and card book** (`GMQCards`).

**What is new on the server (version 0.3), all pushed:**
- **The card list decides each card's kind,** not the page. A page cannot call a common card epic. A card named by its id or by its name is the same card. Ship parts go with the ship, not in the deck.
- **The starter pack is made by the battle thread's rule,** and is the same pack, seed for seed, on 20,000 seeds.
- **A card won from a classmate arrives with why it came,** for example "Won from Blue Fox's deck in a challenge.", marked unseen. So, once the main thread wires in the card pop-up, it will show the card by itself.
- **A test page, `cards-test.html`, in the test folder:** two pretend cadets take a starter pack each, see the class card board, and battle each other's saved decks with the battle thread's battle. It is off until you turn it on, and is for made-up cadets only. It is step 9 of `READ_ME_FIRST.md`.
- **On the Desk:** a server-check line for the card list, a switch for the test page, and "What happened" for each battle.

**Checked:** every server check passes (10 of them; `checks/RUN_ALL.md`). I looked at the test page's pictures, at iPad and phone size.

**One fault found and fixed:** the Desk once showed a blank page after a missing comma in its script. A new check now reads every script in the server's pages.

**One rule removed, with its reason:** a challenge no longer needs both cadets on the newest game page. The server keeps its own list of every card that moved, so each book stays right even with today's game. And only a card with its own mark can be put up.

**Still yours** (no change): the decisions in section 6. Decision 4 (can an away child lose a card?) now shows in the battle's words, which say "The winner gets both cards" under either rule. The battle thread is asked to change that.

### Messages to paste

**To the battle thread:**
> From the server thread, 26 November, night. Thank you: the classmate battle fits the server exactly, and the server's test page now uses it (`engines/gmq-world/server/cards-test.html`; `checks/server_cards_page_test.js` backs out and agrees inside your frame, and goes back to a battle left in the middle). One thing: the words "The winner gets both cards" are right only for the rule `swap`. The server's `battle_start` answers `rule` (`'swap'` or `'away-safe'`), and the test page passes it as `opts.rival.rule`. Under `away-safe` the words could be: "If you win, you get a copy of their card, and they keep theirs. If their deck wins, your card goes to them." Also: the server checks its starter pack against `GMQBattleOwn.starter` on 20,000 seeds (`checks/server_cards_check.js`); please run it if you change the starter rule or the list.

**To the cards thread:**
> From the server thread, 26 November, night. Your book fits the server well. Two things for cards that move between classmates (`proposals/GMQ_Server_Wiring_v1_2026-11-26.md`, sections 1d and 2): (1) give every card its own mark, `u`, 8 random letters and digits, in `record()`, and in `migrate()` for old cards; a card without a mark is never put up in a challenge. (2) A card that arrives from a classmate comes with `why` ("Won from Blue Fox's deck in a challenge.") and `unseen: 1`, so your pop-up will show it by itself; a card that leaves just disappears from `S.cards` (the game replaces `S.cards` with the server's list). Please also add a switch in the book, "Classmates may battle my deck", for when the server is on (`{ action: 'deck', open: true }`), and the class card board (section 2), when you get to it.

**To the main thread:**
> From the server thread, 26 November, night. Server 0.3 is pushed: it reads the battle thread's card list; a test page (`engines/gmq-world/server/cards-test.html`) lets pretend cadets battle each other's decks with the battle thread's classmate battle; the zip carries version 100. The wiring note (`proposals/GMQ_Server_Wiring_v1_2026-11-26.md`) is unchanged for you, except: a challenge no longer needs `caps`. When you wire in `GMQCards`, a card the server sends with `unseen: 1` will pop up by itself. No file of yours was edited.
