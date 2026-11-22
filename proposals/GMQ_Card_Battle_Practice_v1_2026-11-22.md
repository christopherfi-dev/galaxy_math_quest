# The practice battle: you against the computer

**Date:** 22 November 2026 (third screen of the day: the space battle). **For:** Marc. **From:** the battle thread. **Step C of three.**
**Play it:** `docs/battle/index.html` (the same file is `prototypes/card_battle.html`).
**The cards:** `docs/battle/cards.html`.

**The rules are yours.** Not one rule, part, number or card changed for this screen. Every point you have not decided is still a switch. Nothing is in the game.

---

## 1. Stepping back

You said: *"For third graders we need to be fun... a space battle. That's what they should feel like. I made it a card deck because that's all I could do in the past. This has more potential."*

Here is how I read the problem.

- **In 2023 the cards had to do three jobs,** because paper was all there was.
  1. They were the thing a child **earns and collects**.
  2. They were the thing a child **chooses** in a round.
  3. They were the **whole battle**. Everything that happened was a number on a card, and the child was the computer who added and took away.
- **Jobs 1 and 2 are good.** They are why a child wants to finish a task. They stay.
- **Job 3 is what a screen can take over.** A battle is something you watch. A page can add up, and it can show a laser.
- **So I split the jobs.** [Proposal]
  - **The cards choose.** A card is an order you give your ship.
  - **The ships show.** Two ships in space. What a card does, you see happen.
  - **The child decides.** Which order to give. Where the enemy's hit lands.
- **Where the maths went.** You said the battle can be a break from sums. One piece of number work is left, and it is your one: sharing a hit between parts.
  - The hit arrives as **blocks: tens, fives and ones.** A hit of 65 is six tens and a five.
  - The child sends each block to a part. A ten can be **broken** into two fives, a five into five ones.
  - That is place value with their hands. Nobody types a number. [Proposal: tell me if you would rather they typed.]

---

## 2. What is on the screen

| | |
|---|---|
| **Two ships** | Yours is blue, on the left. The enemy's is red, on the right. (iPad upright: the enemy above, you below.) |
| **Five parts on each ship** | Each is a place on the hull, from the engine at the back to the weapons at the front. Each shows its picture, its AP and its HP. |
| **"If lost"** | Under each of your parts is its rule from your board: "if lost: cannot attack". A lost part goes dark, smokes, and says LOST with its rule. |
| **The Main Shield** | A glowing bubble round the ship, with "MAIN SHIELD 45" on it. It cracks as it gets weak. It is gone when it breaks. |
| **Your attack** | Top left corner: "YOUR ATTACK 55". With a card: "60", and "55 + 5" beside it. The enemy's is next to it. |
| **Your cards** | Five, large, along the bottom while you choose. On an iPad held sideways each is about 175 points wide. Tap one to see it bigger and read it. Then "Give this order". |
| **The enemy's order** | When the enemy goes first, its card lies beside your hand, marked "THE ENEMY'S ORDER". |
| **Movement** | The stars drift. The ships float. A laser fires from the gun. A shield flashes when it is hit. A part shakes when it is hit, and bursts when it is lost. A Spy flies across in a little pod. A police ship comes out and says STOP. Hearts fly to a part that is repaired. A block card puts a shield in front of the ship. The damage floats up as a number. A beaten ship blows up, part by part. |
| **Holding still** | The ships stop floating whenever you have to tap a part. |

---

## 3. How a round goes

1. **One player goes first** and gives an order. Who goes first in round 1 is chance. After that you take turns.
2. **The other sees it, then answers.**
3. **The cards shrink away and the battle plays.** The two orders sit above the ships.
4. **A policeman stops a Spy.**
5. **A Spy that is not stopped acts first.** If it is yours, you tap the enemy part to hit.
6. **Hearts repair.**
7. **Both ships attack.** The page adds up the AP and the card.
8. **A hit meets the bubble first.** If the hit is bigger than the shield, the shield breaks and soaks up all of it.
9. **With no shield, you choose which parts take the hit.**
   - The blocks are in a row. One is lit.
   - Tap a part: it takes the lit block. Over the part you see "−20" and "leaves 5", or "it will be lost".
   - "Break", "Undo" and "Start again" are there.
   - "Take the hit" lights up when every block is placed. Then the lasers fire at the parts you chose.
10. **"Next round."**

**The deck:** each player has their own cards, shuffled, and holds 5. A played card goes to the bottom of its deck.
**Saving:** the battle is saved on the iPad at the start of each round.

---

## 4. What I think you should look hardest at

These are the things that could prove this design wrong.

1. **Is it fun? I cannot know.** I have looked at every screen. A child has not. Ten seconds of a child playing will tell you more than my tests.
   - Watch for: do they choose a card quickly, or stare? Do they read "if lost"? Do they smile at the laser?
2. **The split may not be much of a choice.** This comes from the rules, not from the screen. [Your decision]
   - Your rule: "the defender decides how to split each attack across their parts." [Source: rules sheet 4]
   - The sheet does not say if a part may be sent more than the HP it has. The page lets it. [My guess. It matches "nothing carries over" for the shield.]
   - So the best answer to a hit of 65 is always the same: **put all 65 on your least useful part.** One part is lost, and 50 points of the hit vanish.
   - The new screen makes this easy to see: one tap after another on the same part, "it will be lost".
   - A child who finds it will do it every time. Then the one job you kept is no longer a decision.
   - It also makes attack cards weak. A hit of 60 and a hit of 100 cost the defender the same: one part.
   - **Options, each with its cost.** I tried each one roughly: 4,000 battles between two computer players, outside the page.

     | | A battle lasts | Nobody wins | Cost |
     |---|---|---|---|
     | **A. Leave it** (the page today) | 9 rounds in the middle | 19 to 22 in 100 | After the trick is found, the split is one tap repeated. |
     | **B. A part can take no more than the HP it has.** The rest must go to other parts. | 4 or 5 rounds | 31 to 35 in 100 | Battles are half as long. More end with both ships beaten. Every point of attack counts, so the split becomes real sums. |
     | **C. A part can take no more than half the hit.** | 6 or 7 rounds | 20 to 23 in 100 | One more rule to explain. |

   - These three numbers are a rough trial, not a tested rule. B and C are not in the page. Say the word and I add them as switches, with tests.
3. **A round is watched for about 10 to 15 seconds.** That may feel right, or slow by round 8. A "fast" switch is easy.
4. **There is no sound.** A space battle wants sound. A room of 14 iPads may not. [Your decision]
5. **On a phone the cards are small.** It is built for the iPad.
6. **The computer player is not a child.** The numbers in section 7 come from one way of playing.

---

## 5. The switches

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

## 6. Things I had to settle to make it run [Proposal: each is yours to change]

1. **Both ships lose their last part in the same round: nobody wins.**
2. **A hit may only be put on working parts.**
3. **A block comes off the attack before it reaches the shield.**
4. **Inside a round the order is:** the policeman, then Spies, then repairs, then both attacks at once.
5. **"Lose 1 card" throws away a card at random,** at the moment the part is lost.
6. **An upgrade card played in a battle** makes that part Level 2 until the battle ends.
7. **A Spy played second cannot be stopped.** The first player has already given an order. That follows from your rule.
8. **Both ships attack every round,** whoever went first.
9. **The block rule compares the two cards on the table.** If the other player played no attack card, any block card works against the ship's plain attack.

---

## 7. What 120,000 battles between two computer players showed

Two Standard ships, your rules, the default switches. The rules engine did not change today, so these numbers stand.

| | Two gentle players | Two clever players |
|---|---|---|
| **Length** | 9 rounds in the middle; from 5 to 13 | 9 rounds in the middle; from 4 to 13 |
| **A ship wins** | 78 in 100 | 81 in 100 |
| **Nobody wins** | 22 in 100 | 19 in 100 |
| **A ship has no Weapons by round 8** | 1 in 100 | 1 in 100 |

- **Your ruling on the Spy fixed the biggest problem.** With seven Spy cards in a deck, a clever player took the other ship's Weapons early in 32 battles in 100. With one, it is 1 in 100.
- **Going first or second in round 1 makes no difference between two computer players:** 41 in 100 against 40.

### Still for you to rule on

1. **The split** (section 4, point 2).
2. **Both ships fall in the same round in about 20 battles in 100.** Your rules sheet does not say who wins then.
   - Choices: nobody; the ship with more HP at the start of that round; the player who went second; one more round.
3. **Does your block rule hold for a policeman against a Spy card?** The policeman is common. Three Spy cards are rare and one is gold.

---

## 8. What is not built

- **Sound.**
- **Two children on one iPad.**
- **Levels 3 to 10.**
- **Fun battles and challenge battles.**
- **Your own deck.** Both players have the same cards, apart from which Spy card each draws.

## 9. Checks

- **Ran:** `node checks/battle_page_test.js`. It plays the page at iPad sideways, iPad upright and phone size. 807 checks, all pass. It checks:
  - two ships, five parts on each, none over another;
  - under each of your parts, its "if lost" rule from your board;
  - your shield as a bubble with its number; your attack in the top corner;
  - every card of the hand large, inside the screen, below the ships;
  - the enemy's order shown when the enemy goes first, and not before you choose when both go together;
  - no box to type in, ever;
  - the blocks always add up to the hit; Undo, Break and Start again; the button stays off until every block is placed; each part loses exactly what was sent to it;
  - every HP on the screen against the rules engine, every round;
  - the ships hold still when a part must be tapped;
  - leaving between rounds, and in the middle of one; a whole battle to its end; your block rule;
  - at real speed: the ships float, the stars drift, a Spy flies, a block card shows its shield, a laser fires, the damage floats up, a round takes under 25 seconds, a beaten ship blows up before "YOU WIN!".
- **Ran:** `node checks/battle_engine_test.js`. Computer against computer: all 24,576 combinations of switches, then 24,000 more battles. 28.9 million checks, all pass. The engine did not change today.
- **Ran:** `python3 checks/battle_cards_set_check.py` (51 checks) and `node checks/battle_cards_page_test.js` (42 checks). All pass.
- **Looked at:** the screens myself, at all three sizes, and stills taken in the middle of the movement. I fixed what I saw: words that crossed the hull, cracks that crossed the labels, cards that were small, a top bar that ran off a phone, two numbers that floated on top of each other.
- **Independent review of the pictures:** started, not back yet when this was written. Its findings come in the next version.
- **Rough only:** the three numbers for the split in section 4. They come from a trial outside the page and have no test.
- **Did not run:** the game's play tests. Nothing in the game was touched.
- **Not tested at all:** a real iPad, a real finger, a real child.
