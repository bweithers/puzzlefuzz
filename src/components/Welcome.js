import React, { useState , useEffect} from 'react';
import './Welcome.css';
import { firestore } from '../firebase';
import { collection, addDoc } from 'firebase/firestore/lite';
import { nanoid } from 'nanoid';
import { testFirebaseConnection } from '../firebase.js';

const createLobby = async () => {
// Create a new lobby
    console.log('Creating lobby...');
  const lobbyCode = nanoid(6); // Generate a 6-character lobby code
  const lobbyRef = collection(firestore, 'game-lobbies');
  
  try {
    await addDoc(lobbyRef, {
      LobbyCode: lobbyCode,
      CreatedAt: new Date(),
      words: [],
      assignments: []
    });
    
    console.log('Lobby created with code:', lobbyCode);
    return lobbyCode;
  } catch (error) {
    console.error('Error creating lobby:', error);
    return null;
  }
};

const Welcome = ({ onJoinGame }) => {
  const [joinCode, setJoinCode] = useState('');


  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const handleCreateGame = () => {
    const gameId = nanoid();
    createLobby();
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
