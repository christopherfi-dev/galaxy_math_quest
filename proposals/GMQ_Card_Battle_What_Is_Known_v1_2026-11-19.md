# The card battle: what your two files add

**Date:** 2026-11-19
**For:** Marc
**You asked:** "Does this give you more info about the battle stuff?"
**Marks:** [Source] is from your material. [Proposal] is mine. [Conflict] means your sources disagree.

Nothing here is built. The battle rules are yours. This note only sorts what is known.

---

## Added 20 November: your answers

You wrote: "Shields 100 hp. Turn those are same. They go same time. Defender chopped. All parts zero. Common, rare., epic. We will remake card set."

| Topic | Your answer | How I read it |
|---|---|---|
| The shield at the start | "Shields 100 hp" | 100 HP. Not 80. |
| A turn | "Those are same. They go same time." | The two descriptions are one thing. Both players go at the same time. |
| Who picks the part that is hit | "Defender chopped" | The defender. I read "chopped" as "chooses", or "chops the damage up". Tell me if that is wrong. |
| How to win | "All parts zero" | A ship is beaten when all its parts are at 0. |
| The three kinds of card | "Common, rare, epic" | Those three names. |
| The card set | "We will remake card set" | None of the four old sets is official. A new one will be made. |

So section 4 below is settled. Sections 1 to 5 are kept as the record of what was asked.

**Still open, shorter now:**

1. **The new card set.** What I would need before drafting one with you: do upgrade bonuses add up (it sets how big a card's number can be); do Spy and Policeman cards stay; is the mix still 50, 35 and 15.
2. **Do upgrade bonuses add up?**
3. **Does the shield still go to 140, 220 and 360** with Shield Generator Levels 3, 6 and 10?
4. **"Lose 1 card in hand":** one card at that moment, or a smaller hand for the rest of the battle?
5. **"Cannot defend":** defence cards only, or the Main Shield too?
6. **"Same time":** does one player still lead and the other answer? Your Spy and Policeman rules need a leader. Or do both put a card down together?
7. **The Level 3, 6 and 10 abilities:** keep the ones on your site?
8. **Challenge battles:** what is at stake.
9. **A word in the game.** The top kind of card is called "gold" in the game today, and you have said "gold" yourself. Should the game say "epic"?

---

## 1. The short answer

**Yes. But the biggest news is the board, not the rules file.**

- **The board settles a rule that was still open.** It prints what a ship loses when each part reaches 0.
- **The rules file gives me tables I did not have:** every ship part with its HP and AP, the nine upgrade levels, and the Level 3, 6 and 10 abilities.
- **The rules file is older than what you told me.** It was rebuilt from chats of 2023 and 2024. On 15 and 16 November you gave me the battle rules by voice. Those are newer and fuller. Most of the nine "rules still to decide" in the file are things you have already decided.
- **In six places the file and your November words disagree.** Section 4 lists them. You choose.
- **One thing still blocks a build: which card set is the real one.** There are four. The file uses the oldest.

---

## 2. What is new to me

| New | From | Why it matters |
|---|---|---|
| What each part costs you at 0 HP | the board | I had only guessed this from a picture I had not read. Now it is your printed word. |
| One box for "Ship AP", not one for each part | the board | It fits what you said: a ship's attack is all its parts' AP added up. |
| The shield is called "Main Shield" | the board | Your November words say Main Shield too. The file says "Ship Shield". |
| 30 ship parts with HP and AP | the file | Five kinds, five versions each, and one Lucky Draw each. |
| Levels 2 to 10: what each adds | the file | +4 HP and +3 AP at Level 2, up to +36 and +35 at Level 10. |
| Abilities at Levels 3, 6 and 10 | the file | I had only the Engine Core's (6, 7 and 8 cards in hand). |
| The shield at 140, 220 and 360 | the file | With Shield Generator Levels 3, 6 and 10. |
| How a card looks | the file | Size, where the letter and number go, the colours. |

**The board, word for word [Source]:**

| Part | If HP = 0 |
|---|---|
| Weapons System | cannot attack |
| Engine Core | lose 1 card in hand |
| Shield Generator | cannot defend |
| Navigation | lose 1 card in hand |
| Power Module | cannot heal HP |

Both files are now in `reference/marc-2026/5_Card_Battle/`. I took the four links to your private chats out of the rules file, because this repository is public. The thread names and dates are still there.

---

## 3. The file's nine open rules, against what you told me in November

Your November rules are in `design/GMQ_World_Handoff_2026-11-16_v8.md`, section 7.2.

| # | The file asks | Your answer, 15 and 16 November [Source] | Now |
|---|---|---|---|
| 1 | What does AP do? | Both ships attack every round. The attack is the AP of all the ship's parts added up, plus any bonus from the card played. | answered |
| 2 | Shield or parts first? | The Main Shield first. The attack that breaks it is soaked up whole. After that the defender splits each attack across their parts. | answered |
| 3 | What does a destroyed part do? | It adds 0 AP and sets off its penalty on the board. A ship is beaten when all five parts are at 0. | answered, and the board now confirms the penalties |
| 4 | Do upgrade bonuses add up? | not said | **open** |
| 5 | How do responses work? | A round is two cards: the leader plays, the other answers, both take effect. Played cards go under the deck. Each player draws one. The other player leads next. | answered |
| 6 | Deck size and limits? | No limit. | answered |
| 7 | Keep the Level 3, 6 and 10 abilities? | not said | **open** |
| 8 | How is a card's rarity drawn? What are the odds of a Lucky Draw part? | "One gold card, two rare cards, and all the rest common." I was not sure what that described. | **open** |
| 9 | The Patterns galaxy cards? | not said | **open** |

So five of the nine are closed. Four are open.

**Things you told me that the file does not have at all:** fun battles and challenge battles, Spy cards and Policeman cards, the rule for when nobody can win, and cards that cannot be used still being played.

---

## 4. Where the file and your November words disagree [Conflict]

I have not picked. The newer one is usually right, but that is your call.

| Topic | The file (2023 and 2024 chats) | You, November 2026 |
|---|---|---|
| The shield at the start | 100 HP | 80 HP |
| A turn | You play one card on your turn. The other player may answer an attack. | A round: both play a card, then both ships attack. |
| Who picks the part that is hit | the attacker (the file marks this as a guess) | the defender splits the damage. Only a Spy lets the attacker pick. |
| How to win | bring the other ship's parts to 0 | all five parts at 0. And a battle can end with no winner. |
| Names of the three kinds of card | Common, Advanced, Epic | common, rare, gold |
| Which card set | the July 2023 list: 134 numbers, 116 different cards | not chosen. Four sets exist. |

**Two more, inside your older sources** (I have no November word on either):

- **Getting a ship part:** the file says a random part after five quests in a section (October 2024). Your site gives a part for three station tasks.
- **Getting cards:** the file says cards for finished quests (October 2024), and one card for each finished task (July 2023). In November you said one card for each finished task.

**The game as built uses** common, rare and gold, one card for a finished task, and a part for three station tasks. Its six card names are stand-ins.

---

## 5. Every number, worked out again

All of the file's sums are right.

- **The card pool:** 134 numbers, less 18 repeats, is 116 cards. 60 + 33 + 23 = 116. The shares are 52%, 28% and 20%. Your target is 50, 35 and 15. So the pool has too many Epic cards and too few Advanced, as the file says.
- **The levels:** if the bonuses add up, Level 10 gives a part +180 HP and +171 AP. Right.

**Three things I noticed that the file does not say [Proposal]:**

1. **Each kind of part has one total.** For every regular version, HP + AP is the same: Engine Core 25, Navigation 25, Shield Generator 35, Weapons 30, Power Module 40. A version only trades HP for AP. A Lucky Draw part is that total plus 15.
2. **A ship of five Standard parts has 100 HP and 55 AP.**
3. **Whether the bonuses add up changes what a shield is worth.** Take a ship with all five parts at Level 10.
   - If they add up: its attack is 910. A 360 shield is gone in one hit.
   - If they do not: its attack is 230. A 360 shield takes one hit and breaks on the second.
   - A Level 1 ship attacks with 55. By your split rule it can give up one part a round, so it lasts six rounds. In those rounds it does 260 damage in all, without cards. That is less than the 360 shield. So either way it never touches that ship's parts.

**80 or 100 for the shield:** with two Standard ships and no cards, it makes no difference. An attack of 55 breaks either one on the second hit. It matters only once cards or levels change the attack.

---

## 6. What still has to be decided before a battle can be built

In the order that blocks the most:

1. **Which card set.** July 2023, "Booster 2", November 2023 with the Spy cards, or the January 2024 print. The January print says "Add +X to your AP for this attack". That matches the board and your November rules best. I have not been sent any of the four lists.
2. **Do upgrade bonuses add up?** See section 5.
3. **The shield: 80 or 100.** And do 140, 220 and 360 still hold?
4. **"Lose 1 card in hand."** Is that one card thrown away at that moment? Or is the hand one smaller for the rest of the battle? Two parts say it, so it can happen twice.
5. **"Cannot defend."** Does that stop defence cards only? Or does the Main Shield stop working too?
6. **The Level 3, 6 and 10 abilities:** keep the ones on your site, or change them? Three of them ("one extra move or attack", "take two turns in a row", "two attack cards per turn") were written for the older turn. They need new words for a round where both players always play one card.
7. **Challenge battles:** what is at stake, and who may take part.
8. **How a new card's kind is drawn,** and the odds of a Lucky Draw part.

---

## 7. What I could do next [Proposal]

| | Choice | What it costs |
|---|---|---|
| A | **Nothing yet.** Battles stay a later stage, as you said. | nothing |
| B | **One clean rules sheet.** Your November rules, the board and these tables in one document, with the open points marked. For you to correct. | an hour or two. No decisions made for you. |
| C | **A battle table to try rules on.** Two ships on one screen, played by you. A switch for each open rule: bonuses add up or not, shield 80 or 100, and so on. You find out by playing, then choose. | about a night. It needs one card set from you first. It is a tool for you, not for students. |
| D | **Battles in the game for students.** | not yet. It needs every point in section 6. |

My pick, if you want one: B now, C when you send a card list.

---

## 8. What could prove this wrong

- **My record of your November rules came from voice.** If I heard one wrong, section 3 is wrong in that row. Section 7.2 of the design record is short. It is worth ten minutes of your reading.
- **The board may be older than your November rules.** Its name is "Copy of Battle Game Board". My inventory dates it June 2024. If you changed a penalty since, the board is out of date, not the rule.
- **The file checked four chats only.** It says it did not look in your Projects or your Drive. The three newer card sets are in your Drive.
- **I have read none of the card lists myself.** Everything here about cards comes from the file and from my earlier notes.

---

## 9. What I need from you

- Is the board current?
- Which card set? Send the list, or tell me which Drive file.
- Any of the points in section 6 you already know the answer to.
- A, B, C or D.
