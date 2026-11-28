# Galaxy Math Quest: the test folder (server version 0.3.3)

**For:** Marc. **Time:** about 20 minutes. **Who plays:** made-up cadets only, never a child.
Everything here is **[Proposal]**. Nothing on your site changes until you upload it yourself.

---

## What this is

- **A new folder on your site,** `/var/www/html/gmq-test`, in its own place under the web root. Nothing else on your site changes; it never touches your Math Skills engine or its settings. The class link on GitHub Pages does not change.
- **Inside it:**
  - the game, as `play.html`
  - the Commander's Desk, as `teacher.html`
  - the server, in `api/`
- **What you can try:**
  - a cadet's game kept on the server, and opened on any device
  - real-life task codes checked by the server
  - ship names that wait for you
  - the server check
  - clearing a game, and bringing back an older copy
- **What you can try on a test page only:** the class card board, and battles against a classmate's deck (step 9). The game has no buttons for them yet. The main thread adds those later.

## What you need

- A way to reach your server's files, such as the SSH you use for the Math Skills engine
- Two devices: an iPad, and a phone or a laptop

---

## Step 1. Get the zip onto your server

The repository is public, so your server can download the zip itself. [Proposal, 28 November; your note: a game in its own folder under the web root, and never touch `educational-engines/api/config.php`.]

The main thread gives you the exact commands, one at a time, for PowerShell and ssh. They name **one fixed commit**, so the zip cannot change under you, and its **sha256**, a fingerprint you compare. In outline, on your server:

```
cd /var/www/html
sudo curl -L -o gmq-test.zip https://raw.githubusercontent.com/christopherfi-dev/galaxy_math_quest/COMMIT/engines/gmq-world/GMQ_Server_Test_Folder.zip
sha256sum gmq-test.zip
```

- `COMMIT` is the commit the main thread gives you.
- The fingerprint that `sha256sum` prints must be exactly the one the main thread gives you. If it is not, stop, and delete the zip.

## Step 2. Put the folder on your site

```
cd /var/www/html
sudo unzip gmq-test.zip
sudo rm gmq-test.zip
```

You now have a new folder, `/var/www/html/gmq-test`. It sits beside your other folders and touches none of them. If a folder with that name is already there, stop, and tell the main thread.

## Step 3. A folder for saved games, outside the web folder

```
sudo mkdir -p /var/www/gmq-test-data
sudo chown www-data:www-data /var/www/gmq-test-data
sudo chmod 770 /var/www/gmq-test-data
```

- **Why outside:** anything inside `/var/www/html` can be opened from the web. Saved games hold cadets' names.
- **`www-data`** is the web server's user on Ubuntu and Debian. On AlmaLinux, Rocky or CentOS it is usually `apache`. If you are not sure, try `www-data`. Step 5 tells you if it is wrong.

## Step 4. The one settings file

```
cd /var/www/html/gmq-test/api
cp config.sample.php config.php
nano config.php
```

Change two lines:

1. `// 'data_dir' => '/var/www/gmq-test-data',`
   Take away the two slashes at the start.
2. `'setup_code' => '',`
   Put a word of your own between the quotes, 6 letters or more.

Leave the AI part as it is. It stays off. Save the file.

**Never paste this word, your password, or any key into a chat.** Not to Claude, and not anywhere else.

## Step 5. The server check

Open `https://` + your site + `/gmq-test/teacher.html`.

Every line should have a green tick. Under each red or orange line, the page says what to do.

| If it says | It means |
|---|---|
| The server cannot write saved games | Step 3's owner is wrong. Try `apache` instead of `www-data`. |
| Anyone can read the saved games from the web | `data_dir` is not set: the two slashes are still there (step 4). Do not let anyone play yet. |
| The server did not answer | PHP is not running in that folder, or it is older than 7.4. |
| This page is not on https | Use the `https://` address of your site. |

## Step 6. Choose your teacher password

- In the box "First time", type your setup word from step 4.
- Then choose a new teacher password, and type it twice. You use this password on the Desk from now on.
- You may now delete the `setup_code` line from `config.php`. It does nothing more.

## Step 7. Make a test class

- Press "Make a class", and call it "Test".
- Write down its 5-letter class code.
- Leave the settings as they are.

## Step 8. Play as two pretend cadets (10 minutes)

On an iPad, open `.../gmq-test/play.html`. Log in with the class code, a made-up name such as **Nova**, and any 4-digit number.

Try each of these. Note what works.

1. **The game follows the cadet.** Play for a minute. Then, on a phone, log in as Nova with the same number. Your game is there.
2. **An older iPad cannot spoil the newer game.** Play a little on the phone. Go back to the iPad and do something. The iPad's bar says "not saved yet". That is right for now. The game has moved to the phone, and the iPad cannot write its older game over it. To bring the game back to the iPad, press "Log out", then log in again. (The words will be clearer once the main thread wires in the new server.)
3. **A ship name waits for you.** Type `name ship Comet`. On the Desk, press Refresh, then Approve. The name is on the hull at the game's next save.
4. **A second cadet.** On another device, log in as **Orbit**. Both cadets show on the Desk.
5. **A copy to bring back.** On the Desk, press "Clear game" for Orbit. Then press "Older copies", then "Bring this back". Log out and in as Orbit: the game is back.
6. **A lock.** Type five wrong numbers for Nova. Nova is locked for ten minutes. "New secret number" on the Desk lets Nova in again.

## Step 9 (if you like). Two pretend cadets battle each other's decks

This uses a test page, `cards-test.html`, made for trying cards between classmates before the game has its own buttons. **Made-up cadets only.**

1. On the Desk, in your Test class, set:
   - Ship names: **accept kind names at once**
   - Class card board: **on**
   - Battles: **challenge: winner takes both** (or the other challenge rule, to try it)
   - Test page for cards and battles: **on**
   - then press **Save these settings**
2. On the iPad, open `.../gmq-test/cards-test.html`. Log in as **Nova**. Type a ship name. Press **Take a starter pack**: 15 cards. Tick **Classmates may battle my deck**.
3. On the phone, do the same as **Orbit**.
4. On the iPad, under "Battle a classmate's deck", press **Challenge** beside Orbit's ship. The battle opens over the whole screen, on both cards at stake. Press **Back out** once (nothing moves). Then press **Challenge** again, and **I agree: start the battle**.
5. Play the battle. The computer flies Orbit's own deck. At the end, the card moves.
6. On the phone, reload the page: Orbit is told what happened.
7. On the Desk, press Refresh: the Battles list shows it. Press **Check who won**: the Desk plays the battle again from its record and says whether the result holds (a green tick, or a red line saying why not).
8. Also try: leave a battle in the middle, close the page, open it again. It offers to go back to the same battle.

**Known for now:** the battle's words always say "The winner gets both cards", even when the Desk is set to "away cadet keeps card". The server follows the Desk. The battle thread is asked to change the words.

When you have tried it, set the test page to **off**.

## Step 10. Tell the server thread

Paste back only:
- which lines of step 5 were green, and the words of any red one
- which of the six tries in step 8 worked, and, if you tried it, step 9

No password, no setup word and no class code are needed.

---

## To take it away

```
sudo rm -r /var/www/html/gmq-test /var/www/gmq-test-data
```

Nothing else on your site was changed.

## What the test folder does not do

- **No AI.** It stays off.
- **No cards between cadets in the game yet.** The Desk has the switches, and the test page (step 9) lets pretend cadets try them. The game has no buttons yet.
- **It is not the class's game.** The class keeps playing on the GitHub Pages link. Games saved here stay here.
- **The game in `play.html` does not update by itself.** It is the class link's copy from the day the zip was built. The folder's front page (`index.html`) says which version it is.
