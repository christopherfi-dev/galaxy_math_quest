# Live battles between classmates: a design note

**Date:** 28 November 2026. **From:** the server thread, with the battle thread. Its side is `proposals/GMQ_Card_Battle_Live_v1_2026-11-28.md`; section 9 here sums it up. **For:** Marc, and the main thread.
**A note only. Nothing is built.** Everything is **[Proposal]** unless it says [Source]. My choices are marked **[pick]**.

---

## 1. What Marc asked

[Source: Marc, 28 November] "My goal is to get the students want to play each other live on the server and battle each other. With their own cards."
[Source: the same day] Battles are rationed: "you only get the battle like two or three times and then you have to go and do more quests and some more problems even if it's just like the asteroid belt."
[Source: Marc, 23 November] A challenge: each child puts up one rare or epic card, picked at random. The winner gets both. A tie moves nothing. Each child sees the cards before agreeing.

## 2. The shape, in short

- **Two children, two iPads, one battle.** Each child plays their own turns on their own iPad, with their own cards.
- **Both iPads run the same battle.** The battle thread's engine is exact: the same start and the same choices always give the same battle. So each iPad sends only its own child's choices. The other iPad applies them, and both stay the same. This is called lockstep.
- **The server is a post office.** It deals the start, passes each choice to the other iPad in order, keeps the clock, and keeps the whole record. It does not play the battle: it is PHP, and the battle is JavaScript.
- **Afterwards, the battle is checked.** The record of both children's choices plays again on your Desk, as "Check who won" does today. Cards move only when both iPads report the same result.

## 3. A live battle, step by step

1. **Meeting.** Both children go to the battle room (the Launch Bay, where the main thread is putting the battle). Each sees which classmates are there now, by ship name. One taps "Battle" beside a name. The other sees "Blue Fox wants to battle you", and taps Yes or No. **[pick: meet in the battle room; option B: you pair them on the Desk]**
2. **The stakes.**
   - In a challenge, the server picks one rare or epic card from each deck, as it does today. Both children see both cards, and both must tap "I agree".
   - Either may back out before the battle starts, and then nothing moves.
3. **The deal.** The server sends both iPads the same start: one seed, both decks (from each child's own book), and both ships.
4. **The rounds.** Each round:
   - The leader picks a card. The server holds it until the other child picks too, and shows the leader's card to the other child before they choose. [Source: Marc's rule, one player leads]
   - Then the round asks its questions, in order, each to the child it belongs to: which parts a Spy hits, how a hit is shared, which part to repair.
   - Each answer goes to the server, and from there to the other iPad.
5. **The end.**
   - Both iPads report who won. If they agree, the server moves the cards at stake, as it does now. If they disagree, nothing moves, and you see it on the Desk.
   - The record can always be played again on the Desk.
6. **The count.** Each child has used one battle (section 7).

## 4. How the choices travel, on your plain PHP server

- **Polling [pick].** While a battle is open, each iPad asks the server about once a second, "anything new since choice 12?". Each answer is tiny.
  - 14 children, in 7 battles at once, make about 14 requests a second. Each reads one small file, so your server will hardly notice.
  - Tonight's measure was 60 cadets saving at once, with 4 ms for a save in the middle.
- **Waiting for an answer (long polling)** is an option: the server holds each question for up to 20 seconds until something new arrives. It answers faster, but it keeps one server worker busy for each child. On an ordinary Apache server, 14 children is fine either way.
- **A live socket (WebSocket) is not needed.** It would need a program running all the time on your server, a port and its own settings. That is more to look after, for very little gain with a turn-based game.
- **The log-in:** the same as for saving. That includes the class link from another site, with the log-in token (server 0.3.3).

## 5. What the server keeps and checks

- **One small file per live battle:**
  - the seats (which child is seat 0, which is seat 1)
  - the start (seed, decks, ships, stakes)
  - the list of choices, numbered, each with its seat, its round and the time it came
  - both children's last poll time
- **Order.** The server takes a choice only from the seat whose turn it is. Both iPads report the next expected step, and the server checks that the two agree. It accepts each choice number once, so a choice sent twice (a slow network) is not counted twice.
- **What each child may see.**
  - The leader's card is passed on only after the leader has picked. The follower's card is passed on only after both have picked.
  - The other child's hand never leaves the server as choices. But each iPad must hold both decks to run the battle (lockstep), so a child with the know-how could look inside their iPad. **[pick: accept it for Grade 3; the result is still checked on the Desk]**
- **The result** (section 3.5): both iPads must agree, and the record plays again on the Desk to the same end.

## 6. Time limits, and a dropped connection

- **Time to choose:** 1 minute for each choice **[pick, the battle thread's and mine]**, with a bar on both iPads. The other child sees "Blue Fox is choosing a card."
  - **When the minute is up, the server writes one move: "time is up".** Both iPads then let the computer make that one choice, at the same step.
  - The computer's choice uses the battle's own dice. So it must happen at the same place on both iPads, and only the server's numbered move makes sure of that. (The battle thread found this trap.)
  - The server keeps the clock, so a child cannot stop it by closing their iPad.
- **A dropped connection** (an iPad goes to sleep, the wifi drops):
  - While the child is away, each of their choices times out after its minute, and the computer makes it.
  - When the iPad wakes, it fetches every move so far, plays them again from the start (about a second), and the child goes on with their own choices.
- **A child who leaves, or is away for more than a minute:** **[pick, A]** the computer flies their ship to the end, and the battle counts. Your other options: **B.** the battle ends, nothing moves, and it does not count; **C.** it counts as a loss for the child who left.
- **Both children away for 10 minutes:** the battle ends, and nothing moves.

## 7. Battles are rationed [Source: Marc, 28 November]

- **Each child has a number of battles** that the server counts. The first **3** are free **[pick, his "two or three"]**.
- **More battles are earned by doing maths, never by waiting.** The server can see the progress in each saved game, so a page cannot simply claim more. One more battle for each of these **[pick; the numbers are yours]**:
  - 3 more tasks or finds done
  - or a quest finished
  - or 2 asteroid belts cleared (the belt the main thread is making harder, with 10 questions in 2 minutes)
- **The battle room shows how many battles are left,** and what earns the next one: "Clear 1 more asteroid belt for another battle."
- **Friendly and challenge battles** each use one. Live battles and battles against a saved deck (today's) share the same count **[pick]**.
- **On the Desk:** you see each child's count, and can give or take battles.

## 8. Kindness and safety

- **No typed messages between children.** Only the moves of the battle, and a few set words ("Good battle!", "Well played"). **[pick, as in the layers analysis of 22 November]**
- **Classmates are named by ship name,** as today, never by first name, unless you change that on the Desk.
- **Inside one class only.** Classes never meet.
- **On the Desk:** you see live battles as they happen (who, which round, the cards at stake). You can end one. One switch turns live battles off for the class.
- **A tie, and a loss, are said kindly,** as the battle thread does today.

## 9. The battle's side (the battle thread, 28 November)

From `proposals/GMQ_Card_Battle_Live_v1_2026-11-28.md`, section 10. Nothing of it is built yet.

- **Lockstep works.** Both iPads start with `GMQBattle.newBattle(rules, ship0, ship1, seed, [deck0, deck1], [lvl2_0, lvl2_1])` and get the same battle. The seed decides who leads round 1; then the lead takes turns.
- **A move:**
  - `{ n, round, seat, kind: 'card' or 'choice', value }`, or `{ n, round, seat, timeout: true }`
  - `n` is the server's running number. The piece applies moves strictly in order, and skips one it already has.
  - A card is its place in the hand. A choice is the parts a Spy hits, one part, five amounts, or a move from one part to another.
- **What each child sees:** the answering child sees only the leader's card before choosing. The leader does not see the answer until it is down. Each child places hits on their own ship only.
- **The piece would need:** `opts.live = { battle, seat, seed, decks, ships, lvl2, names, moves, seconds }`, plus `host.send(move)` and `GMQBattleOwn.receive(move)`.
- **Checking:** a two-sided record, `rec: [{ p: [card0, card1], c: [{ who, choice }] }]`, and a `replay` that reads it. Not built yet.

## 10. If you say go: the order of building

1. **The server:**
   - the battle room (who is here now), invites, the live battle file, the moves, the clock and the count
   - tested with pretend pairs: two clients each, 7 battles at once, an iPad that sleeps, a clock that runs out, a move sent twice, two results that disagree
2. **The battle thread:** live mode in the piece (two humans, the turned-round view, `receive`, a two-seat replay), tested with two browser windows.
3. **The main thread:** the battle room at the Launch Bay, the count of battles shown, wired in.
4. **On the test folder:** two pretend cadets on two iPads, then two real children with you watching.

## 11. What could prove this wrong

- **School wifi that drops often.** If iPads lose the server every minute, the computer will play too many choices. Then a longer time to choose, or battles against a saved deck, would suit better. Test it on the school wifi before a class does.
- **Children who want to battle anyone, any time.** The battle room only works when two children are there together. If they rarely are, battles against a saved deck (built today) may be the main kind, and live ones a treat.
- **The count feels like a wall.** If children stop doing quests when battles run out, the count needs a softer shape (for example a battle earned every few belts, shown as a bar filling up).
- **Polling.** If your server is far busier than I think, polling every second may be too much. The fix is long polling (section 4).

## 12. Decisions for you, shortest first

The battle thread's note asks the same questions, with the same picks.

| # | Decision | Pick |
|---|---|---|
| 1 | Time for each choice, before the computer chooses for that child | **1 minute** |
| 2 | Battles free before more quests | **3** ("two or three") |
| 3 | Does a live battle use one of them? | **yes**, the same count as other battles |
| 4 | A child who leaves, or is away more than a minute | **A: the computer flies their ship to the end**; or B: the battle ends, nothing moves; or C: a loss for that child |
| 5 | How children meet | **in the battle room, by invite** (or: you pair them on the Desk) |
| 6 | Friendly first, or challenges at once | **friendly live battles first**; challenges once friendly ones work in class |
| 7 | A child could look at the other's hand with the browser's tools (both hands are on both iPads) | **accept it for now**; the result is still checked |
| 8 | What earns one more battle | **3 tasks or finds, or a quest, or 2 asteroid belts**: your numbers |
| 9 | Set words between children ("Good battle!") | **yes, a few, no typing** |
