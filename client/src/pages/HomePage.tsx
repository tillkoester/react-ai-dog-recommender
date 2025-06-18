import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  Zap, 
  Globe, 
  Star, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Brand Strategy
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Discover Your
                  <span className="text-primary-600 block">
                    Personal Brand
                  </span>
                  Positioning
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Get a comprehensive brand positioning strategy tailored to your unique profile, 
                  market dynamics, and regional opportunities through our AI-powered quiz.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quiz"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Your Free Quiz
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                >
                  Learn More
                </a>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  Free to use
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  No signup required
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  Instant results
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Brain className="w-6 h-6 text-primary-600" />
                      <span className="font-semibold text-gray-900">AI Analysis</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full w-4/5"></div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Analyzing your unique brand positioning...
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Personal profile analysis complete
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      Market research in progress
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mr-2 flex-shrink-0"></div>
                      Generating brand strategy...
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-40 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Brand Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI-powered quiz analyzes multiple dimensions of your personal brand to create 
              a strategic positioning that sets you apart in your market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personal Foundation Analysis
              </h3>
              <p className="text-gray-600">
                Deep dive into your skills, experience, goals, and unique strengths to identify 
                your core brand foundation.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Regional Market Intelligence
              </h3>
              <p className="text-gray-600">
                Comprehensive analysis of your local market, cultural factors, and regional 
                business opportunities.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered Strategy Generation
              </h3>
              <p className="text-gray-600">
                Advanced AI analyzes your profile and market data to generate multiple strategic 
                positioning options.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Actionable Implementation Plan
              </h3>
              <p className="text-gray-600">
                Get a detailed 90-day roadmap with specific steps to implement your brand 
                positioning strategy.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Competitive Analysis
              </h3>
              <p className="text-gray-600">
                Understand your competitive landscape and identify unique positioning 
                opportunities in your market.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Target Audience Insights
              </h3>
              <p className="text-gray-600">
                Detailed analysis of your ideal client avatar with regional demographics 
                and behavioral insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive 3-step process guides you through strategic questions to 
              generate your personalized brand positioning strategy.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full text-primary-600 font-bold text-lg">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Personal Foundation Assessment
                </h3>
                <p className="text-lg text-gray-600">
                  Complete a comprehensive assessment covering your current situation, skills & 
                  strengths, and goals & vision. Our smart questioning adapts to your responses 
                  for deeper insights.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Current professional situation analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Core skills and unique experiences evaluation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Goals, timeline, and concern identification
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Step 1: Personal Foundation</span>
                        <span className="text-sm text-primary-600">33% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full w-1/3"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-1">Industry Preference</div>
                          <div className="text-sm text-gray-600">Marketing & Advertising</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-1">Core Skills</div>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">Communication</span>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">Strategy</span>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs">Innovation</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 font-bold text-lg">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Market Intelligence & Research
                </h3>
                <p className="text-lg text-gray-600">
                  Provide detailed insights about your target market, competitive landscape, and 
                  regional considerations. Our AI conducts deep market analysis based on your responses.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Target audience and problem definition
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Industry trends and competitive analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Regional market dynamics assessment
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Step 2: Market Research</span>
                        <span className="text-sm text-green-600">67% Complete</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full w-2/3"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-1">AI Market Analysis</div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                            Analyzing competitive landscape...
                          </div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900 mb-1">Regional Insights</div>
                          <div className="text-sm text-gray-600">North America - High opportunity market</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-600 font-bold text-lg">
                  3
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Personalized Strategy Results
                </h3>
                <p className="text-lg text-gray-600">
                  Receive your comprehensive brand positioning strategy with actionable insights, 
                  implementation roadmap, and premium service recommendations tailored to your profile.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Unique brand positioning statement
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    90-day implementation roadmap
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    Regional business model recommendations
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">Your Brand Strategy</span>
                        <span className="text-sm text-purple-600">Complete! ✨</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full w-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="text-sm font-medium text-purple-900 mb-1">Your Brand Position</div>
                          <div className="text-sm text-purple-700">"The Strategic Marketing Innovator for Growing Businesses"</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 bg-green-50 rounded text-xs">
                            <div className="font-medium text-green-900">Market Fit</div>
                            <div className="text-green-700">Excellent</div>
                          </div>
                          <div className="p-2 bg-blue-50 rounded text-xs">
                            <div className="font-medium text-blue-900">Opportunity</div>
                            <div className="text-blue-700">High</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Discover Your Brand Position?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have discovered their unique brand positioning 
            and accelerated their career growth.
          </p>
          <Link
            to="/quiz"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Start Your Free Quiz Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <div className="mt-6 text-primary-200 text-sm">
            Takes 10-15 minutes • No signup required • Instant results
          </div>
        </div>
      </section>
    </div>
  );
};