# 🚀 Googooli — Agentic AI Hackathon MVP

> Team **Googooli** for the **Google Cloud × AI Tinkerers Toronto Hackathon**.  
> We keep scope tight, build fast, and ship a reliable demo by end of day.  
> Frontend: **React + TypeScript + Chakra UI**  
> Backend: **TBD** (to be added after ideation)  
> This repo follows Vector Institute’s **AI Engineering MVP template** practices.

---

## 📚 Table of Contents
- [📌 Project Overview](#-project-overview)
- [🏗️ Features & Architecture](#️-features--architecture)
- [🧰 Tech Stack & Requirements](#-tech-stack--requirements)
- [⚡ Quick Start](#-quick-start)
- [📂 Folder Structure](#-folder-structure)
- [🛣️ Roadmap & Status](#️-roadmap--status)
- [📝 License & Acknowledgments](#-license--acknowledgments)
- [👥 Team & Contributions](#-team--contributions)
- [🌿 Branch Strategy](#-branch-strategy-simple--hackathon-friendly)
- [✍️ Commit Style](#️-commit-style)

---

## 📌 Project Overview

**What**  
A focused **agentic AI** MVP that turns a real workflow into a dependable demo (prompt → plan → tool use → result).

**Why**  
Show useful impact in one day. Prioritize reliability, clarity, and a confident live demo.

**Impact**  
A newcomer can clone, run, and evaluate the UI in minutes; backend hooks are designed to drop in cleanly.

**Demo goal (fill at kickoff)**  
- **Problem:** _[1–2 lines]_  
- **Success criteria:** _[3–5 bullet points of observable outcomes]_  
- **Users / Context:** _[who benefits + where it runs]_

---

## 🏗️ Features & Architecture

**Highlights**  
- 🖥️ **Frontend:** React + TypeScript + Chakra UI (clean UI, accessible components)  
- 🧠 **Agent layer:** _TBD_ (planned: tool-use, planning, evaluation)  
- 📘 **Docs:** optional `/docs` (MkDocs) for images, notes, and how-tos  
- 🧹 **Quality:** simple branch strategy and clear commit style

**High-level flow (current → planned)**  
- Frontend UI scaffolding  
- Placeholder backend calls  
- Planned: backend agent with tool calls and evaluation

> ⚠️ Backend is not implemented yet. This README is structured to support it — add details later without breaking anything.

---

## 🧰 Tech Stack & Requirements

| Area     | Choice (current)                     |
|----------|--------------------------------------|
| Frontend | React + TypeScript + Chakra UI       |
| Backend  | **TBD** (planned: FastAPI, Py 3.11+) |
| Docs     | **Optional**: MkDocs                 |

**Prerequisites (for current frontend)**  
- Node.js **20+**  
- npm **10+** (or pnpm / yarn)

> When the backend lands, add Python 3.11+ and any Docker/Docker Compose steps you adopt.

---

## ⚡ Quick Start

> Fastest way to see something working: run the frontend locally. Backend steps will be added later.

1) **Clone**
```bash
git clone https://github.com/<your-user>/AIHackathon2025.git
cd AIHackathon2025
```
2) **Run the frontend**
```
cd frontend
npm install
npm run dev
# App runs at http://localhost:3010
```

3) **Point the UI to an API (later)**
```
NEXT_PUBLIC_API_BASE=http://localhost:...
```
4) **Scripts & Commands**
```
# from /frontend
npm install           # install dependencies
npm run dev           # start dev server (localhost:3000)
npm run build         # production build
npm run start         # run production build locally
npm run lint          # lint check

```

## Folder Structure
```
/
├─ frontend/                 # React (TS) app with Chakra UI
│  ├─ src/
│  │  ├─ components/         # UI components
│  │  ├─ routes/             # routing approach
│  │  └─ theme/              # Chakra theme overrides
│  └─ package.json
├─ backend/                  # (placeholder) FastAPI project — to be added
├─ docs/                     # (optional) MkDocs docs and /docs/assets
└─ README.md                 # you are here
```

## 🛣️ Roadmap & Status

### Now (hack-day)

- ✅ Frontend scaffold (React + Chakra UI)
- ✅ README and contribution basics
- ⬜ Finalize idea & scope
- ⬜ Implement minimal backend endpoint(s) for the demo
- ⬜ Wire UI → API → result view
- ⬜ Record a short demo clip

### Next

- Tool sandboxing/retries
- Eval harness (quality/latency)
- Tests (unit + basic integration)
- Docs polish (screenshots/GIFs)

### Known limits

- No backend yet; UI uses placeholders
- No auth/rate limits
- Minimal evaluation/guardrails

## 📝 License & Acknowledgments

- License: Apache-2.0 (planned; add LICENSE file if not present).
- Structure and practices inspired by Vector Institute – AI Engineering MVP template.
- UI built with React + TypeScript + Chakra UI.

## 👥 Team & Contributions

**Team Googooli**

- Lead / Presenter: name
- Backend / Agent: name
- Frontend / UX: name
- Data / Eval: name

## 🌿 Branch strategy (simple & hackathon-friendly)

- `main`: stable branch for demo
- `feature/<topic>`: short-lived branches → PR into `main`

## ✍️ Commit style

Small, clear messages:

```bash
feat(ui): add run panel
fix: handle empty input
docs: update quick start
