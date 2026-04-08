import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface AIAnalysis {
  problem: string;
  customer: string;
  market: string;
  competitor: string[];
  tech_stack: string[];
  risk_level: string;
  profitability_score: number;
  justification: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  extracted_text?: string;
  ai_report?: AIAnalysis;
  created_at: string;
}

export const createIdea = async (formData: FormData): Promise<Idea> => {
  const response = await api.post('/ideas/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getIdeas = async (): Promise<Idea[]> => {
  const response = await api.get('/ideas/');
  return response.data;
};

export const getIdeaById = async (id: string): Promise<Idea> => {
  const response = await api.get(`/ideas/${id}`);
  return response.data;
};

export default api;
