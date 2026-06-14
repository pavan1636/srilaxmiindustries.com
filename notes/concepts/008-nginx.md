# CONCEPT 008 — What is Nginx?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nginx is a high-performance web server that can also act as a
reverse proxy, load balancer, and static file server.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE PROBLEM IT SOLVES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Without Nginx:
    Node.js serves both static files AND processes API requests
    Node is single-threaded — serving images blocks API calls
    CORS errors when frontend (port 80) talks to backend (port 3000)
    No upload size limits → server crashes on large files

  With Nginx:
    Nginx serves static HTML/CSS/JS (extremely fast, multi-threaded)
    API requests are forwarded to Node.js via reverse proxy
    Single port 80 entry point — no CORS issues
    client_max_body_size controls upload limits

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Nginx = the receptionist at a company office
  Node.js = the engineer in the back room

  The receptionist (Nginx) handles simple requests instantly:
    "Here's our brochure" → serves static files
  Complex technical questions get forwarded to the engineer:
    "Submit this quotation" → proxy_pass to Node.js backend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Nginx handles static file serving 10x faster than Node.js
  2. Reverse proxy hides the backend from direct public access
  3. All traffic enters on port 80 — API routes are proxied internally

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  B2B Client Browser
       │
       ▼ Port 80
  ┌─────────────────────────────┐
  │  NGINX CONTAINER            │
  │                             │
  │  /index.html     → serve    │  (static file)
  │  /css/style.css  → serve    │  (static file)
  │  /images/logo.png → serve   │  (static file)
  │                             │
  │  /api/*  → proxy_pass       │──► backend:3000
  │           http://backend:3000    (Express API)
  │                             │
  │  client_max_body_size 20M   │  (upload limit)
  └─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: frontend/nginx.conf
  Role: Static file server + reverse proxy
  Port: 80 (public entry point)
  Proxy: /api/* forwarded to http://backend:3000
  Upload limit: client_max_body_size 20M (for CAD drawings)
  Container: nginx:alpine (smallest possible image)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, Nginx serves a dual role. It delivers
static HTML/CSS/JS files directly to the browser with minimal
latency, and acts as a reverse proxy forwarding all /api/* requests
to the Node.js backend on port 3000. This architecture eliminates
CORS issues since everything appears on a single origin (port 80),
and keeps the Express server hidden from direct public access. I
also configured client_max_body_size to 20MB to handle large CAD
drawing uploads from B2B customers."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Hardcoding fetch("http://localhost:3000/api") in frontend JavaScript
✅ Use relative paths: fetch("/api/enquiries"). Nginx reverse proxy
   handles the routing. localhost only works on your development machine,
   not in production where the browser runs on the user's computer.
