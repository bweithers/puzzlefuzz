import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebase';

function App() {
  const [lobbyCode, setLobbyCode] = useState(null);

  const GameRoute = () => {
    const { lobbyCode } = useParams();
    const [gameState, setGameState] = useState(null);

    const docRef = useMemo(() => doc(firestore, 'game-lobbies', lobbyCode), [lobbyCode]);

    useEffect(() => {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) setGameState(snap.data());
      });
      return () => unsubscribe();
    }, [docRef]);

    return (
      <div className="game-container">
        <Game lobbyCode={lobbyCode} gameState={gameState} docRef={docRef} />
        <ClueGiver gameState={gameState} />
      </div>
    );
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome lobbyCode={lobbyCode} setLobbyCode={setLobbyCode}/>} />
          <Route path="/:lobbyCode" element={<GameRoute />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
