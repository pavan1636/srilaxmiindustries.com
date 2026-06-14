# ⚡ Important Commands Reference — Pavan
# All commands used in Sri Laxmi Industries — organised by tool

================================================================================
# DOCKER COMPOSE COMMANDS
================================================================================

docker compose up -d --build
  → Start all containers in BACKGROUND. Rebuild images if code changed.

docker compose down
  → Stop and remove all containers and networks.
  → Data in named volumes is PRESERVED.

docker compose down -v
  → Stop containers AND delete named volumes.
  → ⚠️ WARNING: This DELETES all database data permanently.

docker compose ps
  → Show status of all containers (running, stopped, unhealthy).

docker compose logs -f
  → Follow/tail logs from ALL containers in real time.

docker compose logs -f backend
  → Follow logs from ONLY the backend container.

docker compose logs -f db
  → Follow logs from the database container.

docker compose restart backend
  → Restart only the backend without stopping others.

docker compose build
  → Rebuild images (needed when you change a Dockerfile).

docker compose exec backend sh
  → Open a shell terminal INSIDE the backend container.

docker compose exec db psql -U postgres -d srilaxmi
  → Open PostgreSQL terminal inside the database container.

================================================================================
# DOCKER COMMANDS
================================================================================

docker ps
  → List all RUNNING containers.

docker ps -a
  → List ALL containers (including stopped ones).

docker images
  → List all downloaded Docker images.

docker image prune
  → Remove unused images to free disk space.

docker volume ls
  → List all Docker volumes.

docker volume inspect postgres_data
  → See details about a specific volume.

docker network ls
  → List all Docker networks.

docker inspect srilaxmi-backend
  → Show detailed config of a specific container.

docker logs srilaxmi-backend
  → Show logs of a specific container by name.

docker logs -f srilaxmi-backend
  → Follow logs in real time.

docker exec -it srilaxmi-backend sh
  → Open interactive shell inside a running container.

docker stop srilaxmi-backend
  → Gracefully stop a specific container.

docker rm srilaxmi-backend
  → Remove a stopped container.

================================================================================
# POSTGRESQL COMMANDS (Inside Container)
================================================================================

# First get into the database container:
docker compose exec db psql -U postgres -d srilaxmi

# Then inside psql:
\l                          → List all databases
\c srilaxmi                 → Connect to srilaxmi database
\dt                         → List all tables
\d enquiries                → Describe the enquiries table
SELECT * FROM enquiries;    → See all stored data
SELECT COUNT(*) FROM enquiries; → Count rows
\q                          → Quit psql

================================================================================
# GIT COMMANDS
================================================================================

git init                    → Initialise a git repository
git add .                   → Stage all changes
git commit -m "message"     → Commit with a message
git push origin main        → Push to GitHub
git status                  → See what files are changed
git log --oneline -10       → See last 10 commits (short)
git branch                  → List branches
git checkout -b feature/x   → Create and switch to new branch
git reset --soft HEAD~1     → Undo last commit, keep changes staged
git remote set-url origin <url> → Change the remote repository URL

================================================================================
# TERRAFORM COMMANDS
================================================================================

cd terraform                → Navigate to Terraform directory
terraform init              → Download AWS provider plugin
terraform plan              → Dry-run: preview what will change
terraform apply             → Provision real AWS resources
terraform apply -auto-approve → Apply without confirmation prompt
terraform destroy           → Tear down ALL provisioned resources
terraform output            → Show output values (e.g., EC2 public IP)
terraform fmt               → Auto-format .tf files
terraform validate          → Check .tf syntax without touching AWS

================================================================================
# AWS CLI COMMANDS
================================================================================

aws configure               → Set up AWS credentials interactively
aws sts get-caller-identity → Verify which AWS account you're using
aws ec2 create-key-pair --key-name srilaxmi-deployer --query "KeyMaterial" --output text > key.pem
  → Generate SSH key pair for EC2 access

aws s3 ls s3://srilaxmi-db-backups-pavan
  → List files in the backup bucket

aws s3 cp backup.sql.gz s3://bucket-name/
  → Upload a file to S3

================================================================================
# LINUX / BASH COMMANDS
================================================================================

ls -la                      → List files with permissions
pwd                         → Show current directory
cd /path/to/folder          → Change directory
mkdir -p folder/subfolder   → Create nested directories
cat filename                → Show file contents
tail -f /var/log/app.log    → Follow log file in real time
grep "ERROR" app.log        → Search for ERROR in log file
chmod 400 srilaxmi-deployer.pem → Secure SSH key permissions
./scripts/backup.sh         → Run the backup script manually

================================================================================
# TESTING API ENDPOINTS (Curl Commands)
================================================================================

# Test backend health:
curl http://localhost/api/health

# Submit a test enquiry:
curl -X POST http://localhost/api/enquiries \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@company.com","country":"Ireland","product":"CNC Shafts"}'

# GDPR Export (admin only):
curl http://localhost:3000/api/enquiries/export?email=test@company.com \
  -H "X-Admin-API-Key: your-admin-key"

# GDPR Delete (admin only):
curl -X DELETE http://localhost:3000/api/enquiries/delete?email=test@company.com \
  -H "X-Admin-API-Key: your-admin-key"

# SSH into EC2:
ssh -i srilaxmi-deployer.pem ubuntu@<EC2-PUBLIC-IP>
