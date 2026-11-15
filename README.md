# Mission Mars: Survival Base! 🚀

**NASA Space Apps Challenge 2026 – Challenge: _Build a Junior Astronaut Mission Trainer_**
**Team:** Los Lunáticos Terrícolas (The Lunatic Earthlings) – Santiago del Estero, Argentina

▶️ **Play it here:** https://simulador-marte.vercel.app/
No sign-in required. Works on computers, netbooks and tablets.

---

## What is it?

An educational web game for kids aged 7 to 12. The player is the commander of a base on Mars and must keep the crew alive for **10 sols** (Martian days) by managing limited energy.

**The core dilemma (trade-off):** the generator produces **100 kW**, but the three modules need **150 kW**:

| Module | Energy | If it is OFF |
|---|---|---|
| Life Support | 40 kW | Health −50 % per sol |
| Farm | 50 kW | Food −20 % per sol (ON: +10 %, max 100 %) |
| Radiation Shields | 60 kW | During a solar storm: Health −40 % per sol |

You can't turn everything on. During a solar storm, turning on the shields means turning off the farm. There are **five storms in a row**, so the player can't block them all: they must choose when to protect the crew and when to take the risk.

**Win:** reach the end of Sol 10 with health and food above 0 %.
**Lose:** health or food reaches 0 %, or you move on to the next sol with more than 100 kW (blackout).

**Learning goal:** _On Mars we can't have it all. Every decision has consequences and every resource counts to keep our crew alive._

## Features

- Start screen with the mission briefing.
- Storm alert that shows the cost of each option (shields vs. no shields).
- **Sol Report** after every turn: what happened, why, and the real change in each resource.
- **Final Mission Report:** sols completed, storms faced, storms protected or unprotected, sols with the farm turned off, final health and food, a strategy tip, and the key lesson.
- Info buttons (ⓘ) that work by tap or click.
- "Scientific data / Credits" panel.

## NASA Data Used

| Source | Link | Data used | Role in the game |
|---|---|---|---|
| **DONKI** – Space Weather Database Of Notifications, Knowledge, Information (CCMC, NASA Goddard), via NASA Open APIs | https://ccmc.gsfc.nasa.gov/tools/DONKI · `https://api.nasa.gov/DONKI/CME?startDate=2024-05-14&endDate=2024-05-23` | 63 Coronal Mass Ejections (CMEs) recorded from May 14 to 23, 2024, and their WSA-ENLIL model analyses | Each sol is a real day of that period. A sol has a solar storm when at least one CME has an estimated arrival at Mars that day: 16 CMEs in total, on Sols 3 to 7 (1, 6, 2, 4 and 3 CMEs). The alert shows the real date and the number of CMEs. |

**Method:** for each CME we used the analyses marked "most accurate" and counted only direct arrivals at Mars (glancing blows were not counted). Each CME is assigned to the day of its first estimated arrival. The data was downloaded once and stored in `src/donki.js`, so the game does not depend on a live API and exposes no API key.

**Scientific honesty:**
- CME arrivals at Mars are **model estimates (WSA-ENLIL), not measurements on Mars**.
- Energy consumption and the damage to health and food are **simplified game values**, not NASA measurements.
- A solar storm in the game does not represent a specific radiation dose.

**Game background image:** _"Water Enters Jezero Crater Billions of Years Ago (Artist's Concept)"_, PIA26207, NASA/JPL-Caltech (artist's concept, not a photograph): https://science.nasa.gov/photojournal/water-enters-jezero-crater-billions-of-years-ago-artists-concept/

**Background reference:** NASA, _"NASA Watches Mars Light Up During Epic Solar Storm"_ (June 2024), on the May 2024 solar events observed at Mars by Curiosity and MAVEN: https://www.nasa.gov/solar-system/planets/mars/nasa-watches-mars-light-up-during-epic-solar-storm

## AI Tools Used

| Tool | Task | Files or elements affected |
|---|---|---|
| Claude (Anthropic) | Code development and review, DONKI data processing, English translation drafts, technical guidance | `src/App.jsx`, `src/donki.js`, `src/textos.js`, this README |
| ChatGPT (OpenAI) | Planning, cross-checking and auditing | Project plan and code review |
| Gemini Pro (Google) | Initial React prototype and interface sketch (Franco) | Original prototype (tag `v0-franco`), interface sketch |
| Gemini (Google) | AI-generated images for the demo video (Soledad) and the three module illustrations in the game (Franco) | Demo video images, `public/img/soporte-vital.jpg`, `public/img/agricultura.jpg`, `public/img/escudos.jpg` |

- Spanish educational texts: written by the team (Soledad). Labeled in `src/textos.js` as originals or as adaptations.
- English texts: AI draft translation, reviewed by the team.
- AI-generated images are labeled according to the official instructions.
- Canva Pro was used only as a video editor (layout, text, manual animations and Canva design elements), without AI features.

## Team

- **Pablo Vallejo** – coordination, AI-assisted development, testing, documentation
- **Franco Lescano** – game design, original React prototype, Rules v2, interface sketch
- **Soledad Rumiche** – educational design, narrative, texts, presentation

## Run locally

Requires Node.js.

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Tech

React 18 + Vite 5. Icons: lucide-react. Deployed on Vercel.
