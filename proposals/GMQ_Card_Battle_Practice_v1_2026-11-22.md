# The practice battle: you against the computer

**Date:** 22 November 2026 (rebuilt the same day, after you played the first one). **For:** Marc. **From:** the battle thread. **Step C of three.**
**Play it:** `docs/battle/index.html` (the same file is `prototypes/card_battle.html`).
**The cards:** `docs/battle/cards.html`.

**The rules are yours.** Every point you have not decided is a switch. Nothing is in the game.

---

## 1. What you said, and what I changed

You played the first version and said it was not fun: too much maths, cards hard to tell apart, not clear.

| You said | Now |
|---|---|
| "You could tell right away if something is a shield or attack or the policeman or a spy because of the symbol." | **One big symbol on every card:** a laser gun, a shield, a heart, a spy, a policeman holding a STOP sign. They are new drawings of your five ideas. |
| "The color of the card should be around the rim." | **A thick rim in the colour of the kind:** green for common, purple for rare, gold for gold. Those are your 2023 colours. |
| "It's too much math... The only real math the student needs to do is to decide which attacks go where." | **The page does every sum.** The player's one job is to share an attack out between their parts. |
| "We also shouldn't need to calculate the enemy's math." | Nobody works out the enemy's numbers. |
| "Your five cards should be easy to see in the middle of the screen." | **The hand is in the middle,** large. On an iPad held sideways each card is about 200 points wide (about 180 when the enemy's card lies beside them). |
| "Your shield is lit up and it shows how much is left." | **A glowing bar:** "MAIN SHIELD 45". It goes dark when the shield breaks. |
| "Your attack points in the top corner." | **Top left:** "YOUR ATTACK 55". When you play a card it shows "65", and "55 + 10" beside it. |
| "At the bottom are your five ship parts... you have to know what each one does when they lose something." | **Five parts along the bottom.** Each shows its HP, its AP, and its rule from your board: "If lost: cannot attack". |
| "We need some sort of animation. A little laser shooting or a little Spy." | **A laser fires** from the Weapons part to what it hits. **A Spy flies** from its card to the part. The damage floats up as a number. |
| "One player goes first, it's randomized... the other player has a chance to respond." | Done. Who goes first in round 1 is chance. After that you take turns. |
| "For this battle everybody just has one Spy card." | **One Spy card in each deck,** and two policemen. |
| "A common card cannot block a rare card. A common and a rare card cannot block a gold card." | Done. The page marks such a card "cannot block" before you play it. |

**One thing I could not act on:** your last sentence was cut off. "Also like... my card should be like three". Three what?

---

## 2. How a round goes

1. **One player goes first** and puts a card down.
   - When the enemy goes first, its card lies beside your hand, as large as your own cards.
2. **The other answers** with a card.
3. **A policeman stops a Spy** when both are on the table.
4. **A Spy that is not stopped acts first.** If it is yours, you tap the enemy part to hit.
5. **Hearts repair.**
6. **Both ships attack.** The page adds up the AP and the card.
7. **The attack hits the shield first.** If the shield is gone, **you share the enemy's attack out between your parts.**
   - A number box stands over each part. Your numbers must add up to the attack.
   - "All here" puts the whole attack on one part.
8. **Next round.** The other player goes first.

**The deck:** each player has their own 45 cards, shuffled, and holds 5. A played card goes to the bottom of its deck.
**Saving:** the battle is saved on the iPad at the start of each round.

---

## 3. The switches

Open **Rules** on the page. A change starts with the next battle.

| Switch | Choices (the first is the default) | Where it comes from |
|---|---|---|
| **Who puts a card down first** | one leads and the other answers; both together, policeman swapped in; both together, policeman as a guess | **you, 22 November** |
| **Spy cards in each deck** | 1, drawn at random; all 7 | **you, 22 November** |
| **Policemen in each deck** | 2; 1 | **you, 22 November** (2 is my reading of "more") |
| **A block card stops an attack card only of its own kind, or lower** | yes; no | **you, 22 November** |
| **The same for a policeman against a Spy card** | no; yes | not said yet |
| **"Lose 1 card"** (Engine or Navigation lost) | one card thrown away, once; the hand is one card smaller | rules sheet 5 |
| **"Cannot defend"** (Shield Generator lost) | defence cards stop; defence cards and the Main Shield stop | rules sheet 5 |
| **A repair may lift a part above its full HP** | no; yes | my guess |
| **The Main Shield may pass 100** | no; yes | my guess |
| **A broken Main Shield can be rebuilt by** | Shield Reborn only; any shield card | my guess |
| **Cards that add to the Main Shield count as** | repair; defence | my guess |
| **Level 2 upgrade cards are in the decks** | yes; no | my guess |
| **A battle ends with no winner after** | 60 rounds; 30 rounds | my guess |
| **The computer player** | gentle; clever | not a rule |

---

## 4. Things I had to settle to make it run [Proposal: each is yours to change]

1. **Both ships lose their last part in the same round: nobody wins.**
2. **An attack may only be put on working parts.**
3. **A block comes off the attack before it reaches the shield.**
4. **Inside a round the order is:** the policeman, then Spies, then repairs, then both attacks at once.
5. **"Lose 1 card" throws away a card at random,** at the moment the part is lost.
6. **An upgrade card played in a battle** makes that part Level 2 until the battle ends.
7. **A Spy played second cannot be stopped.** The first player has already put a card down. That follows from your rule.
8. **Both ships attack every round,** whoever went first.
9. **The block rule compares the two cards on the table.** If the other player played no attack card, any block card works against the ship's plain attack.

---

## 5. What 120,000 battles between two computer players showed

Two Standard ships, your rules, the default switches.

| | Two gentle players | Two clever players |
|---|---|---|
| **Length** | 9 rounds in the middle; from 5 to 13 | 9 rounds in the middle; from 4 to 13 |
| **A ship wins** | 78 in 100 | 81 in 100 |
| **Nobody wins** | 22 in 100 | 19 in 100 |
| **A ship has no Weapons by round 8** | 1 in 100 | 1 in 100 |

- **Your ruling on the Spy fixed the biggest problem.** With seven Spy cards in a deck, a clever player took the other ship's Weapons early in 32 battles in 100. With one, it is 1 in 100.
- **Going first or second in round 1 makes no difference between two computer players:** 41 in 100 against 40. The lead passes every round. A child who saves their best card for a round when they answer may do better; only play will show.

### Still for you to rule on

1. **Both ships fall in the same round in about 20 battles in 100.** Your rules sheet does not say who wins then.
   - Choices: nobody; the ship with more HP at the start of that round; the player who went second; one more round.
2. **Does your block rule hold for a policeman against a Spy card?** The policeman is common. Three Spy cards are rare and one is gold.
3. **"My card should be like three..."** How does that end?

---

## 6. What is not built

- **Two children on one iPad.**
- **Levels 3 to 10.**
- **Fun battles and challenge battles.**
- **Your own deck.** Both players have the same 45 cards, apart from which Spy card each draws.
- **Sound.**

## 7. What could prove this wrong

- **I have looked at the new screen; a child has not.** You know in ten seconds whether it is clear. I cannot.
- **The computer player is not a child.** The numbers in section 5 come from one way of playing.
- **With the sums gone, a battle is quick:** a few minutes, by my guess. I have not timed one. If it is now too thin, one sum could come back (the player's own attack, say).
- **On a phone the hand is in two rows and the parts are small.** It is built for the iPad.
- **A battle closed in the middle of a round** starts that round again.

## 8. Checks

- **Ran:** `node checks/battle_engine_test.js`. Computer against computer: all 24,576 combinations of switches, then 24,000 more battles. After every round: no HP or shield below 0, nothing carried over past a shield, each lost part's rule held, a stopped Spy did nothing, each deck kept its cards. It tests your block rule case by case. 28 million checks, all pass.
- **Ran:** `node checks/battle_page_test.js`. It plays the page at iPad sideways, iPad upright and phone size. 428 checks, all pass, twice in a row. It checks your layout:
  - every card of the hand is large, inside the screen, and between the enemy and your ship;
  - your shield is lit and shows its number;
  - your attack is in the top corner;
  - your five parts are along the bottom, each with its rule from your board;
  - when the enemy goes first, its card lies beside your hand, as large as your own;
  - no sum is ever asked outside a split;
  - a split that does not add up is not accepted;
  - at real speed, a laser fires, a Spy flies, and the damage floats up.
- **Ran:** `python3 checks/battle_cards_set_check.py` (51 checks) and `node checks/battle_cards_page_test.js` (42 checks). All pass.
- **Looked at:** the screens myself, at all three sizes, and frames of the movement.
- **Not done yet:** an independent review of the new screen. The first screen had one; this one is new today.
- **Did not run:** the game's play tests. Nothing in the game was touched.
