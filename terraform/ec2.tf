# Dynamically look up the latest official Ubuntu 22.04 LTS AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical (Official Ubuntu Owner ID)

  filter {
    name     = "name"
    values   = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name     = "virtualization-type"
    values   = ["hvm"]
  }
}

# Create a Key Pair for secure SSH login (Optional if you use Session Manager, but useful for SSH pipelines)
# Note: You can create a key pair named 'srilaxmi-deployer' in the AWS Console beforehand
# or omit it if deploying via SSM. We will add a variable for it.
variable "ssh_key_name" {
  type        = string
  description = "Name of the AWS Key Pair to associate with the instance for SSH"
  default     = "srilaxmi-deployer" # Attached the key
}

# Provision the EC2 Virtual Server
resource "aws_instance" "web" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.instance_type
  subnet_id            = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  key_name             = var.ssh_key_name != "" ? var.ssh_key_name : null

  # User Data Script - runs once on first startup to install Docker
  user_data = <<-EOF
              #!/bin/bash
              # Update packages
              apt-get update -y
              apt-get upgrade -y

              # Install required system tools
              apt-get install -y curl git apt-transport-https ca-certificates gnupg lsb-release

              # Install Docker
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker

              # Install Docker Compose (V2)
              mkdir -p /usr/local/lib/docker/cli-plugins
              curl -SL https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
              chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

              # Add standard symlink for docker-compose
              ln -s /usr/local/lib/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose

              # Add ubuntu user to docker group to run containers without sudo
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "${var.project_name}-host"
  }
}
