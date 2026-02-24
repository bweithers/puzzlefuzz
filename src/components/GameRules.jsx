import React, { useState } from 'react';
import './GameRules.css';

const GameRules = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="game-rules">
      <button className="rules-toggle" onClick={() => setExpanded(!expanded)}>
        Rules {expanded ? '▼' : '▶'}
      </button>
      {expanded && (
        <ul className="rules-list">
          <li className="rule-correct">Correct color → keep guessing</li>
          <li className="rule-wrong">Wrong color → end turn</li>
          <li className="rule-neutral">Neutral → end turn</li>
          <li className="rule-bomb">Bomb → instant loss</li>
        </ul>
      )}
    </div>
  );
};

export default GameRules;
