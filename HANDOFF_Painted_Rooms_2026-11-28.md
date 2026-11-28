# Brief: the painted rooms thread (screens painted with Gemini, things and numbers drawn by the game)

**Date:** 28 November 2026. **From:** the main thread (conductor). **For:** a builder session. You build on your own page. The main thread wires it into the game.
Everything is **[Proposal]** unless it says [Source].

---

## 0. The line that starts you

> You are the painted rooms thread for Galaxy Math Quest. Read CLAUDE.md, then HANDOFF_Painted_Rooms_2026-11-28.md, and do it. You may push your own files to claude/trusting-edison-vl78nc, merging first.

## 1. Why [Source: Marc, 28 November; his words are at the end of INFO_FROM_MARC.md]

- **Every world screen by screen,** like the KIS Station and like The Legend of Zelda: each screen designed in detail, the picture sliding to the next screen at its edge, in one consistent style, "as opposed to... roaming around a giant world". He showed Prodigy Math as an example of screens that look good and stay consistent. Nothing is to be copied from it.
- **More to do than Prodigy:** explore, take, use, give, and find secrets. That is what the children enjoyed on the station and on Algora (the spinner for the boy, the stepping stones across the river).
- **Three or four ways out of most screens,** not one way in and one way out.
- **He tested Google Gemini** with the main thread's prompts (pictures in `proposals/pictures_gemini_test_2026-11-28/`, with a README of what was measured), and said: "Go. If it's adequate."
- **What the tests showed:** a painted room in the right style takes about a minute. A "power on" copy lines up exactly with the dark one, so the game can fade between them. A room asked to look different does. Things drawn on flat magenta cut out cleanly. One cadet in four views stays the same size.

## 2. The rule: what is painted, what the game draws

- **Painted (Gemini, by Marc):** each room's walls, floor, doors and fixed furniture, in two states where the story needs it (for example dark and lit).
- **Painted on magenta and cut out:** things that move, change or can be taken (the robot, the battery, the key card, the tin, the book), and the cadet in four views.
- **Drawn by the game, always:**
  - every number or reading a child uses for maths (gauges, labels, charts, thermometers, because each child's numbers differ);
  - every task picture (it fills the picture, CLAUDE.md);
  - anything whose look depends on what the child did.
- **Never** a word or a number painted into a room.

## 3. What to deliver

1. **A style guide,** `proposals/GMQ_Painted_Rooms_Style_v1_2026-11-28.md`:
   - the look in words, from Marc's pictures;
   - the view (from the front and above, like a stage), the lamps, and how dark and lit differ;
   - each world's own colours (Stardust first; a line each for the others);
   - how big the cadet is at the front and at the back of a room;
   - the picture sizes and formats (WebP, with JPEG for iPads older than iOS 14), file sizes, and names;
   - how a thing a child can tap is shown, without giving secrets away.
2. **A prompt book for Marc,** `proposals/GMQ_Stardust_Prompts_v1_2026-11-28.md`:
   - one shared style paragraph;
   - one prompt for each of Stardust's 16 rooms, with its doors placed as the Stardust story note's table of ways out says (`proposals/GMQ_Stardust_Story_v1_2026-11-28.md`), in a dark and a lit version where the story needs both;
   - the magenta sheets of things from its take/use/give table;
   - a set of 6 to 8 different cadets for children to choose from (helmets on, four views each).
   - In the order Marc should run them, in one Gemini chat (start each room by showing Gemini the Docking Bay picture, to keep the style), with what to check in each picture, and how to send them back in one zip.
   - Count the pictures, and say about how long they will take him.
3. **A test page,** `docs/rooms/index.html`, with the piece `GMQRooms` between `GMQ ROOMS: start` and `GMQ ROOMS: end` markers, using Marc's pictures as they are:
   - **Two rooms linked by a doorway.** Use the Docking Bay and the Greenhouse, linked for the test only, and say so.
   - **A walk map for each picture:** the floor, the doors, the things in the way. Tap to walk there.
   - **The cadet:** its four views, a small bob while walking, smaller at the back of the room.
   - **A door slides the screen** to the next room.
   - **Things to tap,** for example: look at the robot; take the battery; give the battery to the robot, and it wakes; open the book, and its words come from the game.
   - **The lights:** the Docking Bay fades from dark to lit when a switch is used. In a dim room, things and the cadet are darkened to match.
   - **One number drawn by the game on a painted panel** (a gauge or a screen), to show how each child's numbers sit on painted art.
   - **The bottom of the picture** stays clear for the game's bar. The main thread owns that bar and is designing it.
   - Look at it at iPad sideways (1180 × 745), iPad upright (820 × 1180) and a phone, and play it as a child.
4. **Measures:** how much the page loads, the time to draw a frame, and memory, in Chromium. Say plainly that no iPad has run it. The class uses Chrome on iPads, which runs on Apple's engine.
5. **A short note,** `proposals/GMQ_Painted_Rooms_v1_2026-11-28.md`: what works, what does not, how the game would use it (it is one file today; pictures would be files beside it), and Marc's decisions, shortest first, each with your pick.

## 4. Read first, only these

- `proposals/pictures_gemini_test_2026-11-28/` (the pictures, the cut-outs and the README) and the end of `INFO_FROM_MARC.md` (Marc's words of 28 November; the three prompts are in the main thread's answer, recorded there).
- `proposals/GMQ_Stardust_Story_v1_2026-11-28.md`: sections 3 (the rooms and the ways out) and the take/use/give table. Its scope note, `proposals/GMQ_Stardust_Story_Scope_v1_2026-11-28.md`, for the jobs.
- `HANDOFF_2026-11-20.md`, section 3: Marc's rules about the game. Especially: the picture stays still; nothing gives the answer away; check every word against the picture.

## 5. Your files and limits

- **Yours:** `docs/rooms/*`, `proposals/GMQ_Painted_Rooms_*`, `proposals/GMQ_Stardust_Prompts_*`, `checks/rooms_*`, and lines added at the end of `INFO_FROM_MARC.md`.
- **Never edit** the game file, `docs/index.html`, `docs/next/index.html`, the handoffs, the plan, or another thread's files.
- **Original only.** Nothing copied from Prodigy Math or any game. No photos of real children, ever.
- Before every push: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. In `INFO_FROM_MARC.md`, keep both sides of a clash, theirs first.
- **Questions for Marc go to the main thread** (`send_message` to `@parent`); it gathers them. Tell it the same way when each part is pushed.
- The Stardust story thread (session_0175gYCU7EyaZyKSW793cgMS) owns the room plan. Ask it, through the main thread or directly, if a room's doors or things are unclear.
