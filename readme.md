# 🚀 URL Shortener (Production Deployment on AWS)

This is a production-grade URL shortener application deployed to AWS using ECS Fargate, backed by Aurora PostgreSQL (Serverless v2), Redis (ElastiCache), and Vault for secure secret management. The infrastructure is provisioned with Terraform using a modular, scalable architecture.

---

## 🧱 Architecture Overview

```
Client → ALB → ECS Task (PHP App)
                      ├── Aurora PostgreSQL (RDS Serverless v2)
                      └── ElastiCache Redis (cache.t4g.micro)
                          ↑
                      Secrets managed by HashiCorp Vault
```

All services are deployed inside a private VPC:

- No public access to Redis or Aurora
- ECS Task securely fetches secrets from Vault at runtime
- Load Balancer is public-facing (HTTP)

---

## 🛠️ Stack

- **Application**: PHP 8.3 FPM + Laravel
- **Frontend**: Vite + React
- **Container**: Docker, deployed to ECR
- **Orchestration**: ECS Fargate
- **Database**: Aurora PostgreSQL (Serverless v2)
- **Cache**: ElastiCache Redis (t4g.micro)
- **Secrets Management**: HashiCorp Vault
- **Infrastructure as Code**: Terraform

---

## 🔐 Secrets Management (Vault)

Secrets like DB credentials and Redis tokens are generated via Terraform and stored in Vault under:

```
secret/database/creds        # Aurora username/password
secret/redis/config          # Redis AUTH token
```

ECS tasks retrieve secrets via the Vault provider and inject them as environment variables into containers.

## 🛡 Security

- No public access to DB or Redis
- ECS tasks limited to only required ports
- DB password & Redis token generated and stored securely in Vault
- ALB exposes **only** port 80 (no admin ports)

---

## 📊 Autoscaling

- ECS Fargate service auto-scales based on **CPU utilization**
- Aurora Serverless v2 auto-scales from 0.5 to 2 ACUs
- Redis is single-node (for cost); you can upgrade to a multi-node cluster later

---

## 📌 Notes

- For production SSL support, integrate ACM + HTTPS in the ALB module
- For secret auto-rotation, consider Vault dynamic secrets or AWS Secrets Manager
- Redis is not highly available in this setup (single node). Add replicas for HA.
