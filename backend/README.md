# Backend

The backend is an external NestJS/API service. Its base URL is configured through `VITE_API_URL`; when unset, the frontend uses `/api`.

This source package does not contain the backend server implementation. The frontend-to-backend boundary is centralized in [`src/homelink/services/api.js`](../src/homelink/services/api.js), which contains authentication, property, roommate, chat, saved-items, notifications, AI and report endpoint calls.

## Local backend expectation

- API base: `VITE_API_URL` or `/api`
- Auth token: stored as `homelink_token`
- Current user session: stored as `homelink_user`
- Logout calls `POST /auth/logout` and clears the client session
