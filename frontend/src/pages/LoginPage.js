import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, saveAuth } from '../api';
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
  Alert
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await loginUser(username, password);
      saveAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          🔐 Sign in to ChemTutor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access your saved work and personalized features
        </Typography>
      </Box>

      {/* Main Login Card */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card variant="outlined" sx={{ width: '100%', maxWidth: 500 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              Login
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            <form onSubmit={onSubmit}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
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
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                sx={{ mt: 3, mb: 1, py: 1.5 }}
                disabled={loading}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
              <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mt: 1 }}>
                No account?{' '}
                <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 'bold' }}>
                  Create one
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginPage;


