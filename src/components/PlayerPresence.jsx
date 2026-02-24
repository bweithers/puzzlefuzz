import React from 'react';
import './PlayerPresence.css';

const PlayerPresence = ({ players }) => {
  const playerList = players ? Object.values(players) : [];

  if (playerList.length === 0) return null;

  return (
    <div className="player-presence">
      <h4>Players ({playerList.length})</h4>
      <div className="presence-list">
        {playerList.map((player, i) => (
          <div className="presence-item" key={i} title={player.displayName}>
            <span className="presence-avatar">
              {player.displayName?.charAt(0)?.toUpperCase() || '?'}
            </span>
            <span className="presence-name">{player.displayName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerPresence;
