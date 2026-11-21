# The checks: what each one is, and how to run them all

Run from the top folder of the project.

```
for c in checks/*_check.py; do echo "$c: $(python3 $c | tail -1)"; done
for t in checks/*_test.js checks/picture_audit.js; do echo "$t: $(node $t | tail -1)"; done
```

Each one ends with `RESULT: PASS` or `RESULT: FAIL`. The play tests need Node and Playwright. The server tests also need PHP. All of them together take about 30 minutes.

## Number checks added 21 November

| File | What it checks |
|---|---|
| `power_allocation_check.py` | Marc's Power Allocation (page 5-2): 680 ways to build the four numbers from only his blocks; every one uses every block; the usual way does not fit |

## Play tests: a real browser plays the game

| File | What it plays |
|---|---|
| `station_playthrough_test.js` | The whole station: 15 tasks, 5 parts, 18 secrets, launch. On the Energy Grid it also types the two other numbers a child could mean, and checks the words that come back are on the screen |
| `voltara_quest_test.js` | Mission Voltara: 9 steps, 7 secrets, five days, all four endings |
| `galactic_trade_test.js` | A whole trading season in space |
| `small_worlds_test.js` | All 20 small worlds from the kit, one played through, and the tap-the-words row |
| `still_picture_test.js` | The picture stays still: 42 moments of play on six screens, six of them on Xylophora and twelve on the mission ship, where the picture follows the cadet. After each one the picture is in the same place at the same size, the page has not scrolled, no keys and no task sit on the picture, keys show only when needed, and the counts are off the main screen |
| `one_screen_test.js` | The picture, the box and every word row are on the screen at once on four iPad screens, a board and a laptop; the More menu hides the mission, ship, cards and teacher's things until asked |
| `small_keyboard_test.js` | Go buttons for each kind of place; the small letter keyboard: on an iPad it sits on the desk, never on the picture or the box, and cannot be dragged; it types, sends, hides, and hands over to the big keyboard and back |
| `tap_words_test.js` | A tapped word goes into the box: the Gumblefish moment, doing word and thing in either order, bag things, the doing words for each kind of place |
| `practice_evidence_test.js` | Practice evidence under the dashboard's 37 skill codes: what is kept, the teacher view with a tab for each thread, counts only, readable, kept after a reload |
| `mud_rats_test.js` | Mud rats on Voltara: the surprise attack in a dark street, a win, running, too slow, light ends it, band sizes, the rest, the switch |
| `time_wisps_test.js` | Time wisps on Chronosia: 60,000 questions worked out again, where wisps may be, catching and slipping, practice credits (quarters, and turning them in for cards), the skill tally |
| `xylophora_test.js` | Planet Xylophora: the game's numbers against the Python check, the skin counted on the map for 3,000 seeds, and a full play-through on three screens with wrong tries, the dry grove, laying the Home again, the map key, the herder's field, two secrets, a reload. No reply may show an answer |
| `stardust_test.js` | Operation Stardust (the mission ship): the game's numbers against the Python check, every square reachable, and a full play-through on three screens with a different cadet on each: five thermometers, last trip's chart shown first, the wall chart (wrong three ways), the fuel log (three wrong months), three tanks (short, right, over), the locker (food gone bad, too little, too much), the food charts, lift-off, both side jobs, dead ends, a reload. No reply may show an answer. Each thermometer, bar and needle is checked as pixels |
| `class_update_test.js` | Before the class link is updated: a small server swaps the class copy for the preview copy under ten games in progress (station, a task open, cards and credits, Voltara, space, Chronosia in the middle of every quest). The cadet must be in the same place with the same cards, credits and finished quests, with no error. Run it before the copy; after it the two files are the same |
| `station_online_test.js` | The station's four real-life tasks played on screen (calibration, star map with its code, target practice, power allocation), the teacher switch and the link ending ?real; and two small fixes: Xylophora names the survey post, the mission ship says when the clipboard shows two rooms out of range |
| `lucky_draw_test.js` | The ship-part choice: the odds on 100,000 draws, Marc's versions, the choice and "Not yet", every colour, the LUCKY DRAW show, saved before the spin, reduce motion |
| `case_test.js` | The time portal case on Chronosia: 5,000 cases worked out again (exactly one person left, and it is the one who went), then played on an iPad and a phone: the portal's clocks, a tap on the chart house map, the danger meter, grids that leave four or nobody, a wrong name and its alibi, the right name, both choices and their marks, a reload |
| `finds_test.js` | Finds from a kit (caves and other things on a map): the game's own check, 21 broken finds it must catch, 35,000 lock questions worked out again, and all nine finds on Chronosia played on two screens by typing and by tapping, with a hidden find, a dead end, a reload and an old saved game |
| `chronosia_test.js` | Planet Chronosia: the clocks, quakes and timetable worked out again, 20,000 seeds for the two per-cadet quests, the map, and a full play-through of all six quests. Four are open problems: the quakes (wrong tries, charges, nudges), and the clocks, who goes where and the Council's day (one sheet each, a count for a wrong sheet, nudges that run out, no answer shown) |
| `street_signs_test.js` | Voltara's three streets can be read: a sign for every place on six screen sizes, no sign covers another, the board, and old saved games |
| `space_hazards_test.js` | The four space hazards: 200,000 sums checked, a hazard passed, failed and flown around, the record kept, and replies to doing words like "cut" |
| `remember_test.js` | The game remembers what you were looking at: "use wrench", "open", "push it" |
| `reading_card_test.js` | The "read, then OK" cards |
| `number_pad_test.js` | The number pad: on an iPad it has its own place on the desk and never sits on the picture; on a phone it floats and can be moved |
| `kind_words_test.js` | Rude words are refused and never shown |
| `trainer_paths_test.js` | The teacher's skills bank |
| `picture_audit.js` | 10,000 problems for each picture skill |
| `world_server_test.js` | The world server alone: a cadet, a second device, a stranger, the teacher, the AI reply check |
| `world_online_test.js` | The game page playing against the world server |
| `world_teacher_page_test.js` | The Commander's Desk page |

## Number checks: every number worked out again in code

| File | What it checks |
|---|---|
| `stardust_quest_check.py` | Operation Stardust as built: 20,000 cadets' numbers. One room breaks its plate, the locker can be filled exactly in 13 ways or more, one month went wrong and one graph alone cannot show it, every tank needs a whole number of litres, one food fell the most |
| `xylophora_quest_check.py` | Xylophora as built: 20,000 cadets' numbers. The skin's area, one best Hospital, one best Food Store, the floors fit, the leaves are enough, one answer for more Homes, every fact inside 10 × 10 |
| `energy_grid_check.py` | The station's Energy Grid as built: all eight number pairs, the three ways the old third question could be read, and that the question now names one section |
| `voltara_quest_check.py` | Voltara as built: the city, the river, every plan, the days, the four endings |
| `galactic_trade_check.py` | Galactic Trade as built: rounding, every first trip, every season |
| `chronosia_quest_design_check.py` | The Chronosia design: clocks, quakes, quake day |
| `voltara_values_model_check.py` | The analysis behind Voltara's values. Not the built game. |
| `1-1_check.py` to `5-3_check.py`, `voltara_t1/t2/boss`, `chronosia_t1` to `t4`, `xylophora_t1` to `t3`, `zephyron_t1` to `t3`, `stardust_t1/t2` | Your original tasks, from the review |
| `miniquest_numbers_check.py`, `miniquest_numbers2_check.py`, `card_odds_check.py`, `scenario_bank_check.py` | Earlier proposals |

The server tests never touch your live site. They start PHP's own small server in a scratch folder on the machine they run on.
