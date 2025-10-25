import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizEngine from './QuizEngine';

export default function DiagnosticTest() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [testDefinition, setTestDefinition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    loadTestDefinition();
  }, [testId]);

  const loadTestDefinition = async () => {
    setLoading(true);
    setError(null);

    try {
      // Import the test definition based on testId
      let testData;
      
      if (testId === 'english-fluency') {
        const module = await import('../../data/tests/english-fluency.json');
        testData = module.default;
      } else if (testId === 'jvdt-7') {
        const module = await import('../../data/tests/jvdt-7.json');
        testData = module.default;
      } else {
        throw new Error(`Test not found: ${testId}`);
      }

      setTestDefinition(testData);
    } catch (err) {
      console.error('Error loading test:', err);
      setError(`Could not load test: ${testId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTestComplete = (results) => {
    // Could navigate to a results page or show a completion message
    // For now, we'll show results inline (handled by QuizEngine)
    console.log('Test completed:', results);
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleBackToTests = () => {
    navigate('/test');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading test...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 dark:text-red-400 text-lg">{error}</div>
        <button
          onClick={handleBackToTests}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Tests
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto space-y-6"
      >
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {testDefinition.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {testDefinition.description}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Test Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Estimated Time:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">{testDefinition.estimatedTime}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Questions:</span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">{testDefinition.totalQuestions}</span>
            </div>
          </div>
        </div>

        {testDefinition.categories && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Assessment Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testDefinition.categories.map(category => (
                <div key={category.id} className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Before You Begin</h2>
          <ul className="text-sm text-indigo-800 dark:text-indigo-200 space-y-1">
            <li>• Find a quiet place where you won't be interrupted</li>
            <li>• Answer all questions honestly for accurate results</li>
            <li>• Your progress will be saved automatically</li>
            <li>• You can pause and resume the test later</li>
          </ul>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleBackToTests}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Back to Tests
          </button>
          <button
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Start Test
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <QuizEngine
      testDefinition={testDefinition}
      onComplete={handleTestComplete}
    />
  );
}