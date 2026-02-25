// src/geminiApi.js

const DEFAULT_SYSTEM_INSTRUCTION = `You are a clue giver for a game of word association. You will receive a list of words to use and words to avoid. Give back a one word clue that ties together as many of the first list of words as you can, and give back a number of words that is related to. Explain briefly how each word is related to the clue. Here is an example response: {'Apple',2, 'Apples are red and sweet.'}. If you receive empty lists, give back Game Over!`;

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

const Request_Clue = async (words, turn, systemPrompt, fewShotExamples) => {
  const instruction = systemPrompt || DEFAULT_SYSTEM_INSTRUCTION;

  const wordsToPick = words
    .filter(word => word.color === turn && !word.revealed)
    .map(word => word.text);

  const wordsToAvoid = words
    .filter(word => word.color !== turn && !word.revealed)
    .map(word => word.text);

  const wordsToPickString = `{'${wordsToPick.join("', '")}'}`;
  const wordsToAvoidString = `{'${wordsToAvoid.join("', '")}'}`;

  let prompt = `${instruction}\n\nWords to pick: ${wordsToPickString}\nWords to avoid: ${wordsToAvoidString}`;

  if (fewShotExamples && fewShotExamples.length > 0) {
    const examples = fewShotExamples
      .filter(ex => ex.clue)
      .map(ex => `- Clue: "${ex.clue}" for ${ex.count || '?'} word(s)`)
      .join('\n');
    if (examples) {
      prompt += `\n\nHere are examples of clues the player liked:\n${examples}`;
    }
  }

  console.log('prompt:', prompt);

  const responseText = await callGeminiAPI(prompt);
  return responseText;
};

export { callGeminiAPI };
export default Request_Clue;
