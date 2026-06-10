# Troubleshooting - Terraform Errors

Use this guide if you encounter errors running Terraform infrastructure scripts.

---

## 🚫 Error 1: `NoCredentialProviders: no valid providers in chain`
* **Symptom**: Terraform fail to authenticate with AWS.
* **Why it happens**: Terraform is trying to provision resources on your AWS account, but you have not logged in or configured your AWS credentials.
* **How to fix it**:
  1. Set your AWS credentials in your terminal session environment:
     - **Windows PowerShell**:
       ```powershell
       $env:AWS_ACCESS_KEY_ID="your-access-key"
       $env:AWS_SECRET_ACCESS_KEY="your-secret-key"
       ```
     - **Bash/macOS/Linux**:
       ```bash
       export AWS_ACCESS_KEY_ID="your-access-key"
       export AWS_SECRET_ACCESS_KEY="your-secret-key"
       ```
  2. Verify credentials using `aws sts get-caller-identity`.

---

## 🚫 Error 2: `Error: Duplicate resource`
* **Symptom**: Terraform fails saying a resource (like an S3 bucket or Security Group) already exists in AWS.
* **Why it happens**: 
  - Another user/project has already taken that exact global S3 bucket name (S3 bucket names must be globally unique across all of AWS).
  - Or, you ran Terraform before, manually deleted some files, and the state became desynchronized.
* **How to fix it**:
  1. Open `terraform/variables.tf` and change the S3 bucket names (e.g. add random letters or your initials: `srilaxmi-uploads-pavan`).
  2. Run `terraform plan` to verify.

---

## 🚫 Error 3: `Error: Instantiating provider` or Plugin download failures
* **Symptom**: `terraform init` crashes.
* **Why it happens**: Network timeouts or blocked connections during plugin downloads.
* **How to fix it**:
  1. Check your internet connection.
  2. Run `terraform init -upgrade` to retry provider downloads.
