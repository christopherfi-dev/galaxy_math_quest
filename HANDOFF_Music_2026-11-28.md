# Brief: the music thread (better music, still made by the game)

**Date:** 28 November 2026. **From:** the main thread (conductor). **For:** a builder session. You build a piece on your own page. The main thread wires it into the game.
Everything is **[Proposal]** unless it says [Source].

---

## 0. The line that starts you

> You are the music thread for Galaxy Math Quest. Read CLAUDE.md, then HANDOFF_Music_2026-11-28.md, and do it. You may push your own files to claude/trusting-edison-vl78nc, merging first.

## 1. Why [Source: Marc, 28 November]

- "Our music kinda sucks." He found an online demo with "amazing music" (he calls it the summoning demo; ask him for the link through the main thread).
- The task he passed on, from another AI (Grok): "Improve the existing music system. Keep it pure Web Audio (no files). Make the per-world loops more musical and atmospheric — quieter, more layered, with a bit of the cinematic feel of the summoning demo, but suitable for kids doing math. Add gentle variations so short loops don't get tiring. Keep it low-CPU and off-by-default."
- Earlier: "Do music... Each world or each place get their own music" (22 November; a child asked for it).

## 2. What is there now

- In the game file (`prototypes/kis_station_sketch.html`), the block that starts `MUSIC.   [Source: Marc, 2026-11-22` (about 80 lines; search `const TUNES`).
- 11 tunes: `title`, `station`, `space`, `voltara`, `worlds` (the 20 small worlds), `chrono`, `cave` (Chronosia's dark cave, workshop and stair), `xylo`, `star` (Operation Stardust), `len` (Lengthar). `musPick()` chooses one from where the cadet is.
- Each tune is 4 bars of bare oscillators (sine, triangle, square), with no reverb, filters or chords that move. Every third time round the melody rests.
- It gets quieter while a task box is open, while words wait to be read, and while "Read to me" speaks. Off until "Music" is tapped, and remembered on that iPad (`gmq-music`). It starts only after a tap (an iPad rule), and stops when the page is hidden.
- Not yours: Algora's own five tunes on `docs/bigworld/` (the big world thread's).

## 3. What to build

**A piece, `GMQMusic`, between `GMQ MUSIC: start` and `GMQ MUSIC: end` markers, on its own page, `docs/music/index.html`.** It is a listening page: each world's tune, old and new, with a switch for "a task is open" (to hear it go quieter) and a count of voices playing.

- **The same jobs as now,** so the main thread can swap the block: start, stop and wake on a tap; one tune for each place id above; quieter while busy; off by default; pause when the page is hidden.
- **Made by the game: pure Web Audio, no sound files.** An echo (reverb) made in code, with one shared for all voices. Layers: a soft pad, a melody, a low note, small sounds of the place.
- **Gentle variation:** the same tune never plays exactly the same way twice in a row, within rules that keep it in key and calm.
- **For children doing maths:** quiet, under the game's own beeps and "Read to me". No strong beat, no sudden swells, nothing frightening. Each world sounds like itself: Voltara's energy, Chronosia's clocks, the cave's drips, the mission ship's mystery.
- **Original.** Be inspired by how the demo makes its feel; copy no notes, sounds or code from it or from any song.
- **Low CPU on the class's iPads.** The class uses Chrome on iPads, which runs on Apple's engine (WebKit), not Chromium. Keep the voices playing at once few. No `AudioWorklet`; keep `webkitAudioContext` as a fallback. No `?.` and no `??` (older iPads).

## 4. Nobody here can hear it, so Marc must

- **Render each tune to a sound file** (about 60 seconds each, in headless Chromium with `OfflineAudioContext`), in `docs/music/samples/`, old and new side by side, so Marc can listen on his phone without the game.
- **Measure what you can:** loudness (peak and average) against today's tunes and the game's beeps; voices at once; time spent per minute of music.
- **Show him a little first.** Two worlds (the station and Voltara), each in two styles (for example A: calm and spacious; B: more tune). He picks by ear. Then do the rest in his pick. This saves his tokens and yours.
- **Send questions for Marc to the main thread** (`send_message` to `@parent`), and write them in your note too. The main thread gathers them into one list for him.

## 5. Deliver

- `docs/music/index.html` (the piece and the listening page), `docs/music/samples/`.
- `proposals/GMQ_Music_v2_2026-11-28.md`: what changed and why; how to wire it in (which lines of the game's block go, what replaces them); Marc's decisions, shortest first, each with your pick. Still open from `proposals/GMQ_Music_v1_2026-11-22.md`, decision 1: off or on at first (keep off for now).
- A check, `checks/music_*`: the piece starts, changes tune by place, goes quieter when busy, stops, and never has more than its voice limit playing at once.

## 6. Your files and limits

- **Yours:** `docs/music/*`, `proposals/GMQ_Music_*` dated 28 November or later, `checks/music_*`, and lines added at the end of `INFO_FROM_MARC.md`.
- **Never edit the game file,** `docs/index.html`, `docs/next/index.html`, the handoffs or the plan.
- Before every push: `git fetch origin claude/trusting-edison-vl78nc && git merge --no-edit FETCH_HEAD`. In `INFO_FROM_MARC.md`, keep both sides of a clash, theirs first.
- Look at your page at iPad sideways (1180 × 745) and on a phone before you say it is done.
