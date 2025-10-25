import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateJVDT7Results, getJVDT7Recommendations } from './jvdt7Scorer';
import { calculateJVDT4Results, getJVDT4Recommendations } from './jvdt4Scorer';

// Question type components
function MultipleChoiceQuestion({ question, selectedAnswer, onAnswer }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{question.question}</h3>
      <div className="space-y-2">
        {question.options.map((option, index) => (
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
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function ScaleQuestion({ question, selectedAnswer, onAnswer }) {
  const { scale } = question;
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{question.question}</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          {scale.labels.map((label, index) => (
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [startTime] = useState(new Date());
  const [timeSpent, setTimeSpent] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  const currentQuestion = testDefinition.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testDefinition.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === testDefinition.questions.length - 1;
  const hasAnswer = answers[currentQuestion.id] !== undefined;

  // Save progress to localStorage
  useEffect(() => {
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
  }, [currentQuestionIndex, answers, testDefinition.id, startTime, timeSpent]);

  // Update time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((new Date() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Load saved progress on mount
  useEffect(() => {
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
  }, [testDefinition.id]);

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
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
    if (testDefinition.id === 'jvdt-7' && testDefinition.scoring?.method === 'jvdt_axes') {
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
    if (testDefinition.id === 'jvdt-4' && testDefinition.scoring?.method === 'jvdt_4_axes') {
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
      const maxScore = question.points;

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

      categoryScores[question.category].score += questionScore;
      categoryScores[question.category].maxScore += maxScore;
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
    const level = testDefinition.scoring.levels.find(level => 
      overallScore >= level.range[0] && overallScore <= level.range[1]
    );

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
    if (results.methodology === 'jvdt-7-authentic') {
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
              {testDefinition.categories.map(category => {
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
              {results.recommendations.map((recommendation, index) => (
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
            {testDefinition.categories.map(category => {
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
            {results.recommendations.map((recommendation, index) => (
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
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          {currentQuestion.type === 'multiple-choice' && (
            <MultipleChoiceQuestion
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          )}
          {currentQuestion.type === 'scale' && (
            <ScaleQuestion
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
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
    </div>
  );
}