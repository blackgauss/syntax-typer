.PHONY: dev backend frontend install clean

dev:
	@make -j2 backend frontend

backend:
	cd backend && uv run python -m uvicorn main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

install:
	cd backend && uv sync
	cd frontend && npm install

clean:
	rm -rf frontend/dist
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
