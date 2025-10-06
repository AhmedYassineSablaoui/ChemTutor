import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Alert, Chip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const CorrectionInput = ({ onSubmit }) => {
  const [statement, setStatement] = useState('');
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const exampleStatements = [
    "Water is H2O molecule",
    "Sodium chloride are formed when sodium react with chlorine",
    "Carbon dioxide is CO2 and it are important for photosynthesis",
    "The reaction between hydrogen and oxygen produces water",
    "Glucose has molecular formula C6H12O6"
  ];

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (statement.trim()) {
      if (statement.trim().length > 1000) {
        setError('Statement is too long (max 1000 characters).');
        return;
      }
      setError('');
      onSubmit(statement.trim());
    } else {
      setError('Please enter a chemistry statement.');
    }
  };

  // Update character count
  useEffect(() => {
    setCharCount(statement.length);
    if (statement.length > 1000) {
      setError('Statement exceeds 1000 characters.');
    } else if (error === 'Statement exceeds 1000 characters.') {
      setError('');
    }
  }, [statement, error]);

  // Handle example click
  const handleExampleClick = (example) => {
    setStatement(example);
    setError('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Enter Chemistry Statement"
        placeholder="Type or paste your chemistry statement here..."
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        error={!!error}
        helperText={error || `${charCount}/1000 characters`}
        variant="outlined"
        sx={{ mb: 2 }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<AutoFixHighIcon />}
          disabled={!statement.trim() || statement.length > 1000}
        >
          Correct Statement
        </Button>
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            setStatement('');
            setError('');
          }}
        >
          Clear
        </Button>
      </Stack>

      <Box sx={{ mt: 3 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
          <strong>Examples:</strong>
          {exampleStatements.map((example, idx) => (
            <Chip
              key={idx}
              label={example.length > 50 ? example.substring(0, 50) + '...' : example}
              onClick={() => handleExampleClick(example)}
              clickable
              size="small"
              variant="outlined"
              icon={<CheckCircleIcon />}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default CorrectionInput;
