import { useState, useCallback } from "react";

type ChatResponse = { reply: string; metadata?: Record<string, any> } | null;

export const useChat = () => {
  const [response, setResponse] = useState<ChatResponse>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const base = (import.meta.env.VITE_CHATBOT_URL as string) || "/api";

  const sendMessage = useCallback(
    async (message: string, context?: any) => {
      setLoading(true);
      setError(null);
      setResponse(null);

      const payload = { message, context };

      const maxAttempts = 3;
      let attempt = 0;
      let delay = 500;

      while (attempt < maxAttempts) {
        try {
          const res = await fetch(`${base}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
          }

          const data = await res.json();
          setResponse(data);
          setLoading(false);
          return data;
        } catch (err: any) {
          attempt += 1;
          if (attempt >= maxAttempts) {
            setError(err?.message || "Unknown error");
            setLoading(false);
            throw err;
          }
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
        }
      }
    },
    [base],
  );

  return { response, loading, error, sendMessage };
};

export default useChat;
