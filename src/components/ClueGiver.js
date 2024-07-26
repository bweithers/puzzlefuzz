import React from 'react';
import './ClueGiver.css';
import Request_Clue from '../geminiApi.js'

const ClueGiver = ({ lobbyCode }) => {
  Request_Clue(lobbyCode);
  let hint = null;
  return (
    <div className="clue-giver">
      <h2>ClueGiver Hint</h2>
      <div className="hint-box">
        {hint ? <p>{"test"}</p> : <p>No hint available yet.</p>}
      </div>
    </div>
  );
};

export default ClueGiver;