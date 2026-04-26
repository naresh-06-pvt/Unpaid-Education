# terraform/variables.tf

variable "region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name prefix for resources"
  type        = string
  default     = "devops-quiz"
}

variable "bucket_name" {
  description = "S3 bucket name for quiz game state"
  type        = string
  default     = "devops-quiz-game-state"
}

variable "instance_type" {
  description = "EC2 instance type for backend"
  type        = string
  default     = "t3.micro"
}

variable "desired_capacity" {
  description = "Number of instances in autoscaling group"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of instances"
  type        = number
  default     = 4
}
