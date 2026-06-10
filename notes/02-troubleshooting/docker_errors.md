# Troubleshooting - Docker Errors

Use this guide if you encounter errors starting or building Docker containers.

---

## 🚫 Error 1: `bind: address already in use`
* **Symptom**: 
  `Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use`
* **Why it happens**: Another service on your computer is already using port `5432` (usually a local native installation of PostgreSQL).
* **How to fix it**:
  1. Stop your local PostgreSQL server:
     - **Windows**: Search for `services.msc` in the start menu, find `postgresql`, right-click and click **Stop**.
     - **Linux/macOS**: Run `sudo systemctl stop postgresql` or `brew services stop postgresql`.
  2. Alternatively, change the port in `docker-compose.yml` to `"5433:5432"`.

---

## 🚫 Error 2: `failed to connect to the docker API`
* **Symptom**:
  `failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine... check if the daemon is running`
* **Why it happens**: Docker Desktop is installed, but the background engine has not been started.
* **How to fix it**:
  1. Search for "Docker Desktop" in your Windows application menu and launch it.
  2. Wait until the status bar in the bottom-left of the Docker Desktop UI turns green ("Engine Running").
  3. Re-run your terminal command.

---

## 🚫 Error 3: `npm ERR! code ELIFECYCLE` or backend crash
* **Symptom**: Container logs show backend exiting continuously.
* **Why it happens**: Node backend syntax errors, missing package imports, or missing environment secrets.
* **How to fix it**:
  1. Run `docker compose logs backend` to view the node stack trace.
  2. Ensure your `.env` contains all keys listed in `.env.example`.
