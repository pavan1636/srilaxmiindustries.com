# Deployment Process - Local vs Cloud

Understanding where code builds and runs is crucial. This note explains the deployment lifecycle.

## 💻 1. Local Development Loop (Docker Compose)
* **Goal**: Code editing and fast testing.
* **Environment**: Local machine with Docker Desktop.
* **How it works**:
  1. Developers write backend code and edit HTML/CSS files.
  2. Running `docker compose up --build` launches isolated containers for the web proxy (Nginx), API, and PostgreSQL on their own computer.
  3. The local database is isolated, and file uploads are saved locally in the `uploads/` directory inside the backend container.

---

## ☁️ 2. Production Environment (AWS Cloud)
* **Goal**: Fast, secure, public access with backups and logging.
* **Environment**: AWS cloud resources.
* **How it works**:
  1. **IaC Provisioning**: Terraform reads code scripts and provisions a virtual network (VPC), firewalls (Security Groups), S3 storage, and an EC2 server host automatically.
  2. **CI/CD Pipeline**: 
     - When you push to GitHub, a runner server starts a GitHub Actions workflow.
     - The workflow SSHes securely into your EC2 host.
     - The host pulls the latest code from GitHub and builds the new Docker containers in-place.
  3. **Runtime Integrations**:
     - Database persistence uses RDS (or containerized PostgreSQL on EC2).
     - File uploads are streamed to a private **AWS S3 bucket**.
     - Emails are dispatched using **AWS SES**.
