
resource "aws_ecs_cluster" "this" {
  name = "${var.name}-ecs-cluster"
  tags = { Name = "${var.name}-ecs-cluster" }
}


resource "aws_iam_role" "ecs_execution_role" {
  name               = "${var.name}-ecs-exec-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume.json
}
data "aws_iam_policy_document" "ecs_task_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}
resource "aws_iam_role_policy_attachment" "ecs_exec_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}


resource "aws_iam_role" "ecs_task_role" {
  name               = "${var.name}-ecs-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume.json
}
resource "aws_iam_role_policy_attachment" "ecs_task_policy_attach" {
  role       = aws_iam_role.ecs_task_role.name
  policy_arn = var.task_role_policy_arn
}


resource "aws_iam_role" "ecs_autoscale_role" {
  name = "${var.name}-ecs-autoscale-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect    = "Allow",
      Principal = { Service = "application-autoscaling.amazonaws.com" },
      Action    = "sts:AssumeRole"
    }]
  })
}
resource "aws_iam_role_policy" "ecs_autoscale_policy" {
  name = "${var.name}-ecs-autoscale-policy"
  role = aws_iam_role.ecs_autoscale_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Action = [
        "ecs:UpdateService",
        "ecs:DescribeServices"
      ],
      Resource = "*"
    }]
  })
}


output "cluster_id" {
  value = aws_ecs_cluster.this.id
}
output "ecs_execution_role_arn" {
  value = aws_iam_role.ecs_execution_role.arn
}
output "ecs_task_role_arn" {
  value = aws_iam_role.ecs_task_role.arn
}
output "autoscale_role_arn" {
  value = aws_iam_role.ecs_autoscale_role.arn
}
