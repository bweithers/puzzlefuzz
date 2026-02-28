import React from 'react';
import WordBox from './WordBox';
import './Board.css';

const Board = ({ words, onWordClick, gameOver, clueReady }) => {
  return (
    <div className={`board ${gameOver ? 'game-over' : ''}`}>
      {words.map((word, index) => (
        <WordBox
          key={index}
          word={word.text}
          color={word.color}
          revealed={word.revealed}
          autoRevealed={word.autoRevealed}
          onClick={() => onWordClick(index)}
          gameOver={gameOver}
          index={index}
          clueReady={clueReady}
        />
      ))}
    </div>
  );
};

export default Board;