# SRI LAXMI INDUSTRIES — Architecture Flow

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT THIS DOCUMENT COVERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  The structural flow of the B2B Manufacturing Cloud Platform.
  How users, containers, networks, and AWS services interact.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLOUD INFRASTRUCTURE DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────┐
  │  B2B Client      │
  │  (Browser)       │
  └────────┬────────┘
           │ HTTPS :443 / HTTP :80
           ▼
  ┌──────────────────────────────────────────────────────────┐
  │  AWS EC2 Instance (eu-west-1)  — Docker Compose Host     │
  │                                                          │
  │  ┌──────────────────┐    ┌──────────────────┐            │
  │  │  Nginx Container  │───►│  Express Container│           │
  │  │  (Frontend)       │    │  (Backend API)   │            │
  │  │  Port 80 → 80     │    │  Port 3000       │            │
  │  │                   │    │                  │            │
  │  │  Serves static    │    │  REST API        │            │
  │  │  HTML/CSS/JS      │    │  /api/health     │            │
  │  │                   │    │  /api/enquiries  │            │
  │  │  Reverse proxies  │    │  /api/gdpr/*     │            │
  │  │  /api/* → :3000   │    │                  │            │
  │  └──────────────────┘    └────────┬─────────┘            │
  │                                   │                      │
  │                          ┌────────▼─────────┐            │
  │                          │  PostgreSQL 15    │            │
  │                          │  Container (DB)   │            │
  │                          │  Port 5432        │            │
  │                          │  Volume: pgdata   │            │
  │                          └──────────────────┘            │
  │                                                          │
  │  ┌──────────────────┐                                    │
  │  │  Datadog Agent    │──────► Datadog Cloud (EU)          │
  │  │  Container        │        Metrics + Logs Dashboard    │
  │  └──────────────────┘                                    │
  └──────────────────────────────────────────────────────────┘
           │                          │
           │                          │
   ┌───────▼────────┐       ┌────────▼─────────┐
   │  AWS S3 Bucket  │       │  AWS SES          │
   │  (File Uploads) │       │  (Email Service)  │
   │  CAD/PDF files   │       │  Notifications    │
   └────────────────┘       └──────────────────┘

   ┌────────────────┐
   │  AWS S3 Bucket  │ ◄── Nightly pg_dump cron backup
   │  (DB Backups)   │
   └────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE 4 CONTAINERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. srilaxmi-frontend  — Nginx serving HTML/CSS/JS + reverse proxy
  2. srilaxmi-backend   — Node.js/Express REST API (non-root user)
  3. srilaxmi-db        — PostgreSQL 15 with persistent volume
  4. datadog-agent      — Datadog monitoring agent (EU site)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUEST PATH EXPLANATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. CLIENT REQUEST
     A B2B customer opens srilaxmiengineering.com in their browser.
     DNS resolves to the EC2 public IP in eu-west-1 (Ireland).

  2. NGINX FRONTEND (Port 80)
     Static pages (HTML/CSS/JS/images) are served directly by Nginx.
     Any request to /api/* is reverse-proxied to Express on port 3000.
     This keeps the Node backend hidden inside the Docker network.

  3. EXPRESS BACKEND (Port 3000)
     Processes API calls: validates input, queries the database,
     uploads files to S3, and sends email notifications via SES.

  4. POSTGRESQL DATABASE (Port 5432)
     Stores enquiry records (name, email, phone, message, file URL).
     Data persists across container restarts via Docker volume.

  5. FILE UPLOADS → AWS S3
     CAD/PDF drawings are streamed from Express to a private S3
     bucket using Multer (memory storage) + AWS SDK. The database
     only stores the S3 object URL — no files on the EC2 disk.

  6. EMAIL NOTIFICATIONS → AWS SES
     Express sends confirmation emails to customers and the sales
     team using AWS Simple Email Service.

  7. MONITORING → DATADOG
     The Datadog Agent container reads Docker host metrics and
     streams CPU, memory, and container logs to the Datadog EU
     dashboard for real-time observability and alerting.

  8. NIGHTLY BACKUPS → S3
     A cron job runs pg_dump every night and uploads the SQL dump
     to a separate private S3 bucket for disaster recovery.
