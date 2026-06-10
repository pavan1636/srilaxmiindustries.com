# Troubleshooting - Networking Errors

Use this guide to diagnose connectivity, request, and security blocks.

---

## 🚫 Error 1: `CORS Policy Blocked`
* **Symptom**: Browser Console shows:
  `Access to fetch at 'http://localhost:3000' from origin 'http://localhost' has been blocked by CORS policy`
* **Why it happens**: The browser blocks requests when a website served from one port (80) attempts to make requests to a backend on another port (3000) for security.
* **How to fix it**:
  1. Ensure you make requests to relative paths (`/api/enquiries`) rather than hardcoded URLs.
  2. Nginx will receive the request on port 80 and proxy-pass it internally to port 3000. To the browser, everything looks like it is on the same port, resolving the CORS block.
  3. Keep the `cors` npm package enabled in Express.

---

## 🚫 Error 2: `504 Gateway Timeout`
* **Symptom**: Nginx times out waiting for the backend to respond.
* **Why it happens**: The backend is running but is locked or blocked (e.g. attempting to connect to a database host that does not exist or has a blocked firewall).
* **How to fix it**:
  1. Inspect the backend logs: `docker compose logs backend`.
  2. See if the Node container is hanging on database connection pools.
  3. Ensure database environment hosts (`DB_HOST`) are set to the container name `db` inside Docker Compose.
