# Debugging Patterns in DevOps

When something breaks, DevOps engineers follow a systematic path to locate the problem. This guide shows you how to troubleshoot the app step-by-step.

## 🔍 The 3-Tier Debugging System

```
Client/Browser ➔ Proxy (Nginx) ➔ Application (Express) ➔ Storage (Postgres/S3)
```

If an enquiry submission fails:
1. **Check the Browser Developer Console (F12)**:
   - Go to the **Network** tab.
   - Click "Submit" on the form.
   - Look at the red request. Is it a `400 Bad Request` (Validation error), `404 Not Found` (wrong URL path), or `500 Internal Server Error` (backend crashed)?
2. **Check Nginx Proxy Logs**:
   - Run: `docker compose logs frontend`
   - See if Nginx is receiving the request and forwarding it correctly, or if it says `502 Bad Gateway` (meaning Nginx is running but the Node backend container is offline).
3. **Check Express Backend Logs**:
   - Run: `docker compose logs backend`
   - Read the server logs. If a database query crashed, the Node error stack trace will explain exactly what SQL or field failed.

---

## 🛠️ Typical Debugging Scenarios

### 1. Nginx returns `502 Bad Gateway`
* **What it means**: Nginx cannot communicate with the `backend` container.
* **Troubleshooting Steps**:
  1. Check if the backend is running: `docker ps`
  2. If backend is exited, look at its crash logs: `docker compose logs backend`
  3. Ensure both containers share the same docker network.

### 2. Database Connection Error (`ECONNREFUSED` or `database "srilaxmi" does not exist`)
* **What it means**: The Express API tried to query Postgres, but Postgres was offline or name mismatch.
* **Troubleshooting Steps**:
  1. Verify database health: `docker compose ps` (Check if `srilaxmi-db` is marked as healthy).
  2. Double-check environment variables in `.env` match between Express (`DB_DATABASE`) and Postgres (`POSTGRES_DB`).
