import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSession } from '../contexts/SessionContext';

const BrainwaveChart = () => {
  const { brainwaveData } = useSession();
  const chartRef = useRef(null);

  const formatData = (data) => {
    // Format the last 60 seconds of data
    return data.slice(-60).map((point, index) => ({
      time: index,
      alpha: point.alpha,
      beta: point.beta,
      theta: point.theta,
      delta: point.delta,
    }));
  };

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <LineChart
        ref={chartRef}
        width={800}
        height={400}
        data={formatData(brainwaveData)}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'bottom' }} />
        <YAxis label={{ value: 'Amplitude (µV)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="alpha" stroke="#8884d8" dot={false} />
        <Line type="monotone" dataKey="beta" stroke="#82ca9d" dot={false} />
        <Line type="monotone" dataKey="theta" stroke="#ffc658" dot={false} />
        <Line type="monotone" dataKey="delta" stroke="#ff7300" dot={false} />
      </LineChart>
    </Box>
  );
};

export default BrainwaveChart;
