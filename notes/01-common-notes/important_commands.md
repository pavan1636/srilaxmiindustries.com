# Important Commands Reference

This is a cheat sheet of all commands we use in this project, grouped by tool.

## 🐳 Docker & Docker Compose

### Start the entire container stack
```bash
docker compose up -d --build
```
* **`-d`**: Runs containers in the background (detached mode).
* **`--build`**: Re-compiles Dockerfiles if you made changes to backend or Nginx code.

### Shut down the stack
```bash
docker compose down
```
* Shuts down all containers. (Keeps database volume files safe).

### Check logs
```bash
docker compose logs -f backend
```
* **`-f`**: Follows/streams logs in real-time. Replace `backend` with `db` or `frontend` to view their logs.

### Check running containers
```bash
docker ps
```

---

## 🐙 Git Version Control

### Initialize a new local Git repository
```bash
git init
```

### Check changes status
```bash
git status
```

### Stage changes for commit
```bash
git add .
```

### Save changes locally
```bash
git commit -m "feat: setup docker compose and postgres database backend"
```

### Push to GitHub (First time)
```bash
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

---

## 🐘 PostgreSQL (Database)

### Enter database container terminal
```bash
docker exec -it srilaxmi-db psql -U postgres -d srilaxmi
```
* **`docker exec -it`**: Runs an interactive shell inside the container named `srilaxmi-db`.
* **`psql`**: Starts the PostgreSQL terminal command line.

### View all tables
```sql
\dt
```

### Query enquiries table
```sql
SELECT * FROM enquiries;
```

### Exit PostgreSQL terminal
```sql
\q
```
