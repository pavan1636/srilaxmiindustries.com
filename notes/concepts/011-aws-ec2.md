# CONCEPT 011 — What is EC2?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EC2 (Elastic Compute Cloud) is a virtual server you rent from AWS.
It runs Linux or Windows and you have full SSH/RDP access to it,
just like a physical machine in a data centre.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Buying a physical server = buying a house (expensive, permanent)
  EC2 = renting an apartment (pay monthly, scale up/down, move anytime)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. EC2 instances are virtual machines — you choose CPU, RAM, storage
  2. User Data scripts run automatically when the instance first boots
  3. Key Pairs (.pem files) are used for SSH access instead of passwords

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Terraform apply
       │
       ▼
  ┌─────────────────────────────┐
  │  EC2 Instance (t3.micro)    │
  │  Ubuntu 22.04 LTS           │
  │                             │
  │  User Data Script runs:     │
  │    1. apt update            │
  │    2. Install Docker        │
  │    3. Install Docker Compose│
  │    4. Install AWS CLI       │
  │                             │
  │  SSH Access:                │
  │    ssh -i key.pem ubuntu@IP │
  └─────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: terraform/ec2.tf
  Instance: t3.micro (2 vCPU, 1GB RAM — free tier eligible)
  AMI: Ubuntu 22.04 LTS
  User Data: Installs Docker, Docker Compose, and AWS CLI on boot
  Key Pair: srilaxmi-deployer (generated via aws ec2 create-key-pair)
  Public IP: Assigned automatically (used in GitHub Actions deploy)
  IAM Profile: Attached for S3/SES access without hardcoded credentials

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I provisioned a t3.micro EC2 instance
running Ubuntu 22.04 using Terraform. The user data script
automatically installs Docker and Docker Compose on first boot,
so the server is production-ready immediately after terraform
apply completes. I attached an IAM instance profile so the
containers can access S3 and SES without embedding AWS credentials
in the application code."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Hardcoding AWS Access Keys inside the EC2 instance
✅ Use IAM Instance Profiles. The EC2 automatically inherits
   permissions from its attached role — no secrets to manage.
