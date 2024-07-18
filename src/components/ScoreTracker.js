import React from 'react';
import './ScoreTracker.css';

const ScoreTracker = ({ pinkLeft, greenLeft, currentTurn, gameOver, winner }) => {
  return (
    <div className="score-tracker">
      <div className="score pink">
        <div className="label">Pink</div>
        <div className="value">{pinkLeft}</div>
      </div>

      <div className="GameStatus">
        <div className='label'>{!gameOver ? ( <h2>Current turn:</h2> ) : (<h2>Winner:</h2>)}</div>
        <div className='value'>{!gameOver ? (<p>{currentTurn}</p>) : (<p>{winner}</p>)}</div>
      </div>

      <div className="score green">
        <div className="label">Green</div>
        <div className="value">{greenLeft}</div>
      </div>
    </div>
  );
};

export default ScoreTracker;