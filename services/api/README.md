# JVDT Communication Powerhouse – API Scaffold (FastAPI)

This is a minimal API scaffold that maps the blueprint modules to endpoints.

## Quick start (local)
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r services/api/requirements.txt
uvicorn services.api.app.main:app --reload
```

## Endpoints (initial)
- `GET /health` — liveness probe.
- `POST /diagnostics/jvdt7` — accept JVDT-7 raw answers or scores; returns normalized profile.
- `GET /practices/recommendations?axis=Application&stage=Awareness` — stub recommendations.
- `POST /journal/entries` — store text and return AI tags (stub).
- `POST /simulator/run` — run a scenario (stub).

## Next
- Wire PostgreSQL via `docker-compose.yml`.
- Add auth (JWT) and rate limiting.
- Replace stubs with real libraries/content.
