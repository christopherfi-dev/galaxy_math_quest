"""The GMQ world server must run on PHP 7.4 or newer (Marc's host has not told us its version).
This container has PHP 8.3 only, so it cannot run 7.4. Instead:
  1. php -l on every server file (catches any syntax error)
  2. a search for things PHP 7.4 does not have, which php -l on 8.3 would not catch
It is a search, not a run on 7.4: a PHP 7.4 machine is the real test. [Proposal]
Run: python3 checks/server_php_check.py"""
import glob, os, re, subprocess, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'engines', 'gmq-world', 'server')
NEW_IN_8 = [
    (r'\bstr_contains\s*\(', 'str_contains (PHP 8)'), (r'\bstr_starts_with\s*\(', 'str_starts_with (PHP 8)'), (r'\bstr_ends_with\s*\(', 'str_ends_with (PHP 8)'),
    (r'\bmatch\s*\(', 'match (PHP 8)'), (r'\?->', 'the nullsafe arrow ?-> (PHP 8)'), (r'#\[', 'an attribute #[...] (PHP 8)'),
    (r'\bcatch\s*\(\s*[A-Za-z_\\]+\s*\)', 'catch without a variable (PHP 8)'), (r'\barray_is_list\s*\(', 'array_is_list (PHP 8.1)'),
    (r'\bget_debug_type\s*\(', 'get_debug_type (PHP 8)'), (r'\bfdiv\s*\(', 'fdiv (PHP 8)'), (r'\benum\s+[A-Z]', 'enum (PHP 8.1)'), (r'\breadonly\b', 'readonly (PHP 8.1)'),
    (r':\s*(mixed|never|static)\b\s*[{;]', 'a mixed, never or static return type (PHP 8)'), (r'function\s*\w*\s*\([^)]*,\s*\)', 'a comma after the last parameter (PHP 8)'),
    (r'use\s*\([^)]*,\s*\)', 'a comma after the last name in use (...) (PHP 8)'), (r'\(\s*\w+\s*\|\s*\w+\s+\$', 'a union type A|B (PHP 8)'),
    (r'\b[a-z_]+\(\s*[a-z_]+:\s*[\'"$\d\[]', 'a named argument (PHP 8)'),
]
bad = []
files = sorted(glob.glob(os.path.join(ROOT, '**', '*.php'), recursive=True))
for f in files:
    r = subprocess.run(['php', '-l', f], capture_output=True, text=True)
    if r.returncode != 0: bad.append(f'{os.path.relpath(f, ROOT)}: {r.stdout.strip()} {r.stderr.strip()}')
    code = re.sub(r'(?s)/\*.*?\*/', '', open(f, encoding='utf-8').read()); code = re.sub(r'(?m)//.*$', '', code)
    for i, line in enumerate(code.split('\n'), 1):
        for pat, what in NEW_IN_8:
            if re.search(pat, line): bad.append(f'{os.path.relpath(f, ROOT)}:{i}: {what}')
print(f'{len(files)} PHP files read.')
for b in bad: print('  PROBLEM', b)
print('RESULT:', 'FAIL' if bad else 'PASS'); sys.exit(1 if bad else 0)
