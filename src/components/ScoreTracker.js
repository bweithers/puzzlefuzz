import React from 'react';
import './ScoreTracker.css';

const ScoreTracker = ({ pinkLeft, greenLeft }) => {
  return (
    <div className="score-tracker">
      <div className="score pink">
        <div className="label">Pink</div>
        <div className="count">{pinkLeft}</div>
      </div>
      <div className="score green">
        <div className="label">Green</div>
        <div className="count">{greenLeft}</div>
      </div>
    </div>
  );
};

export default ScoreTracker;