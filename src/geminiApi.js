// src/geminiApi.js

const callGeminiAPI = async (prompt, systemPrompt) => {
  const body = { prompt };
  if (systemPrompt) {
    body.systemPrompt = systemPrompt;
  }
  const response = await fetch('/api/gemini-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  const data = await response.json();
  return data.result;
};

const Request_Clue = async (words, turn, systemPrompt, fewShotExamples) => {
  const wordsToPick = words
    .filter(word => word.color === turn && !word.revealed)
    .map(word => word.text);

  const wordsToAvoid = words
    .filter(word => word.color !== turn && !word.revealed)
    .map(word => word.text);

  const wordsToPickString = `{'${wordsToPick.join("', '")}'}`;
  const wordsToAvoidString = `{'${wordsToAvoid.join("', '")}'}`;

  let prompt = '';

  if (fewShotExamples && fewShotExamples.length > 0) {
    prompt += 'Here are example clues in the preferred style:\n';
    for (const ex of fewShotExamples) {
      if (ex.targetWords) {
        prompt += `- Words: [${ex.targetWords.join(', ')}] -> Clue: "${ex.clue || ex.userClue}", ${ex.count || ex.userCount || ex.targetWords.length}\n`;
      }
    }
    prompt += '\n';
  }

  prompt += `Words to pick: ${wordsToPickString}\nWords to avoid: ${wordsToAvoidString}`;

  const responseText = await callGeminiAPI(prompt, systemPrompt);
  return responseText;
};

export { callGeminiAPI };
export default Request_Clue;
