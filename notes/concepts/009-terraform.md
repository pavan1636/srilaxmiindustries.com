# CONCEPT 009 — What is Terraform?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Terraform is an Infrastructure as Code (IaC) tool by HashiCorp.
It lets you define, provision, and manage cloud infrastructure using
code files (.tf) instead of clicking through a web console.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Manual (Console) = shouting verbal orders on a building site —
    "build a wall here, add a door there." If something breaks,
    you rely on memory to rebuild it identically.
  IaC (Terraform) = handing every worker the same architectural
    blueprint. Any contractor anywhere can read the blueprint
    and build the exact same house, every time.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Terraform is DECLARATIVE — you describe the desired state, not the steps
  2. terraform plan shows what will change BEFORE any resources are touched
  3. All .tf files live in Git — full audit trail of every infra change

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Provider declaration (providers.tf):
       provider "aws" {
         region = var.aws_region    # eu-west-1
       }

  2. Resource definitions (ec2.tf, s3.tf, vpc.tf):
       resource "aws_instance" "web" {
         ami           = "ami-xxx"
         instance_type = "t3.micro"
       }

  3. Variables (variables.tf):
       Parameterize values like project_name, bucket_name

  4. Workflow commands:
       terraform init    → Downloads AWS provider plugin
       terraform plan    → Dry-run: shows "16 resources to add"
       terraform apply   → Provisions real AWS resources
       terraform destroy → Tears everything down cleanly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Developer Workstation              AWS Cloud (eu-west-1)
  ┌──────────────────┐         ┌──────────────────────────┐
  │  providers.tf    │         │  VPC + Subnet + IGW      │
  │  variables.tf    │  apply  │  Security Groups         │
  │  vpc.tf ─────────┼────────►│  IAM Role + Profile      │
  │  ec2.tf          │         │  EC2 Instance (Docker)   │
  │  s3.tf           │ destroy │  S3 Upload Bucket        │
  │  iam.tf ─────────┼◄────── │  S3 Backup Bucket        │
  │  security_groups │         │                          │
  └──────────────────┘         └──────────────────────────┘
       .tf files              terraform.tfstate (tracks reality)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File location:  terraform/
  Provider:       hashicorp/aws, region eu-west-1
  Resources:      VPC, subnet, IGW, security groups, IAM, EC2, S3 (×2)
  Variables:      aws_region, instance_type (t3.micro), bucket names
  State file:     terraform.tfstate (gitignored — contains secrets)
  Total:          16 AWS resources provisioned from code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I used Terraform to codify our entire AWS
infrastructure — VPC, EC2, S3 buckets, IAM roles, and Security
Groups. Every resource is defined declaratively in .tf files stored
in Git. I configured the AWS provider pinned to eu-west-1, created
two private S3 buckets for file uploads and database backups, and
provisioned an EC2 instance with a user data script that installs
Docker on boot. I always run terraform plan before apply to preview
changes safely."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Committing terraform.tfstate to Git
✅ The state file contains sensitive data like passwords in plaintext.
   Add *.tfstate to .gitignore. Use S3 remote backend for team setups.

❌ Skipping terraform plan and running apply directly
✅ This can accidentally destroy or replace critical resources.
   Always review the plan first.
