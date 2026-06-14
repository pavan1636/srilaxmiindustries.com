# Common DevOps Mistakes — Sri Laxmi Industries
# Learn from these so you never make them in production

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 1: COMMITTING SECRETS TO GIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Running git add .env and pushing database passwords or AWS keys to GitHub
✅ Always include .env in your .gitignore file.
   Only share .env.example (with placeholder values) in Git.
   Public scrapers scan GitHub constantly for leaked AWS keys.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 2: HARDCODING LOCALHOST IN FRONTEND
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Writing fetch("http://localhost:3000/api") in frontend JavaScript
✅ Use relative paths: fetch("/api/enquiries").
   In production, the browser runs on the user's machine — not localhost.
   Nginx reverse proxy handles the routing transparently.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 3: PORT ALLOCATION CONFLICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Running PostgreSQL locally AND inside Docker with same port binding "5432:5432"
✅ Stop the local Postgres service first: services.msc → postgresql → Stop
   Or change the Docker host port: "5433:5432"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 4: SKIPPING TERRAFORM PLAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Running terraform apply directly without reviewing the plan
✅ Always run terraform plan first and read the output carefully.
   apply can accidentally destroy and recreate critical resources
   like databases, causing permanent data loss.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 5: RUNNING CONTAINERS AS ROOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Leaving the default root user in production Dockerfiles
✅ Always add USER node (backend) or USER nginx (frontend).
   A container escape exploit gives the attacker root on the host
   if the container runs as root. Non-root = least privilege.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 6: IGNORING HEALTHCHECKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Using depends_on without a healthcheck condition
✅ depends_on alone only waits for the container to START, not be READY.
   Without pg_isready healthcheck, the backend tries to connect to
   PostgreSQL before it accepts connections → crash loop.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 7: NOT USING .DOCKERIGNORE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Copying node_modules, .git, and .env into the Docker image
✅ Create a .dockerignore file that excludes:
   node_modules, .git, .env, *.md, .DS_Store
   This reduces build time and image size dramatically.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 8: COMMITTING .TERRAFORM/ FOLDER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Running git add . after terraform init (stages the 100MB+ .terraform/ directory)
✅ Add .terraform/ and *.tfstate to .gitignore BEFORE your first commit.
   The .terraform/ folder contains binary provider plugins and is not
   portable across machines. The state file contains secrets in plaintext.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 9: FORGETTING client_max_body_size IN NGINX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Leaving Nginx default upload limit at 1MB for a file upload application
✅ Add client_max_body_size 20M; to nginx.conf.
   Without it, any CAD drawing over 1MB returns 413 Payload Too Large
   and the browser shows a cryptic JSON parsing error.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MISTAKE 10: WRONG DD_SITE FOR DATADOG
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Using DD_SITE=datadoghq.com when your Datadog account is on the EU server
✅ Check which region your Datadog account was created in.
   EU accounts must use DD_SITE=datadoghq.eu or the agent silently
   fails to report any metrics.
