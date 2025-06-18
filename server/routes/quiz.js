const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const QuizResponse = require('../models/QuizResponse');
const Content = require('../models/Content');
const AIService = require('../services/AIService');

// Validation schemas
const step1Schema = Joi.object({
  sessionId: Joi.string().required(),
  
  // Section 1: Current Situation
  jobStatus: Joi.string().valid(
    'Student',
    'Full-time Employee',
    'Part-time Employee',
    'Freelancer',
    'Entrepreneur with Existing Business',
    'Between Jobs',
    'Retired'
  ),
  industryPreference: Joi.string().valid(
    'Coaching & Consulting',
    'Marketing & Advertising',
    'Technology & IT',
    'Health & Wellness',
    'Education & Training',
    'E-commerce & Retail',
    'Finance & Investment',
    'Real Estate',
    'Design & Creative',
    'Content Creation',
    'Project Management',
    'Human Resources',
    'Sales',
    'Hospitality',
    'Trades & Crafts',
    'Other',
    'Let AI Decide ✨'
  ),
  experienceLevel: Joi.string().valid(
    'Less than 2 years',
    '2-5 years',
    '5-10 years',
    '10-15 years',
    'Over 15 years'
  ),
  educationBackground: Joi.string().valid(
    'Self-taught/Career Changer',
    'Vocational Training',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD/Doctorate',
    'Multiple Degrees'
  ),
  geographicLocation: Joi.string().valid(
    'North America',
    'Europe',
    'Asia-Pacific',
    'Latin America',
    'Middle East & Africa',
    'Other'
  ),
  cityMarketSize: Joi.string().valid(
    'Major Metropolitan (1M+)',
    'Mid-size City (100K-1M)',
    'Small City (10K-100K)',
    'Rural/Small Town (<10K)'
  ),
  timeAvailability: Joi.string().valid(
    'Less than 5 hours',
    '5-10 hours',
    '10-20 hours',
    '20-30 hours',
    'More than 30 hours per week'
  ),
  budgetRange: Joi.string().valid(
    'Under $50',
    '$50-150',
    '$150-500',
    '$500-1000',
    'Over $1000 monthly'
  ),
  techComfort: Joi.string().valid(
    'Early Adopter - I try everything new',
    'Tech Enthusiast - I learn eagerly',
    'Cautious but Open - I need proven results',
    'Traditional - I prefer established methods'
  ),
  supportSystem: Joi.string().valid(
    'Working completely alone',
    'Family/Friends support me',
    'I have mentors or coaches',
    'I\'m part of a community',
    'I have a small team'
  ),
  
  // Section 2: Skills & Strengths
  coreSkills: Joi.array().items(Joi.string().valid(
    'Subject Matter Expertise',
    'Communication & Presentation',
    'Problem Solving & Analysis',
    'Strategic Thinking',
    'Creativity & Innovation',
    'Technical Understanding',
    'Project Management',
    'Sales & Business Development',
    'Leadership & Team Management',
    'Empathy & People Skills'
  )).min(3).max(5),
  uniqueExperiences: Joi.string().min(50).max(1000),
  passionsInterests: Joi.string().min(30).max(500),
  
  // Section 3: Goals & Vision
  focusArea: Joi.string().valid(
    'Personal Development',
    'Business & Entrepreneurship',
    'Marketing & Sales',
    'Technology & Innovation',
    'Health & Lifestyle',
    'Education & Knowledge',
    'Creativity & Design',
    'Sustainability & Environment',
    'Finance & Investment',
    'Leadership & Management',
    'Other'
  ),
  customFocus: Joi.string().when('focusArea', {
    is: 'Other',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  primaryGoals: Joi.array().items(Joi.string().valid(
    'Help others succeed',
    'Be recognized as an expert',
    'Create new career opportunities',
    'Build side income ($500-2000/month)',
    'Become fully self-employed',
    'Scale existing business',
    'Achieve financial independence'
  )).min(2).max(3),
  timeline: Joi.string().valid(
    'Within 3 months',
    'Within 6 months',
    'Within 12 months',
    'I\'m building long-term (2+ years)'
  ),
  biggestConcerns: Joi.string().min(30).max(500)
});

const step2Schema = Joi.object({
  sessionId: Joi.string().required(),
  problemsToSolve: Joi.string().min(50).max(1000).required(),
  idealTargetGroup: Joi.string().min(60).max(1000).required(),
  industryTrendsImpact: Joi.string().min(50).max(1000).required(),
  uniqueAdvantages: Joi.string().min(40).max(1000).required(),
  marketChallenges: Joi.string().min(30).max(1000).required(),
  regionalConsiderations: Joi.string().max(1000).optional(),
  competitiveLandscape: Joi.string().max(1000).optional()
});

// Start new quiz session
router.post('/start', async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    // Capture user metadata
    const userAgent = req.get('User-Agent');
    const ipAddress = req.ip || req.connection.remoteAddress;
    const referrer = req.get('Referrer');
    const { utmSource, utmMedium, utmCampaign } = req.query;
    
    const quizResponse = new QuizResponse({
      sessionId,
      userAgent,
      ipAddress,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      startedAt: new Date()
    });
    
    await quizResponse.save();
    
    res.status(201).json({
      success: true,
      data: {
        sessionId,
        currentStep: 1,
        completionPercentage: 0
      }
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start quiz session'
    });
  }
});

// Get quiz session status
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const quizResponse = await QuizResponse.findOne({ sessionId });
    
    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        sessionId: quizResponse.sessionId,
        currentStep: quizResponse.currentStep,
        completionPercentage: quizResponse.completionPercentage,
        isCompleted: quizResponse.isCompleted,
        completedSteps: quizResponse.completedSteps,
        hasStep1Data: !!quizResponse.step1,
        hasStep2Data: !!quizResponse.step2,
        hasResults: !!quizResponse.aiResults?.finalResults
      }
    });
  } catch (error) {
    console.error('Error getting quiz session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz session'
    });
  }
});

// Submit Step 1 data
router.post('/step1', async (req, res) => {
  try {
    const { error, value } = step1Schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    const { sessionId, ...step1Data } = value;
    
    const quizResponse = await QuizResponse.findOne({ sessionId });
    
    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    // Update step 1 data
    quizResponse.step1 = step1Data;
    quizResponse.currentStep = Math.max(quizResponse.currentStep, 2);
    
    // Update completed steps
    const step1Completed = quizResponse.completedSteps.find(s => s.step === 1);
    if (!step1Completed) {
      quizResponse.completedSteps.push({
        step: 1,
        completedAt: new Date()
      });
    }
    
    await quizResponse.save();
    
    // Generate AI results for Step 1
    try {
      const aiResults = await AIService.generateStep1Results(step1Data);
      
      quizResponse.aiResults = {
        ...quizResponse.aiResults,
        step1Results: aiResults
      };
      
      await quizResponse.save();
    } catch (aiError) {
      console.error('AI generation error for Step 1:', aiError);
      // Continue without AI results - they can be generated later
    }
    
    res.json({
      success: true,
      data: {
        sessionId: quizResponse.sessionId,
        currentStep: quizResponse.currentStep,
        completionPercentage: quizResponse.completionPercentage,
        aiResults: quizResponse.aiResults?.step1Results || []
      }
    });
  } catch (error) {
    console.error('Error submitting Step 1:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit Step 1 data'
    });
  }
});

// Submit Step 2 data
router.post('/step2', async (req, res) => {
  try {
    const { error, value } = step2Schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    
    const { sessionId, ...step2Data } = value;
    
    const quizResponse = await QuizResponse.findOne({ sessionId });
    
    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    if (!quizResponse.step1) {
      return res.status(400).json({
        success: false,
        message: 'Step 1 must be completed first'
      });
    }
    
    // Update step 2 data
    quizResponse.step2 = step2Data;
    quizResponse.currentStep = Math.max(quizResponse.currentStep, 3);
    
    // Update completed steps
    const step2Completed = quizResponse.completedSteps.find(s => s.step === 2);
    if (!step2Completed) {
      quizResponse.completedSteps.push({
        step: 2,
        completedAt: new Date()
      });
    }
    
    await quizResponse.save();
    
    // Generate AI results for Step 2
    try {
      const aiResults = await AIService.generateStep2Results(quizResponse.step1, step2Data);
      
      quizResponse.aiResults = {
        ...quizResponse.aiResults,
        step2Results: aiResults
      };
      
      await quizResponse.save();
    } catch (aiError) {
      console.error('AI generation error for Step 2:', aiError);
      // Continue without AI results
    }
    
    res.json({
      success: true,
      data: {
        sessionId: quizResponse.sessionId,
        currentStep: quizResponse.currentStep,
        completionPercentage: quizResponse.completionPercentage,
        aiResults: quizResponse.aiResults?.step2Results || []
      }
    });
  } catch (error) {
    console.error('Error submitting Step 2:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit Step 2 data'
    });
  }
});

// Generate final results
router.post('/generate-final-results', async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    const quizResponse = await QuizResponse.findOne({ sessionId });
    
    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    if (!quizResponse.step1 || !quizResponse.step2) {
      return res.status(400).json({
        success: false,
        message: 'Both Step 1 and Step 2 must be completed first'
      });
    }
    
    // Generate comprehensive final results
    try {
      const finalResults = await AIService.generateFinalResults(
        quizResponse.step1,
        quizResponse.step2
      );
      
      quizResponse.aiResults = {
        ...quizResponse.aiResults,
        finalResults
      };
      
      quizResponse.isCompleted = true;
      quizResponse.completedAt = new Date();
      
      // Add step 3 to completed steps
      const step3Completed = quizResponse.completedSteps.find(s => s.step === 3);
      if (!step3Completed) {
        quizResponse.completedSteps.push({
          step: 3,
          completedAt: new Date()
        });
      }
      
      await quizResponse.save();
      
      res.json({
        success: true,
        data: {
          sessionId: quizResponse.sessionId,
          isCompleted: true,
          completionPercentage: 100,
          finalResults: quizResponse.aiResults.finalResults
        }
      });
    } catch (aiError) {
      console.error('AI generation error for final results:', aiError);
      res.status(500).json({
        success: false,
        message: 'Failed to generate final results'
      });
    }
  } catch (error) {
    console.error('Error generating final results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate final results'
    });
  }
});

// Get quiz results
router.get('/results/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const quizResponse = await QuizResponse.findOne({ sessionId });
    
    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }
    
    res.json({
      success: true,
      data: {
        sessionId: quizResponse.sessionId,
        isCompleted: quizResponse.isCompleted,
        completionPercentage: quizResponse.completionPercentage,
        step1Results: quizResponse.aiResults?.step1Results || [],
        step2Results: quizResponse.aiResults?.step2Results || [],
        finalResults: quizResponse.aiResults?.finalResults || null,
        completedAt: quizResponse.completedAt
      }
    });
  } catch (error) {
    console.error('Error getting quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz results'
    });
  }
});

// Get quiz questions for a step
router.get('/questions/:step', async (req, res) => {
  try {
    const { step } = req.params;
    const stepSections = {
      1: ['step1_section1', 'step1_section2', 'step1_section3'],
      2: ['step2']
    };
    
    if (!stepSections[step]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid step number'
      });
    }
    
    const questions = {};
    
    for (const section of stepSections[step]) {
      questions[section] = await Content.getQuestions(section);
    }
    
    res.json({
      success: true,
      data: questions
    });
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get quiz questions'
    });
  }
});

module.exports = router;