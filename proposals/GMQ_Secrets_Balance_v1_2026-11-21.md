# Secrets: never needed, always worth finding

**Date:** 21 November 2026, overnight. **For:** Marc. Everything is **[Proposal]** unless it says [Source] or [built].
**What is built:** the station changes in section 1, on the **preview link only** (version 84). The class link stays on version 81.
**A picture of the changes:** `GMQ_Secrets_Balance_v1_2026-11-21.png` (the dark gap, the lit Old Store, and the chart's stars on the map).

[Source: Marc, 2026-11-21] "Like even on the space station. We should not be able to see anything in the secret passage or whatever or go more than 1 step inside. Until the lights are turned on by another secret. But like the secrets should not be mandatory things that must be found.. There are things that could help do certain questions. Like a secret in the space station should not be mandatory or anything you must find to pass the major quests. As you need to balance like the secrets for helping like mini quests."

---

## 1. Built tonight (preview link, version 84)

### The dark passage

- **Before:** with the lights off, a cadet could crawl all the way through the tunnel into the Old Store. They could see "a step or two".
- **Now, until the switch behind the poster is on:**
  - The cadet can go **one step** into the gap, and no further.
  - **Nothing past the gap is drawn.** Not even its shape: I first drew it black, and the black showed the tunnel's L shape against the stars, so I took that out. Now darkness spills softly from the gap.
  - Every way of moving says why: tapping the dark, typing "south", or "go gap". "It is pitch dark past the gap. You cannot see where the tunnel goes, so you stay where you are. Some lights on this station are switched off."
  - The station map does not show the tunnel or the Old Store.
  - The hint points to the switch without naming it: "A switch must be somewhere else on the station."
- **After the switch** (a secret, as you asked): the lights hum, and the tunnel and the Old Store can be walked into, as before.
- A cadet whose save was deep in the dark is moved back to the gap's mouth.
- **Checked:** played at iPad sideways, iPad upright and phone, with pictures of each. I read every message against the picture.

### Launch needs no secret

- **The fault:** launching needed a course. The course needed the star chart, from the drawer, which needed the key card, from under the grate, which needed the magnet, from the locker. **Four secrets stood between every child and Voltara.**
- **Now the course comes from the Navigation part.** That is the child's own route work: the fuel plan, the coordinates and the cargo. When it is fitted: "The Launch Bay door unlocks, and your route to Voltara is loaded into the launch console."
- **The star chart chain is still there, but optional.** Its reward is now a helper:
  - The chart is "the old captain's star chart. On its back is a map of this station."
  - In the console's slot, it puts **small gold stars on the station map**, one for each secret still hidden in each room.
  - A star even floats below the dock, where the Old Store is. It points without showing.
  - If nothing is left, it says so: "No stars glow on it. You have found every hidden thing here already."
- **The hint offers secrets, and no longer pushes the chart chain.**
  - It no longer sends children to the locker, the grate, the drawer or the chart.
  - At the end it says: "Your ship is ready. Go to the Launch Bay. Type: launch. If you like, 3 secrets are still hidden on the station. You do not need them to fly."
  - **It still begins with two secrets:** the wrench under the ship's wing, and the robot. They are the game's first lesson ("open", then "use one thing on another"). The fixed robot then gives the hints. They are suggested, not needed: the new test launches without them. If you prefer, they can stop counting as secrets (decision 1).
- **It still counts 18 station secrets.** Putting the chart in the console is still one of them.

### Checks

- **New: `checks/no_secret_needed_test.js`.**
  - A new cadet with an empty bag and no secrets reaches all 15 tasks in order, and walks to the Launch Bay.
  - The cadet launches. At lift-off, the bag is still empty and no secret has been found.
  - It also checks that no square past the gap can be walked on in the dark.
  - **On version 83 it fails**, with both faults: 20 dark squares can be walked on, and "No course is set". On version 84 it passes.
- **The world web check** (`checks/world_web_check.py`) has a new rule 8: no planet's job and no landing may need a secret. The spreadsheet has a new "secret" column.
  - It fails on the version 83 table: launch needed the chart chain.
  - It passes on version 84. It lists Voltara's two cases (section 2) as waiting on you.
- **Updated: `station_playthrough_test.js`**, for the dark passage and the launch. It passes on iPad and phone: 15 tasks, 18 of 18 secrets, launched, no errors.
- **Tests that ran on version 84, all passing:** `station_playthrough_test.js` (iPad and phone), `station_online_test.js`, `tap_words_test.js`, `one_screen_test.js`, `no_secret_needed_test.js`, `world_web_check.py`, `parse_check.js`.
- **Not run:** the other planets' tests. The full suite is paused, and nothing outside the station changed. `voltara_quest_test.js` sets the old chart flag in its own setup, which is harmless now.
- **Also played:** closing and reopening inside the passage. A save from the old version, deep in the dark, comes back at the gap's mouth. A save at the gap stays there, still dark. A save in the lit Old Store stays in the Old Store.

---

## 2. The audit: which secrets a main quest needed

I checked every secret in the game's code (25 in all: 18 on the station, 7 on Voltara).

| Secret | Where | What needed it (version 83) | Now |
|---|---|---|---|
| locker (the magnet) | station | launch | not needed (version 84) |
| key card | station | launch | not needed (version 84) |
| drawer (the star chart) | station | launch | not needed (version 84) |
| chart in the console | station | launch | not needed; now a helper (version 84) |
| **glow stone** | Voltara | the dark tunnel to the Nomads, so the whole quest | **waiting on you** (section 6) |
| **Nomad Hollow** | Voltara | it *is* the quest's goal, but it is counted as a secret | **waiting on you** (section 6) |

- **Chronosia, Xylophora, the mission ship and the small worlds:** no secret is needed. Their finds are all optional already.
- **19 of 25 secrets were already optional.**

---

## 3. What a secret is, and what it can give

**A secret is anything the game never asks for.** The main path is always told: by a person, a sign, the task list or the hint.

**What a secret gives.** Five kinds, from the most useful down [Proposal]:

| Kind | What it does | On the station today |
|---|---|---|
| **a. A helper** | makes exploring easier: a light, a map, a tool, a guide | the wrench; the robot that follows you; the poster switch (light); the fuse box (light); the chart's stars |
| **b. A place** | opens somewhere you would never see | the gap, the Old Store |
| **c. A clue** | tells a fact another secret needs | the steam valve's note: "Spare fuses are kept with the ammo" |
| **d. A keepsake or card** | something to keep | the badge, two star chips, the bolt, the rusty drone's card |
| **e. A link** | is needed on another planet | none yet (`GMQ_World_Web_v1_2026-11-21.md`) |

- **Chains are good,** as long as the whole chain is optional. Your example is exactly one: the poster's switch lights the passage, the passage leads to the Old Store, and the Old Store holds the chest.
- **The station's 18, counted by what each gives:**
  - 5 helpers: the wrench, the robot, the poster switch, the fuse box, the chart's stars
  - 5 links in a chain: the magnet, the key card, the star chart, the oil can and the spare fuse each open the next secret
  - 2 places: the gap and the Old Store
  - 1 clue: the steam valve's note
  - 5 that give only a card or a keepsake: the badge, two star chips, the bolt, the rusty drone
  - **So 13 of 18 lead somewhere.** That is a good balance for a first place.

---

## 4. "Things that could help do certain questions"

**What I recommend** [Proposal]:
- **A secret may give what a mini quest's question needs:** a tool, a fact, a light, a place to look. The chart's stars help find things. The valve's note tells where the fuse is. The Nomads' lantern (in the world web note) lets you see in a cave.
- **A secret should not hold back maths help for the main tasks.** The finished examples, the hint and the step-by-step help stay open to every child.

**My pushback, and why:**
- The child who most needs a number line or a worked example is often not the child who explores most.
- If maths help sits behind secrets, the gap between children grows exactly where it should shrink.
- And your rule stands either way: no helper may show the answer or do the adding.

**A middle way, if you want maths helpers as finds:**
- A secret gives a **themed copy** of help everyone can already get. For example, "the old captain's number line", which the hint also offers.
- Or it gives **a second way to see the problem**: the same help, drawn differently.
- Either way, the teacher log records when it is used.

---

## 5. Balance rules for every place [Proposal]

1. **The main path is never a secret.** The code checks this: rule 8, and the new test.
2. **About one secret for every one or two tasks.** The station has 18 for 15 tasks. Voltara has 7.
3. **At least half lead somewhere** (a helper, a place, a clue or a link), not only to a card.
4. **Every secret has a pointer in the world,** so it is found by noticing, not by tapping everything. The station already does this:
   - a poster with a corner sticking out
   - cold air behind a crate
   - a shine in the vent
   - a card under the grate
5. **A dark or locked place says why, and allows one step.** It is a hook, not a wall.
6. **The count stays visible** ("Secrets 5 of 25"), so curious children know there is more. The hint suggests a secret only as part of learning the game (the wrench, the robot), or once the main path is done.
7. **A secret's card is a bonus.** The main cards come from tasks.

### Every place, measured against rules 2 and 3

I counted from the game's code. "Leads somewhere" means a helper, a place, a clue, a chain link or a link to another planet. Scenery is left out.

| Place | Jobs or tasks | Secrets or finds | Lead somewhere | Only a card or keepsake |
|---|---|---|---|---|
| KIS Station | 15 | 18 | **13** (helpers, chain links, the Old Store, the valve's note) | 5 |
| Voltara | one long quest | 7 | **2** (the glow stone, the tiny door that points to the Nomads), plus Nomad Hollow, which is the quest itself | 4 (the coin, the zebra, the big wheel, tasting a FlavorBurst) |
| Chronosia | 6 | 17 | **8** (the cave and the sundial chains; five clues for the case and the Backward Mountain). The mountain and the case are mini quests themselves. | 7 |
| Xylophora | 5, and a side job | 4 | **1** (the stone paths bring the families) | 3 |
| Mission ship | 5 checks | 2 | **0** | 2 |

- **The station is the best balanced.** It was built around secrets.
- **Xylophora and the mission ship have few secrets, and almost none lead anywhere.** They are below rule 2 as well as rule 3.
- **The world web's strands are where that gets fixed.** Strands B and C add a person, a pond floor and a shell to Xylophora. The seeds in that note give Voltara's coin a use. Each new secret should come with a pointer in the world (rule 4).

---

## 6. Voltara: the glow stone, and Nomad Hollow

**Decided 22 November: V2** (Marc: "I agree with your recommendations"). **Built in version 85, on the preview link:**
- In the dark, the cadet keeps one hand on the humming cable and shuffles east, at less than half speed.
- With the glow stone, the tunnel is lit, the walk is quick, and the thin wire clipped to the cable shows. That wire is a clue to where the energy goes.
- Reaching Nomad Hollow is no longer counted as a secret. Its words stay ("A hidden town, deep under the hill!"). The count is now 24: 18 on the station, 6 on Voltara.
- The world web check now finds no job and no landing that needs a secret, anywhere in the game.

The options as they were laid out:

The butterfly tells you to dig by the tall tree, and the hint repeats it. So the glow stone is not hidden. But it is counted as a secret, and the quest cannot go on without it.

| | Option | What a child meets | Cost |
|---|---|---|---|
| V1 | **Call it a step, not a secret** | No change to play. The count becomes 23. | Very small. But the rule is only met on paper. |
| V2 | **The tunnel can be crossed in the dark, slowly** (my recommendation) | "You keep one hand on the humming cable and shuffle east." It takes longer, but it works. With the glow stone, the tunnel is lit and shows something only light can show. For example, numbers the Nomads painted on the wall: a small mini quest. | Part of a session. The glow stone becomes a true helper. |
| V3 | **The Council gives you a lamp** when they send you to the tunnel | The glow stone stays a secret, kept for later. It could be the light for Chronosia's cave instead of the Nomads' lantern. | Small, but it changes strand A of the world web. |

**Nomad Hollow:** in every option, reaching it should not count as a secret. It is where the quest takes you. The moment "A hidden town, deep under the hill!" stays.

---

## 7. What could prove this wrong

- **Children may explore less** now that nothing is needed. Watch whether they still push, open and look. The count and the chart's stars give them a reason.
- **The locker taught something.** It was the first number lock: type a number, and the lock opens. The hint no longer sends children there, so some will meet their first number lock later. Watch two or three children. If needed, the robot can suggest the locker once, as "something to try".
- **The chart's stars could make secrets too easy.** They show the room, not the thing. If children find everything in minutes, show only a count per room instead of stars.
- **On a phone, the map's stars are small.** They can be read, but only just. I looked at the picture.

---

## 8. Your decisions

1. Keep the version 84 station changes? They are the dark passage, the course from the Navigation part, and the chart as a map of hidden places. They are on the preview link only. And should the wrench and the robot, the first lesson, still count as secrets?
2. Voltara's glow stone: V1, V2 or V3?
3. Help with questions: tools and facts for mini quests only (my recommendation), or maths helpers as finds too, by the middle way?
4. The balance rules in section 5: yes?
