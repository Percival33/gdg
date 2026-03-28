## Why

Users often crave a specific dish rather than a general cuisine. Current maps and search tools focus on restaurant categories, making it difficult to find exactly what you want to eat nearby. This mobile-optimized React app solves this by allowing users to search by dish name and providing a specialized UI to help them make a final dining decision based on proximity and dish relevance.

## What Changes

- **New React Web Application**: A mobile-first, responsive frontend designed for quick on-the-go searches.
- **Search Interface**: A prominent text input focused on dish-based discovery.
- **Restaurant Result Cards**: Visual cards displaying restaurant information, proximity, and dish-specific details.
- **Decision Support UI**: Interactive elements (like comparisons or highlighted "best match") to help users choose between multiple options.
- **CLI Integration Abstraction**: Hooks and state management to eventually consume data from `gemini cli` and `google maps cli`.

## Capabilities

### New Capabilities
- `dish-search-ui`: The core interface for users to enter their cravings and initiate a search.
- `restaurant-results-display`: A list or grid view of restaurants that serve the searched dish, optimized for mobile viewing.
- `decision-support-ui`: Interactive UI features that assist users in evaluating their options based on search results.

### Modified Capabilities
- (none)

## Impact

- **Frontend**: Development of a new React-based web application.
- **Dependencies**: Introduces React, mobile-responsive CSS patterns, and internal abstractions for future CLI integrations.
- **Infrastructure**: Targeted for deployment on Google Cloud Run.
