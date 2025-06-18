import React from 'react';
import { Shield, Settings, BarChart3, FileText, Users, Brain } from 'lucide-react';

export const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your Personal Brand Quiz application
          </p>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="max-w-md mx-auto">
            <Shield className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Admin Panel Coming Soon
            </h2>
            <p className="text-gray-600 mb-8">
              The comprehensive admin panel with content management, analytics, 
              and user management features is currently under development.
            </p>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-sm">
              Track quiz completion rates, user demographics, and AI performance metrics.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Content Management
            </h3>
            <p className="text-gray-600 text-sm">
              Edit quiz questions, AI prompts, and UI text with version control.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Configuration
            </h3>
            <p className="text-gray-600 text-sm">
              Manage AI prompts, model settings, and prompt performance optimization.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              User Management
            </h3>
            <p className="text-gray-600 text-sm">
              Manage admin users, permissions, and access control.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              System Settings
            </h3>
            <p className="text-gray-600 text-sm">
              Configure API settings, rate limits, and system preferences.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rating Analytics
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor user ratings, feedback, and content performance.
            </p>
          </div>
        </div>

        {/* Contact for Early Access */}
        <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-primary-900 mb-2">
              Need Admin Access?
            </h3>
            <p className="text-primary-700 mb-4">
              Contact us for early access to the admin panel or to discuss custom requirements.
            </p>
            <button className="btn btn-primary">
              Request Admin Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};