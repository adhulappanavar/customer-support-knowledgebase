import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  SmartToy as AiIcon
} from '@mui/icons-material';
import { apiService } from '../services/api';

interface Ticket {
  id: number;
  ticket_number: string;
  title: string;
  description: string;
  user_id: number;
  user_username: string;
  user_full_name: string;
  category_id: number;
  category_name: string;
  priority_id: number;
  priority_name: string;
  priority_color: string;
  status_id: number;
  status_name: string;
  status_color: string;
  assigned_to: number | null;
  assigned_username: string | null;
  assigned_full_name: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  due_date: string;
  tags: string;
}

interface TicketCreate {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  assigned_to: string;
}

interface Comment {
  id: number;
  ticket_id: number;
  user: string;
  comment: string;
  created_at: string;
}

interface AiResolution {
  answer: string;
  sources: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

const TicketingSystem: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [aiResolution, setAiResolution] = useState<AiResolution | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<TicketCreate>({
    title: '',
    description: '',
    category: '',
    priority: '',
    status: '',
    assigned_to: ''
  });

  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    priority: '',
    status: '',
    assigned_to: ''
  });

  const fetchTickets = useCallback(async () => {
    console.log('🔍 Fetching tickets...');
    try {
      const response = await fetch('http://localhost:8001/tickets');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('📋 Tickets fetched successfully:', data);
      console.log('🔍 Sample ticket data structure:', data.length > 0 ? data[0] : 'No tickets');
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
    }
  }, []);

  const filterTickets = useCallback(() => {
    console.log('🔍 Filtering tickets with filters:', filters);
    console.log('🔍 Available tickets for filtering:', tickets);
    let filtered = tickets;
    
    if (filters.category) {
      filtered = filtered.filter(ticket => ticket.category_name === filters.category);
    }
    if (filters.priority) {
      filtered = filtered.filter(ticket => ticket.priority_name === filters.priority);
    }
    if (filters.status) {
      filtered = filtered.filter(ticket => ticket.status_name === filters.status);
    }
    if (filters.assigned_to) {
      filtered = filtered.filter(ticket => ticket.assigned_full_name === filters.assigned_to);
    }
    
    console.log('✅ Filtered tickets:', filtered);
    setFilteredTickets(filtered);
  }, [tickets, filters]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    filterTickets();
  }, [filterTickets]);

  useEffect(() => {
    console.log('🎯 Current filtered tickets for rendering:', filteredTickets);
  }, [filteredTickets]);

  const createTicket = async () => {
    console.log('➕ Creating ticket with data:', formData);
    try {
      const response = await fetch('http://localhost:8001/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTicket = await response.json();
      console.log('✅ Ticket created successfully:', newTicket);
      
      setTickets(prev => [...prev, newTicket]);
      setOpenDialog(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: '',
        status: '',
        assigned_to: ''
      });
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
    }
  };

  const fetchTicketComments = async (ticketId: number) => {
    console.log('💬 Fetching comments for ticket:', ticketId);
    try {
      const response = await fetch(`http://localhost:8001/tickets/${ticketId}/comments`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('💬 Comments fetched successfully:', data);
      setComments(data);
    } catch (error) {
      console.error('❌ Error fetching comments:', error);
    }
  };

  const handleViewTicket = (ticket: Ticket) => {
    console.log('👁️ Viewing ticket:', ticket);
    setSelectedTicket(ticket);
    setViewDialog(true);
    fetchTicketComments(ticket.id);
    setAiResolution(null);
    setAiError(null);
  };

  const handleCreateTicket = () => {
    console.log('➕ Opening create ticket dialog');
    setOpenDialog(true);
  };

  const handleQuickAiResolution = async (ticket: Ticket) => {
    console.log('🤖 Starting quick AI resolution for ticket:', ticket);
    setAiLoading(true);
    setAiError(null);
    setAiResolution(null);

    try {
      // Prepare the query for the RAG API
      const query = `Customer support ticket: ${ticket.title}. Description: ${ticket.description}. Category: ${ticket.category_name}. Priority: ${ticket.priority_name}. Please provide a detailed resolution for this customer support issue.`;
      
      console.log('🔍 Sending query to RAG API:', query);
      
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('📡 RAG API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ RAG API error response:', errorText);
        throw new Error(`RAG API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ RAG API response data:', data);

      if (data.response) {
        const resolution: AiResolution = {
          answer: data.response,
          sources: data.sources || []
        };
        console.log('🤖 AI resolution generated:', resolution);
        setAiResolution(resolution);
        // Open the view dialog to show the resolution
        setSelectedTicket(ticket);
        setViewDialog(true);
        fetchTicketComments(ticket.id);
      } else {
        console.error('❌ No response in RAG API response');
        throw new Error('No response received from RAG API');
      }
    } catch (error) {
      console.error('❌ Error during AI resolution:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAiError(errorMessage);
      // Still open the dialog to show the error
      setSelectedTicket(ticket);
      setViewDialog(true);
      fetchTicketComments(ticket.id);
    } finally {
      console.log('🏁 Quick AI resolution process completed');
      setAiLoading(false);
    }
  };

  const handleAiResolution = async () => {
    if (!selectedTicket) {
      console.error('❌ No ticket selected for AI resolution');
      return;
    }

    console.log('🤖 Starting AI resolution for ticket:', selectedTicket);
    setAiLoading(true);
    setAiError(null);
    setAiResolution(null);

    try {
      // Prepare the query for the RAG API
      const query = `Customer support ticket: ${selectedTicket.title}. Description: ${selectedTicket.description}. Category: ${selectedTicket.category_name}. Priority: ${selectedTicket.priority_name}. Please provide a detailed resolution for this customer support issue.`;
      
      console.log('🔍 Sending query to RAG API:', query);
      
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('📡 RAG API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ RAG API error response:', errorText);
        throw new Error(`RAG API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ RAG API response data:', data);

      if (data.response) {
        const resolution: AiResolution = {
          answer: data.response,
          sources: data.sources || []
        };
        console.log('🤖 AI resolution generated:', resolution);
        setAiResolution(resolution);
      } else {
        console.error('❌ No response in RAG API response');
        throw new Error('No response received from RAG API');
      }
    } catch (error) {
      console.error('❌ Error during AI resolution:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setAiError(errorMessage);
    } finally {
      console.log('🏁 AI resolution process completed');
      setAiLoading(false);
    }
  };

  const getPriorityColor = (priority: string | undefined | null) => {
    if (!priority) return 'default';
    switch (priority.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string | undefined | null) => {
    if (!status) return 'default';
    switch (status.toLowerCase()) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Ticketing System
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateTicket}
        >
          Create Ticket
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filters.category}
              label="Category"
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Billing">Billing</MenuItem>
              <MenuItem value="General">General</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filters.priority}
              label="Priority"
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={filters.assigned_to}
              label="Assigned To"
              onChange={(e) => setFilters(prev => ({ ...prev, assigned_to: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="John Doe">John Doe</MenuItem>
              <MenuItem value="Jane Smith">Jane Smith</MenuItem>
              <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Tickets Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.title || 'No Title'}</TableCell>
                <TableCell>{ticket.category_name || 'No Category'}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority_name || 'Unknown'}
                    color={getPriorityColor(ticket.priority_name) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status_name || 'Unknown'}
                    color={getStatusColor(ticket.status_name) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ticket.assigned_full_name || 'Unassigned'}</TableCell>
                <TableCell>{ticket.created_at ? formatDate(ticket.created_at) : 'Unknown'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleViewTicket(ticket)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleQuickAiResolution(ticket)}
                      title="AI Resolution"
                      size="small"
                      disabled={aiLoading}
                    >
                      {aiLoading ? <CircularProgress size={16} /> : <AiIcon />}
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Ticket Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Ticket</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mt: 1 }}>
            <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Billing">Billing</MenuItem>
                <MenuItem value="General">General</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={formData.assigned_to}
                label="Assigned To"
                onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
              >
                <MenuItem value="John Doe">John Doe</MenuItem>
                <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={createTicket} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Ticket Details
          {selectedTicket && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Typography variant="h6">#{selectedTicket.id} - {selectedTicket.title}</Typography>
              <Button
                variant="outlined"
                startIcon={<AiIcon />}
                onClick={handleAiResolution}
                disabled={aiLoading}
              >
                {aiLoading ? 'Generating...' : 'AI Resolution'}
              </Button>
            </Box>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Ticket Information</Typography>
                                      <Typography><strong>Category:</strong> {selectedTicket.category_name}</Typography>
                    <Typography><strong>Priority:</strong> {selectedTicket.priority_name}</Typography>
                    <Typography><strong>Status:</strong> {selectedTicket.status_name}</Typography>
                    <Typography><strong>Assigned To:</strong> {selectedTicket.assigned_full_name || 'Unassigned'}</Typography>
                  <Typography><strong>Created:</strong> {formatDate(selectedTicket.created_at)}</Typography>
                  <Typography><strong>Updated:</strong> {formatDate(selectedTicket.updated_at)}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Description</Typography>
                  <Typography>{selectedTicket.description}</Typography>
                </CardContent>
              </Card>
              
              {/* AI Resolution Section */}
              <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      AI Resolution
                      {aiLoading && <CircularProgress size={20} sx={{ ml: 1 }} />}
                    </Typography>
                    
                    {aiError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Error: {aiError}
                      </Alert>
                    )}
                    
                    {aiResolution && (
                      <Box>
                        <Typography variant="subtitle1" gutterBottom><strong>Solution:</strong></Typography>
                        <Typography paragraph>{aiResolution.answer}</Typography>
                        
                        {aiResolution.sources && aiResolution.sources.length > 0 && (
                          <>
                            <Typography variant="subtitle1" gutterBottom><strong>Sources:</strong></Typography>
                            <ul>
                              {aiResolution.sources.map((source, index) => (
                                <li key={index}>
                                  <Typography variant="body2">
                                    <strong>{source.name}</strong>: {source.content?.substring(0, 100)}...
                                  </Typography>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </Box>
                    )}
                    
                    {!aiResolution && !aiLoading && !aiError && (
                      <Typography color="text.secondary">
                        Click "AI Resolution" to get an AI-generated solution for this ticket.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>

              {/* Comments Section */}
              <Box sx={{ gridColumn: { xs: '1 / -1' } }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Comments</Typography>
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="subtitle2" color="primary">
                            {comment.user} - {formatDate(comment.created_at)}
                          </Typography>
                          <Typography>{comment.comment}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary">No comments yet.</Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TicketingSystem;
