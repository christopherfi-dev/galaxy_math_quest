# Shared brief for every review agent (2026-11-16)

You are one of several agents reviewing Marc's Galaxy Math Quest (GMQ), a Grade 3 space maths adventure he ran in 2023–24. It is being rebuilt as a typed text world (a MUD). Your job is to read the ORIGINAL source material for your area and judge each task.

## Read first (all in /home/user/galaxy_math_quest)

1. `CLAUDE.md` (standing rules)
2. `TASK_Quest_Review.md` (the checklist you fill in: items 1–10)
3. `design/GMQ_World_Handoff_2026-11-16_v8.md` §5, §6, §8
4. `design/GMQ_World_Map_v1_2026-11-16.md` §1, §3, §6
5. `design/GMQ_Place_Template_v1_2026-11-16.md` §3.3 (the four checkpoint kinds)

## Where the sources are

There is NO local `drive/` folder. Read Marc's Google Drive directly with the Drive connector, READ-ONLY.

- Load the tools with ToolSearch: `select:mcp__Google_Drive__search_files,mcp__Google_Drive__read_file_content,mcp__Google_Drive__get_file_metadata`
- Root folder "Galaxy Math Quest": id `1DV4iuNnVx-u_9t4Ry1yduMzHRL0nQwj2`
- List a folder with query `parentId = '<folder id>'`. Set `excludeContentSnippets: true`. Results come about 5 per page, so keep paging with `nextPageToken` until it is empty.
- Read a file with `read_file_content` and its file id. It reads Docs, Sheets, PDFs, PNG and JPG. Look at images and PDFs: maps and printed sheets carry numbers.
- A Google Doc link `https://docs.google.com/document/d/<ID>/edit` has file id `<ID>`.
- Doc ids for many sources are listed in handoff §12 and world map §8.

The student site is public: https://sites.google.com/view/g3c-2023-space-math-quest
- `curl -sSL <url>` works. The page text is inside the HTML. Save pages under `/tmp/claude-0/-home-user-galaxy-math-quest/022e2c72-4cca-52ab-b5db-f36a499826c1/scratchpad/site/<your area>/` and strip tags with a small python script kept in a DIFFERENT folder (`.../scratchpad/scripts/<your area>/`). Run python with `-I`. WebFetch is another option.
- Quote numbers from the site exactly as written. Keep its typos. Some site numbers are wrong.
- Find sub-page links inside the HTML (`href="/view/g3c-2023-space-math-quest/..."`).

## Hard rules

- **Read-only.** Never create, edit, share, copy or trash anything in Drive or Canva. Use only search and read tools.
- **Do not open** these: "Users Info", "Galaxy Math Quest - Users", anything in "Math Assessment Test", "API information", "Galaxy Math Quest AP API". If you see them, list the name only.
- **No student names, passwords or keys** in anything you write.
- **Recompute every number in code.** Many docs were drafted by ChatGPT and their answer keys contain errors. Do not trust a key. Run python and show what you ran.
- **Do not invent.** If you could not find or read something, say so. Never fill a gap with a guess presented as fact.
- Mark every claim **[Source]**, **[Proposal]** or **[Conflict]**.
- List every version of a task you find. Do not silently pick one.
- Do not redesign tasks yet. This stage is review and verdict only.
- Write only inside `/home/user/galaxy_math_quest/reviews/` and `/home/user/galaxy_math_quest/checks/`, and only the files named in your assignment. Do not run git.

## Marc has not filled in INFO_FROM_MARC.md. Use these stated assumptions and label them as assumptions

- **Time budget [Assumption]:** one task fits one class period of about 40 minutes. Also record your raw minute estimate so Marc can apply his own budget.
- **Typing limit [Assumption]:** at most 3 numbers, or one short sentence, per answer on an iPad.
- **Reading [Source: Novus v3.4]:** Reading Level 3–4 means at most 10 words per sentence and common words.
- **Curriculum [Assumption]:** no KIS scope and sequence was supplied. Use the Drive doc "tasks / strand order" (id `177Lw8fdJzNte6bTNe3kOcBFBFAyG_7yob2rJ9D94-s8`) and "Pre-Requisite - Order of Strands" (id `11o56plHYtzte3_pdJ_pL-MgH8sc9MCuQmyrKPT1aSRY`). Flag anything that is clearly above typical Grade 3 (for example: area formulas beyond counting squares or length × width, decimals, percentages, fractions of amounts beyond simple unit fractions, negative numbers, multi-digit × multi-digit, long division).
- **Verdicts are provisional** until Marc gives his answers. Say which verdicts would change if the time budget or typing limit were different.

## What to write

For each area file `reviews/<area>.md`:

1. Title, date, and a one-paragraph plain-English summary.
2. **Verdict table at the top:** task | what the student does (one line) | est. minutes | most typed in one answer | verdict (keep / fix / shorten / split / redo) | one-line reason.
3. **One section per task** working through checklist items 1–10 in `TASK_Quest_Review.md`. Be concrete: quote the longest instruction, count the steps, list the numbers.
4. For item 8 (per-student numbers): propose a number rule, write `checks/<task id>_check.py`, run it on 10,000 seeds, and record the result. Use only the python standard library. If the task cannot sensibly vary (hands-on art, throwing at targets), say so and skip the script.
5. **Errors found**, numbered, with the recomputation.
6. **Could not read or find**, listed.
7. **What a child could explore or play with here** (short): things in the source story that could become explorable places, objects or characters in a text world. Marc's own material only; anything new is [Proposal].

Style: plain English, short sentences, lists where they help. No filler.

## Your final message back

Keep it under 500 words: the verdict table, the 3–5 most important findings (especially errors and anything that surprised you or contradicts the design docs), and what you could not read. The files hold the detail.
