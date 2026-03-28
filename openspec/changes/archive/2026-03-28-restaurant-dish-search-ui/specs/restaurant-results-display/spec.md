## ADDED Requirements

### Requirement: Restaurant result cards
The system SHALL display search results as a list of interactive cards, each representing a restaurant that serves the searched dish.

#### Scenario: Displaying results
- **WHEN** search results are returned from the backend
- **THEN** the UI renders a scrollable list of restaurant cards with basic information like name, proximity, and rating

### Requirement: Mobile-optimized layout
The system SHALL display restaurant cards in a single-column layout optimized for mobile screens.

#### Scenario: Mobile viewing
- **WHEN** the app is viewed on a screen with width less than 600px
- **THEN** restaurant cards stack vertically and fill the horizontal space
