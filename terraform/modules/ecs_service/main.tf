

resource "aws_security_group" "ecs_task_sg" {
  name        = "${var.name}-ecs-sg"
  description = "Security group for ECS Fargate tasks"
  vpc_id      = var.vpc_id

  ingress = [{
    description              = "Allow ALB to reach ECS tasks",
    protocol                 = "tcp",
    from_port                = var.container_port,
    to_port                  = var.container_port,
    source_security_group_id = var.alb_security_group_id
  }]
  egress = [{
    description = "Allow all outbound",
    protocol    = "-1",
    from_port   = 0,
    to_port     = 0,
    cidr_blocks = ["0.0.0.0/0"]
  }]
  tags = { Name = "${var.name}-ecs-sg" }
}


resource "aws_ecs_task_definition" "task_def" {
  family                   = "${var.name}-task"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = var.execution_role_arn
  task_role_arn            = var.task_role_arn
  container_definitions = jsonencode([{
    name  = "app"
    image = var.container_image
    portMappings = [{
      containerPort = var.container_port
      protocol      = "tcp"
    }]
    environment = [
      {
        name  = "DB_USERNAME"
        value = data.vault_generic_secret.db_creds.data["username"]
      },
      {
        name  = "DB_PASSWORD"
        value = data.vault_generic_secret.db_creds.data["password"]
      }

    ]
    logConfiguration = {
      logDriver = "awslogs"
      options = {
        awslogs-group         = var.log_group_name
        awslogs-region        = var.aws_region
        awslogs-stream-prefix = "ecs"
      }
    }
  }])
}


provider "vault" {
  address = var.vault_address

  token = var.vault_token
}
data "vault_generic_secret" "db_creds" {
  path = var.vault_db_secret_path
}


resource "aws_ecs_service" "service" {
  name                               = "${var.name}-service"
  cluster                            = var.cluster_id
  task_definition                    = aws_ecs_task_definition.task_def.arn
  launch_type                        = "FARGATE"
  desired_count                      = var.desired_count
  deployment_minimum_healthy_percent = 50
  deployment_maximum_percent         = 200

  network_configuration {
    subnets          = var.private_subnets
    security_groups  = [aws_security_group.ecs_task_sg.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = var.target_group_arn
    container_name   = "app"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http]
}


resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = var.autoscale_max_capacity
  min_capacity       = var.autoscale_min_capacity
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.service.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
  role_arn           = var.autoscale_role_arn
}


resource "aws_appautoscaling_policy" "ecs_cpu_policy" {
  name               = "${var.name}-cpu-policy"
  service_namespace  = "ecs"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = "ecs:service:DesiredCount"
  policy_type        = "TargetTrackingScaling"

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = var.autoscale_target_cpu
    scale_in_cooldown  = 60
    scale_out_cooldown = 60
  }
}


output "service_name" {
  value = aws_ecs_service.service.name
}
output "ecs_service_security_group_id" {
  value = aws_security_group.ecs_task_sg.id
}
