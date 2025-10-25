import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FlashcardRenderer({ content }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showingBack, setShowingBack] = useState(false);

  if (!content?.cards || content.cards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No flashcards available
      </div>
    );
  }

  const currentCard = content.cards[currentCardIndex];
  const totalCards = content.cards.length;

  const nextCard = () => {
    setIsFlipped(false);
    setShowingBack(false);
    setCurrentCardIndex((prev) => (prev + 1) % totalCards);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setShowingBack(false);
    setCurrentCardIndex((prev) => (prev - 1 + totalCards) % totalCards);
  };

  const flipCard = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setShowingBack(!showingBack);
      setIsFlipped(false);
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Card {currentCardIndex + 1} of {totalCards}</span>
        <div className="flex space-x-1">
          {content.cards.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentCardIndex
                  ? 'bg-indigo-600'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Flashcard */}
      <div className="relative">
        <motion.div
          className={`w-full h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 cursor-pointer perspective-1000 ${
            isFlipped ? 'animate-pulse' : ''
          }`}
          onClick={flipCard}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {showingBack ? currentCard.back : currentCard.front}
              </div>
              
              {showingBack && currentCard.explanation && (
                <div className="text-sm text-gray-600 dark:text-gray-400 italic border-t border-gray-200 dark:border-gray-600 pt-4">
                  {currentCard.explanation}
                </div>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                {showingBack ? 'Click to see question' : 'Click to reveal answer'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevCard}
          disabled={totalCards <= 1}
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="mr-2">←</span>
          Previous
        </button>
        
        <div className="text-center space-y-2">
          <button
            onClick={flipCard}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {showingBack ? 'Show Question' : 'Show Answer'}
          </button>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            or click the card
          </div>
        </div>
        
        <button
          onClick={nextCard}
          disabled={totalCards <= 1}
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <span className="ml-2">→</span>
        </button>
      </div>

      {/* Quick Navigation */}
      {totalCards > 1 && (
        <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
          {content.cards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentCardIndex(index);
                setIsFlipped(false);
                setShowingBack(false);
              }}
              className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                index === currentCardIndex
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}