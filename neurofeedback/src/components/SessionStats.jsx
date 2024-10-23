import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useSession } from '../contexts/SessionContext';

const SessionStats = () => {
  const { currentSession, sessionState } = useSession();

  const calculateFocusScore = (data) => {
    if (!data || data.length === 0) return 0;
    // This will be replaced with actual focus score calculation
    return Math.min(100, Math.random() * 100);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Session Statistics
      </Typography>
      {currentSession ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CircularProgress
              variant="determinate"
              value={calculateFocusScore(currentSession.data)}
              size={80}
            />
            <Typography variant="body1">
              Focus Score
            </Typography>
          </Box>
          <Typography variant="body2">
            Session Duration: {formatDuration(currentSession.startTime)}
          </Typography>
          <Typography variant="body2">
            Status: {sessionState}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1">
          No active session
        </Typography>
      )}
    </Paper>
  );
};

export default SessionStats;
