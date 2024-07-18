import React, { useState } from 'react';
import { nanoid } from 'nanoid';

import './Welcome.css';

const Welcome = ({ onCreateGame, onJoinGame }) => {
  const [joinCode, setJoinCode] = useState('');

  const handleCreateGame = () => {
    const gameId = nanoid();
    onCreateGame(gameId);
  };

  const handleJoinGame = () => {
    if (joinCode.trim()) {
      onJoinGame(joinCode);
    }
  };

  return (
    <div className="welcome-screen">
      <h1>Welcome to Puzzle Fuzz</h1>
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
  );
};

export default Welcome;
