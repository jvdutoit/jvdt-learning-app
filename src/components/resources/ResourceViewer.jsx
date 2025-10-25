import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import static resources
import staticResources from '../../data/resources/static-resources.json';

// Import format renderers
import FlashcardRenderer from './formats/FlashcardRenderer';
import AssessmentRenderer from './formats/AssessmentRenderer';

export default function ResourceViewer() {
  const { resourceId } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadResource();
  }, [resourceId]);

  const loadResource = () => {
    setLoading(true);
    setError(null);

    try {
      // Check static resources first
      let foundResource = staticResources.find(r => r.id === resourceId);
      
      // If not found, check generated resources
      if (!foundResource) {
        const generatedResources = JSON.parse(localStorage.getItem('jvdt:generated-resources') || '[]');
        foundResource = generatedResources.find(r => r.id === resourceId);
      }

      if (foundResource) {
        setResource(foundResource);
      } else {
        setError('Resource not found');
      }
    } catch (err) {
      setError('Error loading resource');
      console.error('Resource loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadResource = () => {
    if (!resource) return;

    const content = JSON.stringify(resource, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      flashcards: '🃏',
      workbook: '📖',
      assessment: '📊',
      scenarios: '🎭',
      toolkit: '🧰',
      guide: '📋'
    };
    return icons[type] || '📄';
  };

  const renderContent = () => {
    if (!resource.content) return null;

    switch (resource.type) {
      case 'flashcards':
        return <FlashcardRenderer content={resource.content} />;

      case 'assessment':
        return <AssessmentRenderer content={resource.content} />;

      case 'scenarios':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Scenarios ({resource.content.scenarios?.length || 0} scenarios)
            </h3>
            <div className="space-y-6">
              {resource.content.scenarios?.map((scenario, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Scenario {index + 1}: {scenario.title}
                  </h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{scenario.description}</p>
                    
                    {scenario.questions && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Discussion Questions:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {scenario.questions.map((question, qIndex) => (
                            <li key={qIndex} className="text-gray-600 dark:text-gray-400">{question}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {scenario.learning_objectives && (
                      <div className="mt-4">
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Learning Objectives:</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {scenario.learning_objectives.map((objective, oIndex) => (
                            <li key={oIndex} className="text-gray-600 dark:text-gray-400">{objective}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'workbook':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Workbook Sections ({resource.content.sections?.length || 0} sections)
            </h3>
            <div className="space-y-6">
              {resource.content.sections?.map((section, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {section.title}
                  </h4>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{section.content}</p>
                    
                    {section.activities && (
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Activities:</h5>
                        <ul className="list-disc list-inside space-y-2">
                          {section.activities.map((activity, aIndex) => (
                            <li key={aIndex} className="text-gray-600 dark:text-gray-400">{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'toolkit':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Tools & Strategies ({resource.content.tools?.length || 0} tools)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resource.content.tools?.map((tool, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    🛠️ {tool.name}
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Description: </span>
                      <span className="text-gray-600 dark:text-gray-400">{tool.description}</span>
                    </div>
                    
                    {tool.instructions && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">How to use: </span>
                        <span className="text-gray-600 dark:text-gray-400">{tool.instructions}</span>
                      </div>
                    )}
                    
                    {tool.when_to_use && (
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">When to use: </span>
                        <span className="text-gray-600 dark:text-gray-400">{tool.when_to_use}</span>
                      </div>
                    )}
                    
                    {tool.example && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Example: </span>
                        <span className="text-gray-600 dark:text-gray-400">{tool.example}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'guide':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Step-by-Step Guide ({resource.content.steps?.length || 0} steps)
            </h3>
            <div className="space-y-6">
              {resource.content.steps?.map((step, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {step.step_number || index + 1}
                    </div>
                  </div>
                  <div className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{step.description}</p>
                    
                    {step.tips && step.tips.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">💡 Tips:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {step.tips.map((tip, tIndex) => (
                            <li key={tIndex} className="text-green-600 dark:text-green-400">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {step.common_mistakes && step.common_mistakes.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-700 dark:text-red-300 mb-2">⚠️ Common Mistakes:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {step.common_mistakes.map((mistake, mIndex) => (
                            <li key={mIndex} className="text-red-600 dark:text-red-400">{mistake}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Resource Content
            </h3>
            <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap overflow-auto">
              {JSON.stringify(resource.content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading resource...</div>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return <Navigate to="/resources" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Navigation */}
      <div>
        <Link
          to="/resources"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
        >
          <span className="mr-2">←</span>
          Back to Resource Library
        </Link>
      </div>

      {/* Resource Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">{getTypeIcon(resource.type)}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {resource.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                {resource.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(resource.difficulty)}`}>
                  {resource.difficulty}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {resource.type}
                </span>
                {resource.isStatic && (
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                    Curated Resource
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={downloadResource}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              title="Download Resource"
            >
              📥 Download
            </button>
          </div>
        </div>

        {/* Resource Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-t border-gray-200 dark:border-gray-600">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Target Age</h3>
            <p className="text-gray-900 dark:text-gray-100">{resource.targetAge}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration</h3>
            <p className="text-gray-900 dark:text-gray-100">{resource.estimatedDuration}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h3>
            <p className="text-gray-900 dark:text-gray-100 capitalize">{resource.category?.replace('-', ' ')}</p>
          </div>
        </div>

        {/* JVDT Keys */}
        {resource.jvdtKeys && resource.jvdtKeys.length > 0 && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">JVDT Keys</h3>
            <div className="flex flex-wrap gap-2">
              {resource.jvdtKeys.map(key => (
                <span
                  key={key}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="py-4 border-t border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Resource Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        {renderContent()}
      </motion.div>

      {/* Resource Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center space-x-4"
      >
        <Link
          to="/resources"
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Browse More Resources
        </Link>
        <Link
          to="/resources/generate"
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Generate Similar Resource
        </Link>
      </motion.div>
    </div>
  );
}