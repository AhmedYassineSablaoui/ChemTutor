import React from 'react';

const OutputContainer = ({ output, title = "Output:" }) => {
  return (
    <div className="mb-3">
      <label className="form-label">{title}</label>
      <div className="form-control" style={{ minHeight: '100px', backgroundColor: '#f8f9fa' }}>
        {output || <span className="text-muted">Results will appear here...</span>}
      </div>
    </div>
  );
};

export default OutputContainer;
