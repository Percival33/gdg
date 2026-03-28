## Context

The project aims to provide a specialized restaurant discovery experience focused on specific dish cravings. The frontend will be a React web application optimized for mobile users and deployed on Google Cloud Run. It will eventually consume data from `gemini cli` and `google maps cli` developed by other teams.

## Goals / Non-Goals

**Goals:**
- **Mobile-First Experience**: Ensure the UI is highly responsive and intuitive on small screens.
- **Component-Based Architecture**: Create reusable React components for search inputs, result cards, and decision-support overlays.
- **Data Abstraction**: Implement a clear interface for search results that can be easily connected to CLI outputs later.
- **Interactive Decision Support**: Provide UI elements that help users choose between multiple dining options.

**Non-Goals:**
- **Backend Development**: Implementing the logic for the `gemini` or `google maps` CLIs is out of scope.
- **Desktop Optimization**: While it should work on desktop, the primary focus is the mobile view.
- **Authentication**: User accounts and login are not part of this initial UI phase.

## Decisions

### 1. Framework: React with Vanilla CSS
- **Decision**: Use React for state management and component structure, with Vanilla CSS for styling.
- **Rationale**: React is the standard for building interactive UIs, and Vanilla CSS provides maximum flexibility for mobile-specific layout adjustments without the overhead of heavy utility frameworks like Tailwind for a prototype.
- **Alternatives**: Angular was considered but React was chosen for its faster prototyping cycle and strong community support for mobile-responsive components.

### 2. Layout: Mobile-First Flexbox/Grid
- **Decision**: Use a single-column layout using CSS Flexbox for the results list.
- **Rationale**: Simplifies the mobile experience and ensures readability on narrow screens.
- **Alternatives**: Multi-column layouts are less effective for decision-making on mobile.

### 3. Data Flow: Hook-Based CLI Mocking
- **Decision**: Use a custom React hook (e.g., `useDishSearch`) that currently returns mock data but mirrors the expected CLI output structure.
- **Rationale**: Allows UI development to proceed independently of the CLI availability.
- **Alternatives**: Directly hardcoding data into components, but this makes future integration harder.

## Risks / Trade-offs

- **[Risk] CLI Output Format Mismatch**: The final output from the `gemini` and `google maps` CLIs might differ from the current mock data structure.
  - **Mitigation**: Define a strict internal TypeScript interface for search results and map CLI outputs to this interface.
- **[Risk] Performance on Cloud Run**: Large bundles might affect cold start times.
  - **Mitigation**: Keep dependencies minimal and use code splitting if the application grows.
