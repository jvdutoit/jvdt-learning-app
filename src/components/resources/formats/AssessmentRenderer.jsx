import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AssessmentRenderer({ content }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  if (!content?.questions || content.questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No assessment questions available
      </div>
    );
  }

  const questions = content.questions;
  const totalQuestions = questions.length;

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return { correct, total: totalQuestions, percentage: Math.round((correct / totalQuestions) * 100) };
  };

  const resetAssessment = () => {
    setUserAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setShowExplanations(false);
  };

  const isQuestionAnswered = (index) => userAnswers.hasOwnProperty(index);
  const allQuestionsAnswered = questions.every((_, index) => isQuestionAnswered(index));

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <div className="text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Assessment Complete!
          </h2>
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            {score.percentage}%
          </div>
          <div className="text-gray-600 dark:text-gray-400">
            {score.correct} out of {score.total} questions correct
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowExplanations(!showExplanations)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showExplanations ? 'Hide' : 'Show'} Explanations
          </button>
          <button
            onClick={resetAssessment}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Retake Assessment
          </button>
        </div>

        {/* Results Breakdown */}
        {showExplanations && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Question Review
            </h3>
            {questions.map((question, index) => {
              const userAnswer = userAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-lg border ${
                    isCorrect
                      ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                      : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                  }`}
                >
                  <div className="flex items-start space-x-3 mb-4">
                    <span className={`text-lg ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {index + 1}. {question.question}
                      </h4>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700 dark:text-gray-300">Your answer: </span>
                          <span className={isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                            {userAnswer}
                          </span>
                        </div>
                        
                        {!isCorrect && (
                          <div>
                            <span className="font-medium text-gray-700 dark:text-gray-300">Correct answer: </span>
                            <span className="text-green-700 dark:text-green-300">
                              {question.correct_answer}
                            </span>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Explanation: </span>
                            {question.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Question {currentQuestion + 1} of {totalQuestions}</span>
          <span>{Object.keys(userAnswers).length} answered</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          {question.question}
        </h2>

        {question.type === 'multiple_choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQuestion, option)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  userAnswers[currentQuestion] === option
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    userAnswers[currentQuestion] === option
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {userAnswers[currentQuestion] === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{String.fromCharCode(65 + index)}. {option}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type !== 'multiple_choice' && (
          <textarea
            value={userAnswers[currentQuestion] || ''}
            onChange={(e) => handleAnswerSelect(currentQuestion, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            rows={4}
          />
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="mr-2">←</span>
          Previous
        </button>

        <div className="flex space-x-2">
          {allQuestionsAnswered && (
            <button
              onClick={() => setShowResults(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              View Results
            </button>
          )}
        </div>

        <button
          onClick={() => setCurrentQuestion(Math.min(totalQuestions - 1, currentQuestion + 1))}
          disabled={currentQuestion === totalQuestions - 1}
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <span className="ml-2">→</span>
        </button>
      </div>

      {/* Question Grid */}
      <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestion(index)}
            className={`w-10 h-10 rounded text-sm font-medium transition-colors ${
              index === currentQuestion
                ? 'bg-indigo-600 text-white'
                : isQuestionAnswered(index)
                ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}