# The class server: read this first (night of 26 November)

**From:** the server thread. **For:** Marc. One page. The full record is `proposals/GMQ_Server_Report_v1_2026-11-26.md`.
Everything is **[Proposal]**. Nothing ran on your site. Nothing of the game file was edited.

---

## 1. What is ready for you

- **A test folder you upload yourself:** `engines/gmq-world/GMQ_Server_Test_Folder.zip`, with plain steps in `engines/gmq-world/READ_ME_FIRST.md`. About 20 minutes. Made-up cadets only. It goes beside your Math Skills engine; nothing else on your site changes.
- **What you can try there:**
  - a cadet's game on any device
  - task codes checked by the server
  - ship names that wait for you
  - older copies of a game, to bring back
  - (step 9) two pretend cadets battling each other's saved decks
- **The Commander's Desk** tells you, line by line, whether the server is set up safely. Each line is green, or says what to do.

## 2. What happened overnight

- **Faults found and fixed: 4, then 14, then 6.** First a test with 14 pretend children on two iPads each, then two independent reviews. The ones that would have hurt a real class:
  - a finished task could be lost when a cadet changed iPad (since the first server, 17 November)
  - real Thai names were refused: Pornthip, Siriporn, Supaporn, Kanokporn, and the nickname Poo
  - an older iPad could write its old game over a newer one
  - a child could be sent to the log-in box in the middle of a task
- **Cards between classmates, on the server:**
  - a class card board
  - battles against a classmate's saved deck, with the battle thread's own battle and your challenge rule
  - a card won pops up in the game with why it came
  - all of it off until you turn it on
- **"Check who won":** each challenge can be played again from its record on the Desk. A false claim is found out.
- **The game's side of the wiring** is ready for the main thread as tested code (10 exact changes). A child whose game moved to another iPad then sees "Your game is open on another iPad." and a button, "Bring it here".

## 3. Your decisions, the important ones first

1. **When to upload the test folder,** and where (the steps assume `educational-engines/gmq-test/`).
2. **Can a child lose a card while they are away?** Your rule: the winner takes both. Or: the classmate who is away never loses a card (the winner gets a copy). One switch on the Desk.
3. **What a class shares first:** the card board, friendly battles, or challenges.
4. **The teacher's lock:** any child who opens the Desk can type five wrong passwords and lock you out for ten minutes, as with your Math Skills engine.

The rest (names shown to classmates, a battle left unfinished, how long a log-in lasts, battle logs after a cadet is removed): the report, section 6 and section 9.

## 4. Something to check yourself (I did not look)

The Math Skills engine's notes say its student records are in `api/math-students/`, inside the web folder. Open that address in a browser. If it lists files, or a file opens, the records can be read by anyone.

## 5. Tested, and not

- **Tested here:** 14 checks, all passing at 16:13 UTC with the class link's version 103 (`checks/RUN_ALL.md`). The zip carries version 103. They include pictures at iPad and phone size, a whole grade of 60 pretend cadets, and your steps done word for word on the zip.
- **Not tested:** your server itself, PHP 7.4, a real iPad on school wifi, the AI (it stays off), and real children.
