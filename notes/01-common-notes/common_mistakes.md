# Common DevOps & Full-Stack Mistakes

Here are some pitfalls to avoid. These are frequently discussed in cloud engineering interviews.

## ⚠️ 1. Committing Secrets / `.env` to Git
* **The Mistake**: Accidentally running `git add .env` and pushing database passwords or AWS keys to GitHub.
* **Why it's dangerous**: Public scrapers scan GitHub repositories constantly to find leaked AWS keys and spin up expensive crypto-miners under your account.
* **DevOps Solution**:
  - Always include `.env` in your `.gitignore` file.
  - Only share `.env.example` (containing placeholder values like `your_aws_key`) in Git.

## ⚠️ 2. Hardcoding Port Bindings and Server IPs
* **The Mistake**: Writing `fetch("http://localhost:3000/api")` in your frontend JavaScript.
* **Why it breaks**: When deployed to AWS, the user's browser does not run on "localhost". It runs on their local computer and will try to find a backend on *their* machine, leading to failure.
* **DevOps Solution**:
  - Use relative paths: `fetch("/api/enquiries")`.
  - Let Nginx act as a reverse proxy to handle the routing transparently.

## ⚠️ 3. Port Allocation Conflict
* **The Mistake**: Running PostgreSQL locally on your machine outside Docker, then trying to run `docker compose up` with port binding `"5432:5432"`.
* **Why it breaks**: The host port 5432 is already occupied by the native database. The container database will crash on launch with an `address already in use` error.
* **DevOps Solution**:
  - Stop the local Postgres service before starting Docker, or change the host port mapping (e.g., `"5433:5432"`).
