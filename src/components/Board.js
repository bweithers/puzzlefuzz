import React from 'react';
import WordBox from './WordBox';
import './Board.css';

const Board = ({ words, onWordClick }) => {
  return (
    <div className="board">
      {words.map((word, index) => (
        <WordBox 
          key={index} 
          word={word.text} 
          color={word.color}
          revealed={word.revealed}
          onClick={() => onWordClick(index)}
        />
      ))}
    </div>
  );
};

export default Board;