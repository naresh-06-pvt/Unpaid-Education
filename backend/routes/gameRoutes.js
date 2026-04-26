const express = require("express");
const router = express.Router();

// ✅ Sample questions (for now)
const questions = [
  {
    id: 1,
    question: "What is 2 + 2?",
    options: ["1", "2", "3", "4"],
    answer: "4",
  },
  {
    id: 2,
    question: "Capital of India?",
    options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
    answer: "Delhi",
  },
  {
    id: 3,
    question: "Which is a programming language?",
    options: ["HTML", "CSS", "JavaScript", "Photoshop"],
    answer: "JavaScript",
  },
];

// ✅ GET all questions
router.get("/", (req, res) => {
  res.json(questions);
});

module.exports = router;