import React, { useState, useEffect, useMemo } from 'react';
import Board from './Board';
import ScoreTracker from './ScoreTracker';
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { firestore } from '../firebase';

const Game = ({ lobbyCode }) => {
  const [words, setWords] = useState([]);
  const [pinkLeft, setPinkLeft] = useState(8);
  const [greenLeft, setGreenLeft] = useState(7);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('pink');

  const docRef = useMemo(() => doc(firestore, 'game-lobbies', lobbyCode), [lobbyCode]);

  // Single source of truth: all state comes from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();

      if (!data.words || data.words.length === 0) {
        // First player in — generate words and write to Firestore.
        // onSnapshot will fire again with the new data.
        const newWords = await fetchWordsAndSetup();
        await updateDoc(docRef, {
          words: newWords,
          currentTurn: 'pink',
          pinkLeft: 8,
          greenLeft: 7,
          gameOver: false,
          winner: null,
        });
        return;
      }

      setWords(data.words);
      setPinkLeft(data.pinkLeft ?? 8);
      setGreenLeft(data.greenLeft ?? 7);
      setCurrentTurn(data.currentTurn ?? 'pink');
      setGameOver(data.gameOver ?? false);
      setWinner(data.winner ?? null);
    });

    return () => unsubscribe();
  }, [lobbyCode, docRef]);

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
    });
  };

  const fetchWordsAndSetup = async () => {
    try {
      const response = await fetch('/words.txt');
      const text = await response.text();
      const allWords = text.split('\n').filter(word => word.trim() !== '');

      const selectedWords = [];
      while (selectedWords.length < 20) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (!selectedWords.includes(randomWord)) {
          selectedWords.push(randomWord);
        }
      }

      const coloredWords = selectedWords.map((word, index) => {
        let color;
        if (index < 8) color = 'pink';
        else if (index < 15) color = 'green';
        else if (index < 19) color = 'neutral';
        else color = 'bomb';
        return { text: word, color, revealed: false };
      });

      for (let i = coloredWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coloredWords[i], coloredWords[j]] = [coloredWords[j], coloredWords[i]];
      }

      return coloredWords;
    } catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
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
      <header className="App-header" onClick={resetGame}>
        <h1>Puzzle Fuzz</h1>
      </header>
      <div className="info-holder">
        <ScoreTracker pinkLeft={pinkLeft} greenLeft={greenLeft} currentTurn={currentTurn} gameOver={gameOver} winner={winner} endTurn={endTurn} />
      </div>
      <Board words={words} onWordClick={handleWordClick} gameOver={gameOver} />
    </div>
  );
};

export default Game;
