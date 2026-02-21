import React, { useState, useEffect } from 'react';
import './ClueGiver.css';
import Request_Clue from '../geminiApi.js';

const ClueGiver = ({ gameState }) => {
  const [hint, setHint] = useState(null);

  const currentTurn = gameState?.currentTurn ?? null;
  const isGameOver = gameState?.gameOver ?? false;
  const words = gameState?.words ?? [];

  useEffect(() => {
    if (currentTurn === null) return;

    if (isGameOver) {
      setHint('Game Over!');
      return;
    }

    let isMounted = true;
    setHint('Thinking...');

    const fetchHint = async () => {
      try {
        const hintResult = await Request_Clue(words, currentTurn);
        if (isMounted) {
          const cleanedHint = hintResult.replace(/['{}/]/g, '');
          setHint(cleanedHint);
        }
      } catch (error) {
        console.error('Error fetching hint:', error);
        if (isMounted) {
          setHint('Error loading hint');
        }
      }
    };

    fetchHint();

    return () => {
      isMounted = false;
    };
  }, [currentTurn, isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const [hintWord, hintCount] = hint ? hint.split(',', 3) : [null, null];
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
