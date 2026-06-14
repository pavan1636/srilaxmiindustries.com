# Deployment Process — Sri Laxmi Industries
# Understanding where code builds and runs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOCAL DEVELOPMENT vs PRODUCTION — OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  LOCAL (Your Laptop)              PRODUCTION (AWS EC2)
  ─────────────────                ───────────────────
  docker compose up --build        GitHub Actions SSH deploy
  localhost:80                     EC2 Public IP / Domain
  Local PostgreSQL container       Local PostgreSQL container (same)
  Uploads → local filesystem       Uploads → Private S3 Bucket
  Emails → Console mock log        Emails → AWS SES (real delivery)
  Monitoring → none                Monitoring → Datadog Cloud Dashboard
  Backups → none                   Backups → Nightly pg_dump → S3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOCAL DEVELOPMENT LOOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal: Code editing and fast testing.
  Environment: Local machine with Docker Desktop.

  Step 1: Edit backend code or HTML/CSS files
  Step 2: docker compose up -d --build
           → Builds fresh images from Dockerfiles
           → Starts 4 containers (frontend, backend, db, datadog)
           → Creates private bridge network
  Step 3: Open http://localhost in browser
  Step 4: Submit test enquiry → check docker compose logs backend
  Step 5: If code changes needed → edit → docker compose restart backend

  File uploads: Saved to local /uploads/ directory (S3 fallback)
  Emails: Logged to console (SES credentials not configured locally)
  Database: Isolated PostgreSQL container with named volume

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRODUCTION DEPLOYMENT LIFECYCLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal: Fast, secure, public access with backups and monitoring.

  Phase 1 — IaC Provisioning (one-time):
    cd terraform
    terraform init      → Download AWS provider
    terraform plan      → Preview 16 resources
    terraform apply     → Provision VPC, EC2, S3, IAM, SG
    → EC2 boots with Docker pre-installed (user data script)

  Phase 2 — Initial Deployment (one-time):
    ssh -i key.pem ubuntu@<EC2-IP>
    git clone https://github.com/pavan1636/srilaxmiindustries.com.git
    cd srilaxmiindustries.com
    cp .env.example .env   → Edit with real credentials
    docker compose up -d --build

  Phase 3 — CI/CD (automated, every push):
    Developer pushes to main branch
    → GitHub Actions triggers deploy.yml
    → SSH into EC2
    → git pull, write .env from Secrets, docker compose up --build
    → Health check /api/health
    → Pass = live, Fail = print logs + exit 1

  Phase 4 — Runtime (24/7):
    Nightly: cron runs backup.sh → pg_dump → gzip → S3
    Continuous: Datadog Agent streams metrics to cloud dashboard
    Self-healing: restart: always on all containers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEPLOYMENT DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Developer Laptop          GitHub             AWS EC2 (eu-west-1)
  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
  │ git push     │───►│ Actions      │───►│ SSH + git pull       │
  │ origin main  │    │ Workflow     │    │ docker compose up    │
  └──────────────┘    │ (deploy.yml) │    │ Health check ✅       │
                      └──────────────┘    └──────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INFRASTRUCTURE TEARDOWN (COST CONTROL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  After capturing screenshots and verifying deployment:
    exit                     → Log out of EC2
    cd terraform
    terraform destroy        → Remove ALL 16 AWS resources
    → Output: "Destroy complete! Resources: 16 destroyed."
    → AWS bill stays at $0.00
