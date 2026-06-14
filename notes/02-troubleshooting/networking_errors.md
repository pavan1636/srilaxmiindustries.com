# TROUBLESHOOTING — Networking Errors
# Sri Laxmi Industries — Connection, proxy, and security blocks

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 1: CORS Policy Blocked
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Browser Console shows:
    Access to fetch at 'http://localhost:3000' from origin
    'http://localhost' has been blocked by CORS policy

  Why it happens:
    The browser blocks requests when a website served from one port (80)
    attempts to make requests to a backend on another port (3000)
    for security reasons.

  How to fix:
    1. Make requests to RELATIVE paths (/api/enquiries) not absolute URLs
    2. Nginx receives the request on port 80 and proxy_passes it to
       port 3000 internally. To the browser, everything comes from
       the same origin — no CORS issue.
    3. Keep the cors npm package enabled in Express as a safety net.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 2: 504 Gateway Timeout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Nginx returns 504 Gateway Timeout after waiting ~60 seconds.

  Why it happens:
    The backend container is running but is blocked or unresponsive.
    Usually caused by hanging database connections or wrong DB_HOST.

  How to fix:
    1. Check backend logs: docker compose logs backend
    2. Look for "ECONNREFUSED" or connection pool hangs
    3. Verify DB_HOST is set to "db" (Docker service name),
       NOT "localhost" (localhost inside a container = that container itself)
    4. Check database is healthy: docker compose ps → db (healthy)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 3: 413 Payload Too Large
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Uploading a file larger than 1MB returns a cryptic error:
    "Unexpected token '<', '<!DOCTYPE '... is not valid JSON"

  Why it happens:
    Nginx default upload limit is 1MB. When exceeded, Nginx returns
    an HTML error page (413). The browser's fetch() tries to parse
    this HTML as JSON and fails with a confusing error message.

  How to fix:
    1. Add to frontend/nginx.conf:
       client_max_body_size 20M;
    2. Rebuild: docker compose up --build frontend
    3. Test with a large file upload

  Our story:
    We hit this when a customer uploaded a 1.24MB CAD drawing.
    The browser showed "Unexpected token '<'" — very misleading.
    Once we traced the 413 response in the Network tab, the fix
    was a single line in nginx.conf.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 4: DNS Resolution Failure (within Docker)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    getaddrinfo ENOTFOUND backend
    or: could not translate host name "db" to address

  Why it happens:
    Containers are not on the same Docker network, or one container
    started before the other and Docker's internal DNS isn't ready.

  How to fix:
    1. Ensure all services are defined in the SAME docker-compose.yml
    2. Docker Compose automatically creates a shared bridge network
    3. Reference services by their YAML key name: "db", "backend"
    4. Check: docker network inspect srilaxmi-devops_default
