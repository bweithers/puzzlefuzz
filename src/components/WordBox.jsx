import React from 'react';
import './WordBox.css';

const WordBox = ({ word, color, revealed, onClick, gameOver, index, clueReady }) => {
  const isThinking = !clueReady && !gameOver && !revealed;
  return (
    <div
      className={`word-box ${revealed ? color : ''} ${isThinking ? 'thinking' : ''}`}
      onClick={onClick}
      style={{
        cursor: gameOver || isThinking ? 'not-allowed' : 'pointer',
        animationDelay: `${index * 0.03}s`,
      }}
    >
      {word}
    </div>
  );
};

export default WordBox;
