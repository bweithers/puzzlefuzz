import React from 'react';
import './WordBox.css';

const WordBox = ({ word, color, revealed, onClick, gameOver, index }) => {
  return (
    <div
      className={`word-box ${revealed ? color : ''}`}
      onClick={onClick}
      style={{
        cursor: gameOver ? 'not-allowed' : 'pointer',
        animationDelay: `${index * 0.03}s`,
      }}
    >
      {word}
    </div>
  );
};

export default WordBox;
