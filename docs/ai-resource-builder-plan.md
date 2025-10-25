# AI Resource Builder Architecture Plan

## Overview
Create an AI-powered resource generation system that allows educators to specify learning objectives and generate custom educational materials, similar to the JVDT Resource Portal but with dynamic AI generation capabilities.

## Core Features

### 1. Resource Catalog System
- **Resource Grid**: Searchable/filterable display of available and generated resources
- **Categories**: Match JVDT portal categories (Trauma Healing, Language Learning, Self-Assessments, etc.)
- **Resource Types**: Workbooks, flashcards, assessments, lesson plans, activities, scenarios
- **Tags**: JVDT methodology tags (Association, Analysis, Root, Context, etc.)

### 2. AI Generation Engine
- **Input Parameters**: Topic, target age group, format type, difficulty level, duration
- **JVDT Integration**: Align generated content with JVDT methodology and principles
- **Output Formats**: Structured educational materials, assessments, activities
- **Quality Control**: Validation and refinement of generated content

### 3. Resource Management
- **Save Generated Resources**: Persist custom resources to localStorage
- **Share Resources**: Export capabilities (PDF, text, structured data)
- **Resource Library**: Personal collection of generated and saved resources
- **Version Control**: Track iterations and improvements

## Data Structure Design

### Resource Schema
```json
{
  "id": "resource-uuid",
  "title": "Emotion Regulation Flashcards",
  "description": "Interactive flashcards for developing emotional intelligence",
  "category": "trauma-healing",
  "type": "flashcards",
  "targetAge": "13-18",
  "difficulty": "intermediate",
  "estimatedDuration": "20 minutes",
  "jvdtKeys": ["Association", "Context"],
  "tags": ["emotion-regulation", "self-awareness", "coping-skills"],
  "generatedAt": "2025-10-25T09:00:00Z",
  "content": {
    "format": "flashcards",
    "items": [
      {
        "front": "What is emotional regulation?",
        "back": "The ability to manage and respond to emotional experiences in a healthy way",
        "explanation": "This connects to the JVDT Association key by linking emotions to appropriate responses"
      }
    ]
  },
  "generationParams": {
    "prompt": "Create flashcards for emotion regulation",
    "aiModel": "gemini-2.5-flash",
    "systemPrompt": "You are an expert JVDT methodology educator..."
  }
}
```

### Generation Request Schema
```json
{
  "topic": "Emotional Intelligence",
  "targetAge": "middle-school",
  "format": "flashcards",
  "difficulty": "beginner",
  "duration": "15-20 minutes",
  "jvdtFocus": ["Association", "Context"],
  "customRequirements": "Include real-world scenarios",
  "includeAssessment": true
}
```

## Component Architecture

### 1. ResourceCatalog Component
- **Purpose**: Main hub for browsing and managing resources
- **Features**: Search, filter, category browsing, resource cards
- **State**: Resources list, filters, search terms, loading states

### 2. ResourceGenerator Component  
- **Purpose**: AI-powered resource creation interface
- **Features**: Parameter input form, generation progress, preview, refinement
- **State**: Generation parameters, generated content, loading, errors

### 3. ResourceCard Component
- **Purpose**: Individual resource display and interaction
- **Features**: Resource preview, download, edit, duplicate, delete
- **State**: Resource data, actions

### 4. ResourceViewer Component
- **Purpose**: Full resource display and interaction
- **Features**: Content rendering, interactive elements, assessment tools
- **State**: Resource content, user progress, responses

## AI Integration Strategy

### 1. Generation Service
```javascript
class ResourceGenerationService {
  async generateResource(params) {
    const systemPrompt = this.buildJVDTSystemPrompt(params);
    const userPrompt = this.buildUserPrompt(params);
    
    const response = await this.callAI(systemPrompt, userPrompt);
    return this.parseAndValidateResource(response);
  }
  
  buildJVDTSystemPrompt(params) {
    return `You are an expert educator specializing in the JVDT methodology. 
    Create educational resources that incorporate the Four Keys: Association, Analysis, Root, and Context.
    Target age: ${params.targetAge}
    Format: ${params.format}
    Focus on practical, engaging content that helps learners develop critical thinking skills.`;
  }
}
```

### 2. Resource Types and Templates

#### Flashcards
- **Structure**: Question/Answer pairs with explanations
- **JVDT Integration**: Link concepts using Association, provide Context
- **Interactive Elements**: Flip animations, progress tracking

#### Workbooks
- **Structure**: Sequential activities with reflection questions
- **JVDT Integration**: Analysis exercises, Root word exploration
- **Features**: Fill-in sections, guided reflection, self-assessment

#### Assessment Tools
- **Structure**: Questions with scoring rubrics
- **JVDT Integration**: Multi-dimensional evaluation across the Four Keys
- **Features**: Immediate feedback, progress tracking, recommendations

#### Scenario-Based Learning
- **Structure**: Interactive scenarios with decision points
- **JVDT Integration**: Context-rich situations requiring analysis
- **Features**: Branching narratives, consequence exploration

## Integration with Existing Features

### 1. Diagnostic Test Integration
- **Adaptive Resources**: Generate resources based on diagnostic results
- **Weakness Targeting**: Create focused materials for low-scoring areas
- **Progress Tracking**: Monitor improvement through generated assessments

### 2. Journey Integration
- **Stage-Specific Resources**: Generate materials appropriate for learning journey stage
- **Scaffolding**: Create supporting resources for difficult concepts
- **Application Practice**: Generate real-world application scenarios

### 3. Reflection Integration
- **Guided Prompts**: Generate reflection questions based on resource content
- **Metacognitive Development**: Create self-assessment tools
- **Learning Journal**: Integrate with existing reflection system

## Technical Implementation Plan

### Phase 1: Core Infrastructure
1. Create resource data models and validation
2. Implement basic resource catalog with static resources
3. Add search and filtering capabilities
4. Build resource card and viewer components

### Phase 2: AI Generation
1. Implement AI service with prompt engineering
2. Create resource generation form and UI
3. Add generation progress and error handling
4. Implement content validation and quality checks

### Phase 3: Advanced Features
1. Add resource editing and refinement capabilities
2. Implement sharing and export functionality
3. Create adaptive resource recommendations
4. Add collaborative features and resource sharing

### Phase 4: Integration & Polish
1. Connect with diagnostic results for personalized generation
2. Integrate with journey stages and learning paths
3. Add advanced analytics and usage tracking
4. Implement user feedback and rating system

## File Structure
```
src/
  components/
    resources/
      ResourceCatalog.jsx
      ResourceGenerator.jsx
      ResourceCard.jsx
      ResourceViewer.jsx
      ResourceEditor.jsx
      formats/
        FlashcardRenderer.jsx
        WorkbookRenderer.jsx
        AssessmentRenderer.jsx
        ScenarioRenderer.jsx
  services/
    ResourceGenerationService.js
    ResourceStorage.js
    AIPromptService.js
  data/
    resources/
      static-resources.json
      resource-templates.json
  utils/
    resourceValidation.js
    contentParser.js
```

## Routing Structure
- `/resources` - Main resource catalog
- `/resources/generate` - AI resource generator
- `/resources/:id` - Individual resource viewer
- `/resources/:id/edit` - Resource editor
- `/resources/library` - Personal resource library

This architecture provides a comprehensive foundation for the AI Resource Builder while maintaining consistency with existing JVDT methodology and technical patterns.