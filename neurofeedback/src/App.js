import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { SessionProvider } from '../src/contexts/SessionContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import Layout from '../src/components/Layout';
import Dashboard from '../src/components/Dashboard';
import Training from '../src/pages/Training';
// import Progress from '../src/pages/Progress';
// import Settings from '../src/pages/Settings';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff80ab',
      dark: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <SessionProvider>
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/training" element={<Training />} />
                {/* <Route path="/progress" element={<Progress />} />
                <Route path="/settings" element={<Settings />} /> */}
              </Routes>
            </Layout>
          </BrowserRouter>
        </SessionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;