# ----------------------------------------------------
# S3 Bucket for CAD / PDF Enquiry Uploads
# ----------------------------------------------------
resource "aws_s3_bucket" "uploads" {
  bucket        = var.upload_bucket_name
  force_destroy = true # Allows destroying bucket with files during tests

  tags = {
    Name = "${var.project_name}-uploads"
  }
}

# Block all public access to the uploads bucket
resource "aws_s3_bucket_public_access_block" "uploads_block" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ----------------------------------------------------
# S3 Bucket for Database Backups
# ----------------------------------------------------
resource "aws_s3_bucket" "backups" {
  bucket        = var.backup_bucket_name
  force_destroy = true

  tags = {
    Name = "${var.project_name}-backups"
  }
}

# Block all public access to the backups bucket
resource "aws_s3_bucket_public_access_block" "backups_block" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Automatically delete database backups older than 30 days
resource "aws_s3_bucket_lifecycle_configuration" "backups_lifecycle" {
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "delete-old-backups"
    status = "Enabled"

    filter {}

    expiration {
      days = 30
    }
  }
}
