import React, { useEffect, useState } from "react";
import socket from "../socket";

function Host() {
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    socket.on("gameCreated", (id) => {
      setGameId(id);
    });

    socket.on("playerJoined", (playersList) => {
      setPlayers(playersList || []);
    });

    socket.on("playersUpdated", (playersList) => {
      setPlayers(playersList || []);
    });

    socket.on("updateScores", (scoresData) => {
      setScores(scoresData || {});
    });

    socket.on("leaderboardUpdated", (scoresData) => {
      setScores(scoresData || {});
    });

    return () => {
      socket.off("gameCreated");
      socket.off("playerJoined");
      socket.off("playersUpdated");
      socket.off("updateScores");
      socket.off("leaderboardUpdated");
    };
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };

  const startGame = () => {
    if (!gameId) {
      alert("Create game first");
      return;
    }

    socket.emit("startGame", gameId);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>Host</h1>

      {!gameId && (
        <button onClick={createGame}>
          Create Game
        </button>
      )}

      {gameId && (
        <>
          <h2>Game PIN: {gameId}</h2>

          <button onClick={startGame}>
            Start Game
          </button>

          <hr />

          <h3>Players Joined</h3>

          {(players || []).length === 0 ? (
            <p>No players joined yet</p>
          ) : (
            (players || []).map((player, index) => (
              <p key={index}>
                {index + 1}. {player.name || player.playerName || player}
              </p>
            ))
          )}

          <hr />

          <h3>Leaderboard</h3>

          {Object.keys(scores || {}).length === 0 ? (
            <p>No scores yet</p>
          ) : (
            Object.entries(scores || {}).map(([player, score], index) => (
              <p key={index}>
                {index + 1}. {player} - {score}
              </p>
            ))
          )}
        </>
      )}
    </div>
  );
}

export default Host;