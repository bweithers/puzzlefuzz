import React, { useState, useEffect } from 'react';
import './Welcome.css';
import { firestore, auth } from '../firebase';
import { collection, getDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import HowToPlay from './HowToPlay';
import PlayerStats from './PlayerStats';

const Welcome = ({ lobbyCode, setLobbyCode, user, setUser }) => {
  const [joinCode, setJoinCode] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const onJoinGame = async (code) => {
    const dbRef = collection(firestore, 'game-lobbies');
    const documentRef = doc(dbRef, code);
    const gamedoc = await getDoc(documentRef);
    if (!gamedoc.exists()) {
      alert('Game not found!');
      return;
    }
    setLobbyCode(code);
  };

  const handleJoinGame = () => {
    if (joinCode.trim()) {
      onJoinGame(joinCode);
    }
  };

  const handleCreateGame = () => {
    createLobby().then(code => {
      setLobbyCode(code);
    }).catch(error => {
      console.error('Error creating lobby:', error);
    });
  };

  useEffect(() => {
    if (lobbyCode) {
      navigate(`/${lobbyCode}`);
    }
  }, [lobbyCode, navigate]);

  const createLobby = async () => {
    const lobbyCode = Math.random().toString(36).slice(2, 8).toUpperCase();
    const dbRef = collection(firestore, 'game-lobbies');
    try {
      const documentRef = doc(dbRef, lobbyCode);
      await setDoc(documentRef, {
        LobbyCode: lobbyCode,
        CreatedAt: new Date(),
        words: []
      });
      return lobbyCode;
    } catch (error) {
      console.error('Error creating lobby:', error);
      return null;
    }
  };

  const handleNameSubmit = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await Promise.all([
        updateProfile(auth.currentUser, { displayName: trimmed }),
        setDoc(doc(firestore, 'users', user.uid), {
          uid: user.uid,
          displayName: trimmed,
          createdAt: serverTimestamp(),
          isAnonymous: true,
        }),
      ]);
      setUser(prev => ({ ...prev, displayName: trimmed }));
    } catch (error) {
      console.error('Error saving name:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!user.displayName) {
    return (
      <div className="welcome-page">
        <header className="App-header">
          <h1>Puzzle Fuzz</h1>
        </header>
        <div className="welcome-screen">
          <h1>Welcome to Puzzle Fuzz</h1>
          <p>What should we call you?</p>
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
            placeholder="Enter your name"
            maxLength={20}
            disabled={submitting}
          />
          <button onClick={handleNameSubmit} disabled={submitting || !nameInput.trim()}>
            {submitting ? 'Setting up...' : "Let's Play"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <header className="App-header">
        <h1>Puzzle Fuzz</h1>
      </header>
      <div className="welcome-screen">
        <h1>Welcome to Puzzle Fuzz</h1>
        <p>Playing as: {user.displayName}</p>
        <button onClick={handleCreateGame}>Create New Game</button>
        <div>
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter game code"
          />
          <button onClick={handleJoinGame}>Join Game</button>
        </div>
      </div>
      <div className="welcome-extras">
        <HowToPlay />
        <PlayerStats user={user} setUser={setUser} />
      </div>
    </div>
  );
};

export default Welcome;
