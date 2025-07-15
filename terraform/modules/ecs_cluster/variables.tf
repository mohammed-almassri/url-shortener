variable "name" { description = "Name prefix for ECS cluster and roles" }
variable "task_role_policy_arn" { description = "Optional IAM policy ARN to attach to the ECS task role for app access" }
