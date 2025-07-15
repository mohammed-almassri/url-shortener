
name = "prod-url-shortener"


aws_region = "us-east-1"


vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.101.0/24", "10.0.102.0/24"]
public_subnet_azs    = ["us-east-1a", "us-east-1b"]
private_subnet_azs   = ["us-east-1a", "us-east-1b"]


container_image   = "050752607919.dkr.ecr.us-east-1.amazonaws.com/prod/url-shortener:latest"
container_port    = 80
task_cpu          = 256
task_memory       = 512
desired_count     = 2
health_check_path = "/health"


task_role_policy_arn = ""


autoscale_min_capacity = 2
autoscale_max_capacity = 5
autoscale_target_cpu   = 50


vault_address        = "https://vault.example.com"
vault_db_secret_path = "secret/data/prod/db-creds"
vault_token          = "s.XYZ1234abcd..."
