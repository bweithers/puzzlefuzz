import React from 'react';
import './App.css';
import Game from './components/Game'

function App() {
  const words = [
    { text: "APPLE", color: "pink" },
    { text: "TREE", color: "green" },
    { text: "HOUSE", color: "pink" },
    { text: "BANANA", color: "green"},
    { text: "MONKEY", color: "pink"},
    { text: "ALLIGATOR", color: "green"}
  ];
  return (
    <div className="App">
      <header className="App-header">
        <h1>Puzzle Fuzz</h1>
      </header>
    <Game/>
    </div>
  );
}

export default App;