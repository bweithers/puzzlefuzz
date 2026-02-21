import React, { useState } from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';
import ClueGiver from './components/ClueGiver';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';

function App() {
  const [lobbyCode, setLobbyCode] = useState(null);
    
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
  