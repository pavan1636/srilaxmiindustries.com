# CONCEPT 005 — What is Docker

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Docker is a tool that packages an application and all its dependencies
  into a lightweight, portable unit called a container. Containers run
  the same way on any machine — your laptop, a test server, or AWS EC2.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "It works on my machine" — the classic DevOps problem. Without Docker,
  deploying means manually installing Node.js, PostgreSQL, Nginx, and
  matching exact versions. One wrong version and the app breaks. Docker
  eliminates this by shipping the exact environment with the app.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  A container is like a shipping container on a cargo ship. No matter
  what is inside (furniture, electronics, food), the container fits
  on any ship, any truck, any port crane. Docker containers work the
  same way — any app runs on any Docker-capable machine.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. A container is NOT a virtual machine — it shares the host OS kernel
  2. An image is a read-only template; a container is a running instance of it
  3. Containers are ephemeral — data must be stored in volumes or external services

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                  ┌────────────────────────┐
                  │      HOST (EC2)        │
                  │  ┌──────────────────┐  │
                  │  │  Docker Engine    │  │
                  │  │                  │  │
  ┌─────────┐    │  │  ┌─────────────┐ │  │
  │Dockerfile│───►│  │  │  Container  │ │  │
  └─────────┘    │  │  │  (running   │ │  │
       │         │  │  │   image)    │ │  │
       ▼         │  │  └─────────────┘ │  │
  ┌─────────┐    │  │                  │  │
  │  Image   │   │  └──────────────────┘  │
  │(template)│   │         │              │
  └─────────┘    │    Linux Kernel        │
                  └────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Every component runs in its own Docker container on EC2:
  - nginx container — serves frontend static files, reverse proxies API
  - express container — runs the Node.js backend API
  - postgres container — runs the PostgreSQL database
  - datadog container — collects metrics and logs
  All containers run as non-root users for security. Docker Compose
  orchestrates all four containers with a single command.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "In my Sri Laxmi Industries project, I containerized every component
  with Docker. We run four containers — Nginx, Express, PostgreSQL,
  and Datadog — on a single EC2 instance using Docker Compose. All
  containers run as non-root users. Docker ensures the exact same
  environment runs in development and production, eliminating
  environment-related deployment failures."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ Running containers as root — this is a security risk
  ✅ Always add a USER directive in your Dockerfile to run processes
     as a non-root user. If the container is compromised, the attacker
     has limited permissions on the host system.
