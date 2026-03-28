## 1. Project Initialization

- [x] 1.1 Scaffold React application with TypeScript
- [x] 1.2 Set up base directory structure for components and hooks
- [x] 1.3 Create base Vanilla CSS styles for mobile-first responsive design
- [x] 1.4 Configure basic Cloud Run deployment settings (Dockerfile/yaml)

## 2. Core Search UI

- [x] 2.1 Implement `SearchBar` component with dish input and submission handling
- [x] 2.2 Create `RestaurantCard` component for mobile view (name, rating, distance)
- [x] 2.3 Implement `ResultsList` container to display a list of `RestaurantCard` components
- [x] 2.4 Add loading and error states to the search workflow

## 3. Decision Support Features

- [x] 3.1 Implement visual highlighting for the "Best Match" result
- [x] 3.2 Add "Select to Compare" functionality to `RestaurantCard`
- [x] 3.3 Create a `ComparisonModal` to show selected restaurants side-by-side
- [x] 3.4 Ensure comparison view is optimized for small screens (scrollable columns)

## 4. Data Integration (Mocked)

- [x] 4.1 Define `DishSearchResult` and `Restaurant` TypeScript interfaces
- [x] 4.2 Implement `useDishSearch` hook to manage search state and return mock data
- [x] 4.3 Connect the hook to the `SearchBar` and `ResultsList`
