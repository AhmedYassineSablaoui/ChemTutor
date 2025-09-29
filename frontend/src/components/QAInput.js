import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';

const STORAGE_KEY = 'qa_saved_questions_v1';
const CATEGORIES = ['General', 'Organic', 'Inorganic', 'Analytical', 'Physical', 'Biochemistry'];

const QAInput = ({ onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('General');
  const [history, setHistory] = useState([]);

  // Load history from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setHistory(parsed.sort((a, b) => b.ts - a.ts).slice(0, 20));
      }
    } catch {}
  }, []);

  const saveHistory = (next) => {
    setHistory(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 50))); } catch {}
  };

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    onSubmit(trimmed, category);
    const entry = { question: trimmed, category, ts: Date.now() };
    const deduped = [entry, ...history.filter(h => h.question !== trimmed)].slice(0, 20);
    saveHistory(deduped);
  };

  const recentCategories = useMemo(() => {
    const set = new Set(history.map(h => h.category));
    return Array.from(set).filter(Boolean);
  }, [history]);

  return (
    <Box>
      <Stack spacing={2}>
        <Typography variant="h5">Ask a chemistry question</Typography>
        <TextField
          label="Your question"
          placeholder="e.g., What are the properties of ethanol?"
          multiline
          minRows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          fullWidth
        />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="qa-category-label">Category</InputLabel>
            <Select
              labelId="qa-category-label"
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleSubmit} sx={{ minWidth: 160 }}>Ask</Button>
        </Stack>

        {history.length > 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>Recent questions</Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {history.slice(0, 10).map((h, idx) => (
                <Chip
                  key={`${h.ts}-${idx}`}
                  label={h.question}
                  onClick={() => { setQuestion(h.question); setCategory(h.category || 'General'); }}
                  variant="outlined"
                />)
              )}
            </Stack>
            {recentCategories.length > 0 && (
              <Box mt={1}>
                <Typography variant="caption">Recent categories:</Typography>
                <Stack direction="row" gap={1} mt={0.5}>
                  {recentCategories.map(c => (
                    <Chip key={c} label={c} onClick={() => setCategory(c)} size="small" />
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default QAInput;


