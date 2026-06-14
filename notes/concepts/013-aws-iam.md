# CONCEPT 013 — What is IAM?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IAM (Identity and Access Management) controls WHO can do WHAT
inside your AWS account. It manages users, roles, and permissions
using policies written in JSON.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  IAM = the security badge system in an office building
  Badge (Role) says: "This person can enter Floor 3 and Floor 5"
  Without a badge, you cannot open any door
  The principle of least privilege: give the minimum access needed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. IAM Roles are assigned to AWS services (like EC2) — not passwords
  2. Policies define permissions: "Allow s3:PutObject on bucket X"
  3. Instance Profiles attach IAM roles to EC2 instances automatically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  EC2 Instance
  ┌─────────────────────────────┐
  │  IAM Instance Profile       │
  │  ┌───────────────────────┐  │
  │  │  IAM Role              │  │
  │  │  ┌─────────────────┐  │  │
  │  │  │ Policy:          │  │  │
  │  │  │  s3:PutObject ✅  │  │  │
  │  │  │  s3:GetObject ✅  │  │  │
  │  │  │  ses:SendEmail ✅ │  │  │
  │  │  │  ec2:* ❌         │  │  │
  │  │  └─────────────────┘  │  │
  │  └───────────────────────┘  │
  └─────────────────────────────┘
  No AWS keys needed inside the container!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: terraform/iam.tf
  Role: ec2-srilaxmi-role
  Permissions: S3 PutObject/GetObject (upload/download files)
               SES SendEmail (send enquiry notifications)
  Instance Profile: Attached to EC2 via Terraform
  Trust Policy: Only EC2 service can assume this role

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I created an IAM role with least-privilege
permissions using Terraform. The role allows S3 PutObject for file
uploads and SES SendEmail for enquiry notifications — nothing more.
This role is attached to the EC2 instance via an Instance Profile,
so the Docker containers inherit AWS permissions automatically
without needing hardcoded access keys in the application code."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Using root AWS account credentials or overly broad policies
✅ Create dedicated IAM roles with the minimum permissions needed.
   Never use AdministratorAccess in production.
