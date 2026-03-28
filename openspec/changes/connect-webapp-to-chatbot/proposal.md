# Proposal: Connect web-app UI to Chatbot /chat Endpoint

## What

Add a lightweight integration so the `web-app` UI can send chat requests and display responses from the remote chatbot service at:

https://chatbot-9103059754.europe-west1.run.app/chat

This change will add a reusable client hook, a small `ChatWidget` UI component, and wire the app's environment and dev proxy so the frontend can call the external endpoint securely and reliably.

## Why

- Provide an interactive chat capability to augment search and decision support flows.
- Keep frontend code decoupled from backend by introducing a single client entrypoint (`useChat`) and an environment-configured base URL.
- Handle CORS, error cases, and retries explicitly so production usage is robust.

## Success criteria

- The web-app can send POST requests to `/chat` and render responses in the UI.
- Dev mode uses a local proxy (Vite dev server) or direct CORS if configured.
- The integration is documented and has a small smoke test (manual steps) in the repo README.
