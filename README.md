# Student Productivity Dashboard

A portfolio-quality productivity dashboard for students, built with **only HTML, CSS and Vanilla JavaScript** — no frameworks, no build step, no backend. Everything is stored locally in the browser.

![Status](https://img.shields.io/badge/status-complete-brightgreen) ![Tech](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JS-blue)

## Overview

Students juggle tasks, focus sessions and study hours across several apps. This single-page dashboard brings them together in one calm, glassmorphism interface that works on mobile, tablet and desktop, and remembers your data between visits using Local Storage.

## Features

- **Glassmorphism UI** with animated gradient blobs and a card-based dashboard layout
- **Dark / Light theme toggle** (your choice is remembered)
- **Animated landing section** with live stats
- **To-Do List** — add, complete and delete tasks, saved in Local Storage
- **Pomodoro Timer** — start, pause, reset, automatic 25/5 minute cycles with an animated progress ring
- **Study Progress Tracker** — log daily hours against a goal with a visual progress bar, saved in Local Storage
- **Motivational quotes** — a new random quote on demand
- **Fully responsive** with smooth hover effects and transitions
- **Accessible touches** — semantic HTML, ARIA labels, `prefers-reduced-motion` support

## Project Structure

```text
student-productivity-dashboard/
├── index.html   # Semantic markup for header, hero and dashboard cards
├── style.css    # Design tokens (CSS variables), layout, components, animations
├── script.js    # Theme, to-do list, Pomodoro, progress tracker, quotes
└── README.md    # This file
```

## Installation

No dependencies and no build tools required.

```bash
git clone https://github.com/<your-username>/student-productivity-dashboard.git
cd student-productivity-dashboard
```

Then simply open `index.html` in your browser.

Optional — run a small local server for a cleaner dev experience:

```bash
# Python 3
python -m http.server 5500
# then visit http://localhost:5500
```

## Deploy to GitHub Pages

1. Push the project to a GitHub repository.
2. Open **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then **Save**.
5. Wait a minute — your site goes live at
   `https://<your-username>.github.io/student-productivity-dashboard/`

## Screenshots

| Dark theme | Light theme |
| --- | --- |
| _Add `screenshots/dark.png`_ | _Add `screenshots/light.png`_ |

```markdown
![Dashboard — dark](screenshots/dark.png)
![Dashboard — light](screenshots/light.png)
```

## How It Works (for beginners)

- **CSS variables** in `:root` hold every colour, radius and font. The light theme just overrides those variables under `[data-theme="light"]`, so one attribute change re-skins the whole page.
- **Local Storage** stores plain strings, so the code wraps values with `JSON.stringify` when saving and `JSON.parse` when loading (`save()` / `load()` helpers in `script.js`).
- **The to-do list** keeps an array of task objects and re-renders the list from that array after every change — simple to reason about and easy to extend.
- **The Pomodoro timer** counts down with `setInterval`, and `clearInterval` pauses it. The SVG ring uses `stroke-dashoffset` to show remaining time.

## Future Improvements

- Weekly and monthly study charts
- Task categories, due dates and priorities
- Drag-and-drop task reordering
- Sound and browser notifications when a Pomodoro ends
- Customisable focus/break lengths
- Export and import data as JSON
- Optional cloud sync for multi-device use

## License

MIT — free to use, learn from and adapt.
