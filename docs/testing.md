# Testing Strategy

## Backend

- Use `pytest` with FastAPI `TestClient` for API routes.
- Validate auth-protected endpoints with bearer tokens.
- Cover analytics and recommendation output shapes.

## ML

- Unit test feature extraction and preprocessing transforms.
- Validate model output dimensions for inference.
- Check evaluation artifacts such as confusion matrices and metrics files.

## Frontend

- Keep UI components isolated and testable.
- Verify upload interactions and dashboard rendering with component-level tests if expanded later.
