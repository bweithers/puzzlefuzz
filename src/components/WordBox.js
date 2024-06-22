import React from 'react';
import './WordBox.css';

const WordBox = ({ word }) => {
  return (
    <div className="word-box">
      {word}
    </div>
  );
};

export default WordBox;
