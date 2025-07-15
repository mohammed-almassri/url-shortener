variable "name" { description = "Name prefix for VPC resources" }
variable "vpc_cidr" { description = "CIDR block for the VPC" }
variable "public_subnet_cidrs" { type = list(string) }
variable "public_subnet_azs" { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "private_subnet_azs" { type = list(string) }
