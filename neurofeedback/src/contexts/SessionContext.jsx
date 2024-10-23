// src/contexts/SessionContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [currentSession, setCurrentSession] = useState(null);
  const [brainwaveData, setBrainwaveData] = useState([]);
  const [sessionState, setSessionState] = useState('idle'); // idle, recording, paused, completed

  const startSession = useCallback(() => {
    setSessionState('recording');
    setCurrentSession({
      id: Date.now(),
      startTime: new Date(),
      type: 'focus', // default type
      data: [],
    });
  }, []);

  const pauseSession = useCallback(() => {
    setSessionState('paused');
  }, []);

  const endSession = useCallback(() => {
    setSessionState('completed');
    // Here we'll later add logic to save session data
  }, []);

  const updateBrainwaveData = useCallback((newData) => {
    setBrainwaveData(prev => [...prev, newData]);
    if (currentSession) {
      setCurrentSession(prev => ({
        ...prev,
        data: [...prev.data, newData],
      }));
    }
  }, [currentSession]);

  return (
    <SessionContext.Provider
      value={{
        currentSession,
        brainwaveData,
        sessionState,
        startSession,
        pauseSession,
        endSession,
        updateBrainwaveData,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
