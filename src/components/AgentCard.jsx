import React from 'react';
import './AgentCard.css';

const AgentCard = ({ agent, isSelected, onSelect }) => {
  const stats = agent.stats || {};
  const winRate = stats.gamesPlayed > 0
    ? Math.round((stats.wins / stats.gamesPlayed) * 100)
    : 0;
  const totalVotes = (stats.totalThumbsUp || 0) + (stats.totalThumbsDown || 0);
  const thumbsRatio = totalVotes > 0
    ? Math.round(((stats.totalThumbsUp || 0) / totalVotes) * 100)
    : null;

  return (
    <div className={`agent-card ${isSelected ? 'agent-card-selected' : ''}`}>
      <div className="agent-card-header">
        <h4 className="agent-card-name">{agent.name}</h4>
        <span className="agent-card-personality">{agent.personality}</span>
      </div>
      <p className="agent-card-desc">{agent.description}</p>
      <div className="agent-card-stats">
        <div className="agent-stat">
          <span className="agent-stat-value">{stats.gamesPlayed || 0}</span>
          <span className="agent-stat-label">Games</span>
        </div>
        <div className="agent-stat">
          <span className="agent-stat-value">{winRate}%</span>
          <span className="agent-stat-label">Win Rate</span>
        </div>
        {thumbsRatio !== null && (
          <div className="agent-stat">
            <span className="agent-stat-value">{thumbsRatio}%</span>
            <span className="agent-stat-label">Approval</span>
          </div>
        )}
      </div>
      <button
        className={`agent-card-btn ${isSelected ? 'agent-card-btn-selected' : ''}`}
        onClick={() => onSelect(agent.id)}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
};

export default AgentCard;
