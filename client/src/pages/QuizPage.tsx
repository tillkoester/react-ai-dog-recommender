import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { Step1Form } from '../components/quiz/Step1Form';
import { Step2Form } from '../components/quiz/Step2Form';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StepNavigation } from '../components/ui/StepNavigation';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AlertCircle, CheckCircle2, Brain } from 'lucide-react';

export const QuizPage: React.FC = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { 
    session, 
    isLoading, 
    error, 
    startQuiz, 
    loadSession,
    step1Data,
    step2Data,
    aiResults
  } = useQuiz();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showAIResults, setShowAIResults] = useState(false);

  // Initialize quiz session
  useEffect(() => {
    const initializeQuiz = async () => {
      if (sessionId) {
        // Load existing session
        try {
          await loadSession(sessionId);
        } catch (error) {
          console.error('Failed to load session:', error);
          // If session not found, start new quiz
          await startQuiz();
        }
      } else {
        // Start new quiz
        await startQuiz();
      }
    };

    if (!session && !isLoading) {
      initializeQuiz();
    }
  }, [sessionId, session, isLoading, loadSession, startQuiz]);

  // Update current step based on session
  useEffect(() => {
    if (session) {
      setCurrentStep(session.currentStep);
      
      // If session has a different URL than current, update URL
      if (sessionId !== session.sessionId) {
        navigate(`/quiz/${session.sessionId}`, { replace: true });
      }
    }
  }, [session, sessionId, navigate]);

  // Handle step navigation
  const handleStepChange = (step: number) => {
    if (session && step <= session.currentStep) {
      setCurrentStep(step);
      setShowAIResults(false);
    }
  };

  // Handle form completion
  const handleStep1Complete = () => {
    setShowAIResults(true);
  };

  const handleStep2Complete = () => {
    setShowAIResults(true);
  };

  const handleProceedToNextStep = () => {
    setCurrentStep(currentStep + 1);
    setShowAIResults(false);
  };

  const handleViewFinalResults = () => {
    if (session?.sessionId) {
      navigate(`/results/${session.sessionId}`);
    }
  };

  if (isLoading && !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-gray-600">Starting your personal brand quiz...</p>
        </div>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Start Quiz
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal Brand Positioning Quiz
          </h1>
          <p className="text-gray-600">
            Discover your unique brand positioning with AI-powered analysis
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={3}
            completedSteps={session.completedSteps.map(s => s.step)}
            className="mb-4"
          />
          <StepNavigation
            currentStep={currentStep}
            completedSteps={session.completedSteps.map(s => s.step)}
            onStepClick={handleStepChange}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {currentStep === 1 && (
            <div className="p-6">
              {!showAIResults ? (
                <Step1Form 
                  onComplete={handleStep1Complete}
                  initialData={step1Data}
                />
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Step 1 Complete!
                    </h2>
                    <p className="text-gray-600">
                      Your personal foundation has been analyzed. Here are your AI-generated brand profile summaries:
                    </p>
                  </div>

                  {/* AI Results */}
                  {aiResults?.step1Results && aiResults.step1Results.length > 0 ? (
                    <div className="space-y-4">
                      {aiResults.step1Results.map((result, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {result.title}
                          </h3>
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {result.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        AI analysis is processing. This may take a moment...
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={handleProceedToNextStep}
                      className="btn btn-primary btn-lg"
                      disabled={!aiResults?.step1Results?.length}
                    >
                      Continue to Market Research
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-6">
              {!showAIResults ? (
                <Step2Form 
                  onComplete={handleStep2Complete}
                  initialData={step2Data}
                />
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Market Analysis Complete!
                    </h2>
                    <p className="text-gray-600">
                      Your market intelligence has been analyzed. Here are your positioning strategies:
                    </p>
                  </div>

                  {/* AI Results */}
                  {aiResults?.step2Results && aiResults.step2Results.length > 0 ? (
                    <div className="space-y-4">
                      {aiResults.step2Results.map((result, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {result.title}
                          </h3>
                          <div className="text-gray-700 whitespace-pre-wrap">
                            {result.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">
                        AI market analysis is processing...
                      </p>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      onClick={handleViewFinalResults}
                      className="btn btn-primary btn-lg"
                      disabled={!aiResults?.step2Results?.length}
                    >
                      Generate Final Brand Strategy
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <div className="text-center">
                <LoadingSpinner className="mx-auto mb-4" />
                <p className="text-gray-900 font-medium">Processing...</p>
                <p className="text-gray-600 text-sm mt-1">
                  Our AI is analyzing your responses
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};