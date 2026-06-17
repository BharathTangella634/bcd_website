# CLAUDE.md

## Project Overview

PinkShieldAI — a breast cancer risk screening web application used across hospitals in India. Collaboration between TANUH, IISc (Indian Institute of Science), and the Ministry of Education. Collects questionnaire responses, calculates the **Snehitha Risk Score** (logistic regression), and provides a stats dashboard.

**GitHub:** `tanuh-bcd/bcd_website` (formerly `tanuh_website`, old URL redirects)

## Tech Stack

- **Frontend:** React 19 + Vite (rolldown-vite 7.x), PWA-enabled, i18next for 12 Indian languages
- **Backend:** Express.js (Node 22, ESM), port 3001
- **Database:** MySQL via Google Cloud SQL Connector (private IP), `@google-cloud/cloud-sql-connector`
- **Storage:** GCS bucket `breast-cancer-image-dataset` for consent images
- **Build:** `npm run build` = `vite build && node scripts/obfuscate.js` (JS obfuscation in prod)

## Project Structure

```
questionnaire-app/
  src/
    main.jsx                    # React entry point
    App.jsx                     # Top-level router: Consent → Questionnaire → ThankYou
    QuestionnaireFlow.jsx       # Orchestrates the full questionnaire flow
    i18n.js                     # i18next configuration
    components/
      Consent.jsx               # Consent form with image capture
      Questionnaire.jsx         # Question rendering with conditional sub-questions
      QuestionBlock.jsx         # Individual question renderer
      ThankYou.jsx              # Risk score display + PDF generation
      Stats.jsx                 # Stats dashboard with recharts
      RiskTable.jsx             # Risk category reference table
      Demo.jsx                  # Landing/demo page
      Navbar.jsx                # Navigation bar
      LanguageSwitcher.jsx      # Language selector (12 languages)
  public/locales/               # Translation files (12 directories)
    english/, hindi/, kannada/, tamil/, telugu/, bengali/,
    gujarati/, marathi/, malayalam/, odia/, punjabi/, assamese/
  backend/
    server.js                   # Express API (loads secrets first, then db.js dynamically)
    secrets.js                  # Fetches DB creds from Google Secret Manager at startup
    Dockerfile                  # node:22-alpine, copies backend/ + mysql_explorer/ + public/
    .env                        # Local dev overrides only — NO secrets in production
  mysql_explorer/
    db.js                       # DB connection pool (Cloud SQL Connector or direct TCP)
    export_schema_csv.js        # Schema export utility
  Dockerfile                    # Frontend: node:20-alpine builder + httpd:2.4-alpine runtime
docker-compose.yml              # Two services: backend (3001) + frontend (3000/nginx)
dc-rebuild.sh                   # Docker compose rebuild helper
deploy/apache/                  # Apache reverse proxy configs with SSL
infra/setup-gcp.sh              # GCP resource provisioning (Secret Manager, WIF, IAM)
.github/workflows/deploy.yml    # GitHub Actions CI/CD with WIF
```

## Authentication & Secrets

**No service account key files.** Everything uses Application Default Credentials (ADC):

- **On GCE VM:** Docker containers reach the metadata server (169.254.169.254) for credentials via the bridge network. The VM's default compute SA (`135552380858-compute@developer.gserviceaccount.com`) has the required roles.
- **In GitHub Actions:** Workload Identity Federation (WIF) provides keyless auth. Pool: `github-actions-pool`, provider: `github-provider`.
- **DB credentials:** Stored in Google Secret Manager (`tanuh-mysql-user`, `tanuh-mysql-password`, `tanuh-mysql-db`, `tanuh-cloud-sql-connection-name`). Backend loads them at startup via `secrets.js` before importing `db.js`. Falls back to env vars for local dev.
- **No GitHub secrets stored.** Zero secrets in the repo.

## Database

- **Cloud SQL instance:** `bcd-prototypes:asia-south1:tanuh-bcd-questionnaire-dev` (private IP: 10.87.192.4)
- **Database:** `bcd_questionnaire`
- **Key tables:**
  - `session_table` — session_id, ip_address, session_start/end_time, snehita_lifetime_risk, risk_category, consent_url
  - `session_data_table` — session_data_id, session_id, question, answer, created_at
  - `bcd_application2.hospitals` — id, name, short_name, state (separate schema, used for hospital registry and stats filtering)
- **Connection:** `db.js` reads env vars lazily via `getConfig()` (not at module scope) to allow Secret Manager to populate them first. Uses Cloud SQL Connector with PRIVATE IP type.

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/session/start` | Create a new session |
| POST | `/api/session/:sessionId/consent` | Upload consent image to GCS |
| POST | `/api/submit` | Submit questionnaire + calculate Snehitha risk score |
| GET | `/api/stats` | Stats dashboard data (risk bins, hospital bins, age bins, monthly) |
| GET | `/api/hospitals` | Hospital list from bcd_application2 |
| GET | `/api/health`, `/health` | Health checks |
| GET | `/api/db-test` | Database connection test |

## Risk Score Calculation

The `calculateSnehithaRisk()` function in `server.js` uses logistic regression:
```
logit(p) = -0.940 + 0.027*age - 0.082*ageAtMenarche + 0.453*irregularCycles
           - 0.892*breastfeeding24M + 0.810*firstDegreeRelatives + 1.420*previousBiopsy
           + 0.811*ageAtFirstLiveBirth2529OrNullipara + 1.035*ageAtFirstLiveBirth30OrMore
```
Risk categories: Baseline (<0.4004), Evident (0.4004–0.574), Significant (0.574–0.795), High (≥0.795).

## Deployment

**GCP project:** `bcd-prototypes`

Push to `main` triggers `.github/workflows/deploy.yml`:
1. WIF auth to GCP (keyless)
2. SSH into `tanuh-bcd-vm` (zone `asia-south1-c`) via IAP tunnel
3. `git pull && dc-rebuild.sh` (docker compose rebuild + Apache reload)
4. Health check (frontend :3000 + backend :3001)
5. Stop VM → create boot disk image → start VM
6. Create instance template (e2-small, 10GB pd-balanced)
7. Rolling-update MIG `tanuh-bcd-mig` (max-surge=1, max-unavailable=0)
8. Cleanup old images/templates (keep 3)

**VM path:** `/app/tanuh_website`

## Development

```bash
# Frontend
cd questionnaire-app && npm install && npm run dev
# Opens at http://localhost:5173

# Backend (needs Cloud SQL access or local MySQL)
cd questionnaire-app/backend && npm install && npm start
# Runs at http://localhost:3001

# Docker (full stack)
docker compose build && docker compose up -d
# Frontend: http://localhost:3000, Backend: http://localhost:3001
```

For local development, set DB credentials in `questionnaire-app/backend/.env` (uncomment the secret lines).

## Important Patterns

- **ESM throughout** — both frontend and backend use `"type": "module"`
- **Server.js boot order matters:** `loadSecrets()` runs first (top-level await), then `db.js` is dynamically imported so env vars are populated before the DB config is read
- **Questionnaire structure** is defined in `public/locales/<lang>/questionnaire.json` — `formStructure` array controls section/question order, `questions` object holds text/options
- **Stats endpoint** filters by valid hospital names from `bcd_application2.hospitals` and only counts sessions with non-null `snehita_lifetime_risk`
- **Frontend makes relative API calls** (`VITE_API_URL=""`) — Apache proxies `/api/*` to the backend container
