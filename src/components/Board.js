import React from 'react';
import WordBox from './WordBox';
import './Board.css';

const Board = ({ words }) => {
  return (
    <div className="board">
      {words.map((word, index, color) => (
        <WordBox 
          key={index} 
          word={word} 
          color={word.color} 
        />
      ))}
    </div>
  );
};

export default Board;