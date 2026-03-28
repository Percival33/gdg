## Why

The frontend application needs a reliable, scalable hosting solution. Google Cloud Run provides a serverless platform that is well-suited for containerized applications like this Vite-based React app.

## What Changes

- Update Dockerfile for production-ready deployment.
- Configure `cloudbuild.yaml` to build and push the container image to Artifact Registry.
- Deploy the container to Google Cloud Run.
- Configure environment variables for the frontend to connect to the backend (if applicable).

## Capabilities

### New Capabilities
- `frontend-deployment`: Automating the build and deployment process for the React frontend to Cloud Run.
- `cicd-pipeline`: Setting up Cloud Build to handle automatic deployments on git pushes.

### Modified Capabilities

## Impact

Affected code: `web-app/Dockerfile`, `web-app/cloudbuild.yaml`.
Systems: Google Cloud Build, Google Cloud Run, Artifact Registry.
