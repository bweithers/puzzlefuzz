import React from 'react';
import './ScoreTracker.css';

const ScoreTracker = ({ pinkLeft, greenLeft, currentTurn, gameOver, winner }) => {

  const getStatusValue = () => {
    if (gameOver) {
      return <span className={`status-value game-over ${winner}`}>{winner} team wins!</span>;
    } else {
      return <span className={`status-value ${currentTurn}`}>{currentTurn}'s turn</span>;
    }
  };


  return (
    <div className="score-tracker">
      <div className="score pink">
        <div className="label">Pink</div>
        <div className="value">{pinkLeft}</div>
      </div>

      <div className="GameStatus">
        {getStatusValue()}
      </div>

      <div className="score green">
        <div className="label">Green</div>
        <div className="value">{greenLeft}</div>
      </div>
    </div>
  );
};

export default ScoreTracker;