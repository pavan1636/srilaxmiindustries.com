# CONCEPT 015 — What are Security Groups?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT IS IT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Security Groups are virtual firewalls that control inbound and
outbound network traffic for AWS resources like EC2 instances.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SIMPLE ANALOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Security Group = a bouncer at a nightclub door
  The bouncer has a list: "Allow entry on port 80 (HTTP),
  port 443 (HTTPS), port 22 (SSH). Block everything else."
  Default: deny ALL inbound traffic. You must explicitly allow it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
3 KEY FACTS TO REMEMBER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Security Groups are STATEFUL — if you allow inbound, response is auto-allowed
  2. Default: ALL inbound blocked, ALL outbound allowed
  3. Rules reference ports AND source IPs (e.g., SSH from your IP only)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IN OUR PROJECT (Sri Laxmi Industries)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  File: terraform/security_groups.tf

  Inbound Rules:
    Port 80  (HTTP)  ← 0.0.0.0/0  (public website access)
    Port 443 (HTTPS) ← 0.0.0.0/0  (public SSL access)
    Port 22  (SSH)   ← 0.0.0.0/0  (deployment access)

  Outbound Rules:
    All traffic allowed (for package installs, S3, SES, Datadog)

  Note: In production, SSH should be restricted to your specific
  IP address (e.g., 203.0.113.50/32) instead of 0.0.0.0/0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTERVIEW ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"In Sri Laxmi Industries, I defined Security Groups in Terraform
that allow inbound HTTP (80) and HTTPS (443) from all sources for
public website access, and SSH (22) for deployment. All outbound
traffic is permitted so the containers can reach S3, SES, and
Datadog. For production hardening, I would restrict SSH access
to a specific trusted IP address using CIDR notation."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COMMON MISTAKE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Leaving SSH (port 22) open to 0.0.0.0/0 in production
✅ Restrict SSH to your specific IP address. Open SSH access
   allows brute-force attacks from anywhere in the world.
