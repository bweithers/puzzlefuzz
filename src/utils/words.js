// src/utils/words.js — Shared word-fetching utility

export const fetchWordList = async () => {
  const response = await fetch('/words.txt');
  const text = await response.text();
  return text.split('\n').filter(word => word.trim() !== '');
};

export const pickRandomWords = (allWords, count = 20) => {
  const selected = [];
  while (selected.length < count) {
    const word = allWords[Math.floor(Math.random() * allWords.length)];
    if (!selected.includes(word)) {
      selected.push(word);
    }
  }
  return selected;
};

export const assignColors = (selectedWords) => {
  const coloredWords = selectedWords.map((word, index) => {
    let color;
    if (index < 8) color = 'pink';
    else if (index < 15) color = 'green';
    else if (index < 19) color = 'neutral';
    else color = 'bomb';
    return { text: word, color, revealed: false };
  });

  // Fisher-Yates shuffle
  for (let i = coloredWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coloredWords[i], coloredWords[j]] = [coloredWords[j], coloredWords[i]];
  }

  return coloredWords;
};

export const fetchWordsAndSetup = async () => {
  const allWords = await fetchWordList();
  const selected = pickRandomWords(allWords, 20);
  return assignColors(selected);
};
