import React, { useState, useEffect } from 'react';
import Board from './Board';
import ScoreTracker from './ScoreTracker';

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
    { text: "PLAGUE", color: "green", revealed: false }
    // Add more words as needed
  ]);

  
  const [pinkLeft, setPinkLeft] = useState(0);
  const [greenLeft, setGreenLeft] = useState(0);

  useEffect(() => {
    // Count initial unrevealed words
    const pinkCount = words.filter(word => word.color === "pink" && !word.revealed).length;
    const greenCount = words.filter(word => word.color === "green" && !word.revealed).length;
    setPinkLeft(pinkCount);
    setGreenLeft(greenCount);
  }, []);

  const handleWordClick = (index) => {
    if (!words[index].revealed) {
      console.log(`Word clicked: ${words[index].text}`);
      const newWords = [...words];
      newWords[index].revealed = true;
      setWords(newWords);
      
      // Update counts
      if (newWords[index].color === "pink") {
        setPinkLeft(prev => prev - 1);
      } else if (newWords[index].color === "green") {
        setGreenLeft(prev => prev - 1);
      }
    }
  };
  return (
    <div className="game">
      <ScoreTracker pinkLeft={pinkLeft} greenLeft={greenLeft} />
      <Board words={words} onWordClick={handleWordClick} />
    </div>
  );
};

export default Game;