import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Stack,
  Chip,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpellcheckIcon from '@mui/icons-material/Spellcheck';
import StorageIcon from '@mui/icons-material/Storage';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupIcon from '@mui/icons-material/Group';

export default function AboutPage() {
  const features = [
    {
      icon: <ScienceIcon sx={{ fontSize: 40 }} />,
      title: 'Reaction Formatter',
      description: 'Balance chemical equations automatically with detailed compound metadata and visual representations.',
      color: '#1976d2'
    },
    {
      icon: <QuestionAnswerIcon sx={{ fontSize: 40 }} />,
      title: 'Chemistry Q&A',
      description: 'Ask chemistry questions and get AI-powered answers with source citations from our knowledge base.',
      color: '#2e7d32'
    },
    {
      icon: <SpellcheckIcon sx={{ fontSize: 40 }} />,
      title: 'Statement Correction',
      description: 'Correct chemistry statements and terminology using advanced AI models trained on chemistry literature.',
      color: '#ed6c02'
    }
  ];

  const benefits = [
    {
      icon: <SpeedIcon />,
      title: 'Fast & Efficient',
      description: 'Get instant results for all chemistry operations'
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure & Private',
      description: 'Your data is stored securely in PostgreSQL database'
    },
    {
      icon: <StorageIcon />,
      title: 'History Tracking',
      description: 'All your queries are saved for future reference'
    },
    {
      icon: <GroupIcon />,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for students and educators'
    }
  ];

  const techStack = [
    { name: 'React', category: 'Frontend' },
    { name: 'Material-UI', category: 'Frontend' },
    { name: 'Django', category: 'Backend' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Redis', category: 'Caching' },
    { name: 'AI/ML Models', category: 'AI' },
    { name: 'REST API', category: 'Backend' }
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Hero Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: 'white',
              color: '#667eea'
            }}
          >
            <ScienceIcon sx={{ fontSize: 50 }} />
          </Avatar>
          <Typography variant="h3" component="h1" fontWeight="bold" textAlign="center">
            ChemTutor
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ maxWidth: 600 }}>
            Your AI-Powered Chemistry Learning Assistant
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
            <Chip label="AI-Powered" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Open Source" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
            <Chip label="Free to Use" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
          </Stack>
        </Stack>
      </Paper>

      {/* Mission Statement */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            ChemTutor is designed to make chemistry learning accessible, interactive, and efficient for students,
            educators, and chemistry enthusiasts. We combine cutting-edge AI technology with comprehensive chemistry
            knowledge to provide accurate, instant assistance for all your chemistry needs.
          </Typography>
          <Typography variant="body1">
            Whether you&apos;re balancing complex equations, seeking answers to chemistry questions, or correcting
            scientific statements, ChemTutor is here to help you succeed in your chemistry journey.
          </Typography>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Core Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Stack alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        width: 70,
                        height: 70,
                        bgcolor: feature.color
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold" textAlign="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {feature.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Benefits Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Why Choose ChemTutor?
        </Typography>
        <Grid container spacing={2}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  height: '100%'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {benefit.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {benefit.description}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* How It Works */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
            How It Works
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="1. Choose Your Feature"
                secondary="Select from Reaction Formatter, Q&A, or Correction based on your needs"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="2. Input Your Query"
                secondary="Enter your chemical equation, question, or statement"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="3. Get Instant Results"
                secondary="Receive AI-powered results with detailed explanations and sources"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="4. Track Your History"
                secondary="All your queries are automatically saved for future reference"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          Built With Modern Technology
        </Typography>
        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={1}>
              {techStack.map((tech, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Chip
                    label={tech.name}
                    variant="outlined"
                    color="primary"
                    sx={{ width: '100%' }}
                  />
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" color="text.secondary">
              ChemTutor leverages modern web technologies and AI models to deliver a seamless,
              fast, and reliable chemistry learning experience.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Database Features */}
      <Card variant="outlined" sx={{ mb: 4, bgcolor: 'info.light' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom fontWeight="bold" color="info.dark">
            📊 Advanced Data Management
          </Typography>
          <Typography variant="body1" paragraph>
            ChemTutor features a comprehensive PostgreSQL database structure that tracks:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="User profiles and preferences" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Login history and sessions" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Reaction balancing history" />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} sm={6}>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Q&A interaction history" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Correction request history" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Performance analytics" />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          bgcolor: 'success.light',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight="bold" color="success.dark">
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" paragraph>
          Create a free account to unlock all features and start your chemistry learning journey today!
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            icon={<SchoolIcon />}
            label="Free Forever"
            color="success"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            icon={<AutoFixHighIcon />}
            label="AI-Powered"
            color="success"
            sx={{ fontWeight: 'bold' }}
          />
          <Chip
            icon={<StorageIcon />}
            label="History Tracking"
            color="success"
            sx={{ fontWeight: 'bold' }}
          />
        </Stack>
      </Paper>

      {/* Footer Note */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          ChemTutor © 2025 | Built with ❤️ for chemistry learners worldwide
        </Typography>
      </Box>
    </Box>
  );
}
