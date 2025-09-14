import React, { useState, useEffect } from 'react';

const ReactionInput = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const commonCompounds = ['H2O', 'NaCl', 'H2SO4', 'NaOH', 'CO2', 'O2', 'H2']; // Expand later

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setError('');
      onSubmit(input);
    } else {
      setError('Please enter a reaction.');
    }
  };

  // Validate reaction format
  useEffect(() => {
    if (input.trim()) {
      if (!input.includes('->')) {
        setError('Reaction must include "->" separator.');
      } else {
        setError('');
      }
    }
  }, [input]);

  // Suggest common compounds
  useEffect(() => {
    if (input.length > 0 && !input.includes('->')) {
      const matches = commonCompounds.filter((comp) =>
        comp.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  return (
    <form onSubmit={handleSubmit} className="mb-4 position-relative">
      <div className="mb-3">
        <label htmlFor="reactionInput" className="form-label">
          Enter Reaction (e.g., H2 + O2 -&gt; H2O)
        </label>
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

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul
          className="list-group position-absolute w-100"
          style={{ zIndex: 1000 }}
        >
          {suggestions.map((sug, idx) => (
            <li
              key={idx}
              className="list-group-item list-group-item-action"
              onClick={() => {
                setInput(sug);
                setSuggestions([]);
              }}
            >
              {sug}
            </li>
          ))}
        </ul>
      )}

      <button type="submit" className="btn btn-primary mt-3">
        Balance Reaction
      </button>
    </form>
  );
};

export default ReactionInput;
