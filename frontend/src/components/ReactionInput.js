import React, { useState } from 'react';

// Removed TypeScript type annotations for JavaScript compatibility

const ReactionInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setError('');
      onSubmit(input);
    } else {
      setError('Please enter a reaction.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="mb-3">
        <label htmlFor="reactionInput" className="form-label">Enter Reaction (e.g., H2 + O2 -&gt; H2O)</label>
        <textarea
          id="reactionInput"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reactants + Reactants -> Products + Products"
        />
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
      <button type="submit" className="btn btn-primary">Balance Reaction</button>
    </form>
  );
};

export default ReactionInput;