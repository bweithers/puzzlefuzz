import React, { useState , useEffect} from 'react';
import './Welcome.css';
import { firestore } from '../firebase';
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

const Welcome = ({ lobbyCode, setLobbyCode }) => {
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
      createLobby().then(code => {
        setLobbyCode(code);
        console.log('Lobby Code:', code);
      }).catch(error => {
        console.error('Error creating lobby:', error);
      });
      navigate(`/${lobbyCode}`);
  };

  const history = useNavigate();

  const createLobby = async () => {
    // Create a new lobby
      console.log('Creating lobby...');
      const lobbyCode = nanoid(6); // Generate a 6-character lobby code
      const dbRef = collection(firestore, 'game-lobbies');
      try {
        const documentRef = doc(dbRef, lobbyCode);
        await setDoc(documentRef, {
          LobbyCode: lobbyCode,
          CreatedAt: new Date(),
          words: []
        });
    
        console.log('Lobby created:', documentRef);
        return lobbyCode;
      } catch (error) {
        console.error('Error creating lobby:', error);
        return null;
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
