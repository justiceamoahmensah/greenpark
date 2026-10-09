.PHONY: dev build test lint typecheck e2e qrs

dev:
	cd apps/web && npm run dev

build:
	cd apps/web && npm run build

test:
	cd apps/web && npm test

lint:
	cd apps/web && npm run lint

typecheck:
	cd apps/web && npm run typecheck

e2e:
	cd apps/web && npm run test:e2e

qrs:
	cd apps/web && npm run generate:qrs
