import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { CloudUpload, Description } from '@mui/icons-material';
import { apiService } from '../services/api';

interface PDFUploadProps {
  onUploadSuccess: () => void;
}

const PDFUpload: React.FC<PDFUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [category, setCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setDocumentName(selectedFile.name.replace('.pdf', ''));
        setError(null);
      } else {
        setError('Please select a valid PDF file');
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file || !documentName.trim()) {
      setError('Please select a file and enter a document name');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.ingestPDF(file, documentName, category || undefined);
      setSuccess(`Document "${response.document_id}" uploaded successfully!`);
      setFile(null);
      setDocumentName('');
      setCategory('');
      onUploadSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setDocumentName('');
    setCategory('');
    setError(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upload PDF Document
      </Typography>
      
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          borderRadius: 2,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          mb: 2,
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" color="primary" gutterBottom>
          {isDragActive ? 'Drop the PDF here' : 'Drag & drop a PDF file here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to select a file
        </Typography>
      </Box>

      {file && (
        <Box sx={{ mb: 2 }}>
          <Chip
            icon={<Description />}
            label={file.name}
            onDelete={removeFile}
            color="primary"
            variant="outlined"
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Document Name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          placeholder="Enter document name"
          fullWidth
          required
        />
        <TextField
          label="Category (Optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Policy, Manual, FAQ"
          fullWidth
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || !documentName.trim() || isUploading}
        startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUpload />}
        fullWidth
      >
        {isUploading ? 'Uploading...' : 'Upload Document'}
      </Button>
    </Paper>
  );
};

export default PDFUpload;
