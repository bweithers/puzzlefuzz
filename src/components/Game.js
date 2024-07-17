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
    }

    return coloredWords;
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};

const Game = () => {
  const [words, setWords] = useState([]);
  const [pinkLeft, setPinkLeft] = useState(8);
  const [greenLeft, setGreenLeft] = useState(7);

  const resetGame = async () => {
    const newWords = await fetchWordsAndSetup();
    setWords(newWords);
    setPinkLeft(8);
    setGreenLeft(7);
  };

  useEffect(() => {
    resetGame();
  }, []);

  
  const handleWordClick = (index) => {
    if (!words[index].revealed) {
      console.log(`Word clicked: ${words[index].text}`);
      const newWords = [...words];
      newWords[index].revealed = true;
      setWords(newWords);
      
      // Update counts
      if (newWords[index].color === "pink") {
        setPinkLeft(prev => prev - 1);
      } else if (newWords[index].color === "green") {
        setGreenLeft(prev => prev - 1);
      }
    }
  };

  return (
    <div className="Game">
      <header className="App-header" onClick={resetGame}>
        <h1>Puzzle Fuzz</h1>
      </header>
      <ScoreTracker pinkLeft={pinkLeft} greenLeft={greenLeft} />
      <Board words={words} onWordClick={handleWordClick} />
    </div>
  );
};

export default Game;
