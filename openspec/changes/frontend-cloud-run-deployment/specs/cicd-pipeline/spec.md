## ADDED Requirements

### Requirement: Cloud Build Automation
The project SHALL include a `cloudbuild.yaml` configuration that automates the process of building, pushing, and deploying the frontend to Cloud Run.

#### Scenario: Full Pipeline Execution
- **WHEN** Cloud Build is triggered (manually or via git push)
- **THEN** it SHALL build the Docker image, push it to Google Container Registry (GCR), and deploy it to Cloud Run.

### Requirement: Deployment Region and Configuration
The deployment SHALL target the `us-central1` region by default and allow unauthenticated access.

#### Scenario: Regional Deployment
- **WHEN** Cloud Build executes the deployment step
- **THEN** the Cloud Run service SHALL be created or updated in the `us-central1` region.
