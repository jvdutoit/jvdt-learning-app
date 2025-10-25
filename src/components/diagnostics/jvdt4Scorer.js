/**
 * JVDT-4 Cognitive Framework Scoring Engine
 * Implements the 4-axis cognitive framework methodology
 * Seeing (Story↔Facts), Thinking (Why↔How), Doing (Dream↔Plan), Caring (Kind↔Fair)
 */

/**
 * Calculate JVDT-4 axis scores and Integration Index
 * @param {Object} testDefinition - The test definition with categories and questions
 * @param {Object} answers - User answers mapped by question ID
 * @returns {Object} Complete JVDT-4 results with axis scores, Integration Index, stages, and JVDT code
 */
export function calculateJVDT4Results(testDefinition, answers) {
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
    methodology: 'jvdt-4-cognitive'
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
  let poleAScore = 0; // Story/Why/Dream/Kind
  let poleBScore = 0; // Facts/How/Plan/Fair
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
        // Higher score favors second pole (Facts/How/Plan/Fair)
        poleAScore += (1 - normalizedScore);
        poleBScore += normalizedScore;
      } else if (question.scoring === 'reverse') {
        // Higher score favors first pole (Story/Why/Dream/Kind)
        poleAScore += normalizedScore;
        poleBScore += (1 - normalizedScore);
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
      strength: 0,
      totalQuestions: questions.length,
      answeredQuestions: 0
    };
  }

  // Normalize scores
  const totalScore = poleAScore + poleBScore;
  if (totalScore > 0) {
    poleAScore = poleAScore / totalScore;
    poleBScore = poleBScore / totalScore;
  }

  // Calculate balance (how close to 50/50)
  const balance = 1 - Math.abs(poleAScore - poleBScore);
  
  // Determine preference and strength
  const threshold = 0.55; // 55% threshold for clear preference
  let preference, strength;
  
  if (poleAScore > threshold) {
    preference = getAxisPoleAName(category.axis);
    strength = poleAScore;
  } else if (poleBScore > threshold) {
    preference = getAxisPoleBName(category.axis);
    strength = poleBScore;
  } else {
    preference = 'balanced';
    strength = balance;
  }

  return {
    poleAScore,
    poleBScore,
    balance,
    preference,
    strength,
    totalQuestions: questions.length,
    answeredQuestions
  };
}

/**
 * Calculate Integration Index based on axis balance
 */
function calculateIntegrationIndex(axisResults) {
  const axes = Object.keys(axisResults);
  if (axes.length === 0) return 0;

  const totalBalance = axes.reduce((sum, axis) => {
    return sum + (axisResults[axis].balance || 0);
  }, 0);

  return Math.round((totalBalance / axes.length) * 100);
}

/**
 * Map axis scores to Virtue Ladder stages
 */
function mapToVirtueLadderStages(axisResults, integrationIndex, scoring) {
  const stages = {};
  const thresholds = scoring?.margin_thresholds || {
    highly_skewed: 0.8,
    strong_preference: 0.65,
    directional_flexible: 0.55,
    balanced: 0.54
  };

  Object.keys(axisResults).forEach(axis => {
    const result = axisResults[axis];
    const margin = Math.abs(result.poleAScore - result.poleBScore);
    
    let stageName, stageNumber;
    
    if (margin >= thresholds.highly_skewed) {
      stageName = 'Instinct';
      stageNumber = 1;
    } else if (margin >= thresholds.strong_preference) {
      stageName = 'Awareness';
      stageNumber = 2;
    } else if (margin >= thresholds.directional_flexible) {
      stageName = 'Balance';
      stageNumber = 3;
    } else if (integrationIndex >= 70) {
      stageName = 'Wisdom';
      stageNumber = 5;
    } else {
      stageName = 'Mastery';
      stageNumber = 4;
    }

    stages[axis] = {
      name: stageName,
      stage: stageNumber,
      balance: result.balance,
      preference: result.preference
    };
  });

  return stages;
}

/**
 * Generate JVDT-4 code (4-letter code)
 */
function generateJVDTCode(axisResults) {
  const axisOrder = ['seeing', 'thinking', 'doing', 'caring'];
  let code = '';

  axisOrder.forEach(axis => {
    const result = axisResults[axis];
    if (!result) {
      code += 'B'; // Balanced if no data
      return;
    }

    if (result.preference === 'balanced') {
      code += 'B';
    } else if (result.poleAScore > result.poleBScore) {
      // First pole
      code += getAxisPoleACode(axis);
    } else {
      // Second pole  
      code += getAxisPoleBCode(axis);
    }
  });

  return code;
}

/**
 * Calculate overall development stage
 */
function calculateOverallStage(axisStages) {
  const stages = Object.values(axisStages);
  if (stages.length === 0) return { name: 'Unknown', stage: 0 };

  const averageStage = stages.reduce((sum, stage) => sum + stage.stage, 0) / stages.length;
  const roundedStage = Math.round(averageStage);

  const stageNames = {
    1: 'Instinct',
    2: 'Awareness', 
    3: 'Balance',
    4: 'Mastery',
    5: 'Wisdom'
  };

  return {
    name: stageNames[roundedStage] || 'Unknown',
    stage: roundedStage,
    average: averageStage
  };
}

/**
 * Helper functions for axis pole names and codes
 */
function getAxisPoleAName(axis) {
  const poleANames = {
    seeing: 'story',
    thinking: 'why',
    doing: 'dream', 
    caring: 'kind'
  };
  return poleANames[axis] || 'unknown';
}

function getAxisPoleBName(axis) {
  const poleBNames = {
    seeing: 'facts',
    thinking: 'how',
    doing: 'plan',
    caring: 'fair'
  };
  return poleBNames[axis] || 'unknown';
}

function getAxisPoleACode(axis) {
  const poleACodes = {
    seeing: 'S', // Story
    thinking: 'W', // Why
    doing: 'D', // Dream
    caring: 'K' // Kind
  };
  return poleACodes[axis] || 'B';
}

function getAxisPoleBCode(axis) {
  const poleBCodes = {
    seeing: 'F', // Facts
    thinking: 'H', // How
    doing: 'P', // Plan
    caring: 'R' // Fair (Respectful)
  };
  return poleBCodes[axis] || 'B';
}

/**
 * Generate recommendations based on JVDT-4 results
 */
export function getJVDT4Recommendations(results, testDefinition) {
  const recommendations = [];
  
  Object.keys(results.axisResults).forEach(axis => {
    const axisResult = results.axisResults[axis];
    const axisStage = results.axisStages[axis];
    const category = testDefinition.categories.find(cat => cat.axis === axis);
    
    if (!category || !axisStage) return;

    // Find the stage definition
    const stageDefinition = category.stages?.find(s => s.stage === axisStage.stage);
    
    if (stageDefinition) {
      recommendations.push({
        axis,
        stage: axisStage.name,
        practice: stageDefinition.practice,
        reflection: stageDefinition.reflection,
        description: stageDefinition.description
      });
    }
  });

  return recommendations;
}