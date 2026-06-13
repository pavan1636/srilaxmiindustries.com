# Sri Laxmi Engineering Works - B2B Manufacturing Cloud Platform

An enterprise-grade, cloud-deployed B2B manufacturing and precision engineering platform. This project acts as a DevOps and full-stack cloud engineering showcase, utilizing **Terraform (IaC)**, **Docker Compose**, **GitHub Actions (CI/CD)**, **AWS S3 & SES**, **PostgreSQL**, **Datadog Monitoring**, and automated database backup systems.

---

## 🏗️ Cloud Infrastructure & System Architecture

The following diagram illustrates the automated architecture of the platform, showing how users connect via Route 53 DNS and CloudFront to Nginx on our EC2 server, which handles routing, database transactions, cloud storage uploads, and email alerts.

```mermaid
graph TD
    Client[B2B Client / Browser] -->|HTTPS Requests| Route53[AWS Route 53 DNS]
    Route53 -->|DNS Resolution| CF[AWS CloudFront CDN]
    CF -->|Requests| ALB[Application Load Balancer / Nginx]
    ALB -->|Port 80/443| EC2[EC2 Instance - Docker Host]
    
    subgraph EC2 Instance [EC2 Docker Compose Environment]
        Nginx[Frontend - Nginx Container] -->|Reverse Proxy /api| Express[Backend - Express Container]
        Express -->|Read/Write| Postgres[Database - PostgreSQL Container]
    end

    Express -->|Upload CAD/PDF| S3Upload[Private S3 Bucket - Uploads]
    Express -->|Send Emails| SES[AWS Simple Email Service]

    subgraph Monitoring & Automation
        BackupScript[Nightly Backup Script] -->|pg_dump & S3 Upload| S3Backup[Private S3 Bucket - Backups]
        Datadog[Datadog Agent Container] -->|Metrics & Logs| DDCloud[Datadog Cloud Dashboard]
    end
