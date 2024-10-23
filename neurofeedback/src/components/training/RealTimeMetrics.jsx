import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import { useSession } from '../../contexts/SessionContext';

const RealTimeMetrics = () => {
  const { currentSession, brainwaveData } = useSession();

  const calculateMetrics = (data) => {
    if (!data || data.length === 0) return null;
    const latest = data[data.length - 1];
    return {
      attention: (latest.beta / (latest.alpha + latest.theta)) * 100,
      relaxation: (latest.alpha / (latest.beta + latest.theta)) * 100,
      coherence: Math.min(100, (latest.alpha * latest.theta) / latest.beta)
    };
  };

  const metrics = calculateMetrics(brainwaveData);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Real-time Metrics
      </Typography>
      {metrics ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Attention Level</Typography>
          <LinearProgress 
            variant="determinate" 
            value={metrics.attention} 
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2">Relaxation Level</Typography>
          <LinearProgress 
            variant="determinate" 
            value={metrics.relaxation}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="body2">Neural Coherence</Typography>
          <LinearProgress 
            variant="determinate" 
            value={metrics.coherence}
            sx={{ mb: 2 }}
          />
        </Box>
      ) : (
        <Typography variant="body1">
          Waiting for brain activity data...
        </Typography>
      )}
    </Paper>
  );
};