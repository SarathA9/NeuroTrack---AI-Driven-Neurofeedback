import React from 'react';
import { 
  Paper, Typography, Table, TableBody, TableCell, 
  TableHead, TableRow 
} from '@mui/material';

const RecentSessions = ({ sessions }) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Recent Sessions
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
              <TableCell>{session.type}</TableCell>
              <TableCell>{formatDuration(session.duration)}</TableCell>
              <TableCell>{session.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

// Utility function for formatting duration
const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default RecentSessions;