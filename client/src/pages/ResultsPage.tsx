import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuiz } from '../contexts/QuizContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { AlertCircle, Download, Share2, Star, CheckCircle2 } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { sessionId } = useParams();
  const { 
    session, 
    aiResults, 
    isLoading, 
    error, 
    loadSession,
    generateFinalResults
  } = useQuiz();

  useEffect(() => {
    if (sessionId && (!session || session.sessionId !== sessionId)) {
      loadSession(sessionId);
    }
  }, [sessionId, session, loadSession]);

  useEffect(() => {
    if (session && !session.isCompleted && session.currentStep >= 2) {
      // Auto-generate final results if not already completed
      generateFinalResults().catch(console.error);
    }
  }, [session, generateFinalResults]);

  if (!sessionId) {
    return <Navigate to="/quiz" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p className="text-gray-600">Loading your brand strategy results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Unable to Load Results
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

  if (!session || !session.isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Quiz Not Completed
          </h2>
          <p className="text-gray-600 mb-4">
            Please complete all quiz steps to view your results.
          </p>
          <a
            href={`/quiz/${sessionId}`}
            className="btn btn-primary"
          >
            Continue Quiz
          </a>
        </div>
      </div>
    );
  }

  const finalResults = aiResults?.finalResults;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Your Personal Brand Strategy
          </h1>
          <p className="text-gray-600">
            AI-generated comprehensive brand positioning and implementation roadmap
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          <button className="btn btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button className="btn btn-secondary">
            <Share2 className="w-4 h-4 mr-2" />
            Share Results
          </button>
          <button className="btn btn-primary">
            <Star className="w-4 h-4 mr-2" />
            Rate Results
          </button>
        </div>

        {finalResults ? (
          <div className="space-y-8">
            {/* Brand Position Statement */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🎯 Your Unique Brand Position
              </h2>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <p className="text-primary-900 font-medium text-lg">
                  {finalResults.brandPosition}
                </p>
              </div>
            </div>

            {/* Core Strengths Matrix */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                💪 Core Strengths Matrix
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.strengthsMatrix}
                </pre>
              </div>
            </div>

            {/* Hero Slogans */}
            {finalResults.heroSlogans && finalResults.heroSlogans.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ✨ Hero Slogans & Taglines
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {finalResults.heroSlogans.map((slogan, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-900 font-medium">
                        "{slogan}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Differentiators */}
            {finalResults.keyDifferentiators && finalResults.keyDifferentiators.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  🔥 Key Differentiators
                </h2>
                <div className="space-y-3">
                  {finalResults.keyDifferentiators.map((differentiator, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                        <span className="text-green-600 text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{differentiator}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Voice & Messaging */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🗣️ Brand Voice & Messaging
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.brandVoice}
                </pre>
              </div>
            </div>

            {/* Ideal Client Avatar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                👥 Ideal Client Avatar
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.idealClientAvatar}
                </pre>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📊 Regional Market Analysis
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.marketAnalysis}
                </pre>
              </div>
            </div>

            {/* 90-Day Launch Roadmap */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🚀 90-Day Launch Roadmap
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.launchRoadmap}
                </pre>
              </div>
            </div>

            {/* Premium Services */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                💎 Premium Service Opportunities
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.premiumServices}
                </pre>
              </div>
            </div>

            {/* Success Indicators */}
            {finalResults.successIndicators && finalResults.successIndicators.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  📈 Success Indicators & KPIs
                </h2>
                <div className="space-y-2">
                  {finalResults.successIndicators.map((indicator, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{indicator}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Business Model */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🏢 Regional Business Model Recommendations
              </h2>
              <div className="prose text-gray-700">
                <pre className="whitespace-pre-wrap font-sans">
                  {finalResults.businessModel}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <LoadingSpinner className="mx-auto mb-4" />
            <p className="text-gray-600">
              Generating your comprehensive brand strategy...
            </p>
          </div>
        )}

        {/* Next Steps CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Implement Your Strategy?
          </h2>
          <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
            Your personalized brand positioning strategy is complete. Take the next step 
            with our premium implementation services and expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-white text-primary-600 hover:bg-gray-100">
              Book Strategy Session
            </button>
            <button className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Download Action Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};