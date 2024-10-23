import React from 'react';
import { Paper, Typography, Box, Alert } from '@mui/material';

const FeedbackDisplay = ({ feedback, trainingType }) => {
  const getFeedbackMessage = () => {
    if (!feedback) return null;
    
    const messages = {
      focus: {
        good: "Great focus! Keep maintaining this state.",
        medium: "Try to concentrate more on the visualization.",
        low: "Take a deep breath and try to focus your attention."
      },
      relaxation: {
        good: "Excellent relaxation state achieved.",
        medium: "Gently let go of any tension.",
        low: "Try to release any physical or mental tension."
      },
      mindfulness: {
        good: "Perfect mindful state maintained.",
        medium: "Stay present with your experience.",
        low: "Gently bring your attention back to the present moment."
      }
    };

    return messages[trainingType][feedback.level];
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Real-time Feedback
      </Typography>
      {feedback ? (
        <Alert 
          severity={
            feedback.level === 'good' ? 'success' : 
            feedback.level === 'medium' ? 'info' : 
            'warning'
          }
          sx={{ mt: 2 }}
        >
          {getFeedbackMessage()}
        </Alert>
      ) : (
        <Typography variant="body1">
          Start a session to receive feedback
        </Typography>
      )}
    </Paper>
  );
};

// Utility function for NeuroVisualizer
const getParticleColor = (trainingType) => {
  const colors = {
    focus: '#4CAF50',    // Green for focus
    relaxation: '#2196F3', // Blue for relaxation
    mindfulness: '#9C27B0' // Purple for mindfulness
  };
  return colors[trainingType] || '#ffffff';
};