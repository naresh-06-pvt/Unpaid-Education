provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "quiz_bucket" {
  bucket = "quiz-game-state"
}
