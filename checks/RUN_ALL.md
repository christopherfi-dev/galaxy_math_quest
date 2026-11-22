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
| `coordinate_route_check.js` | Marc's Coordinate Plotting as his class did it (2-2): 10,000 cadets' routes walked again day by day (on the chart, no point twice, at least one day back and one day down, the end follows); the help for 1,000 wrong trails names the right day and never the star; the route and taps come back after closing the game. Needs Playwright |
| `cargo_load_check.py` | Cargo Load (2-3): every one of the 330 ways to pick 7 of the 11 crates, read from the game. 33 make exactly 30; every crate is in a right load; from every wrong load one swap comes closer, so the help can always be followed |
| `emergency_power_check.js` | Emergency Power (5-3), for 10,000 cadets: round 1 cannot be made without breaking a ten, and can be with one; round 2, after a plain round 1, always needs a hundred broken; after a strange round 1 (extra blocks broken) it still fits what is left. Needs Playwright |
| `fuel_route_check.js` | Fuel Calculation (2-1), for 10,000 cadets: exactly one of the two ways lands with at least 10 units; every amount from 1 to 199; no landing at 9, 10 or 11; each way is right about half the time. Needs Playwright |
| `weapons_code_check.js` | Weapons Coding (4-1), for 10,000 cadets: 36 different numbers from 1 to 999; the V is all odd; exactly 4 odd numbers outside it, so the shape alone is not enough; one-, two- and three-digit numbers on every screen. Needs Playwright |
| `stone_paths_check.js` | Stone paths on Xylophora: 3,000 random floor layouts; the stones carried always allow a good network (three cheapest paths to one meeting square, rebuilt and checked as joined) and never allow stones on every square. Needs Playwright |
| `judge_planet_check.js` | Judge a planet (Project Second Home): 10,000 cadets; exactly one planet fits all three needs; no fact on a limit; no temperature below zero; the day to round is never halfway. Needs Playwright |
| `world_web_check.py` | The world web plan (`proposals/GMQ_World_Web_v1_2026-11-21.csv`): every need exists and can be met from the start, no loops, nothing new needs a place not built, no built thing needs something new, no planet's own job waits on another planet, every new thing has a use, no job or landing needs a secret (rule 8; Voltara's two cases are listed as waiting on Marc). Reports the finds that lead nowhere. Python only |
| `no_secret_needed_test.js` | No secret is needed to finish the station: a new cadet with an empty bag and no secrets reaches all 15 tasks and launches. Also: no square past the gap can be walked on until the poster switch is on. Fails on version 83, passes on 84. Needs Playwright |
| `lengthar_check.js` | Planet Lengthar's numbers, the game's own rule on 20,000 cadets: eight lengths in one window of five half centimetres (3 to 12 cm); one most common length; whole and half lengths; the last four end 1 mm from a mark, never between; one answer to the plot's question; the example is not one of the cadet's lengths; the Guardian lies and tells the truth at least once each; the ruler never starts at 0. Needs Playwright |
| `lengthar_test.js` | Plays Planet Lengthar on three screens: arrival screens; the example first; the rod (½, ¼, ¾, 2/4 on ½, 4/4) with wrong taps caught; eight things measured by sliding the ruler with a real tap, each picture checked to be exactly its length; closing the game half-way; the line plot by real taps; the Guardian's three crystals; the true ruler; the report home. Needs Playwright, about 3 minutes |

## The Voltara fly-in (its own pages, not the game)

| File | What it checks |
|---|---|
| `flyin_testpage_test.js` | The iPad test page (`docs/flyin/test.html`): on three screens it starts, ends by itself with a number on each line, fits the screen and asks the network for nothing; it copes with no WebGL 2, the words a real iPad sends, an iPad turned in the middle, and Test again. It does not check speed: this machine draws WebGL in software. Needs Playwright. About 1 minute |
| `flyin_test.js` | The Voltara fly-in as its own page (`prototypes/voltara_flyin.html`, copied to `docs/flyin/index.html`): it starts and ends by itself on time on four screens (10 seconds at the fast speed, 15 at the usual one), and its last picture is the meadow; a tap skips it at every second; it gives way at once with no WebGL 2, a slow set-up, a hidden page or a lost picture; the short one; an iPad turned in the middle; Watch again; no network; the piece for the game is under 60 KB. It does not check speed. Needs Playwright. About 3 minutes |

## Play tests: a real browser plays the game

| File | What it plays |
|---|---|
| `station_playthrough_test.js` | The whole station: 15 tasks, 5 parts, 18 secrets, launch. On Cargo Load it checks there is no running total, then tries six crates, no sum, a wrong sum, an eighth crate, a right sum that is too heavy, leaving and coming back, and a right load. On Coordinate Plotting it presses with no taps, names a wrong day, leaves and comes back to the same trail, then tries a right mark with wrong numbers and right numbers with a wrong mark. On the Energy Grid it also types the two other numbers a child could mean, and checks the words that come back are on the screen |
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

## The battle thread's checks

| File | What it checks |
|---|---|
| `battle_cards_review_check.py` | The review of the old cards (`proposals/GMQ_Cards_Review_v1_2026-11-22.csv`): every count in the note worked out again from the spreadsheet, the three totals for a ship of five Standard parts, each printed description against each set of numbers, and how many cards each of the three rarity options would move. `python3 checks/battle_cards_review_check.py`; the last line is `ALL OK`. |
| `battle_cards_set_check.py` | The new card set, read from the page that shows it (`prototypes/card_battle_cards.html`): the counts and the mix, the number rule (every card in its step, no two the same, every rare above every common), each badge against its words, each ship part against its kind and its description, the totals for whole ships, each card's number rule on 20,000 random ships, and that `docs/battle/cards.html` is the same file. `python3 checks/battle_cards_set_check.py`; add `--csv` to write the list again. |
| `battle_cards_page_test.js` | The new-cards page as a person uses it, at iPad sideways, iPad upright and phone: every card drawn, no text outside a card, a tap opens a card large, Keep / Change / Drop, a note, closing and opening again, the filter, the text to copy. `node checks/battle_cards_page_test.js [folder for pictures]`. |
| `battle_engine_test.js` | The practice battle's rules, computer against computer (`prototypes/card_battle.html`): all 24,576 combinations of switches, 4 battles each, then 24,000 more with Standard ships. It tests Marc's rule of 22 November case by case (a common card cannot block a rare attack card; common and rare cannot block gold), and measures going first against going second. After every round: no HP or shield below 0, nothing carried over past a shield, each lost part's penalty held, a stopped Spy did nothing, each deck kept its cards, each deck has the Spy and Guard cards the switches say, and the lead passes from one player to the other each round. Every battle ends; "nobody wins" only when it should. It prints how long battles last and who wins. `node checks/battle_engine_test.js [battles for each combination]`. About half a minute. |
| `battle_page_test.js` | The practice battle played as a child would, at iPad sideways, iPad upright and phone: the first screen, the picture, a wrong sum (twice), a split that does not add up, closing the page between rounds and in the middle of one, the rules screen, a whole battle to its end, the log, that the leader's card is on the table before the other player chooses, and a few rounds of the two "both together" ways to play. `node checks/battle_page_test.js [folder for pictures]`. Under a minute. It stops itself with a message if it ever stalls. |
