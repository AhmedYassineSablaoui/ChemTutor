import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import Button from '@mui/material/Button';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import QAInput from '../components/QAInput';
import { askQuestion } from '../api';
import { toast } from 'react-toastify';

export default function QAPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);

  // Submit handler used by QAInput
  const handleSubmit = async (question, category) => {
    setLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);

    try {
      const data = await askQuestion(question, category);

      if (data.success || data.answer) {
        setAnswer(data.answer || '');
        const srcs = Array.isArray(data.sources) ? data.sources : (data.sources ? [String(data.sources)] : []);
        setSources(srcs);
        setCurrentQuestion(question);
        const questions = generateFollowUpQuestions(question, data.answer || '');
        setFollowUpQuestions(questions);
        setShowSuggestions(true);
        toast.success('✓ Answer generated successfully!');
      } else {
        const errorMsg = data.error || 'Answer generation failed';
        const errorDetails = data.details || '';
        setError({ message: errorMsg, details: errorDetails, code: data.error_code });
        toast.error(`Error: ${errorMsg}`);
      }
    } catch (err) {
      setError({
        message: err.response?.data?.error || 'Answer request failed',
        details: err.response?.data?.details || err.message || '',
        code: err.response?.data?.error_code || 'UNEXPECTED_ERROR'
      });
      toast.error('Answer generation failed. Please check the error details.');
    } finally {
      setLoading(false);
    }
  };

  // Generate follow-up questions based on the current question and answer
  const generateFollowUpQuestions = (question, answer) => {
    const followUpQuestions = [
      `Can you explain the key concepts in "${question}" in more detail?`,
      `What are some practical applications of the topic in "${question}"?`,
      `What are the most important things to remember about "${question}"?`,
    ];

    // Add context-specific questions based on common chemistry topics
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('acid') && lowerQuestion.includes('base')) {
      followUpQuestions.push('What is the difference between strong and weak acids/bases?');
      followUpQuestions.push('How do you calculate pH and pOH?');
    } else if (lowerQuestion.includes('bond') || lowerQuestion.includes('lewis')) {
      followUpQuestions.push('What are the different types of chemical bonds?');
      followUpQuestions.push('How do you determine molecular geometry using VSEPR theory?');
    } else if (lowerQuestion.includes('reaction') || lowerQuestion.includes('equation')) {
      followUpQuestions.push('How do you balance chemical equations?');
      followUpQuestions.push('What are the different types of chemical reactions?');
    } else if (lowerQuestion.includes('periodic') || lowerQuestion.includes('element')) {
      followUpQuestions.push('How is the periodic table organized?');
      followUpQuestions.push('What are periodic trends and how do they work?');
    }

    return followUpQuestions.slice(0, 4); // Return up to 4 questions
  };

  const handleLearnMore = async (followUpQuestion) => {
    // Automatically submit the follow-up question
    setLoading(true);
    setError(null);
    setAnswer('');
    setSources([]);

    try {
      const data = await askQuestion(followUpQuestion);

      if (data.success || data.answer) {
        setAnswer(data.answer || '');
        const srcs = Array.isArray(data.sources) ? data.sources : (data.sources ? [String(data.sources)] : []);
        setSources(srcs);
        setCurrentQuestion(followUpQuestion);
        const questions = generateFollowUpQuestions(followUpQuestion, data.answer || '');
        setFollowUpQuestions(questions);
        setShowSuggestions(true);
        toast.success('✓ Follow-up answer generated!');
      } else {
        // Handle API error responses
        const errorMsg = data.error || 'Follow-up answer generation failed';
        const errorDetails = data.details || '';
        setError({
          message: errorMsg,
          details: errorDetails,
          code: data.error_code
        });
        toast.error(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Follow-up question error:', err);
      setError({
        message: 'Failed to generate follow-up answer',
        details: err.message || 'Please try again.',
        code: 'FOLLOWUP_ERROR'
      });
      toast.error('Failed to generate follow-up answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🧪 Chemistry Q&A
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ask chemistry questions and get sourced answers
        </Typography>
      </Box>

      {/* Input Section */}
      <QAInput onSubmit={handleSubmit} />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={24} />
            <Typography variant="body1">Generating answer...</Typography>
          </Stack>
        </Box>
      )}

      {/* Error Display */}
      {error && !loading && (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mb: 3 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {error.message}
          </Typography>
          {error.details && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {error.details}
            </Typography>
          )}
          {error.code && (
            <Chip
              label={`Error Code: ${error.code}`}
              size="small"
              color="error"
              variant="outlined"
              sx={{ mt: 1 }}
            />
          )}
        </Alert>
      )}

      {/* Results Display */}
      {answer && !loading && !error && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            {/* Success Badge */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <CheckCircleIcon color="success" />
              <Typography variant="h6" color="success.main">
                Answer Generated
              </Typography>
              {sources.length > 0 && (
                <Chip label={`${sources.length} source${sources.length > 1 ? 's' : ''}`} color="info" size="small" />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Answer Section */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'success.light',
                border: 1,
                borderColor: 'success.main'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold" color="success.dark">
                  Answer
                </Typography>
                <CheckCircleIcon fontSize="small" color="success" />
              </Stack>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  fontSize: '1.1em'
                }}
              >
                {answer}
              </Typography>
            </Paper>

            {/* Sources Section */}
            {sources.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Sources</Typography>
                <Stack gap={1}>
                  {sources.map((source, i) => (
                    <Chip
                      key={i}
                      label={source}
                      variant="outlined"
                      color="primary"
                      sx={{ justifyContent: 'flex-start' }}
                    />
                  ))}
                </Stack>
              </>
            )}

            {/* Learn More & Suggestions Section */}
            {showSuggestions && followUpQuestions.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Continue Learning</Typography>

                {/* Learn More Button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SchoolIcon />}
                  onClick={() => {
                    const randomQuestion = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];
                    handleLearnMore(randomQuestion);
                  }}
                  sx={{ mb: 2 }}
                >
                  Learn More
                </Button>

                {/* Follow-up Question Suggestions */}
                <Stack gap={1} sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">Suggested follow-up questions:</Typography>
                  {followUpQuestions.map((question, i) => (
                    <Chip
                      key={i}
                      label={question}
                      onClick={() => handleLearnMore(question)}
                      variant="outlined"
                      color="secondary"
                      sx={{
                        justifyContent: 'flex-start',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </>
            )}

            {/* Additional Info */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>Note:</strong> Answers are generated based on chemistry knowledge and may include
                information from various sources. Always verify critical information for accuracy.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      {!answer && !loading && !error && (
        <Card variant="outlined" sx={{ bgcolor: 'info.light', borderColor: 'info.main' }}>
          <CardContent>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <InfoIcon color="info" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  How to use
                </Typography>
                <Typography variant="body2" component="div">
                  <ol style={{ marginLeft: '1rem', marginTop: '0.5rem' }}>
                    <li>Enter your chemistry question in the text field above</li>
                    <li>Select a category to help focus the search (optional)</li>
                    <li>Click &quot;Ask Question&quot; to generate an answer</li>
                    <li>Review the answer and check the provided sources</li>
                  </ol>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Supported:</strong> General chemistry questions, concepts explanation,
                  problem solving, and sourced information.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}


