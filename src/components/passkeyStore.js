// Dialog.js
import React from 'react';

const Dialog = ({ isOpen, onClose, passkey }) => {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h2>Your Passkey</h2>
        <p>{passkey}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Dialog;
