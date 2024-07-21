import React from 'react';
import './ClueGiver.css';

const ClueGiver = ({ hint }) => {
  return (
    <div className="clue-giver">
      <h2>ClueGiver Hint</h2>
      <div className="hint-box">
        {hint ? <p>{hint}</p> : <p>No hint available yet.</p>}
      </div>
    </div>
  );
};

export default ClueGiver;