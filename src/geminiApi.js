// src/geminiApi.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"
    , systemInstruction: "You are a clue giver for a game of word association. You will receive a list of words to use and words to avoid. Give back a one word clue that ties together as many of the first list of words as you can, and give back a number of words that is related to. Explain briefly how each word is related to the clue. Here is an example response: {'Apple',2, 'Apples are red and sweet.'}." });



const Request_Clue = async() =>{ 
    const prompt = "Words to use: ['Woman', 'Car', 'USA']; Words to avoid: ['Cherry', 'Blueberry', 'Strawberry']";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    return result.response.text();
}

export default Request_Clue;