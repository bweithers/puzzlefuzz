import React from 'react';
import WordBox from './WordBox';
import './Board.css';

const Board = ({ words, onWordClick, gameOver}) => {
  return (
    <div className={`board ${gameOver ? 'game-over' : ''}`}>
      {words.map((word, index) => (
        <WordBox
          key={index}
          word={word.text}
          color={word.color}
          revealed={word.revealed}
          onClick={() => onWordClick(index)}
          gameOver = {gameOver}
          index={index}
        />
      ))}
    </div>
  );
};

export default Board;