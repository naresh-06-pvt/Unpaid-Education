const Game = require("../models/gameModel");

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Game.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Add a new question
exports.addQuestion = async (req, res) => {
  try {
    const question = new Game(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// Seed initial questions
exports.seedQuestions = async (req, res) => {
  try {
    const seedData = [
      { question: "What is Kubernetes?", answers: ["Orchestrator", "Database"], correct: "Orchestrator" },
      { question: "AWS serverless service?", answers: ["EC2", "Lambda"], correct: "Lambda" }
    ];
    await Game.insertMany(seedData);
    res.json({ message: "Seeded successfully" });
  } catch (err) {
    res.status(500).json({ error: "Seeding failed" });
  }
};
