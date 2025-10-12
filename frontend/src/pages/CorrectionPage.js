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
// import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';
import CorrectionInput from '../components/CorrectionInput';
import { correctStatement } from '../api';
import { toast } from 'react-toastify';

const CorrectionPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStatement, setCurrentStatement] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedStatements, setRelatedStatements] = useState([]);

  // Generate related statements for practice based on the corrected statement
  const generateRelatedStatements = (statement) => {
    const relatedStatements = [];

    // Add context-specific related statements based on common chemistry topics
    const lowerStatement = statement.toLowerCase();

    if (lowerStatement.includes('acid') || lowerStatement.includes('base') || lowerStatement.includes('ph')) {
      relatedStatements.push('Calculate the pH of a 0.1 M HCl solution');
      relatedStatements.push('What is the difference between strong and weak acids?');
      relatedStatements.push('Explain acid-base titration');
    } else if (lowerStatement.includes('bond') || lowerStatement.includes('lewis') || lowerStatement.includes('covalent')) {
      relatedStatements.push('Draw the Lewis structure for water (H2O)');
      relatedStatements.push('What is electronegativity and how does it affect bonding?');
      relatedStatements.push('Explain ionic vs covalent bonding');
    } else if (lowerStatement.includes('reaction') || lowerStatement.includes('equation') || lowerStatement.includes('balance')) {
      relatedStatements.push('Balance the reaction: H2 + O2 → H2O');
      relatedStatements.push('What are the different types of chemical reactions?');
      relatedStatements.push('Explain the law of conservation of mass');
    } else if (lowerStatement.includes('periodic') || lowerStatement.includes('element') || lowerStatement.includes('atom')) {
      relatedStatements.push('Explain atomic number and mass number');
      relatedStatements.push('What are valence electrons?');
      relatedStatements.push('Describe the structure of the periodic table');
    } else if (lowerStatement.includes('gas') || lowerStatement.includes('pressure') || lowerStatement.includes('volume')) {
      relatedStatements.push('State Boyle\'s law');
      relatedStatements.push('What is the ideal gas law?');
      relatedStatements.push('Explain Charles\'s law');
    }

    // Always add some general chemistry statements
    if (relatedStatements.length < 3) {
      relatedStatements.push('What is the difference between physical and chemical changes?');
      relatedStatements.push('Explain the scientific method');
      relatedStatements.push('What are the states of matter?');
    }

    return relatedStatements.slice(0, 4); // Return up to 4 statements
  };

  const handleLearnMore = async (relatedStatement) => {
    // This would typically open a modal or navigate to Q&A page with the statement as a question
    // For now, we'll show it as a suggestion that could be copied
    toast.info(`💡 Try asking: "${relatedStatement}"`);
  };

  const handleSubmit = async (statement) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await correctStatement(statement);
      
      if (data.success) {
        setResult(data);
        setCurrentStatement(statement);
        const statements = generateRelatedStatements(statement);
        setRelatedStatements(statements);
        setShowSuggestions(true);
        if (data.changed) {
          toast.success('✓ Statement corrected successfully!');
        } else {
          toast.info('✓ Statement is already correct!');
        }
      } else {
        // Handle API error responses
        const errorMsg = data.error || 'Correction failed';
        const errorDetails = data.details || '';
        setError({
          message: errorMsg,
          details: errorDetails,
          code: data.error_code
        });
        toast.error(`Error: ${errorMsg}`);
      }
    } catch (err) {
      // console.error('Correction error:', err);
      
      // Handle different error scenarios
      if (err.response?.data) {
        const errorData = err.response.data;
        setError({
          message: errorData.error || 'Correction request failed',
          details: errorData.details || '',
          code: errorData.error_code || 'UNKNOWN_ERROR'
        });
      } else if (err.code === 'ECONNABORTED') {
        setError({
          message: 'Request timed out',
          details: 'The server took too long to respond. Please try again.',
          code: 'TIMEOUT'
        });
      } else if (err.message === 'Network Error') {
        setError({
          message: 'Network error',
          details: 'Cannot connect to the server. Please ensure the backend is running.',
          code: 'NETWORK_ERROR'
        });
      } else {
        setError({
          message: 'An unexpected error occurred',
          details: err.message || 'Please try again later.',
          code: 'UNEXPECTED_ERROR'
        });
      }
      toast.error('Correction failed. Please check the error details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🔬 Chemistry Statement Correction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered grammar and accuracy correction for chemistry statements
        </Typography>
      </Box>

      {/* Input Section */}
      <CorrectionInput onSubmit={handleSubmit} />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={24} />
            <Typography variant="body1">Correcting statement...</Typography>
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
      {result && !loading && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            {/* Success Badge */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <CheckCircleIcon color="success" />
              <Typography variant="h6" color="success.main">
                Correction Complete
              </Typography>
              {result.changed ? (
                <Chip label="Modified" color="warning" size="small" />
              ) : (
                <Chip label="No changes needed" color="success" size="small" />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Original vs Corrected Comparison */}
            <Grid container spacing={2}>
              {/* Original Statement */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: result.changed ? 'error.light' : 'success.light',
                    border: 1,
                    borderColor: result.changed ? 'error.main' : 'success.main'
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Original Statement
                    </Typography>
                    {result.changed && <InfoIcon fontSize="small" color="error" />}
                  </Stack>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontStyle: result.changed ? 'italic' : 'normal'
                    }}
                  >
                    {result.original}
                  </Typography>
                </Paper>
              </Grid>

              {/* Corrected Statement */}
              <Grid item xs={12} md={6}>
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
                      Corrected Statement
                    </Typography>
                    <CheckCircleIcon fontSize="small" color="success" />
                  </Stack>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap',
                      fontWeight: result.changed ? 'bold' : 'normal'
                    }}
                  >
                    {result.corrected}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Comparison Icon */}
            {result.changed && (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                <Chip 
                  icon={<CompareArrowsIcon />} 
                  label="Changes detected" 
                  color="info" 
                  variant="outlined"
                />
              </Box>
            )}

            {/* Learn More & Practice Section */}
            {showSuggestions && relatedStatements.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Continue Learning</Typography>

                {/* Learn More Button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SchoolIcon />}
                  onClick={() => {
                    const randomStatement = relatedStatements[Math.floor(Math.random() * relatedStatements.length)];
                    handleLearnMore(randomStatement);
                  }}
                  sx={{ mb: 2 }}
                >
                  Learn More
                </Button>

                {/* Related Practice Statements */}
                <Stack gap={1} sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">Suggested practice questions:</Typography>
                  {relatedStatements.map((statement, i) => (
                    <Chip
                      key={i}
                      label={statement}
                      onClick={() => handleLearnMore(statement)}
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
                <strong>Note:</strong> The correction model analyzes grammar, scientific accuracy, 
                and chemical nomenclature to improve your statements. Always verify critical information.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      {!result && !loading && !error && (
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
                    <li>Enter or paste your chemistry statement in the text field above</li>
                    <li>Click &quot;Correct Statement&quot; to process your text</li>
                    <li>Review the corrected version and any changes made</li>
                    <li>Click on example chips to try pre-made statements</li>
                  </ol>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Supported features:</strong> Grammar correction, chemical nomenclature, 
                  formula validation, and scientific terminology.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default CorrectionPage;
