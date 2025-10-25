// JVDT-2 Kids Scoring Engine
// 4-axis cognitive framework for primary school learners

const AXES_CONFIG = {
  "Seeing": { poleA: "Story", poleB: "Facts", iconA: "🖼️", iconB: "📊" },
  "Thinking": { poleA: "Why", poleB: "How", iconA: "❓", iconB: "⚙️" },
  "Doing": { poleA: "Dream", poleB: "Plan", iconA: "💭", iconB: "🗺️" },
  "Caring": { poleA: "Kind", poleB: "Fair", iconA: "💖", iconB: "⚖️" }
};

// Teacher Tips for each pole
const TEACHER_TIPS = {
  Story: "Encourage adding one fact to each idea.",
  Facts: "Encourage adding one example or story to each fact.",
  Why: "Ask: What's one way this helps someone today?",
  How: "Ask: What's one reason this idea matters?",
  Dream: "Help them write 3 small steps before starting.",
  Plan: "Ask: Is there room for a new idea here?",
  Kind: "Help them practice saying 'no' kindly but clearly.",
  Fair: "Ask: Can we start by saying something kind?"
};

// Archetype definitions with kid-friendly descriptions
const ARCHETYPES = {
  "Story-Why-Dream-Kind": { 
    title: "The Imaginative Helper", 
    tagline: "Learns through stories, dreams big, and cares deeply.", 
    kidDescription: "Wow! You love stories (🖼️), asking 'Why?' (❓), dreaming up big ideas (💭), and being super kind (💖). Telling stories to help people is your superpower!", 
    teacher: "Natural empath and storyteller; connects ideas emotionally and wants to help others.",
    badge: "🎨🤝",
    gradient: "from-amber-300 via-violet-300 to-pink-300"
  },
  "Story-Why-Dream-Fair": { 
    title: "The Wise Dreamer", 
    tagline: "Dreams up fair ideas that make the world better.", 
    kidDescription: "Stories (🖼️) and asking 'Why?' (❓) are your jam! You have big dreams (💭) and always want things to be fair (⚖️). You're great at imagining fair ways to play!", 
    teacher: "Balances imagination with justice; loves stories with morals and lessons.",
    badge: "📜🌍",
    gradient: "from-amber-300 via-violet-300 to-slate-300"
  },
  "Story-Why-Plan-Kind": { 
    title: "The Gentle Organizer", 
    tagline: "Plans kind ways to make good ideas real.", 
    kidDescription: "You learn well with stories (🖼️) and like knowing 'Why?' (❓). You also enjoy having a plan (🗺️) and being really kind (💖). Making kind plans is one of your talents!", 
    teacher: "Likes stories but also structure; leads softly and kindly.",
    badge: "🗂️💗",
    gradient: "from-amber-300 via-violet-300 to-rose-300"
  },
  "Story-Why-Plan-Fair": { 
    title: "The Thoughtful Guardian", 
    tagline: "Keeps things fair and true to their meaning.", 
    kidDescription: "You like stories (🖼️) and understanding 'Why?' (❓). Making clear plans (🗺️) and keeping things fair (⚖️) are important to you. You're awesome at making sure rules make sense!", 
    teacher: "Protects principles; values tradition, fairness, and responsibility.",
    badge: "🛡️📖",
    gradient: "from-amber-300 via-violet-300 to-slate-300"
  },
  "Story-How-Dream-Kind": { 
    title: "The Creative Builder", 
    tagline: "Turns ideas into kind actions.", 
    kidDescription: "Stories (🖼️) help you learn, and you love knowing 'How?' (⚙️). You dream up cool new things (💭) and are always kind (💖). You can imagine amazing ways to help others!", 
    teacher: "Loves to make things, enjoys showing others how ideas can help.",
    badge: "🛠️💝",
    gradient: "from-amber-300 via-cyan-300 to-pink-300"
  },
  "Story-How-Dream-Fair": { 
    title: "The Inventive Maker", 
    tagline: "Builds fair and fun new worlds.", 
    kidDescription: "You're great with stories (🖼️) and figuring out 'How?' (⚙️). You dream big (💭) but always make sure things are fair (⚖️). You're like an inventor who makes fair games!", 
    teacher: "Engineer-artist hybrid; imaginative but grounded in systems and fairness.",
    badge: "🧩⚖️",
    gradient: "from-amber-300 via-cyan-300 to-slate-300"
  },
  "Story-How-Plan-Kind": { 
    title: "The Caring Designer", 
    tagline: "Plans carefully to create good things for people.", 
    kidDescription: "You like learning from stories (🖼️) and knowing 'How?' (⚙️). Following a plan (🗺️) feels good, and you're super kind (💖). You're fantastic at planning nice things for others!", 
    teacher: "Likes clear instructions, builds things that help or comfort others.",
    badge: "📐💕",
    gradient: "from-amber-300 via-cyan-300 to-rose-300"
  },
  "Story-How-Plan-Fair": { 
    title: "The Balanced Planner", 
    tagline: "Makes sure every plan works well and treats people right.", 
    kidDescription: "Stories (🖼️) are fun, and you like knowing 'How?' (⚙️). You stick to the plan (🗺️) and make sure everything is fair (⚖️). You're great at making sure plans work for everyone!", 
    teacher: "Practical, dependable, and just; ensures both order and inclusion.",
    badge: "📋⚖️",
    gradient: "from-amber-300 via-cyan-300 to-slate-300"
  },
  "Facts-Why-Dream-Kind": { 
    title: "The Thoughtful Inventor", 
    tagline: "Finds smart, kind reasons for new ideas.", 
    kidDescription: "You like facts (📊) and always ask 'Why?' (❓). You have big dreams (💭) and a kind heart (💖). You're good at thinking up kind reasons for your awesome ideas!", 
    teacher: "Analytical yet caring; blends reason with compassion.",
    badge: "🔬💡",
    gradient: "from-blue-300 via-violet-300 to-pink-300"
  },
  "Facts-Why-Dream-Fair": { 
    title: "The Principled Creator", 
    tagline: "Dreams up fair solutions using what they know.", 
    kidDescription: "Facts (📊) and asking 'Why?' (❓) help you learn. You dream big (💭) and believe in being fair (⚖️). You're amazing at creating fair ideas based on what you know!", 
    teacher: "Wants ideas to be correct and just; loves solving real problems.",
    badge: "⚖️💡",
    gradient: "from-blue-300 via-violet-300 to-slate-300"
  },
  "Facts-Why-Plan-Kind": { 
    title: "The Patient Helper", 
    tagline: "Plans carefully to do kind things that work.", 
    kidDescription: "You like facts (📊), understanding 'Why?' (❓), and having a plan (🗺️). Being kind (💖) is important too! You're great at planning helpful things step-by-step.", 
    teacher: "Values order and kindness; solid team player who likes clear steps.",
    badge: "📚💗",
    gradient: "from-blue-300 via-violet-300 to-rose-300"
  },
  "Facts-Why-Plan-Fair": { 
    title: "The Reliable Judge", 
    tagline: "Thinks before acting and keeps things fair.", 
    kidDescription: "Facts (📊) and asking 'Why?' (❓) guide you. You like clear plans (🗺️) and making sure things are fair (⚖️). You're really good at thinking carefully and being fair!", 
    teacher: "Calm, objective, consistent; great at mediating or leading by fairness.",
    badge: "⚖️📝",
    gradient: "from-blue-300 via-violet-300 to-slate-300"
  },
  "Facts-How-Dream-Kind": { 
    title: "The Practical Dreamer", 
    tagline: "Uses facts to make kind ideas real.", 
    kidDescription: "Wow! You're great at using facts (📊) to understand 'How?' things work (⚙️). You love dreaming up big ideas (💭) and using them to be kind to others (💖). That's your superpower!", 
    teacher: "Curious and compassionate; applies learning to help others.",
    badge: "🔧💝",
    gradient: "from-blue-300 via-cyan-300 to-pink-300"
  },
  "Facts-How-Dream-Fair": { 
    title: "The Inventive Fixer", 
    tagline: "Figures out fair new ways to improve things.", 
    kidDescription: "You use facts (📊) and know 'How?' (⚙️) things work. You dream (💭) of better ways and want things to be fair (⚖️). You're like a super-fixer who makes things fair!", 
    teacher: "Problem-solver; experiments until systems feel fair for everyone.",
    badge: "⚙️⚖️",
    gradient: "from-blue-300 via-cyan-300 to-slate-300"
  },
  "Facts-How-Plan-Kind": { 
    title: "The Helpful Builder", 
    tagline: "Follows clear steps to make life easier for others.", 
    kidDescription: "You like facts (📊), knowing 'How?' (⚙️), and following plans (🗺️). You're also very kind (💖)! You're wonderful at building things carefully to help people.", 
    teacher: "Systematic worker; thrives on routine and helping through action.",
    badge: "🔧💕",
    gradient: "from-blue-300 via-cyan-300 to-rose-300"
  },
  "Facts-How-Plan-Fair": { 
    title: "The Logical Leader", 
    tagline: "Keeps things running smoothly and fairly.", 
    kidDescription: "Facts (📊), knowing 'How?' (⚙️), and having a plan (🗺️) are your style! You make sure everything is fair (⚖️). You're fantastic at organizing things so they work well for everyone!", 
    teacher: "Natural organizer; leads by fairness, facts, and responsibility.",
    badge: "📊⚖️",
    gradient: "from-blue-300 via-cyan-300 to-slate-300"
  }
};

// Fallback for balanced cases
const DEFAULT_ARCHETYPE = { 
  title: "Balanced Explorer", 
  tagline: "Uses many skills to learn and grow!", 
  kidDescription: "Cool! You use a mix of different superpowers to learn and explore. That means you can be good at lots of things!", 
  teacher: "Shows flexibility across different learning styles.",
  badge: "🤝🌟",
  gradient: "from-emerald-300 via-blue-300 to-purple-300"
};

/**
 * Calculate JVDT-2 results from user answers
 * @param {Array} answers - Array of answer objects with format: {questionId, selectedOption, axis, pole}
 * @returns {Object} Complete results with scores, archetype, and recommendations
 */
export function calculateJVDT2Results(answers) {
  // Initialize scores for each axis
  const axisScores = {};
  Object.keys(AXES_CONFIG).forEach(axis => {
    const config = AXES_CONFIG[axis];
    axisScores[axis] = {
      [config.poleA]: 0,
      [config.poleB]: 0,
      total: 0
    };
  });

  // Count answers for each pole
  answers.forEach(answer => {
    if (answer.selectedOption && answer.axis && answer.pole) {
      axisScores[answer.axis][answer.pole]++;
      axisScores[answer.axis].total++;
    }
  });

  // Determine dominant pole for each axis
  const dominantCode = [];
  const dominantIcons = [];
  const axisDetails = {};

  Object.keys(AXES_CONFIG).forEach(axis => {
    const config = AXES_CONFIG[axis];
    const scoreA = axisScores[axis][config.poleA];
    const scoreB = axisScores[axis][config.poleB];
    const totalAnswered = axisScores[axis].total;
    
    let dominantPole, dominantIcon, percentage;
    
    // Determine if balanced or has dominant pole
    if (scoreA === scoreB || totalAnswered < 7) {
      dominantPole = "Balanced";
      dominantIcon = "🤝";
      percentage = 50;
    } else if (scoreA > scoreB) {
      dominantPole = config.poleA;
      dominantIcon = config.iconA;
      percentage = Math.round((scoreA / totalAnswered) * 100);
    } else {
      dominantPole = config.poleB;
      dominantIcon = config.iconB;
      percentage = Math.round((scoreB / totalAnswered) * 100);
    }

    dominantCode.push(dominantPole);
    dominantIcons.push(dominantIcon);
    
    // Store detailed axis information
    axisDetails[axis] = {
      poleA: config.poleA,
      poleB: config.poleB,
      iconA: config.iconA,
      iconB: config.iconB,
      scoreA,
      scoreB,
      totalAnswered,
      dominantPole,
      dominantIcon,
      percentage,
      percentageA: totalAnswered > 0 ? Math.round((scoreA / totalAnswered) * 100) : 50,
      percentageB: totalAnswered > 0 ? Math.round((scoreB / totalAnswered) * 100) : 50,
      isStrong: (scoreA >= 8 || scoreB >= 8) || (totalAnswered >= 8 && percentage >= 89),
      isBalanced: dominantPole === "Balanced"
    };
  });

  // Get archetype information
  const archetypeKey = dominantCode.join('-');
  const hasBalanced = dominantCode.includes("Balanced");
  const archetype = hasBalanced ? DEFAULT_ARCHETYPE : (ARCHETYPES[archetypeKey] || DEFAULT_ARCHETYPE);

  // Generate teacher recommendations
  const teacherTips = generateTeacherTips(dominantCode, axisDetails);
  
  // Calculate overall integration score (how balanced vs. specialized)
  const integrationScore = calculateIntegrationScore(axisDetails);

  return {
    methodology: 'jvdt-2-kids',
    dominantCode,
    dominantIcons,
    archetype,
    axisDetails,
    teacherTips,
    integrationScore,
    totalQuestions: 36,
    answeredQuestions: answers.length,
    completionRate: Math.round((answers.length / 36) * 100)
  };
}

/**
 * Generate teacher tips based on dominant poles and axis details
 */
function generateTeacherTips(dominantCode, axisDetails) {
  const tips = [];
  const axisNames = ['Seeing', 'Thinking', 'Doing', 'Caring'];
  
  dominantCode.forEach((pole, index) => {
    if (pole === 'Balanced') return;
    
    const axisName = axisNames[index];
    const axisData = axisDetails[axisName];
    const tip = TEACHER_TIPS[pole] || 'Encourage exploring the other side.';
    
    // Add strength indicator for strong preferences
    const strength = axisData.isStrong ? " (Strong preference)" : "";
    tips.push({
      axis: axisName,
      pole,
      tip,
      strength: axisData.isStrong,
      suggestion: tip
    });
  });

  return tips;
}

/**
 * Calculate integration score - how balanced the learner is across all axes
 */
function calculateIntegrationScore(axisDetails) {
  let balancedCount = 0;
  let strongCount = 0;
  let totalVariance = 0;

  Object.values(axisDetails).forEach(axis => {
    if (axis.isBalanced) {
      balancedCount++;
    }
    if (axis.isStrong) {
      strongCount++;
    }
    
    // Calculate variance from 50% (perfect balance)
    const variance = Math.abs(axis.percentageA - 50);
    totalVariance += variance;
  });

  // Score from 0-100, where 100 is perfectly balanced
  const balanceScore = 100 - (totalVariance / 4); // Divide by 4 axes
  
  return {
    score: Math.max(0, Math.round(balanceScore)),
    balancedAxes: balancedCount,
    strongAxes: strongCount,
    description: getIntegrationDescription(balancedCount, strongCount)
  };
}

/**
 * Get description for integration level
 */
function getIntegrationDescription(balancedCount, strongCount) {
  if (balancedCount >= 3) {
    return "Highly integrated learner - uses many different approaches";
  } else if (balancedCount >= 2) {
    return "Well-balanced learner with some specific strengths";
  } else if (strongCount >= 3) {
    return "Specialized learner with clear preferences";
  } else {
    return "Developing learner with emerging preferences";
  }
}

/**
 * Get JVDT-2 recommendations for teachers and parents
 */
export function getJVDT2Recommendations(results) {
  const { archetype, teacherTips, integrationScore, axisDetails } = results;
  
  const recommendations = {
    forTeacher: [
      `Learning Style: ${archetype.teacher}`,
      `Integration Level: ${integrationScore.description}`,
      ...teacherTips.map(tip => `${tip.axis} (${tip.pole}): ${tip.suggestion}`)
    ],
    forParent: [
      `Your child is "${archetype.title}" - ${archetype.tagline}`,
      archetype.kidDescription,
      `They learn best when you: ${getParentTips(results)}`
    ],
    nextSteps: generateNextSteps(results)
  };

  return recommendations;
}

/**
 * Generate parent-friendly tips
 */
function getParentTips(results) {
  const { dominantCode } = results;
  const tips = [];
  
  dominantCode.forEach((pole, index) => {
    if (pole === 'Balanced') return;
    
    switch(pole) {
      case 'Story':
        tips.push("use stories and pictures to explain things");
        break;
      case 'Facts':
        tips.push("provide clear facts and step-by-step explanations");
        break;
      case 'Why':
        tips.push("explain the reasons behind rules and ideas");
        break;
      case 'How':
        tips.push("show practical examples and real-world uses");
        break;
      case 'Dream':
        tips.push("encourage big ideas and creative thinking");
        break;
      case 'Plan':
        tips.push("help them organize and plan before starting");
        break;
      case 'Kind':
        tips.push("emphasize helping others and being gentle");
        break;
      case 'Fair':
        tips.push("focus on rules, fairness, and treating everyone equally");
        break;
    }
  });

  return tips.join(", ");
}

/**
 * Generate next steps for development
 */
function generateNextSteps(results) {
  const { axisDetails, integrationScore } = results;
  const steps = [];

  // Suggest areas for growth
  Object.entries(axisDetails).forEach(([axis, data]) => {
    if (data.isStrong && !data.isBalanced) {
      const oppositepole = data.dominantPole === data.poleA ? data.poleB : data.poleA;
      steps.push(`Try activities that develop ${oppositepole} skills in ${axis}`);
    }
  });

  // Integration suggestions
  if (integrationScore.score < 50) {
    steps.push("Work on balancing different learning approaches");
  }

  return steps.length > 0 ? steps : ["Continue exploring and developing all learning styles"];
}

export { AXES_CONFIG, ARCHETYPES, TEACHER_TIPS, DEFAULT_ARCHETYPE };