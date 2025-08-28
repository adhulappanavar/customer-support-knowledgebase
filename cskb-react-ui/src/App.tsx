import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Psychology,
  CloudUpload,
  Description,
  CheckCircle,
  ConfirmationNumber,
} from '@mui/icons-material';
import PDFUpload from './components/PDFUpload';
import KnowledgeQuery from './components/KnowledgeQuery';
import DocumentsList from './components/DocumentsList';
import TicketingSystem from './components/TicketingSystem';
import { apiService } from './services/api';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info';
  } | null>(null);

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const checkSystemHealth = async () => {
    try {
      await apiService.checkHealth();
      setSystemStatus('healthy');
    } catch (error) {
      setSystemStatus('unhealthy');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUploadSuccess = () => {
    setNotification({
      message: 'Document uploaded successfully! You can now query it.',
      severity: 'success',
    });
    // Switch to query tab
    setTabValue(1);
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Psychology sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Customer Support Knowledge Base
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="inherit">
                System Status:
              </Typography>
              {systemStatus === 'checking' ? (
                <Typography variant="body2" color="inherit">
                  Checking...
                </Typography>
              ) : systemStatus === 'healthy' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircle fontSize="small" />
                  <Typography variant="body2" color="inherit">
                    Healthy
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="error.light">
                  Unhealthy
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper elevation={1} sx={{ mb: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="RAG system tabs">
                <Tab
                  icon={<CloudUpload />}
                  label="Upload Documents"
                  iconPosition="start"
                />
                <Tab
                  icon={<Psychology />}
                  label="Query Knowledge"
                  iconPosition="start"
                />
                <Tab
                  icon={<Description />}
                  label="Documents"
                  iconPosition="start"
                />
                <Tab
                  icon={<ConfirmationNumber />}
                  label="Ticketing System"
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <PDFUpload onUploadSuccess={handleUploadSuccess} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <KnowledgeQuery />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <DocumentsList />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <TicketingSystem />
          </TabPanel>
        </Container>

        {notification && (
          <Snackbar
            open={true}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.severity}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
