# AGENTS.md

## Layout (non-obvious)

- Real app lives in `homeoassist-cse327-main/` (double-nested GitHub-zip artifact). The session root contains only `.vscode/`. Not a git repo.
- Two independent packages, each with its own `package.json` and `node_modules` (already installed):
  - **Frontend:** inner `homeoassist-cse327-main/` root — React 19 + TypeScript + Vite + Tailwind CSS v4
  - **Backend:** `backend/` — Express + pg + Socket.IO + JWT, entry `server.js`

## Commands

Frontend (run from inner `homeoassist-cse327-main/`):
```bash
npm run dev        # Vite dev server on port 3000 (script passes --host 0.0.0.0,
                   #  overriding vite.config.ts host 'homeoassist.local')
npm run build      # vite build (no tsc step)
npx tsc --noEmit   # typecheck — there is NO test or lint script; only "format": "oxfmt"
```

Backend (run from `backend/`):
```bash
npm run dev        # nodemon server.js → http://localhost:5000
npm run migrate    # node migrate.js — runs schema.sql + all *_seed.sql files
```
Health check: `GET http://localhost:5000/api/health`. There are no backend tests; verify by starting the server and hitting endpoints.

## Database

- PostgreSQL 18 runs as a local Windows service. **`psql` is NOT on PATH** — use `"C:\Program Files\PostgreSQL\18\bin\psql.exe"`.
- Credentials live in `backend/.env` (committed to the tree; also hardcoded as fallback in `backend/db/index.js`). DB name: `homeoassist`.
- **`backend/schema.sql` is destructive**: it `DROP TABLE ... CASCADE`s every table before recreating. Re-running it wipes all data.
- Seed order matters (FKs): rubrics → medicines_mdb → dose/potency → symptom tables (bcomplain/complain/disease) → junction tables (b_dis_medi/dis_medi) → medicine relations → app users.
- Default logins seeded by `migrate.js`: `admin@homeoassist.com/admin123`, `anika@homeoassist.com/doctor123`, `raisa@email.com/patient123`.

## acid.mdb data pipeline

- `acid.mdb` (112 MB, Jet 4) at the inner root is the source of truth for the homeopathic repertory (~1.15M rows across 31 tables).
- Existing ETL scripts (`extract_mdb.py`, `mdb_to_pg.py`) require **MS Access COM** (Windows + Access installed). A pure-Python alternative that works here: `pip install access-parser psycopg2-binary` and read tables directly.
- MDB table names are case-sensitive: `bdisMedi`, `disMedi`, `mAn01`, `mCo01`, `mFo01`, `mIn01`, `medi`.
- Quirks: `complain` ≈ `disease` ≈ `symp` and `disMedi` ≈ `disMedi2` ≈ `symp_medi` are near-duplicates — import only one of each set. Bengali text mixes proper Unicode with legacy Bijoy/SutonnyMJ ASCII mojibake (e.g. `gb` = মন). Some numeric columns come back as floats (`rub_ID`) — cast to int.

## Frontend wiring

- **No router.** `src/App.tsx` swaps entire dashboards based on `role` from `AuthContext` (`'home' | 'patient' | 'doctor' | 'admin'`). Per-role screens live in `src/views/{patient,doctor,admin}/`.
- API base URL is hardcoded to `http://localhost:5000/api` in `src/api/client.ts:6`; JWT stored in `localStorage.token` and attached as Bearer automatically.
- Socket.IO client connects via `SocketContext`; server attaches `io` to the Express app (`app.set('io', io)`) so routes can emit events.

## Env gotchas

- `backend/.env` has `OPENAI_API_KEY=your_openai_key_here` (placeholder) — AI chat features fail until replaced.
- Backend CORS allows localhost:3000/5173 origins; frontend hardcodes :5000 for API, so both must run on default ports.
