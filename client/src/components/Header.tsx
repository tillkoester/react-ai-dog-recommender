import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900">
                Personal Brand Quiz
              </h1>
              <p className="text-xs text-gray-500">
                AI-Powered Brand Positioning
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.startsWith('/quiz')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Take Quiz
            </Link>
            <a
              href="#features"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              How It Works
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/quiz"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
            >
              Start Your Quiz
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive('/')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/quiz"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                location.pathname.startsWith('/quiz')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Take Quiz
            </Link>
            <a
              href="#features"
              className="block text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="block text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <div className="pt-2 border-t border-gray-200">
              <Link
                to="/quiz"
                className="block w-full text-center bg-primary-600 text-white px-4 py-2 rounded-lg text-base font-medium hover:bg-primary-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Your Quiz
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};