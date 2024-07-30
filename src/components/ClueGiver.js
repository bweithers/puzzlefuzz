import { React, useState, useEffect } from 'react';
import './ClueGiver.css';
import Request_Clue from '../geminiApi.js'

const ClueGiver = ({ lobbyCode }) => {
  const [hint, setHint] = useState(null);

  useEffect(() => {
    const fetchHint = async() => {
      const hintResult = await Request_Clue(lobbyCode);
      const cleanedHint = hintResult.replace(/['{}/]/g, '');
      setHint(cleanedHint);
    }
    fetchHint();
    // console.log(hint);
  }, []);
  // setHint(Request_Clue(lobbyCode));

  const [hintWord, hintCount, clueText] = hint ? hint.split(',', 3) : [null, null, null];
  // console.log(typeof hintWord);
  return (
    <div className="clue-giver">
      <h2>ClueGiver Hint</h2>
      <div className="hint-box">
        {hint ? <p>{hintWord}</p> : <p>No hint available yet.</p>}
        <br />
        {hint ? <p>{hintCount}</p> : <p>-1</p>}
      </div>
    </div>
  );
};

export default ClueGiver;