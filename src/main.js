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
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>',
  moon: '<path d="M20.5 14.7A8.5 8.5 0 0 1 9.3 3.5 8.5 8.5 0 1 0 20.5 14.7Z"/>',
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

/* ── navbar (works with the site's animated menu markup) ─────────── */
const menuBtn = $('#menu-btn');
const menu = $('#menu');
const iconOpen = $('#icon-open');
const iconClose = $('#icon-close');

function setMenuState(isOpen) {
  if (!menu || !menuBtn) return;
  menu.classList.toggle('opacity-0', !isOpen);
  menu.classList.toggle('opacity-100', isOpen);
  menu.classList.toggle('pointer-events-none', !isOpen);
  menu.classList.toggle('pointer-events-auto', isOpen);
  menu.classList.toggle('-translate-y-2', !isOpen);
  menu.classList.toggle('translate-y-0', isOpen);
  menu.classList.toggle('is-open', isOpen);
  if (iconOpen) {
    iconOpen.classList.toggle('opacity-0', isOpen);
    iconOpen.classList.toggle('rotate-90', isOpen);
    iconOpen.classList.toggle('scale-75', isOpen);
  }
  if (iconClose) {
    iconClose.classList.toggle('opacity-0', !isOpen);
    iconClose.classList.toggle('rotate-90', !isOpen);
    iconClose.classList.toggle('scale-75', !isOpen);
  }
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  menuBtn.classList.toggle('active', isOpen);
}

const menuIsOpen = () =>
  !!menu && (menu.classList.contains('opacity-100') || menu.classList.contains('is-open'));

if (menuBtn && menu) {
  /* the panel markup can start hidden with `opacity-0` or with `hidden` */
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    menu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
  }

  menuBtn.addEventListener('click', () => setMenuState(!menuIsOpen()));

  document.addEventListener('click', (event) => {
    const inside = menu.contains(event.target) || menuBtn.contains(event.target);
    if (!inside && menuIsOpen()) setMenuState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuIsOpen()) {
      setMenuState(false);
      menuBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      menu.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-2');
      menu.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      if (iconOpen) iconOpen.classList.remove('opacity-0', 'rotate-90', 'scale-75');
      if (iconClose) iconClose.classList.add('opacity-0', 'rotate-90', 'scale-75');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.classList.remove('active');
    } else if (menuBtn.getAttribute('aria-expanded') === 'false') {
      menu.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0', 'is-open');
      menu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-2');
    }
  });
}



/* ── bilingual UI + light/dark appearance ───────────────────────── */
const I18N = {
  "Home":"ទំព័រដើម","About":"អំពីយើង","About Us":"អំពីយើង","Courses":"វគ្គសិក្សា","All Courses":"វគ្គសិក្សាទាំងអស់",
  "Contact":"ទំនាក់ទំនង","Explore Courses":"ស្វែងរកវគ្គសិក្សា","Explore":"ស្វែងរក","Learning":"ការសិក្សា",
  "NEXT COHORT ENROLLING NOW":"វគ្គសិក្សាថ្មីកំពុងទទួលចុះឈ្មោះ","Learn New Skills.":"រៀនជំនាញថ្មីៗ។",
  "Build Your Future.":"កសាងអនាគតរបស់អ្នក។",
  "Access high-quality, practical courses crafted for modern students and ambitious career switchers. Learn at your own pace from anywhere in the world.":"ចូលរៀនវគ្គសិក្សាដែលមានគុណភាព និងអនុវត្តជាក់ស្តែង សម្រាប់និស្សិត និងអ្នកចង់ប្តូរអាជីព។ រៀនតាមល្បឿនរបស់អ្នកពីគ្រប់ទីកន្លែងក្នុងពិភពលោក។",
  "Contact Us":"ទាក់ទងមកយើង","Accredited":"មានការទទួលស្គាល់","Verified Career Diploma":"សញ្ញាបត្រអាជីពដែលបានផ្ទៀងផ្ទាត់",
  "Live Coding Studio":"បន្ទប់អនុវត្តកូដផ្ទាល់","Completed Lesson":"មេរៀនបានបញ្ចប់","50% Completed":"បានបញ្ចប់ ៥០%",
  "Placement Success":"ជោគជ័យក្នុងការងារ","Hired within 90 days":"ទទួលបានការងារក្នុងរយៈពេល ៩០ ថ្ងៃ",
  "Active Learners":"អ្នកសិក្សាសកម្ម","Across 68 countries":"មកពី ៦៨ ប្រទេស","Curated Programmes":"កម្មវិធីសិក្សាដែលបានជ្រើសរើស",
  "Updated every term":"ធ្វើបច្ចុប្បន្នភាពរៀងរាល់ឆមាស","Satisfaction Rate":"អត្រាពេញចិត្ត","Real student ratings":"ការវាយតម្លៃពីនិស្សិតពិត",
  "Mentor Support":"ការគាំទ្រពីអ្នកណែនាំ","Always by your side":"តែងតែនៅជាមួយអ្នក",
  "ENGINEERED FOR MASTERY":"រចនាឡើងសម្រាប់ភាពជំនាញ","Why Learning is Built for Your Success":"ហេតុអ្វីការសិក្សារបស់យើងជួយឱ្យអ្នកជោគជ័យ",
  "Our mission is to make learning intuitive, flexible, and career-oriented. No filler, no outdated syllabus — only hands-on capabilities employers are actively hunting for.":"បេសកកម្មរបស់យើងគឺធ្វើឱ្យការសិក្សាងាយយល់ បត់បែនបាន និងផ្តោតលើអាជីព។ គ្មានមេរៀនលើសចាំបាច់ ឬកម្មវិធីចាស់ៗទេ — មានតែជំនាញអនុវត្តដែលនិយោជកកំពុងត្រូវការ។",
  "Intuitive Campus Experience":"បទពិសោធន៍សិក្សាងាយស្រួល","Study on any screen with seamless automatic synchronization. Pick up your lesson on your commute and finish your coding lab at your desktop.":"សិក្សាបានគ្រប់ឧបករណ៍ ជាមួយការធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិ។ បន្តមេរៀនពេលធ្វើដំណើរ ហើយបញ្ចប់ការអនុវត្តកូដនៅកុំព្យូទ័រ។",
  "Learn about the platform →":"ស្វែងយល់អំពីវេទិកា →","Bite-Sized Modular Tracks":"មេរៀនខ្លីៗជាផ្នែក","Ditch 2-hour monologues. Our content is compartmentalized into structured 10-to-15 minute interactive modules paired with immediate retention tests.":"ជៀសវាងមេរៀនវែងៗ ២ ម៉ោង។ មាតិកាត្រូវបានបែងចែកជាម៉ូឌុលអន្តរកម្ម ១០–១៥ នាទី ជាមួយការអនុវត្តភ្លាមៗ។",
  "Explore learning methodology →":"ស្វែងយល់ពីវិធីសិក្សា →","Industry Practitioner Reviews":"ការណែនាំពីអ្នកជំនាញឧស្សាហកម្ម",
  "Meet our mentor pool →":"ស្គាល់ក្រុមអ្នកណែនាំ →","Curated Pathways":"ផ្លូវសិក្សាដែលបានរៀបចំ","Popular Courses for Modern Careers":"វគ្គសិក្សាពេញនិយមសម្រាប់អាជីពទំនើប",
  "High-demand skills instructed by top practitioners.":"ជំនាញដែលមានតម្រូវការខ្ពស់ បង្រៀនដោយអ្នកជំនាញ។","Browse all courses":"មើលវគ្គសិក្សាទាំងអស់",
  "THE LEARNING ADVANTAGE":"អត្ថប្រយោជន៍នៃការសិក្សា","Education Designed Around Your Life":"ការអប់រំដែលរចនាសម្រាប់ជីវិតរបស់អ្នក",
  "Learn Anywhere":"រៀនគ្រប់ទីកន្លែង","Learn at Your Own Pace":"រៀនតាមល្បឿនរបស់អ្នក","Develop New Skills":"អភិវឌ្ឍជំនាញថ្មី","Accessible Learning":"ការសិក្សាដែលអាចចូលដំណើរការ",
  "Ready to Start Your Learning Journey?":"ត្រៀមចាប់ផ្តើមដំណើរសិក្សារបស់អ្នកហើយឬនៅ?",
  "Browse All Course":"មើលវគ្គសិក្សាទាំងអស់","Get in Touch":"ទាក់ទងមកយើង",
  "Quick Links":"តំណភ្ជាប់រហ័ស","Contact Details":"ព័ត៌មានទំនាក់ទំនង","Phnom Penh, Cambodia":"ភ្នំពេញ ប្រទេសកម្ពុជា",
  "Privacy Policy":"គោលការណ៍ឯកជនភាព","Terms of Service":"លក្ខខណ្ឌប្រើប្រាស់","All rights reserved.":"រក្សាសិទ្ធិគ្រប់យ៉ាង។",
  "Our Story Vision":"ចក្ខុវិស័យ និងរឿងរ៉ាវរបស់យើង","Empowering Curious Minds to":"ផ្តល់អំណាចដល់អ្នកចូលចិត្តសិក្សា ដើម្បី",
  "Build Tomorrow":"កសាងអនាគត","Explore Mission":"ស្វែងយល់ពីបេសកកម្ម","Meet Instructors":"ស្គាល់អ្នកបង្រៀន",
  "Educational Accessibility":"ការអប់រំដែលអាចចូលដំណើរការ","ESTABLISHED":"បង្កើតឡើង","GLOBAL INSTRUCTORS":"អ្នកបង្រៀនអន្តរជាតិ",
  "COURSE COMPLETION":"ការបញ្ចប់វគ្គសិក្សា","Mentorship That Sticks":"ការណែនាំដែលមានប្រសិទ្ធភាព",
  "Student Satisfaction Rate":"អត្រាពេញចិត្តរបស់និស្សិត","The Problem Breakthrough":"ការដោះស្រាយបញ្ហា","Why We Created Online Learning Platform":"ហេតុអ្វីយើងបង្កើតវេទិកា​សិក្សាអនឡាញ",
  "Flexible Schedules":"កាលវិភាគបត់បែន","Project-Based Learning":"ការសិក្សាតាមគម្រោង","Student Community":"សហគមន៍និស្សិត","Affordable Education":"ការអប់រំមានតម្លៃសមរម្យ",
  "Our Academic Guarantee":"ការធានាផ្នែកសិក្សារបស់យើង","Engineered For Outcomes":"រចនាឡើងសម្រាប់លទ្ធផល",
  "Key Platform Benefits":"អត្ថប្រយោជន៍សំខាន់ៗរបស់វេទិកា","Industry-Standard Curriculum":"កម្មវិធីសិក្សាតាមស្តង់ដារឧស្សាហកម្ម",
  "Read syllabus":"អានកម្មវិធីសិក្សា","Peer-to-Peer Community":"សហគមន៍សិក្សាជាមួយមិត្តភក្តិ","Explore community":"ស្វែងយល់ពីសហគមន៍",
  "Interactive Coding & Labs":"ការសរសេរកូដ និងមន្ទីរពិសោធន៍អន្តរកម្ម","Try sandbox":"សាកល្បង Sandbox","Verified Certificates":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់",
  "Sample credential":"មើលគំរូវិញ្ញាបនបត្រ","Ready to start building?":"ត្រៀមចាប់ផ្តើមបង្កើតហើយឬនៅ?","Talk with a Mentor":"ពិភាក្សាជាមួយអ្នកណែនាំ",
  "Curated Career Paths 2026":"ផ្លូវអាជីពដែលបានរៀបចំសម្រាប់ឆ្នាំ ២០២៦","Explore Our Curated Courses":"ស្វែងរកវគ្គសិក្សាដែលបានរៀបចំ",
  "Discover industry-ready programs tailored for students, beginners, and tech enthusiasts.":"ស្វែងរកកម្មវិធីសិក្សាដែលត្រៀមសម្រាប់ឧស្សាហកម្ម និងសមស្របសម្រាប់និស្សិត អ្នកចាប់ផ្តើម និងអ្នកចូលចិត្តបច្ចេកវិទ្យា។",
  "Self-Paced & Live":"រៀនតាមល្បឿនផ្ទាល់ខ្លួន និង Live","Verified Certs":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់",
  "Search courses":"ស្វែងរកវគ្គសិក្សា","Sort by:":"តម្រៀបតាម៖","Showing":"កំពុងបង្ហាញ","courses":"វគ្គសិក្សា",
  "Course catalogue":"បញ្ជីវគ្គសិក្សា","No courses match your filters":"មិនមានវគ្គសិក្សាដែលត្រូវនឹងតម្រងរបស់អ្នក",
  "Clear filters":"សម្អាតតម្រង","Accelerate Your Career":"ពន្លឿនអាជីពរបស់អ្នក","Need help deciding which path to take?":"ត្រូវការជំនួយក្នុងការជ្រើសរើសផ្លូវសិក្សា?",
  "Book Free Consultation":"កក់ការពិគ្រោះយោបល់ឥតគិតថ្លៃ","Explore All Categories":"មើលគ្រប់ប្រភេទ",
  "Direct Communication":"ទំនាក់ទំនងដោយផ្ទាល់","Get in Touch with":"ទាក់ទងមក","Have questions about courses, enrollment, or university partnerships? Our academic team is here to assist you.":"មានសំណួរអំពីវគ្គសិក្សា ការចុះឈ្មោះ ឬភាពជាដៃគូសាកលវិទ្យាល័យមែនទេ? ក្រុមសិក្សារបស់យើងរង់ចាំជួយអ្នក។",
  "Academic Inquiries":"សំណួរផ្នែកសិក្សា","Admissions Live":"ការចុះឈ្មោះកំពុងបើក","Email us":"អ៊ីមែលមកយើង","Fast response under 24 academic hours":"ឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោងសិក្សា",
  "Call directly":"ហៅទូរស័ព្ទដោយផ្ទាល់","Toll-free student advisory helpline":"ខ្សែទូរស័ព្ទប្រឹក្សាសម្រាប់និស្សិត",
  "Global campus":"បរិវេណសិក្សា","Connect Across Communities":"ភ្ជាប់ជាមួយសហគមន៍","Campus Learning":"ការសិក្សានៅបរិវេណ","Main Learning Campus":"បរិវេណសិក្សាសំខាន់",
  "Open for campus visits & workshops":"បើកសម្រាប់ទស្សនា និងសិក្ខាសាលា","Get Route":"មើលផ្លូវ",
  "Send Us a Direct Message":"ផ្ញើសារមកយើងដោយផ្ទាល់","Fill out the form below with your academic or enrollment inquiry and receive a detailed response.":"បំពេញទម្រង់ខាងក្រោមជាមួយសំណួរផ្នែកសិក្សា ឬការចុះឈ្មោះ ហើយយើងនឹងឆ្លើយតបលម្អិត។",
  "Full name":"ឈ្មោះពេញ","Full Name":"ឈ្មោះពេញ","As registered or on ID":"ដូចក្នុងឯកសារចុះឈ្មោះ ឬអត្តសញ្ញាណប័ណ្ណ",
  "Email Address":"អាសយដ្ឋានអ៊ីមែល","Will be used for follow-up":"ប្រើសម្រាប់ការទាក់ទងបន្ត","Subject Category":"ប្រភេទប្រធានបទ","Department routing":"ការបញ្ជូនទៅផ្នែកពាក់ព័ន្ធ",
  "Select an inquiry area...":"ជ្រើសរើសប្រធានបទ...","Course selection":"ជ្រើសរើសវគ្គសិក្សា","Enrollment & admissions":"ការចុះឈ្មោះ និងចូលរៀន",
  "Academic transfer":"ផ្ទេរការសិក្សា","Technical support":"ជំនួយបច្ចេកទេស","University partnership":"ភាពជាដៃគូសាកលវិទ្យាល័យ","Other":"ផ្សេងៗ",
  "Message":"សារ","/ 500 characters":"/ ៥០០ តួអក្សរ","Submit":"បញ្ជូន","Send Message":"ផ្ញើសារ",
  "We respect your privacy. No promotional spam.":"យើងគោរពឯកជនភាពរបស់អ្នក។ គ្មានសារផ្សព្វផ្សាយរំខានទេ។",
  "Schedule a Virtual Consultation?":"ចង់កក់ការពិគ្រោះយោបល់តាមអនឡាញមែនទេ?","Book Call":"កក់ពេលពិគ្រោះ",
  "Common Questions":"សំណួរទូទៅ","Frequently Asked Questions":"សំណួរដែលសួរញឹកញាប់","Quick answers to help you navigate registration and platform features immediately.":"ចម្លើយខ្លីៗដើម្បីជួយអ្នកប្រើការចុះឈ្មោះ និងមុខងារវេទិកាបានភ្លាមៗ។",
  "How do I access course materials after enrolling?":"តើខ្ញុំអាចចូលមើលមេរៀនបន្ទាប់ពីចុះឈ្មោះដោយរបៀបណា?","Are certificates provided upon completion?":"តើមានវិញ្ញាបនបត្របន្ទាប់ពីបញ្ចប់វគ្គដែរឬទេ?",
  "Can I learn on mobile devices?":"តើខ្ញុំអាចរៀនតាមទូរស័ព្ទបានទេ?","Absolutely. The platform is fully responsive, and there are dedicated iOS and Android apps so you can watch lessons, submit assignments, and track progress on the go.":"បានជាក់ជាមិនខាន។ វេទិកាអាចប្រើបានល្អលើគ្រប់អេក្រង់ ហើយអ្នកអាចមើលមេរៀន បញ្ជូនកិច្ចការ និងតាមដានវឌ្ឍនភាពបានគ្រប់ទីកន្លែង។",
  "Watch preview":"មើលជាមុន","Preview":"មើលជាមុន","Weeks":"សប្តាហ៍","Enrolled":"បានចុះឈ្មោះ","Start Learning":"ចាប់ផ្តើមរៀន",
  "Most Popular":"ពេញនិយមបំផុត","Top Rated":"វាយតម្លៃខ្ពស់","Newest":"ថ្មីបំផុត","Shortest First":"រយៈពេលខ្លីមុន","Title A–Z":"ចំណងជើង A–Z",
  "Beginner":"អ្នកចាប់ផ្តើម","Intermediate":"កម្រិតមធ្យម","Advanced":"កម្រិតខ្ពស់","All levels":"គ្រប់កម្រិត",
  "Web Development":"អភិវឌ្ឍន៍វេប","Design":"រចនា","Programming":"កម្មវិធី","Language":"ភាសា","Marketing":"ទីផ្សារ",
  "Web Development Bootcamp":"វគ្គបណ្តុះបណ្តាលអភិវឌ្ឍន៍វេប",
  "UI/UX Design Essentials":"មូលដ្ឋានសំខាន់ៗនៃការរចនា UI/UX",
  "Python Programming Masterclass":"វគ្គជំនាញកម្មវិធី Python",
  "Graphic Design & Vector Art":"ការរចនាក្រាហ្វិក និង Vector Art",
  "English Language & Professional Communication":"ភាសាអង់គ្លេស និងទំនាក់ទំនងវិជ្ជាជីវៈ",
  "Digital Marketing & Growth Strategy":"ទីផ្សារឌីជីថល និងយុទ្ធសាស្ត្រកំណើន",
  "Beginner to Intermediate":"អ្នកចាប់ផ្តើមដល់មធ្យម","Beginner to Advanced":"អ្នកចាប់ផ្តើមដល់កម្រិតខ្ពស់",
  "All levels":"គ្រប់កម្រិត","Master modern HTML5, CSS3, Flexbox, Grid, and responsive web design with real-world projects.":"ស្ទាត់ជំនាញ HTML5, CSS3, Flexbox, Grid និងការរចនា Web Responsive តាមរយៈគម្រោងជាក់ស្តែង។",
  "Create student-friendly web prototypes, wireframes, user journeys, and design systems.":"បង្កើត Prototype, Wireframe, User Journey និង Design System សម្រាប់វេបសាយដែលងាយស្រួលប្រើ។",
  "Learn Python fundamentals, data structures, scripting, and backend development principles.":"រៀនមូលដ្ឋាន Python រចនាសម្ព័ន្ធទិន្នន័យ Scripting និងគោលការណ៍ Backend។",
  "Design eye-catching logos, branding assets, social media graphics, and digital illustrations.":"រចនា Logo, Brand, ក្រាហ្វិកបណ្តាញសង្គម និងរូបភាពឌីជីថលដែលទាក់ទាញ។",
  "Enhance your workplace vocabulary, technical writing, interview skills, and presentation confidence.":"បង្កើនវាក្យសព្ទការងារ ការសរសេរបច្ចេកទេស ជំនាញសម្ភាសន៍ និងទំនុកចិត្តក្នុងការធ្វើបទបង្ហាញ។",
  "Master SEO, content marketing, social media analytics, and conversion funnels.":"ស្ទាត់ជំនាញ SEO, Content Marketing, វិភាគបណ្តាញសង្គម និង Conversion Funnel។",
  "Senior Frontend Engineer · 9 yrs":"វិស្វករ Frontend ជាន់ខ្ពស់ · ៩ ឆ្នាំ",
  "Product Designer · Figma advocate":"អ្នករចនាផលិតផល · អ្នកជំនាញ Figma",
  "Backend engineer & lecturer":"វិស្វករ Backend និងសាស្ត្រាចារ្យ",
  "Brand & identity designer":"អ្នករចនា Brand និង Identity",
  "Business communication coach":"គ្រូបង្វឹកទំនាក់ទំនងអាជីវកម្ម",
  "Growth lead & SEO strategist":"អ្នកដឹកនាំ Growth និងអ្នកយុទ្ធសាស្ត្រ SEO",
  "Write semantic, accessible HTML5 from scratch":"សរសេរ HTML5 ដែលមាន Semantic និងអាចចូលប្រើបានពីដំបូង",
  "Build responsive layouts with Flexbox and Grid":"បង្កើត Layout Responsive ដោយ Flexbox និង Grid",
  "Style modern interfaces with CSS3 and Tailwind":"រចនា Interface ទំនើបដោយ CSS3 និង Tailwind",
  "Ship a portfolio of 18 real projects":"បង្កើត Portfolio ដែលមានគម្រោងជាក់ស្តែង ១៨",
  "Deploy with Git, GitHub and CI preview links":"Deploy ដោយ Git, GitHub និង CI Preview Links",
  "Map user journeys before you design":"រៀបចំ User Journey មុនពេលរចនា",
  "Move from wireframe to hi-fi Figma prototype":"បម្លែង Wireframe ទៅជា Figma Prototype កម្រិតខ្ពស់",
  "Build a reusable design system":"បង្កើត Design System ដែលអាចប្រើឡើងវិញ",
  "Run usability tests and act on findings":"ធ្វើ Usability Test និងកែលម្អតាមលទ្ធផល",
  "Present a case study recruiters trust":"បង្ហាញ Case Study ដែលអ្នកជ្រើសរើសបុគ្គលិកអាចទុកចិត្ត",
  "Write clean, typed Python 3":"សរសេរ Python 3 ដែលស្អាត និងមាន Type",
  "Model problems with classes and modules":"ដោះស្រាយបញ្ហាដោយ Classes និង Modules",
  "Work fluently with lists, dicts and sets":"ប្រើ Lists, Dictionaries និង Sets បានយ៉ាងស្ទាត់",
  "Consume and build REST APIs":"ប្រើ និងបង្កើត REST APIs",
  "Automate files, reports and schedules":"ធ្វើស្វ័យប្រវត្តិកម្មសម្រាប់ឯកសារ របាយការណ៍ និងកាលវិភាគ",
  "Compose type that scales everywhere":"រៀបចំ Typography ដែលអាចប្រើបានគ្រប់ទំហំ",
  "Design a logo and identity system":"រចនា Logo និង Identity System",
  "Master bezier and vector workflows":"ស្ទាត់ជំនាញ Bezier និង Vector Workflow",
  "Prepare print-ready and digital files":"រៀបចំឯកសារសម្រាប់បោះពុម្ព និងឌីជីថល",
  "Package a client-ready brand book":"បង្កើត Brand Book ដែលត្រៀមសម្រាប់អតិថិជន",
  "Write crisp technical and business documents":"សរសេរឯកសារបច្ចេកទេស និងអាជីវកម្មឱ្យច្បាស់លាស់",
  "Present with structure and poise":"ធ្វើបទបង្ហាញដោយមានរចនាសម្ព័ន្ធ និងទំនុកចិត្ត",
  "Handle behavioural interviews confidently":"ឆ្លើយសម្ភាសន៍អំពីអាកប្បកិរិយាដោយទំនុកចិត្ត",
  "Lead meetings and negotiations":"ដឹកនាំកិច្ចប្រជុំ និងការចរចា",
  "Refine grammar, tone and pronunciation":"កែលម្អវេយ្យាករណ៍ សម្លេង និងការបញ្ចេញសំឡេង",
  "Map a full acquisition funnel":"រៀបចំ Acquisition Funnel ពេញលេញ",
  "Rank pages with technical SEO":"ធ្វើឱ្យទំព័រមានចំណាត់ថ្នាក់ល្អដោយ Technical SEO",
  "Plan content that compounds":"រៀបចំមាតិកាដែលបង្កើនតម្លៃជាបន្តបន្ទាប់",
  "Read GA4 and attribution data":"អានទិន្នន័យ GA4 និង Attribution",
  "Build a 90-day growth plan":"បង្កើតផែនការ Growth រយៈពេល ៩០ ថ្ងៃ" 
};

// Additional UI copy used by the shared pages and dynamic course catalogue.
Object.assign(I18N, {
  "Buttons":"ប៊ូតុង",
  "Description":"ការពិពណ៌នា",
  "Title":"ចំណងជើង",
  "Icon":"រូបតំណាង",
  "About":"អំពីយើង",
  "Browse all courses":"មើលវគ្គសិក្សាទាំងអស់",
  "Browse the course catalogue":"មើលបញ្ជីវគ្គសិក្សា",
  "Explore Courses →":"ស្វែងរកវគ្គសិក្សា →",
  "Explore Courses":"ស្វែងរកវគ្គសិក្សា",
  "Browse All Courses":"មើលវគ្គសិក្សាទាំងអស់",
  "Get in Touch":"ទាក់ទងមកយើង",
  "Featured cards: the exact same component as pages/courses.html — hover/focus plays the course preview clip, clicking opens the player":"កាតវគ្គសិក្សាដូចគ្នានឹងទំព័រ courses.html — ដាក់កណ្ដុរលើកាតដើម្បីមើល Preview ហើយចុចដើម្បីបើកកម្មវិធីចាក់វីដេអូ",
  "JavaScript is off, so the featured courses cannot be rendered.":"JavaScript ត្រូវបានបិទ ដូច្នេះមិនអាចបង្ហាញវគ្គសិក្សាបានទេ។",
  "JavaScript is off, so the course catalogue cannot be rendered. Turn it on, or":"JavaScript ត្រូវបានបិទ ដូច្នេះមិនអាចបង្ហាញបញ្ជីវគ្គសិក្សាបានទេ។ សូមបើក JavaScript ឬ",
  "Empowering learners worldwide with accessible, high-quality, and flexible education.":"ផ្តល់ឱកាសដល់អ្នកសិក្សាទូទាំងពិភពលោក តាមរយៈការអប់រំដែលមានគុណភាព ងាយស្រួលចូលប្រើ និងបត់បែនបាន។",
  "Learning today. Unlock unlimited possibilities with dedicated mentors.":"រៀននៅថ្ងៃនេះ ដើម្បីបើកឱកាសថ្មីៗជាមួយអ្នកណែនាំដែលយកចិត្តទុកដាក់។",
  "Learn at Your Own Pace":"រៀនតាមល្បឿនរបស់អ្នក",
  "Cloud-based access on desktop, tablet, and mobile anytime. Your study state and code sandboxes are always in sync.":"ចូលរៀនតាមកុំព្យូទ័រ Tablet និងទូរស័ព្ទបានគ្រប់ពេល។ វឌ្ឍនភាពសិក្សា និង Coding Sandbox របស់អ្នកត្រូវបានធ្វើសមកាលកម្ម។",
  "Every major assignment receives individual code or portfolio commentary directly from vetted industry seniors working at top tech consultancies.":"កិច្ចការសំខាន់ៗទទួលបានមតិយោបល់ផ្ទាល់ពីអ្នកជំនាញឧស្សាហកម្មដែលមានបទពិសោធន៍នៅក្រុមហ៊ុនបច្ចេកវិទ្យា។",
  "Lifetime access to bite-sized lessons, quizzes, and project repositories. Never stress about arbitrary assignment deadlines.":"ចូលប្រើមេរៀនខ្លីៗ សំណួរ និងឃ្លាំងគម្រោងបានរយៈពេលវែង។ មិនចាំបាច់បារម្ភអំពីកាលកំណត់ដែលមិនបត់បែន។",
  "Real-world projects designed for portfolio building. Showcase verifiable GitHub repos and live Figma prototypes to recruiters.":"គម្រោងជាក់ស្តែងសម្រាប់បង្កើត Portfolio។ បង្ហាញ GitHub Repository និង Figma Prototype ដែលអាចផ្ទៀងផ្ទាត់បានទៅកាន់អ្នកជ្រើសរើសបុគ្គលិក។",
  "Student-friendly pricing, flexible zero-interest split options, scholarships, and free starter foundational tracks.":"តម្លៃសមរម្យសម្រាប់និស្សិត ជម្រើសបង់រំលស់គ្មានការប្រាក់ អាហារូបករណ៍ និងវគ្គមូលដ្ឋានឥតគិតថ្លៃសម្រាប់អ្នកចាប់ផ្តើម។",
  "We removed rigid schedules, expensive textbook fees, and gatekeeping so you can concentrate purely on progress.":"យើងកាត់បន្ថយកាលវិភាគរឹង កម្រៃសៀវភៅថ្លៃ និងឧបសគ្គផ្សេងៗ ដើម្បីឱ្យអ្នកផ្តោតលើការរីកចម្រើន។",
  "About · Online Learning Platform":"អំពីយើង · វេទិកាសិក្សាអនឡាញ",
  "Home · Online Learning Platform":"ទំព័រដើម · វេទិកាសិក្សាអនឡាញ",
  "Most Popular":"ពេញនិយមបំផុត",
  "Top Rated":"វាយតម្លៃខ្ពស់",
  "Newest":"ថ្មីបំផុត",
  "Shortest First":"រយៈពេលខ្លីមុន",
  "Title A–Z":"ចំណងជើង A–Z",
  "students":"និស្សិត",
  "hours":"ម៉ោង",
  "ratings":"ការវាយតម្លៃ",
  "of":"នៃ",
  "lessons":"មេរៀន",
  "Hours total":"ម៉ោងសរុប",
  "On-demand + weekly live lab":"រៀនតាមតម្រូវការ + មន្ទីរពិសោធន៍ផ្ទាល់ប្រចាំសប្តាហ៍",
  "Courses · Online Learning Platform":"វគ្គសិក្សា · វេទិកាសិក្សាអនឡាញ",
  "Skip to content":"រំលងទៅមាតិកា",
  "Skip to the course catalogue":"រំលងទៅបញ្ជីវគ្គសិក្សា",
  "Skip to the contact form":"រំលងទៅទម្រង់ទំនាក់ទំនង",
  "Online Learning Platform. All rights reserved.":"វេទិកាសិក្សាអនឡាញ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
  "Validated learner reviews worldwide":"ការវាយតម្លៃដែលបានផ្ទៀងផ្ទាត់ពីអ្នកសិក្សាទូទាំងពិភពលោក",
  "SESSION 3 OF 16":"វគ្គទី ៣ នៃ ១៦",
  "Lesson 3: Using Tailwind with color & font-size":"មេរៀនទី ៣៖ ការប្រើ Tailwind ជាមួយពណ៌ និងទំហំអក្សរ",
  "Why Learning is Built for Your Success":"ហេតុអ្វីការសិក្សារបស់យើងត្រូវបានរចនាសម្រាប់ភាពជោគជ័យរបស់អ្នក",
  "Popular Courses for Modern Careers":"វគ្គសិក្សាពេញនិយមសម្រាប់អាជីពទំនើប",
  "Real student ratings":"ការវាយតម្លៃពីនិស្សិតពិត",
  "Satisfaction Rate":"អត្រាពេញចិត្ត",
  "Get in Touch with":"ទាក់ទងមក",
  "Need help deciding which path to take?":"ត្រូវការជំនួយក្នុងការជ្រើសរើសផ្លូវសិក្សាមែនទេ?",
  "Talk to an academic advisor or take our 2-minute skill diagnostic to find the exact curriculum tailored to your career goals.":"ពិភាក្សាជាមួយអ្នកប្រឹក្សាផ្នែកសិក្សា ឬធ្វើតេស្តជំនាញរយៈពេល ២ នាទី ដើម្បីស្វែងរកកម្មវិធីសិក្សាដែលសមនឹងគោលដៅអាជីពរបស់អ្នក។",
  "Showing":"កំពុងបង្ហាញ",
  "for the course list.":"សម្រាប់បញ្ជីវគ្គសិក្សា។",
  "Try a different keyword or category — or clear everything and browse all six programmes.":"សាកល្បងពាក្យគន្លឹះ ឬប្រភេទផ្សេងទៀត — ឬសម្អាតតម្រងទាំងអស់ដើម្បីមើលកម្មវិធីទាំង ៦។",
  "6 of 6":"៦ នៃ ៦",
  "/ 500 characters":"/ ៥០០ តួអក្សរ",
  "Please add a short message.":"សូមបញ្ចូលសារខ្លីមួយ។",
  "Please choose an inquiry area.":"សូមជ្រើសរើសប្រធានបទសំណួរ។",
  "Please enter a valid email address.":"សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។",
  "Please enter your full name.":"សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។",
  "Once you enroll, your course materials appear instantly in your student dashboard under \"My Courses.\" You can stream video lessons, download readings, and track your progress from there at any time.":"បន្ទាប់ពីចុះឈ្មោះ មាតិកាវគ្គសិក្សានឹងបង្ហាញភ្លាមៗក្នុង Student Dashboard ក្រោម \"My Courses\"។ អ្នកអាចមើលវីដេអូ ទាញយកឯកសារ និងតាមដានវឌ្ឍនភាពបានគ្រប់ពេល។",
  "Yes. After you complete all required modules and assessments, a verified digital certificate is generated automatically and can be downloaded or shared directly from your profile.":"បាន។ បន្ទាប់ពីបញ្ចប់ម៉ូឌុល និងការវាយតម្លៃដែលត្រូវការ ប្រព័ន្ធនឹងបង្កើតវិញ្ញាបនបត្រឌីជីថលដែលបានផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ ហើយអ្នកអាចទាញយក ឬចែករំលែកពី Profile បាន។",
  "Book a 1-on-1 session with our curriculum advisors online.":"កក់ពេលពិគ្រោះ ១ ទល់ ១ ជាមួយអ្នកប្រឹក្សាកម្មវិធីសិក្សារបស់យើងតាមអនឡាញ។",
  "Absolutely. The platform is fully responsive, and there are dedicated iOS and Android apps so you can watch lessons, submit assignments, and track progress on the go.":"បានជាក់ជាមិនខាន។ វេទិកាឆ្លើយតបគ្រប់អេក្រង់ ហើយអ្នកអាចមើលមេរៀន បញ្ជូនកិច្ចការ និងតាមដានវឌ្ឍនភាពបានតាមទូរស័ព្ទ។",
  "Explore All Categories":"ស្វែងរកគ្រប់ប្រភេទ",
  "Verified Certs":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់",
  "Self-Paced & Live":"រៀនតាមល្បឿនផ្ទាល់ខ្លួន និង Live",
  "Watch preview":"មើល Preview",
  "Preview":"មើលជាមុន",
  "Weeks":"សប្តាហ៍",
  "Hours total":"ម៉ោងសរុប",
  "Certificate":"វិញ្ញាបនបត្រ",
  "Enrolled":"បានចុះឈ្មោះ",
  "Start Learning":"ចាប់ផ្តើមរៀន",
  "Enrol now":"ចុះឈ្មោះឥឡូវនេះ",
  "What you'll learn":"អ្វីដែលអ្នកនឹងរៀន",
  "Ready when you are":"ត្រៀមរួចរាល់សម្រាប់អ្នក",
  "You're on the roster":"អ្នកបានចូលក្នុងបញ្ជីសិក្សា",
  "Saved to your courses on this device.":"បានរក្សាទុកក្នុងវគ្គសិក្សារបស់អ្នកនៅលើឧបករណ៍នេះ។",
  "Free for enrolled OLP students.":"ឥតគិតថ្លៃសម្រាប់និស្សិត OLP ដែលបានចុះឈ្មោះ។",
  "Remove from my courses":"ដកចេញពីវគ្គសិក្សារបស់ខ្ញុំ",
  "Sound on":"បើកសំឡេង",
  "Muted — tap for sound":"បិទសំឡេង — ចុចដើម្បីបើកសំឡេង",
  "The preview clip could not be loaded — showing the course artwork instead. Make sure src/assets/media/*.mp4 are in the project.":"មិនអាចផ្ទុកវីដេអូ Preview បានទេ — កំពុងបង្ហាញរូបភាពវគ្គសិក្សាជំនួស។ សូមពិនិត្យឯកសារ src/assets/media/*.mp4។",
  "Preview clip unavailable — showing the artwork":"មិនមានវីដេអូ Preview — កំពុងបង្ហាញរូបភាពវគ្គសិក្សា",
  "Filters cleared — showing all 6 programmes":"បានសម្អាតតម្រង — កំពុងបង្ហាញកម្មវិធីទាំង ៦",
  "Sending…":"កំពុងផ្ញើ…",
  "Thanks — your message has been sent. We'll reply within 24 academic hours.":"អរគុណ — សាររបស់អ្នកត្រូវបានផ្ញើ។ យើងនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោងសិក្សា។",
  "Sorry, we couldn't send your message. Please try again.":"សូមអភ័យទោស យើងមិនអាចផ្ញើសាររបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
  "Send Message":"ផ្ញើសារ",
  "Please enter your full name.":"សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។",
  "Search courses":"ស្វែងរកវគ្គសិក្សា",
  "Sort by:":"តម្រៀបតាម៖",
  "Most Popular":"ពេញនិយមបំផុត",
  "Top Rated":"វាយតម្លៃខ្ពស់",
  "Newest":"ថ្មីបំផុត",
  "Shortest First":"រយៈពេលខ្លីមុន",
  "Title A–Z":"ចំណងជើង A–Z",
  "My courses":"វគ្គសិក្សារបស់ខ្ញុំ",
  "Search":"ស្វែងរក",
  "Notifications":"ការជូនដំណឹង",
  "Switch language":"ប្តូរភាសា",
  "Switch to light mode":"ប្តូរទៅ Light Mode",
  "Switch to dark mode":"ប្តូរទៅ Dark Mode",
  "Theme":"រូបរាង",
  "Open menu":"បើកម៉ឺនុយ",
  "Close menu":"បិទម៉ឺនុយ",
  "Email":"អ៊ីមែល",
  "Subject":"ប្រធានបទ",
  "Message":"សារ",
  "Full Name":"ឈ្មោះពេញ",
  "Email Address":"អាសយដ្ឋានអ៊ីមែល",
  "Send Message":"ផ្ញើសារ",
  "Submit":"បញ្ជូន",
  "Course selection":"ជ្រើសរើសវគ្គសិក្សា",
  "Enrollment & admissions":"ការចុះឈ្មោះ និងចូលរៀន",
  "Academic transfer":"ផ្ទេរការសិក្សា",
  "Technical support":"ជំនួយបច្ចេកទេស",
  "University partnership":"ភាពជាដៃគូសាកលវិទ្យាល័យ",
  "Other":"ផ្សេងៗ"
});

/* Complete UI/course vocabulary used by static and dynamic components. */
Object.assign(I18N, {
  "Design":"រចនា", "Programming":"កម្មវិធី", "Web Development":"អភិវឌ្ឍន៍វេប", "Language":"ភាសា", "Marketing":"ទីផ្សារ",
  "All Courses":"វគ្គសិក្សាទាំងអស់", "My courses":"វគ្គសិក្សារបស់ខ្ញុំ", "Most Popular":"ពេញនិយមបំផុត", "Top Rated":"វាយតម្លៃខ្ពស់", "Newest":"ថ្មីបំផុត", "Shortest First":"រយៈពេលខ្លីមុន", "Title A–Z":"ចំណងជើង A–Z",
  "Web Development Bootcamp":"វគ្គសិក្សាអភិវឌ្ឍន៍វេប", "UI/UX Design Essentials":"មូលដ្ឋានសំខាន់ៗនៃការរចនា UI/UX", "Python Programming Masterclass":"ថ្នាក់ជំនាញកម្មវិធី Python", "Graphic Design & Vector Art":"ការរចនាក្រាហ្វិក និងសិល្បៈវ៉ិចទ័រ", "English Language & Professional Communication":"ភាសាអង់គ្លេស និងទំនាក់ទំនងវិជ្ជាជីវៈ", "Digital Marketing & Growth Strategy":"ទីផ្សារឌីជីថល និងយុទ្ធសាស្ត្ររីកចម្រើន",
  "Beginner to Intermediate":"កម្រិតដំបូង ដល់មធ្យម", "Beginner to Advanced":"កម្រិតដំបូង ដល់កម្រិតខ្ពស់", "Beginner":"កម្រិតដំបូង", "All levels":"គ្រប់កម្រិត", "Intermediate":"កម្រិតមធ្យម",
  "Master modern HTML5, CSS3, Flexbox, Grid, and responsive web design with real-world projects.":"ស្ទាត់ជំនាញ HTML5, CSS3, Flexbox, Grid និងការរចនាវេបឆ្លើយតប តាមរយៈគម្រោងជាក់ស្តែង។",
  "Create student-friendly web prototypes, wireframes, user journeys, and design systems.":"បង្កើត Prototype វេប Wireframe User Journey និង Design System ដែលងាយស្រួលសម្រាប់អ្នកប្រើ។",
  "Learn Python fundamentals, data structures, scripting, and backend development principles.":"រៀនមូលដ្ឋាន Python រចនាសម្ព័ន្ធទិន្នន័យ Scripting និងគោលការណ៍អភិវឌ្ឍន៍ Backend។",
  "Design eye-catching logos, branding assets, social media graphics, and digital illustrations.":"រចនាឡូហ្គោ អត្តសញ្ញាណម៉ាក ក្រាហ្វិកបណ្តាញសង្គម និងរូបភាពឌីជីថលដែលទាក់ទាញ។",
  "Enhance your workplace vocabulary, technical writing, interview skills, and presentation confidence.":"ពង្រឹងវាក្យសព្ទការងារ ការសរសេរបច្ចេកទេស ជំនាញសម្ភាសន៍ និងទំនុកចិត្តក្នុងការធ្វើបទបង្ហាញ។",
  "Master SEO, content marketing, social media analytics, and conversion funnels.":"ស្ទាត់ជំនាញ SEO ទីផ្សារមាតិកា វិភាគបណ្តាញសង្គម និង Conversion Funnel។",
  "Senior Frontend Engineer · 9 yrs":"វិស្វករ Frontend ជាន់ខ្ពស់ · ៩ ឆ្នាំ", "Product Designer · Figma advocate":"អ្នករចនាផលិតផល · អ្នកជំនាញ Figma", "Backend engineer & lecturer":"វិស្វករ Backend និងសាស្ត្រាចារ្យ", "Brand & identity designer":"អ្នករចនាម៉ាក និងអត្តសញ្ញាណ", "Business communication coach":"គ្រូបង្វឹកទំនាក់ទំនងអាជីវកម្ម", "Growth lead & SEO strategist":"អ្នកដឹកនាំ Growth និងអ្នកយុទ្ធសាស្ត្រ SEO",
  "Instructor":"អ្នកបង្រៀន", "Level":"កម្រិត", "Duration":"រយៈពេល", "Curriculum":"កម្មវិធីសិក្សា", "No prerequisites beyond curiosity":"មិនត្រូវការចំណេះដឹងមុន ក្រៅពីចំណង់ចង់រៀន", "weeks":"សប្តាហ៍", "hours total":"ម៉ោងសរុប", "lessons":"មេរៀន", "On-demand + weekly live lab":"រៀនតាមតម្រូវការ + Lab ផ្ទាល់ប្រចាំសប្តាហ៍",
  "Write semantic, accessible HTML5 from scratch":"សរសេរ HTML5 ដែលមានន័យ និងអាចចូលប្រើបានពីដំបូង", "Build responsive layouts with Flexbox and Grid":"បង្កើត Layout ឆ្លើយតបដោយប្រើ Flexbox និង Grid", "Style modern interfaces with CSS3 and Tailwind":"រចនា Interface ទំនើបដោយប្រើ CSS3 និង Tailwind", "Ship a portfolio of 18 real projects":"បង្កើត Portfolio ពីគម្រោងជាក់ស្តែង ១៨", "Deploy with Git, GitHub and CI preview links":"Deploy ដោយប្រើ Git, GitHub និង CI Preview Links",
  "Map user journeys before you design":"រៀបចំ User Journey មុនពេលរចនា", "Move from wireframe to hi-fi Figma prototype":"បម្លែង Wireframe ទៅជា Figma Prototype កម្រិតខ្ពស់", "Build a reusable design system":"បង្កើត Design System ដែលអាចប្រើឡើងវិញ", "Run usability tests and act on findings":"ធ្វើ Usability Test និងអនុវត្តតាមលទ្ធផល", "Present a case study recruiters trust":"បង្ហាញ Case Study ដែលអ្នកជ្រើសរើសបុគ្គលិកអាចទុកចិត្ត",
  "Write clean, typed Python 3":"សរសេរ Python 3 ដែលស្អាត និងមាន Type", "Model problems with classes and modules":"ដោះស្រាយបញ្ហាដោយប្រើ Classes និង Modules", "Work fluently with lists, dicts and sets":"ប្រើ Lists, Dicts និង Sets បានយ៉ាងស្ទាត់", "Consume and build REST APIs":"ប្រើប្រាស់ និងបង្កើត REST APIs", "Automate files, reports and schedules":"ស្វ័យប្រវត្តិកម្មឯកសារ របាយការណ៍ និងកាលវិភាគ",
  "Compose type that scales everywhere":"រៀបចំអក្សរដែលសមស្របគ្រប់ទំហំ", "Design a logo and identity system":"រចនា Logo និង Identity System", "Master bezier and vector workflows":"ស្ទាត់ជំនាញ Bezier និង Vector Workflow", "Prepare print-ready and digital files":"រៀបចំឯកសារសម្រាប់បោះពុម្ព និងឌីជីថល", "Package a client-ready brand book":"រៀបចំ Brand Book សម្រាប់អតិថិជន",
  "Write crisp technical and business documents":"សរសេរឯកសារបច្ចេកទេស និងអាជីវកម្មឱ្យច្បាស់", "Present with structure and poise":"ធ្វើបទបង្ហាញមានរចនាសម្ព័ន្ធ និងទំនុកចិត្ត", "Handle behavioural interviews confidently":"ដោះស្រាយសម្ភាសន៍បែបអាកប្បកិរិយាដោយទំនុកចិត្ត", "Lead meetings and negotiations":"ដឹកនាំប្រជុំ និងការចរចា", "Refine grammar, tone and pronunciation":"កែលម្អវេយ្យាករណ៍ សំឡេង និងការបញ្ចេញសំឡេង",
  "Map a full acquisition funnel":"រៀបចំ Acquisition Funnel ពេញលេញ", "Rank pages with technical SEO":"ធ្វើឱ្យទំព័រមានចំណាត់ថ្នាក់ល្អដោយ Technical SEO", "Plan content that compounds":"រៀបចំមាតិកាដែលបង្កើតតម្លៃរយៈពេលវែង", "Read GA4 and attribution data":"អានទិន្នន័យ GA4 និង Attribution", "Build a 90-day growth plan":"បង្កើតផែនការ Growth រយៈពេល ៩០ ថ្ងៃ",
  "Certificate":"វិញ្ញាបនបត្រ", "Start Learning":"ចាប់ផ្តើមរៀន", "Enrolled":"បានចុះឈ្មោះ", "Watch preview":"មើលជាមុន", "What you'll learn":"អ្វីដែលអ្នកនឹងរៀន", "Ready when you are":"ត្រៀមរួចរាល់សម្រាប់អ្នក", "Remove from my courses":"ដកចេញពីវគ្គសិក្សារបស់ខ្ញុំ",
  "Search courses by title, skill, or keyword...":"ស្វែងរកវគ្គសិក្សាតាមចំណងជើង ជំនាញ ឬពាក្យគន្លឹះ...", "Search courses":"ស្វែងរកវគ្គសិក្សា", "Showing":"កំពុងបង្ហាញ", "No courses match your filters":"មិនមានវគ្គសិក្សាដែលត្រូវនឹងតម្រងរបស់អ្នក",
  "Choose language":"ជ្រើសរើសភាសា", "English":"English", "Switch to light mode":"ប្តូរទៅ Light Mode", "Switch to dark mode":"ប្តូរទៅ Dark Mode", "Light mode":"Light Mode", "Dark mode":"Dark Mode",
  "Validated learner reviews worldwide":"ការវាយតម្លៃដែលបានផ្ទៀងផ្ទាត់ពីអ្នកសិក្សាទូទាំងពិភពលោក", "Search":"ស្វែងរក", "Notifications":"ការជូនដំណឹង", "Phnom Penh Campus Online learning":"ការសិក្សាអនឡាញពីបរិវេណភ្នំពេញ", "Campus map":"ផែនទីបរិវេណ", "Success message":"សារជោគជ័យ", "message form":"ទម្រង់សារ", "info + map":"ព័ត៌មាន + ផែនទី", "footer":"បាតកថា",
  "Bite-sized, modular sprints engineered for full-time professionals and active degree-seeking students.":"មេរៀនខ្លីៗជាផ្នែក ដែលរៀបចំសម្រាប់អ្នកជំនាញពេញម៉ោង និងនិស្សិតកំពុងសិក្សា។",
  "Bridging the chasm between abstract textbooks and modern tech stacks.":"ភ្ជាប់ចន្លោះរវាងសៀវភៅទ្រឹស្តី និងបច្ចេកវិទ្យាទំនើប។",
  "Content audited and updated quarterly with input from tech leads and design directors.":"មាតិកាត្រូវបានពិនិត្យ និងធ្វើបច្ចុប្បន្នភាពរៀងរាល់ត្រីមាសដោយមានមតិយោបល់ពីអ្នកដឹកនាំបច្ចេកវិទ្យា និងការរចនា។",
  "Direct instructor office hours":"ម៉ោងពិគ្រោះផ្ទាល់ជាមួយអ្នកបង្រៀន", "Everything you need to master contemporary digital design, programming, and architecture.":"អ្វីៗដែលអ្នកត្រូវការដើម្បីស្ទាត់ជំនាញការរចនាឌីជីថល កម្មវិធី និងស្ថាបត្យកម្មទំនើប។", "Higher education often moves slowly, while software landscapes advance at lightning speed. Online Learning Platform (OLP) addresses this imbalance by delivering structured, lab-first curricula guided by practitioners directly building modern web software and cloud systems.":"ការអប់រំឧត្តមសិក្សាមានការផ្លាស់ប្តូរយឺត ខណៈពិភពកម្មវិធីកំពុងរីកចម្រើនយ៉ាងលឿន។ OLP ដោះស្រាយបញ្ហានេះដោយផ្តល់កម្មវិធីសិក្សាមានរចនាសម្ព័ន្ធ និងផ្តោតលើ Lab ដឹកនាំដោយអ្នកជំនាញដែលកំពុងបង្កើតប្រព័ន្ធវេប និង Cloud ទំនើប។",
  "Join hundreds of active learners accelerating their careers right now.":"ចូលរួមជាមួយអ្នកសិក្សាសកម្មរាប់រយនាក់ដែលកំពុងពន្លឿនអាជីពរបស់ពួកគេ។", "Lifetime access to lesson updates":"ចូលប្រើការធ្វើបច្ចុប្បន្នភាពមេរៀនបានរយៈពេលវែង", "Zero hidden subscription lock-ins":"គ្មានការចាក់សោ Subscription លាក់កំបាំង", "Our code reviewers and mentors provide continuous async feedback alongside weekly live breakout workshops.":"អ្នកពិនិត្យកូដ និងអ្នកណែនាំរបស់យើងផ្តល់មតិយោបល់ជាបន្តបន្ទាប់ រួមជាមួយ Workshop ផ្ទាល់ប្រចាំសប្តាហ៍។", "Pair program, brainstorm, and review work in active regional guilds and special interest clubs.":"សរសេរកូដជាគូ បង្កើតគំនិត និងពិនិត្យការងារជាមួយសហគមន៍ក្នុងតំបន់ និងក្លឹបចំណាប់អារម្មណ៍ពិសេស។", "Graduate with genuine multi-repo portfolio artifacts instead of trivial fill-in-the-blank snippets.":"បញ្ចប់ការសិក្សាជាមួយ Portfolio ពិតប្រាកដពី Repository ច្រើន ជំនួសឱ្យលំហាត់បំពេញចន្លោះសាមញ្ញ។", "In-browser playgrounds and containerized environments. No tedious setup needed to start coding.":"Coding Playground ក្នុង Browser និងបរិស្ថាន Container។ មិនចាំបាច់ Setup ស្មុគស្មាញដើម្បីចាប់ផ្តើមសរសេរកូដទេ។",
  "Please add a short message.":"សូមបញ្ចូលសារខ្លីមួយ។", "Please choose an inquiry area.":"សូមជ្រើសរើសប្រធានបទសំណួរ។", "Please enter a valid email address.":"សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។", "Please enter your full name.":"សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។", "Sending…":"កំពុងផ្ញើ…", "Thanks — your message has been sent. We'll reply within 24 academic hours.":"អរគុណ — សាររបស់អ្នកត្រូវបានផ្ញើ។ យើងនឹងឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោងសិក្សា។", "Sorry, we couldn't send your message. Please try again.":"សូមអភ័យទោស យើងមិនអាចផ្ញើសាររបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
  "Course selection":"ជ្រើសរើសវគ្គសិក្សា", "Enrollment & admissions":"ការចុះឈ្មោះ និងចូលរៀន", "Academic transfer":"ផ្ទេរការសិក្សា", "Technical support":"ជំនួយបច្ចេកទេស", "University partnership":"ភាពជាដៃគូសាកលវិទ្យាល័យ", "Select an inquiry area...":"ជ្រើសរើសប្រធានបទ...", "Will be used for follow-up":"ប្រើសម្រាប់ការទាក់ទងបន្ត", "Department routing":"ការបញ្ជូនទៅផ្នែកពាក់ព័ន្ធ", "As registered or on ID":"ដូចក្នុងឯកសារចុះឈ្មោះ ឬអត្តសញ្ញាណប័ណ្ណ",
  "Are certificates provided upon completion?":"តើមានវិញ្ញាបនបត្របន្ទាប់ពីបញ្ចប់វគ្គដែរឬទេ?", "How do I access course materials after enrolling?":"តើខ្ញុំអាចចូលមើលមេរៀនបន្ទាប់ពីចុះឈ្មោះដោយរបៀបណា?", "Can I learn on mobile devices?":"តើខ្ញុំអាចរៀនតាមទូរស័ព្ទបានទេ?", "Absolutely. The platform is fully responsive, and there are dedicated iOS and Android apps so you can watch lessons, submit assignments, and track progress on the go.":"បានជាក់ជាមិនខាន។ វេទិកាអាចប្រើបានល្អលើគ្រប់អេក្រង់ ហើយអ្នកអាចមើលមេរៀន បញ្ជូនកិច្ចការ និងតាមដានវឌ្ឍនភាពបានគ្រប់ទីកន្លែង។",
  "English Language & Professional Communication":"ភាសាអង់គ្លេស និងទំនាក់ទំនងវិជ្ជាជីវៈ", "Digital Marketing & Growth Strategy":"ទីផ្សារឌីជីថល និងយុទ្ធសាស្ត្ររីកចម្រើន"
});


/* Final page-wide copy coverage: every visible static English phrase on all four pages. */
Object.assign(I18N, {
  "Skip to content":"រំលងទៅមាតិកា",
  "Skip to the course catalogue":"រំលងទៅបញ្ជីវគ្គសិក្សា",
  "Skip to the contact form":"រំលងទៅទម្រង់ទំនាក់ទំនង",
  "NEXT COHORT ENROLLING NOW":"វគ្គសិក្សាជំនាន់ថ្មីកំពុងទទួលចុះឈ្មោះ",
  "Learn New Skills.":"រៀនជំនាញថ្មីៗ។",
  "Build Your Future.":"កសាងអនាគតរបស់អ្នក។",
  "Access high-quality, practical courses crafted for modern students and ambitious career switchers. Learn at your own pace from anywhere in the world.":"ចូលរៀនវគ្គសិក្សាដែលមានគុណភាពខ្ពស់ និងអនុវត្តជាក់ស្តែង សម្រាប់និស្សិតសម័យទំនើប និងអ្នកចង់ប្តូរអាជីព។ រៀនតាមល្បឿនរបស់អ្នកពីគ្រប់ទីកន្លែងក្នុងពិភពលោក។",
  "Explore Courses →":"ស្វែងរកវគ្គសិក្សា →",
  "Contact Us":"ទាក់ទងមកយើង",
  "Validated learner reviews worldwide":"ការវាយតម្លៃដែលបានផ្ទៀងផ្ទាត់ពីអ្នកសិក្សាទូទាំងពិភពលោក",
  "Accredited":"ទទួលស្គាល់", "Verified Career Diploma":"សញ្ញាបត្រអាជីពដែលបានផ្ទៀងផ្ទាត់",
  "Live Coding Studio":"ស្ទូឌីយោសរសេរកូដផ្ទាល់", "SESSION 3 OF 16":"មេរៀនទី ៣ ក្នុងចំណោម ១៦",
  "Completed Lesson":"មេរៀនដែលបានបញ្ចប់", "50% Completed":"បានបញ្ចប់ ៥០%",
  "Lesson 3: Using Tailwind with color & font-size":"មេរៀនទី ៣៖ ប្រើ Tailwind ជាមួយពណ៌ និងទំហំអក្សរ",
  "Placement Success":"ជោគជ័យក្នុងការទទួលបានការងារ", "Hired within 90 days":"ទទួលបានការងារក្នុងរយៈពេល ៩០ ថ្ងៃ",
  "Active Learners":"អ្នកសិក្សាសកម្ម", "Across 68 countries":"មកពី ៦៨ ប្រទេស",
  "Curated Programmes":"កម្មវិធីសិក្សាដែលបានរៀបចំ", "Updated every term":"ធ្វើបច្ចុប្បន្នភាពរៀងរាល់ឆមាស",
  "Satisfaction Rate":"អត្រាពេញចិត្ត", "Real student ratings":"ការវាយតម្លៃពីនិស្សិតពិត",
  "Mentor Support":"ជំនួយពីអ្នកណែនាំ", "Always by your side":"នៅជាមួយអ្នកជានិច្ច",
  "ENGINEERED FOR MASTERY":"រចនាឡើងសម្រាប់ភាពស្ទាត់ជំនាញ",
  "Why Learning is Built for Your Success":"ហេតុអ្វីការរៀនត្រូវបានរចនាឡើងសម្រាប់ភាពជោគជ័យរបស់អ្នក",
  "Our mission is to make learning intuitive, flexible, and career-oriented. No filler, no outdated syllabus — only hands-on capabilities employers are actively hunting for.":"បេសកកម្មរបស់យើងគឺធ្វើឱ្យការរៀនមានភាពងាយយល់ បត់បែន និងផ្តោតលើអាជីព។ គ្មានមាតិកាមិនចាំបាច់ និងគ្មានកម្មវិធីសិក្សាចាស់ៗទេ — មានតែជំនាញអនុវត្តដែលនិយោជកកំពុងស្វែងរក។",
  "Intuitive Campus Experience":"បទពិសោធន៍សិក្សាដែលងាយស្រួលប្រើ",
  "Study on any screen with seamless automatic synchronization. Pick up your lesson on your commute and finish your coding lab at your desktop.":"រៀនលើគ្រប់អេក្រង់ដោយការធ្វើសមកាលកម្មស្វ័យប្រវត្តិ។ បន្តមេរៀនពេលធ្វើដំណើរ ហើយបញ្ចប់ Coding Lab នៅលើកុំព្យូទ័ររបស់អ្នក។",
  "Learn about the platform →":"ស្វែងយល់អំពីវេទិកា →",
  "Bite-Sized Modular Tracks":"ផ្លូវសិក្សាខ្លីៗជាផ្នែក",
  "Ditch 2-hour monologues. Our content is compartmentalized into structured 10-to-15 minute interactive modules paired with immediate retention tests.":"បោះបង់មេរៀនវែងៗរយៈពេល ២ ម៉ោង។ មាតិការបស់យើងត្រូវបានបែងចែកជាម៉ូឌុលអន្តរកម្ម ១០ ទៅ ១៥ នាទី ជាមួយការធ្វើតេស្តភ្លាមៗ។",
  "Explore learning methodology →":"ស្វែងយល់ពីវិធីសាស្ត្រសិក្សា →",
  "Industry Practitioner Reviews":"ការពិនិត្យពីអ្នកជំនាញក្នុងឧស្សាហកម្ម",
  "Every major assignment receives individual code or portfolio commentary directly from vetted industry seniors working at top tech consultancies.":"កិច្ចការសំខាន់ៗទទួលបានមតិយោបល់ផ្ទាល់លើកូដ ឬ Portfolio ពីអ្នកជំនាញឧស្សាហកម្មដែលមានបទពិសោធន៍។",
  "Meet our mentor pool →":"ស្គាល់ក្រុមអ្នកណែនាំរបស់យើង →",
  "Curated Pathways":"ផ្លូវសិក្សាដែលបានរៀបចំ", "Popular Courses for Modern Careers":"វគ្គសិក្សាពេញនិយមសម្រាប់អាជីពសម័យទំនើប",
  "High-demand skills instructed by top practitioners.":"ជំនាញដែលមានតម្រូវការខ្ពស់ បង្រៀនដោយអ្នកជំនាញឈានមុខ។",
  "Browse all courses":"មើលវគ្គសិក្សាទាំងអស់", "Browse the course catalogue":"មើលបញ្ជីវគ្គសិក្សា",
  "JavaScript is off, so the featured courses cannot be rendered.":"JavaScript ត្រូវបានបិទ ដូច្នេះមិនអាចបង្ហាញវគ្គសិក្សាដែលបានជ្រើសរើសបានទេ។",
  "THE LEARNING ADVANTAGE":"អត្ថប្រយោជន៍នៃការរៀន", "Education Designed Around Your Life":"ការអប់រំដែលរចនាឡើងជុំវិញជីវិតរបស់អ្នក",
  "We removed rigid schedules, expensive textbook fees, and gatekeeping so you can concentrate purely on progress.":"យើងបានលុបចោលកាលវិភាគរឹងថេរ ថ្លៃសៀវភៅខ្ពស់ និងឧបសគ្គមិនចាំបាច់ ដើម្បីឱ្យអ្នកផ្តោតលើការរីកចម្រើន។",
  "Learn Anywhere":"រៀនគ្រប់ទីកន្លែង", "Cloud-based access on desktop, tablet, and mobile anytime. Your study state and code sandboxes are always in sync.":"ចូលប្រើតាម Cloud លើកុំព្យូទ័រ Tablet និងទូរស័ព្ទគ្រប់ពេល។ ស្ថានភាពសិក្សា និង Code Sandbox របស់អ្នកធ្វើសមកាលកម្មជានិច្ច។",
  "Learn at Your Own Pace":"រៀនតាមល្បឿនរបស់អ្នក", "Lifetime access to bite-sized lessons, quizzes, and project repositories. Never stress over arbitrary assignment deadlines.":"ចូលប្រើមេរៀនខ្លីៗ Quiz និង Project Repository បានរយៈពេលវែង។ មិនចាំបាច់បារម្ភពី Deadline ដែលមិនចាំបាច់។",
  "Develop New Skills":"អភិវឌ្ឍជំនាញថ្មី", "Real-world projects designed for portfolio building. Showcase verifiable GitHub repos and live Figma prototypes to recruiters.":"គម្រោងជាក់ស្តែងសម្រាប់បង្កើត Portfolio។ បង្ហាញ GitHub Repository និង Figma Prototype ដែលអាចផ្ទៀងផ្ទាត់បានដល់អ្នកជ្រើសរើសបុគ្គលិក។",
  "Accessible Learning":"ការរៀនដែលអាចចូលដំណើរការ", "Student-friendly pricing, flexible zero-interest split options, scholarships, and free starter foundational tracks.":"តម្លៃសមរម្យសម្រាប់និស្សិត ជម្រើសបង់រំលស់គ្មានការប្រាក់ អាហារូបករណ៍ និងផ្លូវសិក្សាមូលដ្ឋានឥតគិតថ្លៃ។",
  "Ready to Start Your Learning Journey?":"ត្រៀមចាប់ផ្តើមដំណើរសិក្សារបស់អ្នកហើយឬនៅ?",
  "Join thousands of students building their dream careers with":"ចូលរួមជាមួយនិស្សិតរាប់ពាន់នាក់ដែលកំពុងកសាងអាជីពក្នុងក្តីស្រមៃជាមួយ",
  "Learning today. Unlock unlimited possibilities with dedicated mentors.":"Learning ថ្ងៃនេះ។ បើកលទ្ធភាពគ្មានដែនកំណត់ជាមួយអ្នកណែនាំដែលយកចិត្តទុកដាក់។",
  "Browse All Course":"មើលវគ្គសិក្សាទាំងអស់", "Get in Touch":"ទាក់ទងមកយើង",
  "Our Story Vision":"រឿងរ៉ាវ និងចក្ខុវិស័យរបស់យើង", "Empowering Curious Minds to":"ផ្តល់អំណាចដល់អ្នកចូលចិត្តសិក្សា ដើម្បី", "Build Tomorrow":"កសាងអនាគត",
  "Online Learning Platform (OLP) was founded with a single mission: bridging the gap between classroom theory and real-world technology skills through empathetic, accessible pedagogy.":"វេទិកាសិក្សាអនឡាញ (OLP) ត្រូវបានបង្កើតឡើងដោយមានបេសកកម្មតែមួយ៖ ភ្ជាប់ទ្រឹស្តីក្នុងថ្នាក់រៀនជាមួយជំនាញបច្ចេកវិទ្យាជាក់ស្តែង តាមរយៈការអប់រំដែលងាយចូលដំណើរការ និងយកចិត្តទុកដាក់។",
  "Explore Mission":"ស្វែងយល់ពីបេសកកម្ម", "Meet Instructors":"ស្គាល់អ្នកបង្រៀន", "Educational Accessibility":"ការអប់រំដែលអាចចូលដំណើរការ",
  "Higher education often moves slowly, while software landscapes advance at lightning speed. Online Learning Platform (OLP) addresses this imbalance by delivering structured, lab-first curricula guided by practitioners directly building modern web software and cloud systems.":"ការអប់រំឧត្តមសិក្សាមានការផ្លាស់ប្តូរយឺត ខណៈពិភពកម្មវិធីមានការរីកចម្រើនយ៉ាងលឿន។ OLP ដោះស្រាយភាពមិនស្មើគ្នានេះដោយផ្តល់កម្មវិធីសិក្សាមានរចនាសម្ព័ន្ធ និងផ្តោតលើ Lab ដែលដឹកនាំដោយអ្នកជំនាញ។",
  "Every course combines synchronous cohort accountability with self-paced exploratory modules, ensuring students not only absorb syntax, but synthesize architectural concepts, design patterns, and critical production trade-offs.":"វគ្គសិក្សានីមួយៗរួមបញ្ចូលការរៀនជាក្រុមផ្ទាល់ និងម៉ូឌុលរៀនតាមល្បឿនផ្ទាល់ខ្លួន ដើម្បីឱ្យនិស្សិតមិនត្រឹមតែរៀន Syntax ប៉ុណ្ណោះទេ ប៉ុន្តែអាចយល់ពី Architecture, Design Pattern និងការសម្រេចចិត្តសំខាន់ៗក្នុងការផលិត។",
  "ESTABLISHED":"បង្កើតឡើង", "GLOBAL INSTRUCTORS":"អ្នកបង្រៀនអន្តរជាតិ", "COURSE COMPLETION":"ការបញ្ចប់វគ្គសិក្សា",
  "Phnom Penh Campus Online learning":"ការសិក្សាអនឡាញពីបរិវេណភ្នំពេញ", "Mentorship That Sticks":"ការណែនាំដែលមានប្រសិទ្ធភាព",
  "Our code reviewers and mentors provide continuous async feedback alongside weekly live breakout workshops.":"អ្នកពិនិត្យកូដ និងអ្នកណែនាំរបស់យើងផ្តល់មតិយោបល់ជាបន្តបន្ទាប់ រួមជាមួយ Workshop ផ្ទាល់ប្រចាំសប្តាហ៍។",
  "Student Satisfaction Rate":"អត្រាពេញចិត្តរបស់និស្សិត", "The Problem Breakthrough":"ការដោះស្រាយបញ្ហា", "Why We Created OLP":"ហេតុអ្វីយើងបង្កើត OLP",
  "Traditional degrees burden learners with high debt and static syllabi, while unstructured video repositories abandon students in isolation without feedback.":"ការសិក្សាបែបប្រពៃណីអាចបង្កបន្ទុកហិរញ្ញវត្ថុ និងកម្មវិធីសិក្សាដែលមិនសូវផ្លាស់ប្តូរ ខណៈវីដេអូដែលគ្មានរចនាសម្ព័ន្ធអាចធ្វើឱ្យអ្នកសិក្សាខ្វះការណែនាំ និងមតិយោបល់។",
  "Flexible Schedules":"កាលវិភាគបត់បែន", "Project-Based Learning":"ការសិក្សាតាមគម្រោង", "Student Community":"សហគមន៍និស្សិត", "Affordable Education":"ការអប់រំមានតម្លៃសមរម្យ",
  "Graduate with genuine multi-repo portfolio artifacts instead of trivial fill-in-the-blank snippets.":"បញ្ចប់ការសិក្សាជាមួយ Portfolio ពីគម្រោងពិតជាច្រើន Repository ជំនួសឱ្យលំហាត់សាមញ្ញៗ។",
  "Connect with study groups, join regional hackathons, and exchange code reviews inside active digital spaces.":"ភ្ជាប់ជាមួយក្រុមសិក្សា ចូលរួម Hackathon និងផ្លាស់ប្តូរការពិនិត្យកូដក្នុងសហគមន៍ឌីជីថលសកម្ម។",
  "Eliminating unnecessary institutional overhead to keep tuition transparent, fair, and accessible to everyone.":"កាត់បន្ថយចំណាយមិនចាំបាច់ ដើម្បីរក្សាតម្លៃសិក្សាឱ្យមានភាពច្បាស់លាស់ យុត្តិធម៌ និងអាចចូលដំណើរការបានសម្រាប់គ្រប់គ្នា។",
  "Zero hidden subscription lock-ins":"គ្មានការចាក់សោ Subscription លាក់កំបាំង", "Lifetime access to lesson updates":"ចូលប្រើការធ្វើបច្ចុប្បន្នភាពមេរៀនបានរយៈពេលវែង", "Direct instructor office hours":"ម៉ោងពិគ្រោះផ្ទាល់ជាមួយអ្នកបង្រៀន",
  "Our Academic Guarantee":"ការធានាផ្នែកសិក្សារបស់យើង", "Engineered For Outcomes":"រចនាឡើងសម្រាប់លទ្ធផល", "Key Platform Benefits":"អត្ថប្រយោជន៍សំខាន់ៗរបស់វេទិកា",
  "Everything you need to master contemporary digital design, programming, and architecture.":"អ្វីៗដែលអ្នកត្រូវការដើម្បីស្ទាត់ជំនាញការរចនាឌីជីថល កម្មវិធី និងស្ថាបត្យកម្មទំនើប។",
  "Industry-Standard Curriculum":"កម្មវិធីសិក្សាតាមស្តង់ដារឧស្សាហកម្ម", "Content audited and updated quarterly with input from tech leads and design directors.":"មាតិកាត្រូវបានពិនិត្យ និងធ្វើបច្ចុប្បន្នភាពរៀងរាល់ត្រីមាសដោយមានមតិយោបល់ពីអ្នកដឹកនាំបច្ចេកវិទ្យា និងការរចនា។",
  "Read syllabus":"អានកម្មវិធីសិក្សា", "Peer-to-Peer Community":"សហគមន៍សិក្សាជាមួយមិត្តភក្តិ", "Pair program, brainstorm, and review work in active regional guilds and special interest clubs.":"សរសេរកូដជាគូ បង្កើតគំនិត និងពិនិត្យការងារជាមួយសហគមន៍ក្នុងតំបន់ និងក្លឹបចំណាប់អារម្មណ៍។",
  "Explore community":"ស្វែងយល់ពីសហគមន៍", "Interactive Coding & Labs":"ការសរសេរកូដ និងមន្ទីរពិសោធន៍អន្តរកម្ម", "In-browser playgrounds and containerized environments. No tedious setup needed to start coding.":"Coding Playground និងបរិស្ថាន Container ក្នុង Browser។ មិនចាំបាច់រៀបចំប្រព័ន្ធស្មុគស្មាញមុនចាប់ផ្តើមសរសេរកូដទេ។",
  "Try sandbox":"សាកល្បង Sandbox", "Verified Certificates":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់", "Tamper-proof verifiable credentials that link directly to demonstrated GitHub repos and project links.":"វិញ្ញាបនបត្រដែលអាចផ្ទៀងផ្ទាត់បាន និងភ្ជាប់ទៅ GitHub Repository និងគម្រោងដែលបានបង្ហាញ។",
  "Sample credential":"មើលគំរូវិញ្ញាបនបត្រ", "Ready to start building?":"ត្រៀមចាប់ផ្តើមបង្កើតហើយឬនៅ?", "Join hundreds of active learners accelerating their careers right now.":"ចូលរួមជាមួយអ្នកសិក្សាសកម្មរាប់រយនាក់ដែលកំពុងពន្លឿនអាជីពរបស់ពួកគេ។",
  "Talk with a Mentor":"ពិភាក្សាជាមួយអ្នកណែនាំ",
  "Direct Communication":"ទំនាក់ទំនងដោយផ្ទាល់", "Get in Touch with":"ទាក់ទងមក", "Learning":"Learning",
  "Have questions about courses, enrollment, or university partnerships? Our academic team is here to assist you.":"មានសំណួរអំពីវគ្គសិក្សា ការចុះឈ្មោះ ឬភាពជាដៃគូសាកលវិទ្យាល័យមែនទេ? ក្រុមសិក្សារបស់យើងរង់ចាំជួយអ្នក។",
  "Academic Inquiries":"សំណួរផ្នែកសិក្សា", "Admissions Live":"ការចុះឈ្មោះកំពុងបើក", "Email us":"អ៊ីមែលមកយើង", "Fast response under 24 academic hours":"ឆ្លើយតបក្នុងរយៈពេល ២៤ ម៉ោងសិក្សា",
  "Call directly":"ហៅទូរស័ព្ទដោយផ្ទាល់", "Toll-free student advisory helpline":"ខ្សែទូរស័ព្ទប្រឹក្សាសម្រាប់និស្សិត", "Global campus":"បរិវេណសិក្សា",
  "Connect Across Communities":"ភ្ជាប់ជាមួយសហគមន៍", "LinkedIn":"LinkedIn", "Twitter":"Twitter", "GitHub":"GitHub", "Facebook":"Facebook",
  "Campus map":"ផែនទីបរិវេណ", "Campus Learning":"ការសិក្សានៅបរិវេណ", "Phnom Penh Center":"មជ្ឈមណ្ឌលភ្នំពេញ", "Main Learning Campus":"បរិវេណសិក្សាសំខាន់",
  "Open for campus visits & workshops":"បើកសម្រាប់ទស្សនា និងសិក្ខាសាលា", "Get Route":"មើលផ្លូវ",
  "Send Us a Direct Message":"ផ្ញើសារមកយើងដោយផ្ទាល់", "Fill out the form below with your academic or enrollment inquiry and receive a detailed response.":"បំពេញទម្រង់ខាងក្រោមជាមួយសំណួរផ្នែកសិក្សា ឬការចុះឈ្មោះ ហើយយើងនឹងឆ្លើយតបលម្អិត។",
  "As registered or on ID":"ដូចក្នុងឯកសារចុះឈ្មោះ ឬអត្តសញ្ញាណប័ណ្ណ", "Will be used for follow-up":"ប្រើសម្រាប់ការទាក់ទងបន្ត", "Subject Category":"ប្រភេទប្រធានបទ", "Department routing":"ការបញ្ជូនទៅផ្នែកពាក់ព័ន្ធ",
  "Select an inquiry area...":"ជ្រើសរើសប្រធានបទ...", "Please choose an inquiry area.":"សូមជ្រើសរើសប្រធានបទ។", "Please enter your full name.":"សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។", "Please enter a valid email address.":"សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។", "Please add a short message.":"សូមបញ្ចូលសារខ្លីមួយ។",
  "/ 500 characters":"/ ៥០០ តួអក្សរ", "We respect your privacy. No promotional spam.":"យើងគោរពឯកជនភាពរបស់អ្នក។ គ្មានសារផ្សព្វផ្សាយរំខានទេ។",
  "Schedule a Virtual Consultation?":"ចង់កក់ការពិគ្រោះយោបល់តាមអនឡាញមែនទេ?", "Book a 1-on-1 session with our curriculum advisors online.":"កក់ពេលពិគ្រោះ ១ ទល់ ១ ជាមួយអ្នកប្រឹក្សាកម្មវិធីសិក្សាតាមអនឡាញ។", "Book Call":"កក់ពេលពិគ្រោះ",
  "Common Questions":"សំណួរទូទៅ", "Frequently Asked Questions":"សំណួរដែលសួរញឹកញាប់", "Quick answers to help you navigate registration and platform features immediately.":"ចម្លើយខ្លីៗដើម្បីជួយអ្នកប្រើការចុះឈ្មោះ និងមុខងារវេទិកាបានភ្លាមៗ។",
  "Once you enroll, your course materials appear instantly in your student dashboard under \"My Courses.\" You can stream video lessons, download readings, and track your progress from there at any time.":"បន្ទាប់ពីចុះឈ្មោះ មេរៀនរបស់អ្នកនឹងបង្ហាញភ្លាមៗក្នុង Dashboard នៅក្រោម \"វគ្គសិក្សារបស់ខ្ញុំ\"។ អ្នកអាចមើលវីដេអូ ទាញយកឯកសារ និងតាមដានវឌ្ឍនភាពបានគ្រប់ពេល។",
  "Yes. After you complete all required modules and assessments, a verified digital certificate is generated automatically and can be downloaded or shared directly from your profile.":"បាទ/ចាស។ បន្ទាប់ពីបញ្ចប់ម៉ូឌុល និងការវាយតម្លៃដែលត្រូវការ វិញ្ញាបនបត្រឌីជីថលដែលបានផ្ទៀងផ្ទាត់នឹងត្រូវបង្កើតដោយស្វ័យប្រវត្តិ ហើយអាចទាញយក ឬចែករំលែកពី Profile របស់អ្នក។",
  "JavaScript is off, so the course catalogue cannot be rendered. Turn it on, or":"JavaScript ត្រូវបានបិទ ដូច្នេះមិនអាចបង្ហាញបញ្ជីវគ្គសិក្សាបានទេ។ សូមបើក JavaScript ឬ",
  "contact the academic team":"ទាក់ទងក្រុមសិក្សា", "for the course list.":"សម្រាប់បញ្ជីវគ្គសិក្សា។",
  "Try a different keyword or category — or clear everything and browse all six programmes.":"សាកល្បងពាក្យគន្លឹះ ឬប្រភេទផ្សេងទៀត — ឬសម្អាតតម្រងទាំងអស់ ហើយមើលកម្មវិធីទាំង ៦។",
  "Accelerate Your Career":"ពន្លឿនអាជីពរបស់អ្នក", "Need help deciding which path to take?":"ត្រូវការជំនួយក្នុងការជ្រើសរើសផ្លូវសិក្សាមែនទេ?", "Talk to an academic advisor or take our 2-minute skill diagnostic to find the exact curriculum tailored to your career goals.":"ពិភាក្សាជាមួយអ្នកប្រឹក្សាសិក្សា ឬធ្វើតេស្តជំនាញរយៈពេល ២ នាទី ដើម្បីស្វែងរកកម្មវិធីសិក្សាដែលសមស្របនឹងគោលដៅអាជីពរបស់អ្នក។",
  "Book Free Consultation":"កក់ការពិគ្រោះយោបល់ឥតគិតថ្លៃ", "Explore All Categories":"មើលគ្រប់ប្រភេទ",
  "Empowering learners worldwide with accessible, high-quality, and flexible education.":"ផ្តល់អំណាចដល់អ្នកសិក្សាទូទាំងពិភពលោកតាមរយៈការអប់រំដែលមានគុណភាពខ្ពស់ បត់បែន និងងាយចូលដំណើរការ។",
  "About Us":"អំពីយើង", "All Courses":"វគ្គសិក្សាទាំងអស់", "Contact Details":"ព័ត៌មានទំនាក់ទំនង", "All rights reserved.":"រក្សាសិទ្ធិគ្រប់យ៉ាង។", "Privacy Policy":"គោលការណ៍ឯកជនភាព", "Terms of Service":"លក្ខខណ្ឌប្រើប្រាស់"
});

// Final page-wide copy coverage: contact, about, catalogue, forms, and utility text.
Object.assign(I18N, {
  "Direct Communication":"ការទំនាក់ទំនងដោយផ្ទាល់",
  "Get in Touch with":"ទាក់ទងមក",
  "Have questions about courses, enrollment, or university partnerships? Our academic team is here to assist you.":"មានសំណួរអំពីវគ្គសិក្សា ការចុះឈ្មោះ ឬភាពជាដៃគូសាកលវិទ្យាល័យមែនទេ? ក្រុមការងារសិក្សារបស់យើងរីករាយជួយអ្នក។",
  "Academic Inquiries":"សំណួរផ្នែកសិក្សា",
  "Admissions Live":"ការទទួលចុះឈ្មោះកំពុងដំណើរការ",
  "Email us":"ផ្ញើអ៊ីមែលមកយើង",
  "Fast response under 24 academic hours":"ឆ្លើយតបក្នុងរយៈពេលតិចជាង ២៤ ម៉ោងសិក្សា",
  "Call directly":"ទំនាក់ទំនងតាមទូរស័ព្ទ",
  "Toll-free student advisory helpline":"ខ្សែទូរស័ព្ទប្រឹក្សាសម្រាប់និស្សិត",
  "Global campus":"មជ្ឈមណ្ឌលសិក្សា",
  "Connect Across Communities":"ភ្ជាប់ទំនាក់ទំនងជាមួយសហគមន៍",
  "Campus Learning":"ការសិក្សានៅមជ្ឈមណ្ឌល",
  "Phnom Penh Center":"មជ្ឈមណ្ឌលភ្នំពេញ",
  "Main Learning Campus":"មជ្ឈមណ្ឌលសិក្សាសំខាន់",
  "Open for campus visits & workshops":"បើកសម្រាប់ទស្សនកិច្ច និងសិក្ខាសាលា",
  "Get Route":"មើលផ្លូវ",
  "Send Us a Direct Message":"ផ្ញើសារមកយើងដោយផ្ទាល់",
  "Fill out the form below with your academic or enrollment inquiry and receive a detailed response.":"សូមបំពេញទម្រង់ខាងក្រោមជាមួយសំណួរអំពីការសិក្សា ឬការចុះឈ្មោះ ហើយយើងនឹងផ្តល់ចម្លើយលម្អិត។",
  "Full Name":"ឈ្មោះពេញ",
  "As registered or on ID":"ដូចក្នុងឯកសារចុះឈ្មោះ ឬអត្តសញ្ញាណប័ណ្ណ",
  "e.g. Thyda Ang":"ឧ. Thyda Ang",
  "Email Address":"អាសយដ្ឋានអ៊ីមែល",
  "Will be used for follow-up":"ប្រើសម្រាប់ការទាក់ទងបន្ត",
  "Subject Category":"ប្រភេទប្រធានបទ",
  "Department routing":"ការបញ្ជូនទៅផ្នែកពាក់ព័ន្ធ",
  "Select an inquiry area...":"ជ្រើសរើសប្រធានបទសំណួរ...",
  "Course selection":"ការជ្រើសរើសវគ្គសិក្សា",
  "Enrollment & admissions":"ការចុះឈ្មោះ និងការចូលរៀន",
  "Academic transfer":"ការផ្ទេរការសិក្សា",
  "Technical support":"ជំនួយបច្ចេកទេស",
  "University partnership":"ភាពជាដៃគូសាកលវិទ្យាល័យ",
  "Other":"ផ្សេងៗ",
  "Message":"សារ",
  "Provide details about your course selection, academic transfer, or technical question...":"សូមផ្តល់ព័ត៌មានលម្អិតអំពីការជ្រើសរើសវគ្គសិក្សា ការផ្ទេរការសិក្សា ឬសំណួរបច្ចេកទេសរបស់អ្នក...",
  "We respect your privacy. No promotional spam.":"យើងគោរពភាពឯកជនរបស់អ្នក។ មិនមានសារផ្សព្វផ្សាយរំខានទេ។",
  "Schedule a Virtual Consultation?":"ចង់កក់ការពិគ្រោះតាមអនឡាញមែនទេ?",
  "Book a 1-on-1 session with our curriculum advisors online.":"កក់ពេលពិគ្រោះ ១ ទល់ ១ ជាមួយអ្នកប្រឹក្សាកម្មវិធីសិក្សារបស់យើងតាមអនឡាញ។",
  "Book Call":"កក់ពេលពិគ្រោះ",
  "Common Questions":"សំណួរដែលគេសួរញឹកញាប់",
  "Frequently Asked Questions":"សំណួរដែលគេសួរញឹកញាប់",
  "Quick answers to help you navigate registration and platform features immediately.":"ចម្លើយខ្លីៗជួយអ្នកប្រើការចុះឈ្មោះ និងមុខងាររបស់វេទិកាបានភ្លាមៗ។",
  "How do I access course materials after enrolling?":"តើខ្ញុំចូលមើលមាតិកាវគ្គសិក្សាបន្ទាប់ពីចុះឈ្មោះដោយរបៀបណា?",
  "Are certificates provided upon completion?":"តើមានវិញ្ញាបនបត្របន្ទាប់ពីបញ្ចប់វគ្គដែរឬទេ?",
  "Can I learn on mobile devices?":"តើខ្ញុំអាចរៀនតាមឧបករណ៍ចល័តបានទេ?",
  "Once you enroll, your course materials appear instantly in your student dashboard under \"My Courses.\" You can stream video lessons, download readings, and track your progress from there at any time.":"បន្ទាប់ពីចុះឈ្មោះ មាតិកាវគ្គសិក្សានឹងបង្ហាញភ្លាមៗក្នុងផ្ទាំងសិស្សក្រោម \"My Courses\"។ អ្នកអាចមើលវីដេអូ ទាញយកឯកសារ និងតាមដានវឌ្ឍនភាពបានគ្រប់ពេល។",
  "Yes. After you complete all required modules and assessments, a verified digital certificate is generated automatically and can be downloaded or shared directly from your profile.":"បាន។ បន្ទាប់ពីបញ្ចប់ម៉ូឌុល និងការវាយតម្លៃដែលត្រូវការ ប្រព័ន្ធនឹងបង្កើតវិញ្ញាបនបត្រឌីជីថលដែលបានផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ ហើយអ្នកអាចទាញយក ឬចែករំលែកពីប្រវត្តិរូបរបស់អ្នក។",
  "Absolutely. The platform is fully responsive, and there are dedicated iOS and Android apps so you can watch lessons, submit assignments, and track progress on the go.":"បានជាក់ជាមិនខាន។ វេទិកាឆ្លើយតបគ្រប់អេក្រង់ ហើយអ្នកអាចមើលមេរៀន បញ្ជូនកិច្ចការ និងតាមដានវឌ្ឍនភាពបានតាមឧបករណ៍ចល័ត។",
  "Our Story Vision":"ចក្ខុវិស័យ និងរឿងរ៉ាវរបស់យើង",
  "Empowering Curious Minds to":"ផ្តល់អំណាចដល់អ្នកដែលចង់ស្វែងយល់ ដើម្បី",
  "Build Tomorrow":"កសាងអនាគត",
  "Online Learning Platform (OLP) was founded with a single mission: bridging the gap between classroom theory and real-world technology skills through empathetic, accessible pedagogy.":"វេទិកាសិក្សាអនឡាញ (OLP) ត្រូវបានបង្កើតឡើងដោយមានបេសកកម្មមួយ គឺភ្ជាប់ចំណេះដឹងទ្រឹស្តីក្នុងថ្នាក់រៀនទៅនឹងជំនាញបច្ចេកវិទ្យាជាក់ស្តែង តាមរយៈការបង្រៀនដែលយកចិត្តទុកដាក់ និងងាយស្រួលចូលប្រើ។",
  "Explore Mission":"ស្វែងយល់ពីបេសកកម្ម",
  "Meet Instructors":"ជួបអ្នកបង្រៀន",
  "Educational Accessibility":"ការអប់រំដែលងាយស្រួលចូលប្រើ",
  "Bridging the chasm between abstract textbooks and modern tech stacks.":"ភ្ជាប់គម្លាតរវាងសៀវភៅទ្រឹស្តី និងបច្ចេកវិទ្យាទំនើប។",
  "Higher education often moves slowly, while software landscapes advance at lightning speed. Online Learning Platform (OLP) addresses this imbalance by delivering structured, lab-first curricula guided by practitioners directly building modern web software and cloud systems.":"ការអប់រំឧត្តមសិក្សាជាច្រើនផ្លាស់ប្តូរយឺត ខណៈពេលបច្ចេកវិទ្យាកម្មវិធីរីកចម្រើនលឿន។ OLP កាត់បន្ថយគម្លាតនេះដោយផ្តល់កម្មវិធីសិក្សាមានរចនាសម្ព័ន្ធ ផ្តោតលើការអនុវត្ត និងមានអ្នកជំនាញណែនាំ។",
  "Every course combines synchronous cohort accountability with self-paced exploratory modules, ensuring students not only absorb syntax, but synthesize architectural concepts, design patterns, and critical production trade-offs.":"វគ្គសិក្សានីមួយៗរួមបញ្ចូលការរៀនជាក្រុម និងម៉ូឌុលរៀនតាមល្បឿនផ្ទាល់ខ្លួន ដើម្បីឱ្យនិស្សិតយល់ទាំង Syntax, Architecture, Design Pattern និងការសម្រេចចិត្តសំខាន់ៗក្នុងការងារជាក់ស្តែង។",
  "ESTABLISHED":"បង្កើតឡើង",
  "GLOBAL INSTRUCTORS":"អ្នកបង្រៀនទូទាំងពិភពលោក",
  "COURSE COMPLETION":"ការបញ្ចប់វគ្គសិក្សា",
  "Phnom Penh Campus Online learning":"មជ្ឈមណ្ឌលភ្នំពេញ និងការសិក្សាអនឡាញ",
  "Mentorship That Sticks":"ការណែនាំដែលមានប្រសិទ្ធភាព",
  "Our code reviewers and mentors provide continuous async feedback alongside weekly live breakout workshops.":"អ្នកពិនិត្យកូដ និងអ្នកណែនាំរបស់យើងផ្តល់មតិយោបល់ជាបន្តបន្ទាប់ ព្រមជាមួយសិក្ខាសាលាផ្ទាល់ប្រចាំសប្តាហ៍។",
  "Student Satisfaction Rate":"អត្រាពេញចិត្តរបស់និស្សិត",
  "The Problem Breakthrough":"ការដោះស្រាយបញ្ហា",
  "Why We Created OLP":"ហេតុអ្វីយើងបង្កើត OLP",
  "Traditional degrees burden learners with high debt and static syllabi, while unstructured video repositories abandon students in isolation without feedback.":"ការសិក្សាបែបប្រពៃណីអាចមានថ្លៃចំណាយខ្ពស់ និងកម្មវិធីសិក្សាដែលមិនទាន់សម័យ ខណៈវីដេអូដែលគ្មានរចនាសម្ព័ន្ធអាចធ្វើឱ្យអ្នកសិក្សាខ្វះការណែនាំ និងមតិយោបល់។",
  "Flexible Schedules":"កាលវិភាគបត់បែនបាន",
  "Bite-sized, modular sprints engineered for full-time professionals and active degree-seeking students.":"មេរៀនខ្លីៗជាម៉ូឌុល សម្រាប់អ្នកធ្វើការពេញម៉ោង និងនិស្សិតដែលកំពុងសិក្សា។",
  "Project-Based Learning":"ការរៀនផ្អែកលើគម្រោង",
  "Graduate with genuine multi-repo portfolio artifacts instead of trivial fill-in-the-blank snippets.":"បញ្ចប់ការសិក្សាជាមួយ Portfolio និងគម្រោងពិតប្រាកដ ជំនួសឱ្យលំហាត់សាមញ្ញៗ។",
  "Student Community":"សហគមន៍និស្សិត",
  "Connect with study groups, join regional hackathons, and exchange code reviews inside active digital spaces.":"ភ្ជាប់ជាមួយក្រុមសិក្សា ចូលរួម Hackathon និងផ្លាស់ប្តូរមតិយោបល់លើកូដក្នុងសហគមន៍ឌីជីថល។",
  "Affordable Education":"ការអប់រំមានតម្លៃសមរម្យ",
  "Eliminating unnecessary institutional overhead to keep tuition transparent, fair, and accessible to everyone.":"កាត់បន្ថយចំណាយដែលមិនចាំបាច់ ដើម្បីរក្សាតម្លៃសិក្សាឱ្យច្បាស់លាស់ យុត្តិធម៌ និងងាយស្រួលសម្រាប់គ្រប់គ្នា។",
  "Zero hidden subscription lock-ins":"គ្មានការចំណាយលាក់កំបាំង",
  "Lifetime access to lesson updates":"ចូលប្រើបច្ចុប្បន្នភាពមេរៀនបានរយៈពេលវែង",
  "Direct instructor office hours":"ពេលពិគ្រោះផ្ទាល់ជាមួយអ្នកបង្រៀន",
  "Our Academic Guarantee":"ការធានាផ្នែកសិក្សារបស់យើង",
  "Engineered For Outcomes":"រចនាឡើងសម្រាប់លទ្ធផល",
  "Key Platform Benefits":"អត្ថប្រយោជន៍សំខាន់ៗរបស់វេទិកា",
  "Everything you need to master contemporary digital design, programming, and architecture.":"អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីស្ទាត់ជំនាញការរចនាឌីជីថល កម្មវិធី និងស្ថាបត្យកម្មទំនើប។",
  "Industry-Standard Curriculum":"កម្មវិធីសិក្សាតាមស្តង់ដារឧស្សាហកម្ម",
  "Content audited and updated quarterly with input from tech leads and design directors.":"មាតិកាត្រូវបានពិនិត្យ និងធ្វើបច្ចុប្បន្នភាពរៀងរាល់ត្រីមាស ដោយមានមតិយោបល់ពីអ្នកដឹកនាំបច្ចេកវិទ្យា និងអ្នកដឹកនាំការរចនា។",
  "Read syllabus":"អានកម្មវិធីសិក្សា",
  "Peer-to-Peer Community":"សហគមន៍សិក្សារវាងមិត្តភក្តិ",
  "Pair program, brainstorm, and review work in active regional guilds and special interest clubs.":"សរសេរកូដជាគូ បង្កើតគំនិត និងពិនិត្យការងារជាមួយសហគមន៍ និងក្លឹបចំណាប់អារម្មណ៍។",
  "Explore community":"ស្វែងរកសហគមន៍",
  "Interactive Coding & Labs":"ការសរសេរកូដ និងមន្ទីរពិសោធន៍អន្តរកម្ម",
  "In-browser playgrounds and containerized environments. No tedious setup needed to start coding.":"បរិយាកាសសរសេរកូដក្នុង Browser និង Container ដែលមិនត្រូវការការដំឡើងស្មុគស្មាញ។",
  "Try sandbox":"សាកល្បង Sandbox",
  "Verified Certificates":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់",
  "Tamper-proof verifiable credentials that link directly to demonstrated GitHub repos and project links.":"លិខិតបញ្ជាក់ឌីជីថលដែលអាចផ្ទៀងផ្ទាត់បាន និងភ្ជាប់ទៅ GitHub Repository និងគម្រោងរបស់អ្នក។",
  "Sample credential":"មើលគំរូវិញ្ញាបនបត្រ",
  "Ready to start building?":"ត្រៀមចាប់ផ្តើមបង្កើតហើយឬនៅ?",
  "Join hundreds of active learners accelerating their careers right now.":"ចូលរួមជាមួយអ្នកសិក្សាសកម្មរាប់រយនាក់ដែលកំពុងអភិវឌ្ឍអាជីពរបស់ពួកគេ។",
  "Talk with a Mentor":"ពិភាក្សាជាមួយអ្នកណែនាំ",
  "Curated Career Paths 2026":"ផ្លូវអាជីពដែលបានជ្រើសរើស ឆ្នាំ ២០២៦",
  "Explore Our Curated Courses":"ស្វែងរកវគ្គសិក្សាដែលបានជ្រើសរើស",
  "Discover industry-ready programs tailored for students, beginners, and tech enthusiasts.":"ស្វែងរកកម្មវិធីដែលត្រៀមសម្រាប់ការងារ និងសមស្របសម្រាប់និស្សិត អ្នកចាប់ផ្តើម និងអ្នកចូលចិត្តបច្ចេកវិទ្យា។",
  "Self-Paced & Live":"រៀនតាមល្បឿនផ្ទាល់ខ្លួន និងរៀនផ្ទាល់",
  "Verified Certs":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់",
  "Search courses":"ស្វែងរកវគ្គសិក្សា",
  "Sort by:":"តម្រៀបតាម៖",
  "courses":"វគ្គសិក្សា",
  "Course catalogue":"បញ្ជីវគ្គសិក្សា",
  "No courses match your filters":"មិនមានវគ្គសិក្សាត្រូវនឹងតម្រងរបស់អ្នកទេ",
  "Try a different keyword or category — or clear everything and browse all six programmes.":"សាកល្បងពាក្យគន្លឹះ ឬប្រភេទផ្សេងទៀត — ឬសម្អាតតម្រងទាំងអស់ដើម្បីមើលកម្មវិធីទាំង ៦។",
  "Clear filters":"សម្អាតតម្រង",
  "Accelerate Your Career":"អភិវឌ្ឍអាជីពរបស់អ្នក",
  "Need help deciding which path to take?":"ត្រូវការជំនួយក្នុងការជ្រើសរើសផ្លូវសិក្សាមែនទេ?",
  "Talk to an academic advisor or take our 2-minute skill diagnostic to find the exact curriculum tailored to your career goals.":"ពិភាក្សាជាមួយអ្នកប្រឹក្សាផ្នែកសិក្សា ឬធ្វើតេស្តជំនាញរយៈពេល ២ នាទី ដើម្បីស្វែងរកកម្មវិធីសិក្សាដែលសមនឹងគោលដៅអាជីពរបស់អ្នក។",
  "Book Free Consultation":"កក់ការពិគ្រោះដោយឥតគិតថ្លៃ",
  "Explore All Categories":"ស្វែងរកគ្រប់ប្រភេទ",
  "Learning today. Unlock unlimited possibilities with dedicated mentors.":"រៀននៅថ្ងៃនេះ ដើម្បីបើកឱកាសថ្មីៗជាមួយអ្នកណែនាំដែលយកចិត្តទុកដាក់។",
  "Quick Links":"តំណភ្ជាប់រហ័ស",
  "Contact Details":"ព័ត៌មានទំនាក់ទំនង",
  "Privacy Policy":"គោលការណ៍ឯកជនភាព",
  "Terms of Service":"លក្ខខណ្ឌប្រើប្រាស់",
  "Privacy":"ឯកជនភាព",
  "Terms":"លក្ខខណ្ឌ",
  "Skip to the contact form":"រំលងទៅទម្រង់ទំនាក់ទំនង",
  "Skip to the course catalogue":"រំលងទៅបញ្ជីវគ្គសិក្សា"
});

/* ── complete bilingual coverage for every static page string ───── */
Object.assign(I18N, {
  "Home · Online Learning Platform":"ទំព័រដើម · វេទិកាសិក្សាអនឡាញ",
  "Most Popular":"ពេញនិយមបំផុត",
  "Top Rated":"វាយតម្លៃខ្ពស់",
  "Newest":"ថ្មីបំផុត",
  "Shortest First":"រយៈពេលខ្លីមុន",
  "Title A–Z":"ចំណងជើង A–Z",
  "students":"និស្សិត",
  "hours":"ម៉ោង",
  "ratings":"ការវាយតម្លៃ",
  "of":"នៃ",
  "lessons":"មេរៀន",
  "Hours total":"ម៉ោងសរុប",
  "On-demand + weekly live lab":"រៀនតាមតម្រូវការ + មន្ទីរពិសោធន៍ផ្ទាល់ប្រចាំសប្តាហ៍",
  "About · Online Learning Platform":"អំពីយើង · វេទិកាសិក្សាអនឡាញ",
  "Courses · Online Learning Platform":"វគ្គសិក្សា · វេទិកាសិក្សាអនឡាញ",
  "Skip to content":"រំលងទៅមាតិកា",
  "Skip to the contact form":"រំលងទៅទម្រង់ទំនាក់ទំនង",
  "Skip to the course catalogue":"រំលងទៅបញ្ជីវគ្គសិក្សា",
  "Explore Courses →":"ស្វែងរកវគ្គសិក្សា →",
  "Validated learner reviews worldwide":"ការវាយតម្លៃពីអ្នកសិក្សាទូទាំងពិភពលោកដែលបានផ្ទៀងផ្ទាត់",
  "SESSION 3 OF 16":"វគ្គទី ៣ នៃ ១៦",
  "Lesson 3: Using Tailwind with color & font-size":"មេរៀនទី ៣៖ ការប្រើ Tailwind ជាមួយពណ៌ និងទំហំអក្សរ",
  "Every major assignment receives individual code or portfolio commentary directly from vetted industry seniors working at top tech consultancies.":"កិច្ចការសំខាន់ៗនីមួយៗទទួលបានមតិយោបល់លើកូដ ឬ Portfolio ដោយផ្ទាល់ពីអ្នកជំនាញឧស្សាហកម្មដែលមានបទពិសោធន៍នៅក្រុមហ៊ុនបច្ចេកវិទ្យា។",
  "We removed rigid schedules, expensive textbook fees, and gatekeeping so you can concentrate purely on progress.":"យើងបានលុបចោលកាលវិភាគរឹងមាំ ថ្លៃសៀវភៅខ្ពស់ និងឧបសគ្គមិនចាំបាច់ ដើម្បីឱ្យអ្នកផ្តោតលើការរីកចម្រើនរបស់អ្នក។",
  "Cloud-based access on desktop, tablet, and mobile anytime. Your study state and code sandboxes are always in sync.":"អាចចូលរៀនតាម Cloud នៅលើកុំព្យូទ័រ Tablet និងទូរស័ព្ទគ្រប់ពេល។ ស្ថានភាពសិក្សា និងបរិយាកាសសរសេរកូដរបស់អ្នកត្រូវបានធ្វើសមកាលកម្មជានិច្ច។",
  "Lifetime access to bite-sized lessons, quizzes, and project repositories. Never stress about arbitrary assignment deadlines.":"ចូលប្រើមេរៀនខ្លីៗ Quiz និង Repository គម្រោងបានរយៈពេលវែង។ មិនចាំបាច់បារម្ភពីកាលកំណត់កិច្ចការដែលមិនចាំបាច់។",
  "Real-world projects designed for portfolio building. Showcase verifiable GitHub repos and live Figma prototypes to recruiters.":"គម្រោងជាក់ស្តែងសម្រាប់បង្កើត Portfolio។ បង្ហាញ GitHub Repository ដែលអាចផ្ទៀងផ្ទាត់បាន និង Figma Prototype ដល់អ្នកជ្រើសរើសបុគ្គលិក។",
  "Student-friendly pricing, flexible zero-interest split options, scholarships, and free starter foundational tracks.":"តម្លៃសមស្របសម្រាប់និស្សិត មានជម្រើសបង់រំលស់ដោយគ្មានការប្រាក់ អាហារូបករណ៍ និងវគ្គមូលដ្ឋានឥតគិតថ្លៃសម្រាប់អ្នកចាប់ផ្តើម។",
  "Join thousands of students building their dream careers with":"ចូលរួមជាមួយនិស្សិតរាប់ពាន់នាក់ដែលកំពុងកសាងអាជីពក្នុងក្តីស្រមៃរបស់ពួកគេជាមួយ",
  "Learning today. Unlock unlimited possibilities with dedicated mentors.":"រៀនថ្ងៃនេះ ដើម្បីបើកឱកាសគ្មានដែនកំណត់ជាមួយអ្នកណែនាំដែលយកចិត្តទុកដាក់។",
  "OLP":"OLP",
  "Empowering learners worldwide with accessible, high-quality, and flexible education.":"ផ្តល់អំណាចដល់អ្នកសិក្សាទូទាំងពិភពលោក តាមរយៈការអប់រំដែលមានគុណភាពខ្ពស់ បត់បែនបាន និងងាយស្រួលចូលប្រើ។",
  "learner@university.edu":"learner@university.edu",
  "Online Learning Platform. All rights reserved.":"វេទិកាសិក្សាអនឡាញ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។",
  "Online Learning Platform (OLP) was founded with a single mission: bridging the gap between classroom theory and real-world technology skills through empathetic, accessible pedagogy.":"វេទិកាសិក្សាអនឡាញ (OLP) ត្រូវបានបង្កើតឡើងដោយមានបេសកកម្មមួយ គឺភ្ជាប់ទ្រឹស្តីក្នុងថ្នាក់រៀនទៅនឹងជំនាញបច្ចេកវិទ្យាជាក់ស្តែង តាមរយៈការបង្រៀនដែលយកចិត្តទុកដាក់ និងងាយស្រួលចូលប្រើ។",
  "Bridging the chasm between abstract textbooks and modern tech stacks.":"ភ្ជាប់គម្លាតរវាងសៀវភៅទ្រឹស្តី និងបច្ចេកវិទ្យាទំនើប។",
  "Higher education often moves slowly, while software landscapes advance at lightning speed. Online Learning Platform (OLP) addresses this imbalance by delivering structured, lab-first curricula guided by practitioners directly building modern web software and cloud systems.":"ការអប់រំឧត្តមសិក្សាជាច្រើនផ្លាស់ប្តូរយឺត ខណៈបច្ចេកវិទ្យាកម្មវិធីរីកចម្រើនយ៉ាងលឿន។ OLP កាត់បន្ថយគម្លាតនេះដោយផ្តល់កម្មវិធីសិក្សាមានរចនាសម្ព័ន្ធ ផ្តោតលើការអនុវត្ត និងមានអ្នកជំនាញដែលកំពុងបង្កើតកម្មវិធី Web និងប្រព័ន្ធ Cloud ទំនើបជាអ្នកណែនាំ។",
  "Every course combines synchronous cohort accountability with self-paced exploratory modules, ensuring students not only absorb syntax, but synthesize architectural concepts, design patterns, and critical production trade-offs.":"វគ្គសិក្សានីមួយៗរួមបញ្ចូលការរៀនជាក្រុម និងម៉ូឌុលរៀនតាមល្បឿនផ្ទាល់ខ្លួន ដើម្បីឱ្យនិស្សិតយល់ទាំង Syntax, Architecture, Design Pattern និងការសម្រេចចិត្តសំខាន់ៗក្នុងការងារជាក់ស្តែង។",
  "Phnom Penh Campus Online learning":"មជ្ឈមណ្ឌលភ្នំពេញ និងការសិក្សាអនឡាញ",
  "Our code reviewers and mentors provide continuous async feedback alongside weekly live breakout workshops.":"អ្នកពិនិត្យកូដ និងអ្នកណែនាំរបស់យើងផ្តល់មតិយោបល់ជាបន្តបន្ទាប់ ព្រមជាមួយសិក្ខាសាលាផ្ទាល់ប្រចាំសប្តាហ៍។",
  "Traditional degrees burden learners with high debt and static syllabi, while unstructured video repositories abandon students in isolation without feedback.":"ការសិក្សាបែបប្រពៃណីអាចមានចំណាយខ្ពស់ និងកម្មវិធីសិក្សាដែលមិនទាន់សម័យ ខណៈវីដេអូដែលគ្មានរចនាសម្ព័ន្ធអាចធ្វើឱ្យអ្នកសិក្សាខ្វះការណែនាំ និងមតិយោបល់។",
  "Bite-sized, modular sprints engineered for full-time professionals and active degree-seeking students.":"មេរៀនខ្លីៗជាម៉ូឌុល សម្រាប់អ្នកធ្វើការពេញម៉ោង និងនិស្សិតដែលកំពុងសិក្សា។",
  "Graduate with genuine multi-repo portfolio artifacts instead of trivial fill-in-the-blank snippets.":"បញ្ចប់ការសិក្សាជាមួយ Portfolio និងគម្រោងពិតប្រាកដ ជំនួសឱ្យលំហាត់សាមញ្ញៗ។",
  "Connect with study groups, join regional hackathons, and exchange code reviews inside active digital spaces.":"ភ្ជាប់ជាមួយក្រុមសិក្សា ចូលរួម Hackathon និងផ្លាស់ប្តូរមតិយោបល់លើកូដក្នុងសហគមន៍ឌីជីថល។",
  "Eliminating unnecessary institutional overhead to keep tuition transparent, fair, and accessible to everyone.":"កាត់បន្ថយចំណាយដែលមិនចាំបាច់ ដើម្បីរក្សាតម្លៃសិក្សាឱ្យច្បាស់លាស់ យុត្តិធម៌ និងងាយស្រួលសម្រាប់គ្រប់គ្នា។",
  "Zero hidden subscription lock-ins":"គ្មានការចំណាយ ឬការចុះឈ្មោះលាក់កំបាំង",
  "Lifetime access to lesson updates":"ចូលប្រើបច្ចុប្បន្នភាពមេរៀនបានរយៈពេលវែង",
  "Direct instructor office hours":"ពេលពិគ្រោះផ្ទាល់ជាមួយអ្នកបង្រៀន",
  "We don't teach to test. We prepare students to deploy real value on day one.":"យើងមិនបង្រៀនដើម្បីប្រឡងទេ។ យើងរៀបចំនិស្សិតឱ្យអាចបង្កើតតម្លៃជាក់ស្តែងបានចាប់ពីថ្ងៃដំបូង។",
  "Everything you need to master contemporary digital design, programming, and architecture.":"អ្វីគ្រប់យ៉ាងដែលអ្នកត្រូវការដើម្បីស្ទាត់ជំនាញការរចនាឌីជីថល កម្មវិធី និងស្ថាបត្យកម្មទំនើប។",
  "Content audited and updated quarterly with input from tech leads and design directors.":"មាតិកាត្រូវបានពិនិត្យ និងធ្វើបច្ចុប្បន្នភាពរៀងរាល់ត្រីមាស ដោយមានមតិយោបល់ពីអ្នកដឹកនាំបច្ចេកវិទ្យា និងការរចនា។",
  "Pair program, brainstorm, and review work in active regional guilds and special interest clubs.":"សរសេរកូដជាគូ បង្កើតគំនិត និងពិនិត្យការងារជាមួយសហគមន៍ និងក្លឹបចំណាប់អារម្មណ៍។",
  "In-browser playgrounds and containerized environments. No tedious setup needed to start coding.":"បរិយាកាសសរសេរកូដក្នុង Browser និង Container ដែលមិនត្រូវការការដំឡើងស្មុគស្មាញ។",
  "Tamper-proof verifiable credentials that link directly to demonstrated GitHub repos and project links.":"លិខិតបញ្ជាក់ឌីជីថលដែលអាចផ្ទៀងផ្ទាត់បាន និងភ្ជាប់ទៅ GitHub Repository និងគម្រោងរបស់អ្នក។",
  "Join hundreds of active learners accelerating their careers right now.":"ចូលរួមជាមួយអ្នកសិក្សាសកម្មរាប់រយនាក់ដែលកំពុងអភិវឌ្ឍអាជីពរបស់ពួកគេ។",
  "Browse All Courses":"មើលវគ្គសិក្សាទាំងអស់",
  "Courses · Online Learning Platform":"វគ្គសិក្សា · វេទិកាសិក្សាអនឡាញ",
  "6 of 6":"៦ នៃ ៦",
  "Try a different keyword or category — or clear everything and browse all six programmes.":"សាកល្បងពាក្យគន្លឹះ ឬប្រភេទផ្សេងទៀត — ឬសម្អាតតម្រងទាំងអស់ដើម្បីមើលកម្មវិធីទាំង ៦។",
  "Talk to an academic advisor or take our 2-minute skill diagnostic to find the exact curriculum tailored to your career goals.":"ពិភាក្សាជាមួយអ្នកប្រឹក្សាផ្នែកសិក្សា ឬធ្វើតេស្តជំនាញរយៈពេល ២ នាទី ដើម្បីស្វែងរកកម្មវិធីសិក្សាដែលសមនឹងគោលដៅអាជីពរបស់អ្នក។",
  "onlinelearning":"វេទិកាសិក្សាអនឡាញ",
  "learning@university.edu":"learning@university.edu",
  "BP 511, Phum Tropeang Chhuk (Borey Sorla) Sangtak, Street 371, ភ្នំពេញ":"BP 511, ភូមិត្រពាំងឈូក (បុរីសិរឡា) សង្កាត់ស្ទឹងមានជ័យ ផ្លូវ ៣៧១ ភ្នំពេញ",
  "LinkedIn":"LinkedIn","Twitter":"Twitter","GitHub":"GitHub","Facebook":"Facebook",
  "Phnom Penh Center":"មជ្ឈមណ្ឌលភ្នំពេញ",
  "Please enter your full name.":"សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក។",
  "Please enter a valid email address.":"សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។",
  "Please choose an inquiry area.":"សូមជ្រើសរើសប្រធានបទសំណួរ។",
  "Please add a short message.":"សូមបញ្ចូលសារខ្លីមួយ។",
  "Book a 1-on-1 session with our curriculum advisors online.":"កក់ពេលពិគ្រោះ ១ ទល់ ១ ជាមួយអ្នកប្រឹក្សាកម្មវិធីសិក្សារបស់យើងតាមអនឡាញ។",
  "Once you enroll, your course materials appear instantly in your student dashboard under \"My Courses.\" You can stream video lessons, download readings, and track your progress from there at any time.":"បន្ទាប់ពីចុះឈ្មោះ មាតិកាវគ្គសិក្សានឹងបង្ហាញភ្លាមៗក្នុងផ្ទាំងសិស្សក្រោម \"My Courses\"។ អ្នកអាចមើលវីដេអូ ទាញយកឯកសារ និងតាមដានវឌ្ឍនភាពបានគ្រប់ពេល។",
  "Yes. After you complete all required modules and assessments, a verified digital certificate is generated automatically and can be downloaded or shared directly from your profile.":"បាន។ បន្ទាប់ពីបញ្ចប់ម៉ូឌុល និងការវាយតម្លៃដែលត្រូវការ ប្រព័ន្ធនឹងបង្កើតវិញ្ញាបនបត្រឌីជីថលដែលបានផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិ ហើយអ្នកអាចទាញយក ឬចែករំលែកពីប្រវត្តិរូបរបស់អ្នក។",
  "e.g. Thyda Ang":"ឧ. ធីដា អាង",
  "We don't teach to test. We prepare students to deploy real value on day one.":"យើងមិនបង្រៀនដើម្បីប្រឡងទេ។ យើងរៀបចំនិស្សិតឱ្យអាចយកជំនាញទៅអនុវត្ត និងបង្កើតតម្លៃពិតប្រាកដចាប់ពីថ្ងៃដំបូង។",
  "Our Academic Guarantee":"ការធានាផ្នែកសិក្សារបស់យើង",
  "Key Platform Benefits":"អត្ថប្រយោជន៍សំខាន់ៗរបស់វេទិកា",
  "Engineered For Outcomes":"រចនាឡើងសម្រាប់លទ្ធផលជាក់ស្តែង",
  "Curated Career Paths 2026":"ផ្លូវអាជីពដែលបានជ្រើសរើស ឆ្នាំ ២០២៦",
  "Explore Our Curated Courses":"ស្វែងរកវគ្គសិក្សាដែលបានជ្រើសរើស",
  "Discover industry-ready programs tailored for students, beginners, and tech enthusiasts.":"ស្វែងរកកម្មវិធីសិក្សាដែលត្រៀមសម្រាប់ឧស្សាហកម្ម និងសមស្របសម្រាប់និស្សិត អ្នកចាប់ផ្តើម និងអ្នកចូលចិត្តបច្ចេកវិទ្យា។",
  "Self-Paced & Live":"រៀនតាមល្បឿនផ្ទាល់ខ្លួន និង Live",
  "Verified Certs":"វិញ្ញាបនបត្រដែលបានផ្ទៀងផ្ទាត់",
  "Search courses by title, skill, or keyword...":"ស្វែងរកវគ្គសិក្សាតាមចំណងជើង ជំនាញ ឬពាក្យគន្លឹះ...",
  "Search courses":"ស្វែងរកវគ្គសិក្សា",
  "Sort by:":"តម្រៀបតាម៖",
  "Showing":"កំពុងបង្ហាញ",
  "Clear search":"សម្អាតការស្វែងរក",
  "Filter by category":"ត្រងតាមប្រភេទ",
  "Course filters":"តម្រងវគ្គសិក្សា",
  "Preview":"មើលជាមុន",
  "Enrolled":"បានចុះឈ្មោះ",
  "Start Learning":"ចាប់ផ្តើមរៀន",
  "Watch preview":"មើលជាមុន",
  "Certificate":"វិញ្ញាបនបត្រ",
  "What you'll learn":"អ្វីដែលអ្នកនឹងរៀន",
  "Instructor":"អ្នកបង្រៀន",
  "Level":"កម្រិត",
  "Duration":"រយៈពេល",
  "Curriculum":"កម្មវិធីសិក្សា",
  "No prerequisites beyond curiosity":"មិនត្រូវការចំណេះដឹងមុនទេ ក្រៅពីការចង់រៀន",
  "On-demand + weekly live lab":"រៀនតាមតម្រូវការ + មន្ទីរពិសោធន៍ផ្ទាល់ប្រចាំសប្តាហ៍",
  "Ready when you are":"រួចរាល់នៅពេលអ្នករួចរាល់",
  "You're on the roster":"អ្នកបានចុះឈ្មោះក្នុងបញ្ជី",
  "Saved to your courses on this device.":"បានរក្សាទុកក្នុងវគ្គសិក្សារបស់អ្នកលើឧបករណ៍នេះ។",
  "Free for enrolled OLP students.":"ឥតគិតថ្លៃសម្រាប់និស្សិត OLP ដែលបានចុះឈ្មោះ។",
  "Remove from my courses":"ដកចេញពីវគ្គសិក្សារបស់ខ្ញុំ",
  "Enrol now":"ចុះឈ្មោះឥឡូវនេះ",
  "Sound on":"បើកសំឡេង",
  "Muted — tap for sound":"បិទសំឡេង — ចុចដើម្បីបើក",
  "No courses match your filters":"មិនមានវគ្គសិក្សាដែលត្រូវនឹងតម្រងរបស់អ្នក",
  "My courses":"វគ្គសិក្សារបស់ខ្ញុំ",
  "All Courses":"វគ្គសិក្សាទាំងអស់",
  "Home · Online Learning Platform":"ទំព័រដើម · វេទិកាសិក្សាអនឡាញ",
  "Most Popular":"ពេញនិយមបំផុត",
  "Top Rated":"វាយតម្លៃខ្ពស់",
  "Newest":"ថ្មីបំផុត",
  "Shortest First":"រយៈពេលខ្លីមុន",
  "Title A–Z":"ចំណងជើង A–Z",
  "students":"និស្សិត",
  "hours":"ម៉ោង",
  "ratings":"ការវាយតម្លៃ",
  "of":"នៃ",
  "lessons":"មេរៀន",
  "Hours total":"ម៉ោងសរុប",
  "On-demand + weekly live lab":"រៀនតាមតម្រូវការ + មន្ទីរពិសោធន៍ផ្ទាល់ប្រចាំសប្តាហ៍"
});

const reverseI18n = Object.fromEntries(Object.entries(I18N).map(([en, km]) => [km, en]));
const textOriginals = new WeakMap();
const LANGUAGE_KEY = 'olp-language-v3';
const THEME_KEY = 'olp-theme-v4';
let currentLang = localStorage.getItem(LANGUAGE_KEY) || 'en';
const normalizeCopy = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

function translateDynamicPattern(text) {
  const normalized = normalizeCopy(text);
  if (currentLang !== 'km') return text;
  const quoteKey = normalized.replace(/[“”]/g, '"');
  if (quoteKey === "\"We don't teach to test. We prepare students to deploy real value on day one.\"") {
    return '"យើងមិនបង្រៀនដើម្បីប្រឡងទេ។ យើងរៀបចំនិស្សិតឱ្យអាចយកជំនាញទៅអនុវត្ត និងបង្កើតតម្លៃពិតប្រាកដចាប់ពីថ្ងៃដំបូង។"';
  }
  if (/^\d+ Weeks$/.test(normalized)) return normalized.replace(' Weeks', ' សប្តាហ៍');
  if (/^\d+ Hours total$/.test(normalized)) return normalized.replace(' Hours total', ' ម៉ោងសរុប');
  const showing = normalized.match(/^Showing (\d+) of (\d+) courses$/);
  if (showing) return `កំពុងបង្ហាញ ${showing[1]} នៃ ${showing[2]} វគ្គសិក្សា`;
  const count = normalized.match(/^(\d+) of (\d+)$/);
  if (count) return `${count[1]} នៃ ${count[2]}`;
  const enrolled = normalized.match(/^Enrolled in “(.+)”\. It is saved under My courses\.$/);
  if (enrolled) return `បានចុះឈ្មោះក្នុង “${enrolled[1]}”។ បានរក្សាទុកក្នុងវគ្គសិក្សារបស់ខ្ញុំ។`;
  const removed = normalized.match(/^Removed “(.+)” from My courses\.$/);
  if (removed) return `បានដក “${removed[1]}” ចេញពីវគ្គសិក្សារបស់ខ្ញុំ។`;
  return I18N[normalized] || text;
}

function translateNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const raw = node.nodeValue || '';
    const trimmed = raw.trim();
    if (!trimmed) return;

    const normalized = normalizeCopy(trimmed);
    // Always resolve the text back to its English source first. This makes
    // repeated language switches reliable even after dynamic DOM updates.
    const stored = textOriginals.get(node);
    const english = I18N[normalized] ? normalized : (reverseI18n[normalized] || stored || normalized);
    textOriginals.set(node, english);

    const translated = currentLang === 'km' ? translateDynamicPattern(english) : english;
    const start = raw.search(/\S/);
    const end = raw.search(/\s*$/);
    node.nodeValue = `${raw.slice(0, start)}${translated}${raw.slice(end)}`;
    return;
  }
  if (node.nodeType === Node.ELEMENT_NODE && ['SCRIPT','STYLE','NOSCRIPT'].includes(node.tagName)) return;
  node.childNodes?.forEach(translateNode);
}

function translateAttributes(root = document) {
  const attrs = ['placeholder', 'aria-label', 'title', 'alt'];
  const elements = root.nodeType === Node.ELEMENT_NODE ? [root, ...root.querySelectorAll('*')] : Array.from(root.querySelectorAll?.('*') || []);
  elements.forEach((el) => {
    attrs.forEach((attr) => {
      if (!el.hasAttribute(attr)) return;
      const originalKey = `data-olp-${attr}-en`;
      if (!el.hasAttribute(originalKey)) el.setAttribute(originalKey, el.getAttribute(attr));
      const original = el.getAttribute(originalKey) || '';
      const normalized = normalizeCopy(original);
      let translated = currentLang === 'km' ? translateDynamicPattern(normalized) : original;
      if (attr === 'alt' && / course artwork$/.test(translated) && currentLang === 'km') translated = translated.replace(/ course artwork$/, ' រូបភាពវគ្គសិក្សា');
      el.setAttribute(attr, translated);
    });
  });
}

function applyAcademicQuoteLanguage() {
  document.querySelectorAll('.olp-academic-quote').forEach((el) => {
    const english = '"We don\'t teach to test. We prepare students to deploy real value on day one."';
    el.textContent = currentLang === 'km'
      ? '"យើងមិនបង្រៀនដើម្បីប្រឡងទេ។ យើងរៀបចំនិស្សិតឱ្យអាចយកជំនាញទៅអនុវត្ត និងបង្កើតតម្លៃពិតប្រាកដចាប់ពីថ្ងៃដំបូង។"'
      : english;
  });
}

function applyLanguage() {
  document.documentElement.lang = currentLang === 'km' ? 'km' : 'en';
  document.documentElement.classList.toggle('lang-km', currentLang === 'km');
  const pageTitle = document.title.replace(/\s*[·|—-].*$/, '').trim();
  document.title = currentLang === 'km' ? (I18N[pageTitle] || 'វេទិកាសិក្សាអនឡាញ') : (pageTitle || 'Online Learning Platform');
  translateNode(document.body);
  translateAttributes(document.body);
  applyAcademicQuoteLanguage();
  $$('[data-language-current]').forEach(el => { el.textContent = currentLang === 'km' ? 'ខ្មែរ' : 'English'; });
  $$('[data-language-flag]').forEach(el => { el.src = currentLang === 'km' ? '/flags/khmer.svg' : '/flags/english.svg'; });
  $$('[data-set-lang]').forEach(el => { el.setAttribute('aria-selected', String(el.dataset.setLang === currentLang)); });
  $$('[data-language-check]').forEach(el => { el.hidden = el.dataset.check !== currentLang; });
  localStorage.setItem(LANGUAGE_KEY, currentLang);
  window.dispatchEvent(new CustomEvent('olp:languagechange', { detail: { lang: currentLang } }));
}

function t(text) {
  return currentLang === 'km' ? (I18N[text] || text) : text;
}

function installPreferences() {
  const nav = $('header nav');
  if (!nav || nav.querySelector('[data-olp-preferences]')) return;
  const wrap = document.createElement('div');
  wrap.dataset.olpPreferences = 'true';
  wrap.className = 'olp-preferences';
  wrap.innerHTML = `
    <div class="olp-language-dropdown" data-language-dropdown>
      <button type="button" class="olp-language-trigger" data-language-trigger aria-haspopup="listbox" aria-expanded="false" aria-label="Choose language">
        <img data-language-flag src="/flags/english.svg" alt="" class="olp-language-flag">
        <span data-language-current>English</span>
        <svg class="olp-language-chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="olp-language-menu" data-language-menu role="listbox" aria-label="Choose language">
        <button type="button" class="olp-language-item" data-set-lang="en" role="option">
          <img src="/flags/english.svg" alt="" class="olp-language-flag"><span>English</span><span class="olp-language-check" data-check="en">✓</span>
        </button>
        <button type="button" class="olp-language-item" data-set-lang="km" role="option">
          <img src="/flags/khmer.svg" alt="" class="olp-language-flag"><span>ខ្មែរ</span><span class="olp-language-check" data-check="km">✓</span>
        </button>
      </div>
    </div>
    <button type="button" class="olp-pref-btn olp-theme-btn" data-theme-toggle aria-label="Switch to dark mode" title="Switch to dark mode">
      <span class="olp-theme-icon" aria-hidden="true"><span class="olp-sun">${icon('sun', 'h-4 w-4')}</span><span class="olp-moon">${icon('moon', 'h-4 w-4')}</span></span>
    </button>`;
  const actions = nav.querySelector('div:last-child');
  actions?.prepend(wrap);

  const dropdown = wrap.querySelector('[data-language-dropdown]');
  const trigger = wrap.querySelector('[data-language-trigger]');
  const menuEl = wrap.querySelector('[data-language-menu]');
  const closeDropdown = () => {
    dropdown?.classList.remove('is-open');
    trigger?.setAttribute('aria-expanded', 'false');
  };
  trigger?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = dropdown.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(open));
  });
  menuEl?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-set-lang]');
    if (!btn) return;
    currentLang = btn.dataset.setLang === 'km' ? 'km' : 'en';
    applyLanguage();
    closeDropdown();
  });
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) closeDropdown();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDropdown();
  });
  wrap.querySelector('[data-theme-toggle]')?.addEventListener('click', () => {
    const dark = document.body.classList.toggle('theme-dark');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    updateThemeButton();
  });
}

function updateThemeButton() {
  const dark = document.body.classList.contains('theme-dark');
  $$('[data-theme-toggle]').forEach(btn => {
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = dark ? 'Light mode' : 'Dark mode';
  });
}

function initPreferences() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  if (savedTheme === 'dark') document.body.classList.add('theme-dark');
  installPreferences();
  updateThemeButton();
  applyLanguage();
  const observer = new MutationObserver((mutations) => {
    if (currentLang !== 'km') return;
    for (const mutation of mutations) {
      mutation.addedNodes?.forEach(node => { translateNode(node); if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(node); });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ── footer year ─────────────────────────────────────────────────── */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

onReady(initPreferences);

/* ── shared API for the page modules ─────────────────────────────── */
window.OLP = Object.freeze({ $, $$, esc, icon, toast, lockScroll, initReveal, onReady, t, get lang() { return currentLang; } });

/* ── page modules (kept out of the shared bundle) ────────────────── */
const page = document.body?.dataset.page;
/* courses.js renders the cards on the catalogue page and the featured strip
   on the home page (any element with [data-course-grid]) */
if (page === 'courses' || page === 'home') import('./components/js/courses.js');
if (page === 'contact') import('./components/js/contact.js');

