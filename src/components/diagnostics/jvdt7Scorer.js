/**
 * JVDT-7 Authentic Scoring Engine
 * Implements the Cognitive Framework and Moral Architecture methodology
 * Based on extracted materials from the JVDT-7 Diagnostic GEM
 */

/**
 * Calculate JVDT-7 axis scores and Integration Index
 * @param {Object} testDefinition - The test definition with categories and questions
 * @param {Object} answers - User answers mapped by question ID
 * @returns {Object} Complete JVDT-7 results with axis scores, Integration Index, stages, and JVDT code
 */
export function calculateJVDT7Results(testDefinition, answers) {
  // Initialize axis scores
  const axisResults = {};
  
  // Process each axis
  testDefinition.categories.forEach(category => {
    if (!category.axis) return; // Skip if not an axis-based category
    
    const axisQuestions = testDefinition.questions.filter(q => q.axis === category.axis);
    axisResults[category.axis] = calculateAxisScore(category, axisQuestions, answers);
  });

  // Calculate Integration Index
  const integrationIndex = calculateIntegrationIndex(axisResults);
  
  // Map to Virtue Ladder stages
  const axisStages = mapToVirtueLadderStages(axisResults, integrationIndex, testDefinition.scoring);
  
  // Generate JVDT code
  const jvdtCode = generateJVDTCode(axisResults);
  
  // Determine overall development level
  const overallStage = calculateOverallStage(axisStages);
  
  return {
    axisResults,
    axisStages,
    integrationIndex,
    jvdtCode,
    overallStage,
    completedAt: new Date().toISOString(),
    methodology: 'jvdt-7-authentic'
  };
}

/**
 * Calculate score for a single axis
 * @param {Object} category - The axis category definition
 * @param {Array} questions - Questions for this axis
 * @param {Object} answers - User answers
 * @returns {Object} Axis score results
 */
function calculateAxisScore(category, questions, answers) {
  let poleAScore = 0; // Association/Root/Internal/Dream/Self/Task/Love
  let poleBScore = 0; // Analysis/Context/External/Pragmatic/Mission/Horizon/Respect
  let totalQuestions = 0;
  let answeredQuestions = 0;

  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer === undefined) return;
    
    answeredQuestions++;
    totalQuestions++;

    if (question.type === 'scale') {
      // Scale questions: 1-5 scale converted to pole weights
      const normalizedScore = (answer - 1) / 4; // Convert 1-5 to 0-1
      
      if (question.scoring === 'forward') {
        // Higher score favors first pole (A/R/I/D/S/T/L)
        poleAScore += normalizedScore;
        poleBScore += (1 - normalizedScore);
      } else if (question.scoring === 'reverse') {
        // Higher score favors second pole (N/C/E/P/M/H/R)
        poleAScore += (1 - normalizedScore);
        poleBScore += normalizedScore;
      }
    } else if (question.type === 'multiple-choice' && question.pole_weights) {
      // Multiple choice with explicit pole weights
      const optionIndex = answer;
      const poleNames = Object.keys(question.pole_weights);
      
      if (poleNames.length >= 2 && question.pole_weights[poleNames[0]][optionIndex] !== undefined) {
        const poleAWeight = question.pole_weights[poleNames[0]][optionIndex] / 4; // Normalize to 0-1
        const poleBWeight = question.pole_weights[poleNames[1]][optionIndex] / 4; // Normalize to 0-1
        
        poleAScore += poleAWeight;
        poleBScore += poleBWeight;
      }
    }
  });

  if (answeredQuestions === 0) {
    return {
      poleAScore: 0.5,
      poleBScore: 0.5,
      balance: 0,
      preference: 'neutral',
      margin: 0,
      answered: 0,
      total: totalQuestions
    };
  }

  // Normalize scores
  const normalizedA = poleAScore / answeredQuestions;
  const normalizedB = poleBScore / answeredQuestions;
  
  // Calculate preference and margin
  const totalNormalized = normalizedA + normalizedB;
  const finalPoleA = totalNormalized > 0 ? normalizedA / totalNormalized : 0.5;
  const finalPoleB = totalNormalized > 0 ? normalizedB / totalNormalized : 0.5;
  
  const margin = Math.abs(finalPoleA - finalPoleB);
  const preference = finalPoleA > finalPoleB ? 'first' : 'second';
  const balance = 1 - margin; // Balance is inverse of margin

  return {
    poleAScore: finalPoleA,
    poleBScore: finalPoleB,
    balance,
    preference: margin < 0.1 ? 'balanced' : preference,
    margin,
    answered: answeredQuestions,
    total: totalQuestions
  };
}

/**
 * Calculate Integration Index based on balance across all axes
 * @param {Object} axisResults - Results for all axes
 * @returns {number} Integration Index (0-1)
 */
function calculateIntegrationIndex(axisResults) {
  const axes = Object.keys(axisResults);
  if (axes.length === 0) return 0;
  
  // Integration Index is the average balance across all axes
  const totalBalance = axes.reduce((sum, axis) => sum + axisResults[axis].balance, 0);
  return totalBalance / axes.length;
}

/**
 * Map axis results to Virtue Ladder stages
 * @param {Object} axisResults - Axis calculation results
 * @param {number} integrationIndex - Overall integration level
 * @param {Object} scoringConfig - Scoring configuration from test definition
 * @returns {Object} Stage assignments for each axis
 */
function mapToVirtueLadderStages(axisResults, integrationIndex, scoringConfig) {
  const stages = {};
  const thresholds = scoringConfig.margin_thresholds;
  const stageMapping = scoringConfig.stage_mapping;
  
  Object.keys(axisResults).forEach(axis => {
    const result = axisResults[axis];
    const { margin, balance } = result;
    
    let stage;
    
    if (margin >= thresholds.highly_skewed) {
      // Very strong preference for one pole - Stage 2 (Instinct level)
      stage = stageMapping.highly_skewed;
    } else if (margin >= thresholds.strong_preference) {
      // Strong preference but some awareness - Stage 3 (Awareness level)
      stage = stageMapping.strong_preference;
    } else if (margin >= thresholds.directional_flexible) {
      // Directional but flexible - Stage 4 (Balance level)
      stage = stageMapping.directional_flexible;
    } else {
      // Balanced - Stage depends on Integration Index
      if (integrationIndex >= 0.7) {
        // High integration - Stage 5 (Wisdom level)
        stage = stageMapping.balanced_high_ii;
      } else {
        // Lower integration - Stage 4 (Mastery level)
        stage = stageMapping.balanced_low_ii;
      }
    }
    
    stages[axis] = Math.max(1, Math.min(5, stage)); // Ensure stage is 1-5
  });
  
  return stages;
}

/**
 * Generate 7-letter JVDT code representing axis preferences
 * @param {Object} axisResults - Axis calculation results
 * @returns {string} 7-character JVDT code
 */
function generateJVDTCode(axisResults) {
  const axisOrder = ['perception', 'interpretation', 'reflection', 'application', 'motivation', 'orientation', 'value_expression'];
  const codeLetters = {
    perception: { first: 'A', second: 'N' },
    interpretation: { first: 'R', second: 'C' },
    reflection: { first: 'I', second: 'E' },
    application: { first: 'D', second: 'P' },
    motivation: { first: 'S', second: 'M' },
    orientation: { first: 'T', second: 'H' },
    value_expression: { first: 'L', second: 'R' }
  };
  
  let code = '';
  
  axisOrder.forEach(axis => {
    const result = axisResults[axis];
    if (!result) {
      code += '?'; // Unknown
      return;
    }
    
    const letters = codeLetters[axis];
    if (result.preference === 'balanced' || result.margin < 0.1) {
      // For balanced preferences, alternate or use a neutral approach
      // Here we'll use the slight preference if any, or default to first pole
      code += result.poleAScore >= result.poleBScore ? letters.first : letters.second;
    } else if (result.preference === 'first') {
      code += letters.first;
    } else {
      code += letters.second;
    }
  });
  
  return code;
}

/**
 * Calculate overall developmental stage
 * @param {Object} axisStages - Stage assignments for each axis
 * @returns {Object} Overall stage information
 */
function calculateOverallStage(axisStages) {
  const stages = Object.values(axisStages);
  if (stages.length === 0) return { level: 1, name: 'Instinct', description: 'Beginning development' };
  
  const averageStage = stages.reduce((sum, stage) => sum + stage, 0) / stages.length;
  const roundedStage = Math.round(averageStage);
  
  const stageNames = {
    1: 'Instinct',
    2: 'Awareness', 
    3: 'Balance',
    4: 'Mastery',
    5: 'Wisdom'
  };
  
  const stageDescriptions = {
    1: 'Foundation stage - developing basic awareness of different approaches',
    2: 'Recognition stage - noticing tensions and alternatives in thinking and acting',
    3: 'Integration stage - learning to balance and alternate between different modes',
    4: 'Application stage - consistently integrating different approaches and teaching others',
    5: 'Transcendence stage - seamless unity between apparently opposite ways of being'
  };
  
  return {
    level: roundedStage,
    name: stageNames[roundedStage] || 'Unknown',
    description: stageDescriptions[roundedStage] || 'Stage description not available',
    averageStage: Math.round(averageStage * 10) / 10
  };
}

/**
 * Get development recommendations based on JVDT-7 results
 * @param {Object} results - Complete JVDT-7 results
 * @param {Object} testDefinition - Test definition with stage information
 * @returns {Array} Array of personalized recommendations
 */
export function getJVDT7Recommendations(results, testDefinition) {
  const recommendations = [];
  const { axisResults, axisStages, integrationIndex } = results;
  
  // Overall recommendations based on Integration Index
  if (integrationIndex < 0.4) {
    recommendations.push(
      "Focus on developing balance: Practice seeing situations from multiple perspectives before making decisions.",
      "Experiment with your non-preferred approaches: Try using your less natural thinking style in low-stakes situations."
    );
  } else if (integrationIndex < 0.7) {
    recommendations.push(
      "Build consistent integration: Look for opportunities to combine different approaches in your daily work.",
      "Develop teaching abilities: Share your balanced perspective with others to deepen your own understanding."
    );
  } else {
    recommendations.push(
      "Mentor others: Your high integration makes you well-suited to guide others in developing balance.",
      "Explore wisdom practices: Engage in reflection and contemplation to deepen your seamless integration."
    );
  }
  
  // Axis-specific recommendations
  Object.keys(axisStages).forEach(axisId => {
    const stage = axisStages[axisId];
    const category = testDefinition.categories.find(c => c.axis === axisId);
    
    if (!category || !category.stages) return;
    
    const stageInfo = category.stages.find(s => s.stage === stage);
    if (stageInfo && stageInfo.practice) {
      recommendations.push(`${category.name}: ${stageInfo.practice}`);
    }
  });
  
  // Limit to most relevant recommendations
  return recommendations.slice(0, 6);
}