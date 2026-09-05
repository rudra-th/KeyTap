
'use strict';

/* ══════════════════════════════════════════════════════
   WORD / QUOTE BANKS
══════════════════════════════════════════════════════ */
const COMMON = ['the','be','to','of','and','a','in','that','have','it','for','not','on','with','he','as','you','do','at','this','but','his','by','from','they','we','say','her','she','or','an','will','my','one','all','would','there','their','what','so','up','out','if','about','who','get','which','go','me','when','make','can','like','time','no','just','him','know','take','people','into','year','your','good','some','could','them','see','other','than','then','now','look','only','come','its','over','think','also','back','after','use','two','how','our','work','first','well','way','even','new','want','because','any','these','give','day','most','us','great','between','need','large','often','hand','high','place','hold','turn','find','here','thing','help','talk','last','long','down','been','right','move','play','small','number','off','always','very','next','food','body','color','main','open','seem','together','begin','walk','show','every','world','below','ask','point','real','without','power','house','run','along','never','stop','clear','change','start','light','still','name','read','must','both','keep','city','tree','set','feel','hard','star','form','mind','story','plant','fish','air','line','land','fire','north','left','carry','page','stand','river','cross','reach','cut','ready','until','far','sea','deep','rest','part','hear','draw','near','plan','mean','such','much','soon','each','pass','pull','grow','done','full','road','rise','try','hit','live','side','miss','true','fact','late','care','hope','size','kind','lead','drop','push','lose','meet','base','case','once','door','area','rule','team','book','room','rate','game','half','dark','cold','fast','jump','step','role','sign','type','able','free','cool','born','easy','safe','slow','note','call','east','west','head','field','song','view','mark','wear','heat','fall','warm','knew','same','four','five','six','seven','eight','nine','ten','hour','unit','wind','rock','cost','age','pay','cut','put','end','own','home','read','land','feet','care'];
const NUMS  = ['0','1','2','3','4','5','6','7','8','9','42','100','2024','16','32'];
const PUNCS = [',','.',';',':','!','?','-'];
const QUOTES = [
  "The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity.",
  "Life is what happens when you are busy making other plans.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "It does not matter how slowly you go as long as you do not stop.",
  "Everything you can imagine is real.",
  "Whatever you are be a good one.",
  "Do one thing every day that scares you.",
  "Well behaved women seldom make history.",
  "Always remember that you are absolutely unique just like everyone else.",
  "Do not go where the path may lead go instead where there is no path and leave a trail.",
  "You miss one hundred percent of the shots you do not take.",
  "Believe you can and you are halfway there.",
  "The only impossible journey is the one you never begin.",
  "In three words I can sum up everything I have learned about life it goes on.",
  "If you tell the truth you do not have to remember anything.",
  "A friend is someone who knows all about you and still loves you.",
  "To live is the rarest thing in the world most people just exist.",
  "We accept the love we think we deserve.",
  "Not all those who wander are lost."
];

const KBD_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

/* ══════════════════════════════════════════════════════
   UTILITIES
══════════════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stdDev(arr) {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  const variance = arr.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function consistency(arr) {
  if (arr.length < 2) return 100;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  if (mean === 0) return 100;
  const cv = (stdDev(arr) / mean) * 100;
  return clamp(Math.round(100 - cv), 0, 100);
}

/* ══════════════════════════════════════════════════════
   AUDIO  (Web Audio API — no external files)
══════════════════════════════════════════════════════ */
let soundOn = JSON.parse(localStorage.getItem('sound') ?? 'true');
let _actx = null;

function getACtx() {
  if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
  return _actx;
}

function playSound(type) {
  if (!soundOn) return;
  try {
    const ctx = getACtx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    const now = ctx.currentTime;
    if (type === 'key') {
      osc.type = 'sine'; osc.frequency.value = 1100;
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
      osc.start(now); osc.stop(now + 0.04);
    } else if (type === 'err') {
      osc.type = 'sawtooth'; osc.frequency.value = 160;
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'done') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'click') {
      osc.type = 'sine'; osc.frequency.value = 700;
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
      osc.start(now); osc.stop(now + 0.03);
    } else if (type === 'go') {
      osc.type = 'sine'; osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    }
  } catch(_) {}
}

/* ══════════════════════════════════════════════════════
   STORAGE
══════════════════════════════════════════════════════ */
const store = {
  get(k, fallback = null) {
    try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  // Per-duration PBs  e.g. store.getPb('cps', 5)
  getPb(mode, key) { return this.get(`pb-${mode}-${key}`, 0); },
  setPb(mode, key, v) { this.set(`pb-${mode}-${key}`, v); },
  // Session history (last 30)
  pushHistory(mode, val) {
    const hist = this.get(`hist-${mode}`, []);
    hist.push({ v: val, t: Date.now() });
    if (hist.length > 30) hist.shift();
    this.set(`hist-${mode}`, hist);
  },
  getHistory(mode) { return this.get(`hist-${mode}`, []); },
  clearHistory() {
    ['cps','typing','reaction'].forEach(m => localStorage.removeItem(`hist-${m}`));
    ['cps','typing','reaction'].forEach(m => {
      Object.keys(localStorage).filter(k => k.startsWith(`pb-${m}`)).forEach(k => localStorage.removeItem(k));
    });
  }
};

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
let _toastTimer = null;
function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
}

/* ══════════════════════════════════════════════════════
   GRAPH DRAWING
══════════════════════════════════════════════════════ */
function drawGraph(svgEl, data, color, ghost = null) {
  svgEl.innerHTML = '';
  if (!data || data.length < 2) return;
  const W = 600, H = 72, P = 5;
  const allVals = ghost ? [...data, ...ghost] : data;
  const maxV = Math.max(...allVals, 1);
  const pt = (v, i, arr) => [
    (i / (arr.length - 1)) * W,
    H - P - (v / maxV) * (H - P * 2)
  ];

  function drawSeries(arr, col, opacity = 1) {
    const pts = arr.map((v, i) => pt(v, i, arr));
    const area = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    area.setAttribute('points', `0,${H} ${pts.map(p=>p.join(',')).join(' ')} ${W},${H}`);
    area.setAttribute('fill', col);
    area.setAttribute('fill-opacity', opacity * 0.12);
    svgEl.appendChild(area);
    const line = document.createElementNS('http://www.w3.org/2000/svg','polyline');
    line.setAttribute('points', pts.map(p=>p.join(',')).join(' '));
    line.setAttribute('fill','none');
    line.setAttribute('stroke', col);
    line.setAttribute('stroke-width', opacity > 0.5 ? '2.5' : '1.5');
    line.setAttribute('stroke-opacity', opacity);
    line.setAttribute('stroke-linejoin','round');
    line.setAttribute('stroke-linecap','round');
    if (opacity < 1) { line.setAttribute('stroke-dasharray','4 3'); }
    svgEl.appendChild(line);
    if (arr.length <= 35 && opacity > 0.5) {
      pts.forEach(([x,y]) => {
        const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
        c.setAttribute('cx',x); c.setAttribute('cy',y);
        c.setAttribute('r','3'); c.setAttribute('fill',col);
        svgEl.appendChild(c);
      });
    }
  }
  if (ghost) drawSeries(ghost, cssVar('--ghost'), 0.45);
  drawSeries(data, color);
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawBarGraph(svgEl, data, color) {
  svgEl.innerHTML = '';
  if (!data || data.length === 0) return;
  const W = 600, H = 72, P = 4;
  const maxV = Math.max(...data, 1);
  const barW = (W / data.length) * 0.7;
  const gap   = (W / data.length) * 0.3;
  data.forEach((v, i) => {
    const h = ((v / maxV) * (H - P * 2)) || 2;
    const x = i * (barW + gap) + gap / 2;
    const y = H - P - h;
    const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rect.setAttribute('x', x); rect.setAttribute('y', y);
    rect.setAttribute('width', barW); rect.setAttribute('height', h);
    rect.setAttribute('rx', '2'); rect.setAttribute('fill', color);
    rect.setAttribute('fill-opacity', '0.85');
    svgEl.appendChild(rect);
  });
}

function drawSparkline(svgEl, data, color) {
  svgEl.innerHTML = '';
  if (!data || data.length < 2) return;
  const W = 80, H = 28, P = 2;
  const maxV = Math.max(...data, 1);
  const pts = data.map((v, i) => [
    P + (i / (data.length - 1)) * (W - P * 2),
    H - P - (v / maxV) * (H - P * 2)
  ]);
  const line = document.createElementNS('http://www.w3.org/2000/svg','polyline');
  line.setAttribute('points', pts.map(p=>p.join(',')).join(' '));
  line.setAttribute('fill','none'); line.setAttribute('stroke', color);
  line.setAttribute('stroke-width','1.5'); line.setAttribute('stroke-linecap','round');
  line.setAttribute('stroke-linejoin','round');
  svgEl.appendChild(line);
}

/* ══════════════════════════════════════════════════════
   RIPPLE HELPER
══════════════════════════════════════════════════════ */
function makeRipple(el, e) {
  const rect = el.getBoundingClientRect();
  const cx = e.touches ? e.touches[0].clientX : (e.clientX ?? rect.left + rect.width/2);
  const cy = e.touches ? e.touches[0].clientY : (e.clientY ?? rect.top + rect.height/2);
  const d = document.createElement('div');
  d.className = 'rip';
  const s = Math.max(rect.width, rect.height) * 1.8;
  d.style.cssText = `width:${s}px;height:${s}px;left:${cx-rect.left-s/2}px;top:${cy-rect.top-s/2}px`;
  el.appendChild(d);
  d.addEventListener('animationend', () => d.remove(), {once:true});
}

/* ══════════════════════════════════════════════════════
   RATING HELPERS
══════════════════════════════════════════════════════ */
function newPbBadge() {
  return '<svg class="res-badge-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> New Personal Best!';
}
function cpsRating(v) {
  if (v>=14) return '✦ Inhuman'; if (v>=11) return 'Insane';
  if (v>=9)  return 'Very Fast'; if (v>=7)  return 'Fast';
  if (v>=5)  return 'Decent';   if (v>=3)  return 'Average';
  return 'Keep Clicking';
}
function wpmRating(v) {
  if (v>=130) return '✦ Insane'; if (v>=100) return 'Pro';
  if (v>=80)  return 'Fast';    if (v>=60)  return 'Above Average';
  if (v>=40)  return 'Average'; if (v>=20)  return 'Below Average';
  return 'Beginner';
}
function reactionRating(ms) {
  if (ms<180) return '✦ Elite';   if (ms<220) return 'Pro';
  if (ms<260) return 'Fast';      if (ms<300) return 'Average';
  if (ms<350) return 'Slow';
  return 'Keep Practicing';
}

/* ══════════════════════════════════════════════════════
   KEYBOARD HEATMAP RENDERER
══════════════════════════════════════════════════════ */
function renderHeatmap(container, keyErrors, keyTyped) {
  container.innerHTML = '';
  KBD_ROWS.forEach((row, ri) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'kbd-row';
    if (ri === 1) rowEl.style.paddingLeft = '16px';
    if (ri === 2) rowEl.style.paddingLeft = '32px';
    row.forEach(k => {
      const typed = keyTyped[k] || 0;
      const errs  = keyErrors[k] || 0;
      const rate  = typed > 0 ? errs / typed : 0;
      const key = document.createElement('div');
      key.className = 'kbd-key';
      key.textContent = k.toUpperCase();
      // Classification via CSS classes using theme-aware color-mix tokens
      let cls;
      if (typed === 0) cls = 'h-none';
      else if (rate === 0) cls = 'h-ok';
      else if (rate < 0.1) cls = 'h-good';
      else if (rate < 0.25) cls = 'h-mid';
      else cls = 'h-bad';
      key.classList.add(cls);
      if (typed > 0) key.title = `${k}: ${errs}/${typed} errors (${Math.round(rate*100)}%)`;
      rowEl.appendChild(key);
    });
    container.appendChild(rowEl);
  });
}

/* ══════════════════════════════════════════════════════
   WORD GENERATOR
══════════════════════════════════════════════════════ */
function buildWordPool(n, withNums, withPunc) {
  const pool = [...COMMON];
  if (withNums)  NUMS.forEach(w => pool.push(w, w));
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(pool[Math.floor(Math.random() * pool.length)]);
    if (withPunc && Math.random() < 0.12) {
      out[out.length-1] += PUNCS[Math.floor(Math.random() * PUNCS.length)];
    }
  }
  return out;
}

/* ══════════════════════════════════════════════════════
   SHARE HELPER
══════════════════════════════════════════════════════ */
function shareResult(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('Result copied to clipboard!')).catch(() => toast('Copy failed — try manually.'));
  } else {
    toast('Clipboard not available.');
  }
}

/* ══════════════════════════════════════════════════════
   NAV PILL INDICATOR
══════════════════════════════════════════════════════ */
function updateNavPill() {
  const active = document.querySelector('.mode-tab.on');
  const pill   = $('nav-pill');
  if (!active || !pill) return;
  const nav = $('mode-nav');
  const navRect = nav.getBoundingClientRect();
  const tabRect = active.getBoundingClientRect();
  pill.style.left  = (tabRect.left - navRect.left - 4) + 'px';
  pill.style.width = (tabRect.width) + 'px';
}

/* ══════════════════════════════════════════════════════
   PAGE ROUTING
══════════════════════════════════════════════════════ */
function goPage(page) {
  document.querySelectorAll('.mode-tab').forEach(t => {
    const on = t.dataset.page === page;
    t.classList.toggle('on', on);
    t.setAttribute('aria-selected', on);
  });
  document.querySelectorAll('.page').forEach(s => s.classList.remove('on'));
  $(`${page}-page`).classList.add('on');
  requestAnimationFrame(updateNavPill);

  if (page === 'cps')      { cpsReset(); }
  if (page === 'typing')   { typReset(); }
  if (page === 'reaction') { reactReset(); }
}

document.querySelectorAll('.mode-tab').forEach(btn => {
  btn.addEventListener('click', () => goPage(btn.dataset.page));
});

/* ══════════════════════════════════════════════════════
   HEADER SETTINGS MENU
══════════════════════════════════════════════════════ */
const SOUND_ON_SVG = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>`;
const SOUND_OFF_SVG = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>`;

function updateSoundUI() {
  const item = $('sound-item');
  const icon = $('sound-item-icon');
  const check = $('sound-check');
  item.setAttribute('aria-checked', soundOn ? 'true' : 'false');
  icon.innerHTML = soundOn ? SOUND_ON_SVG : SOUND_OFF_SVG;
  check.style.display = soundOn ? '' : 'none';
}

function toggleMenu(force) {
  const drop = $('menu-drop');
  const btn = $('menu-btn');
  const open = force !== undefined ? force : !drop.classList.contains('on');
  drop.classList.toggle('on', open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

$('menu-btn').addEventListener('click', () => toggleMenu());

document.addEventListener('click', (e) => {
  if ($('menu-drop').classList.contains('on') && !e.target.closest('#menu')) toggleMenu(false);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('menu-drop').classList.contains('on') && !$('history-modal').classList.contains('on')) {
    toggleMenu(false);
    $('menu-btn').focus();
  }
});

$('sound-item').addEventListener('click', () => {
  soundOn = !soundOn;
  store.set('sound', soundOn);
  updateSoundUI();
  toast(soundOn ? 'Sound effects on' : 'Sound effects off');
});

/* ══════════════════════════════════════════════════════
   THEME SYSTEM
══════════════════════════════════════════════════════ */
let currentTheme = store.get('theme', 'dark');

function applyTheme(name, animate = true) {
  if (animate) {
    document.documentElement.classList.add('theming');
    clearTimeout(applyTheme._t);
    applyTheme._t = setTimeout(() => document.documentElement.classList.remove('theming'), 350);
  }
  document.documentElement.dataset.theme = name;
  refreshCharts();
  const meta = $('meta-theme');
  if (meta) meta.content = ({ dark: '#08060F', light: '#FFFDFF', gray: '#FAFAFC' })[name] || '#08060F';
}

function updateThemeUI() {
  document.querySelectorAll('.theme-opt').forEach(b => {
    const on = b.dataset.theme === currentTheme;
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

function refreshCharts() {
  if ($('cps-results').style.display !== 'none' && cps.hist) {
    drawBarGraph($('cps-graph'), cps.hist, cssVar('--chart-cps'));
  }
  if ($('typ-results').style.display !== 'none' && typ.history.length > 1) {
    const ghostKey = 'ghost-typ-' + typ.pbKey();
    const ghost = store.getPb('typing', typ.pbKey()) === typ.history[typ.history.length - 1]
      ? null
      : store.get(ghostKey, null);
    drawGraph($('typ-graph'), typ.history, cssVar('--chart-typ'), ghost);
    renderHeatmap($('kbd-heatmap'), typ.keyErrors, typ.keyTyped);
  }
  if ($('react-results').style.display !== 'none' && react.times.length > 0) {
    drawGraph($('react-graph'), react.times.map(t => t < 0 ? 0 : t), cssVar('--chart-react'));
  }
}

document.querySelectorAll('.theme-opt').forEach(b => {
  b.addEventListener('click', () => {
    currentTheme = b.dataset.theme;
    store.set('theme', currentTheme);
    applyTheme(currentTheme);
    updateThemeUI();
  });
});

/* ══════════════════════════════════════════════════════
   INSTALL APP (PWA)
══════════════════════════════════════════════════════ */
let deferredPrompt = null;
const installBtn = $('install-btn');
const APP_INSTALLED = 'app-installed';
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  toggleMenu(false);
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') {
    store.set(APP_INSTALLED, true);
    installBtn.hidden = true;
    toast('SpeedLab installed. Check your apps/desktop.');
  }
  deferredPrompt = null;
});
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  if (store.get(APP_INSTALLED, false)) return;
  deferredPrompt = e;
  installBtn.hidden = false;
});
window.addEventListener('appinstalled', () => {
  store.set(APP_INSTALLED, true);
  installBtn.hidden = true;
  deferredPrompt = null;
});
if (window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true) {
  store.set(APP_INSTALLED, true);
  installBtn.hidden = true;
}

/* ══════════════════════════════════════════════════════
   RESET DATA
══════════════════════════════════════════════════════ */
$('reset-btn').addEventListener('click', () => {
  toggleMenu(false);
  if (confirm('Reset all progress? This clears history and personal bests for every mode.')) {
    store.clearHistory();
    toast('All data cleared.');
  }
});

/* ══════════════════════════════════════════════════════
   ABOUT MODAL
══════════════════════════════════════════════════════ */
$('about-btn').addEventListener('click', () => {
  toggleMenu(false);
  openAbout();
});
function openAbout() {
  $('about-modal').classList.add('on');
  document.body.style.overflow = 'hidden';
  $('about-close').focus();
}
function closeAbout() {
  $('about-modal').classList.remove('on');
  document.body.style.overflow = '';
  $('menu-btn').focus();
}
$('ftr-about-btn').addEventListener('click', openAbout);
$('about-close').addEventListener('click', closeAbout);
$('about-modal').addEventListener('click', (e) => { if (e.target === $('about-modal')) closeAbout(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('about-modal').classList.contains('on')) closeAbout();
});

/* Footer shortcuts */
$('ftr-history-btn').addEventListener('click', openHistory);
$('ftr-reset-btn').addEventListener('click', () => {
  if (confirm('Reset all progress? This clears history and personal bests for every mode.')) {
    store.clearHistory();
    toast('All data cleared.');
  }
});

/* ══════════════════════════════════════════════════════
   SERVICE WORKER (offline support)
══════════════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

/* ══════════════════════════════════════════════════════
   HISTORY MODAL
══════════════════════════════════════════════════════ */
function openHistory() {
  const modal = $('history-modal');
  modal.classList.add('on');
  document.body.style.overflow = 'hidden';
  // Save the element that had focus so we can restore it on close
  modal.dataset.prevFocus = document.activeElement ? document.activeElement.id : '';
  const closeBtn = $('history-close');
  closeBtn.focus();
  renderHistoryData();
}

function closeHistory() {
  const modal = $('history-modal');
  modal.classList.remove('on');
  document.body.style.overflow = '';
  // Restore focus to the previously focused element
  const prevId = modal.dataset.prevFocus;
  if (prevId) { const el = $(prevId); if (el) el.focus(); }
  modal.dataset.prevFocus = '';
}

function renderHistoryData() {
  // CPS history
  const cpsH = store.getHistory('cps');
  const cpsVals = cpsH.map(h => h.v);
  if (cpsVals.length >= 2) {
    drawGraph($('h-cps-graph'), cpsVals, cssVar('--chart-cps'));
    $('h-cps-avg').textContent   = (cpsVals.reduce((a,b)=>a+b,0)/cpsVals.length).toFixed(2);
    $('h-cps-best').textContent  = Math.max(...cpsVals).toFixed(2);
  } else {
    $('h-cps-graph').innerHTML = `<text x="300" y="35" text-anchor="middle" fill="${cssVar('--empty-fg')}" font-size="12" font-family="Inter">No data yet</text>`;
    $('h-cps-avg').textContent = '–'; $('h-cps-best').textContent = '–';
  }
  $('h-cps-count').textContent = cpsVals.length;

  // Typing history
  const typH = store.getHistory('typing');
  const typVals = typH.map(h => h.v);
  if (typVals.length >= 2) {
    drawGraph($('h-typ-graph'), typVals, cssVar('--chart-typ'));
    $('h-typ-avg').textContent  = Math.round(typVals.reduce((a,b)=>a+b,0)/typVals.length);
    $('h-typ-best').textContent = Math.max(...typVals);
  } else {
    $('h-typ-graph').innerHTML = `<text x="300" y="35" text-anchor="middle" fill="${cssVar('--empty-fg')}" font-size="12" font-family="Inter">No data yet</text>`;
    $('h-typ-avg').textContent = '–'; $('h-typ-best').textContent = '–';
  }
  $('h-typ-count').textContent = typVals.length;

  // Reaction history
  const reactH = store.getHistory('reaction');
  const reactVals = reactH.map(h => h.v);
  if (reactVals.length >= 2) {
    // Invert for graph (lower is better — show as high)
    const inv = reactVals.map(v => 1000 - v);
    drawGraph($('h-react-graph'), inv, cssVar('--chart-react'));
    $('h-react-avg').textContent  = Math.round(reactVals.reduce((a,b)=>a+b,0)/reactVals.length);
    $('h-react-best').textContent = Math.min(...reactVals);
  } else {
    $('h-react-graph').innerHTML = `<text x="300" y="35" text-anchor="middle" fill="${cssVar('--empty-fg')}" font-size="12" font-family="Inter">No data yet</text>`;
    $('h-react-avg').textContent = '–'; $('h-react-best').textContent = '–';
  }
  $('h-react-count').textContent = reactVals.length;
}

$('history-btn').addEventListener('click', openHistory);
$('history-close').addEventListener('click', closeHistory);
$('history-modal').addEventListener('click', e => { if (e.target === $('history-modal')) closeHistory(); });
$('clear-history-btn').addEventListener('click', () => {
  if (confirm('Clear all history and personal bests?')) {
    store.clearHistory();
    closeHistory();
    toast('History cleared.');
  }
});

// History modal keyboard handling: Escape to close, Tab focus trap
const modalEl = $('history-modal');
modalEl.addEventListener('keydown', e => {
  if (e.key === 'Escape') { e.preventDefault(); closeHistory(); return; }
  if (e.key === 'Tab') {
    const focusables = modalEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last  = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ══════════════════════════════════════════════════════
   CPS  TEST
══════════════════════════════════════════════════════ */
let cps = { dur:5, state:'idle', clicks:[], count:0, startMs:0, peak:0, iv:null, hist:null };

const cpsKey = () => `${cps.dur}`;

function cpsUpdatePb() {
  const pb = store.getPb('cps', cpsKey());
  $('c-pb').textContent = pb > 0 ? pb.toFixed(2) + ' CPS' : '–';
}

document.querySelectorAll('#cps-pills .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    if (cps.state === 'active') return;
    document.querySelectorAll('#cps-pills .pill').forEach(b => {
      b.classList.remove('on');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('on');
    btn.setAttribute('aria-pressed', 'true');
    cps.dur = parseInt(btn.dataset.dur);
    cpsReset();
  });
});

const czone = $('czone');

function cpsInteract(e) {
  e.preventDefault();
  if (cps.state === 'idle')   { cpsStart(e); return; }
  if (cps.state === 'active') { cpsRegClick(e); makeRipple(czone, e); }
}
czone.addEventListener('mousedown', e => { if (e.isTrusted) cpsInteract(e); });
czone.addEventListener('touchstart', e => cpsInteract(e), { passive:false });
czone.addEventListener('contextmenu', e => e.preventDefault());
czone.addEventListener('keydown', e => {
  if (e.key===' '||e.key==='Enter') { e.preventDefault(); cpsInteract(e); }
});

$('cps-retry').addEventListener('click', cpsReset);
$('cps-share').addEventListener('click', () => {
  const val = $('cr-val').textContent;
  shareResult(`SpeedLab CPS Test\n${val} CPS (${cps.dur}s)\nTest yourself: speedlab.app`);
});

function cpsStart(e) {
  cps.state='active'; cps.clicks=[]; cps.count=0; cps.peak=0;
  cps.startMs = performance.now();
  czone.classList.add('live');
  $('c-prompt').textContent = 'Click as fast as you can!';
  cps.iv = setInterval(cpsTick, 100);
  cpsRegClick(e); makeRipple(czone, e);
}

function cpsRegClick(e) {
  const t = performance.now();
  cps.clicks.push(t);
  cps.count++;
  playSound('click');
  const elapsed = (t - cps.startMs) / 1000;
  if (elapsed > 0.08) {
    const live = cps.count / elapsed;
    if (live > cps.peak) cps.peak = live;
    const s = live.toFixed(2);
    $('c-num').textContent = s;
    $('c-cps').textContent = s;
  }
  $('c-clicks').textContent = cps.count;
}

function cpsTick() {
  if (cps.state !== 'active') return;
  const elapsed = (performance.now() - cps.startMs) / 1000;
  const rem = Math.max(0, cps.dur - elapsed);
  $('c-clock').textContent = rem.toFixed(1) + 's';
  $('c-clock').className = 'cps-clock' + (rem <= 3 && rem > 0 ? ' warn' : '');
  $('c-prog').style.transform = `scaleX(${rem / cps.dur})`;
  $('c-prog').parentElement.setAttribute('aria-valuenow', (rem / cps.dur).toFixed(2));
  $('c-peak').textContent = cps.peak.toFixed(2);
  if (rem <= 0) cpsEnd();
}

function cpsEnd() {
  if (cps.state === 'done') return;
  clearInterval(cps.iv);
  cps.state = 'done';
  playSound('done');
  const finalCps = cps.count / cps.dur;
  const prev = store.getPb('cps', cpsKey());
  const isNew = finalCps > prev;
  if (isNew) store.setPb('cps', cpsKey(), finalCps);
  store.pushHistory('cps', parseFloat(finalCps.toFixed(2)));

  // Build per-half-second histogram
  const slots = cps.dur * 2;
  const hist = new Array(slots).fill(0);
  cps.clicks.forEach(t => {
    const bucket = clamp(Math.floor(((t - cps.startMs)/1000) * 2), 0, slots-1);
    hist[bucket]++;
  });

  $('cps-area').style.display = 'none';
  $('cps-results').style.display = 'block';
  cps.hist = hist;
  $('cr-val').textContent = finalCps.toFixed(2);
  $('cr-clicks').textContent = cps.count;
  $('cr-peak').textContent = cps.peak.toFixed(2);
  $('cr-pb').textContent = store.getPb('cps', cpsKey()).toFixed(2);
  const badge = $('cr-badge');
  badge.innerHTML = isNew ? newPbBadge() : cpsRating(finalCps);
  badge.className = 'res-badge' + (isNew ? ' gold' : '');
  drawBarGraph($('cps-graph'), hist, cssVar('--chart-cps'));
}

function cpsReset() {
  clearInterval(cps.iv);
  cps.state='idle'; cps.clicks=[]; cps.count=0; cps.peak=0; cps.startMs=0;
  czone.classList.remove('live');
  $('cps-area').style.display='';
  $('cps-results').style.display='none';
  $('c-num').textContent='0.00'; $('c-cps').textContent='0.00';
  $('c-clicks').textContent='0'; $('c-peak').textContent='0.00';
  $('c-clock').textContent=cps.dur.toFixed(1)+'s';
  $('c-clock').className='cps-clock';
  $('c-prog').style.transform='scaleX(1)';
  $('c-prog').parentElement.setAttribute('aria-valuenow', '1');
  $('c-prompt').textContent='Click or tap to start';
  cpsUpdatePb();
}

/* ══════════════════════════════════════════════════════
   TYPING  TEST
══════════════════════════════════════════════════════ */
const ROW_DEF = 58; // word-height(36) + row-gap(22) — recomputed after render

let typ = {
  subMode:'time',  // time | words | quote | endurance
  dur:30,          // seconds (time mode) or word count (words mode)
  withNums:false, withPunc:false,
  state:'idle',
  words:[], wordEls:[], charEls:[],
  typedWords: [],        // what was typed for each completed word (for backspace-to-prev)
  wordStats:  [],        // {correct,wrong,raw} per completed word
  keyErrors:{}, keyTyped:{},
  wi:0, ci:0,
  correctCh:0, wrongCh:0, rawCh:0,
  startMs:0, remaining:30, lineOff:0,
  history:[], sparkData:[],
  mistakes:0,           // endurance mode
  mainIv:null, liveIv:null, histIv:null,
  composing:false,
  rowH: ROW_DEF,
  quoteText: '',
  pbKey() { return `${this.subMode}-${this.dur}`; }
};

function typUpdatePb() {
  const pb = store.getPb('typing', typ.pbKey());
  $('t-pb').textContent = pb > 0 ? pb + (typ.subMode==='time'?' WPM':' WPM') : '–';
}

// Sub-mode tabs
document.querySelectorAll('.sub-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    if (typ.state === 'active') return;
    document.querySelectorAll('.sub-tab').forEach(b => {
      b.classList.remove('on');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('on');
    btn.setAttribute('aria-selected', 'true');
    typ.subMode = btn.dataset.sub;
    rebuildTypPills();
    typReset();
  });
});

function rebuildTypPills() {
  const bar = $('typ-pills');
  bar.innerHTML = '';
  let defs;
  if (typ.subMode === 'time')      defs = [{v:15,l:'15s'},{v:30,l:'30s'},{v:60,l:'60s'},{v:120,l:'120s'}];
  else if (typ.subMode === 'words') defs = [{v:25,l:'25'},{v:50,l:'50'},{v:100,l:'100'}];
  else { bar.innerHTML = ''; return; }

  defs.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'pill' + (i === (typ.subMode==='time'?1:1) ? ' on' : '');
    btn.dataset.dur = d.v;
    btn.setAttribute('aria-pressed', i === (typ.subMode==='time'?1:1));
    btn.textContent = d.l;
    btn.addEventListener('click', () => {
      if (typ.state === 'active') return;
      bar.querySelectorAll('.pill').forEach(b => {
        b.classList.remove('on');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('on');
      btn.setAttribute('aria-pressed', 'true');
      typ.dur = d.v;
      typReset();
    });
    bar.appendChild(btn);
  });
  typ.dur = defs[typ.subMode==='time'?1:1].v;
}

// Toggles
$('num-toggle').addEventListener('click', () => {
  if (typ.state === 'active') return;
  typ.withNums = !typ.withNums;
  $('num-toggle').classList.toggle('on', typ.withNums);
  $('num-toggle').setAttribute('aria-pressed', typ.withNums);
  typReset();
});
$('punc-toggle').addEventListener('click', () => {
  if (typ.state === 'active') return;
  typ.withPunc = !typ.withPunc;
  $('punc-toggle').classList.toggle('on', typ.withPunc);
  $('punc-toggle').setAttribute('aria-pressed', typ.withPunc);
  typReset();
});

// Input
const ti = $('typ-input');
ti.addEventListener('input',            typHandleInput);
ti.addEventListener('keydown',          typHandleKeydown);
ti.addEventListener('compositionstart', () => { typ.composing = true; });
ti.addEventListener('compositionend',   () => { typ.composing = false; typHandleInput(); });
ti.addEventListener('paste',  e => e.preventDefault());
ti.addEventListener('focus',  () => $('words-wrap').classList.add('foc'));
ti.addEventListener('blur',   () => $('words-wrap').classList.remove('foc'));

// Global keydown → focus input
document.addEventListener('keydown', e => {
  if ($('history-modal').classList.contains('on')) return;
  if ($('about-modal').classList.contains('on')) return;
  if ($('menu-drop').classList.contains('on')) return;
  if (!$('typing-page').classList.contains('on')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === 'Tab') { e.preventDefault(); typReset(); return; }
  if (typ.state === 'done') return;
  if (document.activeElement !== ti) {
    ti.focus();
    if (e.key.length === 1 && !e.repeat) {
      setTimeout(() => {
        if (ti.value === '' && typ.state === 'idle') {
          ti.value = e.key;
          ti.dispatchEvent(new Event('input', {bubbles:true}));
        }
      }, 0);
    }
  }
});

$('typ-retry').addEventListener('click', typReset);
$('typ-share').addEventListener('click', () => {
  const wpm = $('tr-wpm').textContent, acc = $('tr-acc').textContent, con = $('tr-con').textContent;
  shareResult(`SpeedLab Typing Test\n${wpm} WPM | ${acc} Accuracy | ${con} Consistency\nTest yourself: speedlab.app`);
});

/* ── Word generation ───────────────────────────────── */
function typGen() {
  let words;
  if (typ.subMode === 'quote') {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    typ.quoteText = q;
    words = q.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean);
    // Show full quote with some words so it's longer
    while (words.length < 30) words = [...words, ...words];
    words = words.slice(0, 50);
  } else {
    const n = typ.subMode === 'words' ? typ.dur + 30 : 300;
    words = buildWordPool(n, typ.withNums, typ.withPunc);
  }

  typ.words = words;
  typ.wordEls = []; typ.charEls = [];
  typ.typedWords = []; typ.wordStats = [];
  typ.keyErrors = {}; typ.keyTyped = {};
  typ.wi = 0; typ.ci = 0; typ.lineOff = 0;

  const inner = $('words-inner');
  inner.innerHTML = '';
  inner.style.transform = '';

  words.forEach((word, wi) => {
    const wEl = document.createElement('div');
    wEl.className = 'word';
    const chars = [];
    word.split('').forEach((ch, ci) => {
      const sp = document.createElement('span');
      sp.className = 'ch';
      sp.textContent = ch;
      wEl.appendChild(sp);
      chars.push(sp);
    });
    inner.appendChild(wEl);
    typ.wordEls.push(wEl);
    typ.charEls.push(chars);
  });

  positionCaret();

  requestAnimationFrame(() => {
    const wds = inner.querySelectorAll('.word');
    if (wds.length >= 2) {
      const t0 = wds[0].offsetTop;
      for (let i = 1; i < Math.min(wds.length,30); i++) {
        if (wds[i].offsetTop > t0 + 5) { typ.rowH = wds[i].offsetTop - t0; break; }
      }
    }
    positionCaret();
  });
}

/* ── Caret ─────────────────────────────────────────── */
function positionCaret() {
  const caretEl = $('caret');
  const wrapEl  = $('words-wrap');
  if (!caretEl || !wrapEl) return;

  if (typ.wi >= typ.wordEls.length || typ.state === 'done') {
    caretEl.classList.add('hidden'); return;
  }
  const chars = typ.charEls[typ.wi];
  if (!chars || chars.length === 0) { caretEl.classList.add('hidden'); return; }

  const wrapRect = wrapEl.getBoundingClientRect();
  let targetEl = typ.ci < chars.length ? chars[typ.ci] : chars[chars.length - 1];
  const tRect  = targetEl.getBoundingClientRect();
  const useRight = typ.ci >= chars.length;

  const x = tRect.left - wrapRect.left + (useRight ? tRect.width + 1 : -1);
  const y = tRect.top  - wrapRect.top;

  caretEl.classList.remove('hidden');
  caretEl.style.height = tRect.height + 'px';
  caretEl.style.transform = `translate(${x}px, ${y}px)`;
}

/* ── Input handler ─────────────────────────────────── */
function typHandleInput() {
  if (typ.composing) return;
  const val = ti.value;
  if (typ.state === 'done') { ti.value = ''; return; }
  if (typ.state === 'idle' && val.trim().length > 0) typStart();
  if (typ.state !== 'active') { ti.value = ''; return; }

  if (val.endsWith(' ')) {
    const typed = val.slice(0, -1);
    ti.value = '';
    if (typed.length === 0) return;
    typCompleteWord(typed);
    return;
  }
  typUpdateChars(val);
}

function typHandleKeydown(e) {
  if (e.key === 'Tab') { e.preventDefault(); typReset(); return; }
  // Backspace to previous word when current input is empty
  if (e.key === 'Backspace' && ti.value === '' && typ.wi > 0 && typ.state === 'active') {
    e.preventDefault();
    typGoBack();
  }
}

/* ── Backspace to previous word ────────────────────── */
function typGoBack() {
  typ.wi--;
  const stats = typ.wordStats[typ.wi];
  if (stats) {
    typ.correctCh -= stats.correct;
    typ.wrongCh   -= stats.wrong;
    typ.rawCh     -= stats.raw;
  }
  // Restore typed value
  const prev = typ.typedWords[typ.wi] || '';
  ti.value = prev;

  // Reset word display
  const chars = typ.charEls[typ.wi];
  chars.forEach(c => { c.className = 'ch'; c.textContent = c.textContent; });
  // Remove any extra char spans
  const wEl = typ.wordEls[typ.wi];
  wEl.querySelectorAll('.ch.extra').forEach(e => e.remove());
  wEl.classList.remove('wrong-word');
  typ.charEls[typ.wi] = Array.from(wEl.querySelectorAll('.ch'));

  typ.ci = prev.length;
  typUpdateChars(prev);
  typCheckScroll();
  positionCaret();
}

/* ── Update chars while typing ─────────────────────── */
function typUpdateChars(val) {
  if (typ.wi >= typ.wordEls.length) return;
  const chars = typ.charEls[typ.wi];
  const wEl   = typ.wordEls[typ.wi];
  const word  = typ.words[typ.wi];

  // Remove extra spans from previous state
  wEl.querySelectorAll('.ch.extra').forEach(e => e.remove());

  // Reset
  chars.forEach(c => { c.className = 'ch'; });

  // Mark chars
  for (let i = 0; i < chars.length; i++) {
    if (i < val.length) {
      chars[i].className = 'ch ' + (val[i] === chars[i].textContent ? 'ok' : 'bad');
    }
  }

  // Extra chars beyond word
  if (val.length > word.length) {
    for (let i = word.length; i < Math.min(val.length, word.length + 8); i++) {
      const sp = document.createElement('span');
      sp.className = 'ch extra';
      sp.textContent = val[i];
      wEl.appendChild(sp);
    }
  }

  typ.ci = val.length;
  positionCaret();
}

/* ── Complete a word ───────────────────────────────── */
function typCompleteWord(val) {
  if (typ.wi >= typ.wordEls.length) return;
  const word  = typ.words[typ.wi];
  const chars = typ.charEls[typ.wi];
  const wEl   = typ.wordEls[typ.wi];

  wEl.querySelectorAll('.ch.extra').forEach(e => e.remove());
  chars.forEach(c => { c.className = 'ch'; });

  let wc = 0, bc = 0;
  const maxLen = Math.max(word.length, val.length);
  for (let i = 0; i < maxLen; i++) {
    const expected = i < word.length ? word[i] : null;
    const typed    = i < val.length  ? val[i]  : null;
    if (expected) {
      // Track key accuracy
      typ.keyTyped[expected] = (typ.keyTyped[expected]||0) + 1;
    }
    if (expected && typed !== null) {
      const ok = typed === expected;
      if (i < chars.length) chars[i].className = 'ch ' + (ok ? 'ok' : 'bad');
      if (ok) { wc++; }
      else    { bc++; if (expected) typ.keyErrors[expected] = (typ.keyErrors[expected]||0)+1; }
    } else if (expected && typed === null) {
      if (i < chars.length) chars[i].className = 'ch bad';
      bc++;
      typ.keyErrors[expected] = (typ.keyErrors[expected]||0)+1;
    } else if (!expected && typed !== null) {
      bc++;
    }
  }

  const perfect = bc === 0;
  if (!perfect) wEl.classList.add('wrong-word');

  const spaceCorrect = perfect ? 1 : 0;
  const stats = { correct: wc + spaceCorrect, wrong: bc, raw: val.length + 1 };
  typ.typedWords[typ.wi] = val;
  typ.wordStats[typ.wi]  = stats;
  typ.correctCh += stats.correct;
  typ.wrongCh   += stats.wrong;
  typ.rawCh     += stats.raw;

  if (!perfect) { typ.mistakes++; playSound('err'); } else { playSound('key'); }

  // Endurance mode — 3 mistakes = game over
  if (typ.subMode === 'endurance' && typ.mistakes >= 3) { typ.wi++; typEnd(); return; }

  typ.wi++;
  typ.ci = 0;

  // Words mode: end at target word count
  if (typ.subMode === 'words' && typ.wi >= typ.dur) { typEnd(); return; }

  if (typ.wi >= typ.words.length) { typEnd(); return; }

  requestAnimationFrame(() => {
    typCheckScroll();
    positionCaret();
  });
}

/* ── Scroll ────────────────────────────────────────── */
function typCheckScroll() {
  if (typ.wi >= typ.wordEls.length) return;
  const wEl = typ.wordEls[typ.wi];
  const row = Math.floor(wEl.offsetTop / typ.rowH);
  const desired = Math.max(0, (row - 1) * typ.rowH);
  if (desired > typ.lineOff) {
    typ.lineOff = desired;
    $('words-inner').style.transform = `translateY(-${typ.lineOff}px)`;
  }
}

/* ── Start ─────────────────────────────────────────── */
function typStart() {
  typ.state='active'; typ.startMs=performance.now();
  typ.remaining=typ.dur; typ.history=[]; typ.sparkData=[];
  typ.correctCh=0; typ.wrongCh=0; typ.rawCh=0; typ.mistakes=0;
  $('typ-hint').style.display='none';

  if (typ.subMode === 'time') {
    typ.mainIv = setInterval(() => {
      const el = (performance.now()-typ.startMs)/1000;
      typ.remaining = Math.max(0, typ.dur - el);
      const ceil = Math.ceil(typ.remaining);
      const tv = $('t-timer');
      tv.textContent = ceil;
      tv.className = 'ls-v' + (ceil <= 5 && typ.remaining > 0 ? ' warn' : '');
      if (typ.remaining <= 0) typEnd();
    }, 100);
  } else {
    $('t-timer').textContent = '∞';
  }

  typ.liveIv = setInterval(() => {
    const el = (performance.now()-typ.startMs)/1000;
    if (el < 0.5) return;
    const wpm  = Math.round((typ.correctCh/5)/(el/60));
    const tot  = typ.correctCh + typ.wrongCh;
    const acc  = tot > 0 ? Math.round((typ.correctCh/tot)*100) : 100;
    $('t-wpm').textContent = wpm;
    $('t-acc').textContent = acc+'%';
    typ.sparkData.push(wpm);
    if (typ.sparkData.length > 20) typ.sparkData.shift();
    drawSparkline($('spark-svg'), typ.sparkData, cssVar('--chart-typ'));
  }, 500);

  typ.histIv = setInterval(() => {
    const el = (performance.now()-typ.startMs)/1000;
    if (el > 0) typ.history.push(Math.round((typ.correctCh/5)/(el/60)));
  }, 1000);
}

/* ── End ───────────────────────────────────────────── */
function typEnd() {
  if (typ.state === 'done') return;
  clearInterval(typ.mainIv); clearInterval(typ.liveIv); clearInterval(typ.histIv);
  typ.state = 'done';
  ti.blur(); playSound('done');
  $('caret').classList.add('hidden');

  const elapsed = typ.subMode === 'time'
    ? Math.min(typ.dur, (performance.now() - typ.startMs) / 1000)
    : (performance.now() - typ.startMs) / 1000;
  const wpm    = elapsed > 0 ? Math.round((typ.correctCh/5)/(elapsed/60)) : 0;
  const rawWpm = elapsed > 0 ? Math.round((typ.rawCh/5)/(elapsed/60)) : 0;
  const tot    = typ.correctCh + typ.wrongCh;
  const acc    = tot > 0 ? Math.round((typ.correctCh/tot)*100) : 100;
  const con    = consistency(typ.history);
  typ.history.push(wpm);

  const prev  = store.getPb('typing', typ.pbKey());
  const isNew = wpm > prev;
  if (isNew) store.setPb('typing', typ.pbKey(), wpm);
  store.pushHistory('typing', wpm);

  // Ghost line: load PB history (stored separately)
  const ghostKey = `ghost-typ-${typ.pbKey()}`;
  let ghost = null;
  if (isNew) {
    store.set(ghostKey, typ.history);
  } else {
    ghost = store.get(ghostKey, null);
  }

  $('typ-area').style.display = 'none';
  $('typ-results').style.display = 'block';
  $('tr-wpm').textContent = wpm;
  $('tr-raw').textContent = rawWpm;
  $('tr-acc').textContent = acc + '%';
  $('tr-con').textContent = con + '%';
  $('tr-pb').textContent  = store.getPb('typing', typ.pbKey()) + ' WPM';
  $('tr-words').textContent = typ.wi;
  $('tr-errs').textContent  = typ.wrongCh;

  const badge = $('tr-badge');
  badge.innerHTML = isNew ? newPbBadge() : wpmRating(wpm);
  badge.className = 'res-badge' + (isNew ? ' gold' : '');

  if (typ.history.length > 1) {
    drawGraph($('typ-graph'), typ.history, cssVar('--chart-typ'), ghost);
  }
  renderHeatmap($('kbd-heatmap'), typ.keyErrors, typ.keyTyped);
}

/* ── Reset ─────────────────────────────────────────── */
function typReset() {
  clearInterval(typ.mainIv); clearInterval(typ.liveIv); clearInterval(typ.histIv);
  typ.state='idle'; typ.wi=0; typ.ci=0;
  typ.correctCh=0; typ.wrongCh=0; typ.rawCh=0; typ.mistakes=0;
  typ.remaining=typ.dur; typ.startMs=0; typ.lineOff=0;
  typ.history=[]; typ.sparkData=[];
  ti.value='';
  $('words-wrap').classList.remove('foc');
  $('typ-area').style.display='';
  $('typ-results').style.display='none';
  $('typ-hint').style.display='';
  $('t-timer').textContent = typ.subMode === 'time' ? typ.dur : '∞';
  $('t-timer').className='ls-v';
  $('t-wpm').textContent='–'; $('t-acc').textContent='–';
  $('spark-svg').innerHTML='';
  typUpdatePb();
  typGen();
}

/* ══════════════════════════════════════════════════════
   REACTION  TEST
══════════════════════════════════════════════════════ */
let react = {
  rounds:10, state:'idle', times:[], current:0,
  waitTimeout:null, startMs:0, tooEarly:false
};

function reactUpdateDots() {
  const dots = $('react-dots');
  dots.innerHTML='';
  for (let i = 0; i < react.rounds; i++) {
    const d = document.createElement('div');
    d.className = 'r-dot';
    if (i < react.times.length) d.className += (react.times[i] < 0 ? ' fail' : ' done');
    else if (i === react.current) d.className += ' active';
    dots.appendChild(d);
  }
}

document.querySelectorAll('#react-pills .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    if (react.state === 'active' || react.state === 'waiting') return;
    document.querySelectorAll('#react-pills .pill').forEach(b => {
      b.classList.remove('on');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('on');
    btn.setAttribute('aria-pressed', 'true');
    react.rounds = parseInt(btn.dataset.rounds);
    reactReset();
  });
});

const rzone = $('react-zone');
rzone.addEventListener('click',      reactInteract);
rzone.addEventListener('touchstart', e => { e.preventDefault(); reactInteract(); }, {passive:false});
rzone.addEventListener('keydown',    e => { if (e.key===' '||e.key==='Enter') reactInteract(); });
$('react-retry').addEventListener('click', reactReset);
$('react-share').addEventListener('click', () => {
  const avg = $('rr-avg').textContent;
  shareResult(`SpeedLab Reaction Test\n${avg}ms average reaction time\nTest yourself: speedlab.app`);
});

function reactInteract() {
  if (react.state === 'idle')    { reactStartRound(); return; }
  if (react.state === 'waiting') { reactTooEarly();   return; }
  if (react.state === 'go')      { reactClick();      return; }
  if (react.state === 'between') { reactNextRound();  return; }
}

function reactStartRound() {
  react.state='waiting'; react.tooEarly=false;
  rzone.className='reaction-zone wait';
  $('react-msg').textContent='Wait for green...';
  $('react-time').style.display='none';
  reactUpdateDots();
  const delay = rand(1000, 4500);
  react.waitTimeout = setTimeout(() => {
    react.state='go'; react.startMs=performance.now();
    rzone.className='reaction-zone go';
    $('react-msg').textContent='Click now!';
    playSound('go');
  }, delay);
}

function reactTooEarly() {
  clearTimeout(react.waitTimeout);
  react.state='between'; react.tooEarly=true;
  react.times.push(-1); // penalty marker
  rzone.className='reaction-zone early';
  $('react-msg').textContent='Too early! Click to continue.';
  $('react-time').style.display='block';
  $('react-time').style.color='var(--warn)';
  $('react-time').textContent='EARLY';
  playSound('err');
  reactUpdateLiveStats();
  react.current = react.times.length;
  reactUpdateDots();
  if (react.times.length >= react.rounds) { setTimeout(reactShowResults, 800); return; }
}

function reactClick() {
  const ms = Math.round(performance.now() - react.startMs);
  react.state='between';
  react.times.push(ms);
  rzone.className='reaction-zone';
  $('react-msg').textContent=ms < 200 ? 'Excellent! Click to continue.' : 'Click to continue.';
  $('react-time').style.display='block';
  $('react-time').style.color='var(--teal)';
  $('react-time').textContent = ms + 'ms';
  playSound(ms < 250 ? 'done' : 'key');
  reactUpdateLiveStats();
  if (react.times.length >= react.rounds) { setTimeout(reactShowResults, 800); return; }
  react.current = react.times.length;
  reactUpdateDots();
}

function reactNextRound() {
  reactStartRound();
}

function reactUpdateLiveStats() {
  const valid = react.times.filter(t => t > 0);
  if (valid.length > 0) {
    $('ra-avg').textContent  = Math.round(valid.reduce((a,b)=>a+b,0)/valid.length);
    $('ra-best').textContent = Math.min(...valid);
    $('ra-worst').textContent= Math.max(...valid);
  }
}

function reactShowResults() {
  const valid = react.times.filter(t => t > 0);
  if (valid.length === 0) { reactReset(); return; }
  playSound('done');

  const avg   = Math.round(valid.reduce((a,b)=>a+b,0)/valid.length);
  const best  = Math.min(...valid);
  const worst = Math.max(...valid);
  const con   = consistency(valid);

  const prev  = store.getPb('reaction', react.rounds);
  const isNew = prev === 0 || avg < prev;
  if (isNew) store.setPb('reaction', react.rounds, avg);
  store.pushHistory('reaction', avg);

  $('react-area').style.display='none';
  $('react-results').style.display='block';
  $('rr-avg').textContent  = avg;
  $('rr-best').textContent = best;
  $('rr-worst').textContent= worst;
  $('rr-con').textContent  = con+'%';

  const badge = $('rr-badge');
  badge.innerHTML = isNew ? newPbBadge() : reactionRating(avg);
  badge.className = 'res-badge' + (isNew ? ' gold' : '');

  drawGraph($('react-graph'), react.times.map(t=>t<0?0:t), cssVar('--chart-react'));
}

function reactReset() {
  clearTimeout(react.waitTimeout);
  react.state='idle'; react.times=[]; react.current=0; react.tooEarly=false;
  rzone.className='reaction-zone';
  $('react-area').style.display='';
  $('react-results').style.display='none';
  $('react-msg').textContent='Click to start';
  $('react-time').style.display='none';
  $('ra-avg').textContent='–'; $('ra-best').textContent='–'; $('ra-worst').textContent='–';
  reactUpdateDots();
}

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
soundOn = store.get('sound', true);
updateSoundUI();
currentTheme = store.get('theme', 'dark');
applyTheme(currentTheme, false);
updateThemeUI();
requestAnimationFrame(updateNavPill);
window.addEventListener('resize', updateNavPill);
cpsReset();
typReset();
reactReset();
