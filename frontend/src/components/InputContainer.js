import React from 'react';

const InputContainer = ({ value, onChange, placeholder = "Enter your input here..." }) => {
  return (
    <div className="mb-3">
      <label className="form-label">Input:</label>
      <textarea
        className="form-control"
        rows="4"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputContainer;
