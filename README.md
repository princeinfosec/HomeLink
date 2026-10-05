<div align="center">

<h1><font color="#6C63FF">HomeLink</font></h1>

<p><b>Find a place. Find a roommate. Make it home.</b></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=20232A">
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/TanStack-Start-FF4154?style=flat-square">
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white">
</p>

</div>

<font color="#6C63FF">About</font>

HomeLink is a modern housing marketplace UI for finding rental properties and roommates.

It includes property search, filters, saved listings, comparison, roommate matching, chat, notifications and owner listing tools — all wrapped in a responsive interface.

<font color="#6C63FF">Features</font>

🏠 Rental Listings — Search, filter & view properties

👥 Roommates — Profiles, matching & requests

❤️ Saved — Save properties and roommates

⚖️ Compare — Compare multiple properties

💬 Chat — Conversations & messages

🔔 Notifications — Read and manage alerts

🏢 Owner Dashboard — Add and manage listings

🤖 AI Assistant — Housing-focused assistance

🛡️ Safety — Report & block flows

📱 Responsive — Desktop & mobile friendly

<font color="#6C63FF">Project Structure</font>

HomeLink/
├── public/
├── src/
│   ├── homelink/
│   │   ├── components/    # HomeLink UI
│   │   ├── context/       # Global state
│   │   ├── data/          # Demo & location data
│   │   ├── services/      # API & AI services
│   │   └── views/         # Application screens
│   │
│   ├── components/ui/     # Reusable UI
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   └── styles.css
│
├── backend/
├── frontend/
├── docs/
├── package.json
└── vite.config.ts

Main files

File

Purpose

AppContext.jsx

Shared application state

services/api.js

Backend/API requests

services/aiAssistantService.js

AI assistant logic

data/mockData.js

Demo data

views/

Main application screens

components/

Reusable HomeLink components

styles.css

Global styling

<font color="#6C63FF">Quick Start</font>

pnpm install
pnpm run dev

Production build:

pnpm run build
pnpm run preview

<font color="#6C63FF">Environment</font>

Create .env in the project root:

VITE_API_URL=http://localhost:3000/api

If no URL is provided, the frontend uses:

/api

<font color="#6C63FF">Tech Stack</font>

React 19 · TanStack Start · TanStack Router · Vite · Tailwind CSS · Radix UI · React Hook Form · Zod · Lucide

<div align="center">

<font color="#888888">Clean UI · Simple architecture · Easy to extend</font>

<br><br>

<b><font color="#6C63FF">HomeLink</font></b>

</div>
