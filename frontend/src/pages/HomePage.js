import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Chip,
  Paper,
  Button,
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import ScienceIcon from '@mui/icons-material/Science';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { healthCheck } from '../api';

export default function HomePage() {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    healthCheck()
      .then(data => {
        setStatus(data.status);
        setError('');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to connect to API');
        setStatus('');
        setLoading(false);
      });
  }, []);

  const features = [
    {
      icon: <ScienceIcon sx={{ fontSize: 50 }} />,
      title: 'Reaction Formatter',
      description: 'Balance chemical equations instantly with detailed compound information',
      path: '/formatter',
      color: '#1976d2',
      emoji: '⚗️'
    },
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 50 }} />,
      title: 'Chemistry Q&A',
      description: 'Get instant answers to your chemistry questions with AI assistance',
      path: '/qa',
      color: '#2e7d32',
      emoji: '❓'
    },
    {
      icon: <SpellcheckIcon sx={{ fontSize: 50 }} />,
      title: 'Statement Correction',
      description: 'Correct chemistry statements and terminology automatically',
      path: '/correction',
      color: '#ed6c02',
      emoji: '✍️'
    }
  ];

  const stats = [
    { label: 'AI-Powered', value: '100%', icon: <TrendingUpIcon /> },
    { label: 'Free to Use', value: 'Always', icon: <CheckCircleIcon /> },
    { label: 'Fast Results', value: '<1s', icon: <RocketLaunchIcon /> }
  ];

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Hero Section */}
      <Paper
        elevation={4}
        sx={{
          p: 5,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Stack alignItems="center" spacing={3}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: 'white',
              color: '#667eea',
              boxShadow: 4
            }}
          >
            <ScienceIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Box>
            <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
              Welcome to ChemTutor
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: 800, mx: 'auto' }}>
              Your AI-Powered Chemistry Learning Assistant
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            {stats.map((stat, index) => (
              <Chip
                key={index}
                icon={stat.icon}
                label={`${stat.label}: ${stat.value}`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '1rem',
                  py: 2.5,
                  px: 1,
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            ))}
          </Stack>

          {/* API Status */}
          {loading ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              <Typography variant="body2">Connecting to server...</Typography>
            </Stack>
          ) : status ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="API Connected"
              color="success"
              sx={{ fontWeight: 'bold' }}
            />
          ) : (
            <Alert severity="error" sx={{ maxWidth: 400 }}>
              {error}
            </Alert>
          )}

          <Button
            component={Link}
            to="/about"
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: '#667eea',
              fontWeight: 'bold',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)'
              }
            }}
            startIcon={<SchoolIcon />}
          >
            Learn More About ChemTutor
          </Button>
        </Stack>
      </Paper>

      {/* Features Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
          Choose Your Feature
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: feature.color,
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {feature.emoji} {feature.title}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  
                  <Button
                    component={Link}
                    to={feature.path}
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      mt: 2,
                      bgcolor: feature.color,
                      '&:hover': {
                        bgcolor: feature.color,
                        opacity: 0.9
                      }
                    }}
                    endIcon={<RocketLaunchIcon />}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Quick Start Guide */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
            🚀 Quick Start Guide
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  1️⃣ Choose
                </Typography>
                <Typography variant="body2">
                  Select a feature that matches your needs
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  2️⃣ Input
                </Typography>
                <Typography variant="body2">
                  Enter your equation, question, or statement
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'warning.light', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  3️⃣ Process
                </Typography>
                <Typography variant="body2">
                  AI analyzes and processes your input instantly
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'info.light', height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  4️⃣ Learn
                </Typography>
                <Typography variant="body2">
                  Get results with detailed explanations
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Why ChemTutor Section */}
      <Paper
        elevation={2}
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom textAlign="center">
          Why Choose ChemTutor?
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Accurate Results
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                AI-powered chemistry assistance
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <RocketLaunchIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Lightning Fast
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Get results in under a second
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <SchoolIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Learn Better
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Detailed explanations included
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack alignItems="center" spacing={1}>
              <TrendingUpIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                Track Progress
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                History saved automatically
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
