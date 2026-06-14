# Real-Time Deployment Log — Sri Laxmi Industries
# Exact steps taken to deploy the B2B platform live on AWS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 1: AWS CREDENTIALS & REGION SETUP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Before Terraform could communicate with AWS, we configured credentials.

  Command:
    aws configure

  Inputs:
    AWS Access Key ID:     AKIAXXXXXXXXXXXXXXXX
    AWS Secret Access Key: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    Default region name:   eu-west-1 (Ireland)
    Default output format: json

  Note: We caught and corrected a small typo where a bracket ]
  was accidentally appended to eu-west-1].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 2: INITIALIZE TERRAFORM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Commands:
    cd terraform
    terraform init

  What it did: Downloaded the hashicorp/aws provider plugin.
  This is the "translator" that lets Terraform speak to AWS APIs.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 3: DRY-RUN BLUEPRINT CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Command:
    terraform plan

  Output: Plan: 16 to add, 0 to change, 0 to destroy.

  Warning cleared: AWS provider complained about the S3 backups
  lifecycle rule missing a filter. Fixed by adding an empty
  filter {} block in s3.tf.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 4: CREATE AND DOWNLOAD KEY PAIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Command:
    aws ec2 create-key-pair --key-name srilaxmi-deployer \
      --query "KeyMaterial" --output text > srilaxmi-deployer.pem

  ASCII Conversion: PowerShell saved the file as UTF-16LE, which
  Linux SSH rejects. Fixed with:
    $content = Get-Content -Path .\srilaxmi-deployer.pem
    Set-Content -Path .\srilaxmi-deployer.pem -Value $content -Encoding Ascii

  Secure Permissions (in WSL):
    chmod 400 srilaxmi-deployer.pem

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 5: LIVE PROVISIONING & T3.MICRO ADJUSTMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Command:
    terraform apply

  Error encountered: AWS rejected the default t2.micro instance type.
  AWS Academy/Sandbox accounts restrict instances to t3.micro.

  Fix: Changed the default instance_type in variables.tf to t3.micro
  and re-ran terraform apply.

  Result: Terraform successfully built 16 resources.
  Output: EC2 public IP → 18.202.232.165

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 6: LOG IN TO REMOTE EC2 SERVER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Command (inside WSL):
    ssh -i srilaxmi-deployer.pem ubuntu@18.202.232.165

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 7: CLONE AND BUILD CONTAINERS ON EC2
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Commands:
    git clone https://github.com/pavan1636/srilaxmiindustries.com.git
    cd srilaxmiindustries.com
    cp .env.example .env
    docker compose up -d --build

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 8: REAL-TIME DEBUGGING & FIXES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ISSUE 1 — Dockerignore Blocked Nginx Config:
    Error:   Docker build failed: nginx.conf not found
    Cause:   nginx.conf was added to frontend/.dockerignore
    Fix:     Removed nginx.conf from .dockerignore, pushed, pulled on EC2, rebuilt

  ISSUE 2 — Large Git Push Blocked:
    Error:   GitHub rejected push due to files larger than 100MB
    Cause:   Accidentally staged .terraform/ binary folder
    Fix:     Added .terraform/ and *.tfstate to .gitignore,
             ran git reset --soft HEAD~1, re-pushed

  ISSUE 3 — Nginx 413 Payload Too Large:
    Error:   Uploading 1.24MB CAD drawing returned "Unexpected token '<'"
    Cause:   Nginx default upload limit is 1MB
    Fix:     Added client_max_body_size 20M; to nginx.conf,
             pushed, pulled on EC2, rebuilt frontend

  ISSUE 4 — Regional Datadog Site Routing:
    Error:   Datadog Agent was not connecting
    Cause:   Datadog account was on EU servers, agent was set to US endpoint
    Fix:     Set DD_SITE=datadoghq.eu in .env on EC2, restarted

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 9: LIVE OBSERVABILITY AND VERIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Website:     Loaded live on http://18.202.232.165
  Health:      http://18.202.232.165/api/health → database connected ✅
  Datadog:     Active containers (frontend, backend, db) streaming
               CPU and memory metrics to Datadog Cloud Dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STEP 10: INFRASTRUCTURE DESTRUCTION (COST CONTROL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  After saving screenshots for LinkedIn:

  Commands (WSL):
    exit                    → Logout from EC2
    cd terraform
    terraform destroy

  Output: Destroy complete! Resources: 16 destroyed.
  AWS bill: $0.00
