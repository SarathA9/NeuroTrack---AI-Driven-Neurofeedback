import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button } from '@mui/material';
import { useSession } from '../contexts/SessionContext';
import BrainwaveChart from '../components/BrainwaveChart';
import SessionStats from '../components/SessionStats';
import RecentSessions from '../components/RecentSessions';

const Dashboard = () => {
  const { startSession, currentSession, sessionState } = useSession();
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    // Fetch recent sessions data
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    // This will be implemented later with actual API calls
    const mockSessions = [
      {
        id: 1,
        date: new Date(Date.now() - 86400000),
        duration: 1800,
        type: 'focus',
        score: 85,
      },
      // Add more mock sessions...
    ];
    setRecentSessions(mockSessions);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Real-time Brainwave Activity
            </Typography>
            <BrainwaveChart />
            {!currentSession && (
              <Button
                variant="contained"
                color="primary"
                onClick={startSession}
                sx={{ mt: 2 }}
              >
                Start New Session
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <SessionStats />
        </Grid>
        <Grid item xs={12}>
          <RecentSessions sessions={recentSessions} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;