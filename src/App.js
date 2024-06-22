import React from 'react';
import './App.css';
import Board from './components/Board';

function App() {
  const words = [
    'Word1', 'Word2', 'Word3', 'Word4', 'Word5',
    'Word6', 'Word7', 'Word8', 'Word9', 'Word10',
    'Word11', 'Word12', 'Word13', 'Word14', 'Word15',
    'Word16', 'Word17', 'Word18', 'Word19', 'Word20',
    'Word21', 'Word22', 'Word23', 'Word24', 'Word25'
  ];

  return (
    <div className="App">
      <header className="App-header">
        <h1>Codenames Game</h1>
      </header>
      <Board words={words} />
    </div>
  );
}

export default App;
