# SRI LAXMI INDUSTRIES — DevOps Learning Roadmap

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PURPOSE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  This roadmap tracks the journey of turning a static website into
  a production-grade B2B cloud platform with full DevOps tooling.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE LEARNING PATHWAY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6
  Docker       Git         Terraform   CI/CD       Backups     Datadog
  Full-Stack   GitHub      AWS IaC     Pipeline    Security    Monitoring

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — Full-Stack + Docker Containerization          [✅ COMPLETE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal:    Run the entire B2B platform locally in isolated containers
  Stack:   Nginx (frontend), Express (API), PostgreSQL 15 (database)
  Skills:  Dockerfile, Docker Compose, volumes, multi-stage builds,
           Multer file uploads, AWS SDK for S3, connection pooling

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — Git + GitHub Repository                       [✅ COMPLETE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal:    Version-control the project and host a DevOps portfolio repo
  Skills:  git init, branching, remote origins, .gitignore, PATs,
           SSH keys, commit conventions, push/pull workflows

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — Terraform + AWS Infrastructure                [✅ COMPLETE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal:    Provision cloud infrastructure automatically from code
  Skills:  VPC, subnets, internet gateways, Security Groups, EC2,
           S3 buckets, IAM roles/policies, terraform plan/apply/destroy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 4 — CI/CD Pipeline (GitHub Actions)               [✅ COMPLETE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal:    Push to GitHub → auto-deploy to EC2 in seconds
  Skills:  GitHub Actions YAML, workflows/jobs/steps, runners,
           SSH deploy, GitHub Secrets, container rolling updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 5 — Backups + Security Hardening                  [✅ COMPLETE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal:    Automate nightly backups and implement GDPR compliance
  Skills:  Cron jobs, Bash scripting, pg_dump to S3, non-root
           containers, API key auth, GDPR export/delete endpoints

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 6 — Datadog Monitoring                            [✅ COMPLETE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Goal:    Track system health, aggregate logs, set up alerting
  Skills:  Datadog Agent container, Docker metrics, log streaming,
           EU site configuration (datadoghq.eu), dashboard setup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SKILLS FOR YOUR CV
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Containers:      Docker, Docker Compose, multi-stage builds
  IaC:             Terraform (AWS provider)
  Cloud:           AWS EC2, S3, SES, VPC, IAM, Security Groups
  CI/CD:           GitHub Actions (SSH deploy to EC2)
  Monitoring:      Datadog Agent, dashboards, log aggregation
  Databases:       PostgreSQL 15, pg_dump backups, connection pooling
  Web Servers:     Nginx reverse proxy, static file serving
  Backend:         Node.js, Express, REST APIs
  Security:        Non-root containers, GDPR compliance, API key auth
  Scripting:       Bash, cron automation
  Version Control: Git, GitHub, branching strategies
