import React from 'react';
import './App.css';
import Board from './components/Board';


console.log('app.js start.');
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
      <Board words={words} />
    </div>
  );
}

export default App;


console.log('Board component file.');