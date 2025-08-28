import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Send, ExpandMore, Psychology, Source } from '@mui/icons-material';
import { apiService, QueryRequest, QueryResponse } from '../services/api';

const KnowledgeQuery: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuery = async () => {
    if (!query.trim()) return;

    setIsQuerying(true);
    setError(null);
    setResponse(null);

    try {
      const request: QueryRequest = {
        query: query.trim(),
        user_id: 'web_user',
        max_results: 5,
      };

      const result = await apiService.queryKnowledge(request);
      setResponse(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to query knowledge base');
    } finally {
      setIsQuerying(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleQuery();
    }
  };

  const formatResponse = (text: string) => {
    return text.split('\n').map((line, index) => (
      <Typography key={index} variant="body1" sx={{ mb: 1 }}>
        {line}
      </Typography>
    ));
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Psychology color="primary" />
        Ask Your Knowledge Base
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Query your customer support knowledge base using natural language. The system will retrieve relevant documents and provide accurate answers.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Your Question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., What are the customer support hours? How do I reset my password?"
          multiline
          rows={3}
          fullWidth
          variant="outlined"
        />
        <Button
          variant="contained"
          onClick={handleQuery}
          disabled={!query.trim() || isQuerying}
          startIcon={isQuerying ? <CircularProgress size={20} /> : <Send />}
          sx={{ minWidth: 120, height: 56 }}
        >
          {isQuerying ? 'Querying...' : 'Ask'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {response && (
        <Box>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="h6" color="primary">
                  Answer
                </Typography>
                <Chip
                  label={response.rag_used ? 'RAG Generated' : 'Direct Response'}
                  color={response.rag_used ? 'success' : 'warning'}
                  size="small"
                />
                {response.rag_used && (
                  <Chip
                    label={`${response.documents_retrieved} docs retrieved`}
                    color="info"
                    size="small"
                  />
                )}
              </Box>
              
              <Box sx={{ mb: 2 }}>
                {formatResponse(response.response)}
              </Box>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                Query: "{response.query}" • User: {response.user_id}
                {response.timestamp && ` • ${new Date(response.timestamp).toLocaleString()}`}
              </Typography>
            </CardContent>
          </Card>

          {response.sources && response.sources.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Source color="primary" />
                  <Typography variant="subtitle1">
                    Source Documents ({response.sources.length})
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {response.sources.map((source, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {source.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {source.content.length > 200 
                            ? `${source.content.substring(0, 200)}...`
                            : source.content
                          }
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          ID: {source.id}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default KnowledgeQuery;
