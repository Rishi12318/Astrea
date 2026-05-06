# Architecture

```mermaid
flowchart LR
    U[User Uploads Image] --> F[FastAPI Backend]
    F --> A[Face Analysis Service]
    A --> C[PyTorch / OpenCV Feature Pipeline]
    C --> M[Skin Tone + Undertone Models]
    M --> R[Recommendation Engine]
    R --> D[(PostgreSQL)]
    R --> X[Explainable AI Layer]
    X --> UI[React Dashboard]
    D --> G[Analytics + Feedback Loop]
```

## Runtime Layers

- Frontend: React + Tailwind dashboard for image upload and recommendations
- API: FastAPI REST services with JWT authentication
- ML: PyTorch training and inference modules with transfer learning support
- Storage: PostgreSQL for users, history, products, and feedback
- Ops: Docker and CI-ready project structure for deployment on Render or Railway

## Request Flow

1. User uploads a face image.
2. Backend validates the request and stores metadata.
3. The face analysis module extracts features and predicts tone and style.
4. The recommender ranks products using embeddings and cosine similarity.
5. The response includes ranked products and human-readable reasoning.
