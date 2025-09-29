import React, { useState } from 'react';
import { Alert, Box, Card, CardContent, Chip, CircularProgress, Divider, Stack, Typography } from '@mui/material';
import QAInput from '../components/QAInput';
import { askQuestion } from '../api';

export default function QAPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);

  const handleSubmit = async (question, category) => {
    setLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);
    try {
      const data = await askQuestion(question, category);
      setAnswer(data.answer || '');
      const srcs = Array.isArray(data.sources) ? data.sources : (data.sources ? [String(data.sources)] : []);
      setSources(srcs);
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <QAInput onSubmit={handleSubmit} />
      <Box mt={3}>
        {loading && (
          <Stack direction="row" alignItems="center" gap={1}>
            <CircularProgress size={20} />
            <Typography variant="body2">Retrieving and generating answer…</Typography>
          </Stack>
        )}
        {error && (
          <Alert severity="error">{error}</Alert>
        )}
        {!loading && !error && (answer || sources.length > 0) && (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>Answer</Typography>
              <Typography whiteSpace="pre-line">{answer}</Typography>
              {sources.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>Sources</Typography>
                  <Stack gap={1}>
                    {sources.map((s, i) => (
                      <Chip key={i} label={s} variant="outlined" />
                    ))}
                  </Stack>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}


