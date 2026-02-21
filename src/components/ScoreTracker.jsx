import React from 'react';
import './ScoreTracker.css';

const ScoreTracker = ({ pinkLeft, greenLeft, currentTurn, gameOver, winner, endTurn}) => {

  const getStatusValue = () => {
    if (gameOver) {
      return <span className={`status-value game-over ${winner}`}>{winner} team wins!</span>;
    } else {
      return ( 
      <> 
        <span className={`status-value ${currentTurn}`}>{currentTurn}'s turn</span> 
        <br></br>
        <span className="end-turn-text">Click to end turn</span>
      </>);
    }
  };


  const handleTurnSwitch = () => {
    if (!gameOver) {
      endTurn(currentTurn);
    }
  };

  return (
    <div className="score-tracker" onClick={handleTurnSwitch}>
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