"""Check the story-problem bank (content/scenario_bank_numerix.json).   [Proposal]

Each scenario wraps one tested number rule in a short story set in Marc's world.
Code picks the numbers and knows the answer. The story only carries them.

This script checks every scenario:
  - it names a real rule, and uses exactly the numbers that rule gives
  - no sentence is longer than 15 words (the Math Skills limit for word problems)
  - no long or rare word slips in
  - every rule has at least 3 scenarios, and no two scenarios are the same
  - the story, filled with numbers from 2,000 seeds, still reads correctly

Run:  python3 checks/scenario_bank_check.py     (standard library only)
"""
import json, os, random, re, collections

HERE = os.path.dirname(os.path.abspath(__file__))
BANK = json.load(open(os.path.join(HERE, "..", "content", "scenario_bank_numerix.json"), encoding="utf-8"))
NEEDS = {"pv_order": {"a", "b", "c"}, "pv_partition": {"n", "eq"}, "round10": {"n"}, "round100": {"n"}, "count_on": {"s1", "s2", "s3"},
         "odd_one_out": {"x", "y", "z", "kind"}, "add_1digit": {"a", "b"}, "sub_1digit": {"a", "b"}, "add_2digit_plain": {"a", "b"},
         "sub_2digit_plain": {"a", "b"}, "add_2digit_regroup": {"a", "b"}, "sub_2digit_regroup": {"a", "b"}, "mult_repeated": {"g", "e"},
         "mult_2_5_10": {"g", "e"}, "mult_facts": {"g", "e"}, "div_share": {"t", "d"}, "div_2_5_10": {"t", "d"}, "div_facts": {"t", "d"},
         "ten_more_less": {"n", "d"}, "hundred_more_less": {"n", "d"}, "count_back": {"s1", "s2", "s3"}, "sub_tens": {"a", "b"}, "add_three": {"a", "b", "c"},
         "add_3digit_plain": {"a", "b"}, "add_3digit_regroup": {"a", "b"}, "sub_3digit_plain": {"a", "b"}, "mult_tens": {"g", "e"}, "missing_add": {"a", "s"},
         "missing_factor": {"g", "p"}, "frac_set": {"num", "den", "t"}, "time_forward": {"t1", "t2", "unit"}, "perimeter_rect": {"l", "w"}, "area_rect": {"l", "w"}, "money_change": {"a"}}
# long words that are fine here: they are names from Marc's world, or taught maths words
OK_LONG = {"flavorburst", "flavorbursts", "gumblefish", "butterflies", "butterfly", "asteroids", "asteroid", "light-years", "altogether", "equally", "100-baht"}


def sample(rule, r):
    extra = {"ten_more_less": {"n": 351, "d": "more"}, "hundred_more_less": {"n": 531, "d": "less"}, "count_back": {"s1": 500, "s2": 400, "s3": 300}, "sub_tens": {"a": 70, "b": 20},
             "add_three": {"a": 18, "b": 29, "c": 39}, "add_3digit_plain": {"a": 431, "b": 254}, "add_3digit_regroup": {"a": 149, "b": 174}, "sub_3digit_plain": {"a": 764, "b": 534},
             "mult_tens": {"g": 7, "e": 30}, "missing_add": {"a": 3, "s": 15}, "missing_factor": {"g": 7, "p": 28}, "frac_set": {"num": 3, "den": 4, "t": 32},
             "time_forward": {"t1": "3:10", "t2": "3:45", "unit": "minutes"}, "perimeter_rect": {"l": 12, "w": 3}, "area_rect": {"l": 7, "w": 4}, "money_change": {"a": 55}}
    if rule in extra: return extra[rule]
    if rule in ("add_1digit",): return {"a": r.randint(1, 9), "b": r.randint(1, 9)}
    if rule == "sub_1digit": a = r.randint(2, 18); return {"a": a, "b": r.randint(max(1, a - 9), min(9, a - 1))}
    if rule.startswith("add_") or rule.startswith("sub_"): return {"a": r.randint(50, 99), "b": r.randint(10, 49)}
    if rule.startswith("mult_"): return {"g": r.randint(2, 10), "e": r.randint(2, 10)}
    if rule.startswith("div_"): d = r.randint(2, 10); return {"t": d * r.randint(2, 10), "d": d}
    if rule == "pv_order": a, b, c = r.sample(range(100, 1000), 3); return {"a": a, "b": b, "c": c}
    if rule == "pv_partition": return {"n": 637, "eq": "637 = 600 + 30 + __"}
    if rule in ("round10", "round100"): return {"n": r.randint(101, 949)}
    if rule == "count_on": return {"s1": 300, "s2": 310, "s3": 320}
    return {"x": 14, "y": 27, "z": 30, "kind": r.choice(["odd", "even"])}


def main():
    bad, seen, per = [], set(), collections.Counter()
    for i, s in enumerate(BANK):
        tag = f"#{i} {s['rule']}"
        if s["rule"] not in NEEDS: bad.append(tag + ": unknown rule"); continue
        per[s["rule"]] += 1
        used = set(re.findall(r"\{(\w+)\}", s["text"] + " " + s["ask"]))
        if used != NEEDS[s["rule"]]: bad.append(f"{tag}: uses {sorted(used)}, rule gives {sorted(NEEDS[s['rule']])}")
        if s["where"] not in ("station", "voltara", "space"): bad.append(tag + ": unknown place")
        key = s["text"] + s["ask"]
        if key in seen: bad.append(tag + ": repeated scenario")
        seen.add(key)
        r = random.Random(i)
        for _ in range(2000 // len(BANK) + 1):
            full = (s["text"] + " " + s["ask"]).format(**sample(s["rule"], r))
            for sent in re.split(r"(?<=[.?!])\s+", full):
                n = len(sent.split())
                if n > 15: bad.append(f"{tag}: {n} words in one sentence: {sent}")
        for w in re.findall(r"[A-Za-z][A-Za-z'-]+", s["text"] + " " + s["ask"]):
            if len(w) > 9 and w.lower() not in OK_LONG: bad.append(f"{tag}: long word '{w}'")
    for rule in NEEDS:
        if per[rule] < 3: bad.append(f"{rule}: only {per[rule]} scenarios")
    words = [len(re.split(r"(?<=[.?!])\s+", s["text"])[0].split()) for s in BANK]
    print(f"{len(BANK)} scenarios for {len(per)} rules. {min(per.values())} to {max(per.values())} for each rule.")
    print("Places:", dict(collections.Counter(s["where"] for s in BANK)))
    print(f"Longest first sentence: {max(words)} words. Average: {sum(words)/len(words):.1f} words.")
    for b in sorted(set(bad)): print("  PROBLEM", b)
    print("RESULT:", "PASS" if not bad else "FAIL")


if __name__ == "__main__":
    main()
