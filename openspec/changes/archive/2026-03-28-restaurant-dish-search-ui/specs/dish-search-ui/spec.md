## ADDED Requirements

### Requirement: Dish search input field
The system SHALL provide a prominent text input field on the main screen for users to enter the name of the dish they are craving.

#### Scenario: User types a dish name
- **WHEN** the user types "carbonara" into the search field
- **THEN** the search field reflects the entered text and is ready for submission

### Requirement: Search submission
The system SHALL allow the user to submit the search query using a dedicated search button or by pressing the "Enter" key.

#### Scenario: User submits search
- **WHEN** the user enters a dish name and clicks the search button
- **THEN** the system triggers a search process (to be handled by backend integration) and displays a loading state
