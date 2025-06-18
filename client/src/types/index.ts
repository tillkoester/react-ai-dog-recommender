// Quiz Types
export interface QuizSession {
  sessionId: string;
  currentStep: number;
  completionPercentage: number;
  isCompleted: boolean;
  completedSteps: Array<{
    step: number;
    completedAt: string;
  }>;
  hasStep1Data: boolean;
  hasStep2Data: boolean;
  hasResults: boolean;
}

// Step 1 Data
export interface Step1Data {
  // Section 1: Current Situation
  jobStatus?: string;
  industryPreference?: string;
  experienceLevel?: string;
  educationBackground?: string;
  geographicLocation?: string;
  cityMarketSize?: string;
  timeAvailability?: string;
  budgetRange?: string;
  techComfort?: string;
  supportSystem?: string;
  
  // Section 2: Skills & Strengths
  coreSkills?: string[];
  uniqueExperiences?: string;
  passionsInterests?: string;
  
  // Section 3: Goals & Vision
  focusArea?: string;
  customFocus?: string;
  primaryGoals?: string[];
  timeline?: string;
  biggestConcerns?: string;
}

// Step 2 Data
export interface Step2Data {
  problemsToSolve: string;
  idealTargetGroup: string;
  industryTrendsImpact: string;
  uniqueAdvantages: string;
  marketChallenges: string;
  regionalConsiderations?: string;
  competitiveLandscape?: string;
}

// AI Results
export interface AIResult {
  title: string;
  content: string;
  generatedAt: string;
  prompt: string;
  model: string;
}

export interface FinalResults {
  brandPosition: string;
  strengthsMatrix: string;
  heroSlogans: string[];
  keyDifferentiators: string[];
  brandVoice: string;
  idealClientAvatar: string;
  marketAnalysis: string;
  competitiveMapping: string;
  launchRoadmap: string;
  premiumServices: string;
  successIndicators: string[];
  businessModel: string;
  generatedAt: string;
}

// Rating Types
export interface CategoryRatings {
  accuracy?: number;
  relevance?: number;
  actionability?: number;
  creativity?: number;
  marketFit?: number;
}

export interface RatingFeedback {
  liked?: string;
  disliked?: string;
  improvements?: string;
}

export interface RatingData {
  sessionId: string;
  ratingType: string;
  resultIndex?: number;
  starRating: number;
  categoryRatings?: CategoryRatings;
  feedback?: RatingFeedback;
  confidenceLevel?: string;
}

export interface RatingResponse {
  _id: string;
  sessionId: string;
  ratingType: string;
  resultIndex: number;
  starRating: number;
  categoryRatings?: CategoryRatings;
  feedback?: RatingFeedback;
  confidenceLevel?: string;
  userDemographics: {
    geographicLocation?: string;
    industryPreference?: string;
    experienceLevel?: string;
    cityMarketSize?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Form Options
export interface FormOption {
  value: string;
  label: string;
}

// Quiz Context
export interface QuizContextType {
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
  
  // Actions
  startQuiz: () => Promise<void>;
  saveStep1: (data: Step1Data) => Promise<void>;
  saveStep2: (data: Step2Data) => Promise<void>;
  generateFinalResults: () => Promise<void>;
  submitRating: (rating: RatingData) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
}

// API Response Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Analytics Types
export interface UserAnalytics {
  sessionId: string;
  currentStep: number;
  timeSpent: {
    step1?: number;
    step2?: number;
    total?: number;
  };
  completionRate: number;
  dropOffPoint?: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  userAgent: string;
  geographicLocation?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

// Component Props Types
export interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  className?: string;
}

export interface StepNavigationProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  disabled?: boolean;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
  options?: FormOption[];
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  validation?: any;
  className?: string;
}

export interface RatingComponentProps {
  ratingType: string;
  resultIndex?: number;
  title: string;
  content: string;
  onRatingSubmit: (rating: RatingData) => void;
  existingRating?: RatingResponse;
  className?: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface APIError extends Error {
  status?: number;
  errors?: ValidationError[];
}