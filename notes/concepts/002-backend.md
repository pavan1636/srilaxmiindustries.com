# CONCEPT 002 — What is a Backend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  The backend is the server-side part of a web application. It runs on
  a server (not in the browser), processes requests, talks to the
  database, and sends responses back to the frontend.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without a backend, the frontend has no way to store data, validate
  business logic, or communicate with databases securely. You cannot
  put database passwords in browser JavaScript — anyone could see them.
  The backend keeps sensitive logic and credentials safe on the server.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  If the frontend is the showroom, the backend is the factory floor.
  Customers place orders in the showroom, but the actual work —
  checking inventory, processing payments, scheduling delivery —
  all happens in the factory where customers cannot go.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Node.js lets you run JavaScript on the server (outside the browser)
  2. Express is a lightweight framework that handles HTTP routes and middleware
  3. The backend connects to PostgreSQL, S3, and SES — the frontend never does

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ┌──────────┐   HTTP request    ┌──────────────────┐
  │ Browser  │ ───────────────►  │  Express Backend  │
  │ (HTML/JS)│                   │                   │
  │          │ ◄───────────────  │  Routes:          │
  └──────────┘   JSON response   │  /api/products    │
                                 │  /api/quotes      │
                                 │  /api/dealers      │
                                 └────────┬─────────┘
                                          │
                          ┌───────────────┼──────────────┐
                          ▼               ▼              ▼
                    ┌──────────┐   ┌──────────┐   ┌──────────┐
                    │ Postgres │   │  AWS S3   │   │ AWS SES  │
                    │ (data)   │   │ (files)   │   │ (email)  │
                    └──────────┘   └──────────┘   └──────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Our backend is a Node.js/Express API running inside a Docker
  container. It exposes REST endpoints for products, dealers, quotes,
  and admin operations. It connects to PostgreSQL for data storage,
  uploads product images to S3, and sends order confirmation emails
  via AWS SES. The Express container runs as a non-root user for
  security and listens on port 3000 behind the Nginx reverse proxy.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  "In my Sri Laxmi Industries project, the backend is a Node.js
  Express API running in a Docker container. It handles REST
  endpoints for product management, dealer registration, and quote
  requests. It connects to PostgreSQL for data, S3 for file uploads,
  and SES for transactional emails. Nginx sits in front as a reverse
  proxy, forwarding /api requests to Express on port 3000."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ❌ Putting database credentials or API keys in frontend JavaScript
  ✅ Keep all secrets in the backend. The frontend only knows the API
     URL — never the database password or AWS keys. Use environment
     variables to pass secrets to the Express container.
