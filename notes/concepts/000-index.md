# CONCEPT NOTES INDEX — Sri Laxmi Industries
# Total: 18 concept notes across 5 phases

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — LOCAL FULL-STACK + DOCKER COMPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  001-frontend.md       → What is Frontend (HTML/JS/CSS)
  002-backend.md        → What is Backend (Node.js + Express)
  003-api.md            → What is an API (REST endpoints)
  004-database.md       → What is a Database (PostgreSQL)
  005-docker.md         → What is Docker
  006-docker-compose.md → What is Docker Compose
  007-dockerfile.md     → What is a Dockerfile (multi-stage builds)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — NGINX + PRODUCTION DOCKERFILES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  008-nginx.md          → What is Nginx (reverse proxy)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — TERRAFORM + AWS INFRASTRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  009-terraform.md      → What is Terraform (IaC)
  010-aws-vpc.md        → What is a VPC
  011-aws-ec2.md        → What is EC2
  012-aws-s3.md         → What is S3
  013-aws-iam.md        → What is IAM
  014-aws-ses.md        → What is SES (Simple Email Service)
  015-aws-security-groups.md → What are Security Groups

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — CI/CD PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  016-github-actions.md → What is GitHub Actions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — MONITORING + COMPLIANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  017-datadog.md        → What is Datadog
  018-gdpr.md           → What is GDPR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW TO USE THESE NOTES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Read one concept per day in order (001 → 018)
  2. Each note has a ready-made interview answer
  3. Every concept maps to the Sri Laxmi Industries project
  4. Phases match the actual build order of the platform
  5. Use the DIAGRAM section to visualize each concept

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT STACK SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Frontend:    HTML5/CSS/JS served by Nginx container
  Backend:     Node.js/Express API
  Database:    PostgreSQL container
  File uploads: AWS S3 (2 buckets)
  Emails:      AWS SES
  IaC:         Terraform (VPC, EC2, S3, IAM, SGs)
  CI/CD:       GitHub Actions (SSH deploy to EC2)
  Monitoring:  Datadog Agent container
  Backups:     Nightly pg_dump to S3 via cron
  Security:    Non-root containers, GDPR admin API key auth
  Deployment:  Docker Compose on EC2 (4 containers)
  Region:      eu-west-1 (Ireland)
