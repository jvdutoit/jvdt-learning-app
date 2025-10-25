// Helper function to get translated test content
export function getTranslatedTestData(testData, t) {
  if (!testData) return testData;

  // For JVDT-2, only translate basic metadata, not all questions (for performance)
  if (testData.id === 'jvdt-2') {
    return {
      ...testData,
      title: t('jvdt2.title', testData.title),
      description: t('jvdt2.description', testData.description),
      estimatedTime: t('jvdt2.estimatedTime', testData.estimatedTime),
      timeEstimate: t('jvdt2.estimatedTime', testData.timeEstimate), 
      targetAudience: t('jvdt2.ageGroup', testData.targetAudience),
      instructions: t('jvdt2.instructions', testData.instructions),
      // Keep questions as-is for now, translate them on-demand in QuizEngine
      questions: testData.questions
    };
  }

  // For other tests, return as-is (can be extended later)
  return testData;
}

// Helper function to translate a single question on-demand (for performance)
export function getTranslatedQuestion(question, t) {
  if (!question) return question;
  
  // For now, return the original question since we don't have all translations
  // This prevents the translation fallback from corrupting the question text
  return question;
  
  // TODO: Re-enable this when we have complete translations
  // return {
  //   ...question,
  //   text: t(`jvdt2.questions.${question.id}.text`, question.text),
  //   options: question.options.map(option => ({
  //     ...option,
  //     text: t(`jvdt2.questions.${question.id}.option${option.id}`, option.text)
  //   }))
  // };
}

// Helper function to get translated JVDT-2 archetype data
export function getTranslatedArchetype(archetype, t) {
  if (!archetype) return archetype;

  const archetypeKey = `${archetype.title}`.replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  
  return {
    ...archetype,
    title: t(`jvdt2.archetypes.${archetypeKey}.title`, archetype.title),
    tagline: t(`jvdt2.archetypes.${archetypeKey}.tagline`, archetype.tagline),
    kidDescription: t(`jvdt2.archetypes.${archetypeKey}.kidDescription`, archetype.kidDescription),
    teacher: t(`jvdt2.archetypes.${archetypeKey}.teacher`, archetype.teacher)
  };
}

// Helper function to translate axis names and poles
export function getTranslatedAxisData(axisName, t) {
  return {
    axis: t(`jvdt2.axes.${axisName}`, axisName),
    Story: t('jvdt2.poles.Story', 'Story'),
    Facts: t('jvdt2.poles.Facts', 'Facts'),
    Why: t('jvdt2.poles.Why', 'Why'),
    How: t('jvdt2.poles.How', 'How'),
    Dream: t('jvdt2.poles.Dream', 'Dream'),
    Plan: t('jvdt2.poles.Plan', 'Plan'),
    Kind: t('jvdt2.poles.Kind', 'Kind'),
    Fair: t('jvdt2.poles.Fair', 'Fair')
  };
}