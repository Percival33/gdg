## ADDED Requirements

### Requirement: Frontend Containerization
The frontend application SHALL be containerized using a multi-stage Docker build that results in a production-ready image.

#### Scenario: Production Image Build
- **WHEN** `docker build` is executed on the `web-app` directory
- **THEN** a multi-stage build process should produce a lightweight image served by Nginx

### Requirement: Cloud Run Deployment
The frontend image SHALL be deployable to Google Cloud Run as a managed service with unauthenticated access allowed.

#### Scenario: Successful Deployment
- **WHEN** `gcloud run deploy` is executed with the built image
- **THEN** the service is accessible via a public URL provided by Cloud Run
