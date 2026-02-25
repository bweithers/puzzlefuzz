import React, { useState, useEffect } from 'react';
import './ClueGiver.css';
import Request_Clue from '../geminiApi.js';
import { doc, getDoc, updateDoc, arrayUnion, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../firebase';

const ClueGiver = ({ gameState, user, agentId, lobbyCode }) => {
  const [hint, setHint] = useState(null);
  const [agentData, setAgentData] = useState(null);
  const [fewShotExamples, setFewShotExamples] = useState([]);

  const currentTurn = gameState?.currentTurn ?? null;
  const isGameOver = gameState?.gameOver ?? false;
  const words = gameState?.words ?? [];

  // Fetch agent data when agentId changes
  useEffect(() => {
    if (!agentId) {
      setAgentData(null);
      return;
    }
    const fetchAgent = async () => {
      const snap = await getDoc(doc(firestore, 'agents', agentId));
      if (snap.exists()) {
        setAgentData({ id: snap.id, ...snap.data() });
      }
    };
    fetchAgent();
  }, [agentId]);

  // Fetch user's positive feedback + journal entries for few-shot examples
  useEffect(() => {
    if (!user?.uid || !agentId) return;
    const fetchTrainingData = async () => {
      const examples = [];

      // Fetch feedback
      const prefSnap = await getDoc(doc(firestore, 'user-agent-preferences', user.uid));
      if (prefSnap.exists()) {
        const feedback = prefSnap.data().feedback || [];
        const positives = feedback
          .filter(f => f.rating === 'up' && f.agentId === agentId)
          .slice(-5);
        examples.push(...positives);
      }

      // Fetch journal entries
      try {
        const journalRef = collection(firestore, 'clue-journal', user.uid, 'entries');
        const q = query(journalRef, orderBy('createdAt', 'desc'), limit(5));
        const journalSnap = await getDocs(q);
        journalSnap.forEach(d => {
          examples.push(d.data());
        });
      } catch {
        // Journal may not exist yet
      }

      setFewShotExamples(examples);
    };
    fetchTrainingData();
  }, [user?.uid, agentId]);

  // Fetch clue when turn changes
  useEffect(() => {
    if (currentTurn === null) return;

    if (isGameOver) {
      setHint('Game Over!');
      return;
    }

    let isMounted = true;
    setHint('Thinking...');

    const fetchHint = async () => {
      try {
        const hintResult = await Request_Clue(
          words,
          currentTurn,
          agentData?.systemPrompt,
          fewShotExamples.length > 0 ? fewShotExamples : undefined
        );
        if (isMounted) {
          const rawClue = hintResult;
          const cleanedHint = hintResult.replace(/['{}/]/g, '');
          setHint(cleanedHint);

          // Parse clue word and count from cleaned hint
          const [parsedClue, parsedCount] = cleanedHint.split(',', 2).map(s => s?.trim());
          const count = parseInt(parsedCount, 10) || 0;

          // Record clue in history
          if (lobbyCode) {
            const wordsToPick = words
              .filter(w => w.color === currentTurn && !w.revealed)
              .map(w => w.text);
            const wordsToAvoid = words
              .filter(w => w.color !== currentTurn && !w.revealed)
              .map(w => w.text);

            updateDoc(doc(firestore, 'game-lobbies', lobbyCode), {
              clueHistory: arrayUnion({
                turn: currentTurn,
                agentId: agentId || 'default',
                clue: parsedClue,
                count,
                rawClue,
                wordsToFind: wordsToPick,
                wordsToAvoid,
                timestamp: new Date().toISOString(),
              }),
            }).catch(() => {});
          }
        }
      } catch (error) {
        console.error('Error fetching hint:', error);
        if (isMounted) {
          setHint('Error loading hint');
        }
      }
    };

    fetchHint();

    return () => {
      isMounted = false;
    };
  }, [currentTurn, isGameOver]); // eslint-disable-line react-hooks/exhaustive-deps

  const [hintWord, hintCount] = hint ? hint.split(',', 3) : [null, null];

  return (
    <div className="clue-giver">
      <h2>ClueGiver Hint</h2>
      {agentData && <span className="clue-agent-tag">{agentData.name}</span>}
      <div className="hint-box">
        {hint ? <p>{hintWord}</p> : <p>No hint available yet.</p>}
        <br />
        {hint ? <p>{hintCount}</p> : <p>-1</p>}
      </div>
    </div>
  );
};

export default ClueGiver;
