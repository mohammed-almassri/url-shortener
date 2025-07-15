variable "name" { description = "Name prefix for ALB resources" }
variable "vpc_id" { description = "VPC ID where ALB is deployed" }
variable "public_subnets" { description = "List of public subnet IDs for ALB" }
variable "target_port" { description = "Port on the target (container) to receive traffic" }
variable "health_check_path" { description = "Health check HTTP path" }
