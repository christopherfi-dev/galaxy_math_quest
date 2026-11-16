# GMQ — the game view — v2 — 2026-11-16

**Stage:** proposal, with a playable sketch. Nothing real is built.
**Sketch:** https://claude.ai/artifact/PrDvY1EZX9tYh1sDCHJ4Xe (file: `prototypes/kis_station_sketch.html`)
**Replaces:** §5 and §9 of `GMQ_Rethink_Scene_World_v1_2026-11-16.md`. The rest of that file still stands.
**Tags:** [Source] = from your material or your words. [Proposal] = my suggestion.

---

## 1. What you said about the first sketch [Source: Marc, 2026-11-16]

1. What you liked about a MUD is that students can **do things**. They interact with the world.
2. You want **quite a few secrets** in each place, not one.
3. Too much typing is bad. But in games like Zork, a command is only three or four words: a verb, a thing, and maybe a second thing. You want that, and mostly visual.
4. It connects to **reading**.
5. Hollow House style pictures are not enough. Students did not feel they were playing a game or going anywhere. There was **no movement and no sense of space**.
6. I am in charge of the design.

---

## 2. The design

### 2.1 One place you walk around in
- The station is one map, seen from above. You see your astronaut in it.
- Rooms you have not entered are dark shapes. Secret rooms do not show at all.
- A small map in the corner fills in. It has a north arrow.
- The camera follows you. Doors slide open as you come near.

### 2.2 Every command is two to four words
| Shape | Examples |
|---|---|
| verb + thing | look ship · push crate · open locker · take bolt |
| verb + thing + on + thing | use wrench on vent · use magnet on grate |
| go + direction or place | go north · go to shield |

- **Three ways to give the same command:** type it, tap a verb and then tap the thing, or tap the thing alone to look at it.
- Every command shows as a sentence in the log, however it was given. So tapping is reading practice too.
- The astronaut walks to the thing first. Every command shows movement.

### 2.3 Things change and stay changed
A crate slides and stays moved. A vent stays open. A robot wakes up and follows you. A poster hangs to one side. Your ship keeps its name.

### 2.4 Many secrets in each room
- The sketch has **12 secrets in five rooms.** A counter shows "Secrets 3 of 12".
- Secrets chain. A tool found in one room opens something in another. That makes students cross the map and remember where things are.
- Two rooms are secret themselves. One is dark until you find the light switch somewhere else.

### 2.5 Maths inside the world, not beside it
- The locker code is the number of stacked crates. The crates stand in rows in the room. Each player gets a different stack.
- The Shield Bay battle interrupts when you walk in. An alarm flashes.
- The fuel gauge and the cargo scale are things in the Navigation Bay.

### 2.6 Reading
- Each thing shows its name when you stand near it.
- Replies are one to three short sentences.
- The log keeps the last few lines, so a child can re-read.
- New words can be explained inside the sentence, as you do in Hollow House.

---

## 3. What is in the sketch

**Rooms:** Arrival Dock, Shield Bay, Navigation Bay, Launch Bay, a crawl tunnel and an old store room.

**The 12 secrets** (spoilers)

| # | Room | Command | What happens |
|---|---|---|---|
| 1 | Dock | open hatch | A wrench |
| 2 | Dock | push crate | A gap in the wall |
| 3 | Dock | use wrench on vent | A star chip, and a card |
| 4 | Dock | open locker (count the crates) | A magnet |
| 5 | Tunnel | go east | A hidden store room |
| 6 | Store | open chest | A captain's badge you wear, and a card |
| 7 | Shield | use magnet on grate | A key card |
| 8 | Shield | fix robot | It follows you. You can name it. A card. |
| 9 | Shield | push poster | A switch. The tunnel lights come on. |
| 10 | Navigation | use card on drawer | A star chart |
| 11 | Navigation | push chair, take bolt | A card |
| 12 | Launch | use chart on console | A course is set for Galaxy Numerix |

**Also:** the Asteroid Field battle, the fuel quest, the Cargo Load project with a gold card, a locked Launch Bay, and a mission report.

**What is not real**
- The sketch knows about 40 words. On your site, your AI answers everything else.
- Progress saves on that device only.
- The robot is a new character. [Proposal]

**Tested:** I played it start to finish by typed commands, at iPad and phone size. All 12 secrets, 7 cards, no errors.

---

## 4. Where the AI fits now [Proposal]

| A child types | Who answers |
|---|---|
| A command the room's data knows (push crate) | The data. Instant. Always the same. |
| Anything else (lick the wall, ask the robot a riddle) | Your constrained AI, inside that room's facts |
| A maths answer | Code |

- The data lists what each thing does. That is the planned part of the world.
- The AI is for the unplanned part. It makes the world feel alive when a child tries something no one wrote.
- The AI can also add small secrets of its own later, if the code agrees to save them.

---

## 5. How a room is made [Proposal]

A room is data:
- its size and floor colour,
- its things: where each one stands, the words that name it, and what each verb does,
- its secrets, and what each one gives,
- its toys: mini quests, battles and project helpers.

The page draws every room from that data. Adding a planet means adding data and a few new drawings. It does not mean new game code.

**The cost, honestly:** a room like these takes longer than a Hollow House room. The words are quick. The drawings and the secret chains take thought. My guess is an hour for a good room with help from Claude, not five minutes. A set of ready-made things (crate, locker, door, console, creature) would bring that down.

---

## 6. What could prove this wrong

| Claim | Test |
|---|---|
| Children understand verb + thing | Watch five children. Count commands that fail in the first five minutes. |
| The verb chips help reading, not replace it | Compare what children say aloud when they tap and when they type. |
| Secrets pull children across the map | Count how many find more than six without help. |
| It runs well on a school iPad | Open the sketch on one. It is plain 2D drawing, so it should. |

---

## 7. Decisions for you

1. Is this the right feel: one map, a character that walks, short commands?
2. View from above, as here, or from the side like a platform game? From above is better for maps and directions.
3. May secrets give cards? In the sketch four of them do.
4. The robot: keep it, change it, or use a character of your own?
5. How many secrets in a room? The sketch has two to four.
6. Should I write the full station this way next: all five bays and all 15 tasks?
