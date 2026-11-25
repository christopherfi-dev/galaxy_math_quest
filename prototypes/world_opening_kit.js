/*WORLD-OPENING-BEGIN  The start of the big world: landing on the meadow, a Mender to meet you, and a way to skip it.   [Proposal, 24 November 2026]
  [Source: Marc, 24 November: "Can you add a skip intro? I don't have to do the introduction every time I land on the planet." And: "we should show the ship on the meadow
   and then a character standing next to them who they're talking to you as explain how to do things. Welcoming committee or whatever. It's a bit jarring to go from
   space to learning how the planet works without actually seeing that you're on the planet."]
  - The story's last page ("You land in a green meadow…") shows the meadow: your ship, the cadet, and a Mender standing beside them, with his toolbox.
  - The Mender's welcome ("Welcome to Planet Algora…", "Before you go anywhere, let me show you how we work.") is said there, on the meadow, beside the ship.
    Then the practice machine, with "We use machines like this one…", and the lesson as before. No new words: the game's own lines, said where they belong.
  - While he talks on the meadow he grows a little, so his face and his hop can be seen (as for any Mender talking on the map).
  - "Skip the start" on the reading card: the story, the welcome and the first lesson, all at once. It shows only once this iPad has finished the start
    (a child's first time keeps the story and the worked example), or when the page's address ends in #skip (for the teacher).
    A skip is written in the mission report, and the Mender's last line of the lesson is said, so the child knows where to go: Elder Thimble, in the village. */
const OPENING = (() => {
  const SEEN = 'gmq-bigworld-looksample-seenstart';
  let greeting = false;
  const seen = () => { try { return localStorage.getItem(SEEN) === '1'; } catch (e) { return false; } };
  const mark = () => { try { localStorage.setItem(SEEN, '1'); } catch (e) {} };
  const inStart = () => !!S && (S.intro < 9 || greeting || (!flag('lessonDone') && !flag('metElder')));
  const canSkip = () => inStart() && (seen() || location.hash === '#skip');
  function skip() {
    if (!canSkip()) return;      /* only during the start: never in the middle of the game */
    clearTimeout(READ.tm); READ.q = []; READ.i = 0; READ.then = null; READ.who = ''; $('read').hidden = true; $('veil').hidden = true;
    greeting = false; S.intro = 9; PIC = null; TASK = null; S.open = null; BOX.on = ''; BOX.v = {};
    const L = S.lesson || (S.lesson = { step: 0, notes: [], last: null }); L.step = 6; L.greeted = 1; setFlag('lessonDone');
    report('Skipped the start: the story, the welcome and the first lesson (seen before on this iPad)', '', '');
    mark(); setPlace(); drawWords(); drawTask(); save();
    tell(['Elder Thimble needs help. Four machines in our meadow have burnt plates. Go and see him in the village, up the path.'], null, 'A Mender'); }
  function greet() {      /* after the story: on the meadow, beside the ship, the welcome; then the practice machine */
    const L = S.lesson || (S.lesson = { step: 0, notes: [], last: null });
    if (L.step > 0 || L.greeted) return startLesson();
    greeting = true; PIC = null; TASK = null; P.dir = 'right'; setPlace(); drawWords(); drawTask();
    tell(['Welcome to ' + PLANET + ', visitor from the sky! I am a Mender. We keep the machines here.', 'Before you go anywhere, let me show you how we work.'],
      () => { greeting = false; L.greeted = 1; save(); startLesson(); }, 'A Mender'); }
  let grow = 1;
  function drawGreeter(X, Y, ts) {      /* the Mender beside the ship, from the story's last page until the practice machine */
    if (!(greeting || (S.intro < 9 && READ.i >= 5 && reading()))) return;
    const talk = reading() && READ.who === 'A Mender'; grow += ((talk ? 1.35 : 1) - grow) * .12;
    const gx = P.px + 1.3, gy = P.py; CAST.mender('lesson', '#c9793a', X(gx) + ts / 2, Y(gy) + ts * .84, ts * .82 * grow, 'A Mender'); }
  const css = document.createElement('style'); css.textContent = '#read #readskip { float: right; width: auto; flex: none; font-size: .78rem; padding: 4px 10px; min-height: 30px; margin: -4px -4px 4px 8px; }'; document.head.appendChild(css);
  const b = document.getElementById('readskip');
  if (b) { b.onclick = e => { e.stopPropagation(); skip(); };      /* small, in the card's corner: set on the button itself, so the page's own button style (full width on a phone) does not win */
    [['float', 'right'], ['width', 'auto'], ['min-width', '0'], ['flex', 'none'], ['font-size', '.78rem'], ['padding', '4px 10px'], ['min-height', '30px'], ['margin', '-4px -4px 4px 8px'], ['align-self', 'flex-end'], ['justify-self', 'end']].forEach(([k, v]) => b.style.setProperty(k, v, 'important')); }
  /* shown or not, on each card: set on the button itself, so no style of the page can show it when it should be hidden
     [fault found 25 November: the button's own style showed it on every card, even on a first time, and a tap later in the game reset the start] */
  function showSkip() { const on = canSkip(); if (b) { b.hidden = !on; b.style.setProperty('display', on ? 'inline-block' : 'none', 'important'); } }
  if (b) { b.hidden = true; b.style.setProperty('display', 'none', 'important'); }      /* hidden until a card asks (the game's save may not be read yet) */
  return { canSkip, showSkip, skip, greet, drawGreeter, mark, get greeting() { return greeting; } };
})();
/*WORLD-OPENING-END*/
