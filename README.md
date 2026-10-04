# 🔍 CrisisLens

> **“From scattered crisis information to clear, trustworthy context and action.”**
>
> Built for the **Hacktoberfest 2026 — DEV “Build for a Friend” Challenge**.

[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Gemma AI](https://img.shields.io/badge/AI-Gemma_2-4285F4?logo=google&logoColor=white)](https://deepmind.google/technologies/gemma/)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 1. The Story: Built for a Friend

### Meet Arjun
**Arjun** is a college student living in **Mohali Sector 70 (Punjab, India)** who commutes daily to **Chandigarh University** via Airport Road.

### The Real Problem
During heavy monsoon storms and flash flooding, Arjun faces a flood of conflicting, unstructured data:
- **WhatsApp groups** circulate frightening forwards claiming dams have collapsed.
- **Local news portals** publish sensational headlines with outdated timestamps.
- **IMD weather bulletins** issue broad regional warnings lacking localized guidance.
- **Neighbors** claim Airport Road is open; meanwhile, district police quietly tweet an emergency closure.

Arjun is left paralyzed with three critical questions:
1. *“Does this storm directly affect my home or college route right now?”*
2. *“Which claims are officially verified versus unconfirmed rumors?”*
3. *“What specific action should I take right this minute?”*

### The Solution: CrisisLens
CrisisLens transforms raw, scattered crisis feeds into a **structured, trustworthy, and personalized intelligence brief** organized directly around Arjun's daily life. While engineered to solve Arjun's exact dilemma, the exact same system scales to protect entire cities and communities during emergencies.

---

## 🏗️ 2. Core Pillars & Capabilities

### 🛡️ Four-Tier Trust & Verification Model
Emergency response cannot tolerate AI hallucinations. CrisisLens categorizes every single piece of extracted information into strict confidence tiers:

| Tier | Badge | Definition & Visual Cue |
|---|---|---|
| **CONFIRMED** | 🟢 Green | Verified by official government bulletins, police advisories, or multi-source consensus. |
| **REPORTED** | 🟡 Amber | Published by credible press or recognized community figures, pending secondary verification. |
| **UNCERTAIN** | ⚪ Gray | Critical data gaps, unverified claims, or situations undergoing rapid change. |
| **CONFLICTING** | 🔴 Red | Direct contradictions detected between sources (with timestamp-aware resolution). |

### 📍 Personalized Impact Intelligence
Instead of generic bulletins, CrisisLens evaluates crisis events against the user's saved locations:
- **Home** (e.g., Mohali Sector 70): Highlights waterlogging depth, neighborhood alerts, and shelter info.
- **College / Work** (e.g., Chandigarh University): Tracks institution status and campus closures.
- **Commute Route**: Identifies road disruptions (e.g., Airport Road light vehicle closure) and recommends safe detour corridors (e.g., Kharar bypass).

### 🤖 10-Step AI Synthesis Pipeline
1. **Source Ingestion**: Ingests official advisories, news articles, and community dispatches.
2. **Entity & Incident Extraction**: Identifies event types, timestamps, severity, and geo-locations.
3. **Deduplication & Clustering**: Merges duplicate reports describing the same physical event.
4. **Contradiction Detection**: Explicitly identifies conflicting reports (e.g., *"Road open 30 min ago"* vs *"Official closure order 10 min ago"*).
5. **Timestamp Resolution**: Automatically prioritizes newer authoritative guidance over older eyewitness accounts.
6. **Action Derivation**: Generates prioritized safety recommendations with clear rationale and urgency flags.
7. **Personalized Context Mapping**: Intersects incidents with the user's locations and transit paths.
8. **Hands-Free Audio Emergency Broadcast**: Built-in Web Speech synthesis to vocalize life-critical briefs for drivers or visually obstructed citizens.
9. **Interactive Geospatial Projection**: Plots events, hazard radiuses, and user waypoints onto an interactive Leaflet map.
10. **Voice-Enabled Grounded Assistant (RAG)**: Natural language question answering with speech-to-text recognition strictly grounded in confirmed sources.

### 🌐 Multi-Disaster Simulation Suite
CrisisLens proves that personal crisis intelligence works across completely different disaster types and geographies:
- 🌊 **Mohali Monsoon Floods** (Friend: Arjun, Student): Urban waterlogging, Airport Road closure dispute, and safe bypass routing.
- 🌫️ **Delhi-NCR Toxic Smog & AQI 480+** (Friend: Priya, Asthma Patient): Severe inversion layer, GRAP-IV road bans, and life-critical Metro rail alternative advice.
- ⛰️ **Mountain Cloudburst & Landslide** (Friend: Vikram, Traveller): NH-7 Badrinath highway severed at Pagal Nala with 400+ vehicles stranded.

---

## 💻 3. System Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 React 19 + Vite Frontend                    │
│   Dashboard • Interactive Map • AI Query • Profile • Audit  │
│   Audio Broadcast • Voice Search • Citizen Hazard Reporter  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                  Node.js / Express Backend                  │
│       Rate Limiting • Security Headers • Route Guards        │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼──────────────┐┌──────────────▼──────────────┐
│     AI Synthesis Engine     ││   MongoDB Atlas Persistence  │
│  • Google Gemma 2 (Open)    ││  • Incidents & Sources      │
│  • Groq / OpenRouter / Ollama││  • Citizen Reports (/reports)│
│  • Multi-Scenario Engine    ││  • User Context & Profiles  │
│    (Zero-API-key fallback)  ││  • In-Memory Graceful Store  │
└─────────────────────────────┘└─────────────────────────────┘
```

- **Frontend**: React 19, React Router 7, Vite, Leaflet, React-Leaflet, Vanilla CSS Design System (dark-mode, glassmorphism, responsive).
- **Backend**: Node.js, Express, Mongoose, Helmet, Express Rate Limit, Dotenv.
- **Database**: **MongoDB Atlas** (M0 free tier compatible) with automatic in-memory fallback.
- **AI Engine**: Open-weight **Gemma 2** via OpenRouter/Groq/Ollama + Pre-computed deterministic `DemoAIProvider`.

---

## 🚀 4. Getting Started (Under 60 Seconds)

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Run Directly from Root:

```bash
# Clone the repository
git clone https://github.com/divyamchoudhary1604/crisislens.git
cd crisislens

# Install and run both Backend & Frontend concurrently
npm run dev
```

Open **`http://localhost:5173`** in your browser.

### 2. Configure Environment (Optional)

The backend comes pre-configured with a **zero-dependency Demo Mode** that runs immediately out of the box without any third-party API keys or external services!

If you want to enable **MongoDB Atlas** persistence:
1. Copy `server/.env.example` to `server/.env`.
2. Add your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crisislens?retryWrites=true&w=majority
   ```

To connect a live **Gemma** open-weights AI provider:
```env
AI_PROVIDER=openrouter   # or groq, ollama
OPENROUTER_API_KEY=your_openrouter_key
AI_MODEL=google/gemma-2-9b-it
```

### 3. Launch the Application

In terminal 1 (Server):
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

In terminal 2 (Client):
```bash
cd client
npm run dev
# Running on http://localhost:5173
```

Open **`http://localhost:5173`** in your browser.

---

## 🎬 5. Interactive Demo Walkthrough

1. **Launch Experience**: Click **“Start Live Demonstration”** on the landing page.
2. **Watch the AI Pipeline**: The system loads 4 simulated emergency sources (IMD warning, news alert, WhatsApp community dispatch, district administration traffic closure).
3. **Explore the Situation Brief**:
   - Observe **Confirmed Facts** vs **Reported Information**.
   - Review the **Contradiction Resolution** card explaining why the official 10:42 AM road closure supersedes the 10:05 AM community report.
   - Examine **Arjun's Personalized Impact**: Notice specific alerts for his Home (Sector 70) and College Route.
4. **Interactive Map**: Navigate to `/map` to view danger zones, waterlogged points, and alternative transit corridors.
5. **Ask CrisisLens (`/ask`)**: Type questions like:
   - *"Is Airport Road open for cars right now?"*
   - *"What should I do if I need to reach Chandigarh University?"*
   - Receive factual, source-attributed responses with zero hallucination.
6. **Citizen Reporting**: Submit community updates via the API (`POST /api/reports`) which instantly persist to MongoDB Atlas.

---

## 🔒 6. Security & Ethics in Crisis Scenarios

- **No Hardcoded Secrets**: All credentials are strictly read from environment variables; `.env` is permanently excluded via `.gitignore`.
- **Hallucination Containment**: When information is ambiguous or unverified, the AI is instructed to return `UNCERTAIN` rather than guessing.
- **Fail-Safe Operation**: If external network calls or database clusters experience latency or dropouts, CrisisLens seamlessly falls back to resilient local memory without crashing.
- **Clear Disclaimers**: CrisisLens explicitly clarifies that it organizes public and community information and does not replace emergency 911/112 services.

---

## 🏆 7. Hacktoberfest 2026 Submission Summary

| Requirement | Implementation in CrisisLens |
|---|---|
| **Challenge** | DEV Challenge: "Build for a Friend" |
| **Friend** | Arjun — student living in flood-prone Mohali, commuting to Chandigarh University |
| **Personal Pain Point** | Information overload, unverified rumors, and dangerous transit ambiguity during monsoon floods |
| **Broader Impact** | 1.2+ billion people worldwide live in disaster-vulnerable urban zones facing the same crisis-information gap |
| **AI Transparency** | Multi-tier trust classification, contradiction resolution, and source-level citations |
| **Database** | MongoDB Atlas with schemas for Incidents, Sources, Timelines, Reports, and Profiles |

---

## 🎯 8. Targeted Sponsor Prize Categories

CrisisLens is specifically engineered to compete across 5 official challenge categories:

1. **🌟 Best Use of Gemma ($200 USD)**:
   - **Gemma 2** (`google/gemma-2-9b-it`) serves as the core intelligence engine powering our 10-step synthesis pipeline, extracting entities, classifying claims into trust tiers, detecting contradictions, and answering user queries.
2. **🌟 Best Use of Render ($200 USD)**:
   - Includes a production-ready [`render.yaml`](file:///c:/Users/divya/Desktop/crisislens/render.yaml) Infrastructure-as-Code Blueprint enabling 1-click cloud deployment of both the Express backend and React 19 frontend.
3. **🌟 Best Use of MongoDB Atlas ($100 USD)**:
   - **MongoDB Atlas** is the persistent cloud data layer storing multi-source reports, citizen dispatches (`/api/reports`), audit timelines, and user location profiles, backed by an automated in-memory fallback.
4. **🌟 Best Use of ElevenLabs ($100 USD)**:
   - Integrated via [`server/services/audio/elevenlabs.js`](file:///c:/Users/divya/Desktop/crisislens/server/services/audio/elevenlabs.js) to vocalize life-critical emergency broadcasts hands-free for citizens driving through floods or visually obstructed.
5. **🌟 Best Use of SerpApi ($100 USD)**:
   - Integrated via [`server/services/search/serpApi.js`](file:///c:/Users/divya/Desktop/crisislens/server/services/search/serpApi.js) to ground the system in live Google News search results when new emergency advisories break.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).

