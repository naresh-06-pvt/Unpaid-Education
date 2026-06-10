# Unpaid Education — Cloud-Native Education Platform

A fully automated, scalable, and containerized full-stack education platform built and deployed on AWS — covering infrastructure provisioning, CI/CD automation, containerization, and real-time monitoring. Built solo as an academic project.

---

## Architecture Overview

```
                          ┌─────────────────────────────────────────────┐
                          │                  AWS Cloud                   │
                          │                                              │
  User ──► Route 53 ──► ALB ──► EC2 (Ubuntu)                           │
                          │        ├── Nginx (reverse proxy)            │
                          │        ├── Frontend (HTML/CSS/JS)           │
                          │        └── Backend (Node.js + PM2)          │
                          │                                              │
                          │   S3 ◄── Static Assets / Backups            │
                          │   RDS ◄── Database                          │
                          │   CloudWatch ──► SNS ──► Email Alerts       │
                          │   IAM ──── Role-based Access Control        │
                          └─────────────────────────────────────────────┘

  GitHub Push ──► GitHub Actions ──► Build & Deploy ──► EC2
               └──► Jenkins (Webhook) ──► Pipeline ──► EC2

  Terraform ──── Provisions: EC2, VPC, Subnets, Security Groups, ALB
  Docker ──────── Containerizes: Frontend + Backend
  Kubernetes ──── Orchestrates: Deployments, Services, Scaling
  Bash Scripts ── Health Checks: CPU, Memory, Disk, Services, Logs
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Cloud Platform | AWS EC2, S3, IAM, VPC, Route 53, ALB, Auto Scaling, CloudWatch, SNS, CloudFront, RDS |
| Infrastructure as Code | Terraform |
| Containerization | Docker |
| Orchestration | Kubernetes (K8s) |
| CI/CD | GitHub Actions, Jenkins (webhook-triggered) |
| Web Server | Nginx, PM2 |
| Scripting | Bash, Python (boto3) |
| OS | Ubuntu (Linux) |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js |

---

## Repository Structure

```
Unpaid-Education/
├── .github/
│   └── workflows/          # GitHub Actions CI/CD pipeline definitions
├── ansible/                # Ansible playbooks for configuration management
├── backend/                # Node.js backend application
├── frontend/               # HTML/CSS/JS frontend application
├── k8s/                    # Kubernetes manifests (Deployments, Services)
├── terraform/              # Terraform IaC — EC2, VPC, ALB, Security Groups
├── Dockerfile              # Container build instructions
├── package.json            # Node.js dependencies
└── README.md
```

---

## Key Features

### Infrastructure as Code (Terraform)
- Provisions EC2 instances, VPC, public/private subnets, security groups, and ALB using Terraform
- Fully version-controlled infrastructure — repeatable and consistent across environments

### CI/CD Pipeline
- **GitHub Actions** — triggers automated build and deployment on every `git push`
- **Jenkins + GitHub Webhooks** — zero-touch end-to-end pipeline execution
- No manual deployment steps required after a code push

### Containerization & Orchestration
- Frontend and backend services containerized using Docker
- Kubernetes manifests for deployment, scaling, and environment parity between dev and production

### Monitoring & Alerting
- 5 CloudWatch alarms configured for CPU, memory, disk, and application health
- SNS email alerts for proactive incident detection
- 6 automated Bash health-check scripts for real-time server monitoring

### Scalability
- Application Load Balancer (ALB) for traffic distribution
- Auto Scaling group for handling variable load
- CloudFront CDN for fast static asset delivery

---

## Infrastructure Provisioned (Terraform)

- VPC with public and private subnets
- EC2 instance (Ubuntu) — application server
- Security Groups — port-level access control
- Application Load Balancer (ALB)
- IAM roles and policies — least-privilege access
- S3 bucket — static assets and backups
- Route 53 — DNS routing to ALB

---

## CI/CD Flow

```
Developer pushes code to GitHub
        │
        ├──► GitHub Actions Workflow triggered
        │         └── Install dependencies
        │         └── Build Docker image
        │         └── Push to registry
        │         └── SSH deploy to EC2
        │
        └──► Jenkins (via GitHub Webhook)
                  └── Pull latest code
                  └── Run pipeline stages
                  └── Restart services via PM2
```

---

## Monitoring Setup

| Check | Method | Alert |
|---|---|---|
| CPU usage | CloudWatch Alarm | SNS Email |
| Memory usage | CloudWatch + Bash script | SNS Email |
| Disk usage | Bash health-check | Log + Alert |
| Service status (Nginx/PM2) | Bash script + Systemctl | Log |
| Application logs | Journalctl + Bash | Log |

---

## Local Setup

### Prerequisites
- Docker and Docker Compose installed
- Node.js v18+

### Run locally

```bash
# Clone the repository
git clone https://github.com/naresh-06-pvt/Unpaid-Education.git
cd Unpaid-Education

# Install dependencies
npm install

# Run with Docker
docker-compose up --build

# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### Deploy to AWS with Terraform

```bash
cd terraform/

# Initialise Terraform
terraform init

# Preview infrastructure changes
terraform plan

# Apply infrastructure
terraform apply
```

---

## What I Learned

- Designing and deploying a production-style cloud architecture on AWS from scratch
- Writing reusable Terraform modules for repeatable infrastructure provisioning
- Building dual CI/CD pipelines (GitHub Actions + Jenkins) for automated zero-touch deployments
- Configuring real-time monitoring and alerting with CloudWatch and SNS
- Managing containerized workloads with Docker and Kubernetes in a real deployment environment

---

## Author

**Naresh Babu M** — Aspiring AWS Cloud & DevOps Engineer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-naresh--babu--m-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/naresh-babu-m-16b270400)
[![GitHub](https://img.shields.io/badge/GitHub-naresh--06--pvt-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/naresh-06-pvt)
[![Email](https://img.shields.io/badge/Email-naresh.techit01@gmail.com-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:naresh.techit01@gmail.com)

---

> *"Automate everything. Break nothing. Learn always."*
