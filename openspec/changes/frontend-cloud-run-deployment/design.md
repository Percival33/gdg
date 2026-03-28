## Context

The project is a Vite-based React application that needs to be hosted on Google Cloud Run. While a `Dockerfile` and `cloudbuild.yaml` already exist, this design ensures they are optimized for production and follow Google Cloud's best practices.

## Goals / Non-Goals

**Goals:**
- Containerize the frontend using a multi-stage Docker build with Nginx for production.
- Automate the build and deployment process using Google Cloud Build.
- Ensure the deployment is accessible via Cloud Run's public URL.

**Non-Goals:**
- Backend deployment (currently using mock data).
- Custom domain mapping or SSL certificate management (managed by Cloud Run).
- Setting up a full staging environment (direct production deployment for now).

## Decisions

- **Multi-stage Docker Build**: Use `node:22-alpine` for building and `nginx:stable-alpine` for the final image to minimize size and security surface area.
- **Region**: Deploy to `us-central1` for standard reliability and proximity to other GCP resources.
- **Container Registry**: Use Google Container Registry (`gcr.io`) as specified in the current `cloudbuild.yaml` to maintain compatibility with existing project configurations.
- **Unauthenticated Access**: Allow `--allow-unauthenticated` as it's a public frontend application.

## Risks / Trade-offs

- **Build-time Environment Variables**: If future features require VITE_ prefixed environment variables, they must be passed during the `npm run build` step in the Dockerfile.
- **GCR Deprecation**: Google is moving towards Artifact Registry. While `gcr.io` is still supported, migrating to Artifact Registry should be considered in the future.
- **Nginx Configuration**: Default Nginx configuration might need adjustment if client-side routing (React Router) is introduced.
