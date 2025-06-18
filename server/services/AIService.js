const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
  }

  // Generate Step 1 Results: Personal Brand Profile Summaries
  async generateStep1Results(step1Data) {
    const prompt = this.buildStep1Prompt(step1Data);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a world-class personal branding strategist with deep expertise in market research, regional business dynamics, and cultural considerations. You create comprehensive, actionable brand positioning strategies that are both globally relevant and locally optimized.

Your responses must be professional, insightful, and immediately actionable. Focus on practical strategies rather than generic advice. Always consider regional market dynamics, cultural factors, and local competition when making recommendations.

Generate exactly 3 distinct Personal Brand Profile Summaries, each focusing on different strategic angles based on the user's profile. Each summary should be comprehensive, unique, and provide a different pathway for brand development.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      return this.parseStep1Results(content, step1Data);
    } catch (error) {
      console.error('Error generating Step 1 results:', error);
      throw new Error('Failed to generate AI results for Step 1');
    }
  }

  // Generate Step 2 Results: Market Positioning Strategies
  async generateStep2Results(step1Data, step2Data) {
    const prompt = this.buildStep2Prompt(step1Data, step2Data);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are an expert market research analyst and business strategist with deep knowledge of global markets, regional business landscapes, and competitive intelligence. You specialize in identifying market opportunities, analyzing competitive landscapes, and developing go-to-market strategies that account for local market dynamics.

Your analysis must be data-driven, regionally informed, and strategically sound. Provide specific, actionable insights that demonstrate deep understanding of market dynamics, cultural factors, and regional business practices.

Generate exactly 3 distinct Market Positioning Strategies, each offering a different market approach and competitive positioning based on your comprehensive market analysis.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3500
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      return this.parseStep2Results(content, step1Data, step2Data);
    } catch (error) {
      console.error('Error generating Step 2 results:', error);
      throw new Error('Failed to generate AI results for Step 2');
    }
  }

  // Generate Final Comprehensive Results
  async generateFinalResults(step1Data, step2Data) {
    const prompt = this.buildFinalResultsPrompt(step1Data, step2Data);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are the world's leading personal branding and business strategy consultant, combining deep market research expertise with practical implementation experience. You create comprehensive brand positioning strategies that integrate personal strengths, market opportunities, and regional dynamics into actionable business plans.

Your final analysis must be thorough, professional, and immediately implementable. Provide specific, data-informed recommendations that account for regional market conditions, competitive landscapes, and cultural factors. Focus on creating a complete strategic framework that the user can implement systematically.

Generate a comprehensive final brand positioning report with all required sections, ensuring each element is specific, actionable, and tailored to the user's unique profile and market context.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.6,
        max_tokens: 4000
      });

      const content = response.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content generated from AI service');
      }

      return this.parseFinalResults(content, step1Data, step2Data);
    } catch (error) {
      console.error('Error generating final results:', error);
      throw new Error('Failed to generate final comprehensive results');
    }
  }

  // Build Step 1 prompt
  buildStep1Prompt(step1Data) {
    return `Analyze this personal profile and create 3 distinct Personal Brand Profile Summaries:

PERSONAL PROFILE:
Current Situation:
- Job Status: ${step1Data.jobStatus}
- Industry Preference: ${step1Data.industryPreference}
- Experience Level: ${step1Data.experienceLevel}
- Education: ${step1Data.educationBackground}
- Geographic Location: ${step1Data.geographicLocation}
- Market Size: ${step1Data.cityMarketSize}
- Time Availability: ${step1Data.timeAvailability}
- Budget Range: ${step1Data.budgetRange}
- Tech Comfort: ${step1Data.techComfort}
- Support System: ${step1Data.supportSystem}

Skills & Strengths:
- Core Skills: ${step1Data.coreSkills?.join(', ')}
- Unique Experiences: ${step1Data.uniqueExperiences}
- Passions & Interests: ${step1Data.passionsInterests}

Goals & Vision:
- Focus Area: ${step1Data.focusArea}${step1Data.customFocus ? ` (${step1Data.customFocus})` : ''}
- Primary Goals: ${step1Data.primaryGoals?.join(', ')}
- Timeline: ${step1Data.timeline}
- Biggest Concerns: ${step1Data.biggestConcerns}

Please create 3 comprehensive Personal Brand Profile Summaries, each focusing on a different strategic approach:

SUMMARY 1: [MARKET LEADER APPROACH]
- Brand archetype and positioning
- Unique value proposition
- Target audience definition
- Key differentiators
- Regional market context and opportunities
- Competitive advantages
- Implementation priority

SUMMARY 2: [NICHE SPECIALIST APPROACH]
- Specialized positioning strategy
- Niche market identification
- Expert authority building
- Unique market angle
- Regional specialization opportunities
- Competitive differentiation
- Implementation roadmap

SUMMARY 3: [HYBRID INNOVATOR APPROACH]
- Multi-faceted positioning
- Cross-industry opportunities
- Innovation positioning
- Diverse market approach
- Regional adaptation strategies
- Unique market position
- Implementation strategy

Each summary should be 200-250 words and provide specific, actionable insights tailored to the user's profile and regional market context.`;
  }

  // Build Step 2 prompt
  buildStep2Prompt(step1Data, step2Data) {
    return `Based on this comprehensive profile and market research, create 3 distinct Market Positioning Strategies:

PERSONAL PROFILE SUMMARY:
- Industry: ${step1Data.industryPreference}
- Experience: ${step1Data.experienceLevel}
- Location: ${step1Data.geographicLocation} (${step1Data.cityMarketSize})
- Focus Area: ${step1Data.focusArea}
- Goals: ${step1Data.primaryGoals?.join(', ')}
- Budget: ${step1Data.budgetRange}
- Timeline: ${step1Data.timeline}

MARKET RESEARCH DATA:
- Problems to Solve: ${step2Data.problemsToSolve}
- Target Audience: ${step2Data.idealTargetGroup}
- Industry Trends Impact: ${step2Data.industryTrendsImpact}
- Unique Advantages: ${step2Data.uniqueAdvantages}
- Market Challenges: ${step2Data.marketChallenges}
- Regional Considerations: ${step2Data.regionalConsiderations || 'Not specified'}
- Competitive Landscape: ${step2Data.competitiveLandscape || 'Not specified'}

Create 3 comprehensive Market Positioning Strategies:

STRATEGY 1: [REGIONAL MARKET DOMINATION]
- Regional market analysis and size
- Local competition assessment
- Cultural adaptation requirements
- Regional business model recommendations
- Local partnership opportunities
- Market entry timeline
- Revenue potential analysis

STRATEGY 2: [DIGITAL-FIRST GLOBAL REACH]
- Digital market opportunities
- Online competition analysis
- Global vs local balance
- Platform-specific strategies
- International market considerations
- Scalability assessment
- Technology requirements

STRATEGY 3: [HYBRID LOCAL-GLOBAL APPROACH]
- Multi-market positioning
- Local expertise with global reach
- Regional hub strategy
- Cross-market opportunities
- Cultural bridge positioning
- International expansion plan
- Competitive differentiation

Each strategy should be 250-300 words and include specific market insights, competitive analysis, and actionable recommendations based on regional and global market dynamics.`;
  }

  // Build final results prompt
  buildFinalResultsPrompt(step1Data, step2Data) {
    return `Create a comprehensive Personal Brand Positioning Strategy based on this complete profile:

COMPLETE PROFILE:
Personal Foundation:
- Industry: ${step1Data.industryPreference}
- Experience: ${step1Data.experienceLevel}
- Location: ${step1Data.geographicLocation} (${step1Data.cityMarketSize})
- Skills: ${step1Data.coreSkills?.join(', ')}
- Goals: ${step1Data.primaryGoals?.join(', ')}
- Timeline: ${step1Data.timeline}
- Budget: ${step1Data.budgetRange}

Market Intelligence:
- Target Problems: ${step2Data.problemsToSolve}
- Ideal Audience: ${step2Data.idealTargetGroup}
- Market Trends: ${step2Data.industryTrendsImpact}
- Unique Advantages: ${step2Data.uniqueAdvantages}
- Challenges: ${step2Data.marketChallenges}

Generate a complete brand positioning strategy with these specific sections:

1. UNIQUE BRAND POSITION STATEMENT (2-3 sentences)
2. CORE STRENGTHS MATRIX (4-5 key strengths with market applications)
3. HERO SLOGANS & TAGLINES (3-5 memorable options)
4. KEY DIFFERENTIATORS (3-4 unique positioning elements)
5. BRAND VOICE & MESSAGING (tone, style, key messages)
6. IDEAL CLIENT AVATAR (detailed persona with regional context)
7. REGIONAL MARKET ANALYSIS (size, trends, opportunities)
8. COMPETITIVE LANDSCAPE MAPPING (key competitors and positioning gaps)
9. 90-DAY LAUNCH ROADMAP (specific action steps)
10. PREMIUM SERVICE OFFERINGS (3-4 monetization strategies)
11. SUCCESS INDICATORS & KPIS (measurable goals)
12. REGIONAL BUSINESS MODEL RECOMMENDATIONS (specific to location and market)

Make each section specific, actionable, and tailored to the user's unique profile and regional market context. Focus on practical implementation rather than generic advice.`;
  }

  // Parse Step 1 results
  parseStep1Results(content, step1Data) {
    const results = [];
    const sections = content.split(/SUMMARY \d+:/);
    
    for (let i = 1; i < sections.length && i <= 3; i++) {
      const section = sections[i].trim();
      const title = this.extractTitle(section) || `Personal Brand Profile ${i}`;
      
      results.push({
        title,
        content: section,
        generatedAt: new Date(),
        prompt: 'step1_profile_analysis',
        model: this.model
      });
    }
    
    return results;
  }

  // Parse Step 2 results
  parseStep2Results(content, step1Data, step2Data) {
    const results = [];
    const sections = content.split(/STRATEGY \d+:/);
    
    for (let i = 1; i < sections.length && i <= 3; i++) {
      const section = sections[i].trim();
      const title = this.extractTitle(section) || `Market Positioning Strategy ${i}`;
      
      results.push({
        title,
        content: section,
        generatedAt: new Date(),
        prompt: 'step2_market_analysis',
        model: this.model
      });
    }
    
    return results;
  }

  // Parse final results
  parseFinalResults(content, step1Data, step2Data) {
    const sections = this.parseFinalResultsSections(content);
    
    return {
      brandPosition: sections['UNIQUE BRAND POSITION STATEMENT'] || '',
      strengthsMatrix: sections['CORE STRENGTHS MATRIX'] || '',
      heroSlogans: this.extractList(sections['HERO SLOGANS & TAGLINES'] || ''),
      keyDifferentiators: this.extractList(sections['KEY DIFFERENTIATORS'] || ''),
      brandVoice: sections['BRAND VOICE & MESSAGING'] || '',
      idealClientAvatar: sections['IDEAL CLIENT AVATAR'] || '',
      marketAnalysis: sections['REGIONAL MARKET ANALYSIS'] || '',
      competitiveMapping: sections['COMPETITIVE LANDSCAPE MAPPING'] || '',
      launchRoadmap: sections['90-DAY LAUNCH ROADMAP'] || '',
      premiumServices: sections['PREMIUM SERVICE OFFERINGS'] || '',
      successIndicators: this.extractList(sections['SUCCESS INDICATORS & KPIS'] || ''),
      businessModel: sections['REGIONAL BUSINESS MODEL RECOMMENDATIONS'] || '',
      generatedAt: new Date()
    };
  }

  // Helper methods
  extractTitle(section) {
    const match = section.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  }

  extractList(content) {
    const lines = content.split('\n').filter(line => line.trim());
    const listItems = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.match(/^[-•*]\s/) || trimmed.match(/^\d+\.\s/)) {
        listItems.push(trimmed.replace(/^[-•*]\s|^\d+\.\s/, ''));
      }
    }
    
    return listItems.length > 0 ? listItems : [content.trim()];
  }

  parseFinalResultsSections(content) {
    const sections = {};
    const sectionHeaders = [
      'UNIQUE BRAND POSITION STATEMENT',
      'CORE STRENGTHS MATRIX',
      'HERO SLOGANS & TAGLINES',
      'KEY DIFFERENTIATORS',
      'BRAND VOICE & MESSAGING',
      'IDEAL CLIENT AVATAR',
      'REGIONAL MARKET ANALYSIS',
      'COMPETITIVE LANDSCAPE MAPPING',
      '90-DAY LAUNCH ROADMAP',
      'PREMIUM SERVICE OFFERINGS',
      'SUCCESS INDICATORS & KPIS',
      'REGIONAL BUSINESS MODEL RECOMMENDATIONS'
    ];
    
    for (let i = 0; i < sectionHeaders.length; i++) {
      const currentHeader = sectionHeaders[i];
      const nextHeader = sectionHeaders[i + 1];
      
      const startIndex = content.indexOf(currentHeader);
      if (startIndex === -1) continue;
      
      const contentStart = startIndex + currentHeader.length;
      const endIndex = nextHeader ? content.indexOf(nextHeader, contentStart) : content.length;
      
      const sectionContent = content.substring(contentStart, endIndex).trim();
      sections[currentHeader] = sectionContent.replace(/^\d+\.\s*/, '').trim();
    }
    
    return sections;
  }
}

module.exports = new AIService();