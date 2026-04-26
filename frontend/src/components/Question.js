import React, { useEffect, useState } from "react";
import socket from "../socket";

export default function Question() {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    socket.on("newQuestion", (q) => setQuestion(q));
  }, []);

  if (!question) return null;

  return (
    <div>
      <h2>{question.question}</h2>
      {question.answers.map((a) => (
        <button key={a} onClick={() => socket.emit("answer", { answer: a, correct: question.correct })}>
          {a}
        </button>
      ))}
    </div>
  );
}
