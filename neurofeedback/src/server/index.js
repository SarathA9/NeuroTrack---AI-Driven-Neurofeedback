// src/server/index.js
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const mysql = require('mysql2/promise');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'neurofeedback_db'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('New client connected');
  
  ws.on('message', async (data) => {
    try {
      const parsedData = JSON.parse(data);
      
      // Process EEG data through ML service
      const processedData = await processEEGData(parsedData);
      
      // Send processed data back to client
      ws.send(JSON.stringify({
        type: 'feedback',
        data: processedData
      }));
      
      // Store processed data
      await storeEEGData(parsedData, processedData);
    } catch (error) {
      console.error('Error processing EEG data:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.post('/api/sessions/start', async (req, res) => {
  try {
    const { userId, sessionType, settings } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO sessions (user_id, type, settings, start_time) VALUES (?, ?, ?, NOW())',
      [userId, sessionType, JSON.stringify(settings)]
    );
    res.json({ sessionId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
});

app.post('/api/sessions/end', async (req, res) => {
  try {
    const { sessionId, metrics } = req.body;
    await pool.execute(
      'UPDATE sessions SET end_time = NOW(), metrics = ? WHERE id = ?',
      [JSON.stringify(metrics), sessionId]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to end session' });
  }
});

app.get('/api/sessions/:userId', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY start_time DESC LIMIT 10',
      [req.params.userId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Helper functions
async function processEEGData(eegData) {
  try {
    const response = await axios.post('http://localhost:5000/process', {
      data: eegData
    });
    return response.data;
  } catch (error) {
    console.error('Error calling ML service:', error);
    throw error;
  }
}

async function storeEEGData(rawData, processedData) {
  try {
    await pool.execute(
      'INSERT INTO eeg_data (session_id, raw_data, processed_data, timestamp) VALUES (?, ?, ?, NOW())',
      [rawData.sessionId, JSON.stringify(rawData), JSON.stringify(processedData)]
    );
  } catch (error) {
    console.error('Error storing EEG data:', error);
    throw error;
  }
}

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});