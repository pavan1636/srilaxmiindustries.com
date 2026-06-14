# CONCEPT 006 — What is Docker Compose?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Docker Compose is a tool for defining and running multi-container
Docker applications using a single YAML configuration file.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without Compose:
    docker run frontend (set 5 flags)
    docker run backend (set 8 flags)
    docker run database (set 6 flags)
    docker run datadog (set 7 flags)
    Manually create networks, volumes, restart policies...
    Repeat every single time. Miss one flag = broken deployment.

  With Compose:
    docker compose up -d
    (that's it — every time, identical, every machine)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Docker = individual musicians who can each play their instrument
  Docker Compose = the conductor's sheet music that tells all
  musicians when to start, what tempo to play, and how to sync

  Without a conductor, everyone plays at random = chaos.
  With a conductor, the orchestra performs in harmony.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Compose creates a PRIVATE network — containers talk via service names
  2. depends_on + healthcheck ensures correct startup ORDER
  3. Named volumes persist data even when containers are destroyed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  docker-compose.yml
  ┌────────────────────────────────────────┐
  │                                        │
  │  service: frontend (nginx:alpine)      │
  │    ports: 80:80                        │
  │    depends_on: backend                 │
  │                                        │
  │  service: backend (node:18-alpine)     │
  │    ports: 3000:3000                    │
  │    depends_on: db (service_healthy)    │
  │    env: DB_HOST=db                     │
  │                                        │
  │  service: db (postgres:15-alpine)      │
  │    volumes: postgres_data              │
  │    healthcheck: pg_isready             │
  │                                        │
  │  service: datadog-agent                │
  │    volumes: /var/run/docker.sock       │
  │                                        │
  └────────────────────────────────────────┘
       All share a private bridge network
       DNS: "db" → postgres container IP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: docker-compose.yml (root directory)
  Services: 4 containers (frontend, backend, db, datadog-agent)
  Volumes: postgres_data (DB persistence), uploads_data (file fallback)
  Backend connects to DB using hostname "db" (Docker internal DNS)
  Frontend depends_on backend, backend depends_on db (service_healthy)
  Datadog agent mounts docker.sock for container metric collection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I used Docker Compose to orchestrate a
4-container stack: Nginx frontend, Node.js/Express backend,
PostgreSQL database, and a Datadog monitoring agent. Compose creates
a private bridge network where containers communicate using service
names as DNS hostnames. I configured healthchecks on PostgreSQL with
pg_isready and used depends_on with service_healthy condition to
ensure the backend only starts after the database is ready."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Using depends_on without a healthcheck condition
✅ depends_on alone only waits for the container to START, not for
   the service inside to be READY. Always pair it with a healthcheck
   and condition: service_healthy to prevent connection refused errors.
