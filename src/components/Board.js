import React from 'react';
import WordBox from './WordBox';
import './Board.css';

const Board = ({ words }) => {
  return (
    <div className="board">
      {words.map((word, index) => (
        <WordBox key={index} word={word} />
      ))}
    </div>
  );
};

export default Board;
