import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, saveAuth } from '../api';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Divider,
  Paper
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const data = await registerUser(username, password, email);
      saveAuth(data.token, data.user);
      toast.success('✓ Account created successfully!');
      navigate('/');
    } catch (err) {
      const errorMsg = err?.response?.data?.error || 'Registration failed';
      setError(errorMsg);
      toast.error(`Registration failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          👤 Create Your Account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join ChemTutor and start exploring chemistry with AI assistance
        </Typography>
      </Box>

      {/* Main Registration Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card variant="outlined" sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
              <PersonAddIcon color="primary" fontSize="large" />
              <Typography variant="h5" fontWeight="bold">
                Register
              </Typography>
            </Stack>

            {/* Error Display */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                <Typography variant="body2">{error}</Typography>
              </Alert>
            )}

            {/* Registration Form */}
            <form onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
                placeholder="Choose a unique username"
                helperText="This will be your display name"
              />
              
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                placeholder="your.email@example.com"
                helperText="Optional - for account recovery"
              />
              
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                placeholder="Create a strong password"
                helperText="At least 6 characters recommended"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddIcon />}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" textAlign="center" color="text.secondary">
                Already have an account?{' '}
                <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                  Sign in here
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* Info Section */}
      <Box sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
        <Card variant="outlined" sx={{ bgcolor: 'info.light', borderColor: 'info.main' }}>
          <CardContent>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <InfoIcon color="info" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Why create an account?
                </Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Save your work and history</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Access advanced features</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Personalized chemistry learning experience</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon fontSize="small" color="success" />
                    <Typography variant="body2">Free forever - no credit card required</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default RegisterPage;


