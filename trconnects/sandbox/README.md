# Trconnects Local Sandbox

This sandbox sets up:

- API config first (E2B key)
- Local sandbox API that executes code inside E2B
- Local cloud-like object storage (MinIO)
- Local data storage (PostgreSQL)

## 1) Initialize with your API key

```bash
cd trconnects/sandbox
bash scripts/init_sandbox.sh
```

## 2) Start sandbox services

```bash
bash scripts/start_sandbox.sh
```

## 3) Verify your sandbox API + E2B works

```bash
bash scripts/check_api.sh
```

## 4) Sandbox API endpoints

- Health: `GET http://localhost:8787/health`
- Execute Python: `POST http://localhost:8787/execute`
- Upload file to sandbox: `POST http://localhost:8787/upload`

Example execute call:

```bash
curl -X POST http://localhost:8787/execute \
	-H "Content-Type: application/json" \
	-d '{"code":"print(\"hello from e2b\")"}'
```

## 5) Use storage and database

- MinIO Console: `http://localhost:9001`
- MinIO API: `http://localhost:9000`
- Bucket auto-created from `.env` (`MINIO_BUCKET`)
- PostgreSQL on `localhost:5434`

## 6) Stop sandbox

```bash
bash scripts/stop_sandbox.sh
```

## Notes

- Edit `.env` to change ports, DB names, credentials.
- Persistent data is stored under `sandbox/data/`.
- Sandbox API code is in `sandbox/api/`.
- If Docker Compose is unavailable, scripts still run in API-only mode.
- LLM integration examples are in `sandbox/CONNECT_LLM_TO_E2B.md`.
