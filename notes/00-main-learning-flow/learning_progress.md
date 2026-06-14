# SRI LAXMI INDUSTRIES — Learning Progress Tracker

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PURPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Check off each concept as you learn it. Matches the 6-phase
  roadmap so you can track progress at a glance.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — Full-Stack + Docker                           [✅ DONE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] What is a Container? (vs Virtual Machines)
  [x] How a Dockerfile works (FROM, RUN, COPY, USER, EXPOSE)
  [x] Multi-stage builds (smaller + more secure images)
  [x] What is Docker Compose? (multi-container orchestration)
  [x] Volumes (persisting PostgreSQL data across restarts)
  [x] Non-root container users (principle of least privilege)
  [x] Nginx reverse proxy (static files + /api/* forwarding)
  [x] Express REST API (routes, middleware, error handling)
  [x] PostgreSQL connection pooling (pg Pool)
  [x] Multer file uploads to AWS S3 (memory storage + SDK)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — Git + GitHub                                  [✅ DONE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] Git vs GitHub (local tracking vs cloud hosting)
  [x] Initializing a repository (git init)
  [x] Staging and committing (git add, git commit)
  [x] Pushing to remote (git remote add, git push)
  [x] .gitignore (excluding .env, .terraform/, *.pem, node_modules)
  [x] Personal Access Tokens (PATs) for HTTPS auth
  [x] Workflow scope permissions for GitHub Actions files

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — Terraform + AWS                               [✅ DONE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] What is Infrastructure as Code (IaC)?
  [x] VPC, subnets, and internet gateways
  [x] EC2 instances (t3.micro in eu-west-1)
  [x] S3 buckets (uploads + backups, private ACL)
  [x] Security Groups (inbound 22, 80, 443 / outbound all)
  [x] IAM roles and policies (least privilege for EC2)
  [x] terraform init / plan / apply / destroy lifecycle
  [x] Key pairs for SSH access (PEM file management)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — CI/CD Pipeline                                [✅ DONE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] What is CI/CD? (Continuous Integration / Deployment)
  [x] GitHub Actions structure (workflows, jobs, steps, runners)
  [x] Storing credentials in GitHub Secrets
  [x] SSH deploy from runner to EC2
  [x] docker compose up --build on remote server
  [x] Trigger on push to main branch

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — Backups + Security                            [✅ DONE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] Nightly pg_dump automated backups
  [x] Cron schedule expressions (0 2 * * *)
  [x] Bash backup script with S3 upload
  [x] GDPR data export endpoint (/api/gdpr/export)
  [x] GDPR data deletion endpoint (/api/gdpr/delete)
  [x] API key authentication (X-Admin-API-Key header)
  [x] Non-root container security

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — Datadog Monitoring                            [✅ DONE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [x] What is telemetry? (metrics, logs, traces)
  [x] Datadog Agent container setup
  [x] Docker socket mounting for container metrics
  [x] EU site configuration (DD_SITE=datadoghq.eu)
  [x] Dashboard creation and live verification
  [x] Container CPU and memory metric streaming
