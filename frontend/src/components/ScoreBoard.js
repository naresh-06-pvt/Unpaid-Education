import React, { useEffect, useState } from "react";
import socket from "../socket";

export default function ScoreBoard() {
  const [players, setPlayers] = useState({});

  useEffect(() => {
    socket.on("playersUpdate", (p) => setPlayers(p));
  }, []);

  return (
    <div>
      <h2>ScoreBoard</h2>
      <ul>
        {Object.values(players).map((p) => (
          <li key={p.name}>{p.name}: {p.score}</li>
        ))}
      </ul>
    </div>
  );
}
