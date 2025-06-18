import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useQuiz } from '../../contexts/QuizContext';
import { Step1Data } from '../../types';
import { FormField } from '../ui/FormField';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface Step1FormProps {
  onComplete: () => void;
  initialData?: Step1Data | null;
}

// Validation schema
const step1Schema = yup.object({
  // Section 1: Current Situation
  jobStatus: yup.string().required('Please select your job status'),
  industryPreference: yup.string().required('Please select your industry preference'),
  experienceLevel: yup.string().required('Please select your experience level'),
  educationBackground: yup.string().required('Please select your education background'),
  geographicLocation: yup.string().required('Please select your geographic location'),
  cityMarketSize: yup.string().required('Please select your city/market size'),
  timeAvailability: yup.string().required('Please select your time availability'),
  budgetRange: yup.string().required('Please select your budget range'),
  techComfort: yup.string().required('Please select your tech comfort level'),
  supportSystem: yup.string().required('Please select your support system'),
  
  // Section 2: Skills & Strengths
  coreSkills: yup.array().of(yup.string()).min(3, 'Please select at least 3 core skills').max(5, 'Please select no more than 5 core skills'),
  uniqueExperiences: yup.string().min(50, 'Please provide at least 50 characters').max(1000, 'Please keep under 1000 characters').required('Please describe your unique experiences'),
  passionsInterests: yup.string().min(30, 'Please provide at least 30 characters').max(500, 'Please keep under 500 characters').required('Please describe your passions and interests'),
  
  // Section 3: Goals & Vision
  focusArea: yup.string().required('Please select your focus area'),
  customFocus: yup.string().when('focusArea', {
    is: 'Other',
    then: (schema) => schema.required('Please specify your custom focus area'),
    otherwise: (schema) => schema.notRequired()
  }),
  primaryGoals: yup.array().of(yup.string()).min(2, 'Please select at least 2 primary goals').max(3, 'Please select no more than 3 primary goals'),
  timeline: yup.string().required('Please select your timeline'),
  biggestConcerns: yup.string().min(30, 'Please provide at least 30 characters').max(500, 'Please keep under 500 characters').required('Please describe your biggest concerns')
});

export const Step1Form: React.FC<Step1FormProps> = ({ onComplete, initialData }) => {
  const { saveStep1, isLoading } = useQuiz();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    section1: true,
    section2: false,
    section3: false
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
    getValues
  } = useForm<Step1Data>({
    resolver: yupResolver(step1Schema),
    defaultValues: initialData || {},
    mode: 'onChange'
  });

  const focusArea = watch('focusArea');
  const coreSkills = watch('coreSkills') || [];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCoreSkillChange = (skill: string, checked: boolean) => {
    const currentSkills = coreSkills;
    let newSkills: string[];
    
    if (checked) {
      if (currentSkills.length < 5) {
        newSkills = [...currentSkills, skill];
      } else {
        return; // Don't add if already at max
      }
    } else {
      newSkills = currentSkills.filter(s => s !== skill);
    }
    
    setValue('coreSkills', newSkills, { shouldValidate: true });
  };

  const handlePrimaryGoalsChange = (goal: string, checked: boolean) => {
    const currentGoals = getValues('primaryGoals') || [];
    let newGoals: string[];
    
    if (checked) {
      if (currentGoals.length < 3) {
        newGoals = [...currentGoals, goal];
      } else {
        return; // Don't add if already at max
      }
    } else {
      newGoals = currentGoals.filter(g => g !== goal);
    }
    
    setValue('primaryGoals', newGoals, { shouldValidate: true });
  };

  const onSubmit = async (data: Step1Data) => {
    try {
      await saveStep1(data);
      onComplete();
    } catch (error) {
      console.error('Failed to save Step 1 data:', error);
    }
  };

  const jobStatusOptions = [
    'Student',
    'Full-time Employee',
    'Part-time Employee',
    'Freelancer',
    'Entrepreneur with Existing Business',
    'Between Jobs',
    'Retired'
  ];

  const industryOptions = [
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
  ];

  const coreSkillsOptions = [
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
  ];

  const focusAreaOptions = [
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
  ];

  const primaryGoalsOptions = [
    'Help others succeed',
    'Be recognized as an expert',
    'Create new career opportunities',
    'Build side income ($500-2000/month)',
    'Become fully self-employed',
    'Scale existing business',
    'Achieve financial independence'
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Step 1: Personal Foundation
        </h2>
        <p className="text-gray-600">
          Help us understand your current situation, skills, and goals
        </p>
      </div>

      {/* Section 1: Current Situation */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section1')}
          className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm mr-3">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Current Situation</h3>
          </div>
          {expandedSections.section1 ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.section1 && (
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Job Status"
                name="jobStatus"
                type="select"
                options={jobStatusOptions.map(option => ({ value: option, label: option }))}
                register={register}
                error={errors.jobStatus?.message}
                required
              />

              <FormField
                label="Industry Preference"
                name="industryPreference"
                type="select"
                options={industryOptions.map(option => ({ value: option, label: option }))}
                register={register}
                error={errors.industryPreference?.message}
                required
                helpText="Choose 'Let AI Decide ✨' if you're open to suggestions"
              />

              <FormField
                label="Experience Level"
                name="experienceLevel"
                type="select"
                options={[
                  { value: 'Less than 2 years', label: 'Less than 2 years' },
                  { value: '2-5 years', label: '2-5 years' },
                  { value: '5-10 years', label: '5-10 years' },
                  { value: '10-15 years', label: '10-15 years' },
                  { value: 'Over 15 years', label: 'Over 15 years' }
                ]}
                register={register}
                error={errors.experienceLevel?.message}
                required
              />

              <FormField
                label="Education Background"
                name="educationBackground"
                type="select"
                options={[
                  { value: 'Self-taught/Career Changer', label: 'Self-taught/Career Changer' },
                  { value: 'Vocational Training', label: 'Vocational Training' },
                  { value: 'Bachelor\'s Degree', label: 'Bachelor\'s Degree' },
                  { value: 'Master\'s Degree', label: 'Master\'s Degree' },
                  { value: 'PhD/Doctorate', label: 'PhD/Doctorate' },
                  { value: 'Multiple Degrees', label: 'Multiple Degrees' }
                ]}
                register={register}
                error={errors.educationBackground?.message}
                required
              />

              <FormField
                label="Geographic Location"
                name="geographicLocation"
                type="select"
                options={[
                  { value: 'North America', label: 'North America' },
                  { value: 'Europe', label: 'Europe' },
                  { value: 'Asia-Pacific', label: 'Asia-Pacific' },
                  { value: 'Latin America', label: 'Latin America' },
                  { value: 'Middle East & Africa', label: 'Middle East & Africa' },
                  { value: 'Other', label: 'Other' }
                ]}
                register={register}
                error={errors.geographicLocation?.message}
                required
              />

              <FormField
                label="City/Market Size"
                name="cityMarketSize"
                type="select"
                options={[
                  { value: 'Major Metropolitan (1M+)', label: 'Major Metropolitan (1M+)' },
                  { value: 'Mid-size City (100K-1M)', label: 'Mid-size City (100K-1M)' },
                  { value: 'Small City (10K-100K)', label: 'Small City (10K-100K)' },
                  { value: 'Rural/Small Town (<10K)', label: 'Rural/Small Town (<10K)' }
                ]}
                register={register}
                error={errors.cityMarketSize?.message}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Time Availability"
                name="timeAvailability"
                type="select"
                options={[
                  { value: 'Less than 5 hours', label: 'Less than 5 hours per week' },
                  { value: '5-10 hours', label: '5-10 hours per week' },
                  { value: '10-20 hours', label: '10-20 hours per week' },
                  { value: '20-30 hours', label: '20-30 hours per week' },
                  { value: 'More than 30 hours per week', label: 'More than 30 hours per week' }
                ]}
                register={register}
                error={errors.timeAvailability?.message}
                required
              />

              <FormField
                label="Budget Range"
                name="budgetRange"
                type="select"
                options={[
                  { value: 'Under $50', label: 'Under $50 monthly' },
                  { value: '$50-150', label: '$50-150 monthly' },
                  { value: '$150-500', label: '$150-500 monthly' },
                  { value: '$500-1000', label: '$500-1000 monthly' },
                  { value: 'Over $1000 monthly', label: 'Over $1000 monthly' }
                ]}
                register={register}
                error={errors.budgetRange?.message}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Tech Comfort Level"
                name="techComfort"
                type="select"
                options={[
                  { value: 'Early Adopter - I try everything new', label: 'Early Adopter - I try everything new' },
                  { value: 'Tech Enthusiast - I learn eagerly', label: 'Tech Enthusiast - I learn eagerly' },
                  { value: 'Cautious but Open - I need proven results', label: 'Cautious but Open - I need proven results' },
                  { value: 'Traditional - I prefer established methods', label: 'Traditional - I prefer established methods' }
                ]}
                register={register}
                error={errors.techComfort?.message}
                required
              />

              <FormField
                label="Support System"
                name="supportSystem"
                type="select"
                options={[
                  { value: 'Working completely alone', label: 'Working completely alone' },
                  { value: 'Family/Friends support me', label: 'Family/Friends support me' },
                  { value: 'I have mentors or coaches', label: 'I have mentors or coaches' },
                  { value: 'I\'m part of a community', label: 'I\'m part of a community' },
                  { value: 'I have a small team', label: 'I have a small team' }
                ]}
                register={register}
                error={errors.supportSystem?.message}
                required
              />
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Skills & Strengths */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section2')}
          className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm mr-3">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Skills & Strengths</h3>
          </div>
          {expandedSections.section2 ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.section2 && (
          <div className="px-6 py-6 space-y-6">
            {/* Core Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Core Skills <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal"> (Select 3-5)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coreSkillsOptions.map((skill) => (
                  <label key={skill} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={coreSkills.includes(skill)}
                      onChange={(e) => handleCoreSkillChange(skill, e.target.checked)}
                      className="form-checkbox"
                      disabled={!coreSkills.includes(skill) && coreSkills.length >= 5}
                    />
                    <span className="text-sm text-gray-900">{skill}</span>
                  </label>
                ))}
              </div>
              {errors.coreSkills && (
                <p className="mt-1 text-sm text-red-600">{errors.coreSkills.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Selected: {coreSkills.length}/5
              </p>
            </div>

            <FormField
              label="Unique Experiences"
              name="uniqueExperiences"
              type="textarea"
              placeholder="What unique experiences or achievements have you had that set you apart? (e.g., launched a successful campaign, overcame a major challenge, led a transformation, etc.)"
              register={register}
              error={errors.uniqueExperiences?.message}
              required
              rows={4}
              helpText="50-1000 characters"
            />

            <FormField
              label="Passions & Interests"
              name="passionsInterests"
              type="textarea"
              placeholder="What are you passionate about? What truly motivates and excites you?"
              register={register}
              error={errors.passionsInterests?.message}
              required
              rows={3}
              helpText="30-500 characters"
            />
          </div>
        )}
      </div>

      {/* Section 3: Goals & Vision */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('section3')}
          className="w-full px-6 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm mr-3">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Goals & Vision</h3>
          </div>
          {expandedSections.section3 ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {expandedSections.section3 && (
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormField
                  label="Focus Area"
                  name="focusArea"
                  type="select"
                  options={focusAreaOptions.map(option => ({ value: option, label: option }))}
                  register={register}
                  error={errors.focusArea?.message}
                  required
                />
              </div>

              {focusArea === 'Other' && (
                <div>
                  <FormField
                    label="Custom Focus Area"
                    name="customFocus"
                    type="text"
                    placeholder="Specify your focus area"
                    register={register}
                    error={errors.customFocus?.message}
                    required
                  />
                </div>
              )}
            </div>

            {/* Primary Goals */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Primary Goals <span className="text-red-500">*</span>
                <span className="text-gray-500 font-normal"> (Select 2-3)</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {primaryGoalsOptions.map((goal) => {
                  const currentGoals = getValues('primaryGoals') || [];
                  return (
                    <label key={goal} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentGoals.includes(goal)}
                        onChange={(e) => handlePrimaryGoalsChange(goal, e.target.checked)}
                        className="form-checkbox"
                        disabled={!currentGoals.includes(goal) && currentGoals.length >= 3}
                      />
                      <span className="text-sm text-gray-900">{goal}</span>
                    </label>
                  );
                })}
              </div>
              {errors.primaryGoals && (
                <p className="mt-1 text-sm text-red-600">{errors.primaryGoals.message}</p>
              )}
            </div>

            <FormField
              label="Timeline"
              name="timeline"
              type="select"
              options={[
                { value: 'Within 3 months', label: 'Within 3 months' },
                { value: 'Within 6 months', label: 'Within 6 months' },
                { value: 'Within 12 months', label: 'Within 12 months' },
                { value: 'I\'m building long-term (2+ years)', label: 'I\'m building long-term (2+ years)' }
              ]}
              register={register}
              error={errors.timeline?.message}
              required
            />

            <FormField
              label="Biggest Concerns"
              name="biggestConcerns"
              type="textarea"
              placeholder="What are your biggest worries or obstacles in building your personal brand?"
              register={register}
              error={errors.biggestConcerns?.message}
              required
              rows={3}
              helpText="30-500 characters"
            />
          </div>
        )}
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
              Analyzing Your Profile...
            </>
          ) : (
            'Complete Step 1 & Generate AI Analysis'
          )}
        </button>
      </div>
    </form>
  );
};