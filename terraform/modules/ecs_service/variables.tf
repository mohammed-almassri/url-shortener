variable "name" { description = "Name prefix for ECS service" }
variable "cluster_id" { description = "ECS Cluster ID to deploy into" }
variable "cluster_name" { description = "ECS Cluster name (for autoscaling resource_id)" }
variable "private_subnets" { description = "List of private subnet IDs for ECS tasks" }
variable "alb_security_group_id" { description = "Security group ID of the ALB (for ingress source)" }
variable "target_group_arn" { description = "ARN of the ALB target group" }
variable "execution_role_arn" { description = "IAM role ARN for ECS task execution" }
variable "task_role_arn" { description = "IAM role ARN for the application task" }
variable "container_image" { description = "Docker image for the container" }
variable "container_port" { description = "Container port to expose (e.g., 80)" }
variable "task_cpu" { description = "Fargate task CPU units" }
variable "task_memory" { description = "Fargate task memory (MB)" }
variable "desired_count" { description = "Initial number of tasks" }
variable "log_group_name" { description = "CloudWatch Logs group for container logs" }
variable "aws_region" { description = "AWS region (for logging configuration)" }

variable "vault_address" { description = "URL of Vault server" }
variable "vault_token" { description = "Vault token with access to the secret (sensitive)" }
variable "vault_db_secret_path" { description = "Path in Vault to the database credentials secret" }

variable "autoscale_min_capacity" { description = "Min number of tasks" }
variable "autoscale_max_capacity" { description = "Max number of tasks" }
variable "autoscale_target_cpu" { description = "Target CPU utilization percentage for scaling" }
variable "autoscale_role_arn" { description = "IAM role ARN for Application AutoScaling (from ecs_cluster module)" }
