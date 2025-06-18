const express = require('express');
const router = express.Router();
const AIService = require('../services/AIService');
const QuizResponse = require('../models/QuizResponse');

// Test AI service health
router.get('/health', async (req, res) => {
  try {
    // Simple test prompt to check AI service
    const testPrompt = "Hello, this is a test. Please respond with 'AI service is working correctly.'";
    
    const response = await AIService.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: testPrompt
        }
      ],
      max_tokens: 50,
      temperature: 0
    });

    const content = response.choices[0]?.message?.content;

    res.json({
      success: true,
      message: 'AI service is healthy',
      data: {
        model: 'gpt-3.5-turbo',
        response: content,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI health check failed:', error);
    res.status(503).json({
      success: false,
      message: 'AI service is unavailable',
      error: error.message
    });
  }
});

// Test AI generation with sample data
router.post('/test-generation', async (req, res) => {
  try {
    const { type = 'step1', sampleData } = req.body;

    // Sample data for testing
    const defaultStep1Data = {
      jobStatus: 'Full-time Employee',
      industryPreference: 'Marketing & Advertising',
      experienceLevel: '5-10 years',
      educationBackground: 'Bachelor\'s Degree',
      geographicLocation: 'North America',
      cityMarketSize: 'Major Metropolitan (1M+)',
      timeAvailability: '10-20 hours',
      budgetRange: '$150-500',
      techComfort: 'Tech Enthusiast - I learn eagerly',
      supportSystem: 'I have mentors or coaches',
      coreSkills: ['Communication & Presentation', 'Strategic Thinking', 'Creativity & Innovation'],
      uniqueExperiences: 'Led a successful rebranding campaign for a mid-size company that increased brand recognition by 40% and drove 25% more leads.',
      passionsInterests: 'I\'m passionate about helping businesses tell their story authentically and connect with their audience.',
      focusArea: 'Marketing & Sales',
      primaryGoals: ['Be recognized as an expert', 'Build side income ($500-2000/month)'],
      timeline: 'Within 6 months',
      biggestConcerns: 'Standing out in a crowded market and finding my unique voice.'
    };

    const defaultStep2Data = {
      problemsToSolve: 'Many small businesses struggle with inconsistent messaging and lack a clear brand strategy that resonates with their target audience.',
      idealTargetGroup: 'Small to medium business owners, entrepreneurs, and marketing managers who want to build stronger brands but lack the expertise or resources.',
      industryTrendsImpact: 'Digital transformation and social media have made brand consistency more important than ever, while AI tools are changing how we create content.',
      uniqueAdvantages: 'I combine corporate experience with entrepreneurial insight, and I understand both creative and analytical sides of marketing.',
      marketChallenges: 'The market is saturated with marketing consultants, and it\'s challenging to prove ROI in branding efforts.'
    };

    let result;

    if (type === 'step1') {
      result = await AIService.generateStep1Results(sampleData || defaultStep1Data);
    } else if (type === 'step2') {
      result = await AIService.generateStep2Results(
        sampleData?.step1 || defaultStep1Data,
        sampleData?.step2 || defaultStep2Data
      );
    } else if (type === 'final') {
      result = await AIService.generateFinalResults(
        sampleData?.step1 || defaultStep1Data,
        sampleData?.step2 || defaultStep2Data
      );
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid generation type. Use step1, step2, or final.'
      });
    }

    res.json({
      success: true,
      message: `${type} generation test completed successfully`,
      data: {
        generationType: type,
        result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI test generation failed:', error);
    res.status(500).json({
      success: false,
      message: 'AI generation test failed',
      error: error.message
    });
  }
});

// Regenerate AI results for existing session
router.post('/regenerate/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { type } = req.body; // 'step1', 'step2', or 'final'

    // Find the quiz response
    const quizResponse = await QuizResponse.findOne({ sessionId });

    if (!quizResponse) {
      return res.status(404).json({
        success: false,
        message: 'Quiz session not found'
      });
    }

    let result;

    switch (type) {
      case 'step1':
        if (!quizResponse.step1) {
          return res.status(400).json({
            success: false,
            message: 'Step 1 data not found for this session'
          });
        }
        result = await AIService.generateStep1Results(quizResponse.step1);
        quizResponse.aiResults = {
          ...quizResponse.aiResults,
          step1Results: result
        };
        break;

      case 'step2':
        if (!quizResponse.step1 || !quizResponse.step2) {
          return res.status(400).json({
            success: false,
            message: 'Step 1 and Step 2 data required for regeneration'
          });
        }
        result = await AIService.generateStep2Results(quizResponse.step1, quizResponse.step2);
        quizResponse.aiResults = {
          ...quizResponse.aiResults,
          step2Results: result
        };
        break;

      case 'final':
        if (!quizResponse.step1 || !quizResponse.step2) {
          return res.status(400).json({
            success: false,
            message: 'Complete quiz data required for final results regeneration'
          });
        }
        result = await AIService.generateFinalResults(quizResponse.step1, quizResponse.step2);
        quizResponse.aiResults = {
          ...quizResponse.aiResults,
          finalResults: result
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid regeneration type. Use step1, step2, or final.'
        });
    }

    await quizResponse.save();

    res.json({
      success: true,
      message: `${type} results regenerated successfully`,
      data: {
        sessionId,
        regenerationType: type,
        result,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('AI regeneration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate AI results',
      error: error.message
    });
  }
});

// Get AI performance metrics
router.get('/metrics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Count AI generations
    const totalGenerations = await QuizResponse.aggregate([
      { $match: dateFilter },
      {
        $project: {
          step1Count: { $size: { $ifNull: ['$aiResults.step1Results', []] } },
          step2Count: { $size: { $ifNull: ['$aiResults.step2Results', []] } },
          hasFinalResults: { $cond: [{ $ne: ['$aiResults.finalResults', null] }, 1, 0] }
        }
      },
      {
        $group: {
          _id: null,
          totalStep1: { $sum: '$step1Count' },
          totalStep2: { $sum: '$step2Count' },
          totalFinal: { $sum: '$hasFinalResults' },
          totalSessions: { $sum: 1 }
        }
      }
    ]);

    // Success rates
    const successRates = await QuizResponse.aggregate([
      { $match: dateFilter },
      {
        $project: {
          hasStep1Results: { $gt: [{ $size: { $ifNull: ['$aiResults.step1Results', []] } }, 0] },
          hasStep2Results: { $gt: [{ $size: { $ifNull: ['$aiResults.step2Results', []] } }, 0] },
          hasFinalResults: { $ne: ['$aiResults.finalResults', null] },
          hasStep1Data: { $ne: ['$step1', null] },
          hasStep2Data: { $ne: ['$step2', null] }
        }
      },
      {
        $group: {
          _id: null,
          step1SuccessRate: {
            $avg: {
              $cond: [
                '$hasStep1Data',
                { $cond: ['$hasStep1Results', 1, 0] },
                null
              ]
            }
          },
          step2SuccessRate: {
            $avg: {
              $cond: [
                '$hasStep2Data',
                { $cond: ['$hasStep2Results', 1, 0] },
                null
              ]
            }
          },
          finalSuccessRate: {
            $avg: {
              $cond: [
                { $and: ['$hasStep1Data', '$hasStep2Data'] },
                { $cond: ['$hasFinalResults', 1, 0] },
                null
              ]
            }
          }
        }
      }
    ]);

    const metrics = totalGenerations[0] || {
      totalStep1: 0,
      totalStep2: 0,
      totalFinal: 0,
      totalSessions: 0
    };

    const rates = successRates[0] || {
      step1SuccessRate: 0,
      step2SuccessRate: 0,
      finalSuccessRate: 0
    };

    res.json({
      success: true,
      data: {
        generations: {
          step1: metrics.totalStep1,
          step2: metrics.totalStep2,
          final: metrics.totalFinal,
          total: metrics.totalStep1 + metrics.totalStep2 + metrics.totalFinal
        },
        successRates: {
          step1: Math.round(rates.step1SuccessRate * 100),
          step2: Math.round(rates.step2SuccessRate * 100),
          final: Math.round(rates.finalSuccessRate * 100)
        },
        sessions: {
          total: metrics.totalSessions,
          withAI: metrics.totalSessions // All sessions should have some AI results
        },
        period: {
          startDate: startDate || 'all time',
          endDate: endDate || 'now'
        }
      }
    });
  } catch (error) {
    console.error('AI metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch AI metrics'
    });
  }
});

module.exports = router;