# NCCAS — Official Astronomy Society Website

> **Astronomy Society of A/Niwaththakachethiya National College, Sri Lanka (NCCAS)**  
> *Tagline: REACH BEYOND THE STARS.*

Welcome to the official repository of the NCCAS Astronomy Society website. This static website serves as a futuristic, interactive digital observatory designed to inspire students, showcase society activities, publish celestial discoveries, and introduce our executive board during awareness symposiums.

---

## 🚀 Live Demo & Deployment

- **Hosting Architecture**: 100% Static HTML5 / CSS3 / Vanilla JavaScript.
- **Deploy Target**: Netlify (direct from GitHub, zero build step required).
- **Canonical URL**: `https://nccas-astronomy.netlify.app/`

---

## 📁 Project Structure

```text
nccas-website/
├── index.html          # Core semantic HTML document with all sections & modals
├── style.css           # Modular CSS3 styling, liquid glass design system & responsive rules
├── script.js           # Vanilla JS: Canvas starfield, celestial database, news, events & modal engine
├── favicon.svg         # Crisp scalable SVG favicon with golden Saturn & cosmic glow
├── robots.txt          # SEO search engine crawling rules
├── sitemap.xml         # XML sitemap with section anchors for search indexers
├── netlify.toml        # Netlify security headers and asset caching configuration
├── README.md           # Documentation and maintenance guide
└── assets/
    ├── images/         # High-resolution astronomy imagery (planets, galaxies, nebulae, observatory)
    ├── logo/           # Official NCCAS logo and College Crest
    └── icons/          # Clean SVG icons (WhatsApp, Instagram, Facebook, Telescope, Close, Sparkle)
```

---

## 🛠️ Technology Stack

- **HTML5**: Semantic tags, WAI-ARIA accessible dialogs, meta tags, Open Graph.
- **CSS3**: Custom properties (CSS variables), CSS Grid, Flexbox, glassmorphism (`backdrop-filter`), animations, media queries for responsive layouts (320px – 1440px+).
- **Vanilla JavaScript**: HTML5 Canvas particle starfield with subtle mouse parallax, `IntersectionObserver` scroll reveals, celestial database modal manager, category filter logic.
- **Zero Dependencies**: No React, Vue, Tailwind, Webpack, or external build tool needed. Runs instantly in any modern web browser.

---

## 💻 How to Run Locally

### Option 1: Double-Click
Simply double-click `index.html` to open it in your default web browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local HTTP Server (Recommended)
Using Python or Node.js to serve the files locally:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

---

## 🌐 How to Upload to GitHub

1. Initialize git in your local project folder:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of NCCAS official astronomy website"
   ```
2. Create a new repository on your GitHub account (e.g. `nccas-website`).
3. Link your local repo and push:
   ```bash
   git remote add origin https://github.com/<your-username>/nccas-website.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚀 How to Deploy on Netlify

1. Sign in to [Netlify](https://www.netlify.com/).
2. Click **"Add new site"** → **"Import an existing project"**.
3. Select **GitHub** and authorize access to your `nccas-website` repository.
4. Leave the build settings default:
   - **Build command**: *(leave blank)*
   - **Publish directory**: `.` *(root)*
5. Click **"Deploy site"**. Your website will be live in seconds with HTTPS!

---

## 📝 Maintenance & Content Updates

### 1. Updating Astronomy News & Discoveries
All news items are managed directly in `script.js` under the `NEWS_DATA` array:
```javascript
{
  id: 'unique-id',
  title: 'Headline Here',
  category: 'discoveries', // 'society' | 'discoveries' | 'space-news' | 'skywatching' | 'science-tech'
  categoryLabel: 'Astronomy Discoveries',
  image: 'assets/images/your-image.jpg',
  date: 'October 16, 2026',
  source: 'NASA / ESA',
  url: 'https://...',
  summary: 'Short card summary...',
  content: 'Full article text...'
}
```

### 2. Updating Society Activities & Events
Events are located in `script.js` under `EVENTS_DATA`:
```javascript
{
  id: 'event-id',
  title: 'Event Title',
  category: 'Observation',
  status: 'upcoming', // 'upcoming' | 'soon' | 'completed'
  statusLabel: 'Upcoming Session',
  badgeClass: 'event-badge-upcoming',
  dateDisplay: 'Date / Time',
  location: 'Venue',
  description: 'Event description...',
  highlights: ['Point 1', 'Point 2'],
  actionText: 'Register Now',
  actionUrl: 'https://docs.google.com/forms/...'
}
```

### 3. Updating the Executive Board
Executive board roles and members are in `index.html` inside `<section id="executive-board">`.
Current Board:
- **President**: Manuka Minsala Senevirathna
- **Vice President**: Amithya Sahansith Senarathna
- **Secretary**: Gauravi Sathsarani Bandara
- **Treasurer**: Thejana Dahampath Pathirana
- **Head of Media**: Yasath Channula Bihimuthu Kumarasinghe

### 4. Updating Logos & Visual Assets
- Official Society Logo: `assets/logo/nccas-logo.png`
- College Crest: `assets/logo/college-crest.png`
- Astronomy Visuals: Place new `.jpg` or `.png` files in `assets/images/` and update the respective image paths in `index.html` or `script.js`.

### 5. Updating the Domain for SEO
When you connect a custom domain (e.g. `astronomy.niwaththakachethiya.lk`):
1. Update the canonical link in `index.html`:
   ```html
   <link rel="canonical" href="https://your-domain.lk/">
   ```
2. Update the `sitemap.xml` URLs.
3. Update `robots.txt` Sitemap reference line.

---

## 📜 Official Social Channels

- **Official Membership Form**: [Google Form](https://docs.google.com/forms/d/e/1FAIpQLSfdBGd3nHT00P2NWzoMJ97IL8oQQNEA-zCq7MYzr3bmEtwUFg/viewform?usp=dialog)
- **WhatsApp Channel**: [Join Channel](https://whatsapp.com/channel/0029VbCPCSwHrDZbx76dog0m)
- **Instagram**: [@nnce.astro](https://www.instagram.com/nnce.astro/)
- **Facebook**: [Niwaththakachethiya National College](https://www.facebook.com/share/18TTmhUwGo/)

---

© 2026 Astronomy Society of A/Niwaththakachethiya National College (NCCAS). All rights reserved.  
*REACH BEYOND THE STARS.*
