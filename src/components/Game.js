import React, { useState } from 'react';
import Board from './Board';

const Game = () => {
  const [words, setWords] = useState([
    { text: "APPLE", color: "pink", revealed: false },
    { text: "TREE", color: "green", revealed: false },
    { text: "BANANA", color: "pink", revealed: false },
    { text: "BUSH", color: "green", revealed: false },
    { text: "ROSE", color: "pink", revealed: false },
    { text: "GOLD", color: "green", revealed: false },
    { text: "ENGLAND", color: "pink", revealed: false },
    { text: "FOOTBALL", color: "green", revealed: false },
    { text: "DOCTOR", color: "pink", revealed: false },
    { text: "PLAGUE", color: "green", revealed: false },

    
    // Add more words as needed
  ]);

  const handleWordClick = (index) => {
    if (!words[index].revealed) {
      console.log(`Word clicked: ${words[index].text}`);
      const newWords = [...words];
      newWords[index].revealed = true;
      setWords(newWords);
      // Add more game logic here
    }
  };
  return (
    <div className="game">
      <Board words={words} onWordClick={handleWordClick} />
    </div>
  );
};

export default Game;