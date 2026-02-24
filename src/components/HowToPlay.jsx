import React from 'react';
import './HowToPlay.css';

const HowToPlay = () => {
  return (
    <div className="how-to-play">
      <h3>How to Play</h3>
      <ol>
        <li>
          <span className="step-number">1</span>
          One team clicks words matching their color (pink or green)
        </li>
        <li>
          <span className="step-number">2</span>
          AI gives a one-word clue + number — guess that many words!
        </li>
        <li>
          <span className="step-number">3</span>
          Avoid the bomb! First team to find all their words wins
        </li>
      </ol>
    </div>
  );
};

export default HowToPlay;
