# CONCEPT 016 — What is GitHub Actions?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GitHub Actions is a CI/CD automation tool built into GitHub.
It runs workflows (scripts) automatically when events happen —
like pushing code to a branch or creating a pull request.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without CI/CD:
    Developer pushes code → manually SSHs into server → manually
    pulls code → manually restarts services → hopes nothing breaks

  With GitHub Actions:
    Developer pushes code → a robot does ALL the above automatically
    → sends notification if anything fails

  GitHub Actions = hiring a robot assistant that deploys your code
  every time you push, 24/7, without mistakes or forgetting steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Workflows are YAML files stored in .github/workflows/
  2. Secrets (passwords, API keys) are stored encrypted in GitHub Settings
  3. Workflows run on GitHub-hosted runners (free Ubuntu VMs)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM — OUR CI/CD PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Developer
    │ git push origin main
    ▼
  GitHub Actions Runner (ubuntu-latest)
    │
    ├── 1. Checkout code
    │
    ├── 2. SSH into EC2 (appleboy/ssh-action)
    │      │
    │      ├── git pull origin main
    │      ├── Write .env from GitHub Secrets
    │      ├── docker compose down
    │      ├── docker compose up -d --build
    │      │
    │      └── Health check: curl /api/health
    │            ├── Pass → "Platform is UP" ✅
    │            └── Fail → Print logs + exit 1 ❌
    ▼
  Live on EC2 (automated, zero-touch deployment)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: .github/workflows/deploy.yml
  Trigger: push to main branch
  Action: appleboy/ssh-action@master (SSH into EC2)
  Secrets: EC2_HOST, EC2_USER, EC2_SSH_KEY, DB credentials, AWS keys
  Post-deploy: Health check against /api/health endpoint
  Failure: Logs backend container output and exits with error code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I built a GitHub Actions CI/CD pipeline
that triggers on every push to the main branch. The workflow uses
appleboy/ssh-action to SSH into the EC2 instance, pulls the latest
code, recreates the .env file from GitHub Secrets, and rebuilds all
Docker containers. After deployment, it runs a health check against
/api/health — if the check fails, it prints backend logs and exits
with error code 1 to mark the deployment as failed."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Hardcoding secrets (passwords, API keys) in the workflow YAML file
✅ Always use GitHub Secrets. They are encrypted at rest and masked
   in logs. Never commit credentials to version control.
