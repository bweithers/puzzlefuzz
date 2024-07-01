import React, { useState } from 'react';
import './WordBox.css';

const WordBox = ({ word, color }) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    setIsRevealed(true);
  };

  return (
    <div 
      className={`word-box ${isRevealed ? color : ''}`} 
      onClick={handleClick}
    >
      {word}
    </div>
  );
};

export default WordBox;