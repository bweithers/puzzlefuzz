/**
 * The `Game` component is the main entry point for the game application. It is responsible for fetching the list of words, assigning colors to them, and managing the game state.
 * 
 * The component uses the `useState` and `useEffect` hooks to manage the state of the game, including the list of words, the number of pink and green words remaining, and the revealed state of each word.
 * 
 * The `fetchWordsAndSetup` function is called on component mount to fetch the list of words from a server and randomly select 20 words, assigning them colors and shuffling them. The selected words are then stored in the component's state.
 * 
 * The `handleWordClick` function is called when a user clicks on a word in the game board. It updates the revealed state of the clicked word and decrements the count of the corresponding color (pink or green) in the game state.
 * 
 * The `Game` component renders the `Board` and `ScoreTracker` components, passing the necessary props to them.
 */
import React, { useState, useEffect } from 'react';
import Board from './Board';
import ScoreTracker from './ScoreTracker';
import { useParams } from 'react-router-dom';
import { doc, updateDoc, collection, getDoc, onSnapshot, query, where} from "firebase/firestore";
import { firestore } from '../firebase';

const Game = ( { lobbyCode } ) => {
  const [words, setWords] = useState([]);
  const [pinkLeft, setPinkLeft] = useState(8);
  const [greenLeft, setGreenLeft] = useState(7);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('pink');

  const lobbiesRef = collection(firestore, 'game-lobbies');
  const docRef = doc(firestore, 'game-lobbies', lobbyCode);

  function endTurn() {
    if (currentTurn === 'pink') {
      setCurrentTurn('green');
    } else {
      setCurrentTurn('pink');
    }
  };

  const resetGame = async () => {
    const newWords = await fetchWordsAndSetup();
    setWords(newWords);
    setPinkLeft(8);
    setGreenLeft(7);
    setGameOver(true);
    setGameOver(false);
    setWinner(null);
    endTurn('green');
    updateLobby(newWords, 8, 7);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const docSnap = await getDoc(docRef);   
      if (docSnap.exists() && docSnap.data().words && docSnap.data().words.length > 0) {
        // If words exist in the database, use them
        setWords(docSnap.data().words);
        setPinkLeft(docSnap.data().pinkLeft);
        setGreenLeft(docSnap.data().greenLeft);
        console.log('Words fetched from database');
      } else {
        // If no words in the database, create new ones
        console.log(docSnap?.data());
        const newWords = await fetchWordsAndSetup();
        setWords(newWords);
        setPinkLeft(8);
        setGreenLeft(7);
        updateLobby(newWords, 8, 7);
        console.log('First time setup, words pulled here');
      }
    };
  
    fetchInitialData();
  }, []);


  useEffect(() => {
    if (pinkLeft === 0 || greenLeft === 0) {
      setGameOver(true);
      setWinner(pinkLeft === 0 ? 'pink' : 'green');
    }
  }, [pinkLeft, greenLeft]);

  useEffect (()=>{
    if (!gameOver) return;
    revealAllWords();
  }, [gameOver]);



  const fetchWordsAndSetup = async () => {
    try {
      const response = await fetch('/words.txt');
      const text = await response.text();
      const allWords = text.split('\n').filter(word => word.trim() !== '');
      
      // Randomly select 20 words
      const selectedWords = [];
      while (selectedWords.length < 20) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        if (!selectedWords.includes(randomWord)) {
          selectedWords.push(randomWord);
        }
      }

      // Assign colors
      const coloredWords = selectedWords.map((word, index) => {
        let color;
        if (index < 8) color = 'pink';
        else if (index < 15) color = 'green';
        else if (index < 19) color = 'neutral';
        else color = 'bomb';

        return { text: word, color, revealed: false };
      });

      // Shuffle the colored words
      for (let i = coloredWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coloredWords[i], coloredWords[j]] = [coloredWords[j], coloredWords[i]];
      };
      
      return coloredWords;
    } catch (error) {
      console.error('Error fetching words:', error);
      return [];
    }
  };
  const revealAllWords = () => {
    setWords(prevWords => prevWords.map(word => ({ ...word, revealed: true })));
  };

  useEffect(() =>{
    if (words.length > 0) {
      updateLobby(words, pinkLeft);
    }
  } 
  , [words]);
  const updateLobby = async () => {
    const docRef = doc(firestore, 'game-lobbies', lobbyCode);
    try {
      await updateDoc(docRef, { 
        words: words,
        currentTurn: currentTurn,
        greenLeft: greenLeft,
        pinkLeft: pinkLeft
      });
      console.log('Words updated successfully!');
    } catch (error) {
      console.error('Error updating words:', error);
      console.error('Words: ', words, ', Pink Left: ',pinkLeft, ', Green Left: ', greenLeft, ', Current Turn: ', currentTurn);
    }
  };
  
  const handleWordClick = (index) => {
    if (gameOver) {
      return;
    }
    if (!words[index].revealed) {
      console.log(`Word clicked: ${words[index].text}`);
      const clickedColor = words[index].color;
      const newWords = [...words];
      newWords[index].revealed = true;
      setWords(newWords);
    
      // Update counts
      if (clickedColor === "pink") {
        setPinkLeft(prev => prev - 1);
      } else if (clickedColor === "green") {
        setGreenLeft(prev => prev - 1);
      } else if (clickedColor === "bomb"){
        setGameOver(true);
        setWinner(currentTurn === "pink" ? "green" : "pink");
      }

      if (!gameOver && clickedColor !== currentTurn){
        endTurn(currentTurn);
      }

  }
    
  };

  return (
    <div className="Game">
      <header className="App-header" onClick={resetGame}>
        <h1>Puzzle Fuzz</h1>
      </header>
      <div className = "info-holder">
        <ScoreTracker pinkLeft={pinkLeft} greenLeft={greenLeft} currentTurn={currentTurn} gameOver={gameOver} winner={winner} endTurn= {endTurn} />
      </div>
      <Board words={words} onWordClick={handleWordClick} gameOver={gameOver}/>
    </div>
  );
};

export default Game;
