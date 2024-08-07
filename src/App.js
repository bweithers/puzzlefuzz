import React, { useState, useEffect }from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import { nanoid } from 'nanoid';
import { firestore } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { callGeminiAPI } from './geminiApi';



  function App() {
    const [lobbyCode, setLobbyCode] = useState(null);

    console.log(await callGeminiAPI("Tell me a joke about programming"));

    const GameRoute = () => {
      const { lobbyCode } = useParams();
      return (
        <div className="game-container">
          <Game lobbyCode={lobbyCode} />
          <ClueGiver lobbyCode={lobbyCode} />
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
  