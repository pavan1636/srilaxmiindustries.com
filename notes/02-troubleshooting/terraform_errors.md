# TROUBLESHOOTING — Terraform Errors
# Sri Laxmi Industries — Common Terraform issues and fixes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 1: Invalid provider configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Error: No valid credential sources found for AWS Provider.

  Why it happens:
    Terraform cannot find valid AWS credentials. Either aws configure
    was not run, or the credentials are expired/incorrect.

  How to fix:
    1. Run aws configure and enter valid Access Key + Secret Key
    2. Verify credentials: aws sts get-caller-identity
    3. Check the region matches what's in providers.tf

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 2: S3 bucket name conflict
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Error: Error creating S3 bucket: BucketAlreadyExists

  Why it happens:
    S3 bucket names must be GLOBALLY unique across all AWS accounts worldwide.
    Someone else has already claimed that bucket name.

  How to fix:
    Update the bucket name in terraform/variables.tf:
    default = "srilaxmi-enquiry-uploads-pavan"  → add a unique suffix

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 3: Resource already exists
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Error: Creating VPC: VpcLimitExceeded / Error: already exists

  Why it happens:
    State file was deleted or corrupted, but resources still exist in AWS.
    Terraform does not know about them and tries to create duplicates.

  How to fix:
    Option A: Import existing resources:
      terraform import aws_vpc.main vpc-0abcdef1234567890
    Option B: Destroy manually in AWS Console, then re-apply
    Option C: terraform state rm <resource> to remove orphan references

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 4: Instance type restriction (AWS Academy)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Error launching source instance: VcpuLimitExceeded or
    The specified instance type is not supported in this region

  Why it happens:
    AWS Academy / Sandbox accounts restrict available instance types.
    t2.micro may not be allowed — only t3.micro is permitted.

  How to fix:
    Update terraform/variables.tf:
      default = "t3.micro"   # was "t2.micro"
    Then re-run:
      terraform plan
      terraform apply

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR 5: S3 lifecycle rule filter warning
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Symptom:
    Warning: Argument is deprecated: Use filter instead

  Why it happens:
    The AWS provider deprecated the old lifecycle_rule format.
    The new format requires an explicit filter {} block.

  How to fix:
    In terraform/s3.tf, add an empty filter block:
      rule {
        id      = "expire-old-backups"
        enabled = true
        filter {}     ← ADD THIS LINE
        expiration { days = 90 }
      }
