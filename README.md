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
│   │   ├── logo/
│   │   ├── courses/
│   │   ├── team/
│   │   └── banner/
│   ├── main.js             # Main JavaScript file
│   └── style.css           # Tailwind import + custom CSS
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

- Course search
- Course filtering
- Interactive course details
- Improved JavaScript interactions
- Better mobile experience
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
