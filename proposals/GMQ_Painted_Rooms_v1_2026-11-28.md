# Painted rooms: what the test shows

**Date:** 28 November 2026. **From:** the painted rooms thread. **For:** Marc and the main thread.
Everything is **[Proposal]** unless it says [Source] or "measured".

**Try it:** https://christopherfi-dev.github.io/galaxy_math_quest/rooms/ (iPad sideways is best).
**The other two parts:** the style guide, `GMQ_Painted_Rooms_Style_v1_2026-11-28.md`, and the prompt book, `GMQ_Stardust_Prompts_v1_2026-11-28.md`.

---

## 1. What the test page does

- **Four of your Gemini rooms,** as they came. The Docking Bay leads north to the Entry Hall (R11) and east to the Hangar (R15), as on Tally Station. The Greenhouse hangs off the Entry Hall's left doorway **for this test only**; on Tally Station it is far away. (Updated after your batch 1, 28 November.)
- **Tap the floor to walk.** The cadet finds a way round the little ship, the lectern and the plant beds. It turns to face where it walks (your four views), bobs a little, and is smaller at the back of the room.
- **Tap a way out,** and the picture slides to the next room: sideways through a side door, up or down through a back door or the Entry Hall's gap at the front.
- **Things to find and use:**
  - the robot is asleep: "Its battery is flat";
  - a battery lies by a plant bed in the Greenhouse: take it;
  - give it to the robot: it wakes (the game draws its open eyes) and follows you between rooms;
  - the space suit still hanging in the Entry Hall has a key card in its pocket; it wakes the Hangar's launch console once the lights are on;
  - an old tin in the Greenhouse holds only crumbs.
- **The light switch** beside the station door fades every room that has a lit picture from dark to lit. In the dark, the cadet and the things are darkened to match.
- **The visitors' book** opens big, filling the picture, with the game's words on its blank pages. **The Entry Hall's big screen** shows the duty board (lit only), with the game's words.
- **The Hangar's three gauges are drawn by the game** over Gemini's painted ones, a different amount in each tank for each child. "Look closely" shows them big.
- **One number drawn by the game on a painted screen:** the small wall screen by the cargo door shows the bay's temperature, a different whole number from 9 to 17 for each child. It is drawn in perspective, so it sits on the screen. "Look closely" shows it big.
- **The bottom of the picture is kept clear** and marked "the game's bar goes here".
- **Everything answers a tap,** about 20 things, so a tap never gives a secret away.
- **It remembers.** Close it and open it again: same room, same pocket, lights still on. "Start again" clears it.

## 2. What works

- **The painted rooms look good with the game's things in them.** The cut-outs, with a soft shadow and darkened to match the room, look as if they belong. (Pictures: `proposals/pictures_painted_rooms_2026-11-28/`.)
- **The dark-to-lit fade works,** because your two pictures line up exactly.
- **The cadet's four views work.** It does not jump when it turns.
- **Walk maps are quick to draw:** a floor outline and a few blocks per room, about 20 to 30 minutes a room with checking. The same map serves the dark and the lit picture.
- **It is light:** 788 KB to load at 1× and 1,166 KB at 2× with four rooms (measured in Chromium; the test page loads all four at once, the game would load only the room and its neighbours). The page's own work per frame is under 0.3 ms.

## 3. What does not work, or not yet

- **A painted screen is too small to read.** The Docking Bay's wall screen is about 12 pixels wide on an iPad. A number painted there is only decoration. **So:** every number a child reads is shown in a close-up drawn by the game. The prompt book asks for big, blank screens where numbers go.
- **The cadet cannot walk behind painted furniture.** The picture is flat. The test page blocks the floor behind the little ship. **So:** tall things against walls (in every prompt). The other way, cutting a "front piece" from each tall thing, costs more work per room.
- **Things that change cannot be painted.** The test Greenhouse's plants are painted, so they could never recover when watered. **So:** plants on magenta; the prompt book redoes the Greenhouse with empty beds.
- **A phone held upright** makes the picture 370 pixels wide: too small to tap well. Sideways is fine.
- **Not seen on an iPad.** The class uses Chrome on iPads, which runs on Apple's engine (WebKit), not Chromium. Chromium cannot stand in for it. Three things to watch on a real iPad: the fade, the darkening filters, and memory. Each 2× room picture holds about 12.5 MB once opened; the test page holds three.
- **The test Greenhouse does not match the plan's doors.** It has a left door that the plan does not. Test only; R05 replaces it.

## 4. How the game would use it

- **The game stays one file.** The pictures sit beside it as files: for example `docs/img/stardust/r11_entry_hall_lit_2360.webp`. The game file only names them.
- **The piece of code** is between the markers `GMQ ROOMS: start` and `GMQ ROOMS: end` in `docs/rooms/index.html`. It holds: the walk maps and path finding, the cadet and things, the slide, the lights, close-ups, saving. The main thread lifts it into the game.
- **Each room is written as data:** its pictures, floor outline, blocks, depth line, tap areas with their words, ways out, and where things stand. A new room is a new block of data, not new code.
- **The words, numbers and checks stay in the game** (and later the server), as now. The AI's role is unchanged.
- **Only the room the child is in, and the rooms next to it, are loaded.**
- **The bar at the bottom** is the main thread's. The test page only keeps the space clear.

## 5. Checks

- **`node checks/rooms_test.js`: all passed.** It checks:
  - every stand point and door on both walk maps can reach every other;
  - the temperature rule on 10,000 seeds: whole numbers 9 to 17, all nine used;
  - a child's play-through at iPad sideways (1180 × 745), iPad upright (820 × 1180), phone upright (390 × 844) and phone sideways (844 × 390): tapping the robot too early, the switch, the screen, the book, the door, the tin, closing and reopening, the battery, waking the robot, the key card, the robot following, a tap on the bar doing nothing, the cadet never walking into the bar, and no errors.
- **`python3 checks/rooms_make_images.py`** makes the game's pictures from yours (sizes, WebP, JPEG and PNG).
- **Looked at:** every picture at the four sizes, and every word against the picture. Pictures in `proposals/pictures_painted_rooms_2026-11-28/`.
- **Not done:** an iPad; a real child; VoiceOver; the test page with the real bar; the Stardust rooms themselves (not made yet).
- **A shortcut:** the frame times are from Chromium without a screen, which always runs at 60 frames a second. They say the page is light, not how an iPad will do.

## 6. Your decisions, shortest first

| # | Decision | Choices | My pick |
|---|---|---|---|
| 1 | How the child moves | tap where to go (the test page) · arrows on the screen | **tap where to go**: one finger, no small buttons, as on the station |
| 2 | Do things that matter sparkle? | no · yes, always · yes, after a long time stuck | **no**: everything answers a tap instead. A stuck child gets the story's clues (the robot, the vent, Mission Control) |
| 3 | How you send the pictures | one zip per sitting in Google Drive, link to the main thread · in the chat, about 10 at a time | **Drive**: one sitting is 50 to 100 MB |
| 4 | Phones | allowed, sideways only (the game asks to turn) · allowed both ways · iPads only | **sideways only**: upright is too small to tap |
| 5 | Redo the Greenhouse with empty beds (plants as cut-outs) | yes · keep yours, the plants never change | **yes**: watering should show |
| 6 | Try the test page on the oldest class iPad, in Chrome | yes, before Stardust is built · later | **yes, before**: it is the one thing Chromium cannot tell us |

## 7. Your batch 1, checked (28 November)

Seven pictures from the main thread's list. The 9-point check is in the style guide, section 9.

| Picture | Result | What to do |
|---|---|---|
| **R11 Entry Hall,** dark and lit | ways out right (back door, left, right, a gap at the front); camera matches (back wall meets the floor 38% down); middle open; no words; screens and frames blank; dark and lit line up (the main thread measured it). The front gap's wall ends sit in the bottom sixth, but the gap's top is above the bar, so the way south works. | **Keep.** In the test page. Two small things: the hanging suit, full size with its helmet on, can look like a person standing there; and there are five hooks, where the story says four. The game's words never count the hooks. **Optional** redo: the suit hanging limp, its helmet on a shelf, four hooks. |
| **R15 Hangar,** dark and lit | ways out right (the left archway matches the Docking Bay's right one; back door; space doors); camera matches; lines up. **The gauges have needles and ticks.** **The *Stardust* is about the size of the Docking Bay's little ship,** though the story calls it the big ship. | **Keep.** The game covers each painted gauge with its own dial (in the test page; it has to anyway, because each child's tanks differ). **No redo needed for the gauges.** **Optional,** your choice: a new Hangar with a much bigger *Stardust*. |
| **C1** eight cadets | eight different children, girls and boys, different skin and hair; same suit; same height. The four on the right touch at the gloves; they still cut apart. | **Keep.** Next: CV1 to CV8 (each from four sides), so the chosen cadet can turn as it walks. |
| **C2** robot awake, four sides | the same robot each time. | **Keep.** |
| **C3** eight things | clear, separate, no words. | **Keep.** The prompt book's C3b now asks only for what is still missing. |

**The size:** batch 1 is 1344 × 756 JPEG; your tests were 2730 × 1536 PNG. On iPads at 2× the picture is stretched by about a third, so outlines are a little soft. Usable; no redo for this. The main thread found the cause: a picture downloaded on its own is full size (2730 × 1536); Gemini's batch zip shrinks them. Prompt book, section 6c.

**Walk maps** for R11 and R15 are drawn (in `docs/rooms/index.html`; pictures `walk_map_entry_hall.webp` and `walk_map_hangar.webp`). The Hangar blocks the floor behind the *Stardust* and behind the console.

**Is the hanging suit something a child takes?** No. In the story the child looks in its pocket and finds the key card; the card is a cut-out, the suit stays painted. (If the story later has the Chief put her suit on, the empty hook would need another picture. Asked the Stardust story thread.)
