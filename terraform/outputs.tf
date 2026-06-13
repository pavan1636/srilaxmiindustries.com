output "ec2_public_ip" {
  value       = aws_instance.web.public_ip
  description = "The public IP address of the EC2 instance"
}

output "s3_upload_bucket_name" {
  value       = aws_s3_bucket.uploads.id
  description = "Name of the S3 bucket created for CAD uploads"
}

output "s3_backup_bucket_name" {
  value       = aws_s3_bucket.backups.id
  description = "Name of the S3 bucket created for backups"
}
