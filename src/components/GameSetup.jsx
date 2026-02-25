import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import './GameSetup.css';

const GameSetup = ({ user }) => {
  const { lobbyCode } = useParams();
  const navigate = useNavigate();
  const [gameMode, setGameMode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'game-lobbies', lobbyCode), (snap) => {
      if (snap.exists()) {
        const mode = snap.data().gameMode;
        if (mode === 'friends') {
          navigate(`/${lobbyCode}`, { replace: true });
        } else if (mode === 'ai') {
          navigate(`/${lobbyCode}/pick-agent`, { replace: true });
        }
        setGameMode(mode || null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [lobbyCode, navigate]);

  const selectMode = async (mode) => {
    await updateDoc(doc(firestore, 'game-lobbies', lobbyCode), { gameMode: mode });
    if (mode === 'friends') {
      navigate(`/${lobbyCode}`);
    } else {
      navigate(`/${lobbyCode}/pick-agent`);
    }
  };

  if (loading) {
    return (
      <div className="game-setup-page">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="game-setup-page">
      <header className="App-header">
        <h1>Puzzle Fuzz</h1>
      </header>
      <h2 className="setup-title">How do you want to play?</h2>
      <div className="setup-cards">
        <div className="setup-card" onClick={() => selectMode('friends')}>
          <div className="setup-card-icon">👥</div>
          <h3>Play with Friends</h3>
          <p>Share the lobby code and take turns giving clues</p>
        </div>
        <div className="setup-card" onClick={() => selectMode('ai')}>
          <div className="setup-card-icon">🤖</div>
          <h3>Play with AI Cluegiver</h3>
          <p>Pick your AI agent to generate clues</p>
        </div>
      </div>
      <p className="setup-lobby-code">Lobby: <strong>{lobbyCode}</strong></p>
    </div>
  );
};

export default GameSetup;
