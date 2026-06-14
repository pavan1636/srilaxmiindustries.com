# CONCEPT 004 — What is a Database

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  A database is organized storage for application data. PostgreSQL is
  a relational database that stores data in tables with rows and columns.
  You query it using SQL (Structured Query Language).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without a database, data lives only in memory and vanishes when the
  server restarts. You cannot store products, dealers, or order history.
  A database provides persistent, structured, queryable storage with
  data integrity guarantees (ACID transactions).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  A database is like a filing cabinet with labeled folders. Each drawer
  (table) holds a specific type of document (rows). You can quickly
  find any document by its label (query), and the cabinet keeps
  everything safe even when the office lights are off (persistence).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. PostgreSQL is open-source and known for reliability and SQL compliance
  2. Data is organized in tables with defined schemas (columns and types)
  3. Docker volumes persist database data even if the container is rebuilt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌────────────────────────────────────┐
  │         PostgreSQL Container       │
  │                                    │
  │  ┌─────────────────────────────┐   │
  │  │ TABLE: products             │   │
  │  │ id | name    | price | unit │   │
  │  │  1 | Flange  | 450   | kg   │   │
  │  │  2 | Coupling| 800   | pc   │   │
  │  └─────────────────────────────┘   │
  │  ┌─────────────────────────────┐   │
  │  │ TABLE: dealers              │   │
  │  │ id | name      | email      │   │
  │  └─────────────────────────────┘   │
  │  ┌─────────────────────────────┐   │
  │  │ TABLE: quotes               │   │
  │  │ id | dealer_id | product_id │   │
  │  └─────────────────────────────┘   │
  └───────────────┬────────────────────┘
                  │ Docker Volume
                  ▼
          ┌───────────────┐
          │ pgdata volume │ ← data survives container restarts
          └───────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PostgreSQL runs as a Docker container in our Compose stack. It stores
  products, dealers, and quotes. A named Docker volume (pgdata) ensures
  data persists across container restarts. Nightly backups run via a
  cron job that executes pg_dump and uploads the SQL file to an S3
  bucket. The Express backend connects using the pg npm package.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "In my Sri Laxmi Industries project, I use PostgreSQL running in a
  Docker container. It stores products, dealers, and quote requests.
  Data is persisted with a named Docker volume. I set up nightly
  pg_dump backups via a cron job that uploads compressed SQL files
  to an S3 bucket in eu-west-1, giving us a disaster recovery path."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ Running a database container without a volume — data is lost on restart
  ✅ Always mount a named Docker volume for PostgreSQL's /var/lib/postgresql/data
     directory. This ensures data survives container rebuilds and updates.
