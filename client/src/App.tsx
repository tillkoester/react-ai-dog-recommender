import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QuizProvider } from './contexts/QuizContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { QuizPage } from './pages/QuizPage';
import { ResultsPage } from './pages/ResultsPage';
import { AdminPage } from './pages/AdminPage';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/quiz/:sessionId" element={<QuizPage />} />
              <Route path="/results/:sessionId" element={<ResultsPage />} />
              <Route path="/admin/*" element={<AdminPage />} />
            </Routes>
          </Layout>
        </Router>
      </QuizProvider>
    </ErrorBoundary>
  );
}

export default App;