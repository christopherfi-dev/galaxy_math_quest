# Math Skills Engine — all files (2026-11-16)

Folder paths match the server, under `/var/www/html/educational-engines/`.

## current-v1.1/ — the newest version (from the project sources)

| File | Version | Bytes | SHA-256 |
|---|---|---|---|
| math-skills.html | v1.1 | 15,720 | 52b11eb2e0a8c49e4bca49ae0d92a3561e01413075b7be8aefb539110106bf75 |
| math-login.html | v1.1 (the project calls it `math-skills-login_html v1_1`) | 11,610 | ccf7af125e0f4aa10bc2a88eb8558cabcb5485e2eff83827da3791137dec76fe |
| api/math-skills-api.php | v1.1 | 38,894 | d3bb526e0043662519bf028c534108fd3b84bf54716e014f1a8308c506099dbb |
| api/constraints/math-skills.txt | v4.1 | 21,444 | a91dcf46c888f7b732d4bd30db0069b6e66a3f37a6c35562a84f624308c7cef7 |
| api/constraints/solon.txt | Solon v2.2 + activation protocol | 6,992 | 3b208bf0c7bf3249ef8a9b1ad83bb0c986246b107ef1ef961527e4f690e74d0d |
| api/constraints/skills/ | 48 skill files (8 bands × 6 domains) | 145,656 in total | per file in the project's skill-bank document |

solon.txt and the skill files have only one version, so they are the server copies.

**What v1.1 adds over v1.0**, from the API's header:
- session login checks
- a limit of 5 password attempts
- the server recalculates `[CHECK:…]` sums and overrides a wrong AI answer
- the last ANSWER tag wins, and none is taken from a cut-off reply
- a constraint reminder every 5 turns
- a clear system note when a skill file is missing

The page itself changes in only one way: it hides `[CHECK:…]` tags from students.

## bluehost-snapshot-2026-11-11/ — what was on constraintlayer.ai on Nov 11

| File | Version | Bytes | SHA-256 |
|---|---|---|---|
| math-skills.html | v1.0 | 15,537 | b5cb4ebc495718cee59ffdadc24b8b5f06a3f6dd794c7388e7c8812c68eeef81 |
| math-login.html | no version label | 11,520 | 31f8587af03d780fd5af26f6cc10cbf547f1702643fcea571bf77f5bfd6af94c |
| api/math-skills-api.php | v1.0 | 34,436 | 258ea2b7317c4c032de2d110c7636849b707f0708fc3afb0257c81237f5d5843 |
| api/constraints/math-skills.txt | v4.0 | 21,137 | d2eca621d1b141c570fe5b6fadafc03452624a1025faf8efc8ff0e6a5f09dca9 |
| legacy-unused/math-skills-data.txt | v3.9 | 15,344 | 158f4852be26f3487f978ffe942b0d894bebf309d56d16d08a9ab0636a919ec8 |

`math-skills-data.txt` sits on the server, but nothing loads it. api.php skips it for math-skills, and math-skills-api.php never reads it. It is kept here for reference only.

## Which version is live on the tools site: unknown

This command is read-only. Compare each hash with the two tables above.

```
ssh root@129.121.98.193 "cd /var/www/html/educational-engines && sha256sum math-skills.html math-login.html api/math-skills-api.php api/constraints/math-skills.txt api/constraints/solon.txt"
```

## Not included

- **api/config.php** holds the live API keys. The math API needs it, but it never leaves the server.
- **api/math-students/** holds 33 student record files. That is student data.
- **api/sessions/, api/logs/**: server data.
- **api.php** has a math-skills code path, but the math pages don't use it. It also points to skill files named `math-skills-band-N.txt`, which don't exist.
- **Other math pages** are separate from this engine: Angle Golf (`golf.html`, `golf-home.html`) and `coordinate-art.html`.

## Notes for a deploy

- On the server, the login page is named `math-login.html`. It sends students to `math-skills.html`.
- v1.1's API sends `Access-Control-Allow-Origin: https://constraintlayer.ai`. That header only matters for requests from another site. The page and the API are on the same site, so it doesn't block the tools site.
