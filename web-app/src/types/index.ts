export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: string;
  priceLevel: number;
  isBestMatch?: boolean;
}

export interface DishSearchResult {
  query: string;
  results: Restaurant[];
}
