.PHONY: help install run dev migrate revision seed export test test-cov lint fmt typecheck check smoke clean

help:
	@echo "TheraViva backend — common tasks"
	@echo "  make install   Install dependencies (uv sync --all-groups)"
	@echo "  make run       Run the API with uvicorn (reload)"
	@echo "  make migrate   Apply database migrations (alembic upgrade head)"
	@echo "  make revision  Autogenerate a migration (m=\"message\")"
	@echo "  make seed      Seed catalog content"
	@echo "  make export    Export frontend src/data → seed/content.json"
	@echo "  make test      Run the test suite"
	@echo "  make lint      Ruff"
	@echo "  make typecheck mypy"
	@echo "  make check     lint + typecheck + test"
	@echo "  make smoke     Boot uvicorn and exercise real HTTP"

install:
	uv sync --all-groups

run:
	uv run uvicorn app.main:app --reload

migrate:
	uv run alembic upgrade head

revision:
	uv run alembic revision --autogenerate -m "$(m)"

seed:
	uv run python -m scripts.seed

export:
	npx --yes tsx scripts/export_frontend_data.mjs

test:
	uv run pytest

test-cov:
	uv run pytest --cov=app --cov-report=term-missing

lint:
	uv run ruff check .

fmt:
	uv run ruff format .

typecheck:
	uv run mypy app

check: lint typecheck test

smoke:
	./scripts/smoke.sh

clean:
	rm -rf var/*.db .pytest_cache .mypy_cache .ruff_cache
