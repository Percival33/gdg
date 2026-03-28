import { useState } from "react";
import type { Restaurant } from "../types";

export const useDishSearch = () => {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `Find restaurants serving ${query}` }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      await res.json();
      // For now, parse the response or return empty - backend handles the search
      setResults([]);
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, search };
};
