import React from 'react';
import './WordBox.css';

const WordBox = ({ word, color, revealed, onClick }) => {
  return (
    <div 
      className={`word-box ${revealed ? color : ''}`} 
      onClick={onClick}
    >
      {word}
    </div>
  );
};

export default WordBox;