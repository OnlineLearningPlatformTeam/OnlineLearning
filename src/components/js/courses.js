/* ═══════════════════════════════════════════════════════════════════
   OLP · courses.js — the course catalogue
   Imported by main.js only on pages whose <body data-page="courses">.
   Renders the 6 course cards from one data source, then wires:
     · live search + clear            (title, skill, level, instructor)
     · category chips + "My courses"  (counts, active state)
     · sort select                    (popular / top rated / newest / duration / A–Z)
     · result counter + empty state
     · course details modal           (deep link: #course/<id>)
     · enrolment                      (persisted in localStorage)
     · video previews                 (silent clip on hover, full player in the modal)
   Needs window.OLP (main.js) to be loaded first.
   ═══════════════════════════════════════════════════════════════════ */
import imgCard1 from '../../assets/img-card1.png';
import imgCard2 from '../../assets/img-card2.png';
import imgCard3 from '../../assets/img-card3.png';
import imgCard4 from '../../assets/img-card4.png';
import imgCard5 from '../../assets/img-card5.png';
import imgCard6 from '../../assets/img-card6.png';
import clip1 from '../../assets/media/preview-card1.mp4';
import clip2 from '../../assets/media/preview-card2.mp4';
import clip3 from '../../assets/media/preview-card3.mp4';
import clip4 from '../../assets/media/preview-card4.mp4';
import clip5 from '../../assets/media/preview-card5.mp4';
import clip6 from '../../assets/media/preview-card6.mp4';
/* optional full course video (the modal player prefers it; the cards always use
   the short `clip`). Add src/assets/media/trailer-cardN.mp4 to use one.        */
import trailer1 from '../../assets/media/preview-card1.mp4';

(() => {
  'use strict';

  const OLP = window.OLP;
  if (!OLP) return;
  const { $, $$, esc, icon, toast, lockScroll, initReveal } = OLP;

  /* `clip`  = short silent loop the card plays on hover (always small)
     `video` = the full course video the modal player uses when it exists     */
  const REDUCED_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  /* ── data ─────────────────────────────────────────────────────────
     One source of truth. `instructor` names are sample content —
     swap them for the real teaching team before publishing.        */
  const COURSES = [
    {
      id: 'webdev', img: imgCard1, clip: clip1, video: trailer1,
      title: 'Web Development Bootcamp',
      category: 'Web Development',
      level: 'Beginner to Intermediate',
      weeks: 12, hours: 60, lessons: 96,
      rating: 4.9, reviews: 1240, students: 4820,
      updated: '2026-08',
      blurb: 'Master modern HTML5, CSS3, Flexbox, Grid, and responsive web design with real-world projects.',
      keywords: 'html css javascript tailwind flexbox grid responsive frontend react accessibility',
      instructor: { name: 'Sokha Chhoun', role: 'Senior Frontend Engineer · 9 yrs' },
      outcomes: [
        'Write semantic, accessible HTML5 from scratch',
        'Build responsive layouts with Flexbox and Grid',
        'Style modern interfaces with CSS3 and Tailwind',
        'Ship a portfolio of 18 real projects',
        'Deploy with Git, GitHub and CI preview links',
      ],
    },
    {
      id: 'uiux', img: imgCard2, clip: clip2,
      title: 'UI/UX Design Essentials',
      category: 'Design',
      level: 'Beginner to Advanced',
      weeks: 10, hours: 50, lessons: 84,
      rating: 4.9, reviews: 1150, students: 3910,
      updated: '2026-07',
      blurb: 'Create student-friendly web prototypes, wireframes, user journeys, and design systems.',
      keywords: 'figma wireframe prototype user journey design system ux ui research usability',
      instructor: { name: 'Maya Lim', role: 'Product Designer · Figma advocate' },
      outcomes: [
        'Map user journeys before you design',
        'Move from wireframe to hi-fi Figma prototype',
        'Build a reusable design system',
        'Run usability tests and act on findings',
        'Present a case study recruiters trust',
      ],
    },
    {
      id: 'python', img: imgCard3, clip: clip3,
      title: 'Python Programming Masterclass',
      category: 'Programming',
      level: 'Beginner',
      weeks: 10, hours: 50, lessons: 88,
      rating: 4.8, reviews: 980, students: 5240,
      updated: '2026-06',
      blurb: 'Learn Python fundamentals, data structures, scripting, and backend development principles.',
      keywords: 'python data structures scripting backend oop api automation pandas',
      instructor: { name: 'Dr. Vichea Sok', role: 'Backend engineer & lecturer' },
      outcomes: [
        'Write clean, typed Python 3',
        'Model problems with classes and modules',
        'Work fluently with lists, dicts and sets',
        'Consume and build REST APIs',
        'Automate files, reports and schedules',
      ],
    },
    {
      id: 'graphic', img: imgCard4, clip: clip4,
      title: 'Graphic Design & Vector Art',
      category: 'Design',
      level: 'All levels',
      weeks: 8, hours: 40, lessons: 62,
      rating: 4.9, reviews: 850, students: 2680,
      updated: '2026-05',
      blurb: 'Design eye-catching logos, branding assets, social media graphics, and digital illustrations.',
      keywords: 'logo branding vector illustration typography social media print identity bezier',
      instructor: { name: 'Nara Pich', role: 'Brand & identity designer' },
      outcomes: [
        'Compose type that scales everywhere',
        'Design a logo and identity system',
        'Master bezier and vector workflows',
        'Prepare print-ready and digital files',
        'Package a client-ready brand book',
      ],
    },
    {
      id: 'english', img: imgCard5, clip: clip5,
      title: 'English Language & Professional Communication',
      category: 'Language',
      level: 'Intermediate',
      weeks: 6, hours: 30, lessons: 48,
      rating: 4.7, reviews: 720, students: 3110,
      updated: '2026-04',
      blurb: 'Enhance your workplace vocabulary, technical writing, interview skills, and presentation confidence.',
      keywords: 'english writing vocabulary interview presentation business communication grammar',
      instructor: { name: 'Grace Whitfield', role: 'Business communication coach' },
      outcomes: [
        'Write crisp technical and business documents',
        'Present with structure and poise',
        'Handle behavioural interviews confidently',
        'Lead meetings and negotiations',
        'Refine grammar, tone and pronunciation',
      ],
    },
    {
      id: 'marketing', img: imgCard6, clip: clip6,
      title: 'Digital Marketing & Growth Strategy',
      category: 'Marketing',
      level: 'Beginner',
      weeks: 8, hours: 40, lessons: 57,
      rating: 4.8, reviews: 610, students: 2240,
      updated: '2026-03',
      blurb: 'Master SEO, content marketing, social media analytics, and conversion funnels.',
      keywords: 'seo content social media analytics funnel conversion ppc growth ga4',
      instructor: { name: 'Daniel Okafor', role: 'Growth lead & SEO strategist' },
      outcomes: [
        'Map a full acquisition funnel',
        'Rank pages with technical SEO',
        'Plan content that compounds',
        'Read GA4 and attribution data',
        'Build a 90-day growth plan',
      ],
    },
  ];

  const KM = {
    webdev: { title: 'វគ្គបណ្តុះបណ្តាលអភិវឌ្ឍន៍វេប', category: 'អភិវឌ្ឍន៍វេប', level: 'អ្នកចាប់ផ្តើម ដល់ មធ្យម', blurb: 'ស្ទាត់ជំនាញ HTML5, CSS3, Flexbox, Grid និងការរចនាវេបឆ្លើយតបតាមរយៈគម្រោងជាក់ស្តែង។', outcomes: ['សរសេរ HTML5 ដែលមានន័យ និងអាចចូលប្រើបាន', 'បង្កើត Layout ឆ្លើយតបដោយ Flexbox និង Grid', 'រចនា Interface ទំនើបដោយ CSS3 និង Tailwind', 'បង្កើត Portfolio ពីគម្រោងជាក់ស្តែង ១៨', 'ដាក់គម្រោងដោយ Git, GitHub និង CI preview links'] },
    uiux: { title: 'មូលដ្ឋានរចនា UI/UX', category: 'រចនា', level: 'អ្នកចាប់ផ្តើម ដល់ កម្រិតខ្ពស់', blurb: 'បង្កើត Prototype, Wireframe, User Journey និង Design System សម្រាប់វេបសម្រាប់និស្សិត។', outcomes: ['រៀបចំ User Journey មុនពេលរចនា', 'បម្លែងពី Wireframe ទៅ Hi-Fi Figma Prototype', 'បង្កើត Design System ដែលអាចប្រើឡើងវិញ', 'ធ្វើ Usability Test និងកែលម្អតាមលទ្ធផល', 'បង្ហាញ Case Study ដែលអ្នកជ្រើសរើសអាចយល់ច្បាស់'] },
    python: { title: 'វគ្គជំនាញ Python Programming', category: 'កម្មវិធី', level: 'អ្នកចាប់ផ្តើម', blurb: 'រៀនមូលដ្ឋាន Python, Data Structures, Scripting និងគោលការណ៍អភិវឌ្ឍន៍ Backend។', outcomes: ['សរសេរ Python 3 ដែលស្អាត និងមានរចនាសម្ព័ន្ធ', 'ដោះស្រាយបញ្ហាដោយ Classes និង Modules', 'ប្រើ Lists, Dictionaries និង Sets បានល្អ', 'ប្រើ និងបង្កើត REST APIs', 'ស្វ័យប្រវត្តិកម្មឯកសារ របាយការណ៍ និងកាលវិភាគ'] },
    graphic: { title: 'ការរចនាក្រាហ្វិក និង Vector Art', category: 'រចនា', level: 'គ្រប់កម្រិត', blurb: 'រចនា Logo, Branding Assets, Social Media Graphics និង Digital Illustrations ដែលទាក់ទាញ។', outcomes: ['រៀបចំ Typography ឱ្យសមស្របគ្រប់ទំហំ', 'រចនា Logo និង Identity System', 'ស្ទាត់ជំនាញ Bezier និង Vector Workflow', 'រៀបចំឯកសារសម្រាប់បោះពុម្ព និងឌីជីថល', 'បង្កើត Brand Book ដែលត្រៀមសម្រាប់អតិថិជន'] },
    english: { title: 'ភាសាអង់គ្លេស និងការទំនាក់ទំនងវិជ្ជាជីវៈ', category: 'ភាសា', level: 'មធ្យម', blurb: 'ពង្រឹងវាក្យសព្ទការងារ ការសរសេរបច្ចេកទេស ជំនាញសម្ភាសន៍ និងទំនុកចិត្តក្នុងការធ្វើបទបង្ហាញ។', outcomes: ['សរសេរឯកសារបច្ចេកទេស និងអាជីវកម្មឱ្យច្បាស់', 'ធ្វើបទបង្ហាញដោយមានរចនាសម្ព័ន្ធ និងទំនុកចិត្ត', 'ឆ្លើយសម្ភាសន៍អំពីអាកប្បកិរិយាដោយទំនុកចិត្ត', 'ដឹកនាំកិច្ចប្រជុំ និងការចរចា', 'កែលម្អ Grammar, Tone និង Pronunciation'] },
    marketing: { title: 'ទីផ្សារឌីជីថល និងយុទ្ធសាស្ត្រកំណើន', category: 'ទីផ្សារ', level: 'អ្នកចាប់ផ្តើម', blurb: 'ស្ទាត់ជំនាញ SEO, Content Marketing, Social Media Analytics និង Conversion Funnels។', outcomes: ['រៀបចំ Acquisition Funnel ពេញលេញ', 'ធ្វើ Technical SEO ដើម្បីបង្កើនចំណាត់ថ្នាក់', 'រៀបចំ Content ដែលបង្កើតតម្លៃជាបន្តបន្ទាប់', 'អានទិន្នន័យ GA4 និង Attribution', 'បង្កើត Growth Plan រយៈពេល ៩០ ថ្ងៃ'] }
  };
  const courseText = (c, key) => OLP.lang === 'km' ? (KM[c.id]?.[key] || c[key]) : c[key];
  const courseListText = (c) => OLP.lang === 'km' ? (KM[c.id]?.outcomes || c.outcomes) : c.outcomes;
  const categoryLabel = (cat) => OLP.t(cat);

  const CATEGORIES = ['All Courses', ...new Set(COURSES.map((c) => c.category))];
  const SORTS = {
    popular: { label: 'Most Popular', by: (a, b) => b.reviews - a.reviews },
    rating: { label: 'Top Rated', by: (a, b) => b.rating - a.rating || b.reviews - a.reviews },
    newest: { label: 'Newest', by: (a, b) => String(b.updated).localeCompare(String(a.updated)) },
    hours: { label: 'Shortest First', by: (a, b) => a.hours - b.hours },
    az: { label: 'Title A–Z', by: (a, b) => a.title.localeCompare(b.title) },
  };

  /* ── enrolment store (localStorage, one array of course ids) ────── */
  const LS_KEY = 'olp.enrolled.v1';
  const readEnrolled = () => {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return new Set(Array.isArray(raw) ? raw.filter((id) => COURSES.some((c) => c.id === id)) : []);
    } catch {
      return new Set();
    }
  };
  const writeEnrolled = (set) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify([...set])); } catch { /* private mode */ }
  };
  let enrolled = readEnrolled();

  const state = { q: '', cat: 'All Courses', sort: 'popular' };

  /* One module serves every page that shows course cards:
       <div data-course-grid>                     full catalogue
       <div data-course-grid data-limit="3">       featured strip (home page)
     The toolbar (search / chips / sort / counter / empty state) is optional and
     only wired when it exists, so the home page reuses the exact same cards,
     video previews, modal player and enrolment state. */
  const grids = $$('[data-course-grid]').map((host) => ({
    host,
    limit: Number(host.dataset.limit || 0),
  }));
  const isCatalogue = !!$('#course-chips') || !!$('#course-search');

  /* ── card markup ─────────────────────────────────────────────────── */
  function cardHTML(c) {
    const isEnrolled = enrolled.has(c.id);
    return `
      <article class="course-card reveal group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
               data-card="${c.id}">
        <div class="relative aspect-video shrink-0 overflow-hidden bg-slate-900">
          <img src="${c.img}" alt="${esc(courseText(c, 'title'))} course artwork" width="1024" height="443"
               loading="lazy" decoding="async"
               class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
          <video class="card-clip absolute inset-0 h-full w-full object-cover" muted loop playsinline preload="none"
                 data-clip="${c.clip}" data-course="${c.id}" poster="${c.img}" aria-hidden="true"></video>
          <span class="pointer-events-none absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">${esc(courseText(c, 'category'))}</span>
          <span class="pointer-events-none absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            ${icon('play', 'h-3 w-3')} ${OLP.t('Preview')}
          </span>
          <span class="pointer-events-none absolute bottom-2 right-3 flex items-center gap-1 rounded bg-black/60 px-2 py-1 text-xs text-white">
            ${icon('clock', 'h-3.5 w-3.5')} ${c.weeks} ${OLP.t('Weeks')}
          </span>
          ${isEnrolled ? `<span class="pointer-events-none absolute bottom-2 left-3 flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-1 text-xs font-semibold text-white">${icon('check', 'h-3.5 w-3.5')} ${OLP.t('Enrolled')}</span>` : ''}
          <span aria-hidden="true" class="watch-pill pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <span class="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow">${icon('play', 'h-3 w-3')}<span>${OLP.t('Watch preview')}</span></span>
          </span>
        </div>

        <div class="flex flex-1 flex-col justify-between p-4">
          <div>
            <div class="mb-2 flex items-center justify-between gap-2">
              <span class="rounded bg-blue-50 px-2 py-1 text-xs text-slate-500">${esc(courseText(c, 'level'))}</span>
              <span class="flex items-center gap-1 text-sm font-semibold text-blue-600">
                ${icon('star', 'h-3.5 w-3.5 text-amber-500')} ${c.rating.toFixed(1)}
                <span class="font-normal text-slate-500">(${c.reviews.toLocaleString()})</span>
              </span>
            </div>
            <h2 class="mb-1 line-clamp-2 text-lg font-semibold text-slate-800">
              <a class="card-link" href="#course/${c.id}" data-open="${c.id}">${esc(courseText(c, 'title'))}</a>
            </h2>
            <p class="line-clamp-2 text-sm leading-relaxed text-slate-500">${esc(courseText(c, 'blurb'))}</p>
          </div>

          <div class="my-4 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-600">
            <span class="flex items-center gap-1">${icon('clock', 'h-3.5 w-3.5 text-slate-400')} ${c.hours} ${OLP.t('Hours total')}</span>
            <span class="flex items-center gap-1">${icon('badge', 'h-3.5 w-3.5 text-slate-400')} ${OLP.t(OLP.t('Certificate'))}</span>
          </div>
        </div>

        <div class="px-4 pb-4">
          <button type="button" data-enrol="${c.id}" aria-pressed="${isEnrolled}"
            class="relative z-20 flex w-full items-center justify-center gap-1 rounded-md py-2.5 text-sm font-medium transition duration-200 ${isEnrolled
        ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        : 'bg-blue-600 text-white hover:bg-blue-700'
      }">
            ${isEnrolled ? `${icon('check', 'h-4 w-4')} ${OLP.t('Enrolled')}` : `${OLP.t('Start Learning')} <span class="text-lg leading-none">&rarr;</span>`}
          </button>
        </div>
      </article>`;
  }

  /* ── chips ─────────────────────────────────────────────────────── */
  function chipCount(cat) {
    if (cat === 'My courses') return enrolled.size;
    if (cat === 'All Courses') return COURSES.length;
    return COURSES.filter((c) => c.category === cat).length;
  }

  function renderChips() {
    const host = $('#course-chips');
    if (!host) return;
    host.innerHTML = [...CATEGORIES, 'My courses'].map((cat) => {
      const active = state.cat === cat;
      const n = chipCount(cat);
      return `<button type="button" data-cat="${esc(cat)}" aria-pressed="${active}"
        class="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${active
          ? 'bg-blue-700 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-blue-100 hover:text-blue-700'}">
        ${esc(categoryLabel(cat))}<span class="ml-1.5 text-xs ${active ? 'text-blue-100' : 'text-slate-400'}">${n}</span>
      </button>`;
    }).join('');
  }

  /* ── filter + sort ─────────────────────────────────────────────── */
  function visible() {
    const q = state.q.trim().toLowerCase();
    const list = COURSES.filter((c) => {
      const byCat = state.cat === 'All Courses'
        || (state.cat === 'My courses' ? enrolled.has(c.id) : c.category === state.cat);
      if (!byCat) return false;
      if (!q) return true;
      const haystack = `${c.title} ${c.category} ${c.level} ${c.blurb} ${c.keywords} ${c.instructor.name} ${c.instructor.role}`.toLowerCase();
      return haystack.includes(q);
    });
    return list.sort((SORTS[state.sort] || SORTS.popular).by);
  }

  /* ── render ────────────────────────────────────────────────────── */
  function render() {
    if (!grids.length) return;
    const list = visible();

    grids.forEach(({ host, limit }) => {
      const items = limit > 0 ? list.slice(0, limit) : list;
      host.innerHTML = items.map(cardHTML).join('');
      host.classList.toggle('hidden', items.length === 0);
      wirePreviews(host);
    });

    if (!isCatalogue) {          /* featured strip: no toolbar, no empty state */
      initReveal();
      return;
    }

    const empty = $('#course-empty');
    if (empty) empty.classList.toggle('hidden', list.length > 0);

    const count = $('#course-count');
    if (count) count.textContent = `${list.length} of ${COURSES.length}`;
    const status = $('#course-status');
    if (status) {
      status.textContent = list.length
        ? OLP.t('Showing') + ` ${list.length} ${OLP.t('of')} ${COURSES.length} ${OLP.t('courses')}`
        : OLP.t('No courses match your filters');
    }
    initReveal();
  }

  /* ── inline preview clips (cards) ─────────────────────────────────
     The files are only fetched the first time a card is hovered or
     focused, so the initial page load stays light. Muted autoplay is
     allowed by every browser; the modal player is where sound lives. */
  let playingClip = null;

  function stopClip(video) {
    if (!video) return;
    video.pause();
    try { video.currentTime = 0; } catch { /* not seekable yet */ }
    video.classList.remove('is-live');
    if (playingClip === video) playingClip = null;
  }

  async function startClip(video) {
    if (!video || REDUCED_MOTION) return;
    if (!video.src) video.src = video.dataset.clip;   /* lazy: first hover only */
    if (playingClip && playingClip !== video) stopClip(playingClip);
    playingClip = video;
    try {
      await video.play();
      video.classList.add('is-live');
    } catch {
      stopClip(video);                              /* autoplay blocked — stay on the artwork */
    }
  }

  let clipObserver = null;
  function wirePreviews(root = document) {
    $$('.card-clip', root).forEach((video) => {
      if (video.dataset.wired) return;
      video.dataset.wired = '1';
      const card = video.closest('.course-card');
      if (!card) return;
      const start = () => startClip(video);
      const stop = () => stopClip(video);
      card.addEventListener('mouseenter', start);
      card.addEventListener('mouseleave', stop);
      card.addEventListener('focusin', start);
      card.addEventListener('focusout', stop);
      video.addEventListener('error', () => stopClip(video));

      if (!clipObserver && 'IntersectionObserver' in window) {
        clipObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) stopClip(entry.target);
          });
        }, { threshold: 0.2 });
      }
      clipObserver?.observe(video);
    });
  }

  /* ── URL state (shareable filters) ─────────────────────────────── */
  function syncUrl(push = false) {
    const url = new URL(window.location.href);
    const set = (key, value, keep) => {
      if (keep) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    };
    set('q', state.q, !!state.q);
    set('category', state.cat, state.cat !== 'All Courses');
    set('sort', state.sort, state.sort !== 'popular');
    const next = `${url.pathname}${url.search}${url.hash}`;
    if (push) history.pushState(null, '', next);
    else history.replaceState(null, '', next);
  }

  function readUrl() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const cat = params.get('category') || 'All Courses';
    const sort = params.get('sort') || 'popular';
    state.q = q;
    state.cat = [...CATEGORIES, 'My courses'].includes(cat) ? cat : 'All Courses';
    state.sort = SORTS[sort] ? sort : 'popular';
    const search = $('#course-search');
    if (search) search.value = q;
    const sortEl = $('#course-sort');
    if (sortEl) sortEl.value = state.sort;
    const clear = $('#search-clear');
    if (clear) clear.classList.toggle('hidden', !q);
  }

  const courseById = (id) => COURSES.find((c) => c.id === id);

  /* ── course details modal ──────────────────────────────────────── */
  const modal = $('#course-modal');
  const modalBody = $('#cm-body');
  let lastFocus = null;
  let openId = null;

  function modalHTML(c) {
    const isEnrolled = enrolled.has(c.id);
    const meta = [
      ['Instructor', c.instructor.name, c.instructor.role],
      [OLP.t('Level'), courseText(c, 'level'), OLP.t('No prerequisites beyond curiosity')],
      [OLP.t('Duration'), `${c.weeks} ${OLP.t('Weeks')}`, `${c.hours} ${OLP.t('Hours total')}`],
      [OLP.t('Curriculum'), `${c.lessons} ${OLP.t('lessons')}`, OLP.t('On-demand + weekly live lab')],
    ];
    return `
      <div class="relative aspect-video w-full overflow-hidden bg-slate-900">
        <video id="cm-video" class="h-full w-full object-cover" controls playsinline loop preload="metadata"
               poster="${c.img}" src="${c.video || c.clip}"
               aria-label="${esc(courseText(c, 'title'))} preview clip"></video>
        <div class="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-slate-900/80 to-transparent"></div>
        <div class="pointer-events-none absolute inset-x-4 top-3 pr-12 sm:inset-x-6">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600">${esc(courseText(c, 'category'))}</span>
            <span class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">${esc(courseText(c, 'level'))}</span>
            ${isEnrolled ? `<span class="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">${icon('check', 'h-3.5 w-3.5')} ${OLP.t('Enrolled')}</span>` : ''}
          </div>
          <h2 id="cm-title" class="text-xl font-bold tracking-tight text-white drop-shadow sm:text-2xl">${esc(courseText(c, 'title'))}</h2>
        </div>
      </div>

      <div class="p-5 sm:p-6">
        <p id="cm-video-note" class="mb-4 hidden rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status"></p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-600">
          <span class="flex items-center gap-1.5 font-semibold text-blue-700">${icon('star', 'h-4 w-4 text-amber-500')} ${c.rating.toFixed(1)}
            <span class="font-normal text-slate-500">(${c.reviews.toLocaleString()} ${OLP.t('ratings')})</span></span>
          <span class="flex items-center gap-1.5">${icon('users', 'h-4 w-4 text-slate-400')} ${c.students.toLocaleString()} ${OLP.t('students')}</span>
          <span class="flex items-center gap-1.5">${icon('clock', 'h-4 w-4 text-slate-400')} ${c.hours} ${OLP.t('hours')}</span>
          <span class="flex items-center gap-1.5">${icon('badge', 'h-4 w-4 text-slate-400')} ${OLP.t(OLP.t('Certificate'))}</span>
          <button type="button" id="cm-sound" class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-200">
            ${icon('megaphone', 'h-3.5 w-3.5')}<span id="cm-sound-label">${OLP.t('Sound on')}</span>
          </button>
        </div>

        <p class="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">${esc(courseText(c, 'blurb'))}</p>

        <h3 class="mt-6 text-base font-semibold text-slate-900">${OLP.t("What you'll learn")}</h3>
        <ul class="mt-3 grid gap-2 sm:grid-cols-2">
          ${courseListText(c).map((o) => `<li class="flex items-start gap-2 text-sm text-slate-600">${icon('check', 'h-4 w-4 mt-0.5 shrink-0 text-emerald-600')}<span>${esc(o)}</span></li>`).join('')}
        </ul>

        <dl class="mt-6 grid gap-3 sm:grid-cols-2">
          ${meta.map(([label, value, note]) => `
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <dt class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">${esc(label)}</dt>
              <dd class="mt-0.5 text-sm font-semibold text-slate-900">${esc(value)}</dd>
              <dd class="text-xs text-slate-500">${esc(note)}</dd>
            </div>`).join('')}
        </dl>

        <div class="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">${isEnrolled ? OLP.t("You're on the roster") : OLP.t('Ready when you are')}</p>
            <p class="text-xs text-slate-500">${isEnrolled ? OLP.t('Saved to your courses on this device.') : OLP.t('Free for enrolled OLP students.')}</p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
            ${isEnrolled ? `<button type="button" data-unenrol="${c.id}" class="order-2 text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-800 sm:order-1">${OLP.t('Remove from my courses')}</button>` : ''}
            <button type="button" data-enrol="${c.id}" aria-pressed="${isEnrolled}"
              class="order-1 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition sm:order-2 ${isEnrolled ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-blue-600 text-white hover:bg-blue-700'
      }">
              ${isEnrolled ? `${icon('check', 'h-4 w-4')} ${OLP.t('Enrolled')}` : OLP.t('Enrol now')}
            </button>
          </div>
        </div>
      </div>`;
  }

  /* the modal player starts with sound when the browser allows autoplay and
     falls back to a muted start (with a one-tap unmute chip) when it doesn't */
  function syncSoundLabel() {
    const video = $('#cm-video');
    const label = $('#cm-sound-label');
    if (!video || !label) return;
    label.textContent = video.muted ? OLP.t('Muted — tap for sound') : OLP.t('Sound on');
  }

  function startModalVideo(id) {
    const course = courseById(id);
    const video = $('#cm-video');
    if (!video || !course) return;

    /* if the clip file is missing (e.g. only part of the project was copied),
       fall back to the artwork instead of a dead black player */
    video.addEventListener('error', () => {
      if (!video.getAttribute('src') || video.dataset.fallback === '1') return;
      video.dataset.fallback = '1';
      const img = document.createElement('img');
      img.src = course.img;
      img.alt = `${course.title} course artwork`;
      img.className = 'h-full w-full object-cover';
      video.replaceWith(img);
      const note = $('#cm-video-note');
      if (note) {
        note.textContent = 'The preview clip could not be loaded — showing the course artwork instead. Make sure src/assets/media/*.mp4 are in the project.';
        note.classList.remove('hidden');
      }
      toast('Preview clip unavailable — showing the artwork', 'warn', 'info');
    }, { once: true });

    video.muted = false;
    video.volume = 0.9;
    if (!REDUCED_MOTION) {
      const attempt = video.play();
      if (attempt?.catch) {
        attempt.catch(() => {
          video.muted = true;
          syncSoundLabel();
          video.play().catch(() => { /* poster stays up; the controls still work */ });
        });
      }
    }
    syncSoundLabel();
  }

  function openModal(id, { focus = true } = {}) {
    const c = courseById(id);
    if (!modal || !c) return;
    openId = id;
    lastFocus = document.activeElement;
    modalBody.innerHTML = modalHTML(c);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lockScroll(true);
    if (focus) $('#cm-close')?.focus();
    startModalVideo(id);
    if (window.location.hash !== `#course/${id}`) {
      history.pushState(null, '', `${window.location.pathname}${window.location.search}#course/${id}`);
    }
  }

  function closeModal({ restoreFocus = true } = {}) {
    if (!modal || modal.classList.contains('hidden')) return;
    const video = $('#cm-video');
    if (video) {
      video.pause();
      video.removeAttribute('src');            /* release the decoder while closed */
      try { video.load(); } catch { /* ignore */ }
    }
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    openId = null;
    lockScroll(false);
    if (window.location.hash.startsWith('#course/')) {
      history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    if (restoreFocus && lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  /* ── enrolment ─────────────────────────────────────────────────── */
  function enrol(id) {
    const c = courseById(id);
    if (!c) return;
    const already = enrolled.has(id);
    if (!already) {
      enrolled.add(id);
      writeEnrolled(enrolled);
      toast(OLP.lang === 'km' ? `បានចុះឈ្មោះក្នុង “${courseText(c, 'title')}”។ បានរក្សាទុកក្នុង ${OLP.t('My courses')}។` : `Enrolled in “${c.title}”. It is saved under My courses.`, 'success');
    }
    renderChips();
    render();
    if (openId === id) openModal(id, { focus: false });
    return already;
  }

  function unenrol(id) {
    const c = courseById(id);
    if (!c) return;
    enrolled.delete(id);
    writeEnrolled(enrolled);
    /* leaving an empty "My courses" filter would show nothing at all */
    if (state.cat === 'My courses' && enrolled.size === 0) {
      state.cat = 'All Courses';
      syncUrl();
    }
    renderChips();
    render();
    if (openId === id) openModal(id, { focus: false });
    toast(OLP.lang === 'km' ? `បានដក “${courseText(c, 'title')}” ចេញពី ${OLP.t('My courses')}។` : `Removed “${c.title}” from My courses.`, 'warn', 'info');
  }

  /* ── wiring ────────────────────────────────────────────────────── */
  function init() {
    if (!grids.length) return;

    const sortEl = $('#course-sort');
    if (sortEl) {
      sortEl.innerHTML = Object.entries(SORTS)
        .map(([value, { label }]) => `<option value="${value}">${esc(OLP.t(label))}</option>`)
        .join('');
    }

    readUrl();
    renderChips();
    render();

    /* search (debounced) + clear */
    const search = $('#course-search');
    const clearBtn = $('#search-clear');
    let timer;
    const setQuery = (value) => {
      state.q = value;
      if (clearBtn) clearBtn.classList.toggle('hidden', !value);
      clearTimeout(timer);
      timer = setTimeout(() => { render(); syncUrl(); }, 140);
    };
    search?.addEventListener('input', (e) => setQuery(e.target.value));
    clearBtn?.addEventListener('click', () => {
      if (search) search.value = '';
      setQuery('');
      search?.focus();
    });

    /* sort */
    sortEl?.addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
      syncUrl();
    });

    /* category chips */
    $('#course-chips')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.cat = btn.dataset.cat;
      renderChips();
      render();
      syncUrl();
    });

    /* empty state reset */
    $('#empty-reset')?.addEventListener('click', () => {
      state.q = '';
      state.cat = 'All Courses';
      state.sort = 'popular';
      if (search) search.value = '';
      if (clearBtn) clearBtn.classList.add('hidden');
      if (sortEl) sortEl.value = 'popular';
      renderChips();
      render();
      syncUrl();
      toast('Filters cleared — showing all 6 programmes', 'brand', 'spark');
    });

    /* card actions: one delegated listener per grid
       (the home page and the catalogue page can both be on screen) */
    grids.forEach(({ host }) => {
      if (host.dataset.wired === '1') return;
      host.dataset.wired = '1';
      host.addEventListener('click', (e) => {
        const enrolBtn = e.target.closest('[data-enrol]');
        if (enrolBtn) {
          e.preventDefault();
          if (enrol(enrolBtn.dataset.enrol)) openModal(enrolBtn.dataset.enrol);
          return;
        }
        const link = e.target.closest('[data-open]');
        if (link && link.getAttribute('href')?.startsWith('#course/')) return; /* hash routing opens it */
        const card = e.target.closest('.course-card');
        if (card) openModal(card.dataset.card);
      });
    });

    /* modal actions */
    modal?.addEventListener('click', (e) => {
      if (e.target.closest('[data-close-modal]')) return closeModal();
      if (e.target.closest('#cm-sound')) {
        const video = $('#cm-video');
        if (!video) return;
        video.muted = !video.muted;
        if (!video.muted) {
          video.volume = 0.9;
          if (video.paused) video.play().catch(() => { /* user can press play */ });
        }
        syncSoundLabel();
        return;
      }
      const enrolBtn = e.target.closest('[data-enrol]');
      if (enrolBtn) return void enrol(enrolBtn.dataset.enrol);
      const unenrolBtn = e.target.closest('[data-unenrol]');
      if (unenrolBtn) return void unenrol(unenrolBtn.dataset.unenrol);
    });

    document.addEventListener('keydown', (e) => {
      if (!modal || modal.classList.contains('hidden')) {
        if (e.key === '/' && !/^(input|textarea|select)$/i.test(document.activeElement?.tagName || '')) {
          e.preventDefault();
          search?.focus();
        }
        return;
      }
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab') {
        const focusables = $$('button, a[href], input, select, textarea', modal)
          .filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* navbar search icon and the hero pills jump here */
    $$('[data-focus-search]').forEach((el) => el.addEventListener('click', () => {
      search?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      search?.focus({ preventScroll: true });
    }));

    /* CTA banner: advisor deep-link + one-click reset */
    $('#explore-all')?.addEventListener('click', () => {
      state.q = '';
      state.cat = 'All Courses';
      state.sort = 'popular';
      if (search) search.value = '';
      if (clearBtn) clearBtn.classList.add('hidden');
      if (sortEl) sortEl.value = 'popular';
      renderChips();
      render();
      syncUrl();
      grids[0]?.host.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    /* hash routing: #course/<id> opens, back/forward closes */
    const openFromHash = () => {
      const id = window.location.hash.startsWith('#course/') ? window.location.hash.slice('#course/'.length) : '';
      if (id && courseById(id)) openModal(id);
      else closeModal({ restoreFocus: false });
    };
    window.addEventListener('hashchange', openFromHash);
    window.addEventListener('popstate', openFromHash);
    openFromHash();

    /* keep the grid in sync if enrolment changes in another tab */
    window.addEventListener('storage', (e) => {
      if (e.key !== LS_KEY) return;
      enrolled = readEnrolled();
      renderChips();
      render();
    });
  }

  window.addEventListener('olp:languagechange', () => { renderChips(); render(); if (openId && courseById(openId)) { modalBody.innerHTML = modalHTML(courseById(openId)); startModalVideo(openId); } });

  OLP.onReady(init);
})();
