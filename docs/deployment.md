# Deployment Guide

## Backend

- Build the Docker image from `backend/`.
- Mount environment variables from `.env` or your deployment platform.
- Apply database migrations before the application starts.
- Run the FastAPI service behind a production ASGI server.

## Frontend

- Build the React app with Vite.
- Serve the static bundle from your frontend host or CDN.
- Point `VITE_API_BASE_URL` to the deployed backend URL.

## Recommended Environments

- Render for simple PaaS deployment
- Railway for quick full-stack deployment
- Hugging Face Spaces for demo-style showcasing

## Operational Notes

- Use PostgreSQL in production.
- Use Redis if caching or session throttling is enabled.
- Store trained model artifacts in persistent storage or object storage.
