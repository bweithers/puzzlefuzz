import React, { useState, useEffect }from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import { nanoid } from 'nanoid';
import { firestore } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore/lite';


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

  function App() {
    const [lobbyCode, setLobbyCode] = useState(null);
  
    useEffect(() => {
      createLobby().then(code => {
        setLobbyCode(code);
        console.log('Lobby Code:', code);
      }).catch(error => {
        console.error('Error creating lobby:', error);
      });
    }, []);
  
    return (
      <div className="App">
        <div className="game-container">
          {lobbyCode ? (
            <Game lobbyCode={lobbyCode} />
          ) : (
            <div>Creating lobby...</div>
          )}
          <ClueGiver hint="test"/>
        </div>
      </div>
    );
  }
  
  export default App;
  