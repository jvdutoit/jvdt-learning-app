import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import aiResourceService from '../../services/aiResourceService';

export default function ResourceGenerator() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    targetAge: '',
    difficulty: 'intermediate',
    type: 'flashcards',
    category: 'language-learning',
    jvdtKeys: [],
    customRequirements: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [generationProgress, setGenerationProgress] = useState('');

  const resourceTypes = [
    { id: 'flashcards', name: 'Flashcards', icon: '🃏', description: 'Interactive card-based learning' },
    { id: 'workbook', name: 'Workbook', icon: '📖', description: 'Structured learning activities' },
    { id: 'assessment', name: 'Assessment', icon: '📊', description: 'Evaluation and testing tools' },
    { id: 'scenarios', name: 'Scenarios', icon: '🎭', description: 'Real-world situation practice' },
    { id: 'toolkit', name: 'Toolkit', icon: '🧰', description: 'Collection of practical tools' },
    { id: 'guide', name: 'Guide', icon: '📋', description: 'Step-by-step instructions' }
  ];

  const categories = [
    { id: 'trauma-healing', name: 'Trauma Healing', icon: '💚' },
    { id: 'language-learning', name: 'Language Learning', icon: '🗣️' },
    { id: 'critical-thinking', name: 'Critical Thinking', icon: '🧠' },
    { id: 'self-awareness', name: 'Self-Awareness', icon: '🪞' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'learning-strategies', name: 'Learning Strategies', icon: '📈' },
    { id: 'assessment', name: 'Assessment Tools', icon: '📊' }
  ];

  const jvdtKeys = [
    { id: 'Association', name: 'Association', description: 'Connecting concepts and ideas' },
    { id: 'Analysis', name: 'Analysis', description: 'Breaking down complex information' },
    { id: 'Root', name: 'Root', description: 'Finding fundamental causes' },
    { id: 'Context', name: 'Context', description: 'Understanding environmental factors' },
    { id: 'Integration', name: 'Integration', description: 'Combining multiple perspectives' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleJVDTKeyToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      jvdtKeys: prev.jvdtKeys.includes(key)
        ? prev.jvdtKeys.filter(k => k !== key)
        : [...prev.jvdtKeys, key]
    }));
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic for your resource.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationProgress('Preparing your request...');
    
    try {
      // Update progress
      setGenerationProgress('Connecting to AI service...');
      
      // Generate the resource
      const resource = await aiResourceService.generateResource(formData);
      
      setGenerationProgress('Processing generated content...');
      
      // Save the resource
      const savedResource = aiResourceService.saveGeneratedResource(resource);
      
      setGenerationProgress('Resource created successfully!');
      
      // Navigate to the new resource after a brief delay
      setTimeout(() => {
        navigate(`/resources/${savedResource.id}`);
      }, 1000);
      
    } catch (error) {
      console.error('Resource generation failed:', error);
      setError(error.message);
      setGenerationProgress('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <Link
          to="/resources"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors mb-4"
        >
          <span className="mr-2">←</span>
          Back to Resource Library
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          AI Resource Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Create custom educational resources tailored to your specific needs using AI. 
          Specify your topic, learning objectives, and preferences to generate high-quality materials.
        </p>
      </div>

      {/* Generator Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Topic or Subject *
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  placeholder="e.g., Basic Spanish Vocabulary, Emotional Regulation, Critical Reading Skills"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Age Group
                </label>
                <input
                  type="text"
                  value={formData.targetAge}
                  onChange={(e) => handleInputChange('targetAge', e.target.value)}
                  placeholder="e.g., 10-12 years, Adults, High School"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resource Type */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Resource Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resourceTypes.map(type => (
                <div
                  key={type.id}
                  onClick={() => handleInputChange('type', type.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.type === type.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className="text-3xl">{type.icon}</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{type.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Category
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map(category => (
                <div
                  key={category.id}
                  onClick={() => handleInputChange('category', category.id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
                    formData.category === category.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>{category.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {category.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JVDT Keys */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              JVDT Keys (Optional)
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select which JVDT learning keys should be emphasized in this resource:
            </p>
            <div className="space-y-3">
              {jvdtKeys.map(key => (
                <div
                  key={key.id}
                  onClick={() => handleJVDTKeyToggle(key.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.jvdtKeys.includes(key.id)
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                      formData.jvdtKeys.includes(key.id)
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {formData.jvdtKeys.includes(key.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{key.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{key.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Requirements */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Additional Requirements
            </h3>
            <textarea
              value={formData.customRequirements}
              onChange={(e) => handleInputChange('customRequirements', e.target.value)}
              placeholder="Describe any specific requirements, learning objectives, or constraints for this resource..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* Generate Button */}
          <div className="flex flex-col items-center pt-6 space-y-4">
            {error && (
              <div className="w-full max-w-md p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200">Generation Failed</h4>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {generationProgress && (
              <div className="w-full max-w-md p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-blue-800 dark:text-blue-200 font-medium">{generationProgress}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !formData.topic.trim()}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-lg inline-flex items-center"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Resource...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Generate AI Resource
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* API Key Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <div className="text-2xl">�</div>
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
              API Key Required
            </h3>
            <p className="text-amber-800 dark:text-amber-300 text-sm mb-3">
              To use AI resource generation, you need to set up a Google Gemini API key. 
              The AI service is fully implemented and ready to create custom educational materials.
            </p>
            <div className="text-xs text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 rounded px-3 py-2 font-mono">
              Add VITE_GEMINI_API_KEY to your .env file
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}