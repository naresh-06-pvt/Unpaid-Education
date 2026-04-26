import { useEffect, useState } from "react";
import socket from "../socket";
import confetti from "canvas-confetti";
import "./GameStyle.css";

function Player() {
  const avatars = [
    "🐵", "🦊", "🐼", "🐯", "🦁",
    "🐸", "🐧", "🐰", "🐨", "🐶",
    "🐱", "🐷", "🐙", "🦄", "🐲",
  ];

  const [name, setName] = useState("");
  const [gamePin, setGamePin] = useState("");
  const [avatar, setAvatar] = useState("🐵");
  const [joined, setJoined] = useState(false);

  const [question, setQuestion] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const [answered, setAnswered] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const [questionNumber, setQuestionNumber] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);

  useEffect(() => {
    socket.on("nextQuestion", (data) => {
      setQuestion(data.question);
      setQuestionNumber(data.questionNumber || 0);
      setTotalQuestions(data.totalQuestions || 0);
      setTimeLeft(data.timeLimit || 25);

      setAnswered(false);
      setAnswerResult(null);
      setGameOver(false);
    });

    socket.on("answerResult", (data) => {
      setAnswerResult(data);
      setAnswered(true);
    });

    socket.on("leaderboardUpdated", (data) => {
      setLeaderboard(data || []);
    });

    socket.on("gameOver", (data) => {
      setLeaderboard(data || []);
      setGameOver(true);
      confetti({ particleCount: 200, spread: 100 });
    });

    socket.on("errorMessage", (msg) => {
      alert(msg);
      setJoined(false);
    });

    return () => {
      socket.off("nextQuestion");
      socket.off("answerResult");
      socket.off("leaderboardUpdated");
      socket.off("gameOver");
      socket.off("errorMessage");
    };
  }, []);

  useEffect(() => {
    if (!joined || !question || answered || gameOver) return;

    if (timeLeft <= 0) {
      setAnswered(true);
      setAnswerResult({
        correct: false,
        score: null,
        timeout: true,
      });
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [joined, question, answered, gameOver, timeLeft]);

  const joinGame = () => {
    if (!gamePin || !name) {
      alert("Enter Game PIN and Name");
      return;
    }

    socket.emit("joinGame", {
      gamePin,
      name,
      playerName: name,
      avatar,
    });

    setJoined(true);
  };

  const answer = (opt) => {
    if (answered || !question) return;

    socket.emit("answer", {
      gamePin,
      name,
      correct: opt === question.answer,
    });
  };

  if (!joined) {
    return (
      <div className="login-bg">
        <h1 className="login-logo">Unpaid Education</h1>

        <div className="login-card">
          <input
            placeholder="Game PIN"
            value={gamePin}
            onChange={(e) => setGamePin(e.target.value)}
          />

          <input
            placeholder="Nickname"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <h3>Choose Avatar</h3>

          <div className="avatar-grid">
            {avatars.map((av, index) => (
              <button
                key={index}
                type="button"
                className={avatar === av ? "avatar active-avatar" : "avatar"}
                onClick={() => setAvatar(av)}
              >
                {av}
              </button>
            ))}
          </div>

          <button onClick={joinGame}>Enter</button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="leaderboard-bg">
        <h1 className="board-title">🏆 Final Scoreboard</h1>

        <div className="final-board">
          {(leaderboard || []).map((p, i) => (
            <div className="final-row" key={i}>
              <span>
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {p.avatar || "🐵"} {p.name}
              </span>
              <b>{p.score}</b>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (answered) {
    return (
      <div className="result-bg">
        {answerResult?.correct ? (
          <h1 className="correct">✅ Correct Answer</h1>
        ) : answerResult?.timeout ? (
          <h1 className="timeout">⏰ Time Over</h1>
        ) : (
          <h1 className="wrong">❌ Wrong Answer</h1>
        )}

        {answerResult?.score !== null && answerResult?.score !== undefined && (
          <h2>Your Score: {answerResult.score}</h2>
        )}

        <p>Waiting for other players...</p>

        <div className="small-leaderboard">
          <h2>Live Leaderboard</h2>

          {(leaderboard || []).map((p, i) => (
            <p key={i}>
              #{i + 1} {p.avatar || "🐵"} {p.name} - {p.score}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="question-bg">
      <div className="question-top">
        <div className="timer-circle">{timeLeft}</div>

        <h2>
          Question {questionNumber}/{totalQuestions}
        </h2>

        <div className="answer-count">
          {(leaderboard || []).length} Answers
        </div>
      </div>

      <h1 className="question-title">
        {question ? question.question : "Waiting for host to start..."}
      </h1>

      <div className="brand-box">Unpaid Education</div>

      <div className="answers-grid">
        {(question?.options || []).map((opt, i) => (
          <button
            key={i}
            onClick={() => answer(opt)}
            className={`answer-btn option-${i}`}
          >
            <span className="shape">
              {i === 0 && "▲"}
              {i === 1 && "◆"}
              {i === 2 && "●"}
              {i === 3 && "■"}
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Player;