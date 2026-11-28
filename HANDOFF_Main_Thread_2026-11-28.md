# Handoff to the next main thread

**Date:** 28 November 2026. **From:** the main thread of 23 to 28 November (versions 94 to 104). **For:** the new main thread. Read this first, after `CLAUDE.md`.
Everything is **[Proposal]** unless it says [Source].

---

## 0. The line that starts you

> You are the main thread for Galaxy Math Quest. Read CLAUDE.md, then HANDOFF_Main_Thread_2026-11-28.md, and follow it. You may push to claude/trusting-edison-vl78nc.

## 1. Your job: conductor first, builder of the shared parts

[Source: Marc, 28 November: "in general it should be the conductor not necessarily the builder of everything... I'm not sure whether it should be building or should be conducting the storyline and the activities."]

**You conduct.**
- Keep one list of what every thread does next (`proposals/GMQ_Master_Plan_v1_2026-11-23.md`, section 3a).
- Write each thread's brief, review what it delivers (as CLAUDE.md asks: pictures, play it as a child, every word against the picture), and carry Marc's decisions to it.
- Gather the decisions waiting on Marc into one short list, shortest first, with your pick for each.

**You build only what no one else may touch.**
- The game file (`prototypes/kis_station_sketch.html`), the class link (`docs/index.html`) and the preview (`docs/next/index.html`): **only you edit them**.
- So you build: the shared layout (the menu button, job 3), fixes, and **wiring** other threads' pieces into the game.

**You do not design stories or activities yourself.** The story thread designs the storyline and the activities; a builder thread builds a world or a quest as its own piece; you review it and wire it in. This keeps your thread short, which saves Marc's tokens ("Token usage gets high for longer threads", 28 November).

**Ask Marc where the line falls** if a job could go either way. Your pick, with a reason, in one line.

## 2. Where to look

| For | Read |
|---|---|
| Marc's rules | `CLAUDE.md` (loads by itself) |
| What is built, version by version, and how a change is made | `HANDOFF_2026-11-20.md`: section 1 (versions), section 2 (the change loop), section 2b (who owns which files) |
| The jobs in order | `HANDOFF_2026-11-20.md`, section 0 ("The jobs, from 27 November", jobs 1 to 6, with 1a and 1b) |
| Decisions waiting on Marc | `MORNING_2026-11-27.md`, section 3 (12 of them, shortest first) |
| The whole plan, and every decision ever asked | `proposals/GMQ_Master_Plan_v1_2026-11-23.md` |
| Who does what, and the briefs | `HANDOFF_Next_Threads_2026-11-26.md`, `HANDOFF_Cards_2026-11-26.md`, `HANDOFF_Server_2026-11-26.md`, `HANDOFF_Battle_2026-11-26.md` |
| Marc's own words, newest last | the end of `INFO_FROM_MARC.md` (search it; do not read it all) |
| Every test, and how to run it | `checks/RUN_ALL.md` |

**The other threads** are Claude sessions on Marc's account. You can see them and talk to them: `list_sessions` (mine), `list_events` (read what one is doing or waiting on), `send_message` (answer it). On 26 November Marc shared the waiting decisions with the main thread for a night; the rule is in `INFO_FROM_MARC.md` (26 November). **Ask Marc whether that rule still stands** before you use it again.

## 3. The next jobs, in order

1. **Marc's answers** to `MORNING_2026-11-27.md`, section 3. Build or pass on each.
2. **The full picture, with a menu button** (yours to build: it is the shared layout). `HANDOFF_2026-11-20.md`, section 0, job 1a has the facts and the measurements. Tell Marc the honest effect before you build: the station's rooms are limited by height, so full width alone grows the Arrival Dock only 6%; with the words over the picture's bottom, 24%; a tighter frame round each room grows them more.
3. **Operation Stardust rebuilt like the station** (job 1b). **Conduct it; do not design it.** Lay out these options for Marc, with your pick:
   - **A (my pick):** the story thread writes the story and the room plan (16 rooms on a 4 × 4 board, each room's job, its 2 to 4 things, its task or clue, its secret, its doors). Marc decides. A new **Stardust builder thread** builds it in its own copy, between the game's `STAR-BEGIN` and `STAR-END` markers, and tests it. You swap the block in, review, and push. Cost: a block that big needs a careful swap, and a full run.
   - **B:** the story thread designs; you build. Cost: your thread grows long fast.
   - Marc's spitball for the story [Source, 28 November]: an abandoned station; the crew taken to a planet; a rescue later; he liked the temperature and the food tasks. His own Stardust page has "a mysterious signal".
4. **The battle with a child's own cards,** once Marc says where it opens: wire it from `proposals/GMQ_Card_Battle_Wiring_v1_2026-11-26.md` (pass `S.packSeed`).
5. **Chronosia's build list, stages 5 to 7.** Ask Marc whether a builder thread should take it (as job 3, option A), now that it is long and self-contained.

## 4. How to work (learned the hard way)

- **Every push goes to the class link and the preview** [Source: Marc, 23 November: "anything you push me push for them as well. Always"]. Before each copy, `node checks/class_update_test.js docs/index.html prototypes/kis_station_sketch.html`. Then confirm both links show the new version with `curl`.
- **Tests:** a full run when shared code changes (layout, saving, cards, the desk); otherwise the tests the change touches. Always say which ran. A full run takes about 75 minutes in two halves; run it in the background.
- **Every play test sets** `gmq-words` to `open` and `window.GMQ_NO_CARDPOP = true` in its start-up script. Keep both in new tests.
- **The class uses Chrome on iPads** [Source: Marc, 27 November]. On an iPad, Chrome runs on Apple's engine (WebKit). This machine tests in Chromium only, and WebKit is not installed here. Ask Marc to look on one class iPad after a big change.
- **Merging:** fetch and merge before every push. In `INFO_FROM_MARC.md` and `checks/RUN_ALL.md`, keep both sides of a conflict, theirs first.
- **Copied pieces** must be copied again when their thread changes them: the trade market (`GMQ TRADE` block), the cards (`GMQ CARDS` block and `GMQC_LIST`). `checks/trade_market_check.js 20000 prototypes/kis_station_sketch.html` and `checks/cards_sync_check.js` tell.
- **Keep your messages to Marc short.** Plain English, short sentences, a pick for every choice.

## 5. Where things stand (28 November)

- **Live on both links:** version 104. 100: the trade market. 101: words beside the picture (a Teacher try-out). 102: the cards. 103: the market's worked example. 104: Voltara's chapter closes when it shines.
- **Nothing is half-built.** The working tree is clean and pushed.
- **Threads:** cards (finished), battle (waiting on where the battle opens and 7 decisions), server (test folder ready for Marc to upload himself), story (three notes waiting on Marc), visual design (new card pictures and a new world look, on its own branch `claude/eloquent-maxwell-tmb22b`), big world (idle; children's trial still to come).
