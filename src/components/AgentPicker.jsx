import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase';
import AgentCard from './AgentCard';
import './AgentPicker.css';

const AgentPicker = ({ user }) => {
  const { lobbyCode } = useParams();
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [locking, setLocking] = useState(false);

  // Redirect if already locked
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'game-lobbies', lobbyCode), (snap) => {
      if (snap.exists() && snap.data().agentLocked) {
        navigate(`/${lobbyCode}`, { replace: true });
      }
    });
    return () => unsubscribe();
  }, [lobbyCode, navigate]);

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      const snap = await getDocs(collection(firestore, 'agents'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAgents(list);
    };
    fetchAgents();
  }, []);

  const handleLockIn = async () => {
    if (!selectedId || !user?.uid) return;
    setLocking(true);
    try {
      await updateDoc(doc(firestore, 'game-lobbies', lobbyCode), {
        [`agentSelections.${user.uid}`]: selectedId,
        agentLocked: true,
      });
      navigate(`/${lobbyCode}`);
    } catch (err) {
      console.error('Error locking agent:', err);
      setLocking(false);
    }
  };

  return (
    <div className="agent-picker-page">
      <header className="App-header">
        <h1>Puzzle Fuzz</h1>
      </header>
      <h2 className="picker-title">Choose Your Cluegiver</h2>
      <div className="picker-grid">
        {agents.map((agent, i) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedId === agent.id}
            onSelect={setSelectedId}
            variant="featured"
            index={i}
          />
        ))}
      </div>
      <button
        className="lock-in-btn"
        onClick={handleLockIn}
        disabled={!selectedId || locking}
      >
        {locking ? 'Locking In...' : 'Lock In'}
      </button>
    </div>
  );
};

export default AgentPicker;
