# Debugging Patterns — Sri Laxmi Industries
# Systematic troubleshooting guide for DevOps engineers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE 3-TIER DEBUGGING SYSTEM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Client/Browser ➔ Proxy (Nginx) ➔ Application (Express) ➔ Storage (Postgres/S3)

  If an enquiry submission fails, trace the request path layer by layer.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: CHECK THE BROWSER (F12)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Open Developer Tools → Network tab → click "Submit"
  Look at the failed request:
    400 Bad Request    → Validation error (missing required fields)
    404 Not Found      → Wrong URL path in frontend fetch()
    413 Payload Large  → Nginx upload limit too small
    500 Server Error   → Backend crashed (check Express logs)
    502 Bad Gateway    → Nginx running but backend container is offline

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: CHECK NGINX PROXY LOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Command: docker compose logs frontend
  Look for:
    502 errors = backend container is not running
    413 errors = client_max_body_size too small in nginx.conf
    Connection refused = backend DNS name not resolving

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: CHECK EXPRESS BACKEND LOGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Command: docker compose logs backend
  Look for:
    ECONNREFUSED = database not ready or wrong DB_HOST
    SQL syntax errors = bad query in db.js
    AWS S3 errors = missing credentials or wrong bucket name
    SES errors = unverified email address or wrong region

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 1: Nginx returns 502 Bad Gateway
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: Nginx cannot communicate with the backend container.
  Debug:
    1. Check if backend is running: docker ps
    2. If exited, check crash logs: docker compose logs backend
    3. Verify both containers share the same Docker network
    4. Ensure backend listens on the correct port (3000)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 2: 413 Payload Too Large
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: Nginx default upload limit is 1MB. CAD drawings are larger.
  Symptom: Browser shows "Unexpected token '<' is not valid JSON"
  Fix: Add client_max_body_size 20M; to frontend/nginx.conf
  Then: git push → CI/CD rebuilds → or manually docker compose up --build

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 3: Database Connection Refused (ECONNREFUSED)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: Backend tried to query Postgres before it was ready.
  Debug:
    1. Verify DB health: docker compose ps (check "healthy" status)
    2. Check DB_HOST is set to "db" (container name), not "localhost"
    3. Check DB_DATABASE matches POSTGRES_DB in docker-compose.yml
    4. Verify healthcheck is configured with pg_isready

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 4: Datadog Agent Not Connecting
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: Wrong DD_SITE region or missing API key.
  Debug:
    1. Verify DD_API_KEY is set in .env on EC2
    2. Check DD_SITE matches your account region:
       US account → DD_SITE=datadoghq.com
       EU account → DD_SITE=datadoghq.eu
    3. Run: docker compose logs datadog-agent
    4. Look for "API key is not valid" or connection timeout errors

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 5: Terraform State Desync
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: Resources were manually deleted in AWS Console but state
  file still thinks they exist.
  Debug:
    1. Run terraform plan — it will show "1 to destroy" for ghost resources
    2. Run terraform refresh to sync state with reality
    3. If corrupted, terraform state rm <resource> to remove orphans
    4. Re-apply: terraform apply

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 6: GitHub Actions Deploy Failure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: SSH connection failed or health check returned non-200.
  Debug:
    1. Check GitHub Actions logs for the failed step
    2. Verify EC2_HOST secret matches current EC2 public IP
    3. Verify EC2_SSH_KEY is the correct .pem content
    4. If health check fails: SSH manually and run docker compose logs
    5. Ensure Security Group allows SSH (port 22) from GitHub runners

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENARIO 7: S3 Upload Failure
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Cause: Missing S3 credentials or wrong bucket name.
  Symptom: Backend logs show "AWS S3: Error uploading file, falling back to local"
  Debug:
    1. Check S3_UPLOAD_BUCKET is set in .env
    2. Verify IAM role has s3:PutObject permission
    3. Verify bucket exists and name is correct (globally unique)
    4. The system gracefully falls back to local storage if S3 fails
