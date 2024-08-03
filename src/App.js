import React, { useState, useEffect }from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import { nanoid } from 'nanoid';
import { firestore } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';


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
    const [currentTurn, setCurrentTurn] = useState('pink');
    const [gameOver, setGameOver] = useState(false);

    function endTurn(turn){
      setCurrentTurn(turn === 'green' ? 'pink' : 'green');
    }

    const GameRoute = () => {
      const { lobbyCode } = useParams();
      return (
        <div className="game-container">
          <Game lobbyCode={lobbyCode} endTurn={endTurn} currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} gameOver={gameOver} setGameOver={setGameOver} />
          <ClueGiver lobbyCode={lobbyCode} currentTurn={currentTurn} gameOver={gameOver}/>
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
  