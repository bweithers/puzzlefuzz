import React, { useState, useEffect } from 'react';
import './ClueGiver.css';
import Request_Clue from '../geminiApi.js';
import {doc, onSnapshot} from 'firebase/firestore';
import { firestore } from '../firebase';

const ClueGiver = ({ lobbyCode }) => {
  const [hint, setHint] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const lobbyRef = doc(firestore, 'game-lobbies', lobbyCode);
    const unsubscribe = onSnapshot(lobbyRef, (doc) => {
      if (doc.exists()) {
        setGameState(doc.data());
      }
    });

    return () => unsubscribe();
  }, [lobbyCode]);

  const currentTurn = gameState?.currentTurn ?? null;
  const isGameOver = gameState?.gameOver ?? false;

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
        const hintResult = await Request_Clue(lobbyCode);
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
  }, [currentTurn, isGameOver, lobbyCode]);

  const [hintWord, hintCount] = hint ? hint.split(',', 3) : [null, null];
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