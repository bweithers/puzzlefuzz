import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore, auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

function App() {
  const [lobbyCode, setLobbyCode] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        signInAnonymously(auth);
      }
    });
    return () => unsubscribe();
  }, []);

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
        <Game lobbyCode={lobbyCode} gameState={gameState} docRef={docRef} user={user} />
        <ClueGiver gameState={gameState} user={user} />
      </div>
    );
  };

  if (!user) {
    return <div className="App"><p>Loading...</p></div>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Welcome lobbyCode={lobbyCode} setLobbyCode={setLobbyCode} user={user} setUser={setUser} />} />
          <Route path="/:lobbyCode" element={<GameRoute />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
