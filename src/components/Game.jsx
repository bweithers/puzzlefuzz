import React, { useEffect } from 'react';
import Board from './Board';
import ScoreTracker from './ScoreTracker';
import GameToolbar from './GameToolbar';
import { updateDoc, runTransaction, doc, increment } from "firebase/firestore";
import { firestore } from '../firebase';
import { fetchWordsAndSetup } from '../utils/words';

const Game = ({ lobbyCode, gameState, docRef, user, setLobbyCode }) => {
  const words = gameState?.words ?? [];
  const pinkLeft = gameState?.pinkLeft ?? 8;
  const greenLeft = gameState?.greenLeft ?? 7;
  const currentTurn = gameState?.currentTurn ?? 'pink';
  const gameOver = gameState?.gameOver ?? false;
  const winner = gameState?.winner ?? null;

  // Initialize game state in Firestore when lobby has no words yet.
  useEffect(() => {
    if (!gameState) return;
    if (gameState.words?.length > 0) return;

    const initialize = async () => {
      try {
        const newWords = await fetchWordsAndSetup();
        await runTransaction(firestore, async (t) => {
          const snap = await t.get(docRef);
          if (snap.data()?.words?.length > 0) return;
          t.update(docRef, {
            words: newWords,
            currentTurn: 'pink',
            pinkLeft: 8,
            greenLeft: 7,
            gameOver: false,
            winner: null,
          });
        });
      } catch (error) {
        console.error('Error initializing game:', error);
      }
    };
    initialize();
  }, [gameState, docRef]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track agent stats when game ends
  useEffect(() => {
    if (!gameOver || !winner || !gameState?.agentSelections) return;

    const updateAgentStats = async () => {
      const selections = gameState.agentSelections;
      const updatedAgents = new Set();

      for (const [, agentId] of Object.entries(selections)) {
        if (updatedAgents.has(agentId)) continue;
        updatedAgents.add(agentId);

        try {
          const agentRef = doc(firestore, 'agents', agentId);
          await updateDoc(agentRef, {
            'stats.gamesPlayed': increment(1),
          });
        } catch (error) {
          console.error('Error updating agent stats:', error);
        }
      }

      // Mark wins — for simplicity, all agents selected by any player get a win
      // if the game had a winner. A more granular approach would track per-team.
      for (const [, agentId] of Object.entries(selections)) {
        try {
          const agentRef = doc(firestore, 'agents', agentId);
          await updateDoc(agentRef, {
            'stats.wins': increment(1),
          });
        } catch {
          // best-effort
        }
      }
    };

    updateAgentStats();
  }, [gameOver, winner]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateLobby = async (updates) => {
    try {
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating lobby:', error);
    }
  };

  const endTurn = () => {
    updateLobby({ currentTurn: currentTurn === 'pink' ? 'green' : 'pink' });
  };

  const resetGame = async () => {
    const newWords = await fetchWordsAndSetup();
    updateLobby({
      words: newWords,
      currentTurn: 'pink',
      pinkLeft: 8,
      greenLeft: 7,
      gameOver: false,
      winner: null,
      clueHistory: [],
    });
  };

  const handleWordClick = (index) => {
    if (gameOver || words[index].revealed) return;

    const clickedColor = words[index].color;
    const newWords = words.map((w, i) => i === index ? { ...w, revealed: true } : w);
    const revealAll = newWords.map(w => ({ ...w, revealed: true }));

    const updates = { words: newWords };

    if (clickedColor === 'bomb') {
      updates.gameOver = true;
      updates.winner = currentTurn === 'pink' ? 'green' : 'pink';
      updates.words = revealAll;
    } else if (clickedColor === 'pink') {
      const newPinkLeft = pinkLeft - 1;
      updates.pinkLeft = newPinkLeft;
      if (newPinkLeft === 0) {
        updates.gameOver = true;
        updates.winner = 'pink';
        updates.words = revealAll;
      } else if (clickedColor !== currentTurn) {
        updates.currentTurn = currentTurn === 'pink' ? 'green' : 'pink';
      }
    } else if (clickedColor === 'green') {
      const newGreenLeft = greenLeft - 1;
      updates.greenLeft = newGreenLeft;
      if (newGreenLeft === 0) {
        updates.gameOver = true;
        updates.winner = 'green';
        updates.words = revealAll;
      } else if (clickedColor !== currentTurn) {
        updates.currentTurn = currentTurn === 'pink' ? 'green' : 'pink';
      }
    } else {
      // neutral — end turn
      updates.currentTurn = currentTurn === 'pink' ? 'green' : 'pink';
    }

    updateLobby(updates);
  };

  return (
    <div className="Game">
      <header className="App-header">
        <h1>Puzzle Fuzz</h1>
      </header>
      <GameToolbar lobbyCode={lobbyCode} displayName={user?.displayName} onGoHome={() => setLobbyCode(null)} />
      <div className="info-holder">
        <ScoreTracker pinkLeft={pinkLeft} greenLeft={greenLeft} currentTurn={currentTurn} gameOver={gameOver} winner={winner} endTurn={endTurn} />
      </div>
      <Board words={words} onWordClick={handleWordClick} gameOver={gameOver} />
      {gameOver && (
        <button className="reset-button" onClick={resetGame}>New Game</button>
      )}
    </div>
  );
};

export default Game;
