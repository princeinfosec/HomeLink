# Frontend

HomeLink's frontend is the React application under [`src/homelink`](../src/homelink).

## Main areas

- `components/` — reusable UI, header, navigation, cards, modals and widgets
- `views/` — route-level screens such as dashboard, rentals, roommates and profile
- `context/` — shared client state and navigation (`AppContext.jsx`)
- `services/` — frontend API client and browser-side service adapters
- `data/` — local demo and fallback data used by the UI
- `App.jsx` — application shell and view selection
- `styles.css` — global design system and responsive UI styles

The route entry point is [`src/routes/index.tsx`](../src/routes/index.tsx).
