import React from 'react';
import './App.css';
import Game from './components/Game';
import Welcome from './components/Welcome';

function App() {
  return (
    <div className="App">
      <Welcome onCreateGame= {()=> null} onJoinGame={()=> null}/>
    {/* <Game/> */}
    </div>
  );
}

export default App;