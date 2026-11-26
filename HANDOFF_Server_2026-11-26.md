# Brief for the server thread

**Date:** 26 November 2026. **From:** the main thread (conductor). **For:** a new thread that brings the class server to life, one safe step at a time.
Everything is **[Proposal]** unless it says [Source]. Your own choices without Marc: mark them **[pick]**.

[Source: Marc, 26 November: "they can't battle each other yet unless we can start trying to set a test server for that.. So we need to be moving forward always."]

---

## 1. Read first

1. `CLAUDE.md`. Above all: **never edit Marc's live server**, never copy keys or passwords, never open student data.
2. `HANDOFF_2026-11-20.md`, section 2b: who owns what.
3. `HANDOFF_Next_Threads_2026-11-26.md`: the plan, and where you fit.
4. `engines/gmq-world/server/README.md`: the server built on 17 November (version 0.1). PHP, flat JSON files, a login, a teacher's page. It has never run on Marc's site.
5. `proposals/GMQ_Server_Layers_Analysis_v1_2026-11-22.md`, and the plan's Stage 5 (`proposals/GMQ_Master_Plan_v1_2026-11-23.md`).
6. The tests that already run it on this machine: `checks/world_server_test.js`, `checks/world_online_test.js`, `checks/station_online_test.js`. PHP is installed in this container.

## 2. What exists

- The server: a cadet's game kept on any device, the codes for real-life tasks, ship names held until the teacher approves, the teacher's class page, and the AI step (inside the constraint file).
- The game already has online code (`NET`, `netPush`, the "Flying as" bar). Read it; never edit the game file.
- It does not run battles. It has no cards between children.

## 3. The steps

1. **Run it as it is.** All three tests pass here. Read what they cover and what they do not.
2. **A test folder on Marc's site, uploaded by Marc himself.**
   - A zip and plain steps: what to upload, where (a new folder, not his live game), the one file he fills in on the server, and how he knows it works.
   - Your steps never ask him to paste a key or a password into a chat.
   - Pretend players only: made-up names, never children's.
3. **The first thing a class does together: cards.** [pick the shape, then ask Marc]
   - A child's card book kept on the server, so it follows them to any iPad.
   - A class card board: which cards classmates have found (no names a child did not choose; the ship name, as the server already does).
   - **Challenge battles:** a child battles a classmate's saved deck, played by the computer. Nobody has to be online at the same time. Live battles come later, if ever.
   - The battle's rules are Marc's and the battle thread's. You store and send decks and results. You change no rule.
4. **A test with pretend classmates** (as Algora's brief asked): 14 made-up children, two iPads each, at the same time.

## 4. Questions for Marc (lay out options; do not decide)

- Which address for the test folder, and when he uploads it.
- Names: the ship name only, or the first name too, inside one class?
- Whether challenge battles are the right first thing to share.
- What the teacher sees, and can switch off.

## 5. Limits

- Never edit the game file (`prototypes/kis_station_sketch.html`, `docs/index.html`, `docs/next/index.html`). Write a wiring note; the main thread wires it in.
- Your files: `engines/gmq-world/*`, `proposals/GMQ_Server_*` (dated after 26 November), `checks/server_*`. `engines/gmq-world/server/api/config.php` and `api/data/` are never in git or a zip.
- Push to `claude/trusting-edison-vl78nc`, merging first. In `INFO_FROM_MARC.md`, keep both sides of a merge conflict.

## 6. Report

What a teacher and a child can do now, what you tested and how, what you did not test (a real phone on Marc's site), your [pick]s, decisions for Marc, and a short message for the main thread.
