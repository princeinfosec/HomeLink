<div align="center">

HomeLink

Find a place. Find a roommate. Make it home.

A modern housing marketplace built with React, TanStack Start and Vite.

<br />






<br />

Rental listings · Roommates · Chat · Saved homes · Compare · AI assistance

</div>

About

HomeLink is a housing marketplace interface focused on making the search for a rental home or roommate feel simple and familiar.

The project covers the main parts of a typical rental platform: browsing properties, filtering results, viewing details, comparing homes, saving listings, finding roommates, managing requests, chatting, notifications and owner-side listing flows.

The frontend is intentionally split into reusable components, application views, shared state and a central API layer. That makes it easier to replace the demo data with a real backend without rewriting the UI.

What is included

Feature

Description

🏠 Rental Search

Browse, filter and open detailed rental listings

🔎 Property Compare

Select multiple properties and compare them side by side

❤️ Saved Listings

Save properties and roommate profiles for later

👥 Roommates

Discover roommate profiles and send requests

💬 Chat

Conversations and message history through the API layer

🔔 Notifications

View notifications and mark them as read

🏢 Owner Dashboard

Manage listings and start the property listing flow

📸 Property Photos

Property photo upload/audit UI

🛡️ Safety

Report and block flows

🤖 AI Assistant

Housing-focused search and conversational assistance

📱 Responsive UI

Desktop and mobile-friendly navigation

Project structure

The application code is mainly under src/homelink.

HomeLink/
│
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
│
├── src/
│   │
│   ├── homelink/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   ├── cards/
│   │   │   ├── common/
│   │   │   ├── modals/
│   │   │   └── navigation/
│   │   │
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   │
│   │   ├── data/
│   │   │   ├── mockData.js
│   │   │   └── indiaLocations.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── aiAssistantService.js
│   │   │   └── locationService.js
│   │   │
│   │   ├── views/
│   │   │   ├── rentals/
│   │   │   ├── roommates/
│   │   │   ├── owner/
│   │   │   ├── user/
│   │   │   └── welcome/
│   │   │
│   │   ├── App.jsx
│   │   └── HomeLinkApp.jsx
│   │
│   ├── components/
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
│
├── backend/
│   └── README.md
│
├── frontend/
│   └── README.md
│
├── docs/
│   └── PROJECT-STRUCTURE.md
│
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── components.json

Where the important stuff lives

src/homelink/components/

Reusable HomeLink UI. Cards, navigation, modals, AI widgets and smaller shared pieces live here.

src/homelink/views/

Actual application screens. If you're looking for the page that a user sees, this is usually the first place to check.

src/homelink/context/AppContext.jsx

Shared application state. Things that need to be available across multiple screens are handled here.

src/homelink/services/api.js

The main API client. Keeping requests here prevents individual components from becoming full of fetch logic.

src/homelink/data/

Demo/fallback data and location data used by the frontend.

src/components/ui/

Reusable low-level UI components used across the application.

Application flow

                         ┌──────────────────┐
                         │      HomeLink    │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
        Rental Search         Roommates           User Area
             │                    │                    │
       ┌─────┼─────┐         ┌────┴────┐        ┌────┼────┐
       │     │     │         │         │        │    │    │
       ▼     ▼     ▼         ▼         ▼        ▼    ▼    ▼
     View  Save  Compare   Profile   Request   Chat Saved Notify
       │
       ▼
    Property
    Details
       │
       ▼
      API
       │
       ▼
  Backend / Database

API layer

The frontend communicates with the backend through:

src/homelink/services/api.js

The API base URL comes from:

VITE_API_URL

If it is not provided, the frontend falls back to:

/api

For local development:

VITE_API_URL=http://localhost:3000/api

For a deployed backend:

VITE_API_URL=https://api.example.com/api

API areas

auth
properties
roommates
roommateRequests
chat
saved
notifications
reports
ai

Some of the routes expected by the client are:

POST  /auth/login
POST  /auth/register
GET   /auth/me

GET   /properties/search
GET   /properties/:id
POST  /properties
PATCH /properties/:id/status

GET   /roommates/search
GET   /roommates/:id

POST  /roommate-requests
GET   /roommate-requests/sent
GET   /roommate-requests/received
PATCH /roommate-requests/:id/accept
PATCH /roommate-requests/:id/decline

GET  /conversations
GET  /conversations/:id/messages
POST /conversations/:id/messages

GET   /notifications
PATCH /notifications/:id/read
PATCH /notifications/read-all

POST /reports
POST /reports/block

POST /ai/search
POST /ai/chat
POST /ai/verify-photo

The exact backend implementation is separate from this frontend package. Check backend/README.md for the integration notes.

Authentication

The client uses a token-based authentication flow.

Login / Register
       │
       ▼
    API call
       │
       ▼
 Access token
       │
       ▼
 localStorage
 homelink_token
       │
       ▼
 Authorization: Bearer <token>
       │
       ▼
 Protected API requests

For production, token handling, expiration, refresh and server-side authorization should be enforced by the backend.

AI assistant

The housing assistant lives in:

src/homelink/services/aiAssistantService.js

It is designed around housing-related requests rather than being a generic chatbot.

Typical use cases include:

Finding homes within a budget

BHK/room searches

Locality suggestions

Roommate recommendations

Rental checklists

Listing guidance

Owner/tenant questions

Property-specific questions

The current service can work with the application's local data. It can also be replaced or extended with a real backend/LLM endpoint.

Keep private AI/API keys on the server. Do not put secret keys inside VITE_* variables.

Getting started

Requirements

You'll need:

Node.js

pnpm

The repository includes pnpm-lock.yaml, so pnpm is the preferred package manager.

1. Install dependencies

pnpm install

2. Configure the API

Create .env in the project root:

VITE_API_URL=http://localhost:3000/api

If you're only working with the frontend/demo data, the variable can be omitted.

3. Start development

pnpm run dev

4. Build for production

pnpm run build

5. Preview the production build

pnpm run preview

Useful commands

# Start development server
pnpm run dev

# Production build
pnpm run build

# Development-mode build
pnpm run build:dev

# Preview production build
pnpm run preview

# Check code
pnpm run lint

# Format project files
pnpm run format

Styling & UI

The project uses Tailwind CSS along with reusable UI primitives.

Global styling:

src/styles.css

Reusable UI:

src/components/ui/

HomeLink-specific UI:

src/homelink/components/

The idea is to keep the visual system centralized instead of adding one-off styles everywhere.

Data

Demo data is kept here:

src/homelink/data/mockData.js

Location data:

src/homelink/data/indiaLocations.js

This makes it possible to run and develop the UI without depending on a fully populated production database.

Once a backend is connected, API responses can become the primary data source.

Main files you'll probably edit

If you want to change...

Start here

Main app shell

src/homelink/App.jsx

HomeLink application

src/homelink/HomeLinkApp.jsx

Shared state

src/homelink/context/AppContext.jsx

API requests

src/homelink/services/api.js

AI behaviour

src/homelink/services/aiAssistantService.js

Demo data

src/homelink/data/mockData.js

Property cards

src/homelink/components/cards/PropertyCard.jsx

Roommate cards

src/homelink/components/cards/RoommateCard.jsx

Header

src/homelink/components/navigation/Header.jsx

Mobile navigation

src/homelink/components/navigation/BottomNav.jsx

Authentication modal

src/homelink/components/modals/AuthModal.jsx

Rental screens

src/homelink/views/rentals/

Roommate screens

src/homelink/views/roommates/

Owner screens

src/homelink/views/owner/

User screens

src/homelink/views/user/

Global CSS

src/styles.css

UI primitives

src/components/ui/

Routes

src/routes/

Build setup

vite.config.ts

Dependencies/scripts

package.json

Production checklist

Before putting the project live:

Set the production VITE_API_URL

Connect the production backend

Configure CORS

Enable HTTPS

Verify authentication and authorization

Replace demo data where necessary

Check property/roommate request permissions

Test image uploads and file limits

Test report and block actions

Keep server secrets out of frontend code

Run lint

Run a production build

Test both desktop and mobile layouts

Tech stack

Technology

Used for

React 19

UI

TanStack Start

Application framework

TanStack Router

Routing

Vite

Development & builds

TypeScript

Configuration and typed tooling

JavaScript / JSX

HomeLink application code

Tailwind CSS

Styling

Radix UI

Accessible UI primitives

React Hook Form

Forms

Zod

Validation

Lucide React

Icons

Recharts

Charts

Sonner

Toast notifications

date-fns

Date utilities

A note about the backend

This package is primarily the HomeLink frontend/application.

The frontend expects a backend API and does not contain a complete production database/server implementation.

The integration point is:

src/homelink/services/api.js

and the backend URL is controlled through:

VITE_API_URL

If you're setting up the backend from scratch, use the API methods in api.js as the contract the server needs to satisfy.

Development notes

A few things are worth keeping consistent while working on the project:

Keep HTTP/API logic inside services/.

Keep reusable components inside components/.

Keep full screens inside views/.

Use AppContext.jsx for genuinely shared client state.

Reuse components from src/components/ui/ instead of duplicating basic controls.

Avoid editing generated routing files by hand.

Never commit production secrets.

Run the build before deploying.

<div align="center">

Built for a simpler way to find home.

HomeLink

</div>
