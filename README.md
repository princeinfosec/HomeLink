<div align="center">

# <span style="color:#F26B5E">⌂</span> HomeLink

### **Verified stays. Direct conversations. Better living.**

<p>A modern, responsive housing marketplace UI for discovering verified rentals, finding compatible roommates, and connecting directly with owners — with zero brokerage at its core.</p>

<p>
  <img src="https://img.shields.io/badge/✨_Highlights-F26B5E?style=for-the-badge&labelColor=172033" alt="Highlights" />
  <img src="https://img.shields.io/badge/🚀_Quick_Start-00A88E?style=for-the-badge&labelColor=172033" alt="Quick Start" />
  <img src="https://img.shields.io/badge/🧭_Architecture-6C63FF?style=for-the-badge&labelColor=172033" alt="Architecture" />
</p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Start-1.168-FF4154?style=flat-square" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
</p>

</div>

---

## 🏡 About HomeLink

**HomeLink** is a warm, trustworthy and mobile-friendly housing marketplace experience designed for students, professionals, families and property owners.

The interface combines a calm ivory canvas, deep ink typography, HomeLink coral actions, sage verification accents and compact marketplace workflows to make finding a home feel simple and human.

> **Find a place that fits your life.**

## ✨ Highlights

- **Verified rental discovery** — browse homes, apartments and stays with clear availability and verification signals.
- **Roommate matching** — discover compatible flatmates, view profiles and send connection requests.
- **Direct owner conversations** — chat with owners or potential roommates without unnecessary brokerage friction.
- **Smart search experience** — location-aware search, filters, intent tabs and AI-assisted search flows.
- **Property comparison** — save multiple properties and compare them side by side.
- **Save and revisit** — bookmark properties and roommates for later.
- **Owner tools** — list a property, manage listings, update rental status and explore featured listing plans.
- **Safety-first interactions** — report and block flows, safety guidance and trust-oriented UI patterns.
- **Responsive by design** — editorial desktop layout with a focused mobile stream and sticky bottom navigation.
- **Demo-ready fallback data** — explore the UI with local mock data when the backend is not connected.

## 🎨 Design direction

| Area | HomeLink approach |
| --- | --- |
| **Visual language** | Warm editorial marketplace with rounded cards, soft surfaces and compact information density |
| **Brand color** | HomeLink Coral `#F26B5E` for primary actions and the signature location mark |
| **Typography** | Manrope for UI text with a Georgia-style editorial fallback for display headings |
| **Interaction** | Clear card targets, local save actions, compact secondary controls and short transitions |
| **Responsive behavior** | Split discovery rail on desktop; single readable stream with bottom navigation on mobile |
| **Accessibility intent** | Strong contrast, readable sizing and reduced-motion-friendly transitions |

## 🚀 Quick start

### Prerequisites

- **Node.js 20+**
- **pnpm** (recommended) or npm
- An external HomeLink/NestJS API, if you want live data and authentication

### 1. Install dependencies

```bash
pnpm install
```

> With npm, use `npm install` instead.

### 2. Configure the API (optional)

Create a `.env` file in the project root when connecting to a backend:

```env
VITE_API_URL=http://localhost:3000/api
```

If `VITE_API_URL` is not provided, the frontend uses the relative `/api` path. The backend is **not included** in this package.

### 3. Start development

```bash
pnpm dev
```

Open the local URL shown by Vite in your browser.

### 4. Production build

```bash
pnpm build
pnpm preview
```

## 🧪 Quality checks

```bash
pnpm lint          # ESLint
pnpm test          # Run Vitest once
pnpm test:watch    # Vitest watch mode
pnpm format        # Format source files
```

## 🧭 Main user flows

| Flow | What it covers |
| --- | --- |
| **Dashboard** | Featured stays, discovery cards, roommate suggestions and quick navigation |
| **Rentals** | Search, browse, filter, view details and compare properties |
| **Roommates** | Browse profiles, inspect compatibility and manage requests |
| **Chat** | Conversations and direct messaging with owners or connections |
| **Saved** | Saved properties and roommate profiles |
| **Owner dashboard** | Manage listed properties and availability/status |
| **List property** | Guided listing wizard with photo and detail workflows |
| **Notifications** | Requests, messages and activity updates |
| **Profile** | Account, preferences and session actions |
| **Safety** | Trust, reporting and blocking experiences |

## 🔌 Backend integration

The frontend API boundary is centralized in [`src/homelink/services/api.js`](src/homelink/services/api.js). It supports authentication, properties, roommates, roommate requests, conversations, saved items, notifications, safety reports, blocking, AI search, AI chat and photo verification.

### Session storage

| Key | Purpose |
| --- | --- |
| `homelink_token` | Bearer access token used by the API client |
| `homelink_user` | Current user session cached in the browser |
| `homelink_user_location` | Selected location used by the UI |

> **Important:** This repository contains the frontend only. The external backend should expose the API routes expected by `api.js` and handle authentication, validation, storage and authorization securely.

## 🗂️ Project structure

```text
HomeLink/
├── frontend/                 # Frontend guide
├── backend/                  # External backend integration guide
├── docs/                     # Architecture and project notes
├── public/                   # Static assets and route manifest
├── src/
│   ├── homelink/
│   │   ├── components/       # Header, cards, modals, navigation and widgets
│   │   ├── context/          # Shared app state and navigation
│   │   ├── data/             # Demo and fallback data
│   │   ├── services/          # API, AI and location service adapters
│   │   ├── views/             # Dashboard, rentals, roommates, chat, profile, etc.
│   │   ├── App.jsx            # Application shell and view orchestration
│   │   └── styles.css         # Design tokens and responsive styles
│   └── routes/                # TanStack route entry points
├── package.json               # Scripts and dependencies
├── vite.config.ts             # Vite/TanStack configuration
└── tsconfig.json              # TypeScript configuration
```

## 🧱 Tech stack

- **React 19** — component-driven UI
- **TanStack Start / TanStack Router** — application shell and routing
- **TypeScript** — typed project configuration and route files
- **Vite** — fast development and production bundling
- **Tailwind CSS 4** — utility styling and design tokens
- **Radix UI** — accessible interaction primitives
- **Lucide React** — interface icons
- **React Hook Form + Zod** — form handling and validation utilities
- **Vitest + Testing Library** — testing foundation

## 🛠️ Customization guide

- Update brand tokens, colors and typography in [`src/styles.css`](src/styles.css).
- Add or modify local demo content in [`src/homelink/data/`](src/homelink/data/).
- Add reusable UI pieces in [`src/homelink/components/`](src/homelink/components/).
- Add screen-level experiences in [`src/homelink/views/`](src/homelink/views/).
- Keep backend calls inside [`src/homelink/services/`](src/homelink/services/) rather than calling `fetch` directly from views.
- Use [`src/homelink/context/AppContext.jsx`](src/homelink/context/AppContext.jsx) for shared client state and navigation behavior.

## 📚 Documentation

- [Frontend guide](frontend/README.md)
- [Backend integration notes](backend/README.md)
- [Project structure](docs/PROJECT-STRUCTURE.md)
- [HomeLink rebuild plan](plan.md)

## 🤝 Contributing

1. Create a feature branch.
2. Keep UI changes responsive across desktop and mobile breakpoints.
3. Reuse the existing design tokens and interaction patterns.
4. Run `pnpm lint`, `pnpm test` and `pnpm build` before opening a pull request.
5. Keep API integration changes centralized and document new environment variables.

## 📄 License

No license file is included in the uploaded package. Add a license before distributing or publishing the project.

---

<div align="center">

**Made for better homes, better matches and more direct connections.**

<span style="color:#F26B5E">●</span> <span style="color:#00A88E">●</span> <span style="color:#6C63FF">●</span>

</div>
