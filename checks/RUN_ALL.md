# The checks: what each one is, and how to run them all

Run from the top folder of the project.

```
for c in checks/*_check.py; do echo "$c: $(python3 -I $c | tail -1)"; done
for t in checks/*_test.js checks/picture_audit.js; do echo "$t: $(node $t | tail -1)"; done
```

Each one ends with `RESULT: PASS` or `RESULT: FAIL`. The play tests need Node and Playwright. The server tests also need PHP. All of them together take about 25 minutes.

## Play tests: a real browser plays the game

| File | What it plays |
|---|---|
| `station_playthrough_test.js` | The whole station: 15 tasks, 5 parts, 18 secrets, launch |
| `voltara_quest_test.js` | Mission Voltara: 9 steps, 7 secrets, five days, all four endings |
| `galactic_trade_test.js` | A whole trading season in space |
| `small_worlds_test.js` | All 20 small worlds from the kit, one played through, and the tap-the-words row |
| `mud_rats_test.js` | Mud rats on Voltara: the surprise attack in a dark street, a win, running, too slow, light ends it, band sizes, the rest, the switch |
| `time_wisps_test.js` | Time wisps on Chronosia: 60,000 questions worked out again, where wisps may be, catching and slipping, practice credits (quarters, and turning them in for cards), the skill tally |
| `chronosia_test.js` | Planet Chronosia: the clocks, quakes and timetable worked out again, 20,000 seeds for the two per-cadet quests, the map, and a full play-through of all six quests |
| `street_signs_test.js` | Voltara's three streets can be read: a sign for every place on six screen sizes, no sign covers another, the board, and old saved games |
| `space_hazards_test.js` | The four space hazards: 200,000 sums checked, a hazard passed, failed and flown around, the record kept, and replies to doing words like "cut" |
| `remember_test.js` | The game remembers what you were looking at: "use wrench", "open", "push it" |
| `reading_card_test.js` | The "read, then OK" cards |
| `number_pad_test.js` | The floating number pad |
| `kind_words_test.js` | Rude words are refused and never shown |
| `trainer_paths_test.js` | The teacher's skills bank |
| `picture_audit.js` | 10,000 problems for each picture skill |
| `world_server_test.js` | The world server alone: a cadet, a second device, a stranger, the teacher, the AI reply check |
| `world_online_test.js` | The game page playing against the world server |
| `world_teacher_page_test.js` | The Commander's Desk page |

## Number checks: every number worked out again in code

| File | What it checks |
|---|---|
| `voltara_quest_check.py` | Voltara as built: the city, the river, every plan, the days, the four endings |
| `galactic_trade_check.py` | Galactic Trade as built: rounding, every first trip, every season |
| `chronosia_quest_design_check.py` | The Chronosia design: clocks, quakes, quake day |
| `voltara_values_model_check.py` | The analysis behind Voltara's values. Not the built game. |
| `1-1_check.py` to `5-3_check.py`, `voltara_t1/t2/boss`, `chronosia_t1` to `t4`, `xylophora_t1` to `t3`, `zephyron_t1` to `t3`, `stardust_t1/t2` | Your original tasks, from the review |
| `miniquest_numbers_check.py`, `miniquest_numbers2_check.py`, `card_odds_check.py`, `scenario_bank_check.py` | Earlier proposals |

The server tests never touch your live site. They start PHP's own small server in a scratch folder on the machine they run on.
