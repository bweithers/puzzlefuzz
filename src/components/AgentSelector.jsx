import React, { useState, useEffect } from 'react';
import './AgentSelector.css';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const AgentSelector = ({ lobbyCode, user, currentAgentId, onAgentChange }) => {
  const [agents, setAgents] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      const snap = await getDocs(collection(firestore, 'agents'));
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setAgents(list);
    };
    fetchAgents();
  }, []);

  const handleSelect = async (agentId) => {
    if (!user?.uid || !lobbyCode) return;
    const lobbyRef = doc(firestore, 'game-lobbies', lobbyCode);
    await updateDoc(lobbyRef, {
      [`agentSelections.${user.uid}`]: agentId,
    });
    onAgentChange(agentId);
    setOpen(false);
  };

  const selectedAgent = agents.find(a => a.id === currentAgentId) || agents.find(a => a.isDefault);

  return (
    <div className="agent-selector">
      <h3>AI Cluegiver</h3>
      <button className="agent-selector-toggle" onClick={() => setOpen(!open)}>
        <span className="agent-name">{selectedAgent?.name || 'Select Agent'}</span>
        <span className="agent-personality">{selectedAgent?.personality}</span>
        <span className="agent-chevron">{open ? '\u25B2' : '\u25BC'}</span>
      </button>
      {open && (
        <div className="agent-dropdown">
          {agents.map(agent => (
            <button
              key={agent.id}
              className={`agent-option ${agent.id === currentAgentId ? 'selected' : ''}`}
              onClick={() => handleSelect(agent.id)}
            >
              <span className="agent-option-name">{agent.name}</span>
              <span className="agent-option-personality">{agent.personality}</span>
              <span className="agent-option-desc">{agent.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSelector;
