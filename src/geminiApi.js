// src/geminiApi.js
import { collection, doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';

const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"
    , systemInstruction: "You are a clue giver for a game of word association. You will receive a list of words to use and words to avoid. Give back a one word clue that ties together as many of the first list of words as you can, and give back a number of words that is related to. Explain briefly how each word is related to the clue. Here is an example response: {'Apple',2, 'Apples are red and sweet.'}. If you receive empty lists, give back Game Over!" });

const getLobbyDoc = async (lobbyCode) => {
  const dbRef = collection(firestore, 'game-lobbies');
  const documentRef = doc(dbRef, lobbyCode);
  const lobbyDoc = await getDoc(documentRef);
  if (lobbyDoc.data().words && lobbyDoc.data().words.length === 0) {
    console.log('Pinged lobby successfully but no words found.');
  }
  return lobbyDoc;
}

const Request_Clue = async (lobbyCode) => {
  let lobbyDoc;
  let attempts = 0;
  const maxAttempts = 10; // Adjust as needed

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

  // Process the data and generate the prompt
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

  // Generate prompt based on words...
  const prompt = "Words to pick: " + wordsToPickString + " Words to avoid: " + wordsToAvoidString;
  console.log('prompt: ', prompt); 
  const result = await model.generateContent(prompt);
  const responseText = result.response?.text() || '';
  return responseText;  
};


export default Request_Clue;