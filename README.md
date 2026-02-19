# NYA · John Emerson Delos Reyes ✨

> Developer & Creative Technologist

Personal portfolio of **John Emerson Delos Reyes** (alias **Emer**) — built with Three.js, custom GLSL shaders, and vanilla HTML/CSS/JS. A cosmic interactive particle-galaxy experience that serves as a creative showcase.

[![Deploy to GitHub Pages](https://github.com/Ashio245/nya/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ashio245/nya/actions/workflows/deploy.yml)

## 🌐 View Live

**👉 [https://ashio245.github.io/nya/](https://ashio245.github.io/nya/)**

> The site is automatically deployed to GitHub Pages on every push.

---

## 🔗 Connect

- **LinkedIn**: [John Emerson Delos Reyes](https://www.linkedin.com/in/john-emerson-delos-reyes-0a7458297/)
- **Facebook**: [emeerrrrrr](https://www.facebook.com/emeerrrrrr)

---

## 📸 Preview

![NYA preview](https://via.placeholder.com/800x450/0a0a0f/4fc3f7?text=NYA+%E2%9C%A8+Emer+Portfolio)

---

## 🚀 How to Run

**Option A — direct file open** (Chrome/Edge only, Firefox blocks ES modules from `file://`):

```
Open index.html in Chrome or Edge
```

**Option B — local HTTP server** (recommended, works in all browsers):

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080

# Node.js (npx)
npx serve .
# then open the URL shown
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| 3-D rendering | [Three.js r158](https://threejs.org/) |
| GPU shaders | Custom GLSL (vertex + fragment) |
| Post-processing | UnrealBloomPass via Three.js addons |
| Styling | Vanilla CSS (glass morphism, CSS animations) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts) |
| Module loading | Native ES modules + `importmap` |
| Build tool | **None** — open `index.html` and go |

---

## ✨ Features

- **12,000-particle spiral galaxy** — five spiral arms, depth-biased distribution
- **Custom GLSL shaders** — smooth circular points, per-particle twinkling, colour blending
- **Mouse interaction** — repulsion wave ripples through nearby particles
- **UnrealBloom glow** — post-processing for cinematic bloom effect
- **ACES filmic tone-mapping** — cinema-quality colour rendering
- **Delta-time animation** — buttery 60 fps via `THREE.Clock`
- **Eased camera orbit** — slow auto-rotation + subtle mouse parallax
- **Glass morphism UI** — frosted-glass cards, hero section, contact form
- **Typewriter subtitle** — CSS-only typewriter animation
- **Social links** — LinkedIn & Facebook buttons
- **Scroll reveal** — `IntersectionObserver`-based fade-in for all sections
- **Fully responsive** — mobile-friendly with CSS media queries
- **Zero build step** — pure HTML + CSS + JS, served as static files

---

## 📁 Project Structure

```
index.html        — Entry point
css/style.css     — All styles (glass morphism, animations, responsive)
js/app.js         — Three.js galaxy, shaders, post-processing, interactions
README.md         — This file
```

---

## 🎨 Colour Palette

| Name | Hex |
|------|-----|
| Background | `#0a0a0f` |
| Electric blue | `#4fc3f7` |
| Cosmic purple | `#b388ff` |
| Soft pink | `#f48fb1` |
| Text white | `#ffffff` |
| Soft gray | `#b0bec5` |

---

## 🙏 Credits

- Three.js — [threejs.org](https://threejs.org/)
- Google Fonts — Space Grotesk
- Built by John Emerson Delos Reyes 🌌

---

## 📸 Preview

![NYA preview](https://via.placeholder.com/800x450/0a0a0f/4fc3f7?text=NYA+%E2%9C%A8+Cosmic+Galaxy)

---

## 🚀 How to Run

**Option A — direct file open** (Chrome/Edge only, Firefox blocks ES modules from `file://`):

```
Open index.html in Chrome or Edge
```

**Option B — local HTTP server** (recommended, works in all browsers):

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080

# Node.js (npx)
npx serve .
# then open the URL shown
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| 3-D rendering | [Three.js r158](https://threejs.org/) |
| GPU shaders | Custom GLSL (vertex + fragment) |
| Post-processing | UnrealBloomPass via Three.js addons |
| Styling | Vanilla CSS (glass morphism, CSS animations) |
| Fonts | [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) (Google Fonts) |
| Module loading | Native ES modules + `importmap` |
| Build tool | **None** — open `index.html` and go |

---

## ✨ Features

- **12,000-particle spiral galaxy** — five spiral arms, depth-biased distribution
- **Custom GLSL shaders** — smooth circular points, per-particle twinkling, colour blending
- **Mouse interaction** — repulsion wave ripples through nearby particles
- **UnrealBloom glow** — post-processing for cinematic bloom effect
- **ACES filmic tone-mapping** — for beautiful, cinema-quality colour
- **Delta-time animation** — buttery 60 fps via `THREE.Clock`
- **Eased camera orbit** — slow auto-rotation + subtle mouse parallax
- **Glass morphism UI** — frosted-glass cards, hero section, contact form
- **Typewriter subtitle** — CSS-only typewriter animation
- **Scroll reveal** — `IntersectionObserver`-based fade-in for all sections
- **Fully responsive** — mobile-friendly with CSS media queries
- **Zero build step** — pure HTML + CSS + JS, served as static files

---

## 📁 Project Structure

```
index.html        — Entry point
css/style.css     — All styles (glass morphism, animations, responsive)
js/app.js         — Three.js galaxy, shaders, post-processing, interactions
README.md         — This file
```

---

## 🎨 Colour Palette

| Name | Hex |
|------|-----|
| Background | `#0a0a0f` |
| Electric blue | `#4fc3f7` |
| Cosmic purple | `#b388ff` |
| Soft pink | `#f48fb1` |
| Text white | `#ffffff` |
| Soft gray | `#b0bec5` |

---

## 🙏 Credits

- Three.js — [threejs.org](https://threejs.org/)
- Google Fonts — Space Grotesk
- Inspiration — the night sky 🌌
