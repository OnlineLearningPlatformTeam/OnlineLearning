# 📚 Online Learning Platform (OLP)

## 📌 About the Project

The **Online Learning Platform (OLP)** is a modern and user-friendly website designed to help students explore online courses and learning opportunities.

This project is developed by a team of **4 members** as a Web Design Project. The website focuses on simple navigation, responsive design, and clear course information.

---

## 🎯 Project Objectives

- Create a modern and responsive online learning website
- Provide information about online learning
- Display available courses
- Organize courses by categories
- Provide clear course information
- Create a contact page
- Practice HTML, Tailwind CSS, and JavaScript with Vite
- Practice teamwork using Git and GitHub
- Use Git branches and Pull Requests correctly

---

## 🌐 Website Pages

### 🏠 1. Home Page (`index.html`)

The Home page introduces the Online Learning Platform.

**Features:**
- Hero Section
- Welcome Section
- Featured Courses
- Popular Categories
- Why Choose Us
- Call to Action
- Navigation Bar
- Footer

### 👥 2. About Page (`pages/about.html`)

The About page provides information about the platform.

**Features:**
- About Us
- Our Mission
- Our Vision
- Benefits of Online Learning
- Our Team
- Platform Information

### 📚 3. Courses Page (`pages/courses.html`)

The Courses page displays available online courses.

**Features:**
- Course Categories
- Course Cards
- Course Images
- Course Titles
- Instructor Names
- Course Levels
- Course Duration
- Course Description
- View Course Button
- Search or Filter Courses

### 📩 4. Contact Page (`pages/contact.html`)

The Contact page allows users to contact the platform.

**Features:**
- Contact Information
- Contact Form
- Name Input
- Email Input
- Message Input
- Submit Button
- Social Media Links
- Location Information

---

<<<<<<< HEAD
=======
<<<<<<< HEAD
## 🏠 Home Page (`index.html`)

The home page uses the **same course card component** as the catalogue — hover a
card and its preview clip plays, click it and the details modal opens with the
full video player and the enrol button. There is one source of truth for that
markup and behaviour (`src/components/js/courses.js`), so the two pages can
never drift apart:

```html
<!-- home: the three most popular courses -->
<div id="featured" data-course-grid data-limit="3" class="grid …"></div>

<!-- catalogue: all six, with search / chips / sort -->
<div id="grid" data-course-grid class="grid …"></div>
```

Sections: hero (with the shared navbar), stats strip, "Why Learning", featured
courses, the Learning advantage, a closing call to action and the shared footer.
Course artwork and the hero image are local files — no stock-photo hotlinks.

---

## 🎓 Course Catalogue (`pages/courses.html`)

The catalogue is data-driven: `src/components/js/courses.js` holds one
`COURSES` array and renders the six cards from it, so adding a course means
adding one object — not copy-pasting a card.

| Behaviour | How it works |
|---|---|
| **Search** | Live filter over title, category, level, blurb, skills and instructor |
| **Categories** | Chips with live counts, plus a **My courses** chip for enrolled courses |
| **Sort** | Most Popular · Top Rated · Newest · Shortest First · Title A–Z |
| **Result count** | “Showing X of Y courses”, mirrored in an `aria-live` region |
| **Course details** | Clicking a card opens a modal (outcomes, instructor, level, hours, certificate). It is deep-linkable: `courses.html#course/webdev` |
| **Video preview** | Hovering or focusing a card plays a silent, clean 6 s preview clip over the artwork; the file is only fetched on that first hover |
| **Video player** | The details modal plays the same clip in a real `<video>` player (controls, sound, fullscreen, looping) — with a muted fallback plus a one-tap “sound on” chip when the browser blocks autoplay audio |
| **Enrolment** | “Start Learning” stores the course in `localStorage` (`olp.enrolled.v1`), switches the button to *Enrolled*, and adds the course to **My courses** |
| **Shareable filters** | The current search/category/sort are written to the URL |
| **Keyboard & a11y** | One tab stop per card, `/` focuses search, `Esc` closes the modal, focus returns to the card |

`src/main.js` loads a page module only when the page asks for it:

```html
<body data-page="courses">   <!-- → imports components/js/courses.js -->
```

### Video previews

Two files per course, both in `src/assets/media/` (both optional — the page
degrades to the artwork if a file is missing):

| File | Role |
|---|---|
| `trailer-cardN.mp4` | Your **real course video**, played by the details-modal player (sound, fullscreen, native controls). |
| `preview-cardN.mp4` | A **short silent loop** the card plays on hover (keep it small — a few hundred KB). |

`scripts/build-previews.sh` fills in what's missing, and **never overwrites an
existing `preview-cardN.mp4`**:

```bash
npm run previews:video          # needs ffmpeg (https://ffmpeg.org)
FORCE=1 npm run previews:video  # rebuild existing preview clips too
```

For each course it makes a 6 s / 720p / ~100 KB clip — cut from
`trailer-cardN.mp4` when you have one, otherwise a slow zoom of the course
artwork. `trailer-card1.mp4` in this project is a real 3.8-minute lecture clip,
so card 1 shows a loop of it on hover and the full video in the player.

Reduced-motion users never get an autoplaying card clip, and the modal player
always exposes the normal play/mute/fullscreen controls.

### Build

```bash
npm install      # once — needs Node ^20.19 || >=22.12 (Vite 8)
npm run dev      # http://localhost:5173
npm run build    # production build of all four pages into dist/
npm run preview  # serve the production build (run build first)
```

### Troubleshooting

| Symptom | Cause / fix |
|---|---|
| `npm run dev` stops with an engine or syntax error | Check `node -v`. This project uses **Vite 8**, which needs **Node ^20.19 or >= 22.12**. |
| `npm run preview` says `dist` does not exist | Run `npm run build` first — preview serves the build, not the source. |
| The nav/footer look unstyled, or the cards are missing | Only some files were replaced. Copy the **whole** project: especially `src/components/js/courses.js`, `src/components/css/courses.css` and `src/style.css`. |
| Cards show artwork but **no video**, or the player says *preview clip could not be loaded* | `src/assets/media/preview-card1..6.mp4` are missing from the copy. Restore that folder, or regenerate it with `npm run previews:video` (needs ffmpeg). |
| Port 5173 already in use | Vite prints the alternative port it picked — use the URL it shows, or `npm run dev -- --port 5174`. |
| Stale page after pulling changes | Hard-reload (Ctrl/Cmd + Shift + R); Vite caches nothing but the browser might. |

---

=======
>>>>>>> 6446885c289b38e6fd2e9110806719b376b19900
>>>>>>> feature/fix-code
## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| Tailwind CSS | Utility-first styling and responsive layout |
| CSS3 | Custom styles (`src/style.css`) |
| JavaScript (ES Modules) | Interactive features (`src/main.js`) |
| Vite | Development server and build tool |
| Node.js & npm | Package management |
| Git | Version control |
| GitHub | Team collaboration |

---

## 📁 Project Structure

```text
OnlineLearning/
│
├── index.html              # Home page
│
├── pages/                  # Other website pages
│   ├── about.html
│   ├── courses.html
│   └── contact.html
│
├── public/                 # Static files served as-is
│   ├── favicon.svg
│   └── icons.svg
│
├── src/                    # Source code
│   ├── assets/             # Images and media
<<<<<<< HEAD
=======
<<<<<<< HEAD
│   │   ├── media/          # preview-card*.mp4 (card preview clips)
=======
>>>>>>> 6446885c289b38e6fd2e9110806719b376b19900
>>>>>>> feature/fix-code
│   │   ├── logo/
│   │   ├── courses/
│   │   ├── team/
│   │   └── banner/
<<<<<<< HEAD
│   ├── main.js             # Main JavaScript file
│   └── style.css           # Tailwind import + custom CSS
=======
<<<<<<< HEAD
│   ├── components/         # Feature code, split per page
│   │   ├── css/            # courses.css · contact.css (page layers)
│   │   └── js/             # courses.js · contact.js (page modules)
│   ├── main.js             # Shared helpers + navbar + page loader
│   └── style.css           # Tailwind import, design tokens, shared CSS
=======
│   ├── main.js             # Main JavaScript file
│   └── style.css           # Tailwind import + custom CSS
>>>>>>> 6446885c289b38e6fd2e9110806719b376b19900
>>>>>>> feature/fix-code
│
├── .gitignore
├── package.json
├── package-lock.json
├── vite.config.ts          # Vite configuration
└── README.md
```

> `node_modules/` is created by `npm install` and is ignored by Git.

---

## 🚀 Getting Started

### Requirements

- [Node.js](https://nodejs.org/) (LTS version)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Go into the project folder
cd OnlineLearning

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the local URL shown in the terminal (usually `http://localhost:5173`).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |

### Page Links

Use relative links between pages:

```html
<!-- From index.html -->
<a href="./pages/about.html">About</a>

<!-- From any file inside /pages -->
<a href="../index.html">Home</a>
<a href="./courses.html">Courses</a>
```

Load the shared script in every page:

```html
<!-- In index.html -->
<script type="module" src="./src/main.js"></script>

<!-- In pages/*.html -->
<script type="module" src="../src/main.js"></script>
```

---

## 👨‍💻 Team Members

| Member | Responsibility |
|---|---|
| Member 1 | Home Page |
| Member 2 | About Page |
| Member 3 | Courses Page |
| Member 4 | Contact Page |

### Team Information

- **Member 1:** ____________________
- **Member 2:** ____________________
- **Member 3:** ____________________
- **Member 4:** ____________________

---

## 🌿 GitHub Branches

Each team member works on a separate feature branch. Finished features are merged into `develop`, and `develop` is merged into `main` when the project is stable.

```text
main
│
└── develop
    ├── feature/home
    ├── feature/about
    ├── feature/courses
    └── feature/contact
```

| Branch | Responsibility |
|---|---|
| `main` | Final, stable version |
| `develop` | Integration branch for all features |
| `feature/home` | Home Page |
| `feature/about` | About Page |
| `feature/courses` | Courses Page |
| `feature/contact` | Contact Page |

---

## 🔄 GitHub Workflow

```text
Create Task
     ↓
Create Branch (from develop)
     ↓
Develop
     ↓
Test
     ↓
Commit
     ↓
Push
     ↓
Create Pull Request (into develop)
     ↓
Code Review
     ↓
Fix Issues
     ↓
Merge to develop
     ↓
Merge develop to main (when stable)
```

### Git Commands

```bash
git clone <repository-url>

git checkout develop
git pull origin develop

git checkout -b feature/home

git add .

git commit -m "Create home page"

git push origin feature/home
```

After pushing, create a **Pull Request** on GitHub targeting `develop` and wait for review before merging.

### Commit Message Examples

```text
Create home page structure
Add hero section
Add course cards to courses page
Fix navbar responsive issue
```

---

## 📋 Project Tasks

### Member 1 – Home Page

- Create Home page structure
- Create Hero section
- Create Welcome section
- Create Featured Courses
- Create Popular Categories
- Create Why Choose Us section
- Create Call to Action
- Make the page responsive

### Member 2 – About Page

- Create About page
- Add About Us section
- Add Mission section
- Add Vision section
- Add Benefits section
- Add Team section
- Make the page responsive

### Member 3 – Courses Page

- Create Courses page
- Create course categories
- Create course cards
- Add course images
- Add instructor information
- Add course levels
- Add course duration
- Add View Course buttons
- Add search/filter if needed
- Make the page responsive

### Member 4 – Contact Page

- Create Contact page
- Add contact information
- Create contact form
- Add name field
- Add email field
- Add message field
- Add submit button
- Add social media links
- Make the page responsive

---

## 🎨 Design Guidelines

The website should have:

- Clean and modern design
- Simple navigation
- Responsive layout
- Consistent colors
- Consistent typography
- Clear buttons
- Easy-to-read content
- Mobile-friendly design
- Consistent spacing

### Suggested Colors

```text
Dark Blue   #0A1128
Light Blue  #3B82F6
White       #FFFFFF
Light Gray  #F5F7FA
```

---

## 📱 Responsive Design

The website should work properly on:

- 💻 Desktop
- 💻 Laptop
- 📱 Tablet
- 📱 Mobile

Use Tailwind responsive prefixes where appropriate (`sm:`, `md:`, `lg:`, `xl:`).

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- course cards -->
</div>
```

---

## 🧪 Testing Checklist

Before creating a Pull Request:

- [ ] HTML works correctly
- [ ] Tailwind / CSS works correctly
- [ ] JavaScript works correctly
- [ ] Images display correctly
- [ ] Navigation links work
- [ ] Buttons work
- [ ] No broken links
- [ ] No console errors
- [ ] Responsive design works
- [ ] `npm run build` runs without errors
- [ ] Code is clean and organized

---

## 📅 Project Information

| Information | Details |
|---|---|
| Project Name | Online Learning Platform |
| Short Name | OLP |
| Project Type | Web Design Project |
| Duration | 2 Weeks |
| Team | 4 Members |
| Category | Education & Learning |
| Status | In Development |

---

## 🚧 Project Status

**Status: In Development 🚧**

The project is currently being developed by the team.

### Future Improvements

<<<<<<< HEAD
=======
<<<<<<< HEAD
- Course search, filtering, sorting, details modal and video previews — ✅ done (see above)
- Enrolment with a real backend / student dashboard
- Replace the generated preview clips with real course trailers
=======
>>>>>>> feature/fix-code
- Course search
- Course filtering
- Interactive course details
- Improved JavaScript interactions
- Better mobile experience
<<<<<<< HEAD
=======
>>>>>>> 6446885c289b38e6fd2e9110806719b376b19900
>>>>>>> feature/fix-code
- Additional learning features

---

## 📄 License

This project is created for **educational purposes** as part of a student Web Design Project.

---

## ⭐ Acknowledgement

This project is developed as a team project to practice:

- Web Development
- UI/UX Design
- Git & GitHub
- Teamwork
- Project Management
- Responsive Web Design
