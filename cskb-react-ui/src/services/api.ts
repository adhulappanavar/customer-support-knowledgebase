import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface Document {
  id: string;
  name: string;
  category?: string;
  file_path: string;
  uploaded_at: string;
  file_size: number;
  status: string;
}

export interface QueryRequest {
  query: string;
  user_id?: string;
  max_results?: number;
}

export interface QueryResponse {
  query: string;
  response: string;
  user_id: string;
  sources: Array<{
    id: string;
    name: string;
    content: string;
  }>;
  timestamp: string | null;
  rag_used: boolean;
  documents_retrieved: number;
}

export interface IngestResponse {
  message: string;
  document_id: string;
  status: string;
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  // Health check
  async checkHealth(): Promise<{ status: string; service: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Get all documents
  async getDocuments(): Promise<Document[]> {
    const response = await this.api.get('/documents');
    return response.data.documents;
  }

  // Query the knowledge base
  async queryKnowledge(request: QueryRequest): Promise<QueryResponse> {
    const response = await this.api.post('/query', request);
    return response.data;
  }

  // Ingest a PDF document
  async ingestPDF(file: File, documentName: string, category?: string): Promise<IngestResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_name', documentName);
    if (category) {
      formData.append('category', category);
    }

    const response = await this.api.post('/ingest/pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
