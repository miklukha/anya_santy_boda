// ══════════════════════════════════
//  TRANSLATIONS
//  All UI strings in one place.
//  To add a new language: add a key to each entry below.
// ══════════════════════════════════
const T = {
  names: {
    es: 'Anya y Santi',
    uk: 'Аня і Санті'
  },
  envHint: {
    es: 'Toca para abrir tu invitación ✦',
    uk: 'Натисни, щоб відкрити запрошення ✦'
  },
  inviteText: {
    es: 'TE INVITAMOS CON ALEGRÍA \nA LA CELEBRACIÓN DE NUESTRA BODA',
    uk: 'З ВЕЛИКОЮ РАДІСТЮ ЗАПРОШУЄМО ТЕБЕ\nНА НАШЕ ВЕСІЛЛЯ'
  },
  weekday: {
    es: 'Domingo',
    uk: 'Неділя'
  },
  countdownLabel: {
    es: 'Días para la celebración',
    uk: 'До свята залишилось'
  },
  units: {
    es: { days: 'días', hours: 'horas', mins: 'min', secs: 'seg' },
    uk: { days: 'днів', hours: 'годин', mins: 'хв', secs: 'сек' }
  },
  location: {
    es: '✦ Illas Gabeiras, Ferrol',
    uk: '✦ Illas Gabeiras, Ferrol'
  },
  rsvpText: {
    es: 'Por favor, confirma tu asistencia\nantes del 1 de junio de 2026',
    uk: 'Будь ласка, підтверди свою присутність\nне пізніше 1 червня 2026 року'
  },
  musicTooltip: {
    es: 'Música de fondo',
    uk: 'Увімкнути музику'
  }
};

// ══════════════════════════════════
//  STATE  (declared at top — before any function runs)
// ══════════════════════════════════
let currentLang = 'es';
let envelopeOpened = false;

function setLang(lang) {
  if (lang !== 'es' && lang !== 'uk') lang = 'es';
  currentLang = lang;
  document.documentElement.lang = lang === 'uk' ? 'uk' : 'es';

  // Toggle data-lang elements
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('lang-active', el.dataset.lang === lang);
  });

  // Active button highlight
  document.querySelectorAll('.lang-toggle').forEach(group => {
    group.querySelectorAll('.lang-btn').forEach(btn => {
      const match =
        (lang === 'es' && btn.textContent.trim() === 'ES') ||
        (lang === 'uk' && btn.textContent.trim() === 'UA');
      btn.classList.toggle('active', match);
    });
  });

  // Apply all JS-managed strings
  applyStrings(lang);

  // Bank section: Spanish only
  const bank = document.getElementById('bank-section');
  if (bank) bank.style.display = lang === 'es' ? '' : 'none';

  // Save to URL
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url.toString());
}

function applyStrings(lang) {
  if (lang !== 'es' && lang !== 'uk') lang = 'es';
  const t = T;

  // Title / names
  setText('title-names', t.names[lang]);
  setText('env-hint-text', t.envHint[lang]);

  // Invite text (multiline → use innerHTML with <br>)
  setHtml('invite-text-content', t.inviteText[lang].replace(/\n/g, '<br/>'));

  // Weekday
  setText('date-weekday', t.weekday[lang]);

  // Countdown label
  setText('countdown-label-text', t.countdownLabel[lang]);

  // Countdown units
  const u = t.units[lang];
  setText('cd-unit-days', u.days);
  setText('cd-unit-hours', u.hours);
  setText('cd-unit-mins', u.mins);
  setText('cd-unit-secs', u.secs);

  // Location link text
  setText('location-link-text', t.location[lang]);

  // RSVP
  setHtml('rsvp-text-content', t.rsvpText[lang].replace(/\n/g, '<br/>'));

  // Music tooltip
  setText('music-tooltip-text', t.musicTooltip[lang]);
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function setHtml(id, value) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = value;
}

// Init lang from URL param
(function () {
  const p = new URLSearchParams(window.location.search).get('lang');
  setLang(p === 'uk' ? 'uk' : 'es');
})();

// ══════════════════════════════════
//  ENVELOPE
// ══════════════════════════════════
function openEnvelope() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  document.getElementById('envelopeWrap').classList.add('opening');

  setTimeout(() => {
    document.getElementById('envelope-scene').classList.add('hidden');

    const inv = document.getElementById('invitation');
    inv.style.display = 'block';
    inv.offsetHeight; // trigger reflow
    inv.classList.add('visible');

    updateCountdown(); // refresh immediately after reveal
    tryAutoplay();
  }, 1200);
}

function tryAutoplay() {
  const audio = document.getElementById('bgMusic');
  audio.volume = 0.4;
  audio
    .play()
    .then(() =>
      document.getElementById('musicPlayer').classList.add('music-playing')
    )
    .catch(() => {});
}

// ══════════════════════════════════
//  COUNTDOWN — target: 2026-07-05
// ══════════════════════════════════
function updateCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  // Elements might not be in DOM yet — skip silently
  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  const target = new Date('2026-07-05T00:00:00');
  const now = new Date();
  let diff = target - now;

  if (diff <= 0) {
    daysEl.textContent =
      hoursEl.textContent =
      minsEl.textContent =
      secsEl.textContent =
        '00';
    return;
  }

  const days = Math.floor(diff / 86400000);
  diff -= days * 86400000;
  const hours = Math.floor(diff / 3600000);
  diff -= hours * 3600000;
  const mins = Math.floor(diff / 60000);
  diff -= mins * 60000;
  const secs = Math.floor(diff / 1000);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ══════════════════════════════════
//  MUSIC
// ══════════════════════════════════
function toggleMusic() {
  const audio = document.getElementById('bgMusic');
  const player = document.getElementById('musicPlayer');
  if (audio.paused) {
    audio.volume = 0.4;
    audio.play();
    player.classList.add('music-playing');
  } else {
    audio.pause();
    player.classList.remove('music-playing');
  }
}
