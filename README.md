<div align="center">

# <span style="color:#F26B5E">⌂</span> HomeLink

### A better way to find your next place.

**Verified rentals · Compatible roommates · Direct conversations**


<img src="https://img.shields.io/badge/React_19-172033?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
<img src="https://img.shields.io/badge/TanStack_Start-172033?style=flat-square&logo=tanstack&logoColor=FF4154" alt="TanStack Start" />
<img src="https://img.shields.io/badge/Vite-172033?style=flat-square&logo=vite&logoColor=646CFF" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind_CSS_4-172033?style=flat-square&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind CSS 4" /> </div>

---

## The idea

Home hunting should not feel like sorting through noise.

**HomeLink** is a polished housing marketplace UI built around a simple promise: make it easier for students, professionals, families and property owners to find the right fit — without hiding the useful details or getting in the way of a direct conversation.

The experience is intentionally warm and practical. It uses a quiet ivory background, deep ink text, coral actions and soft green verification cues so that listings stay easy to scan and trustworthy at a glance.

> **Find a place that fits your life.**

## What is already here

- **Rental discovery** with search, location selection, filters, availability and listing details

- **Roommate discovery** with profiles, compatibility signals and connection requests

- **Direct chat** for conversations between owners, renters and potential roommates

- **Saved items** for properties and roommate profiles worth coming back to

- **Property comparison** for making a confident shortlist

- **Owner workspace** for listing a property and managing its rental status

- **Guided listing flow** for adding property details and photos

- **Notifications** for messages, requests and account activity

- **Safety tools** including report, block and safety guidance flows

- **AI-ready interactions** for search, chat and photo verification

- **Responsive layouts** that feel at home on both wide screens and small phones

## A quick look at the visual language

<div align="center">

| HomeLink Coral | Deep Ink | Fresh Mint | Soft Ivory |
| --- | --- | --- | --- |
| <span style="color:#F26B5E">● `#F26B5E`</span> | <span style="color:#172033">● `#172033`</span> | <span style="color:#00A88E">● `#00A88E`</span> | <span style="color:#F9F8FC">● `#F9F8FC`</span> |
| Primary actions | Headings and structure | Trust and status | The main canvas |

</div>

The UI uses **Manrope** for everyday interface text, with a restrained editorial serif fallback for larger display moments. Cards are rounded but not overly soft, spacing is compact, and the interface keeps secondary actions quiet so the important decisions stay prominent.

## Get it running

### Requirements

- Node.js **20 or newer**

- pnpm (recommended ) or npm

- An external HomeLink/NestJS API for live authentication and data

### Install

```bash
pnpm install
```

Using npm instead:

```bash
npm install
```

### Start locally

```bash
pnpm dev
```

Vite will print the local URL in the terminal.

### Connect the API (optional)

Create a `.env` file in the project root:

```
VITE_API_URL=http://localhost:3000/api
```

When this variable is not set, the frontend talks to the relative `/api` path and can still be explored with the included demo/fallback data.

### Build for production

```bash
pnpm build
pnpm preview
```

## Useful commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm build` | Create a production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Run ESLint checks |
| `pnpm test` | Run the Vitest suite once |
| `pnpm test:watch` | Run Vitest in watch mode |
| `pnpm format` | Format the project with Prettier |

## How the app is organised

```
HomeLink/
├── src/
│   ├── homelink/
│   │   ├── components/       # Cards, header, navigation, modals and widgets
│   │   ├── context/          # Shared state, session and client navigation
│   │   ├── data/             # Local demo and fallback data
│   │   ├── services/         # API, AI and location service adapters
│   │   ├── views/             # Dashboard, rentals, roommates, chat, profile, etc.
│   │   ├── App.jsx            # Persistent application shell
│   │   └── styles.css         # Design tokens and responsive styling
│   └── routes/                # TanStack route entry points
├── public/                   # Static files and route manifest
├── frontend/                 # Frontend notes
├── backend/                  # External API integration notes
├── docs/                     # Project map and architecture notes
├── package.json
├── vite.config.ts
└── tsconfig.json
```

The application shell lives in `src/homelink/App.jsx`. Views are loaded as needed, while `AppContext.jsx` keeps navigation, session state, saved items and demo behavior in one place. The route entry point is [`src/routes/index.tsx`](src/routes/index.tsx).

## Backend boundary

The frontend keeps its network calls in [`src/homelink/services/api.js`](src/homelink/services/api.js), rather than scattering `fetch` calls across the UI. The client currently groups endpoints for:

- authentication and current-user sessions

- property search, details, creation, status and photo upload

- roommate search and status

- roommate requests

- conversations and messages

- saved properties and roommates

- notifications

- reports and blocking

- AI search, chat and photo verification

The backend itself is **not part of this upload**. It needs to provide the routes expected by `api.js` and remain responsible for authentication, validation, authorization and persistence.

### Browser session keys

| Key | Stored value |
| --- | --- |
| `homelink_token` | Bearer access token |
| `homelink_user` | Current user session |
| `homelink_user_location` | Selected location preference |

## Main screens

| Screen | Role in the experience |
| --- | --- |
| Dashboard | A starting point for featured stays, discovery and suggestions |
| Rentals | Search and browse available properties |
| Rental detail | Inspect a property and start the next action |
| Compare | Put shortlisted properties side by side |
| Roommates | Browse compatible people and profiles |
| Requests | Manage incoming and outgoing roommate connections |
| Chat | Continue direct conversations |
| Saved | Return to properties and people saved earlier |
| Owner dashboard | Keep track of listed properties |
| List property | Add a new property through a guided flow |
| Notifications | See recent activity and updates |
| Profile | Manage account details and preferences |
| Safety | Access trust, reporting and blocking tools |

## Customising the experience

- Change colors, surfaces, typography and responsive primitives in [`src/styles.css`](src/styles.css).

- Update demo listings and roommate data in [`src/homelink/data/`](src/homelink/data/).

- Add reusable interface pieces in [`src/homelink/components/`](src/homelink/components/).

- Add screen-level experiences in [`src/homelink/views/`](src/homelink/views/).

- Keep API changes in [`src/homelink/services/`](src/homelink/services/).

- Use [`src/homelink/context/AppContext.jsx`](src/homelink/context/AppContext.jsx) for shared client behavior.

## Notes before shipping

- The uploaded package contains the **frontend**, not the backend server.

- Add a real API URL and authentication flow before using live user data.

- Add a license file before distributing the project publicly.

- Check the UI at both mobile and desktop widths whenever changing cards, navigation or modals.

## Project notes

- [Frontend guide](frontend/README.md)

- [Backend integration notes](backend/README.md)

- [Project structure](docs/PROJECT-STRUCTURE.md)

- [UI rebuild plan](plan.md)

---

<div align="center">

**HomeLink**

<span style="color:#F26B5E">●</span>  <span style="color:#00A88E">●</span>  <span style="color:#172033">●</span>

*Made for better homes, better matches and more direct connections.*

</div>
