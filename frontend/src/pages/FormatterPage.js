import React, { useState } from "react";
import ReactionInput from "../components/ReactionInput";
import { balanceReaction } from "../api";
import { toast } from "react-toastify";

const FormatterPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (reaction) => {
    setLoading(true);
    try {
      const data = await balanceReaction(reaction);
      setResult(data);
    } catch (err) {
      console.error("Error balancing reaction:", err);
      toast.error(`Invalid reaction: ${err.response?.data?.error || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>⚗️ Reaction Formatter</h2>
      <ReactionInput onSubmit={handleSubmit} />

      {loading && <p>⏳ Balancing reaction...</p>}

      {result && (
        <div className="card mt-4">
          <div className="card-body">
            <h5 className="card-title">Results</h5>
            <p><strong>Balanced Equation:</strong> <code>{result.balanced}</code></p>
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
