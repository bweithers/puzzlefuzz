import React, { useState, useEffect } from 'react';
import './PlayerStats.css';
import { doc, getDoc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { setDoc } from 'firebase/firestore';

const PlayerStats = ({ user, setUser }) => {
  const [createdAt, setCreatedAt] = useState(null);
  const [editing, setEditing] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchUser = async () => {
      const snap = await getDoc(doc(firestore, 'users', user.uid));
      if (snap.exists() && snap.data().createdAt) {
        setCreatedAt(snap.data().createdAt.toDate());
      }
    };
    fetchUser();
  }, [user?.uid]);

  const handleSave = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed || trimmed === user.displayName) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await Promise.all([
        updateProfile(auth.currentUser, { displayName: trimmed }),
        setDoc(doc(firestore, 'users', user.uid), { displayName: trimmed }, { merge: true }),
      ]);
      setUser(prev => ({ ...prev, displayName: trimmed }));
      setEditing(false);
    } catch (error) {
      console.error('Error updating name:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="player-stats">
      <h3>Player Info</h3>
      <div className="stat-row">
        <span className="stat-label">Name</span>
        {editing ? (
          <span className="stat-value edit-row">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              maxLength={20}
              autoFocus
              disabled={saving}
            />
            <button onClick={handleSave} disabled={saving}>Save</button>
            <button onClick={() => setEditing(false)} disabled={saving}>Cancel</button>
          </span>
        ) : (
          <span className="stat-value">
            {user.displayName}
            <button className="edit-btn" onClick={() => { setNameInput(user.displayName); setEditing(true); }}>Edit</button>
          </span>
        )}
      </div>
      {createdAt && (
        <div className="stat-row">
          <span className="stat-label">Joined</span>
          <span className="stat-value">{createdAt.toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

export default PlayerStats;
