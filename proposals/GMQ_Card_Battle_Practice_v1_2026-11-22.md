# The practice battle: you against the computer

**Date:** 22 November 2026. **For:** Marc. **From:** the battle thread. **Step C of three.**
**Play it:** `docs/battle/index.html` (the same file is `prototypes/card_battle.html`).
**The cards:** `docs/battle/cards.html`.

You said: "I think we just do all 50. Just try them all. Me and the CPU each get the 50 cards and they come out randomly?"
Then, after seeing it: "One player goes first, it's randomized. They play their card and the other player has a chance to respond... In the next round the player who went second goes first." And: "For this battle everybody just has one Spy card."

And: "A common card and a rare card cannot block a gold card attack. And a common card cannot block a rare card."

**All three are in.** The rules are yours. Every point you have not decided is a switch. Nothing is in the game.

---

## 1. What it is

- **One page.** It runs on an iPad, upright or sideways, with no network.
- **You against the computer.** Two children on one iPad is not built yet.
- **Each player has their own deck of 45 cards,** shuffled: every attack, defence and repair card, the 5 Level 2 upgrades, **1 Spy card and 2 Guards**.
  - The Spy is one of the seven Spy cards, drawn at random for each player.
  - You said the Policemen should be at least as many as the Spies, better more. So: 2 to 1.
- **A hand of 5.** A played card goes to the bottom of its own deck. You draw back up to 5.
- **A Main Shield of 100,** and a ship of five parts. You choose the kind of each part on the first screen.
- **The game is saved on the iPad** at the start of each round. Close it and open it again: you are back in the same round, with the same hand.

## 2. How a round goes on the screen

1. **One player goes first.** In round 1 that is chance. After that you take turns.
2. **The first player puts a card on the table.** The other sees it, then answers with a card.
   - When the enemy goes first, its card is on the table before you choose.
   - When you go first, the enemy sees your card, then answers.
3. **A Guard stops a Spy** when both are on the table.
   - **A block card stops an attack card only of its own kind, or a lower one.** The page warns you before you play a block card that cannot work.
4. **A Spy that is not stopped acts first.** If it is yours, you tap the enemy part to hit.
5. **Repair and shield cards work.**
6. **You work out your attack** and press Check.
7. **The attack lands.** If a shield is up, you work out what is left of it.
8. **If your shield is gone, you share the enemy's attack out between your parts.** Then you work out the HP left on each.

**The picture** shows both ships, every part with its HP and AP, both shields and the two cards. **The desk** has the words, the number boxes, a number pad and the buttons. The page does not scroll.

## 3. The child does the maths

[Source: you, 21 November: "students should have to click check. We shouldn't show them the adding for them."]

- **Nothing is added up on the screen.** The ship's AP total is not shown. The attack is not shown until the child has worked it out.
- **A wrong answer** gets "Not yet. Try again." A second wrong answer gets a hint in words, never the number.
- **A split that does not add up** is not accepted.
- **"Show the sums"** is a switch for adults. It is off. With it on, the page does every sum, and a battle takes a few minutes. Use it to try rules quickly.

## 4. The switches

Open **Rules** on the page. A change starts with the next battle.

| Switch | Choices (the first is the default) | Where it comes from |
|---|---|---|
| **Who puts a card down first** | one player leads and the other answers, taking turns; both together, and a Guard may be swapped in; both together, and a Guard is a guess | **you, 22 November** |
| **Spy cards in each deck** | 1, drawn at random; all 7 | **you, 22 November** |
| **Guard (Policeman) cards in each deck** | 2; 1 | **you, 22 November** (2 is my reading of "more") |
| **A block card stops an attack card only of its own kind, or lower** | yes; no | **you, 22 November** |
| **The same for a Guard against a Spy card** | no; yes | not said yet |
| **"Lose 1 card"** (Engine or Navigation lost) | one card thrown away, once; the hand is one card smaller | rules sheet 5 |
| **"Cannot defend"** (Shield Generator lost) | defence cards stop; defence cards and the Main Shield stop | rules sheet 5 |
| **A repair may lift a part above its full HP** | no; yes | my guess |
| **The Main Shield may pass 100** | no; yes | my guess |
| **A broken Main Shield can be rebuilt by** | Shield Reborn only; any shield card | my guess |
| **Cards that add to the Main Shield count as** | repair (need the Power Module); defence (need the Shield Generator) | my guess |
| **Level 2 upgrade cards are in the decks** | yes; no | my guess |
| **A battle ends with no winner after** | 60 rounds; 30 rounds | my guess |
| **The computer player** | gentle; clever | not a rule |
| **Show the sums** | off; on | you, 21 November |

**The first four are your rulings.** For the others, the lit choice is only where the page starts: none of them is decided.

**Not switches, because the rules sheet does not reach them yet** (levels above 2): the shield growing to 140, 220 and 360, and the hand growing to 6, 7 and 8.

## 5. Things I had to settle to make it run [Proposal: each is yours to change]

Your rules sheet does not say these. The page needs an answer, so I chose the plainest one.

1. **Both ships lose their last part in the same round: nobody wins.**
2. **An attack may only be put on working parts.** Otherwise a player could put every hit on a part that is already lost.
3. **A block comes off the attack before it reaches the shield.**
4. **Inside a round the order is:** the Guard, then Spies, then repairs and shields, then both attacks at once. A part lost to a Spy is lost for the rest of that round.
5. **"Lose 1 card" throws away a card at random,** at the moment the part is lost. It is never the card on the table.
6. **An upgrade card played in a battle** makes that part Level 2 until the battle ends: HP +4, AP +3. A second one on the same part does nothing.
7. **A Spy played second cannot be stopped.** The first player has already put a card down. That follows from your rule; it is not a choice of mine.
8. **Both ships still attack every round,** whoever went first.
9. **The block rule compares the two cards on the table.** If the other player played no attack card, their ship's plain attack can be blocked by any block card.
10. **A block card that is too low blocks nothing at all.** A card with two jobs (Hit and Hide, Patch and Block) still does its other job.

## 6. What 120,000 battles between two computer players showed

Two Standard ships, your rules, the default switches. 4,000 battles for each line.

| | Two gentle players | Two clever players |
|---|---|---|
| **Length** | 9 rounds in the middle; from 5 to 13 | 9 rounds in the middle; from 4 to 13 |
| **A ship wins** | 78 in 100 | 80 in 100 |
| **Nobody wins** | 22 in 100 | 20 in 100 |
| **A ship has no Weapons by round 8** | 1 in 100 | 2 in 100 |

- **A clever player beats a gentle one** 59 times in 100, loses 23, and 19 end with no winner.
- **Who leads round 1** came out 1,003 to 997 in 2,000 battles.

### Is it better to go second?
You said: "It's almost better to go second on the first turn, because you can probably block the person's best thing."
- **Between two computer players it makes no difference.** In 6,000 battles the player who went first in round 1 won 41 in 100, and the one who went second 40 in 100. With gentle players it was 39 and 39.
- **Why:** the lead passes every round, so each player answers half the rounds.
- **But the computer is not a person.** It does not save its best card for a round when it answers. A child who learns to do that may well do better going second. Only play will show it.
- **Your block rule makes answering matter more.** A common block card is wasted against a rare attack card, so the player who answers must look at the kind of the card on the table.

### Your ruling on the Spy fixed the biggest problem
- Before, with seven Spy cards in a deck, a clever player took the other ship's Weapons by round 8 in **32 battles in 100**. A ship with no Weapons cannot attack.
- With one Spy card each, it is **2 in 100**.
- No battle now runs past 13 rounds.

### Two things still for you to rule on

**0. Does the block rule hold for a Guard against a Spy card too?**
- A Guard is common. Three of the seven Spy cards are rare and one is gold.
- If the rule holds, a Guard stops only a common Spy.
- The page says no: any Guard stops any Spy. There is a switch.

**1. Both ships often fall in the same round.**
- It happens in about 20 battles in 100. Both ships attack every round with nearly the same numbers, so they often lose their last part together.
- **Your rules sheet does not say who wins then.** The page says "nobody wins".
- Choices: nobody wins; or the ship with more HP left at the start of that round wins; or the player who went second that round wins; or play one more round.

**2. One point of shield stops a whole attack.**
- This is your "nothing carries over" rule. It makes a shield card worth either nothing or a whole attack.
- The page lets a plain shield card work only while the shield is still up. The switch "any shield card" shows the other way.

## 7. What is not built

- **Two children on one iPad.** Your first handoff asked for it; your brief said it can come later.
- **Levels 3 to 10,** and what they do to the shield and the hand.
- **Fun battles and challenge battles.** Nothing is at stake here.
- **Your own deck.** Both players have the same 45 cards, apart from which Spy card each draws.
- **Sound.**

## 8. What could prove this wrong

- **The computer player is not a child.** It never forgets a rule and never makes a sum wrong. Real battles will be slower and messier.
- **The numbers in section 6 come from one way of playing.** A different computer player would give different numbers. The clever one always gives up its least useful part; a child may not.
- **A battle with every sum by hand is long.** A round can ask for five or six sums. I have not timed a child. If it is too long, the sums could be asked for the child's own ship only.
- **On a phone the picture is small.** It is built for the iPad.
- **If a child closes the page in the middle of a round,** that round starts again. The computer may then choose a different card.

## 9. What I need from you

1. **Play it.** Then tell me what felt wrong.
2. **Both ships falling together:** who wins?
3. **Guards:** 2 in each deck, or 1? And does your block rule hold for a Guard against a Spy?
4. **One line** of permission to push my own files to the main branch. Then the page has a link for the iPads: `/battle/`.

## 10. Checks

- **Ran:** `node checks/battle_engine_test.js`. It plays your rules, computer against computer: all 24,576 combinations of switches, 4 battles each, then 24,000 more. After every round it checks that no HP or shield went below 0, that nothing carried over past a shield, that a lost part's penalty held, that a stopped Spy did nothing, and that each deck still had its 50 cards. It also checks that each deck has the Spy and Guard cards the switches say, that who leads round 1 is chance, and that the lead passes each round. It tests your block rule case by case: common against rare, rare against gold, and each kind against its own. Every battle ended. 28 million checks, all pass.
- **Ran:** `node checks/battle_page_test.js`. It plays the page as a child would, at iPad sideways, iPad upright and phone size: a wrong sum, a second wrong sum, a split that does not add up, closing the page between rounds and in the middle of a round, then a whole battle to its end, and a few rounds of each other way to play the Policeman. 380 checks, all pass, three runs in a row. It checks that the enemy's card is on the table before you choose when the enemy goes first, and is not shown when you go first.
  - **A fault in my own test, found and fixed:** it stalled once in three runs. The cause was a wait in the test that sometimes never returned. The game was not at fault.
- **Ran:** `python3 checks/battle_cards_set_check.py` (51 checks) and `node checks/battle_cards_page_test.js` (42 checks). They also check that the battle page carries the same cards and drawings as the cards page, and that neither page loads anything from outside.
- **Looked at:** the screens myself, at all three sizes.
- **Did not run:** the game's play tests. Nothing in the game was touched.

## 11. The independent review

A reviewer saw only your rules sheet and 27 pictures of the screens. It worked out about 45 numbers again from the pictures and the log.

**What it confirmed:**
- **Every number on the screens is right.**
- **No answer is given away,** on any sum or split screen. The hint after a wrong answer does not give it either.
- **The Check button is always in view.** The picture is filled, and nothing covers it.

**What it found, and I fixed:**
- **An upgrade card said "Not played in a battle"** while being played. It now says "Makes one part Level 2".
- **One sum asked nothing:** "Your Engine has 1. It takes 6." It now ends "HP left?", and the words above say a part cannot go below 0.
- **The end screen showed the wrong round number.** It now shows the round in the log.
- **On a phone, a split across five parts hid three rows.** All five now show. A test checks it.
- **"Lose 1 card"** happened at the end of the round. Your sheet says "at that moment". It now does.
- **The rules and log screens** had their Back button below the fold. There is one at the top too.
- **A lost part** showed ghost text behind the word LOST.
- **Words:** the first screen called the other ship friendly and the battle called it "the enemy"; "HP" and "AP" were never explained; the Policeman switch was hard to follow. All reworded.
- **After three wrong tries at an attack,** the hint now lists the AP numbers to add. It never gives the total.

**What it found, and I left for you:**
- **"All" on a split** puts the whole attack on one part with one tap. That skips no sum (the HP left is still asked), but it is also the best move under your split rule.
- **The hand of five small cards** cannot be read until a card is tapped.
- **There is no "no limit" choice** for the length of a battle. Without a limit I cannot promise that every battle ends.
- **The enemy's Spy card reads "You choose it"** on the table. On the enemy's card, "you" is the enemy.

**It did not see:** the tapped-card view, the "How" screen, and the end screen with the sums off.
