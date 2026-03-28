import { useState } from "react";
import type { Restaurant } from "../types";

const MOCK_DATA: Record<string, Restaurant[]> = {
  carbonara: [
    {
      id: "1",
      name: "Pasta Palace",
      rating: 4.8,
      distance: "0.5 mi",
      priceLevel: 2,
      isBestMatch: true,
    },
    {
      id: "2",
      name: "Italian Bistro",
      rating: 4.5,
      distance: "1.2 mi",
      priceLevel: 3,
    },
    {
      id: "3",
      name: "Rome Express",
      rating: 4.2,
      distance: "0.8 mi",
      priceLevel: 1,
    },
  ],
  burger: [
    {
      id: "4",
      name: "Burger Joint",
      rating: 4.7,
      distance: "0.3 mi",
      priceLevel: 1,
      isBestMatch: true,
    },
    {
      id: "5",
      name: "Steak & Shake",
      rating: 4.0,
      distance: "2.5 mi",
      priceLevel: 2,
    },
  ],
};

export const useDishSearch = () => {
  const [results, setResults] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string) => {
    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const normalizedQuery = query.toLowerCase().trim();
      const mockResults = MOCK_DATA[normalizedQuery] || [];
      setResults(mockResults);
      if (mockResults.length === 0) {
        // We still return empty array, not necessarily an error
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return { results, isLoading, error, search };
};
