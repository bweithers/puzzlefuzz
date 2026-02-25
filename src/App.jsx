import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import GameRules from './components/GameRules';
import PlayerPresence from './components/PlayerPresence';
import AgentSelector from './components/AgentSelector';
import ClueJournal from './components/ClueJournal';
import ClueReview from './components/ClueReview';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
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
    const [agentId, setAgentId] = useState(null);

    const docRef = useMemo(() => doc(firestore, 'game-lobbies', lobbyCode), [lobbyCode]);

    useEffect(() => {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) setGameState(snap.data());
      });
      return () => unsubscribe();
    }, [docRef]);

    // Write player presence to Firestore
    useEffect(() => {
      if (!user?.uid || !user?.displayName) return;
      updateDoc(docRef, {
        [`players.${user.uid}`]: {
          displayName: user.displayName,
          joinedAt: serverTimestamp(),
        },
      }).catch((err) => console.error('Error writing player presence:', err));
    }, [docRef, user?.uid, user?.displayName]);

    // Load agent selection from lobby or user preferences
    useEffect(() => {
      if (!user?.uid) return;

      // Check lobby's agentSelections first
      const lobbyAgentId = gameState?.agentSelections?.[user.uid];
      if (lobbyAgentId) {
        setAgentId(lobbyAgentId);
        return;
      }

      // Fall back to user's default preference
      const loadDefault = async () => {
        const snap = await getDoc(doc(firestore, 'user-agent-preferences', user.uid));
        if (snap.exists() && snap.data().selectedAgentId) {
          const defaultId = snap.data().selectedAgentId;
          setAgentId(defaultId);
          // Write to lobby so it's tracked
          updateDoc(docRef, {
            [`agentSelections.${user.uid}`]: defaultId,
          }).catch(() => {});
        } else {
          setAgentId('default');
        }
      };
      loadDefault();
    }, [user?.uid, docRef, gameState?.agentSelections]);

    return (
      <div className={`game-container ${gameState?.gameOver ? 'game-over' : ''}`}>
        <Game lobbyCode={lobbyCode} gameState={gameState} docRef={docRef} user={user} setLobbyCode={setLobbyCode} />
        <div className="game-sidebar">
          <AgentSelector
            lobbyCode={lobbyCode}
            user={user}
            currentAgentId={agentId}
            onAgentChange={setAgentId}
          />
          {gameState?.gameOver ? (
            <ClueReview
              clueHistory={gameState?.clueHistory}
              user={user}
              lobbyCode={lobbyCode}
            />
          ) : (
            <ClueGiver gameState={gameState} user={user} agentId={agentId} lobbyCode={lobbyCode} />
          )}
          <GameRules />
          <PlayerPresence players={gameState?.players} />
        </div>
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
          <Route path="/journal" element={<ClueJournal user={user} />} />
          <Route path="/:lobbyCode" element={<GameRoute />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
