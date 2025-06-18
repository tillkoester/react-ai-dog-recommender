import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuiz } from '../../contexts/QuizContext';
import { Step2Data } from '../../types';
import { FormField } from '../ui/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { TrendingUp, Users, Target, Lightbulb, AlertTriangle, Globe, BarChart3 } from 'lucide-react';

interface Step2FormProps {
  onComplete: () => void;
  initialData?: Step2Data | null;
}

// Validation schema
const step2Schema = yup.object({
  problemsToSolve: yup
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(1000, 'Please keep under 1000 characters')
    .required('Please describe the problems you want to solve'),
  idealTargetGroup: yup
    .string()
    .min(60, 'Please provide at least 60 characters')
    .max(1000, 'Please keep under 1000 characters')
    .required('Please describe your ideal target audience'),
  industryTrendsImpact: yup
    .string()
    .min(50, 'Please provide at least 50 characters')
    .max(1000, 'Please keep under 1000 characters')
    .required('Please describe how industry trends impact your field'),
  uniqueAdvantages: yup
    .string()
    .min(40, 'Please provide at least 40 characters')
    .max(1000, 'Please keep under 1000 characters')
    .required('Please describe your unique advantages'),
  marketChallenges: yup
    .string()
    .min(30, 'Please provide at least 30 characters')
    .max(1000, 'Please keep under 1000 characters')
    .required('Please describe the market challenges you foresee'),
  regionalConsiderations: yup
    .string()
    .max(1000, 'Please keep under 1000 characters')
    .notRequired(),
  competitiveLandscape: yup
    .string()
    .max(1000, 'Please keep under 1000 characters')
    .notRequired()
});

export const Step2Form: React.FC<Step2FormProps> = ({ onComplete, initialData }) => {
  const { saveStep2, isLoading } = useQuiz();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm<Step2Data>({
    resolver: yupResolver(step2Schema),
    defaultValues: initialData || {},
    mode: 'onChange'
  });

  // Watch form values for character counts
  const problemsToSolve = watch('problemsToSolve') || '';
  const idealTargetGroup = watch('idealTargetGroup') || '';
  const industryTrendsImpact = watch('industryTrendsImpact') || '';
  const uniqueAdvantages = watch('uniqueAdvantages') || '';
  const marketChallenges = watch('marketChallenges') || '';
  const regionalConsiderations = watch('regionalConsiderations') || '';
  const competitiveLandscape = watch('competitiveLandscape') || '';

  const onSubmit = async (data: Step2Data) => {
    try {
      await saveStep2(data);
      onComplete();
    } catch (error) {
      console.error('Failed to save Step 2 data:', error);
    }
  };

  const getCharacterCountColor = (current: number, min: number, max: number) => {
    if (current < min) return 'text-red-500';
    if (current > max * 0.9) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getCharacterCountText = (current: number, min: number, max: number) => {
    if (current < min) return `${min - current} more needed`;
    return `${current}/${max}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 2: Market Intelligence & Research
        </h2>
        <p className="text-gray-600">
          Help us understand your market, target audience, and competitive landscape
        </p>
      </div>

      <div className="space-y-8">
        {/* Problems to Solve */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Target Problems</h3>
              <p className="text-sm text-gray-600">Define the specific problems you'll solve</p>
            </div>
          </div>
          
          <FormField
            label="What specific problems do you want to solve for your target audience?"
            name="problemsToSolve"
            type="textarea"
            register={register}
            error={errors.problemsToSolve?.message}
            required
            rows={4}
            placeholder="Describe the pain points, challenges, or needs your target audience faces that you can address. Be specific about the problems and their impact."
            helpText="50-1000 characters"
          />
          
          <div className="mt-2 text-right">
            <span className={getCharacterCountColor(problemsToSolve.length, 50, 1000)}>
              {getCharacterCountText(problemsToSolve.length, 50, 1000)}
            </span>
          </div>
        </div>

        {/* Ideal Target Group */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Target Audience</h3>
              <p className="text-sm text-gray-600">Define your ideal client persona</p>
            </div>
          </div>
          
          <FormField
            label="Describe your ideal target audience in detail"
            name="idealTargetGroup"
            type="textarea"
            register={register}
            error={errors.idealTargetGroup?.message}
            required
            rows={4}
            placeholder="Include demographics (age, location, income), psychographics (values, interests), behaviors (how they consume content, make decisions), and specific pain points they experience."
            helpText="60-1000 characters"
          />
          
          <div className="mt-2 text-right">
            <span className={getCharacterCountColor(idealTargetGroup.length, 60, 1000)}>
              {getCharacterCountText(idealTargetGroup.length, 60, 1000)}
            </span>
          </div>
        </div>

        {/* Industry Trends Impact */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Industry Trends</h3>
              <p className="text-sm text-gray-600">Analyze current market dynamics</p>
            </div>
          </div>
          
          <FormField
            label="How are current industry trends (AI, remote work, economic changes) affecting your field and target audience?"
            name="industryTrendsImpact"
            type="textarea"
            register={register}
            error={errors.industryTrendsImpact?.message}
            required
            rows={4}
            placeholder="Discuss relevant trends like AI adoption, remote work shifts, economic changes, generational preferences, or technology disruptions affecting your industry and how your audience responds to these changes."
            helpText="50-1000 characters"
          />
          
          <div className="mt-2 text-right">
            <span className={getCharacterCountColor(industryTrendsImpact.length, 50, 1000)}>
              {getCharacterCountText(industryTrendsImpact.length, 50, 1000)}
            </span>
          </div>
        </div>

        {/* Unique Advantages */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Competitive Advantages</h3>
              <p className="text-sm text-gray-600">Identify what makes you unique</p>
            </div>
          </div>
          
          <FormField
            label="What unique advantages do you have over competitors in your space?"
            name="uniqueAdvantages"
            type="textarea"
            register={register}
            error={errors.uniqueAdvantages?.message}
            required
            rows={4}
            placeholder="Think about your unique combination of skills, experiences, approach, network, insights, or resources that competitors don't have or can't easily replicate."
            helpText="40-1000 characters"
          />
          
          <div className="mt-2 text-right">
            <span className={getCharacterCountColor(uniqueAdvantages.length, 40, 1000)}>
              {getCharacterCountText(uniqueAdvantages.length, 40, 1000)}
            </span>
          </div>
        </div>

        {/* Market Challenges */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Market Challenges</h3>
              <p className="text-sm text-gray-600">Identify potential obstacles</p>
            </div>
          </div>
          
          <FormField
            label="What challenges do you foresee in your market positioning?"
            name="marketChallenges"
            type="textarea"
            register={register}
            error={errors.marketChallenges?.message}
            required
            rows={3}
            placeholder="Consider market saturation, economic factors, changing customer preferences, technological disruption, regulatory changes, or competition intensity."
            helpText="30-1000 characters"
          />
          
          <div className="mt-2 text-right">
            <span className={getCharacterCountColor(marketChallenges.length, 30, 1000)}>
              {getCharacterCountText(marketChallenges.length, 30, 1000)}
            </span>
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Considerations */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                <Globe className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Regional Factors</h3>
                <p className="text-sm text-gray-600">Optional: Local market insights</p>
              </div>
            </div>
            
            <FormField
              label="Are there specific regional, cultural, or local market factors we should consider? (Optional)"
              name="regionalConsiderations"
              type="textarea"
              register={register}
              error={errors.regionalConsiderations?.message}
              rows={3}
              placeholder="Cultural preferences, local business practices, regulatory environment, economic conditions, or market maturity in your region."
              helpText="Up to 1000 characters"
            />
            
            <div className="mt-2 text-right">
              <span className="text-gray-500">
                {regionalConsiderations.length}/1000
              </span>
            </div>
          </div>

          {/* Competitive Landscape */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Competition</h3>
                <p className="text-sm text-gray-600">Optional: Competitor insights</p>
              </div>
            </div>
            
            <FormField
              label="Who do you see as your main competitors or inspirational figures in your space? (Optional)"
              name="competitiveLandscape"
              type="textarea"
              register={register}
              error={errors.competitiveLandscape?.message}
              rows={3}
              placeholder="Mention specific competitors, thought leaders, or companies you admire or compete with, and what makes them successful."
              helpText="Up to 1000 characters"
            />
            
            <div className="mt-2 text-right">
              <span className="text-gray-500">
                {competitiveLandscape.length}/1000
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={!isValid || isLoading}
          className="btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Analyzing Market Data...
            </>
          ) : (
            'Complete Step 2 & Generate Market Analysis'
          )}
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="text-center text-sm text-gray-500">
        Step 2 of 3 • Market Intelligence Complete
      </div>
    </form>
  );
};