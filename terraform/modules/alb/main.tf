
resource "aws_security_group" "alb_sg" {
  name        = "${var.name}-alb-sg"
  description = "Security group for ALB"
  vpc_id      = var.vpc_id

  ingress = [{
    protocol    = "tcp",
    from_port   = 80,
    to_port     = 80,
    cidr_blocks = ["0.0.0.0/0"]
  }]

  egress = [{
    protocol    = "-1",
    from_port   = 0,
    to_port     = 0,
    cidr_blocks = ["0.0.0.0/0"]
  }]
  tags = { Name = "${var.name}-alb-sg" }
}


resource "aws_lb" "this" {
  name               = "${var.name}-alb"
  load_balancer_type = "application"
  internal           = false
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = var.public_subnets
  tags               = { Name = "${var.name}-alb" }
}


resource "aws_lb_target_group" "this" {
  name        = "${var.name}-tg"
  port        = var.target_port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = var.vpc_id
  health_check {
    path                = var.health_check_path
    matcher             = "200"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
  tags = { Name = "${var.name}-tg" }
}


resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.this.arn
  }
}


output "alb_arn" {
  value = aws_lb.this.arn
}
output "alb_dns_name" {
  value = aws_lb.this.dns_name
}
output "alb_sg_id" {
  value = aws_security_group.alb_sg.id
}
output "target_group_arn" {
  value = aws_lb_target_group.this.arn
}
