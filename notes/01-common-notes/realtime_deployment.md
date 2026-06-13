# Step-by-Step Real-time Deployment Log

This document records the exact steps we took to deploy the B2B Manufacturing Cloud Platform live on AWS in real-time, including how we resolved errors that occurred along the way.

---

## 🛠️ Step 1: AWS Credentials & Region Setup
Before Terraform could communicate with AWS, we logged into your AWS account and set the default region using the AWS CLI.

* **Command**:
  ```bash
  aws configure
  ```
* **Inputs**:
  - AWS Access Key ID: `AKIAXXXXXXXXXXXXXXXX`
  - AWS Secret Access Key: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
  - Default region name: `eu-west-1` (Ireland)
  - Default output format: `json`

> [!NOTE]
> We caught and corrected a small typo during region setup where a bracket `]` was accidentally appended to `eu-west-1]`.

---

## 🛠️ Step 2: Initialize Terraform
We entered the `terraform/` directory and downloaded the AWS provider plugin.

* **Commands**:
  ```bash
  cd terraform
  terraform init
  ```
* **Why**: Downloads the code translator that allows Terraform to speak to AWS APIs.

---

## 🛠️ Step 3: dry-Run Blueprint Check
We ran a test check to confirm our scripts were valid and to see what Terraform planned to build.

* **Command**:
  ```bash
  terraform plan
  ```
* **Output**: `Plan: 16 to add, 0 to change, 0 to destroy.`
* **Warning Cleared**: The AWS provider complained about the backups lifecycle rule missing a filter. We resolved this by adding an empty `filter {}` block in `s3.tf`.

---

## 🛠️ Step 4: Create and Download Key Pair
To let us (and GitHub Actions) SSH log in to our virtual EC2 server, we generated a secure SSH Key Pair directly from the AWS CLI and saved the private key locally.

* **Command**:
  ```bash
  aws ec2 create-key-pair --key-name srilaxmi-deployer --query "KeyMaterial" --output text > srilaxmi-deployer.pem
  ```
* **ASCII Conversion**: PowerShell saved the file as UTF-16LE, which Linux SSH rejects. We converted it to ASCII using:
  ```powershell
  $content = Get-Content -Path .\srilaxmi-deployer.pem
  Set-Content -Path .\srilaxmi-deployer.pem -Value $content -Encoding Ascii
  ```
* **Secure Permissions (in WSL)**: We restricted the private key file so Linux would allow SSH connections:
  ```bash
  cd ..
  chmod 400 srilaxmi-deployer.pem
  cd terraform
  ```

---

## 🛠️ Step 5: Live Provisioning & t3.micro Adjustment
We ran the live deployment command:

* **Command**:
  ```bash
  terraform apply
  ```
* **Error Encountered**: AWS rejected the default `t2.micro` instance type because AWS Academy / Sandbox accounts restrict instances to `t3.micro`.
* **Fix**: We changed the default `instance_type` in `variables.tf` to `t3.micro` and re-ran `terraform apply`.
* **Result**: Terraform successfully built the infrastructure and printed our public IP: **`18.202.232.165`**.

---

## 🛠️ Step 6: Log in to the remote EC2 Server
We logged in to the virtual machine in AWS Ireland:

* **Command (inside WSL)**:
  ```bash
  ssh -i srilaxmi-deployer.pem ubuntu@18.202.232.165
  ```

---

## 🛠️ Step 7: Clone and Build Containers on EC2
Once inside the EC2 server, we pulled the code, configured the environment, and launched the containers.

* **Commands**:
  ```bash
  git clone https://github.com/pavan1636/srilaxmiindustries.com.git
  cd srilaxmiindustries.com
  cp .env.example .env
  docker compose up -d --build
  ```

---

## 🛠️ Step 8: Real-Time Debugging & Fixes

### 🚫 Issue 1: Dockerignore Blocked Nginx Config
* **Error**: Docker build failed: `nginx.conf not found`.
* **Cause**: `nginx.conf` was added to `frontend/.dockerignore`, hiding it from the build process.
* **Fix**: We removed `nginx.conf` from `.dockerignore`, pushed the fix to GitHub, pulled it on EC2 (`git pull`), and re-built.

### 🚫 Issue 2: Large Git Push Blocked
* **Error**: GitHub rejected push due to files larger than 100MB.
* **Cause**: We accidentally staged the `.terraform/` binary folder and state files.
* **Fix**: We added `.terraform/`, `*.tfstate`, and `*.pem` to our root `.gitignore`, reset the Git index (`git reset --soft HEAD~1`), and re-pushed.

### 🚫 Issue 3: Nginx File Upload Size Limit (413 Payload Too Large)
* **Error**: Submitting a 1.24MB drawing file returned `Unexpected token '<' ... is not valid JSON`. Nginx logs showed `413 Payload Too Large`.
* **Cause**: Nginx has a default upload size limit of 1MB.
* **Fix**: We added `client_max_body_size 20M;` to `frontend/nginx.conf`, pushed, pulled on EC2, and rebuilt the frontend.

### 🚫 Issue 4: Regional Datadog Site Routing (datadoghq.eu)
* **Error**: Datadog Agent was not connecting.
* **Cause**: Datadog account was created on the EU servers, but agent env was hardcoded to `datadoghq.com` (US).
* **Fix**: We made `DD_SITE` configurable in `docker-compose.yml`, added `DD_SITE=datadoghq.eu` and the API Key to `.env` on EC2, and restarted.

---

## 🛠️ Step 9: Live Observability and Verification
* **Website Homepage**: Loaded live on `http://18.202.232.165`.
* **Health Check**: Accessed at `http://18.202.232.165/api/health` returning database and server status.
* **Datadog Dashboards**: Active containers (`srilaxmi-frontend`, `srilaxmi-backend`, `srilaxmi-db`) streamed CPU and Memory metrics to Datadog.

---

## 🛠️ Step 10: Infrastructure Destruction (Cost Control)
After saving screenshots for LinkedIn, we tore down all cloud assets to keep our AWS bill at $0.00.

* **Commands (WSL)**:
  ```bash
  exit # logout from EC2
  cd terraform
  terraform destroy
  ```
* **Output**: `Destroy complete! Resources: 16 destroyed.`
