import React, { useState } from 'react';
import ReactionInput from '../components/ReactionInput';
// import { healthCheck } from '../api';  // keep if you plan to use it later

const FormatterPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle reaction submission
  const handleSubmit = async (reaction) => {
    console.log('Submitting:', reaction);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/reactions/balance/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: reaction }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error while balancing reaction:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Reaction Formatter</h2>

      {/* Input form */}
      <ReactionInput onSubmit={handleSubmit} />

      {/* Loading state */}
      {loading && <p className="mt-3 text-muted">Processing reaction...</p>}

      {/* Results */}
      {result && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Results</h5>
            <p className="card-text">
              <strong>Balanced Equation:</strong> <code>{result.balanced}</code>
            </p>
            <span className="badge bg-info">{result.type}</span>

            {result.oxidation_states && (
              <details className="mt-2">
                <summary>Oxidation States</summary>
                <pre>{JSON.stringify(result.oxidation_states, null, 2)}</pre>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatterPage;
