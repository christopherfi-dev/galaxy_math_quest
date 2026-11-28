# Live battles between classmates: the battle's side

**Date:** 28 November 2026. **From:** the battle thread. **For:** Marc, the server thread (it leads the note, `proposals/GMQ_Server_Live_Battle_v1_2026-11-28.md`) and the main thread.
**A note only. Nothing is built. No rule changes.** Everything is **[Proposal]** unless it says [Source]. My picks are marked **[pick]**.

[Source: Marc, 28 November: "my goal is to get the students want to play each other live on the server and battle each other. With their own cards." And: "the whole point of the battles is you only get the battle like two or three times and then you have to go and do more quests."]

---

## 1. What a live battle is

- Two children, two iPads, each with their own cards and their own ship.
- Each child makes their own moves. Nobody plays for them (unless a child leaves, section 5).
- **Marc's rules, unchanged:** one player leads and the other answers, after seeing the leader's card; who leads round 1 is chance; both attacks land together; the defender chooses which parts take a hit; one Spy in each deck; a tie is a tie.

## 2. The moves in one round

A round needs up to six choices. The battle already asks each of them, one at a time, in a fixed order:

| Step | Who chooses |
|---|---|
| 1. The leader's card | the leader |
| 2. The answering card | the other child, after seeing step 1 |
| 3. Where a Spy hits | the Spy's owner |
| 4. Which part a repair card mends (and how a share or a move goes) | that card's owner |
| 5. How a hit is shared out (no shield left) | the defender: both children can be doing this at the same time |
| 6. Next round | both |

Today the computer makes the other side's choices. In a live battle a classmate makes them.

## 3. How the two iPads stay the same: one way to do it

**[Proposal: lockstep, as the main thread suggested. A suggestion, not a decision.]**

- **The same start on both iPads:** the server sends both the same seed, both decks and both ships (as `battle_start` already does for a battle against a saved deck).
- **Each choice is a small message:** for example "round 3, your card: the 2nd in your hand", or "round 3, the hit: 10 on Engine, 5 on Power". The server passes it to the other iPad.
- **Both iPads run the same battle** with the same choices, in the same order. So both show exactly the same thing. The battle is already built so that the same start and the same choices give exactly the same battle: 1,500 battles played again from their records ended the same (26 November).
- **The record is the list of choices.** The server keeps it. That is also how a result is checked (section 6).
- **What the server must do** (the server thread's part): start a live battle, pass each choice on, tell an iPad when the other side has chosen, and keep the list. Marc's host runs PHP, so an iPad asks the server every second or two whether a choice has come ("polling").

**What could prove this wrong:** both iPads hold the whole battle, so both decks and both hands are on each iPad. A child with the know-how could look at the other's hand with the browser's tools. For a Grade 3 class that may not matter (section 7, decision 3). The other way, where only the server holds the battle, needs the battle to run on the server, in PHP: a large rewrite of the rules, and a second copy to keep the same.

## 4. What the child sees

- **Waiting:** "Blue Fox is choosing a card." or "Blue Fox is placing the hit." The ships hold still. Nothing to tap but Leave.
- **A clock for each choice:** a bar that shortens, the same on both iPads. When it runs out, the computer makes that one choice for the child (as it does today), and the battle goes on. [pick: 1 minute for a card, 1 minute for placing a hit]
- **Both ships move together** on both iPads, after both cards are down.
- **Each child sees their own ship at the bottom** (or on the left), and the other's ship named with its ship name, not "the enemy". [pick]

## 5. Leaving, and a dropped connection

- **A dropped connection** (school wifi): the iPad keeps trying. When it is back, it asks the server for the choices it missed, plays them (as a record is played again), and goes on where the battle is.
- **A child who leaves, or does not come back within a minute:** [pick] the computer flies their ship to the end, as it does for a saved deck, and the battle counts. Other choices in section 7.
- **The game is closed in the middle:** opened again, the battle goes on from the server's list of choices.

## 6. Checking the result

- Both iPads work out the same result. Each sends it; the server compares the two.
- The server holds every choice, so the teacher's Desk can play the battle again and check it (as it does now for a battle against a saved deck: "Check who won").
- A choice the rules do not allow (a changed page) is refused by the other iPad's battle and by the check.

## 7. Decisions for Marc, shortest first

1. **How long for each choice?** [pick: 1 minute; then the computer chooses for that child, once]
2. **Does a live battle use up one of the 2 or 3 battles?** [pick: yes, the same count as practice battles]
3. **May a child see the other's hand with the browser's tools?** Lockstep puts both hands on both iPads. [pick: accept it for now; a server that holds the battle can come later if it matters]
4. **A child leaves or drops out for more than a minute:**
   - **A.** [pick] The computer flies their ship to the end; the battle counts.
   - **B.** The battle ends; nothing moves; it does not count.
   - **C.** It counts as a loss for the child who left.
5. **Friendly first, challenge later?** [pick: friendly live battles first; challenges when friendly ones work in class]

## 8. What the battle piece would need (for later; not built)

1. **A side played by a person on another iPad:** today the page asks the computer for the other side's card and choices; it would wait for a message instead. The battle rules do not change.
2. **A way to send and receive choices**, given by the game (like the trade market's host): `host.send(choice)`, and the piece is told when one arrives. The piece stays free of the network; the server thread's code moves the messages.
3. **Waiting screens and the clock** (section 4).
4. **Each child's own view:** the page draws the child's ship as "you" on side 0. On the second iPad the child is side 1. The page would draw from that child's side. About 30 places in the page assume the child is side 0.
5. **Names:** the other ship carries its ship name.
6. **Tests:** two browsers in one test, one battle, every choice passed through a stand-in server; a dropped connection; the clock running out; leaving.

**Size:** items 1 to 3 are moderate. Item 4 is the largest part. Together, more work than the battle against a saved deck was.

## 9. What is already there to build on

- The same start and the same choices always give the same battle (`GMQBattle.replay`, 1,500 battles checked).
- A record of every choice, sent with each battle's result.
- A battle against a classmate's saved deck, with the server's `battle_start`, `battle_accept`, `battle_end`.
- The teacher's "Check who won", playing a record again.

---

## 10. Answers to the server thread's five questions (28 November)

The server thread leads the note (`proposals/GMQ_Server_Live_Battle_v1_2026-11-28.md`). These are the battle's facts it asked for. "The engine" is `GMQBattle`, in the battle page and inside the piece.

**1. Lockstep: yes.**
- **The same start:** both iPads call `GMQBattle.newBattle(opts, ship0, ship1, seed, [deck0, deck1], [lvl2_0, lvl2_1])` with the same values. Opts are Marc's defaults (`GMQBattle.defaults()`). The two states are then identical, down to the shuffled decks and who leads round 1.
- **Who leads:** the state holds it (`S.leader`, 0 or 1). Round 1 is drawn from the seed; after that the lead passes every round. Both iPads know it without a message.
- **One player's moves in a round, in this fixed order** (`GMQBattle.steps(S)`; for each step `GMQBattle.need(S, step)` says whose choice it is, `req.who`, and what kind):
  1. a card: its place in that player's hand, counted from 0 (the leader first; the other after seeing it);
  2. for each step that asks: `targets` (the parts a Spy hits: a list of part numbers 0 to 4), `part` (one part number: the part a repair mends, or a lost part brought back), `amounts` (five numbers: how a hit or a share is spread over the five parts), `move` (`{ from, to, n }`: HP moved from one part to another).
  - Each choice can be checked with `GMQBattle.validate(S, req, choice)`: an empty answer means allowed.
  - Two hits can be placed at the same moment (both shields down): the engine takes player 1's hit first, then player 0's; each child places only their own.
- **The dice:** with two people and no computer, the engine rolls only in rules both iPads apply at the same point: "lose 1 card" (a random card thrown away when an Engine or Navigation is lost) and, on another switch, the hand shrinking. So the two iPads stay identical.
- **The one trap: the computer rolls dice too.** When the computer chooses for a child (`GMQBattle.cpuPick`, `cpuChoose`), it may roll the dice. So a timed-out choice must happen **on both iPads at the same step**: the server decides "time is up" and sends it as a move (`{ timeout: true }`); both iPads then ask the computer for that one choice. Never let one iPad decide it alone.
- **Playing a live battle again:** today `GMQBattle.replay` takes player 0's choices and lets the computer play player 1. For two people it needs both players' choices: `rec: [{ p: [card0, card1], c: [{ who, choice } ...] } ...]`, in the order the engine asks. A small addition to the engine, with the same checks (1,500 battles), when live battles are built. Not built now.

**2. Hidden information.** Under "one player leads", the answering child sees only the leader's card (its face) before choosing. Nothing else of the leader's: not the hand, not the deck. The leader must not see the answer until it is down. After both cards are down, every choice in the round plays out in front of both children (a Spy's targets, a repair, a hit), so the server may pass those on at once. Each child places the hit on their own ship only, so neither needs the other's placement first. (Both decks and hands sit on both iPads in lockstep: section 3 and decision 3.)

**3. Waiting.** [pick] 1 minute for each choice, shown as a shrinking bar on both iPads. Then the server sends `{ timeout: true }` and the computer makes that one choice for the child. The page shows: "Blue Fox is choosing a card." or "Blue Fox is placing the hit.", the bar, and Leave. Marc decides the time (decision 1).

**4. A dropped connection: yes.** The computer can take over from the last agreed move: the server sends `{ timeout: true }` for each of that child's choices while they are away, and both iPads apply it. When the child comes back, their iPad fetches every agreed move, plays them from the start (as a record is played again; about a second for a whole battle), and the child makes their own choices again from the next one.

**5. What `open()` would need** (a proposal for the build, not built):
- `opts.live = { battle, seat: 0 or 1, seed, decks: [d0, d1], ships: [s0, s1], lvl2: [l0, l1], names: [n0, n1], moves: [the agreed moves so far], seconds: 60 }`. Seat 0 is engine side 0 on both iPads; each iPad draws the battle from its own seat.
- `host.send(move)`: the piece hands the child's move to the game, which sends it to the server.
- `GMQBattleOwn.receive(move)`: the game hands in each move from the server, in order.
- A move: `{ n, round, seat, kind: 'card' | 'choice', value }`, or `{ n, round, seat, timeout: true }`. `n` is the server's running number: the piece applies moves strictly in that order and ignores a number it has already applied.
- `host.over(result)` and `done(result)` as now, with the record of both players' moves.
