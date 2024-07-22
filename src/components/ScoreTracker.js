import React from 'react';
import './ScoreTracker.css';

const ScoreTracker = ({ pinkLeft, greenLeft, currentTurn, gameOver, winner, setCurrentTurn}) => {

  const getStatusValue = () => {
    if (gameOver) {
      return <span className={`status-value game-over ${winner}`}>{winner} team wins!</span>;
    } else {
      return <span className={`status-value ${currentTurn}`}>{currentTurn}'s turn</span>;
    }
  };


  const handleTurnSwitch = () => {
    if (!gameOver) {
      setCurrentTurn(currentTurn === 'pink' ? 'green' : 'pink');
    }
  };

  return (
    <div className="score-tracker" onClick={handleTurnSwitch}>
      <div className="score pink">
        <div className="label">Pink</div>
        <div className="value">{pinkLeft}</div>
      </div>

      <div className="GameStatus">
        {getStatusValue()} <br></br>Click to end turn.
      </div>

      <div className="score green">
        <div className="label">Green</div>
        <div className="value">{greenLeft}</div>
      </div>
    </div>
  );
};

export default ScoreTracker;