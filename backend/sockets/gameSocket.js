module.exports = (io) => {
  let players = [];
  let scores = {};
  let questions = [
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

  let currentQuestionIndex = 0;
  let answeredPlayers = new Set();

  io.on("connection", (socket) => {
    console.log("✅ New user connected:", socket.id);

    // 🔹 JOIN GAME
    socket.on("joinGame", (name) => {
      const player = { id: socket.id, name };

      players.push(player);
      scores[name] = 0;

      console.log("👤 Player joined:", name);

      io.emit("playersUpdate", players);
    });

    // 🔹 START GAME
    socket.on("startGame", () => {
      currentQuestionIndex = 0;
      answeredPlayers.clear();

      io.emit("gameStarted", {
        question: questions[currentQuestionIndex],
      });
    });

    // 🔹 NEXT QUESTION
    socket.on("nextQuestion", () => {
      currentQuestionIndex++;
      answeredPlayers.clear();

      if (currentQuestionIndex < questions.length) {
        io.emit("nextQuestion", {
          question: questions[currentQuestionIndex],
        });
      } else {
        // 🏁 GAME OVER
        const leaderboard = Object.entries(scores)
          .map(([name, score]) => ({ name, score }))
          .sort((a, b) => b.score - a.score);

        io.emit("leaderboard", leaderboard);
        io.emit("gameOver");
      }
    });

    // 🔹 ANSWER
    socket.on("answer", ({ name, correct }) => {
      // 🚫 prevent multiple answers
      if (answeredPlayers.has(name)) return;

      answeredPlayers.add(name);

      if (correct) {
        scores[name] += 1;
      }

      // 🏆 LIVE LEADERBOARD
      const leaderboard = Object.entries(scores)
        .map(([name, score]) => ({ name, score }))
        .sort((a, b) => b.score - a.score);

      io.emit("leaderboard", leaderboard);
    });

    // 🔹 DISCONNECT
    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);

      players = players.filter((p) => p.id !== socket.id);

      io.emit("playersUpdate", players);
    });
  });
};