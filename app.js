// ── DEMO TAB SWITCHER ──
function switchDemo(name, el) {
  document.querySelectorAll('.demo-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.demo-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('demo-' + name).classList.add('active');
  el.classList.add('active');
}

// ══════════════════════════════════════
// GUESSER DEMO
// ══════════════════════════════════════
const GUESSER_ANSWER = 'zinedine zidane';
const GUESSER_DISPLAY = 'Zinedine Zidane';
const GUESSER_CLUES = [
  { text: 'Won the World Cup with France in 1998', pts: '+5 pts' },
  { text: 'Played for Juventus and Real Madrid', pts: '+4 pts' },
  { text: 'Won the Champions League three times as a manager', pts: '+3 pts' },
  { text: 'Named player of the tournament at 1998 World Cup', pts: '+2 pts' },
  { text: 'Born in Marseille in 1972 — famous for a headbutt in a World Cup final', pts: '+1 pt' },
];

const PLAYER_POOL = [
  'Zinedine Zidane','Thierry Henry','Ronaldo','Ronaldinho','Andrés Iniesta',
  'Xavi Hernández','Luka Modrić','Karim Benzema','Kylian Mbappé','Lionel Messi',
  'Cristiano Ronaldo','Roberto Carlos','Raúl','Didier Drogba','Patrick Vieira',
  'Marcel Desailly','David Beckham','Cafu','Rivaldo','Luis Figo',
];

let gGuessCount = 0;
let gRevealedClues = 1;
let gWrongGuesses = [];
let gSolved = false;

function renderClues() {
  GUESSER_CLUES.forEach((c, i) => {
    const el = document.getElementById('gc' + (i + 1));
    if (!el) return;
    if (i < gRevealedClues) {
      el.classList.remove('locked');
      el.querySelector('.g-text, .locked-t').className = 'g-text';
      el.querySelector('.g-text').textContent = c.text;
      const numEl = el.querySelector('.g-num, .locked-n');
      numEl.className = 'g-num';
      numEl.textContent = i + 1;
      const ptsEl = el.querySelector('.g-pts');
      ptsEl.classList.remove('dim');
      ptsEl.textContent = c.pts;
    }
  });
  const pts = ['+5 pts','+4 pts','+3 pts','+2 pts','+1 pt'];
  const potEl = document.getElementById('g-potential');
  if (potEl) potEl.textContent = gSolved ? 'Solved! 🎉' : (pts[gRevealedClues - 1] || '+1 pt');
}

function guesserInput() {
  const val = document.getElementById('g-input').value.trim().toLowerCase();
  const box  = document.getElementById('g-suggestions');
  if (val.length < 2) { box.innerHTML = ''; return; }
  const matches = PLAYER_POOL.filter(p => p.toLowerCase().includes(val)).slice(0, 5);
  if (!matches.length) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="g-suggestion-list">${
    matches.map(m => `<div class="g-suggestion-item" onclick="selectSuggestion('${m}')">${m}</div>`).join('')
  }</div>`;
}

function selectSuggestion(name) {
  document.getElementById('g-input').value = name;
  document.getElementById('g-suggestions').innerHTML = '';
}

function submitGuess() {
  if (gSolved || gGuessCount >= 5) return;
  const input = document.getElementById('g-input');
  const guess = input.value.trim().toLowerCase();
  if (!guess) return;

  document.getElementById('g-suggestions').innerHTML = '';
  gGuessCount++;

  const resultEl = document.getElementById('g-result');
  const metaEl   = document.getElementById('g-meta');

  if (guess === GUESSER_ANSWER || guess === GUESSER_DISPLAY.toLowerCase()) {
    // Correct
    gSolved = true;
    resultEl.style.display = 'block';
    resultEl.className = 'g-result correct';
    const pts = [5,4,3,2,1][gRevealedClues - 1];
    resultEl.innerHTML = `✓ Correct! That's ${GUESSER_DISPLAY} — you scored ${pts} point${pts > 1 ? 's' : ''}!<br><span style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:6px;display:block">Sign up to play the real game daily</span>`;
    document.getElementById('g-input-area').style.display = 'none';
    // Reveal all clues
    gRevealedClues = 5;
    renderClues();
  } else {
    // Wrong
    gWrongGuesses.push(input.value.trim());
    const wrongList = document.getElementById('g-wrong-list');
    wrongList.innerHTML = gWrongGuesses.map(w => `<span class="g-wrong-tag">${w}</span>`).join('');

    if (gGuessCount >= 5) {
      resultEl.style.display = 'block';
      resultEl.className = 'g-result incorrect';
      resultEl.innerHTML = `✗ Out of guesses — it was ${GUESSER_DISPLAY}.<br><span style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:6px;display:block">Join the waitlist to play daily</span>`;
      document.getElementById('g-input-area').style.display = 'none';
      gRevealedClues = 5;
      renderClues();
    } else {
      // Unlock next clue
      if (gRevealedClues < 5) {
        gRevealedClues++;
        renderClues();
        const newClue = document.getElementById('gc' + gRevealedClues);
        if (newClue) newClue.classList.add('unlocking');
        setTimeout(() => newClue && newClue.classList.remove('unlocking'), 500);
      }
      const left = 5 - gGuessCount;
      metaEl.textContent = `Guess ${gGuessCount + 1} of 5 · ${left} guess${left !== 1 ? 'es' : ''} remaining`;
    }
  }
  input.value = '';
}

// Init guesser
renderClues();

// ══════════════════════════════════════
// CONNECTIONS DEMO
// ══════════════════════════════════════
const C_GROUPS = [
  {
    label: 'France 1998 World Cup winners',
    color: 'a',
    emoji: '🟩',
    players: ['Zidane', 'Vieira', 'Henry', 'Desailly'],
  },
  {
    label: 'Premier League top scorers (200+ goals)',
    color: 'b',
    emoji: '🟨',
    players: ['Shearer', 'Rooney', 'Cole', 'Lampard'],
  },
  {
    label: 'Ballon d\'Or winners this century',
    color: 'c',
    emoji: '🟥',
    players: ['Ronaldinho', 'Cannavaro', 'Kaká', 'Messi'],
  },
];

const ALL_PLAYERS = C_GROUPS.flatMap(g => g.players).sort(() => Math.random() - 0.5);
let cSelected = [];
let cSolved = [];
let cLives = 3;
let cSolvedGroups = [];

function initConnections() {
  const grid = document.getElementById('c-grid');
  grid.innerHTML = ALL_PLAYERS.map(p =>
    `<div class="c-tile" data-player="${p}" onclick="toggleConn(this)">${p}</div>`
  ).join('');
}

function toggleConn(el) {
  if (el.classList.contains('solved-a') || el.classList.contains('solved-b') || el.classList.contains('solved-c')) return;
  const name = el.dataset.player;
  if (el.classList.contains('selected')) {
    el.classList.remove('selected');
    cSelected = cSelected.filter(p => p !== name);
  } else {
    if (cSelected.length >= 4) return;
    el.classList.add('selected');
    cSelected.push(name);
  }
  document.getElementById('c-selected-count').textContent = `${cSelected.length} selected`;
}

function deselectAll() {
  document.querySelectorAll('.c-tile.selected').forEach(t => t.classList.remove('selected'));
  cSelected = [];
  document.getElementById('c-selected-count').textContent = '0 selected';
}

function submitConnections() {
  if (cSelected.length !== 4) {
    showCMessage('Select exactly 4 players', '#BA7517');
    return;
  }
  const msgEl = document.getElementById('c-message');
  // Check against groups
  for (const g of C_GROUPS) {
    if (cSolvedGroups.includes(g.label)) continue;
    const match = cSelected.every(p => g.players.includes(p)) && cSelected.length === 4;
    if (match) {
      // Solved this group
      cSolvedGroups.push(g.label);
      cSelected.forEach(p => {
        const tile = document.querySelector(`.c-tile[data-player="${p}"]`);
        if (tile) { tile.classList.remove('selected'); tile.classList.add('solved-' + g.color); }
      });
      cSelected = [];
      document.getElementById('c-selected-count').textContent = '0 selected';
      // Add solved banner
      const banner = document.createElement('div');
      banner.className = `c-solved-banner ${g.color}`;
      banner.innerHTML = `<span>${g.emoji} ${g.label}</span><span style="font-family:var(--font-mono);font-size:10px">SOLVED</span>`;
      document.getElementById('c-solved-groups').appendChild(banner);
      if (cSolvedGroups.length === C_GROUPS.length) {
        showCMessage('🎉 Brilliant — you found all three groups!', '#c8f53a');
      } else {
        showCMessage(`✓ Correct! ${C_GROUPS.length - cSolvedGroups.length} group${C_GROUPS.length - cSolvedGroups.length !== 1 ? 's' : ''} remaining`, '#c8f53a');
      }
      return;
    }
  }

  // Check if one away
  for (const g of C_GROUPS) {
    if (cSolvedGroups.includes(g.label)) continue;
    const overlap = cSelected.filter(p => g.players.includes(p)).length;
    if (overlap === 3) {
      showCMessage('One away! Keep trying…', '#f0b429');
      document.querySelectorAll('.c-tile.selected').forEach(t => { t.classList.add('wrong-flash'); setTimeout(() => t.classList.remove('wrong-flash'), 500); });
      cLives--;
      updateLives();
      if (cLives <= 0) gameOver();
      return;
    }
  }

  // Wrong
  showCMessage('Not quite — try again', '#e8412a');
  document.querySelectorAll('.c-tile.selected').forEach(t => { t.classList.add('wrong-flash'); setTimeout(() => t.classList.remove('wrong-flash'), 500); });
  deselectAll();
  cLives--;
  updateLives();
  if (cLives <= 0) gameOver();
}

function showCMessage(msg, color) {
  const el = document.getElementById('c-message');
  el.textContent = msg;
  el.style.color = color;
  setTimeout(() => { el.textContent = ''; }, 3000);
}

function updateLives() {
  const lives = document.querySelectorAll('.c-life');
  lives.forEach((l, i) => { if (i >= cLives) l.classList.add('lost'); });
}

function gameOver() {
  showCMessage('Out of lives! Join the waitlist to try again tomorrow 🎯', '#e8412a');
  document.querySelectorAll('.c-tile:not([class*="solved"])').forEach(t => { t.style.opacity = '0.3'; t.style.pointerEvents = 'none'; });
}

initConnections();

// ══════════════════════════════════════
// HIGHER / LOWER DEMO
// ══════════════════════════════════════
const HL_DATA = [
  { name: 'Thierry Henry',   val: 175, unit: 'PL GOALS' },
  { name: 'Sergio Agüero',   val: 184, unit: 'PL GOALS' },
  { name: 'Wayne Rooney',    val: 208, unit: 'PL GOALS' },
  { name: 'Andrew Cole',     val: 187, unit: 'PL GOALS' },
  { name: 'Frank Lampard',   val: 177, unit: 'PL GOALS' },
  { name: 'Alan Shearer',    val: 260, unit: 'PL GOALS' },
  { name: 'Michael Owen',    val: 150, unit: 'PL GOALS' },
  { name: 'Robbie Fowler',   val: 163, unit: 'PL GOALS' },
];

let hlIdx = 0;
let hlChain = 0;
let hlBest  = 0;
let hlLocked = false;

function renderHL() {
  const left  = HL_DATA[hlIdx];
  const right = HL_DATA[hlIdx + 1];
  if (!right) return;

  document.getElementById('hl-left-name').textContent  = left.name;
  document.getElementById('hl-left-val').textContent   = left.val;
  document.getElementById('hl-left-unit').textContent  = left.unit;
  document.getElementById('hl-right-name').textContent = right.name;
  document.getElementById('hl-right-val').textContent  = '???';
  document.getElementById('hl-right-val').className    = 'hl-val unknown-val';
  document.getElementById('hl-right').className        = 'hl-card unknown';
  document.getElementById('hl-chain-val').textContent  = hlChain;
  document.getElementById('hl-best-val').textContent   = hlBest;
  document.getElementById('hl-chain-display').textContent = `${hlChain} correct`;
  document.getElementById('hl-higher').disabled = false;
  document.getElementById('hl-lower').disabled  = false;
  hlLocked = false;
}

function updateDots(correct) {
  const dots = document.querySelectorAll('.hl-dot');
  const idx  = Math.min(hlChain - 1, dots.length - 1);
  if (idx >= 0 && idx < dots.length) {
    dots[idx].classList.add(correct ? 'correct' : 'wrong');
  }
}

function pickHL(choice) {
  if (hlLocked) return;
  hlLocked = true;

  const left  = HL_DATA[hlIdx];
  const right = HL_DATA[hlIdx + 1];
  if (!right) return;

  const actuallyHigher = right.val > left.val;
  const correct = (choice === 'higher' && actuallyHigher) || (choice === 'lower' && !actuallyHigher);

  // Reveal answer
  document.getElementById('hl-right-val').textContent = right.val;
  document.getElementById('hl-right-val').className   = 'hl-val';
  document.getElementById('hl-higher').disabled = true;
  document.getElementById('hl-lower').disabled  = true;

  if (correct) {
    hlChain++;
    if (hlChain > hlBest) hlBest = hlChain;
    document.getElementById('hl-right').classList.add('correct-flash');
    document.getElementById('hl-chain-val').textContent = hlChain;
    document.getElementById('hl-best-val').textContent  = hlBest;
    document.getElementById('hl-chain-display').textContent = `${hlChain} correct`;
    updateDots(true);

    if (hlIdx + 2 >= HL_DATA.length) {
      // End of demo data
      setTimeout(() => {
        document.getElementById('hl-chain-display').textContent = `${hlChain} correct — impressive!`;
      }, 800);
      return;
    }
    // Advance after delay
    setTimeout(() => {
      hlIdx++;
      renderHL();
    }, 1200);
  } else {
    document.getElementById('hl-right').classList.add('wrong-flash-hl');
    updateDots(false);
    // Reset chain after showing answer
    setTimeout(() => {
      hlChain = 0;
      hlIdx   = 0;
      // Clear dots
      document.querySelectorAll('.hl-dot').forEach(d => { d.classList.remove('correct','wrong'); });
      renderHL();
    }, 1800);
  }
}

renderHL();

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
