const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// 🔥 IMPORTANT: load questions from file
const questions = require("./questions");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const games = {};

function getLeaderboard(gamePin) {
  const game = games[gamePin];
  if (!game) return [];

  return [...game.players].sort((a, b) => b.score - a.score);
}

function sendQuestion(gamePin) {
  const game = games[gamePin];
  if (!game) return;

  if (game.currentQuestion >= questions.length) {
    const finalLeaderboard = getLeaderboard(gamePin);

    io.to(gamePin).emit("leaderboardUpdated", finalLeaderboard);
    io.to(gamePin).emit("gameOver", finalLeaderboard);

    return;
  }

  game.answeredPlayers = [];

  const question = questions[game.currentQuestion];

  io.to(gamePin).emit("nextQuestion", {
    question,
    questionNumber: game.currentQuestion + 1,
    totalQuestions: questions.length,
    timeLimit: 25,
  });

  clearTimeout(game.timer);

  game.timer = setTimeout(() => {
    game.currentQuestion++;
    sendQuestion(gamePin);
  }, 25000);
}

function checkAllAnswered(gamePin) {
  const game = games[gamePin];
  if (!game) return;

  if (game.answeredPlayers.length >= game.players.length) {
    clearTimeout(game.timer);

    setTimeout(() => {
      game.currentQuestion++;
      sendQuestion(gamePin);
    }, 1500);
  }
}

io.on("connection", (socket) => {
  console.log("✅ New user connected:", socket.id);

  socket.on("createGame", () => {
    const gamePin = Math.floor(100000 + Math.random() * 900000).toString();

    games[gamePin] = {
      hostId: socket.id,
      players: [],
      currentQuestion: 0,
      answeredPlayers: [],
      timer: null,
    };

    socket.join(gamePin);

    console.log("🎮 Game created:", gamePin);

    socket.emit("gameCreated", { gamePin });
  });

  socket.on("joinGame", (data) => {
    const gamePin = data.gamePin;
    const name = data.name || data.playerName;
    const avatar = data.avatar || "🐵";

    if (!games[gamePin]) {
      socket.emit("errorMessage", "Invalid Game PIN");
      return;
    }

    socket.join(gamePin);

    const alreadyJoined = games[gamePin].players.find(
      (p) => p.id === socket.id
    );

    if (!alreadyJoined) {
      games[gamePin].players.push({
        id: socket.id,
        name,
        avatar, // ✅ FIXED
        score: 0,
      });
    }

    console.log("👤 Player joined:", name, avatar);

    io.to(gamePin).emit("playersUpdated", games[gamePin].players);
    io.to(gamePin).emit("leaderboardUpdated", getLeaderboard(gamePin));
  });

  socket.on("startGame", (gamePin) => {
    if (!games[gamePin]) return;

    games[gamePin].currentQuestion = 0;
    sendQuestion(gamePin);
  });

  socket.on("answer", (data) => {
    const { gamePin, correct } = data;
    const game = games[gamePin];

    if (!game) return;

    if (game.answeredPlayers.includes(socket.id)) return;

    game.answeredPlayers.push(socket.id);

    const player = game.players.find((p) => p.id === socket.id);

    if (player && correct) {
      player.score += 10;
    }

    socket.emit("answerResult", {
      correct,
      score: player ? player.score : 0,
    });

    io.to(gamePin).emit("leaderboardUpdated", getLeaderboard(gamePin));

    checkAllAnswered(gamePin);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});