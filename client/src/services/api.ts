import axios, { AxiosResponse } from 'axios';
import type { 
  APIResponse, 
  QuizSession, 
  Step1Data, 
  Step2Data, 
  AIResult, 
  FinalResults, 
  RatingData, 
  RatingResponse 
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds timeout for AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add analytics data
api.interceptors.request.use((config) => {
  // Add user analytics data to requests
  const userAgent = navigator.userAgent;
  const referrer = document.referrer;
  const utmParams = new URLSearchParams(window.location.search);
  
  // Add analytics headers
  config.headers['X-User-Agent'] = userAgent;
  config.headers['X-Referrer'] = referrer;
  
  if (utmParams.get('utm_source')) {
    config.headers['X-UTM-Source'] = utmParams.get('utm_source');
  }
  if (utmParams.get('utm_medium')) {
    config.headers['X-UTM-Medium'] = utmParams.get('utm_medium');
  }
  if (utmParams.get('utm_campaign')) {
    config.headers['X-UTM-Campaign'] = utmParams.get('utm_campaign');
  }
  
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection and try again.');
    }
    
    throw error;
  }
);

// Quiz API endpoints
export const quizAPI = {
  // Start new quiz session
  startQuiz: async (): Promise<QuizSession> => {
    const response: AxiosResponse<APIResponse<QuizSession>> = await api.post('/quiz/start');
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to start quiz');
    }
    
    return response.data.data;
  },

  // Get quiz session status
  getSession: async (sessionId: string): Promise<QuizSession> => {
    const response: AxiosResponse<APIResponse<QuizSession>> = await api.get(`/quiz/session/${sessionId}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Session not found');
    }
    
    return response.data.data;
  },

  // Submit Step 1 data
  submitStep1: async (data: Step1Data & { sessionId: string }): Promise<{
    sessionId: string;
    currentStep: number;
    completionPercentage: number;
    aiResults: AIResult[];
  }> => {
    const response: AxiosResponse<APIResponse<any>> = await api.post('/quiz/step1', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to submit Step 1');
    }
    
    return response.data.data;
  },

  // Submit Step 2 data
  submitStep2: async (data: Step2Data & { sessionId: string }): Promise<{
    sessionId: string;
    currentStep: number;
    completionPercentage: number;
    aiResults: AIResult[];
  }> => {
    const response: AxiosResponse<APIResponse<any>> = await api.post('/quiz/step2', data);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to submit Step 2');
    }
    
    return response.data.data;
  },

  // Generate final results
  generateFinalResults: async (sessionId: string): Promise<{
    sessionId: string;
    isCompleted: boolean;
    completionPercentage: number;
    finalResults: FinalResults;
  }> => {
    const response: AxiosResponse<APIResponse<any>> = await api.post('/quiz/generate-final-results', {
      sessionId
    });
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to generate final results');
    }
    
    return response.data.data;
  },

  // Get quiz results
  getResults: async (sessionId: string): Promise<{
    sessionId: string;
    isCompleted: boolean;
    completionPercentage: number;
    step1Results: AIResult[];
    step2Results: AIResult[];
    finalResults: FinalResults | null;
    completedAt?: string;
  }> => {
    const response: AxiosResponse<APIResponse<any>> = await api.get(`/quiz/results/${sessionId}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get results');
    }
    
    return response.data.data;
  },

  // Get quiz questions for a step
  getQuestions: async (step: number): Promise<any> => {
    const response: AxiosResponse<APIResponse<any>> = await api.get(`/quiz/questions/${step}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get questions');
    }
    
    return response.data.data;
  },
};

// Rating API endpoints
export const ratingAPI = {
  // Submit or update rating
  submitRating: async (rating: RatingData): Promise<{
    ratingId: string;
    isUpdate: boolean;
  }> => {
    const response: AxiosResponse<APIResponse<any>> = await api.post('/ratings', rating);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to submit rating');
    }
    
    return response.data.data;
  },

  // Get ratings for a session
  getSessionRatings: async (sessionId: string): Promise<RatingResponse[]> => {
    const response: AxiosResponse<APIResponse<RatingResponse[]>> = await api.get(`/ratings/session/${sessionId}`);
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get ratings');
    }
    
    return response.data.data;
  },

  // Get average ratings for a type
  getAverageRatings: async (ratingType: string, filters?: {
    geographicLocation?: string;
    industryPreference?: string;
    experienceLevel?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    _id: string;
    avgStarRating: number;
    avgAccuracy: number;
    avgRelevance: number;
    avgActionability: number;
    avgCreativity: number;
    avgMarketFit: number;
    totalRatings: number;
    ratingDistribution: Record<string, number>;
  }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response: AxiosResponse<APIResponse<any>> = await api.get(
      `/ratings/average/${ratingType}?${params.toString()}`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get average ratings');
    }
    
    return response.data.data;
  },

  // Get rating analytics
  getRatingAnalytics: async (filters?: {
    groupBy?: string;
    startDate?: string;
    endDate?: string;
    geographicLocation?: string;
    industryPreference?: string;
  }): Promise<{
    analytics: any[];
    overallStats: {
      totalRatings: number;
      avgStarRating: number;
      uniqueSessionCount: number;
      uniqueRatingTypeCount: number;
    };
    groupBy: string;
    filters: any;
  }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const response: AxiosResponse<APIResponse<any>> = await api.get(
      `/ratings/analytics?${params.toString()}`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get analytics');
    }
    
    return response.data.data;
  },

  // Get recent feedback
  getRecentFeedback: async (filters?: {
    limit?: number;
    ratingType?: string;
    minRating?: number;
    maxRating?: number;
  }): Promise<RatingResponse[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }
    
    const response: AxiosResponse<APIResponse<RatingResponse[]>> = await api.get(
      `/ratings/feedback/recent?${params.toString()}`
    );
    
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to get feedback');
    }
    
    return response.data.data;
  },
};

// Health check
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.data.success;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Utility function to handle API errors
export const handleAPIError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors?.length > 0) {
    return error.response.data.errors.map((e: any) => e.message).join(', ');
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

export default api;