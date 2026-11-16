"""Card draws: what do different odds give a student over a year?  [Proposal]

Marc's rules (2026-11-16): a mini quest or mini battle gives one random card.
A major quest (a project) always gives a gold card. There should be set odds
for common, rare and gold.

The odds below are options, not Marc's numbers. The set sizes are assumptions:
his card files use Common, Advanced and Epic, and the original set has about
130 cards. This script shows what each option means, so he can choose.

Run:  python3 checks/card_odds_check.py     (standard library only)
"""
import random

SET = {"common": 80, "rare": 35, "gold": 15}      # assumption: 130 cards in all
MINI_PER_YEAR = 168                               # 2 a sitting x 3 sittings x 28 weeks (assumption)
PROJECTS = 20                                     # about 20 project sittings a year (assumption)
OPTIONS = {"A  80 / 17 / 3": (80, 17, 3), "B  70 / 25 / 5": (70, 25, 5), "C  60 / 30 / 10": (60, 30, 10)}
STUDENTS = 10_000


def year(rng, odds):
    have = {k: set() for k in SET}
    golds_from_luck = 0
    for _ in range(MINI_PER_YEAR):
        x = rng.random() * 100
        tier = "common" if x < odds[0] else "rare" if x < odds[0] + odds[1] else "gold"
        golds_from_luck += tier == "gold"
        have[tier].add(rng.randrange(SET[tier]))
    for _ in range(PROJECTS):
        have["gold"].add(rng.randrange(SET["gold"]))
    return have, golds_from_luck


def main():
    print(f"{STUDENTS:,} simulated students. {MINI_PER_YEAR} mini quests and {PROJECTS} projects each.")
    print(f"Set: {SET}\n")
    print(f"{'odds (common/rare/gold)':26} {'gold from luck':>15} {'no lucky gold':>14} {'different cards owned':>22} {'whole set':>10}")
    for name, odds in OPTIONS.items():
        assert sum(odds) == 100
        rng = random.Random(1)
        lucky, none, owned, full = [], 0, [], 0
        for _ in range(STUDENTS):
            have, g = year(rng, odds)
            lucky.append(g); none += g == 0
            n = sum(len(v) for v in have.values()); owned.append(n); full += n == sum(SET.values())
        lucky.sort()
        print(f"{name:26} {sum(lucky)/STUDENTS:8.1f} (5%-95%: {lucky[STUDENTS//20]}-{lucky[-STUDENTS//20]})"
              f" {100*none/STUDENTS:11.1f}% {sum(owned)/STUDENTS:15.0f} of {sum(SET.values())} {100*full/STUDENTS:9.1f}%")
    print(f"\nEvery student also gets {PROJECTS} gold cards from projects, whatever their luck.")
    print("So gold from projects is the floor. Gold from luck is the surprise.")
    print("RESULT: PASS")


if __name__ == "__main__":
    main()
