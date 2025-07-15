
provider "aws" {
  region = var.aws_region
}


resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/${var.name}-url-shortener"
  retention_in_days = 30
}


module "vpc" {
  source               = "./modules/vpc"
  name                 = var.name
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  public_subnet_azs    = var.public_subnet_azs
  private_subnet_cidrs = var.private_subnet_cidrs
  private_subnet_azs   = var.private_subnet_azs
}


module "alb" {
  source            = "./modules/alb"
  name              = var.name
  vpc_id            = module.vpc.vpc_id
  public_subnets    = module.vpc.public_subnets
  target_port       = var.container_port
  health_check_path = var.health_check_path
}


module "ecs_cluster" {
  source               = "./modules/ecs_cluster"
  name                 = var.name
  task_role_policy_arn = var.task_role_policy_arn
}


module "ecs_service" {
  source                 = "./modules/ecs_service"
  name                   = var.name
  cluster_id             = module.ecs_cluster.cluster_id
  cluster_name           = "${var.name}-ecs-cluster"
  private_subnets        = module.vpc.private_subnets
  alb_security_group_id  = module.alb.alb_sg_id
  target_group_arn       = module.alb.target_group_arn
  execution_role_arn     = module.ecs_cluster.ecs_execution_role_arn
  task_role_arn          = module.ecs_cluster.ecs_task_role_arn
  container_image        = var.container_image
  container_port         = var.container_port
  task_cpu               = var.task_cpu
  task_memory            = var.task_memory
  desired_count          = var.desired_count
  log_group_name         = aws_cloudwatch_log_group.ecs_logs.name
  aws_region             = var.aws_region
  vault_address          = var.vault_address
  vault_token            = var.vault_token
  vault_db_secret_path   = var.vault_db_secret_path
  autoscale_min_capacity = var.autoscale_min_capacity
  autoscale_max_capacity = var.autoscale_max_capacity
  autoscale_target_cpu   = var.autoscale_target_cpu
  autoscale_role_arn     = module.ecs_cluster.autoscale_role_arn
}


output "alb_url" {
  description = "URL to access the application (DNS name of ALB)"
  value       = module.alb.alb_dns_name
}
output "ecs_service_name" {
  value = module.ecs_service.service_name
}
