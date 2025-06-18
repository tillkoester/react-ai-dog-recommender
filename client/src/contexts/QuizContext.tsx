import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { 
  QuizContextType, 
  QuizSession, 
  Step1Data, 
  Step2Data, 
  AIResult, 
  FinalResults, 
  RatingData, 
  RatingResponse 
} from '../types';
import { quizAPI, ratingAPI, handleAPIError } from '../services/api';

// State interface
interface QuizState {
  session: QuizSession | null;
  step1Data: Step1Data | null;
  step2Data: Step2Data | null;
  aiResults: {
    step1Results: AIResult[];
    step2Results: AIResult[];
    finalResults: FinalResults | null;
  } | null;
  ratings: RatingResponse[];
  isLoading: boolean;
  error: string | null;
}

// Action types
type QuizAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SESSION'; payload: QuizSession }
  | { type: 'SET_STEP1_DATA'; payload: Step1Data }
  | { type: 'SET_STEP2_DATA'; payload: Step2Data }
  | { type: 'SET_AI_RESULTS'; payload: { step1Results?: AIResult[]; step2Results?: AIResult[]; finalResults?: FinalResults } }
  | { type: 'SET_RATINGS'; payload: RatingResponse[] }
  | { type: 'ADD_RATING'; payload: RatingResponse }
  | { type: 'UPDATE_RATING'; payload: RatingResponse }
  | { type: 'RESET_QUIZ' };

// Initial state
const initialState: QuizState = {
  session: null,
  step1Data: null,
  step2Data: null,
  aiResults: null,
  ratings: [],
  isLoading: false,
  error: null,
};

// Reducer
const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_SESSION':
      return { ...state, session: action.payload };
    
    case 'SET_STEP1_DATA':
      return { ...state, step1Data: action.payload };
    
    case 'SET_STEP2_DATA':
      return { ...state, step2Data: action.payload };
    
    case 'SET_AI_RESULTS':
      return {
        ...state,
        aiResults: {
          step1Results: action.payload.step1Results || state.aiResults?.step1Results || [],
          step2Results: action.payload.step2Results || state.aiResults?.step2Results || [],
          finalResults: action.payload.finalResults || state.aiResults?.finalResults || null,
        },
      };
    
    case 'SET_RATINGS':
      return { ...state, ratings: action.payload };
    
    case 'ADD_RATING':
      return { ...state, ratings: [action.payload, ...state.ratings] };
    
    case 'UPDATE_RATING':
      return {
        ...state,
        ratings: state.ratings.map(rating =>
          rating._id === action.payload._id ? action.payload : rating
        ),
      };
    
    case 'RESET_QUIZ':
      return initialState;
    
    default:
      return state;
  }
};

// Context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component
interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('quizSessionId');
    if (savedSessionId) {
      loadSession(savedSessionId).catch(console.error);
    }
  }, []);

  // Save session ID to localStorage whenever session changes
  useEffect(() => {
    if (state.session?.sessionId) {
      localStorage.setItem('quizSessionId', state.session.sessionId);
    }
  }, [state.session?.sessionId]);

  // Analytics tracking
  const trackAnalytics = (event: string, data?: any) => {
    // This could be integrated with Google Analytics, Mixpanel, or other analytics services
    console.log('Analytics Event:', event, data);
    
    // Example: Send to analytics service
    if (window.gtag) {
      window.gtag('event', event, data);
    }
  };

  // Start new quiz session
  const startQuiz = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const session = await quizAPI.startQuiz();
      dispatch({ type: 'SET_SESSION', payload: session });

      trackAnalytics('quiz_started', { 
        sessionId: session.sessionId,
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      trackAnalytics('quiz_start_error', { error: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load existing session
  const loadSession = async (sessionId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const session = await quizAPI.getSession(sessionId);
      dispatch({ type: 'SET_SESSION', payload: session });

      // Load quiz results if available
      const results = await quizAPI.getResults(sessionId);
      dispatch({ type: 'SET_AI_RESULTS', payload: {
        step1Results: results.step1Results,
        step2Results: results.step2Results,
        finalResults: results.finalResults,
      }});

      // Load ratings
      const ratings = await ratingAPI.getSessionRatings(sessionId);
      dispatch({ type: 'SET_RATINGS', payload: ratings });

      trackAnalytics('session_loaded', { 
        sessionId,
        currentStep: session.currentStep,
        isCompleted: session.isCompleted 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      
      // If session not found, clear localStorage
      if (errorMessage.includes('not found')) {
        localStorage.removeItem('quizSessionId');
      }
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Save Step 1 data
  const saveStep1 = async (data: Step1Data): Promise<void> => {
    if (!state.session?.sessionId) {
      throw new Error('No active quiz session');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await quizAPI.submitStep1({
        ...data,
        sessionId: state.session.sessionId,
      });

      // Update session data
      dispatch({ type: 'SET_SESSION', payload: {
        ...state.session,
        currentStep: result.currentStep,
        completionPercentage: result.completionPercentage,
      }});

      // Store step 1 data
      dispatch({ type: 'SET_STEP1_DATA', payload: data });

      // Store AI results
      dispatch({ type: 'SET_AI_RESULTS', payload: {
        step1Results: result.aiResults,
      }});

      trackAnalytics('step1_completed', { 
        sessionId: state.session.sessionId,
        industryPreference: data.industryPreference,
        geographicLocation: data.geographicLocation 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      trackAnalytics('step1_error', { error: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Save Step 2 data
  const saveStep2 = async (data: Step2Data): Promise<void> => {
    if (!state.session?.sessionId) {
      throw new Error('No active quiz session');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await quizAPI.submitStep2({
        ...data,
        sessionId: state.session.sessionId,
      });

      // Update session data
      dispatch({ type: 'SET_SESSION', payload: {
        ...state.session,
        currentStep: result.currentStep,
        completionPercentage: result.completionPercentage,
      }});

      // Store step 2 data
      dispatch({ type: 'SET_STEP2_DATA', payload: data });

      // Store AI results
      dispatch({ type: 'SET_AI_RESULTS', payload: {
        step2Results: result.aiResults,
      }});

      trackAnalytics('step2_completed', { 
        sessionId: state.session.sessionId,
        problemsToSolve: data.problemsToSolve.substring(0, 100) + '...' 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      trackAnalytics('step2_error', { error: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Generate final results
  const generateFinalResults = async (): Promise<void> => {
    if (!state.session?.sessionId) {
      throw new Error('No active quiz session');
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await quizAPI.generateFinalResults(state.session.sessionId);

      // Update session data
      dispatch({ type: 'SET_SESSION', payload: {
        ...state.session,
        isCompleted: result.isCompleted,
        completionPercentage: result.completionPercentage,
      }});

      // Store final results
      dispatch({ type: 'SET_AI_RESULTS', payload: {
        finalResults: result.finalResults,
      }});

      trackAnalytics('quiz_completed', { 
        sessionId: state.session.sessionId,
        completedAt: new Date().toISOString() 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      trackAnalytics('final_results_error', { error: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Submit rating
  const submitRating = async (rating: RatingData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await ratingAPI.submitRating(rating);

      // Reload ratings to get the updated data
      if (state.session?.sessionId) {
        const ratings = await ratingAPI.getSessionRatings(state.session.sessionId);
        dispatch({ type: 'SET_RATINGS', payload: ratings });
      }

      trackAnalytics('rating_submitted', { 
        ratingType: rating.ratingType,
        starRating: rating.starRating,
        isUpdate: result.isUpdate 
      });
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      trackAnalytics('rating_error', { error: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: QuizContextType = {
    session: state.session,
    step1Data: state.step1Data,
    step2Data: state.step2Data,
    aiResults: state.aiResults,
    ratings: state.ratings,
    isLoading: state.isLoading,
    error: state.error,
    startQuiz,
    saveStep1,
    saveStep2,
    generateFinalResults,
    submitRating,
    loadSession,
  };

  return (
    <QuizContext.Provider value={contextValue}>
      {children}
    </QuizContext.Provider>
  );
};

// Hook to use the quiz context
export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export default QuizContext;