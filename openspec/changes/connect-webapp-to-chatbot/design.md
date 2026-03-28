# Design: Frontend integration with Chatbot

## Overview

Add a small client library and UI component in `web-app`:

- `web-app/src/hooks/useChat.ts` — hook that exposes `sendMessage(message)` and returns `{response, loading, error}`.
- `web-app/src/components/Common/ChatWidget/ChatWidget.tsx` — minimal UI for input, send button, and response area.
- Environment variable: `VITE_CHATBOT_URL` — default to the provided hosted URL.

## Networking & CORS

- Preferred: Configure the chatbot service to allow the web-app origin or ensure the service supports CORS.
- Dev convenience: add a Vite dev server proxy to forward `/api/chat` to the remote host to avoid CORS in development (update `vite.config.ts`).
- In production, the frontend should call the full `VITE_CHATBOT_URL`.

## Request/Response Contract

- POST to `${baseUrl}/chat` with JSON `{ "message": string, "context": {...} }`.
- Expect JSON response `{ "reply": string, "metadata"?: {...} }`.
- Implement retries with exponential backoff for idempotent failures and propagate errors to the UI.

## Security

- If the chatbot requires authentication, surface a config option and do not hardcode secrets in the frontend. Prefer a backend proxy if secrets are required.

## Failure modes & UX

- Show transient loading state and error messages using `ErrorMessage` and `LoadingSpinner` components under `components/Common`.
- Limit message length and show helpful guidance on failures.

## Files to add/update

- `web-app/src/hooks/useChat.ts`
- `web-app/src/components/Common/ChatWidget/ChatWidget.tsx` and `ChatWidget.css`
- `web-app/vite.config.ts` (dev proxy)
- `web-app/.env` (example) and README update
