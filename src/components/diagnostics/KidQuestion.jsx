import React, { useState } from 'react';
import KidProgressDots from './KidProgressDots';
import KidChoiceCard from './KidChoiceCard';
import { useTTS } from '../../lib/useTTS';

const EMOJI = {
  Facts: "📊",
  Story: "🖼️", 
  Why: "❓",
  How: "⚙️",
  Dream: "💭",
  Plan: "🗺️",
  Kind: "💖",
  Fair: "⚖️"
};

export default function KidQuestion({
  testDefinition,
  question,
  index,
  total,
  answeredCount,
  onSelect,
  onNext, // Add onNext prop for auto-advancing
  onBack,
  onSkip
}) {
  const { start } = useTTS();
  const [skipsLeft, setSkipsLeft] = useState(4);
  
  // Simple deterministic swap based on question index
  const swap = (index % 2) === 1;
  
  // Extract the two options from JVDT-2 question format
  const optionA = question.options?.[0] || { pole: "Choice", text: "Option A" };
  const optionB = question.options?.[1] || { pole: "Choice", text: "Option B" };
  
  const left = swap ? optionB : optionA;
  const right = swap ? optionA : optionB;
  
  const handleSelect = (choice) => {
    // Map back to original option based on swap
    const originalChoice = swap ? (choice === "A" ? 1 : 0) : (choice === "A" ? 0 : 1);
    onSelect(originalChoice);
    
    // Auto-advance to next question after a short delay for visual feedback
    setTimeout(() => {
      if (onNext) {
        onNext();
      }
    }, 300); // 300ms delay for visual feedback
  };

  const handleSkip = () => {
    if (skipsLeft > 0) {
      setSkipsLeft(prev => prev - 1);
      if (onSkip) {
        onSkip();
      } else {
        // Local skip - advance without answering (set null answer)
        onSelect(null);
        // Auto-advance after skipping
        setTimeout(() => {
          if (onNext) {
            onNext();
          }
        }, 300);
      }
    }
  };

  const speak = () => {
    const text = `Question ${index + 1}. Choice one: ${left.text}. Choice two: ${right.text}. Pick the one more like you.`;
    start(text);
  };

  return (
    <div className="max-w-4xl mx-auto rounded-3xl bg-white shadow-xl p-8 md:p-10">
      <KidProgressDots current={index} total={total} />
      
      <p 
        aria-live="polite" 
        className="text-center text-sky-700 font-semibold mb-6 text-2xl md:text-3xl"
      >
        Question {index + 1} of {total}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KidChoiceCard
          palette="A"
          title={left.pole}
          text={left.text}
          emoji={EMOJI[left.pole] ?? "📘"}
          ariaLabel={`${left.pole} — ${left.text}`}
          onClick={() => handleSelect("A")}
        />
        <KidChoiceCard
          palette="B"
          title={right.pole}
          text={right.text}
          emoji={EMOJI[right.pole] ?? "📘"}
          ariaLabel={`${right.pole} — ${right.text}`}
          onClick={() => handleSelect("B")}
        />
      </div>
      
      <div className="flex items-center justify-between mt-6 text-sky-700">
        <button 
          className="underline disabled:opacity-50" 
          disabled={!onBack} 
          onClick={onBack}
        >
          Back
        </button>
        <button 
          className="underline" 
          onClick={speak}
        >
          🔊 Read this
        </button>
        <button 
          className="underline disabled:opacity-50" 
          disabled={skipsLeft === 0} 
          onClick={handleSkip}
        >
          Not sure ({skipsLeft} left)
        </button>
      </div>
    </div>
  );
}