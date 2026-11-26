# Wiring the game to server 0.2 (and 0.3)

**Date:** 26 November 2026. **From:** the server thread. **For:** the main thread (the game), the cards thread (the card book) and the battle thread (the battle).
Everything is **[Proposal]**. The server is `engines/gmq-world/server/` (README there). No thread but the main thread edits the game file.

**Today's game already works with server 0.2.** `checks/server_game_test.js` passes with version 99 (the class link) and version 100; `checks/world_online_test.js` with version 100. Nothing below is needed to try the test folder. It is needed for two things: clear words when a game moves to another device, and cards between classmates.

---

## 1. For the main thread: small changes in the NET block (about 30 lines)

**Ready as tested code (26 November, night):** `engines/gmq-world/wiring/net_v03.js` holds all of section 1 as 10 exact changes, each with its reason (one, added after the review: the log-in box leaves the name to the server, which no longer refuses real names such as Siriporn, Pornthip or Poo). To make them: `node engines/gmq-world/wiring/apply.js prototypes/kis_station_sketch.html`. It refuses, and changes nothing, if the game has moved on and an old text no longer fits. `checks/server_wiring_test.js` makes them in a copy of the game and plays it against the server on an iPad and a phone:
- "Your game is open on another iPad." with "Bring it here"
- a reload takes a newer game, and asks at once if another device holds it
- nothing can be typed or tapped behind that box (today the game would answer "Finish this first. Or tap Leave.", and there is no Leave)
- the teacher's clear and bring-back reach the open device, with "Your Commander changed your game."
- a card that leaves or arrives in a challenge, and the news said once

Every card gets its mark just before a save is sent, so it does not matter how the card came (`card()`, the starter pack, practice credits, or anything added later). The changes fit version 102 (the cards wired in) and version 101.

The same section, in words:

All in the game's `NET` code (`netAdopt`, `netPush`, `netLogin`, `card`). Avoid `?.` and `??`.

### 1a. Send what the page knows, with every save

```
netCall({ action: 'save', state: S, rev: NET.rev, caps: ['rev', 'cards'] })
```

- `NET.rev`: the number the server sends back in `join`, `load`, `claim` and every good `save` (`r.rev`). Keep it in `NET.rev`, and also in `localStorage` under its own key (for example `gmq-net-rev`), so a reload knows it.
- `caps` tells the server this page understands the rules below. It is kept for the teacher's information. (Since server 0.3 a cadet can be in a challenge without it: the server's own list of moved cards keeps every book right, and only a card with its own mark is ever put up.)

### 1b. When a save is refused (status 409)

Today the bar says "not saved yet: no connection" (seen in `checks/server_game_test.js`). That is wrong, and the child has no way forward. Instead:

| The answer has | It means | The game should |
|---|---|---|
| `moved: true` | The cadet logged in on another device after this one. | Stop saving. Fill the picture with a short box: **"Your game is open on another iPad."** One button: **"Bring it here"**. The button calls `{ action: 'claim' }`; the answer is like `join`'s; take its `state` and `rev` and start the page again with them (as `netAdopt` does for a new device). |
| `newer: true` | The Commander cleared the game, or brought back an older copy. The answer holds the server's `state` and `rev`. | Take them, and start the page again with them. Say once: **"Your Commander changed your game."** |

Never write the refused game over the server's. The server keeps it as an older copy if it held more.

### 1c. When the same device logs in again

`netAdopt` keeps this device's game when `sessionStorage` says it is the same cadet. That is right only if the device's game is the newest. Compare: if the server's `rev` is bigger than the `rev` this device last saved (1a), take the server's game, as for a new device.

### 1d. Cards that moved

- **Every card gets its own mark** when it is earned: `u`, 8 random letters and digits, in `card()`. Give a mark to any old card without one when the game opens. A card without a mark can never be put up in a challenge.
- **A save answer may hold `cards`.** Then a card left in a battle, or arrived. Put `S.cards = r.cards`, redraw the card list, and save on the device (no need to wait).
- The server also fixes the card list on every save by itself, so an old page cannot bring back a card that left. The page only needs to show it.

### 1e. News from battles

`join`, `load` and `save` answers hold `news`: a list of `{ at, say }`, for example "Blue Fox challenged your deck, and your deck won! You got Void Vortex." Show each one once (the cards thread's pop-up is a good place, or a line in the log). Then call `{ action: 'news_seen' }`.

### 1f. The class settings, for the game

`join` and `load` answers hold `share: { board: true/false, battles: 'off' | 'friendly' | 'swap' | 'away-safe', show: 'ship' | 'first' }`. Show the card board and battle buttons only when they are on.

### Tests to update

- `checks/world_online_test.js` passes today. Add the new words (1b, 1e) to it after the wiring.
- `checks/server_game_test.js` prints what the child sees (the `SEEN` lines). After the wiring, turn those into checks.

---

## 2. For the cards thread: the card book and the class card board

**What the book needs from the server** (through a host function such as `netCall`, only when `NET.on`):

| Call | Answer | For |
|---|---|---|
| `{ action: 'board' }` | `{ off: true }`, or `{ classmates, show, cards: [{ key, kind, found_by, names }] }` | The class card board. `key` is the card's `id` (or its name for old cards). `names` holds at most five, ship names only (or first names, if the teacher chose that). Classmates with no approved ship name are counted, never named. |
| `{ action: 'deck', open: true/false }` | `{ deck: { open, cards } }` | A switch in the book: **"Classmates may battle my deck."** Off until the child turns it on. [pick] |
| `{ action: 'deck', uids: [u, u, ...] }` or `uids: null` | the same | Optional: choose which cards are in the deck. `null` means the whole book. |

**Rules for the board, from the cards brief:**
- A card the child has **not** found shows only as an empty shape, with "3 classmates found this". Never its picture or words. (The server sends the key. The page must not show the face.)
- No ranking, no "who has the most". [Source: Marc's rule: learning before speed]

**The book must handle:**
- a card that leaves (lost in a challenge) and one that arrives (won), through `cards` in an answer (1d)
- a copy: under "away cadet keeps card", a won card is a copy with a new mark

---

## 3. For the battle thread: a battle against a classmate's saved deck

**Done by the battle thread on 26 November** (`proposals/GMQ_Card_Battle_Wiring_v1_2026-11-26.md`, section 8): `GMQBattleOwn.open(host, { ..., rival }, done)` takes the server's `battle_start` answer, shows both cards at stake with "I agree" and "Back out", calls `host.accept`, and ends with `done({ why, result, log })`. The server's test page (`engines/gmq-world/server/cards-test.html`) uses it, and `checks/server_cards_page_test.js` plays it with the server. Two things added on the server's side since:
- `rivals` now also answers `mine`: the cadet's own battle still open, in the same shape as `battle_start`, so a page closed and opened again can go back to it (the piece goes on from the same `battle` id).
- `battle_end` keeps a `log` in words (the piece's), up to 20,000 letters; the teacher reads it on the Desk.
- Still asked of the battle thread: the words "The winner gets both cards" are right only for the rule `swap`. The server's `battle_start` answers `rule` (`'swap'` or `'away-safe'`); the test page passes it as `rival.rule`. Under `away-safe` the words could be: "If you win, you get a copy of their card, and they keep theirs. If their deck wins, your card goes to them."

The calls, as first written:

The battle itself is yours, and its rules are Marc's. The server keeps decks, picks the cards at stake, moves cards, and tells the classmate who was away.

**The calls, in order:**

| Call | Answer |
|---|---|
| `{ action: 'rivals' }` | `{ battles, can_challenge, rivals: [{ rival, name, deck, friendly, challenge, busy }] }`. `rival` is a mark, never a name. Only classmates who opened their deck and have an approved ship name. |
| `{ action: 'battle_start', rival, kind: 'friendly' \| 'challenge' }` | `{ battle, kind, rule, status, seed, minutes, you: { deck, stake }, rival: { name, deck, stake } }`. A friendly battle has `status: 'on'` at once. A challenge has `status: 'offered'`: **show both cards at stake first** [Source: Marc: "each player sees it before agreeing"]. |
| `{ action: 'battle_accept', battle }` | `{ status: 'on' }`. Now it counts. |
| `{ action: 'battle_cancel', battle }` | Backing out, only before agreeing. Nothing moves. |
| `{ action: 'battle_end', battle, result: 'won' \| 'lost' \| 'tie', log, record }` | `{ result, moved, cards }`. `result` is from the challenger's side. `log` is optional and small (under 20,000 characters): what happened, for the teacher. `cards` is the challenger's new card list. |

**What the battle piece needs to do:**
- play the rival's deck by the computer, from `rival.deck`, with `seed` if it wants the same deal again (a later check could replay a battle from it)
- show the cards at stake before `battle_accept`, and let the child back out
- finish within `minutes` (20). A battle not finished in time ends with nothing moved. [pick; Marc's decision]
- one battle at a time for each cadet, and a cadet whose deck is being battled cannot be battled by another (`busy`)
- at most 6 battles started in an hour by one cadet [pick]

**Errors a child may meet** (show the server's `error` words; they are written for children):
"That classmate is in another battle. Try again soon." · "Finish your other battle first." · "You need a rare or epic card in your deck to challenge." · "That is enough battles for one hour. Try again later."

**Checking who won (closed on the Desk, 26 November, night):** send `record` (the battle piece's `result.record`: `{ start, rec }`) with `battle_end`. The server keeps it with the decks it dealt. The Desk's "Check who won" builds the classmate's deck again from those cards and the server's seed, plays the record again with `GMQBattle.replay`, and compares the winner with the one claimed (`checks/server_battle_check_test.js`). A battle ended without a record cannot be checked.

---

## 4. Every call, in one table

Cadet calls need a log in (`join`). Teacher calls (`t_...`) need the teacher's log in.

| Call | New in 0.2 | Notes |
|---|---|---|
| `health` | yes | Anyone. What works; never a path, a key or a name. |
| `join`, `load`, `logout` | `rev`, `news`, `share`, `newest` added | `join` makes this device the one that saves. |
| `save` | `rev`, `caps`; answers 409 `moved` / `newer`; answer may hold `cards`, `news` | |
| `claim` | yes | "Bring it here". |
| `code`, `name`, `ask` | | As in 0.1. |
| `board`, `deck`, `rivals`, `battle_start`, `battle_accept`, `battle_cancel`, `battle_end`, `news_seen` | yes | Off until the teacher turns them on. |
| `t_setup` | yes | The first time only, with the setup word from `config.php`. |
| `t_login`, `t_classes`, `t_new_class`, `t_class`, `t_name`, `t_reset` | `t_set` takes `board`, `battles`, `show` | `t_reset` keeps a copy before clearing. |
| `t_backups`, `t_restore`, `t_board`, `t_battles` | yes | Older copies; every card and battle, with first names, for the teacher only. |
