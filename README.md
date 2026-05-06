# AI-Powered Personalized Makeup Recommendation System

A production-style, AI/ML-focused beauty-tech platform that analyzes uploaded face images and recommends makeup products, shades, and styles using PyTorch, FastAPI, and a modular backend architecture.

## Highlights

- FastAPI backend with JWT authentication and Swagger docs
- PyTorch-based facial analysis and skin tone classification pipeline
- Feature extraction with OpenCV and MediaPipe-compatible interfaces
- Recommendation engine using embeddings, cosine similarity, and ranking
- PostgreSQL-ready schema with analytics and user feedback tracking
- React + Tailwind frontend with image upload and recommendation dashboard
- Dockerized deployment with CI/CD-friendly structure

## Project Structure

- `backend/` FastAPI application, auth, services, database, and API routes
- `backend/tests/` API and analytics tests
- `backend/migrations/` Alembic migration scaffold
- `ml/` training, preprocessing, inference, and evaluation assets
- `frontend/` React application and dashboard UI
- `docs/` architecture and ER diagram notes

## Core API Endpoints

- `POST /upload-image`
- `POST /analyze-face`
- `POST /predict-skin-tone`
- `POST /recommend-products`
- `POST /save-history`
- `POST /user-feedback`

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

On first boot, the application creates the database schema and seeds the product catalog automatically.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend now calls the live API for authentication, face analysis, recommendations, feedback, analytics, and beauty chat.

### 3. Environment Variables

Copy `.env.example` to `.env` and update database, JWT, and model paths.

### 4. Database Migrations

```bash
cd backend
alembic upgrade head
```

### 5. Run Tests

```bash
cd backend
pytest
```

### 6. Build Frontend

```bash
cd frontend
npm run build
```

## Deployment

The repository is structured for Docker, Render, Railway, or Hugging Face Spaces deployment. See `docs/architecture.md` and `docker-compose.yml` for the runtime layout.

Deployment notes are documented in `docs/deployment.md`.

If you want the chatbot to use Ollama, run a local Ollama server and keep `OLLAMA_BASE_URL` and `OLLAMA_MODEL` aligned with your environment.

## Testing Strategy

The repository includes backend API tests and analytics coverage scaffolding under `backend/tests/`. The broader testing plan is described in `docs/testing.md`.

## Analytics

An admin analytics endpoint is available at `/admin/analytics` for dashboard metrics such as user count, product count, recommendation history, and feedback volume.

## ML Workflow

1. Detect and crop the face region.
2. Extract facial geometry and color features.
3. Run CNN and transfer-learning classifiers for tone, undertone, and style.
4. Score products against user features and preferences.
5. Log feedback to improve recommendation ranking over time.

## Notes

This scaffold is intentionally built to look industry-ready for internship and portfolio use. The ML modules are organized for real training and inference flows, and the backend is structured to support incremental production hardening.

The next expected production step is replacing demo in-memory catalog logic with real catalog persistence and attaching the frontend to the live API.
