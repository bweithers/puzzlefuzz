import React, { useState } from 'react';
import './ClueReview.css';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../firebase';

const MAX_FEEDBACK = 50;

const ClueReview = ({ clueHistory, user, lobbyCode }) => {
  const [ratings, setRatings] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!clueHistory || clueHistory.length === 0) {
    return null;
  }

  const setRating = (index, rating) => {
    setRatings(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        rating: prev[index]?.rating === rating ? null : rating,
      },
    }));
  };

  const setReason = (index, reason) => {
    setRatings(prev => ({
      ...prev,
      [index]: { ...prev[index], reason },
    }));
  };

  const handleSubmit = async () => {
    if (!user?.uid) return;

    const ratedEntries = Object.entries(ratings).filter(([, v]) => v.rating);
    if (ratedEntries.length === 0) return;

    setSubmitted(true);

    try {
      // Write each rating to feedback-logs
      const feedbackLogsRef = collection(firestore, 'feedback-logs');
      for (const [idx, { rating, reason }] of ratedEntries) {
        const entry = clueHistory[idx];
        await addDoc(feedbackLogsRef, {
          uid: user.uid,
          lobbyCode,
          agentId: entry.agentId,
          turn: entry.turn,
          clue: entry.clue,
          count: entry.count ?? 0,
          wordsToFind: entry.wordsToFind,
          wordsToAvoid: entry.wordsToAvoid,
          rating,
          reason: reason || null,
          timestamp: serverTimestamp(),
        });
      }

      // Append to user-agent-preferences feedback (capped at 50)
      const prefRef = doc(firestore, 'user-agent-preferences', user.uid);
      const prefSnap = await getDoc(prefRef);
      const existingFeedback = prefSnap.exists() ? (prefSnap.data().feedback || []) : [];

      const newFeedbackEntries = ratedEntries.map(([idx, { rating, reason }]) => {
        const entry = clueHistory[idx];
        return {
          agentId: entry.agentId,
          clue: entry.clue,
          wordsToFind: entry.wordsToFind,
          wordsToAvoid: entry.wordsToAvoid,
          rating,
          reason: reason || null,
          timestamp: new Date().toISOString(),
        };
      });

      const updatedFeedback = [...existingFeedback, ...newFeedbackEntries].slice(-MAX_FEEDBACK);
      if (prefSnap.exists()) {
        await updateDoc(prefRef, { feedback: updatedFeedback });
      } else {
        await setDoc(prefRef, { feedback: updatedFeedback });
      }

      // Increment agent stats
      const agentUpdates = {};
      for (const [idx, { rating }] of ratedEntries) {
        const agentId = clueHistory[idx].agentId;
        if (!agentUpdates[agentId]) agentUpdates[agentId] = { up: 0, down: 0 };
        if (rating === 'up') agentUpdates[agentId].up++;
        else agentUpdates[agentId].down++;
      }

      for (const [agentId, counts] of Object.entries(agentUpdates)) {
        const agentRef = doc(firestore, 'agents', agentId);
        const updates = {};
        if (counts.up > 0) updates['stats.totalThumbsUp'] = increment(counts.up);
        if (counts.down > 0) updates['stats.totalThumbsDown'] = increment(counts.down);
        await updateDoc(agentRef, updates).catch(() => {});
      }
    } catch (error) {
      console.error('Error saving feedback:', error);
      setSubmitted(false);
    }
  };

  const hasRatings = Object.values(ratings).some(v => v.rating);

  return (
    <div className="clue-review">
      <h2>Clue Review</h2>
      <p className="clue-review-subtitle">Rate the clues from this game</p>
      <div className="clue-review-list">
        {clueHistory.map((entry, idx) => (
          <div key={idx} className="clue-review-entry">
            <div className="clue-review-header">
              <span className={`clue-team-dot ${entry.turn}`} />
              <span className="clue-review-clue">
                {entry.clue}{entry.count ? `, ${entry.count}` : ''}
              </span>
            </div>
            <div className="clue-review-targets">
              {entry.wordsToFind?.map((w, i) => (
                <span key={i} className="clue-target-word">{w}</span>
              ))}
            </div>
            {entry.rawClue && entry.rawClue !== entry.clue && (
              <p className="clue-review-explanation">{entry.rawClue}</p>
            )}
            <div className="clue-review-actions">
              <button
                className={`review-btn up ${ratings[idx]?.rating === 'up' ? 'active' : ''}`}
                onClick={() => setRating(idx, 'up')}
                disabled={submitted}
              >
                {'\u25B2'}
              </button>
              <button
                className={`review-btn down ${ratings[idx]?.rating === 'down' ? 'active' : ''}`}
                onClick={() => setRating(idx, 'down')}
                disabled={submitted}
              >
                {'\u25BC'}
              </button>
            </div>
            {ratings[idx]?.rating === 'down' && !submitted && (
              <input
                className="clue-review-reason"
                type="text"
                placeholder="What went wrong? (optional)"
                value={ratings[idx]?.reason || ''}
                onChange={(e) => setReason(idx, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button
          className="clue-review-submit"
          onClick={handleSubmit}
          disabled={!hasRatings}
        >
          Submit Feedback
        </button>
      ) : (
        <p className="clue-review-thanks">Thanks for your feedback!</p>
      )}
    </div>
  );
};

export default ClueReview;
