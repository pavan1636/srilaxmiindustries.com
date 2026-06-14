# CONCEPT 010 — What is a VPC?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
A Virtual Private Cloud (VPC) is your own private, isolated network
inside AWS. It controls how your cloud resources communicate with
each other and with the internet.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  AWS without a VPC = living in an open field, no fences, no locks
  AWS with a VPC = building a walled compound with a security gate

  Inside the compound you control:
    Which buildings (subnets) exist
    Who can enter (security groups)
    Which gate leads to the internet (Internet Gateway)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. A VPC defines a private IP address range (e.g., 10.0.0.0/16)
  2. Subnets divide the VPC into smaller networks (public/private)
  3. An Internet Gateway (IGW) connects public subnets to the internet

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────┐
  │  VPC (10.0.0.0/16)                  │
  │                                     │
  │  ┌──────────────────────┐           │
  │  │ Public Subnet         │           │
  │  │ 10.0.1.0/24          │           │
  │  │                      │           │
  │  │  EC2 Instance ◄──────┼───── Internet
  │  │  (Docker Host)       │  via IGW  │
  │  └──────────────────────┘           │
  │                                     │
  │  Route Table:                       │
  │    0.0.0.0/0 → Internet Gateway    │
  │    10.0.0.0/16 → local             │
  └─────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: terraform/vpc.tf
  CIDR: 10.0.0.0/16 (65,536 IP addresses)
  Subnet: 1 public subnet (10.0.1.0/24) in eu-west-1a
  IGW: Attached to VPC for internet access
  Route Table: Routes 0.0.0.0/0 through the Internet Gateway
  EC2 instance lives in the public subnet with a public IP

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I provisioned a VPC with a 10.0.0.0/16
CIDR block using Terraform. I created a public subnet, attached an
Internet Gateway, and configured a route table that sends all
outbound traffic (0.0.0.0/0) through the IGW. Our EC2 instance
sits in this public subnet with a public IP address so B2B
customers can access the website."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Forgetting to attach the Internet Gateway to the VPC
✅ Without an IGW, your EC2 instance has no internet access.
   SSH connections, package installs, and git pulls will all fail.
