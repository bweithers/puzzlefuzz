import { React, useState, useEffect } from 'react';
import './ClueGiver.css';
import Request_Clue from '../geminiApi.js';
import {doc, onSnapshot} from 'firebase/firestore';
import { firestore } from '../firebase';

const ClueGiver = ({ lobbyCode }) => {
  const [hint, setHint] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);

  useEffect(() => {
    const lobbyRef = doc(firestore, 'game-lobbies', lobbyCode);
    const unsubscribe = onSnapshot(lobbyRef, (doc) => {
      if (doc.exists()) {
        const newGameState = doc.data();
        setGameState(newGameState);
      }
    });

    return () => unsubscribe();
  }, [lobbyCode]);
  
  useEffect(()=>{
    if (gameState && gameState.currentTurn !== currentTurn) {
      setCurrentTurn(gameState.currentTurn);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState && !gameState.gameOver) {
      setHint('Thinking...');
      fetchHint();
    } else if (gameState && gameState.gameOver) {
      setHint('Game Over!');
    }
  }, [currentTurn]);

  const fetchHint = async () => {
    const hintResult = await Request_Clue(lobbyCode);
    const cleanedHint = hintResult.replace(/['{}/]/g, '');
    setHint(cleanedHint);
  };

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