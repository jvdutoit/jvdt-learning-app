# Diagnostic Testing Module Architecture Plan

## Overview
Design modular diagnostic testing system that integrates with existing JVDT Learning Hub architecture, following current patterns for localStorage persistence and React Router navigation.

## Data Structure Design

### Test Definition Schema
```json
{
  "id": "english-fluency",
  "title": "English Fluency Diagnostic",
  "description": "Assess your current English language proficiency level",
  "version": "1.0",
  "estimatedTime": "15-20 minutes",
  "categories": [
    {
      "id": "grammar",
      "name": "Grammar & Structure",
      "weight": 0.3
    },
    {
      "id": "vocabulary", 
      "name": "Vocabulary",
      "weight": 0.25
    },
    {
      "id": "comprehension",
      "name": "Reading Comprehension", 
      "weight": 0.25
    },
    {
      "id": "usage",
      "name": "Practical Usage",
      "weight": 0.2
    }
  ],
  "questions": [
    {
      "id": "q1",
      "category": "grammar",
      "type": "multiple-choice",
      "question": "Which sentence is grammatically correct?",
      "options": [
        "She don't like coffee",
        "She doesn't like coffee", 
        "She not like coffee",
        "She no like coffee"
      ],
      "correctAnswer": 1,
      "points": 1,
      "explanation": "Subject-verb agreement requires 'doesn't' with third person singular"
    }
  ],
  "scoring": {
    "levels": [
      {
        "name": "Beginner",
        "range": [0, 0.4],
        "description": "Basic understanding with significant room for improvement",
        "recommendations": ["Focus on fundamental grammar", "Build core vocabulary"]
      },
      {
        "name": "Intermediate", 
        "range": [0.41, 0.7],
        "description": "Good foundation with areas for refinement",
        "recommendations": ["Practice complex structures", "Expand academic vocabulary"]
      },
      {
        "name": "Advanced",
        "range": [0.71, 1.0], 
        "description": "Strong command of English",
        "recommendations": ["Focus on nuanced usage", "Develop specialized vocabulary"]
      }
    ]
  }
}
```

### JVDT-7 Diagnostic Schema
```json
{
  "id": "jvdt-7",
  "title": "JVDT-7 Diagnostic Assessment", 
  "description": "Comprehensive assessment across seven key development areas",
  "version": "1.0",
  "estimatedTime": "25-30 minutes",
  "categories": [
    {
      "id": "emotional-intelligence",
      "name": "Emotional Intelligence",
      "weight": 0.143
    },
    {
      "id": "critical-thinking", 
      "name": "Critical Thinking",
      "weight": 0.143
    },
    {
      "id": "communication",
      "name": "Communication Skills", 
      "weight": 0.143
    },
    {
      "id": "resilience",
      "name": "Resilience & Adaptability",
      "weight": 0.143
    },
    {
      "id": "leadership",
      "name": "Leadership Potential",
      "weight": 0.143
    },
    {
      "id": "creativity", 
      "name": "Creative Problem Solving",
      "weight": 0.143
    },
    {
      "id": "self-awareness",
      "name": "Self-Awareness",
      "weight": 0.141
    }
  ]
}
```

## Component Architecture

### 1. QuizEngine Component
- **Purpose**: Reusable quiz component that accepts test definition
- **Props**: `testDefinition`, `onComplete`, `saveProgress`
- **State**: Current question, answers, progress, timer
- **Features**: Single question per screen, progress bar, localStorage persistence

### 2. DiagnosticTest Component  
- **Purpose**: Wrapper that loads specific test definitions
- **Props**: `testId` (from URL params)
- **Features**: Loading states, error handling, results integration

### 3. TestResults Component
- **Purpose**: Display comprehensive results with scoring and recommendations
- **Features**: Score breakdown by category, level assessment, next steps

### 4. TestList Component
- **Purpose**: Landing page showing available diagnostic tests
- **Features**: Test cards with descriptions, estimated time, difficulty

## Routing Strategy

### New Routes to Add
- `/test` - Test listing page
- `/test/english` - English Fluency Diagnostic  
- `/test/jvdt7` - JVDT-7 Diagnostic
- `/test/:testId/results` - Results display (optional, could be modal)

### Navigation Integration
- Add "Diagnostics" nav link in TopNav
- Dropdown or separate section for different tests

## Data Persistence Strategy

### localStorage Keys
- `jvdt:test-progress-{testId}` - In-progress test state
- `jvdt:test-results-{testId}` - Completed test results  
- `jvdt:test-history` - Array of all completed tests

### Data Shapes
```javascript
// Progress state
{
  testId: "english-fluency",
  currentQuestion: 5,
  answers: {"q1": 1, "q2": 3, "q3": 0},
  startTime: "2025-10-25T09:00:00Z",
  timeSpent: 300
}

// Results state  
{
  testId: "english-fluency",
  completedAt: "2025-10-25T09:15:00Z",
  totalScore: 0.75,
  categoryScores: {
    "grammar": 0.8,
    "vocabulary": 0.7, 
    "comprehension": 0.8,
    "usage": 0.7
  },
  level: "Intermediate",
  recommendations: ["Practice complex structures", "Expand academic vocabulary"]
}
```

## Integration with Existing Features

### Connection to Reflections
- Add "Test Insights" reflection template
- Auto-populate reflection with test results
- Suggest reflection questions based on scores

### Connection to Journey/Keys
- Map test categories to existing Keys
- Suggest relevant Journey stages based on results
- Adaptive learning path recommendations

### Connection to Glossary  
- Link unfamiliar terms in questions to glossary
- Suggest glossary study based on weak areas

## Implementation Phases

### Phase 1: Core Infrastructure
1. Create test definition JSON files
2. Build QuizEngine component
3. Add basic routing and navigation

### Phase 2: Test Implementation  
1. Implement English Fluency test
2. Implement JVDT-7 test  
3. Add results display and persistence

### Phase 3: Integration & Enhancement
1. Connect to existing features (reflections, journey)
2. Add advanced features (export, email results)
3. Implement adaptive recommendations

## File Structure
```
src/
  components/
    diagnostics/
      QuizEngine.jsx
      DiagnosticTest.jsx  
      TestResults.jsx
      TestList.jsx
      QuestionTypes/
        MultipleChoice.jsx
        ScaleRating.jsx
        TextInput.jsx
  data/
    tests/
      english-fluency.json
      jvdt-7.json
  utils/
    testEngine.js
    scoring.js
```

This architecture maintains consistency with your existing patterns while providing a robust foundation for diagnostic testing that can scale to additional tests and features.