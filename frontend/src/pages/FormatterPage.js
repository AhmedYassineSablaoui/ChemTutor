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
  if (err.code === "ECONNABORTED") {
    toast.error("⏳ Request timed out — try again.");
  } else {
    toast.error(`Invalid reaction: ${err.response?.data?.error || "Unknown error"}`);
  }
  console.error("Error balancing reaction:", err);


    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>⚗️ Reaction Formatter</h2>
      <ReactionInput onSubmit={handleSubmit} />

      {loading && <p>⏳ Balancing reaction...this might take a few seconds.</p>}

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
            {result.thermo_estimate && <p><strong>Thermo hint:</strong>{result.thermo_estimate}</p>}
            {result.mechanism_hint && <p><strong>Mechanism:</strong> {result.mechanism_hint}</p>}
            {result.metadata && (
      <details>
        <summary>Metadata</summary>
        <ul>
          {result.metadata.reactants.map((r, i) => ( <li key={i}>{r.coeff} x {r.iupac}</li>))}</ul>
      </details>
    )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormatterPage;
