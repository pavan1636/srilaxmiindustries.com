# Create a Security Group for the Web Server
resource "aws_security_group" "web" {
  name        = "${var.project_name}-web-sg"
  description = "Allow public HTTP/HTTPS traffic and restricted SSH access"
  vpc_id      = aws_vpc.main.id

  # Allow Public HTTP Traffic (Port 80)
  ingress {
    description = "Allow public HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow Public HTTPS Traffic (Port 443)
  ingress {
    description = "Allow public HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Restrict SSH (Port 22) to Trusted IP only
  ingress {
    description = "Allow SSH from trusted IP only"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.trusted_ssh_ip]
  }

  # Allow all outbound traffic (Egress)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # -1 means all protocols (TCP, UDP, ICMP, etc.)
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-web-sg"
  }
}
