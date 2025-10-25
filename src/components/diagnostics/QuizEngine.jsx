import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../contexts/LanguageContext';
import { getTranslatedArchetype, getTranslatedAxisData, getTranslatedQuestion } from '../../utils/translationHelpers';
import { calculateJVDT7Results, getJVDT7Recommendations } from './jvdt7Scorer';
import { calculateJVDT4Results, getJVDT4Recommendations } from './jvdt4Scorer';
import { calculateJVDT2Results, getJVDT2Recommendations } from '../../utils/jvdt2Scorer';
import { isKidsTest } from '../../lib/isKidsTest';
import KidQuestion from './KidQuestion';

// Question type components
function MultipleChoiceQuestion({ question, selectedAnswer, onAnswer, t, testId }) {
  // For JVDT-2, translate the question on-demand
  const displayQuestion = testId === 'jvdt-2' ? getTranslatedQuestion(question, t) : question;
  
  // Handle different question text properties - be more robust
  const questionText = displayQuestion.text || displayQuestion.question || 'Question text missing';
  const questionOptions = displayQuestion.options || [];

  // Safety check
  if (!questionOptions.length) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{questionText}</h3>
        <div className="text-red-600 dark:text-red-400">
          Error: No options found for this question
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Question ID: {question.id}, Test: {testId}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{questionText}</h3>
      <div className="space-y-2">
        {questionOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(index)}
            className={`w-full text-left p-4 rounded-lg border transition-colors ${
              selectedAnswer === index
                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <span className="font-medium text-indigo-600 dark:text-indigo-400 mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            {typeof option === 'string' ? option : option.text || option.label || 'Option text missing'}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScaleQuestion({ question, selectedAnswer, onAnswer, t, testId }) {
  // For JVDT-2, translate the question on-demand
  const displayQuestion = testId === 'jvdt-2' ? getTranslatedQuestion(question, t) : question;
  
  // Handle different question text properties
  const questionText = displayQuestion.text || displayQuestion.question || displayQuestion.prompt || 'Question text missing';
  const scale = displayQuestion.scale || { labels: ['1', '2', '3', '4', '5'] }; // Default scale
  
  // Safety check for scale
  if (!scale || !scale.labels || scale.labels.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{questionText}</h3>
        <div className="text-red-600 dark:text-red-400">
          Error: Invalid scale configuration for this question
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Question ID: {question.id}, Test: {testId}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{questionText}</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {(scale.labels || []).map((label, index) => (
            <button
              key={index}
              onClick={() => onAnswer(index + 1)}
              className={`flex flex-col items-center p-3 rounded-lg border transition-colors min-w-[100px] ${
                selectedAnswer === index + 1
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {index + 1}
              </span>
              <span className="text-sm text-center text-gray-600 dark:text-gray-400">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main QuizEngine component
export default function QuizEngine({ testDefinition, onComplete }) {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(new Date());
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Basic validation with detailed error reporting
  if (!testDefinition) {
    console.error('QuizEngine: No testDefinition provided');
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 dark:text-red-400 text-lg">
          Error: No test definition provided
        </div>
      </div>
    );
  }
  
  if (!testDefinition.questions) {
    console.error('QuizEngine: No questions property in testDefinition');
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 dark:text-red-400 text-lg">
          Error: No questions found in test
        </div>
      </div>
    );
  }
  
  if (!Array.isArray(testDefinition.questions)) {
    console.error('QuizEngine: Questions is not an array:', typeof testDefinition.questions);
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 dark:text-red-400 text-lg">
          Error: Questions data is invalid
        </div>
      </div>
    );
  }
  
  if (testDefinition.questions.length === 0) {
    console.error('QuizEngine: Questions array is empty');
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 dark:text-red-400 text-lg">
          Error: No questions available
        </div>
      </div>
    );
  }
  
  const currentQuestion = testDefinition.questions[currentQuestionIndex];
  const progress = currentQuestion ? ((currentQuestionIndex + 1) / testDefinition.questions.length) * 100 : 100;
  const isLastQuestion = currentQuestionIndex === testDefinition.questions.length - 1;
  const hasAnswer = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  // Save progress to localStorage
  useEffect(() => {
    if (!testDefinition?.id) return;
    
    const progressKey = `jvdt:test-progress-${testDefinition.id}`;
    const progressData = {
      testId: testDefinition.id,
      currentQuestion: currentQuestionIndex,
      answers,
      startTime: startTime.toISOString(),
      timeSpent
    };
    
    try {
      localStorage.setItem(progressKey, JSON.stringify(progressData));
    } catch (error) {
      console.warn('Could not save test progress:', error);
    }
  }, [currentQuestionIndex, answers, testDefinition?.id, startTime, timeSpent]);

  // Update time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((new Date() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Load saved progress on mount
  useEffect(() => {
    if (!testDefinition?.id) return;
    
    const progressKey = `jvdt:test-progress-${testDefinition.id}`;
    try {
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        const progressData = JSON.parse(saved);
        if (progressData.testId === testDefinition.id) {
          setCurrentQuestionIndex(progressData.currentQuestion);
          setAnswers(progressData.answers);
          // Note: We keep the new startTime to not confuse the timer
        }
      }
    } catch (error) {
      console.warn('Could not load test progress:', error);
    }
  }, [testDefinition?.id]);

  // Safety check for current question (must come after all hooks)
  if (!currentQuestion) {
    console.error('Current question not found:', { currentQuestionIndex, totalQuestions: testDefinition.questions.length });
    // If we're beyond the last question, the test should be completed
    if (currentQuestionIndex >= testDefinition.questions.length) {
      if (!showResults && !results) {
        // Trigger completion if not already done
        setTimeout(() => {
          setCurrentQuestionIndex(testDefinition.questions.length - 1);
          calculateResults();
        }, 0);
      }
    }
    return (
      <div className="text-center space-y-4">
        <div className="text-red-600 dark:text-red-400 text-lg">
          {currentQuestionIndex >= testDefinition.questions.length ? 
            'Completing assessment...' : 
            'Error: Question not found'
          }
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          Question index: {currentQuestionIndex} / {testDefinition.questions.length}
        </div>
      </div>
    );
  }

  const handleAnswer = (answer) => {
    if (!currentQuestion) {
      console.warn('Cannot handle answer - no current question');
      return;
    }
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [currentQuestion.id]: answer
      };
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    
    // Check if this is the authentic JVDT-7 test
    if (testDefinition && testDefinition.id === 'jvdt-7' && testDefinition.scoring?.method === 'jvdt_axes') {
      // Use authentic JVDT-7 scoring methodology
      const jvdt7Results = calculateJVDT7Results(testDefinition, answers);
      const recommendations = getJVDT7Recommendations(jvdt7Results, testDefinition);
      
      const finalResults = {
        testId: testDefinition.id,
        completedAt: new Date().toISOString(),
        timeSpent,
        methodology: 'jvdt-7-authentic',
        ...jvdt7Results,
        recommendations,
        answers
      };

      setResults(finalResults);
      setShowResults(true);

      // Save results to localStorage
      const resultsKey = `jvdt:test-results-${testDefinition.id}`;
      const historyKey = 'jvdt:test-history';
      
      try {
        localStorage.setItem(resultsKey, JSON.stringify(finalResults));
        
        // Add to history
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        history.push({
          testId: testDefinition.id,
          completedAt: finalResults.completedAt,
          jvdtCode: finalResults.jvdtCode,
          overallStage: finalResults.overallStage,
          integrationIndex: finalResults.integrationIndex
        });
        localStorage.setItem(historyKey, JSON.stringify(history));

        // Clear progress
        localStorage.removeItem(`jvdt:test-progress-${testDefinition.id}`);
      } catch (error) {
        console.warn('Could not save test results:', error);
      }

      if (onComplete) {
        onComplete(finalResults);
      }
      return;
    }

    // Check if this is the JVDT-4 test
    if (testDefinition && testDefinition.id === 'jvdt-4' && testDefinition.scoring?.method === 'jvdt_4_axes') {
      // Use JVDT-4 scoring methodology
      const jvdt4Results = calculateJVDT4Results(testDefinition, answers);
      const recommendations = getJVDT4Recommendations(jvdt4Results, testDefinition);
      
      const finalResults = {
        testId: testDefinition.id,
        completedAt: new Date().toISOString(),
        timeSpent,
        methodology: 'jvdt-4-cognitive',
        ...jvdt4Results,
        recommendations,
        answers
      };

      setResults(finalResults);
      setShowResults(true);

      // Save results to localStorage
      const resultsKey = `jvdt:test-results-${testDefinition.id}`;
      const historyKey = 'jvdt:test-history';
      
      try {
        localStorage.setItem(resultsKey, JSON.stringify(finalResults));
        
        // Add to history
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        history.push({
          testId: testDefinition.id,
          completedAt: finalResults.completedAt,
          jvdtCode: finalResults.jvdtCode,
          overallStage: finalResults.overallStage,
          integrationIndex: finalResults.integrationIndex
        });
        localStorage.setItem(historyKey, JSON.stringify(history));

        // Clear progress
        localStorage.removeItem(`jvdt:test-progress-${testDefinition.id}`);
      } catch (error) {
        console.warn('Could not save test results:', error);
      }

      if (onComplete) {
        onComplete(finalResults);
      }
      return;
    }

    // Check if this is the JVDT-2 test (with null safety)
    if (testDefinition && testDefinition.id === 'jvdt-2' && testDefinition.methodology === 'jvdt-2-kids') {
      // Convert answers to the format expected by JVDT-2 scorer
      const jvdt2Answers = (testDefinition.questions || []).map(question => {
        const selectedAnswerIndex = answers[question.id];
        if (selectedAnswerIndex === undefined || selectedAnswerIndex === null) return null;
        
        const selectedOption = (question.options || [])[selectedAnswerIndex];
        if (!selectedOption) return null;
        
        return {
          questionId: question.id,
          selectedOption: selectedOption.id,
          axis: question.axis,
          pole: selectedOption.pole
        };
      }).filter(answer => answer !== null);

      // Use JVDT-2 scoring methodology
      const jvdt2Results = calculateJVDT2Results(jvdt2Answers);
      const recommendations = getJVDT2Recommendations(jvdt2Results);
      
      const finalResults = {
        testId: testDefinition.id,
        completedAt: new Date().toISOString(),
        timeSpent,
        methodology: 'jvdt-2-kids',
        ...jvdt2Results,
        recommendations,
        answers
      };

      setResults(finalResults);
      setShowResults(true);

      // Save results to localStorage
      const resultsKey = `jvdt:test-results-${testDefinition.id}`;
      const historyKey = 'jvdt:test-history';
      
      try {
        localStorage.setItem(resultsKey, JSON.stringify(finalResults));
        
        // Add to history
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
        history.push({
          testId: testDefinition.id,
          completedAt: finalResults.completedAt,
          dominantCode: finalResults.dominantCode,
          archetype: finalResults.archetype.title,
          integrationScore: finalResults.integrationScore.score
        });
        localStorage.setItem(historyKey, JSON.stringify(history));

        // Clear progress
        localStorage.removeItem(`jvdt:test-progress-${testDefinition.id}`);
      } catch (error) {
        console.warn('Could not save test results:', error);
      }

      if (onComplete) {
        onComplete(finalResults);
      }
      return;
    }

    // Original scoring logic for other tests
    const categoryScores = {};
    let totalScore = 0;
    let totalPoints = 0;

    // Initialize category scores
    testDefinition.categories.forEach(category => {
      categoryScores[category.id] = { score: 0, maxScore: 0 };
    });

    // Calculate scores for each question
    testDefinition.questions.forEach(question => {
      const answer = answers[question.id];
      let questionScore = 0;
      const maxScore = question.points || 1; // Default to 1 point if not specified

      if (question.type === 'multiple-choice') {
        if (answer === question.correctAnswer) {
          questionScore = maxScore;
        }
      } else if (question.type === 'scale') {
        // For scale questions, normalize the score (1-5 becomes 0-1)
        if (answer !== undefined) {
          questionScore = ((answer - 1) / 4) * maxScore;
        }
      }

      // Make sure category exists in categoryScores
      if (categoryScores[question.category]) {
        categoryScores[question.category].score += questionScore;
        categoryScores[question.category].maxScore += maxScore;
      } else {
        console.warn(`Category ${question.category} not found in test definition categories`);
      }
      
      totalScore += questionScore;
      totalPoints += maxScore;
    });

    // Normalize category scores (0-1)
    Object.keys(categoryScores).forEach(categoryId => {
      const category = categoryScores[categoryId];
      category.normalized = category.maxScore > 0 ? category.score / category.maxScore : 0;
    });

    const overallScore = totalPoints > 0 ? totalScore / totalPoints : 0;

    // Determine level based on overall score
    const level = testDefinition.scoring?.levels?.find(level => 
      overallScore >= level.range[0] && overallScore <= level.range[1]
    ) || { name: 'Unknown', description: 'Could not determine level', recommendations: [] };

    const finalResults = {
      testId: testDefinition.id,
      completedAt: new Date().toISOString(),
      timeSpent,
      totalScore: overallScore,
      categoryScores,
      level: level ? level.name : 'Unknown',
      levelDescription: level ? level.description : '',
      recommendations: level ? level.recommendations : [],
      answers
    };

    setResults(finalResults);
    setShowResults(true);

    // Save results to localStorage
    const resultsKey = `jvdt:test-results-${testDefinition.id}`;
    const historyKey = 'jvdt:test-history';
    
    try {
      localStorage.setItem(resultsKey, JSON.stringify(finalResults));
      
      // Add to history
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      history.push({
        testId: testDefinition.id,
        completedAt: finalResults.completedAt,
        score: overallScore,
        level: finalResults.level
      });
      localStorage.setItem(historyKey, JSON.stringify(history));

      // Clear progress
      localStorage.removeItem(`jvdt:test-progress-${testDefinition.id}`);
    } catch (error) {
      console.warn('Could not save test results:', error);
    }

    if (onComplete) {
      onComplete(finalResults);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showResults && results) {
    // Render JVDT-7 authentic results
    if (results && results.methodology === 'jvdt-7-authentic') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {testDefinition.title} Results
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Completed in {formatTime(timeSpent)}
            </div>
          </div>

          {/* JVDT Code and Overall Stage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your JVDT Profile</h3>
            <div className="space-y-4">
              <div className="text-center p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {results.jvdtCode}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Perception · Interpretation · Reflection · Application · Motivation · Orientation · Value Expression
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Overall Stage: {results.overallStage.name}
                </div>
                <div className="text-gray-700 dark:text-gray-300 mt-2">
                  {results.overallStage.description}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Integration Index</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(results.integrationIndex * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results.integrationIndex * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Measures balance across all axes
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Stage</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {results.overallStage.averageStage} / 5.0
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(results.overallStage.averageStage / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Virtue Ladder development level
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Axis Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Seven Axes Analysis</h3>
            <div className="space-y-4">
              {(testDefinition.categories || []).map(category => {
                if (!category.axis) return null;
                
                const axisResult = results.axisResults[category.axis];
                const axisStage = results.axisStages[category.axis];
                const stageInfo = category.stages?.find(s => s.stage === axisStage);
                
                if (!axisResult) return null;
                
                const preferenceText = axisResult.preference === 'balanced' 
                  ? 'Balanced' 
                  : axisResult.preference === 'first' 
                    ? category.poles?.association || category.poles?.root || category.poles?.internal || category.poles?.dream || category.poles?.self || category.poles?.task || category.poles?.love || 'First pole'
                    : category.poles?.analysis || category.poles?.context || category.poles?.external || category.poles?.pragmatic || category.poles?.mission || category.poles?.horizon || category.poles?.respect || 'Second pole';
                
                return (
                  <div key={category.axis} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{category.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          Stage {axisStage}: {stageInfo?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {preferenceText}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Balance</span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {Math.round(axisResult.balance * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-emerald-500 h-1 rounded-full transition-all duration-500"
                            style={{ width: `${axisResult.balance * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Margin</span>
                          <span className="text-gray-800 dark:text-gray-200">
                            {Math.round(axisResult.margin * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                          <div
                            className="bg-orange-500 h-1 rounded-full transition-all duration-500"
                            style={{ width: `${axisResult.margin * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {stageInfo && (
                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">
                        <div className="text-sm">
                          <div className="font-medium text-blue-900 dark:text-blue-200 mb-1">
                            Current Practice:
                          </div>
                          <div className="text-blue-800 dark:text-blue-300 text-xs">
                            {stageInfo.practice}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Development Recommendations</h3>
            <ul className="space-y-3">
              {(results.recommendations || []).map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-indigo-600 dark:text-indigo-400 mr-2 flex-shrink-0 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      );
    }

    // Render JVDT-4 cognitive results
    if (results && results.methodology === 'jvdt-4-cognitive') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {testDefinition.title} Results
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Completed in {formatTime(timeSpent)}
            </div>
          </div>

          {/* JVDT-4 Code and Overall Stage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Your JVDT-4 Cognitive Profile</h3>
            <div className="space-y-4">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {results.jvdtCode}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Seeing · Thinking · Doing · Caring
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Overall Stage: {results.overallStage.name}
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                  Average Development Level: {results.overallStage.average?.toFixed(1)}/5.0
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Integration Index</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {results.integrationIndex}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${results.integrationIndex}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Balance across four cognitive axes
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Development Stage</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {results.overallStage.stage} / 5
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(results.overallStage.stage / 5) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Virtue Ladder progression
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Four Axes Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Four Axes Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(testDefinition.categories || []).map(category => {
                if (!category.axis) return null;
                
                const axisResult = results.axisResults[category.axis];
                const axisStage = results.axisStages[category.axis];
                
                if (!axisResult || !axisStage) return null;
                
                const preferenceText = axisResult.preference === 'balanced' 
                  ? 'Balanced' 
                  : axisResult.preference;
                
                return (
                  <div key={category.axis} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{category.name}</h4>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {axisStage.name}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Preference: <span className="font-medium capitalize">{preferenceText}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${axisResult.balance * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Balance: {Math.round(axisResult.balance * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Development Recommendations</h3>
            <div className="space-y-4">
              {(results.recommendations || []).map((recommendation, index) => (
                <div key={index} className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                  <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2 capitalize">
                    {recommendation.axis} - {recommendation.stage}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {recommendation.description}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Practice:</strong> {recommendation.practice}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Reflection:</strong> {recommendation.reflection}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setAnswers({});
                setTimeSpent(0);
                setResults(null);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Take Another Assessment
            </button>
          </div>
        </motion.div>
      );
    }

  // Render JVDT-2 kids results
  if (results && results.methodology === 'jvdt-2-kids') {
    // Get translated archetype data
    const translatedArchetype = getTranslatedArchetype(results.archetype, t);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('jvdt2.resultsTitle', '🎉 Your Learning Style Results! 🎉')}
          </h2>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            {t('common.completed', 'Completed')} in {formatTime(timeSpent)}
          </div>
        </div>

        {/* Kid's Archetype Display */}
        <div className={`bg-gradient-to-r ${results.archetype.gradient} rounded-lg p-6 shadow-lg border-2 border-white dark:border-gray-700`}>
          <div className="text-center space-y-4">
            <div className="text-6xl mb-2">{results.archetype.badge}</div>
            <h3 className="text-2xl font-bold text-gray-900">{translatedArchetype.title}</h3>
            <p className="text-lg text-gray-800">{translatedArchetype.tagline}</p>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-4 mt-4">
              <p className="text-gray-900 dark:text-gray-100 text-lg font-medium">
                {translatedArchetype.kidDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Your Learning Powers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100 text-center">
            {t('jvdt2.learningPowers', '🌟 Your Learning Powers 🌟')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(results.axisDetails || {}).map(([axis, details]) => {
              const axisTranslations = getTranslatedAxisData(axis, t);
              return (
                <div key={axis} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-3xl mb-2">{details.dominantIcon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{axisTranslations.axis}</div>
                  <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                    {details.isBalanced ? t('jvdt2.balanced', 'Balanced! 🤝') : 
                      `${axisTranslations[details.dominantPole] || details.dominantPole} ${details.isStrong ? '⭐' : ''}`}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {details.percentageA}% - {details.percentageB}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Learning Style Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t('jvdt2.detailsTitle', 'Your Learning Style Details')}
          </h3>
          <div className="space-y-4">
            {Object.entries(results.axisDetails || {}).map(([axis, details]) => {
              const axisTranslations = getTranslatedAxisData(axis, t);
              return (
                <div key={axis} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      {details.iconA} {axisTranslations.axis} {details.iconB}
                    </span>
                    {details.isBalanced && (
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                        {t('jvdt2.balanced', 'Balanced! 🤝')}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
                    <span>
                      {axisTranslations[details.poleA] || details.poleA} {details.scoreA >= 8 ? '⭐' : ''} {details.percentageA}%
                    </span>
                    <span>
                      {details.percentageB}% {details.scoreB >= 8 ? '⭐' : ''} {axisTranslations[details.poleB] || details.poleB}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                    <div 
                      style={{ width: `${details.percentageA}%` }} 
                      className="h-3 bg-sky-500 dark:bg-sky-400 rounded-l-full"
                    ></div>
                    <div 
                      style={{ width: `${details.percentageB}%` }} 
                      className="h-3 bg-rose-400 dark:bg-rose-500 rounded-r-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Score */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t('jvdt2.integrationTitle', 'How Balanced Are You?')}
          </h3>
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {results.integrationScore.score}/100
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              {results.integrationScore.description}
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${results.integrationScore.score}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Balanced Axes: {results.integrationScore.balancedAxes}/4 • 
              Strong Preferences: {results.integrationScore.strongAxes}/4
            </div>
          </div>
        </div>

        {/* For Teachers Section */}
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-amber-900 dark:text-amber-100 flex items-center">
            {t('jvdt2.teachersTitle', '👩‍🏫 For Teachers & Parents 📚')}
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                {t('jvdt2.learningProfile', 'Learning Profile:')}
              </h4>
              <p className="text-amber-700 dark:text-amber-300 text-sm">{translatedArchetype.teacher}</p>
            </div>
            
            {(results.teacherTips || []).length > 0 && (
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  {t('jvdt2.teachingTips', 'Teaching Tips:')}
                </h4>
                <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                  {(results.teacherTips || []).map((tip, index) => {
                    const axisTranslations = getTranslatedAxisData(tip.axis, t);
                    return (
                      <li key={index} className="flex items-start">
                        <span className="text-amber-600 dark:text-amber-400 mr-2">•</span>
                        <span>
                          <strong>{axisTranslations.axis} ({axisTranslations[tip.pole] || tip.pole}):</strong> {tip.suggestion}
                          {tip.strength && <span className="text-amber-600 dark:text-amber-400 ml-1">⭐</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                {t('jvdt2.parentTips', 'Parent Tips:')}
              </h4>
              <div className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                {(results.recommendations?.forParent || []).map((tip, index) => (
                  <p key={index}>{tip}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {t('jvdt2.nextStepsTitle', '🚀 Next Steps for Growth')}
          </h3>
          <ul className="space-y-2">
            {(results.recommendations?.nextSteps || []).map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">✨</span>
                <span className="text-gray-700 dark:text-gray-300">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Completion Badge */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-4 py-2 rounded-full border border-green-200 dark:border-green-800">
            <span className="text-2xl">🏆</span>
            <span className="font-medium">{t('jvdt2.assessmentComplete', 'Assessment Complete!')}</span>
            <span className="text-2xl">🎉</span>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
              setAnswers({});
              setTimeSpent(0);
              setResults(null);
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Another Assessment
          </button>
        </div>
      </motion.div>
    );
  }

    // Original results display for other tests
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {testDefinition.title} Results
          </h2>
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Completed in {formatTime(timeSpent)}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Overall Assessment</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Score</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(results.totalScore * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${results.totalScore * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{results.level}</div>
              <div className="text-gray-700 dark:text-gray-300 mt-2">{results.levelDescription}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Category Breakdown</h3>
          <div className="space-y-4">
            {(testDefinition.categories || []).map(category => {
              const categoryResult = results.categoryScores[category.id];
              const score = categoryResult ? categoryResult.normalized : 0;
              
              return (
                <div key={category.id}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {Math.round(score * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recommendations</h3>
          <ul className="space-y-2">
            {(results.recommendations || []).map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>
                <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {testDefinition.title}
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {testDefinition.questions.length} • {formatTime(timeSpent)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        
        {(currentQuestion?.type === 'multiple-choice' || !currentQuestion?.type) ? (
          isKidsTest(testDefinition) ? (
            <KidQuestion
              testDefinition={testDefinition}
              question={currentQuestion}
              index={currentQuestionIndex}
              total={testDefinition.questions.length}
              answeredCount={Object.keys(answers).length}
              onSelect={handleAnswer}
              onNext={handleNext}
              onBack={currentQuestionIndex > 0 ? () => setCurrentQuestionIndex(prev => prev - 1) : undefined}
              onSkip={undefined} // Let KidQuestion handle local skip logic
            />
          ) : (
            <MultipleChoiceQuestion
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
              t={t}
              testId={testDefinition.id}
            />
          )
        ) : currentQuestion?.type === 'scale' ? (
          <ScaleQuestion
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            t={t}
            testId={testDefinition.id}
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="text-red-600 dark:text-red-400">
              {currentQuestion ? 
                `Unsupported question type: ${currentQuestion.type}` : 
                'No current question found'
              }
            </div>
            {currentQuestion && (
              <div className="text-gray-600 dark:text-gray-400">
                Question ID: {currentQuestion.id} | Test: {testDefinition.id}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation - hidden for kids tests since KidQuestion handles its own navigation */}
      {!isKidsTest(testDefinition) && (
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200"
          >
            ← Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLastQuestion ? 'Complete Test' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}