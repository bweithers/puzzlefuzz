// src/geminiApi.js
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';

const SYSTEM_INSTRUCTION = `You are a clue giver for a game of word association. You will receive a list of words to use and words to avoid. Give back a one word clue that ties together as many of the first list of words as you can, and give back a number of words that is related to. Explain briefly how each word is related to the clue. Here is an example response: {'Apple',2, 'Apples are red and sweet.'}. If you receive empty lists, give back Game Over!`;

const callGeminiAPI = async (prompt) => {
  const response = await fetch('/api/gemini-test', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return data.result;
};

const getLobbyDoc = async (lobbyCode) => {
  const dbRef = collection(firestore, 'game-lobbies');
  const documentRef = doc(dbRef, lobbyCode);
  const lobbyDoc = await getDoc(documentRef);
  if (lobbyDoc.exists() && lobbyDoc.data().words?.length === 0) {
    console.log('Pinged lobby successfully but no words found.');
  }
  return lobbyDoc;
};

const Request_Clue = async (lobbyCode) => {
  let lobbyDoc;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    lobbyDoc = await getLobbyDoc(lobbyCode);
    if (lobbyDoc.exists() && lobbyDoc.data().words && lobbyDoc.data().words.length > 0) {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  if (!lobbyDoc.exists() || !lobbyDoc.data().words || lobbyDoc.data().words.length <= 0) {
    throw new Error('Failed to retrieve lobby data after multiple attempts');
  }

  const words = lobbyDoc.data().words;
  const turn = lobbyDoc.data().currentTurn;

  const wordsToPick = words
    .filter(word => word.color === turn && !word.revealed)
    .map(word => word.text);

  const wordsToAvoid = words
    .filter(word => word.color !== turn && !word.revealed)
    .map(word => word.text);

  const wordsToPickString = `{'${wordsToPick.join("', '")}'}`;
  const wordsToAvoidString = `{'${wordsToAvoid.join("', '")}'}`;

  const prompt = `${SYSTEM_INSTRUCTION}\n\nWords to pick: ${wordsToPickString}\nWords to avoid: ${wordsToAvoidString}`;
  console.log('prompt:', prompt);

  const responseText = await callGeminiAPI(prompt);
  return responseText;
};

export { callGeminiAPI };
export default Request_Clue;
