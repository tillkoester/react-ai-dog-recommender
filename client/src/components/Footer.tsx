import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, Shield, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Brand Quiz
                </h3>
                <p className="text-sm text-gray-500">
                  AI-Powered Brand Positioning
                </p>
              </div>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Discover your unique brand positioning with our comprehensive quiz that combines 
              personal insights, market research, and AI-powered analysis to create your 
              personalized brand strategy.
            </p>
            <div className="mt-6 flex items-center space-x-2">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                hello@personalbrandquiz.com
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/quiz" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Take Quiz
                </Link>
              </li>
              <li>
                <a 
                  href="#features" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a 
                  href="#how-it-works" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Legal
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="/privacy" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="/terms" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a 
                  href="/cookies" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a 
                  href="/gdpr" 
                  className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  GDPR Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} Personal Brand Quiz. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-6">
              <span className="text-xs text-gray-400">
                Powered by AI for personalized insights
              </span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};