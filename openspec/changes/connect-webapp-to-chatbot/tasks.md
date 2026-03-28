# Tasks: Implement Chatbot integration

- [x] 1. Create `useChat` hook
  - Path: `web-app/src/hooks/useChat.ts`
  - Implement `sendMessage(message: string, context?: any)` → POST to `${base}/chat` using `fetch`.
  - Return `{ response, loading, error, sendMessage }`.
  - Add basic retry logic and error mapping.

- [x] 2. Add `ChatWidget` component
  - Path: `web-app/src/components/Common/ChatWidget/ChatWidget.tsx`
  - Use `useChat` for sending and receiving messages.
  - Reuse `LoadingSpinner` and `ErrorMessage` for UX.

- [x] 3. Dev proxy and env
  - Added `VITE_CHATBOT_URL` to `.env.example` in `web-app` and README.
  - Updated `web-app/vite.config.ts` dev server proxy to forward `/api/chat` to the hosted chatbot.

- [x] 4. Wire into UI
  - Added a small launcher button in `App.tsx` to show `ChatWidget` modal.

- [ ] 5. Tests & verification
  - Manual smoke test instructions in README: how to run dev server and call chat flow.
  - Optional: add unit tests for `useChat` (mock fetch).

- [x] 6. Documentation
  - Updated `web-app/README.md` with env and usage instructions.

- [ ] 7. Review & deploy
  - Run the app locally, verify chat requests succeed in dev (proxy) and that production env var works.
