# TROUBLESHOOTING — Docker Errors
# Sri Laxmi Industries — Common Docker issues and fixes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 1: bind: address already in use
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use

  Why it happens:
    Another service is already using port 5432 (usually a local PostgreSQL installation).

  How to fix:
    Option A: Stop local PostgreSQL:
      Windows: services.msc → postgresql → right-click → Stop
      Linux: sudo systemctl stop postgresql
    Option B: Change Docker port in docker-compose.yml:
      "5433:5432" (use host port 5433 instead)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 2: failed to connect to the docker API
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine

  Why it happens:
    Docker Desktop is installed but the background engine has not been started.

  How to fix:
    1. Launch Docker Desktop from Windows Start menu
    2. Wait until the bottom-left status bar turns green ("Engine Running")
    3. Re-run your terminal command

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 3: npm ERR! code ELIFECYCLE / backend crash loop
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Container logs show backend exiting continuously (CrashLoopBackOff).

  Why it happens:
    Node.js syntax errors, missing package imports, or missing .env secrets.

  How to fix:
    1. Run docker compose logs backend to view the Node stack trace
    2. Ensure .env contains ALL keys listed in .env.example
    3. If package is missing: update package.json and rebuild

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 4: nginx.conf not found during build
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Docker build fails: COPY nginx.conf /etc/nginx/... file not found

  Why it happens:
    The nginx.conf file was accidentally added to frontend/.dockerignore

  How to fix:
    1. Open frontend/.dockerignore
    2. Remove the line that excludes nginx.conf
    3. Rebuild: docker compose up --build frontend

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 5: no space left on device
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Docker build or pull fails with "no space left on device"

  Why it happens:
    Docker stores images, containers, and volumes on disk.
    After many builds, old images accumulate.

  How to fix:
    docker system prune -a    → Remove all unused images and containers
    docker volume prune       → Remove unused volumes
    ⚠️ Be careful: this deletes ALL stopped containers and unused images
