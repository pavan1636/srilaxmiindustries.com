# 🎯 Master Interview Notes — Pavan
# Goal: DevOps / SRE / Cloud Engineer — Ireland
# Project: Sri Laxmi Industries — B2B Manufacturing Cloud Platform

================================================================================
# TOPIC 1: FULL-STACK ARCHITECTURE
================================================================================

Q: Can you explain a 3-tier architecture?
A: A 3-tier architecture separates an application into three layers:
   Tier 1 (Presentation) = Frontend — what the user sees (HTML/CSS/JS via Nginx)
   Tier 2 (Application)  = Backend  — business logic (Node.js/Express API)
   Tier 3 (Data)         = Database — permanent storage (PostgreSQL)
   Each tier only talks to its adjacent tier.
   The frontend never directly queries the database.
   All data access goes through the backend API.

Q: Why did you use Nginx instead of serving files from Node.js?
A: Nginx is purpose-built for high-concurrency static file delivery and acts
   as a reverse proxy. By routing traffic through Nginx, we keep the Node
   backend hidden in the internal container network. Node is single-threaded
   and struggles with serving heavy static assets. Offloading static files
   to Nginx frees the backend to process API calls, validate database
   transactions, and handle file transfers.

Q: How does a reverse proxy work in your project?
A: Nginx listens on port 80. Static file requests (HTML, CSS, JS, images)
   are served directly. Any request starting with /api/ is forwarded to the
   Express backend on port 3000 using the proxy_pass directive. From the
   browser's perspective, everything comes from a single origin (port 80),
   which eliminates CORS issues entirely.

================================================================================
# TOPIC 2: DOCKER
================================================================================

Q: What problem does Docker solve?
A: Docker solves the "works on my machine" problem. Without Docker,
   applications behave differently across computers because of different
   OS versions, software versions, and configurations. Docker packages
   the app and all its dependencies into a container that runs identically
   on every machine.

Q: What is a multi-stage Docker build?
A: A multi-stage build uses multiple FROM statements in one Dockerfile.
   The first stage (builder) installs all dependencies and compiles code.
   The second stage (runner) copies only the compiled output, skipping
   dev tools. This reduces image size dramatically — from ~1GB to ~30MB.
   In Sri Laxmi Industries, our backend Dockerfile uses two stages:
   stage 1 runs npm ci, stage 2 copies only node_modules and app code.

Q: Why do you run the backend container as a non-root user?
A: By default, Docker runs processes as root inside the container. If a
   remote vulnerability allows a container escape exploit, the attacker
   gains root access to the host machine. Running as the restricted
   'node' user implements the principle of least privilege. Even if the
   container is compromised, the attacker cannot execute admin commands.

================================================================================
# TOPIC 3: DOCKER COMPOSE
================================================================================

Q: What is Docker Compose and why do you use it?
A: Docker Compose defines and runs multi-container applications using a
   single YAML file. With one command (docker compose up) it starts all
   containers in the correct order with all settings. We use it because
   our Sri Laxmi platform has 4 containers (frontend, backend, database,
   datadog) that must all run together and communicate.

Q: How do containers communicate in Docker Compose?
A: Docker Compose creates a private bridge network for all services.
   Each service gets its service name as a DNS hostname. Containers
   find each other using these names. Example: the backend connects
   to PostgreSQL using hostname "db". Docker's internal DNS resolves
   "db" to the correct container IP address.

Q: What is a healthcheck and why is it critical?
A: A healthcheck is a command Docker runs periodically inside a container
   to verify it is genuinely ready to accept connections. For PostgreSQL
   we use pg_isready. Combined with depends_on and condition:
   service_healthy, it ensures the backend only starts after the database
   is truly ready. Without it, the backend starts too early and crashes.

================================================================================
# TOPIC 4: TERRAFORM (IaC)
================================================================================

Q: Why did you use Terraform instead of the AWS Console?
A: Infrastructure defined in code can be version-controlled, peer-reviewed
   in a PR, rolled back in one command, and recreated identically in a
   new environment. terraform destroy && terraform apply is more reliable
   than trying to remember what you clicked in the console six months ago.

Q: What AWS resources did you provision with Terraform?
A: In Sri Laxmi Industries, Terraform provisions 16 resources: a VPC with
   a public subnet, Internet Gateway, route table, Security Groups for
   HTTP/HTTPS/SSH, an IAM role with S3/SES permissions, two private S3
   buckets (uploads + backups), and a t3.micro EC2 instance with a user
   data script that installs Docker on first boot.

================================================================================
# TOPIC 5: CI/CD
================================================================================

Q: How does your CI/CD pipeline work?
A: When I push to the main branch, GitHub Actions triggers a workflow.
   It uses appleboy/ssh-action to SSH into the EC2 instance, pulls the
   latest code, recreates the .env file from GitHub Secrets, and runs
   docker compose up -d --build. After rebuilding, it performs a health
   check against /api/health. If the health check fails, it prints the
   backend logs and exits with error code 1.

Q: How do you handle secrets in CI/CD?
A: All credentials (DB passwords, AWS keys, Datadog API key, SSH key)
   are stored as GitHub Secrets. The deploy workflow writes them into
   the .env file on the EC2 instance at deployment time. Secrets are
   encrypted at rest and masked in workflow logs. The .env file is in
   .gitignore so it is never committed to the repository.

================================================================================
# TOPIC 6: GDPR
================================================================================

Q: How are you protecting GDPR enquiry data?
A: Enquiries contain PII (name, email, phone). I built GDPR-compliant
   export and deletion endpoints. The export endpoint returns all records
   for a given email (Right to Access). The delete endpoint permanently
   removes all records (Right to Erasure). Both are protected by an
   X-Admin-API-Key header check — only administrators with the correct
   server-side secret can access them.

================================================================================
# TOPIC 7: AWS SERVICES
================================================================================

Q: How do you handle file uploads securely?
A: Instead of storing files on the local EC2 filesystem — which would
   prevent horizontal scaling — we upload technical drawings directly to
   AWS S3. The backend uses Multer (memory storage) and the AWS SDK to
   stream file buffers straight to a private S3 bucket. The bucket blocks
   all public access. The database only stores the S3 object URL.

Q: What is an IAM Instance Profile and why do you use it?
A: An Instance Profile attaches an IAM Role to an EC2 instance. The
   containers running on that instance automatically inherit the role's
   permissions. This means we can access S3 and SES without hardcoding
   AWS Access Keys inside the application — the credentials are managed
   by AWS and rotated automatically.

================================================================================
# TOPIC 8: SRE CONCEPTS
================================================================================

Q: What is self-healing infrastructure?
A: Systems that automatically recover from failures without human
   intervention. In Docker Compose: restart: always restarts crashed
   containers. In Kubernetes: deployments automatically replace failed
   pods. In our project, all four containers have restart: always set.

Q: What is an idempotent operation and why does it matter?
A: An operation that produces the same result no matter how many times
   you run it. In our deploy pipeline, running docker compose up --build
   multiple times always produces the same state. terraform apply is also
   idempotent — running it twice with no changes results in zero
   modifications. This is critical for safe automation and retries.
