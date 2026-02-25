import React, { useState, useEffect } from 'react';
import './ClueJournal.css';
import { collection, addDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';
import { fetchWordList, pickRandomWords, assignColors } from '../utils/words';
import { useNavigate } from 'react-router-dom';

const ClueJournal = ({ user }) => {
  const [words, setWords] = useState([]);
  const [clueInput, setClueInput] = useState('');
  const [countInput, setCountInput] = useState(1);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [entries, setEntries] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Generate a random word set
  const generateWords = async () => {
    const allWords = await fetchWordList();
    const selected = pickRandomWords(allWords, 20);
    setWords(assignColors(selected));
    setSelectedTargets([]);
    setClueInput('');
    setCountInput(1);
  };

  useEffect(() => {
    generateWords();
  }, []);

  // Fetch past entries
  useEffect(() => {
    if (!user?.uid) return;
    const fetchEntries = async () => {
      const ref = collection(firestore, 'clue-journal', user.uid, 'entries');
      const q = query(ref, orderBy('createdAt', 'desc'), limit(20));
      const snap = await getDocs(q);
      setEntries(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchEntries();
  }, [user?.uid]);

  const toggleTarget = (index) => {
    setSelectedTargets(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSubmit = async () => {
    if (!clueInput.trim() || selectedTargets.length === 0 || !user?.uid) return;
    setSubmitting(true);

    const entry = {
      wordSet: words.map(w => w.text),
      userClue: clueInput.trim(),
      userCount: countInput,
      targetWords: selectedTargets.map(i => words[i].text),
      createdAt: serverTimestamp(),
    };

    try {
      const ref = collection(firestore, 'clue-journal', user.uid, 'entries');
      await addDoc(ref, entry);
      setEntries(prev => [{ ...entry, id: 'new-' + Date.now(), createdAt: { toDate: () => new Date() } }, ...prev]);
      setClueInput('');
      setCountInput(1);
      setSelectedTargets([]);
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="clue-journal-page">
      <header className="App-header">
        <h1>Puzzle Fuzz</h1>
      </header>
      <div className="journal-container">
        <div className="journal-header">
          <h2>Clue Journal</h2>
          <button className="journal-back-btn" onClick={() => navigate('/')}>Back to Home</button>
        </div>
        <p className="journal-instructions">
          Practice your clue-giving skills! Click words you want to target, then type your clue. Your entries help train your AI cluegiver.
        </p>

        <div className="journal-board">
          {words.map((word, i) => (
            <button
              key={i}
              className={`journal-word ${word.color} ${selectedTargets.includes(i) ? 'journal-word-selected' : ''}`}
              onClick={() => toggleTarget(i)}
            >
              {word.text}
            </button>
          ))}
        </div>

        <div className="journal-input-row">
          <input
            type="text"
            className="journal-clue-input"
            value={clueInput}
            onChange={(e) => setClueInput(e.target.value)}
            placeholder="Your clue (one word)"
            maxLength={30}
          />
          <input
            type="number"
            className="journal-count-input"
            value={countInput}
            onChange={(e) => setCountInput(Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
            max={10}
          />
          <button
            className="journal-submit-btn"
            onClick={handleSubmit}
            disabled={submitting || !clueInput.trim() || selectedTargets.length === 0}
          >
            {submitting ? 'Saving...' : 'Submit'}
          </button>
          <button className="journal-new-btn" onClick={generateWords}>New Words</button>
        </div>

        {selectedTargets.length > 0 && (
          <p className="journal-targets">
            Targeting: {selectedTargets.map(i => words[i].text).join(', ')}
          </p>
        )}

        {entries.length > 0 && (
          <div className="journal-history">
            <h3>Past Entries</h3>
            {entries.map(entry => (
              <div key={entry.id} className="journal-entry">
                <span className="journal-entry-clue">"{entry.userClue}", {entry.userCount}</span>
                <span className="journal-entry-targets">{entry.targetWords?.join(', ')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClueJournal;
