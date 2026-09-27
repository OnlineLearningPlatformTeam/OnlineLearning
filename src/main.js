/* ═══════════════════════════════════════════════════════════════════
   OLP · main.js — shared by every page
   Tailwind entry (style.css), tiny DOM/icon/toast helpers on window.OLP,
   the responsive navbar, the footer year, scroll reveal, and the loader
   for page-specific modules (components/js/courses.js, contact.js).

   Merge note: develop's navbar and feature/contact's animated navbar were
   reconciled into the single implementation below (the animated one, which
   also drives the plain `hidden`-style menu used on the courses page).
   ═══════════════════════════════════════════════════════════════════ */
import './style.css';
<<<<<<< HEAD
const menuBtn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const iconOpen = document.getElementById('icon-open');
    const iconClose = document.getElementById('icon-close');
    function setMenuState(isOpen) {
      menu.classList.toggle('hidden', !isOpen);
      iconOpen.classList.toggle('hidden', isOpen);
      iconClose.classList.toggle('hidden', !isOpen);
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }
    menuBtn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('hidden');
      setMenuState(isOpen);
    });
    document.addEventListener('click', (e) => {
      const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
      if (!isClickInside && !menu.classList.contains('hidden')) {
        setMenuState(false);
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
        setMenuState(false);
        menuBtn.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        menu.classList.remove('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else if (!menuBtn.getAttribute('aria-expanded') || menuBtn.getAttribute('aria-expanded') === 'false') {
        menu.classList.add('hidden');
      }
    });
=======

/* ── tiny helpers ────────────────────────────────────────────────── */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));

/* ── inline SVG icons (no icon font needed for these) ────────────── */
const ICONS = {
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/>',
  badge: '<path d="m9 12 2 2 4-4"/><path d="M12 3l7 3v6c0 4.5-3 8.3-7 9-4-.7-7-4.5-7-9V6Z"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.9Z"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.4-3.4"/>',
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2Z"/><path d="M8 3v18"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9"/>',
  school: '<path d="m12 4 9 5-9 5-9-5 9-5Z"/><path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11"/>',
  verified: '<path d="m12 3 2.1 1.6 2.6-.3 1 2.4 2.3 1.2-.8 2.5.8 2.5-2.3 1.2-1 2.4-2.6-.3L12 21l-2.1-1.6-2.6.3-1-2.4L4 16.1l.8-2.5L4 11.1l2.3-1.2 1-2.4 2.6.3Z"/>',
  zap: '<path d="M13 2 4.5 13.5H11l-1.5 8.5L19 10h-6.5Z"/>',
  headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H5.5A1.5 1.5 0 0 1 4 17.5Z"/><path d="M20 14h-3v5h1.5A1.5 1.5 0 0 0 20 17.5Z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
  megaphone: '<path d="m3 11 15-7v16L3 13Z"/><path d="M6 12v5a2 2 0 0 0 2 2h1"/>',
  sheet: '<path d="M14 3v5h5"/><path d="M19 8v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7Z"/><path d="M9 13h6M9 17h4"/>',
  spark: '<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4Z"/>',
};

/** Inline SVG markup for a named icon (unknown names fall back to `spark`). */
function icon(name, cls = 'h-4 w-4', stroke = 2) {
  const body = ICONS[name] || ICONS.spark;
  const filled = name === 'star';
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="${filled ? 'none' : 'currentColor'}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* ── toasts ──────────────────────────────────────────────────────── */
function toast(message, tone = 'brand', iconName = 'check') {
  const host = $('#toasts');
  if (!host) return;
  const tones = {
    brand: 'bg-slate-900 text-white',
    success: 'bg-emerald-600 text-white',
    warn: 'bg-amber-500 text-white',
  };
  const el = document.createElement('div');
  el.className = `animate-popIn pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl ${tones[tone] || tones.brand}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `<span class="mt-0.5 shrink-0">${icon(iconName, 'h-4 w-4')}</span><span>${esc(message)}</span>`;
  host.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .3s, transform .3s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => el.remove(), 320);
  }, 3200);
}

const lockScroll = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : '';
};

/* ── scroll reveal (safety-reveals so nothing can stay hidden) ────── */
function initReveal() {
  const els = $$('.reveal:not(.in)');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  document.body.classList.add('reveal-ready');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      setTimeout(() => entry.target.classList.add('in'), i * 70);
      obs.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach((el) => io.observe(el));
}

/** Run `fn` once the document is parsed (modules are deferred already). */
function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
}



/* ── footer year ─────────────────────────────────────────────────── */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ── shared API for the page modules ─────────────────────────────── */
window.OLP = Object.freeze({ $, $$, esc, icon, toast, lockScroll, initReveal, onReady });

/* ── page modules (kept out of the shared bundle) ────────────────── */
const page = document.body?.dataset.page;
/* courses.js renders the cards on the catalogue page and the featured strip
   on the home page (any element with [data-course-grid]) */
if (page === 'courses' || page === 'home') import('./components/js/courses.js');
if (page === 'contact') import('./components/js/contact.js');

const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
function setMenuState(isOpen) {
  menu.classList.toggle('hidden', !isOpen);
  iconOpen.classList.toggle('hidden', isOpen);
  iconClose.classList.toggle('hidden', !isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
}
menuBtn.addEventListener('click', () => {
  const isOpen = menu.classList.contains('hidden');
  setMenuState(isOpen);
});
document.addEventListener('click', (e) => {
  const isClickInside = menu.contains(e.target) || menuBtn.contains(e.target);
  if (!isClickInside && !menu.classList.contains('hidden')) {
    setMenuState(false);
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
    setMenuState(false);
    menuBtn.focus();
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    menu.classList.remove('hidden');
    iconOpen.classList.remove('hidden');
    iconClose.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  } else if (!menuBtn.getAttribute('aria-expanded') || menuBtn.getAttribute('aria-expanded') === 'false') {
    menu.classList.add('hidden');
  }
});
>>>>>>> feature/fix-code

