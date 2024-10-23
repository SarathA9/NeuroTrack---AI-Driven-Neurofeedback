// src/pages/Training.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, Grid, Paper, Typography, Button, CircularProgress,
  Select, MenuItem, FormControl, InputLabel 
} from '@mui/material';
import { useSession } from '../contexts/SessionContext';
import NeuroVisualizer from '../components/training/NeuroVisualizer';
import FeedbackDisplay from '../components/training/FeedbackDisplay';
import SessionControls from '../components/training/SessionControls';
import RealTimeMetrics from '../components/training/RealTimeMetrics';

const Training = () => {
  const { 
    startSession, 
    pauseSession, 
    endSession, 
    currentSession,
    sessionState 
  } = useSession();
  const [trainingType, setTrainingType] = useState('focus');
  const [difficulty, setDifficulty] = useState('medium');
  const [feedback, setFeedback] = useState(null);

  const handleStartSession = () => {
    startSession({
      type: trainingType,
      difficulty,
      settings: getTrainingSettings(trainingType, difficulty)
    });
  };

  const getTrainingSettings = (type, diff) => {
    const settings = {
      focus: {
        easy: { threshold: 0.6, targetBand: 'beta', duration: 300 },
        medium: { threshold: 0.7, targetBand: 'beta', duration: 600 },
        hard: { threshold: 0.8, targetBand: 'beta', duration: 900 }
      },
      relaxation: {
        easy: { threshold: 0.6, targetBand: 'alpha', duration: 300 },
        medium: { threshold: 0.7, targetBand: 'alpha', duration: 600 },
        hard: { threshold: 0.8, targetBand: 'alpha', duration: 900 }
      },
      mindfulness: {
        easy: { threshold: 0.6, targetBand: 'theta', duration: 300 },
        medium: { threshold: 0.7, targetBand: 'theta', duration: 600 },
        hard: { threshold: 0.8, targetBand: 'theta', duration: 900 }
      }
    };
    return settings[type][diff];
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Neurofeedback Training
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Training Configuration
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Training Type</InputLabel>
              <Select
                value={trainingType}
                onChange={(e) => setTrainingType(e.target.value)}
                disabled={sessionState !== 'idle'}
              >
                <MenuItem value="focus">Focus Enhancement</MenuItem>
                <MenuItem value="relaxation">Relaxation Training</MenuItem>
                <MenuItem value="mindfulness">Mindfulness Practice</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={sessionState !== 'idle'}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
            <SessionControls 
              onStart={handleStartSession}
              onPause={pauseSession}
              onEnd={endSession}
              sessionState={sessionState}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <NeuroVisualizer 
              trainingType={trainingType}
              sessionState={sessionState}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <RealTimeMetrics />
        </Grid>

        <Grid item xs={12} md={8}>
          <FeedbackDisplay 
            feedback={feedback}
            trainingType={trainingType}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Training;