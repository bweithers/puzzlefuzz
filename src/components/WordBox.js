import React from 'react';
import './WordBox.css';

const WordBox = ({ word, color, revealed, onClick , gameOver}) => {
  return (
    <div 
      className={`word-box ${revealed ? color : ''}`} 
      onClick={onClick}
      style={{ cursor: gameOver ? 'not-allowed' : 'pointer' }}
    >
      {word}
    </div>
  );
};

export default WordBox;