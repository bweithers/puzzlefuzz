import React, { useState, useEffect } from 'react';
import './AgentMarketplace.css';
import AgentCard from './AgentCard';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const AgentMarketplace = ({ user }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);

  useEffect(() => {
    const fetchAgents = async () => {
      const snap = await getDocs(collection(firestore, 'agents'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort by win rate descending
      list.sort((a, b) => {
        const aRate = (a.stats?.gamesPlayed || 0) > 0 ? (a.stats?.wins || 0) / a.stats.gamesPlayed : 0;
        const bRate = (b.stats?.gamesPlayed || 0) > 0 ? (b.stats?.wins || 0) / b.stats.gamesPlayed : 0;
        return bRate - aRate;
      });
      setAgents(list);
    };
    fetchAgents();
  }, []);

  // Fetch user's default agent preference
  useEffect(() => {
    if (!user?.uid) return;
    const fetchPref = async () => {
      const snap = await getDoc(doc(firestore, 'user-agent-preferences', user.uid));
      if (snap.exists() && snap.data().selectedAgentId) {
        setSelectedAgentId(snap.data().selectedAgentId);
      }
    };
    fetchPref();
  }, [user?.uid]);

  const handleSelect = async (agentId) => {
    if (!user?.uid) return;
    setSelectedAgentId(agentId);
    await setDoc(
      doc(firestore, 'user-agent-preferences', user.uid),
      { selectedAgentId: agentId },
      { merge: true }
    );
  };

  if (agents.length === 0) return null;

  return (
    <div className="agent-marketplace">
      <h3>Agent Marketplace</h3>
      <p className="marketplace-subtitle">Choose your AI cluegiver for new games</p>
      <div className="agent-list">
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={agent.id === selectedAgentId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default AgentMarketplace;
