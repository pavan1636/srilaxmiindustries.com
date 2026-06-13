variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "eu-west-1" # Ireland region
}

variable "instance_type" {
  type        = string
  description = "EC2 instance size"
  default     = "t2.micro" # AWS Free Tier eligible
}

variable "trusted_ssh_ip" {
  type        = string
  description = "Your trusted public IP address for SSH access (in CIDR notation, e.g., 203.0.113.50/32)"
  default     = "0.0.0.0/0" # Open to public for initial config
}

variable "project_name" {
  type        = string
  description = "Project name tag prefix"
  default     = "srilaxmi-b2b"
}

variable "upload_bucket_name" {
  type        = string
  description = "Unique name for the S3 bucket storing drawing uploads"
  default     = "srilaxmi-enquiry-uploads-pavan" # Customize to make globally unique
}

variable "backup_bucket_name" {
  type        = string
  description = "Unique name for the S3 bucket storing DB backups"
  default     = "srilaxmi-db-backups-pavan" # Customize to make globally unique
}
