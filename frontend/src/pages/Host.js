import React, { useEffect, useState } from "react";
import socket from "../socket";
import "./GameStyle.css";

function Host() {
  const [gamePin, setGamePin] = useState("");
  const [players, setPlayers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    socket.on("gameCreated", (data) => {
      const pin = data?.gamePin || data?.gameId || data;
      setGamePin(pin);
    });

    socket.on("playersUpdated", (data) => {
      setPlayers(data || []);
    });

    socket.on("playerJoined", (data) => {
      setPlayers(data || []);
    });

    socket.on("leaderboardUpdated", (data) => {
      setLeaderboard(data || []);
    });

    socket.on("leaderboard", (data) => {
      setLeaderboard(data || []);
    });

    socket.on("updateScores", (data) => {
      setLeaderboard(data || []);
    });

    return () => {
      socket.off("gameCreated");
      socket.off("playersUpdated");
      socket.off("playerJoined");
      socket.off("leaderboardUpdated");
      socket.off("leaderboard");
      socket.off("updateScores");
    };
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };

  const startGame = () => {
    if (!gamePin) {
      alert("Create game first");
      return;
    }

    socket.emit("startGame", gamePin);
  };

  return (
    <div className="host-bg">
      {!gamePin ? (
        <div className="pin-card">
          <h1 className="game-logo">Unpaid Education</h1>

          <button className="main-btn" onClick={createGame}>
            Create Game
          </button>
        </div>
      ) : (
        <>
          <div className="host-top">
            <h1>Unpaid Education</h1>

            <div className="pin-box">Game PIN: {gamePin}</div>

            <button className="start-btn" onClick={startGame}>
              Start Game
            </button>
          </div>

          <h2 className="waiting-title">Waiting for players...</h2>

          <div className="kahoot-players-grid">
            {(players || []).length === 0 ? (
              <p className="empty-text">No players joined yet</p>
            ) : (
              (players || []).map((player, index) => (
                <div className="kahoot-player-card" key={index}>
                  <span className="kahoot-avatar">
                    {player.avatar || "🐵"}
                  </span>
                  <span>{player.name || player.playerName || player}</span>
                </div>
              ))
            )}
          </div>

          <div className="mini-board">
            <h2>Live Scoreboard</h2>

            {(leaderboard || []).length === 0 ? (
              <p>No scores yet</p>
            ) : (
              (leaderboard || []).map((p, i) => (
                <div className="score-row" key={i}>
                  <span>
                    {i + 1}. {p.avatar || "🐵"} {p.name || p.playerName}
                  </span>
                  <b>{p.score}</b>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Host;