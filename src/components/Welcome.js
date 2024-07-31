import React, { useState , useEffect} from 'react';
import './Welcome.css';
import { firestore } from '../firebase';
import { collection, getDoc, doc } from 'firebase/firestore/lite';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [joinCode, setJoinCode] = useState('');
  
  const navigate = useNavigate();
  const onJoinGame = async (code) => {
    const dbRef = collection(firestore, 'game-lobbies');
    const documentRef = doc(dbRef, code);
    let gamedoc = await getDoc(documentRef);
    navigate(`/${code}`);
  };

  const handleJoinGame = () => {
    if (joinCode.trim()) {
      onJoinGame(joinCode);
    }
  };
  const handleCreateGame = () => {
    createLobby();
  };

  const history = useNavigate();

  const createLobby = async () => {
    const lobbyCode = nanoid(6);
    navigate(`/${lobbyCode}`);
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
