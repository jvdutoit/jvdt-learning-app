import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../contexts/LanguageContext';
import { getTranslatedTestData } from '../../utils/translationHelpers';

export default function TestList() {
  const { t } = useTranslation();
  const [testHistory, setTestHistory] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestHistory();
    loadTestDefinitions();
  }, [t]);

  const loadTestDefinitions = async () => {
    setLoading(true);
    try {
      // Load all test definitions
      const testDefinitions = [];
      
      // English Fluency
      const englishModule = await import('../../data/tests/english-fluency.json');
      testDefinitions.push({
        ...englishModule.default,
        icon: '🌐',
        categories: ['Grammar & Structure', 'Vocabulary', 'Reading Comprehension', 'Practical Usage']
      });

      // JVDT-2
      const jvdt2Module = await import('../../data/tests/jvdt-2.json');
      const jvdt2Data = getTranslatedTestData(jvdt2Module.default, t);
      testDefinitions.push({
        ...jvdt2Data,
        icon: '🎨',
        categories: [
          t('jvdt2.axes.Seeing', 'Seeing') + ' (' + t('jvdt2.poles.Story', 'Story') + '↔' + t('jvdt2.poles.Facts', 'Facts') + ')',
          t('jvdt2.axes.Thinking', 'Thinking') + ' (' + t('jvdt2.poles.Why', 'Why') + '↔' + t('jvdt2.poles.How', 'How') + ')',
          t('jvdt2.axes.Doing', 'Doing') + ' (' + t('jvdt2.poles.Dream', 'Dream') + '↔' + t('jvdt2.poles.Plan', 'Plan') + ')',
          t('jvdt2.axes.Caring', 'Caring') + ' (' + t('jvdt2.poles.Kind', 'Kind') + '↔' + t('jvdt2.poles.Fair', 'Fair') + ')'
        ],
        ageGroup: jvdt2Data.targetAudience
      });

      // JVDT-4
      const jvdt4Module = await import('../../data/tests/jvdt-4.json');
      testDefinitions.push({
        ...jvdt4Module.default,
        icon: '🧠',
        categories: ['Seeing (Story↔Facts)', 'Thinking (Why↔How)', 'Doing (Dream↔Plan)', 'Caring (Kind↔Fair)']
      });

      // JVDT-7
      const jvdt7Module = await import('../../data/tests/jvdt-7.json');
      testDefinitions.push({
        ...jvdt7Module.default,
        icon: '⭐',
        categories: ['Perception (A↔N)', 'Interpretation (R↔C)', 'Reflection (I↔E)', 'Application (D↔P)', 'Motivation (S↔M)', 'Orientation (T↔H)', 'Value Expression (L↔R)']
      });

      setTests(testDefinitions);
    } catch (error) {
      console.error('Error loading test definitions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTestHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('jvdt:test-history') || '[]');
      setTestHistory(history);
    } catch (error) {
      console.warn('Could not load test history:', error);
    }
  };

  const getLastResult = (testId) => {
    return testHistory
      .filter(result => result.testId === testId)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading assessments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('common.diagnosticAssessments', 'Diagnostic Assessments')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          {t('common.diagnosticDescription', 'Discover your strengths and areas for growth with our comprehensive diagnostic tests. Each assessment provides personalized insights and recommendations for your learning journey.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {tests.map((test, index) => {
          const lastResult = getLastResult(test.id);
          
          return (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{test.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                      {test.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {test.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{t('common.duration', 'Duration')}:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{test.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{t('common.questions', 'Questions')}:</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2">{test.totalQuestions}</span>
                  </div>
                </div>

                {test.ageGroup && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                    <div className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                      👶 {t('common.perfectFor', 'Perfect for')}: {test.ageGroup}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm">{t('common.assessmentAreas', 'Assessment Areas')}:</h3>
                  <div className="flex flex-wrap gap-1">
                    {test.categories.map(category => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>

                {lastResult && (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <div className="font-medium">{t('common.lastCompleted', 'Last completed')}: {formatDate(lastResult.completedAt)}</div>
                      {lastResult.jvdtCode ? (
                        <div>JVDT Code: {lastResult.jvdtCode} • Stage: {lastResult.overallStage?.name || 'Unknown'}</div>
                      ) : lastResult.dominantCode ? (
                        <div>Learning Style: {lastResult.archetype} • Profile: {lastResult.dominantCode?.join('-') || 'Unknown'}</div>
                      ) : (
                        <div>Score: {Math.round((lastResult.score || 0) * 100)}% ({lastResult.level || 'Unknown'})</div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <Link
                    to={`/test/${test.id}`}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center font-medium"
                  >
                    {lastResult ? t('common.retakeTest', 'Retake Test') : t('common.startTest', 'Start Test')}
                  </Link>
                  {lastResult && (
                    <button
                      onClick={() => {
                        try {
                          const results = localStorage.getItem(`jvdt:test-results-${test.id}`);
                          if (results) {
                            // Could open a modal or navigate to a results page
                            console.log('View results for:', test.id, JSON.parse(results));
                            alert('Results viewing feature coming soon!');
                          }
                        } catch (error) {
                          console.warn('Could not load results:', error);
                        }
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t('common.viewResults', 'View Results')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {testHistory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">{t('common.testHistory', 'Your Test History')}</h2>
          <div className="space-y-3">
            {testHistory
              .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
              .slice(0, 5)
              .map((result, index) => {
                const test = tests.find(t => t.id === result.testId);
                return (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {test ? test.title : result.testId}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(result.completedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      {result.jvdtCode ? (
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {result.jvdtCode}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.overallStage?.name || 'JVDT Profile'}
                          </div>
                        </div>
                      ) : result.dominantCode ? (
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {result.archetype || 'Learning Style'}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.dominantCode?.join('-') || 'Kids Profile'}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {Math.round((result.score || 0) * 100)}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {result.level || 'Assessment'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}