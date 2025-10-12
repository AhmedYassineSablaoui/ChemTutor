import React, { useState } from "react";
import ReactionInput from "../components/ReactionInput";
import { balanceReaction } from "../api";
import { toast } from "react-toastify";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  Paper,
  Grid
} from "@mui/material";
import Button from '@mui/material/Button';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

const FormatterPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentReaction, setCurrentReaction] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [relatedReactions, setRelatedReactions] = useState([]);

  // Generate related reactions for practice based on the balanced reaction
  const generateRelatedReactions = (reaction) => {
    const relatedReactions = [];

    // Add context-specific related reactions based on common chemistry topics
    const lowerReaction = reaction.toLowerCase();

    if (lowerReaction.includes('h2') && lowerReaction.includes('o2')) {
      relatedReactions.push('Balance: CH4 + O2 → CO2 + H2O');
      relatedReactions.push('Balance: C2H6 + O2 → CO2 + H2O');
      relatedReactions.push('What is combustion reaction?');
    } else if (lowerReaction.includes('acid') || lowerReaction.includes('base')) {
      relatedReactions.push('Balance: HCl + NaOH → NaCl + H2O');
      relatedReactions.push('Balance: H2SO4 + 2NaOH → Na2SO4 + 2H2O');
      relatedReactions.push('What is neutralization reaction?');
    } else if (lowerReaction.includes('fe') || lowerReaction.includes('oxidation')) {
      relatedReactions.push('Balance: Fe + O2 → Fe2O3');
      relatedReactions.push('Balance: Cu + O2 → CuO');
      relatedReactions.push('What is oxidation-reduction reaction?');
    } else if (lowerReaction.includes('photosynthesis') || lowerReaction.includes('glucose')) {
      relatedReactions.push('What is the chemical equation for photosynthesis?');
      relatedReactions.push('Balance: C6H12O6 + O2 → CO2 + H2O');
      relatedReactions.push('What is cellular respiration?');
    }

    // Always add some general chemistry reactions
    if (relatedReactions.length < 3) {
      relatedReactions.push('Balance: Na + Cl2 → NaCl');
      relatedReactions.push('Balance: CaCO3 → CaO + CO2');
      relatedReactions.push('What is the law of conservation of mass?');
    }

    return relatedReactions.slice(0, 4); // Return up to 4 reactions
  };

  const handleLearnMore = async (relatedReaction) => {
    // This would typically open a modal or navigate to Q&A page with the reaction as a question
    toast.info(`💡 Try asking: "${relatedReaction}"`);
  };

  const handleSubmit = async (reaction) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await balanceReaction(reaction);

      if (data.success || data.balanced) {
        setResult(data);
        setCurrentReaction(reaction);
        const reactions = generateRelatedReactions(reaction);
        setRelatedReactions(reactions);
        setShowSuggestions(true);
        toast.success('✓ Reaction balanced successfully!');
      } else {
        // Handle API error responses
        const errorMsg = data.error || 'Reaction balancing failed';
        const errorDetails = data.details || '';
        setError({
          message: errorMsg,
          details: errorDetails,
          code: data.error_code
        });
        toast.error(`Error: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Reaction balancing error:', err);

      // Handle different error scenarios
      if (err.response?.data) {
        const errorData = err.response.data;
        setError({
          message: errorData.error || 'Reaction balancing request failed',
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
      toast.error('Reaction balancing failed. Please check the error details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ⚗️ Reaction Formatter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Balance chemical equations and inspect reaction insights
        </Typography>
      </Box>

      {/* Input Section */}
      <ReactionInput onSubmit={handleSubmit} />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={24} />
            <Typography variant="body1">Balancing reaction...</Typography>
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
      {result && !loading && !error && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            {/* Success Badge */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <CheckCircleIcon color="success" />
              <Typography variant="h6" color="success.main">
                Reaction Balanced
              </Typography>
              {result.type && (
                <Chip label={result.type} color="info" size="small" />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Balanced Equation Section */}
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
                  Balanced Equation
                </Typography>
                <CheckCircleIcon fontSize="small" color="success" />
              </Stack>
              <Typography
                component="div"
                sx={{
                  fontFamily: 'monospace',
                  fontSize: '1.1em',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {result.balanced}
              </Typography>
            </Paper>

            {/* Additional Information Sections */}
            {result.thermo_estimate && (
              <>
                <Divider sx={{ my: 2 }} />
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.light', border: 1, borderColor: 'info.main' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="info.dark">
                    Thermodynamic Estimate
                  </Typography>
                  <Typography variant="body2">
                    {result.thermo_estimate}
                  </Typography>
                </Paper>
              </>
            )}

            {result.mechanism_hint && (
              <>
                <Divider sx={{ my: 2 }} />
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.light', border: 1, borderColor: 'warning.main' }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="warning.dark">
                    Mechanism Hint
                  </Typography>
                  <Typography variant="body2">
                    {result.mechanism_hint}
                  </Typography>
                </Paper>
              </>
            )}

            {result.oxidation_states && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Oxidation States</Typography>
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', overflowX: 'auto' }}>
                  <Typography component="pre" sx={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875em' }}>
                    {JSON.stringify(result.oxidation_states, null, 2)}
                  </Typography>
                </Paper>
              </>
            )}

            {result.metadata?.reactants && Array.isArray(result.metadata.reactants) && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Metadata</Typography>
                <Stack component="ul" sx={{ pl: 3 }}>
                  {result.metadata.reactants.map((r, i) => (
                    <Typography key={i} component="li" variant="body2">
                      {r.coeff} × {r.iupac}
                    </Typography>
                  ))}
                </Stack>
              </>
            )}

            {/* Learn More & Practice Section */}
            {showSuggestions && relatedReactions.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>Continue Learning</Typography>

                {/* Learn More Button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SchoolIcon />}
                  onClick={() => {
                    const randomReaction = relatedReactions[Math.floor(Math.random() * relatedReactions.length)];
                    handleLearnMore(randomReaction);
                  }}
                  sx={{ mb: 2 }}
                >
                  Learn More
                </Button>

                {/* Related Practice Reactions */}
                <Stack gap={1} sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="bold">Suggested practice reactions:</Typography>
                  {relatedReactions.map((reaction, i) => (
                    <Chip
                      key={i}
                      label={reaction}
                      onClick={() => handleLearnMore(reaction)}
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
                <strong>Note:</strong> The balanced equation and additional information are generated
                based on chemical principles and known reaction mechanisms. Verify the results for your specific context.
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
                    <li>Enter an unbalanced chemical equation in the text field above</li>
                    <li>Click &quot;Balance Reaction&quot; to process the equation</li>
                    <li>Review the balanced equation and any additional insights</li>
                    <li>Use the reaction type and mechanism hints to understand the reaction better</li>
                  </ol>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Supported:</strong> Chemical equation balancing, reaction type identification,
                  thermodynamic estimates, and oxidation state analysis.
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FormatterPage;
