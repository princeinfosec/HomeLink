# HomeLink project structure

```text
HomeLink/
├── frontend/                 # Frontend guide; implementation lives in src/homelink
├── backend/                  # Backend integration guide; server is external
├── docs/                     # Architecture and project notes
├── public/                   # Static assets and route manifest
├── src/
│   ├── homelink/              # React frontend implementation
│   │   ├── components/        # Shared UI components
│   │   ├── context/           # App-wide client state
│   │   ├── data/              # Demo/fallback data
│   │   ├── services/          # API client and browser services
│   │   ├── views/             # Screen-level views
│   │   ├── App.jsx            # App shell
│   │   └── styles.css         # Design system and responsive styles
│   └── routes/                # TanStack route entry
├── package.json               # Scripts and dependencies
└── vite.config.ts             # Vite/TanStack build configuration
```

## Important distinction

There is no backend server implementation in this uploaded package. `src/homelink/services/api.js` is the frontend API client that connects to the external backend through `VITE_API_URL` or `/api`.
