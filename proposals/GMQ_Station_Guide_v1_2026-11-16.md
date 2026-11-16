# GMQ — the KIS Station as a MUD: guide and answer key — v1 — 2026-11-16

**Stage:** built in the sketch. Everything can be changed.
**Sketch:** https://claude.ai/artifact/PrDvY1EZX9tYh1sDCHJ4Xe
**Tags:** [Source] = from your material. [Proposal] = my design.

---

## 1. What you asked for [Source: Marc, 2026-11-16]

- You got stuck at the locker. You knew there were 9 crates. Nothing said how to enter a code.
- "Go back to the MUD and start building this."

---

## 2. The locker: what was wrong, and the fix

| What was wrong | Fix |
|---|---|
| The sign never said where the locker was, or what to type. | The sign now says: "An arrow points to a grey locker in the east corner. Go there and type: open locker." |
| On a phone the locker was cut off at the edge of the screen. | On small screens the camera now follows you. Tiles stay big enough to read. |
| You had the answer and nowhere to put it. | Type the number on its own. Typing `9` in the dock walks you to the locker and tries the code. |
| Nothing helped a stuck player. | A **Hint** button. It always names the next thing to try. |

**One more thing I saw in your picture.** The dock floor showed a rude ship name. A ship or robot name is painted where the class can see it, so the sketch now refuses rude words: "The paint will not stick. Pick a kind name." On your site, the server should hold the real word list. [Proposal]

---

## 3. The station now: eight rooms, five ship parts, 18 secrets

Each ship part is earned by **doing something in its own bay**. The skill for each part is yours. [Source: "Space Station Info"]

| Bay | Ship part | Skill | What the student does | Your task it comes from |
|---|---|---|---|---|
| Engine Bay (new) | Engine Core | Counting | Alien artifacts lie spilled on the floor. Walk round and count each kind. Set four dials. | 1-1 Alien Artifacts |
| Navigation Bay | Navigation | Add | Tap crates on to the scale: 7 things, 30 tons. | 2-3 Cargo Load |
| Shield Bay | Shield | Multiply | Rocks drift in rows outside the windows. How many? | 3-1 Asteroid Field |
| Weapons Bay (new) | Weapons | Odd and even | Drones show numbers. Tap every odd one, then every even one. | 4-3 Target Practice |
| Power Bay (new) | Power | Place value | A number on the board, and nine wires. Connect the three that match. | 5-1 Circuit Connection |

**The ship cannot launch until all five parts are fitted,** and a course is set. Before this, two parts were enough.

### What I kept from your tasks, and what I changed

- **Engine Core** [Source]: four colours make a four-number code, and the lock has a temper ("The Engine Core rumbles! Count again.").
  - [Proposal] Each student gets different counts, and the four counts are always different. Your printed version had 9 red and 9 yellow, so a mix-up still opened the lock.
  - [Proposal] Each colour also has its own shape, so a child who cannot tell red from green can still count.
- **Weapons** [Source]: "drones marked with different numbers".
  - [Proposal] The throwing stays in your classroom. On screen the student taps drones. A wrong tap says why: "16 is even. Look at its last digit."
- **Power** [Source]: a number in the middle and nine wires, three of them right.
  - [Proposal] Each student gets their own number. Two boards, not four rounds.

### Things to find and do

A thing found in one room often opens something in another. That is the MUD part.

| Room | Things | Secrets |
|---|---|---|
| Arrival Dock | ship, crates, loose crate, sign, vent, locker | wrench in the hatch · gap behind the crate · star chip in the vent · magnet in the locker |
| Crawl Tunnel and Old Store | old chest | the hidden room · the captain's badge |
| Shield Bay | shield panel, window, grate, robot, poster | key card under the grate · fix the robot · switch behind the poster |
| Engine Bay | engine core, artifacts, valve, toolbox | turn the valve to read a note · oil can in the toolbox |
| Weapons Bay | cannon, drones, ammo box, rusty drone, target wall | fuse in the ammo box · oil the rusty drone and it flies |
| Navigation Bay | star map, fuel gauge, cargo scale, drawer, chair | star chart in the drawer · bolt under the chair |
| Power Bay | circuit board, fuse box, battery, loose plate | the fuse brings the lights on · star chip under the plate |
| Launch Bay | launch console | set the course |

**The chains:**
- wrench → vent, and robot
- locker → magnet → key card → drawer → star chart → course
- valve → a note that says where the fuses are → ammo box → fuse → fuse box → lights → loose plate
- toolbox → oil can → rusty drone
- cargo loaded → a door was hiding behind the pile → Power Bay

---

## 4. Answer key: one way through

Every command is two to four words. Tapping works too.

1. `open hatch` · `read sign` · `look crates` · type the number of crates
2. `push crate` · `use wrench on vent` · `go gap` · `east` · `open chest` · `go to dock`
3. `go to shield` (the battle starts) · `use magnet on grate` · `fix robot` · `push poster`
4. `go to engine` · `push valve` · `open toolbox` · count the artifacts · `open cage`
5. `go to weapons` · `open ammo` · `use oil on rusty drone` · `use cannon` · tap the drones
6. `go to navigation` · `use card on drawer` · `push chair` · `take bolt` · `use scale`
7. `go to power` · `use fuse on fusebox` · `open plate` · `use board`
8. `go to launch` · `use chart on console` · `launch`

Stuck at any point: tap **Hint**.

---

## 5. How it was tested

`checks/station_playthrough_test.js` plays the whole station on an iPad size and a phone size.
- It types the commands above and taps the drones with real taps.
- It earns 5 of 5 parts and finds 18 of 18 secrets, then launches.
- It checks the locker opens from a number typed on its own, the locker is on screen on a phone, the hint names a next step, a rude name is refused, and the ship will not launch early.

**Not tested:** real children, and a real iPad. The phone test is a simulated browser.

---

## 6. What could prove this wrong

| Claim | Test |
|---|---|
| A student can finish the station without help | Watch five students. Count how often they tap Hint, and where. |
| Counting scattered artifacts is the right size of task | Time it. If it takes over five minutes, use fewer. |
| The chains are fun, not confusing | Ask a student to say what the oil can is for before they use it. |

---

## 7. Decisions for you

1. **One task for each ship part, or three?** You ran three. The sketch has one. Three would use your 1-2, 1-3, 2-1, 2-2, 3-2, 3-3, 4-1, 4-2, 5-2 and 5-3 as well.
2. **Must all five parts be fitted before launch?** I set it so. It makes a first visit longer.
3. **The Hint button:** keep it always there, or only after a few minutes?
4. **Rude names:** is refusing them enough, or should names be picked from a list?
5. **The robot** still asks its 12 ship-check questions if you talk to it. Keep, cut down, or remove?
