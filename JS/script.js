// Change these to personalise
const MOTHER_NAME = 'Mom';
const WISHES = [
  'May Allah bless you with health, peace, and a heart that is always full.',
  'You gave us everything. This year, may life give it all back to you.',
  'May every dream you set aside for us finally come true.',
  'May your days be as gentle and warm as the love you give us.',
  'We wish you more rest, more laughter, and more reasons to smile.'
];

// Headline: letters pop in once on load
const title = document.getElementById('title');
const text = `Happy birthday, ${MOTHER_NAME}.`;
title.setAttribute('aria-label', text);
title.textContent = '';
let i = 0;
text.split(' ').forEach((word, wi, arr) => {
  const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
  [...word].forEach(c => {
    const s = document.createElement('span'); s.className = 'ch'; s.textContent = c;
    s.style.animationDelay = `${i++ * 45}ms`; w.appendChild(s);
  });
  title.appendChild(w);
  if (wi < arr.length - 1) title.appendChild(document.createTextNode(' '));
});

// Music
const song = document.getElementById('song'), disc = document.getElementById('disc');
const playBtn = document.getElementById('playBtn'), bar = document.getElementById('progress');

// ===== PLAYLIST (new) =====
const PLAYLIST = [
  { title: 'Mesmerizing Waves', file: 'AUDIO/Mesmerizing Waves.mp3' },
  { title: 'Lovers’ Oath', file: "AUDIO/Lovers'_Oath.mp3" }
];
let current = 0;
const trackName = document.getElementById('trackName');

function loadTrack(i) {
  current = i % PLAYLIST.length;            // wraps back to the first song
  song.src = PLAYLIST[current].file;
  trackName.textContent = PLAYLIST[current].title;
  bar.style.width = '0%';
}

loadTrack(0);

song.addEventListener('ended', () => {
  loadTrack(current + 1);
  song.play();
});
// ===== END PLAYLIST =====



playBtn.addEventListener('click', () => {
  if (song.paused) song.play().catch(() => alert('Check that your mp3 files are in the same folder as index.html'));
  else song.pause();
});
song.addEventListener('play', () => { disc.classList.add('playing'); playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>'; playBtn.setAttribute('aria-label', 'Pause song'); });
song.addEventListener('pause', () => { disc.classList.remove('playing'); playBtn.innerHTML = '<i class="fa-solid fa-play"></i>'; playBtn.setAttribute('aria-label', 'Play song'); });
song.addEventListener('timeupdate', () => { if (song.duration) bar.style.width = (song.currentTime / song.duration * 100) + '%'; });

// Autoplay: try on load. Browsers often block it, so the gate asks for one tap.
const gate = document.getElementById('gate');
function openPage() {
  gate.classList.add('open');
  document.body.classList.add('go');
  setTimeout(() => { if (typeof burst === 'function') burst(); }, 500);
}
song.play().then(openPage).catch(() => { });
document.getElementById('openBtn').addEventListener('click', () => {
  song.play().catch(() => { });
  openPage();
});

// Floating hearts and flowers
const floaters = document.getElementById('floaters');
const icons = ['fa-heart', 'fa-heart', 'fa-star', 'fa-spa', 'fa-leaf'], colors = ['#ff4f8b', '#ffb627', '#5eead4', '#fff4f8'];
setInterval(() => {
  if (document.hidden) return;
  const el = document.createElement('i');
  el.className = `fa-solid ${icons[Math.random() * icons.length | 0]}`;
  el.style.left = Math.random() * 100 + 'vw';
  el.style.fontSize = (0.8 + Math.random() * 1.6) + 'rem';
  el.style.color = colors[Math.random() * colors.length | 0];
  el.style.animationDuration = (8 + Math.random() * 8) + 's';
  floaters.appendChild(el);
  setTimeout(() => el.remove(), 17000);
}, innerWidth < 800 ? 1100 : 700);

// Jump to the poem, then reveal its lines one by one
function goToPoem() {
  document.getElementById('poem').scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.poem .line').forEach((line, i) => {
    setTimeout(() => line.classList.add('show'), 600 + i * 700);
  });
}
document.getElementById('poemBtn').addEventListener('click', goToPoem);

// Confetti
const cv = document.getElementById('confetti'), ctx = cv.getContext('2d');
let pieces = [], running = false;
const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
addEventListener('resize', fit); fit();
function burst() {
  const cx = innerWidth / 2, cy = innerHeight * 0.6;
  for (let n = 0; n < 160; n++) {
    const a = Math.random() * Math.PI * 2, v = 4 + Math.random() * 9;
    pieces.push({
      x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 6, r: Math.random() * 6, w: 6 + Math.random() * 6, h: 3 + Math.random() * 5,
      c: colors[Math.random() * colors.length | 0], life: 140 + Math.random() * 60
    });
  }
  if (!running) { running = true; requestAnimationFrame(tick); }
}
function tick() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  pieces = pieces.filter(p => p.life-- > 0);
  pieces.forEach(p => {
    p.vy += 0.25; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += 0.2;
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c;
    ctx.globalAlpha = Math.min(1, p.life / 40); ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
  });
  if (pieces.length) requestAnimationFrame(tick); else running = false;
}

// Wish
const flame = document.getElementById('flame'), wishBtn = document.getElementById('wishBtn'), msg = document.getElementById('wishMsg');
let lit = true, k = 0;
wishBtn.addEventListener('click', () => {
  if (lit) {
    flame.classList.add('out'); lit = false;
    wishBtn.innerHTML = '<i class="fa-solid fa-fire"></i> Light it again';
    burst(); setTimeout(burst, 350);
    msg.textContent = WISHES[k++ % WISHES.length];
  } else {
    flame.classList.remove('out'); lit = true;
    wishBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Make a wish';
    msg.textContent = '';
  }
});

// Tap the cake to blow the candle too
document.getElementById('cake').addEventListener('click', () => wishBtn.click());
