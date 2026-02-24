import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './GameToolbar.css';

const GameToolbar = ({ lobbyCode, displayName, onGoHome }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lobbyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: ignore
    }
  };

  return (
    <div className="game-toolbar">
      <Link to="/" className="toolbar-back" onClick={onGoHome}>← Home</Link>
      <div className="toolbar-center">
        <span className="toolbar-label">GAME:</span>
        <code className="toolbar-code">{lobbyCode}</code>
        <button className="toolbar-copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="toolbar-player">{displayName}</div>
    </div>
  );
};

export default GameToolbar;
