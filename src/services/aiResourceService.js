/**
 * AI Resource Generation Service
 * Integrates with Google Gemini API to generate educational resources
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAouiDpS6L1aXEz4JC0Kv6_pHkKKkVXD5o';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = 'gemini-2.5-flash';

class AIResourceService {
  constructor() {
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second
  }

  /**
   * Generate an educational resource using AI
   * @param {Object} params - Generation parameters
   * @param {string} params.topic - The topic or subject
   * @param {string} params.targetAge - Target age group
   * @param {string} params.difficulty - Difficulty level (beginner/intermediate/advanced)
   * @param {string} params.type - Resource type (flashcards/workbook/assessment/etc)
   * @param {string} params.category - Category (trauma-healing/language-learning/etc)
   * @param {string[]} params.jvdtKeys - Selected JVDT keys
   * @param {string} params.customRequirements - Additional requirements
   * @returns {Promise<Object>} Generated resource object
   */
  async generateResource(params) {
    if (!API_KEY) {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment.');
    }

    const prompt = this.buildPrompt(params);
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await this.makeAPICall(prompt);
        const resource = this.parseResponse(response, params);
        return resource;
      } catch (error) {
        console.warn(`AI generation attempt ${attempt} failed:`, error.message);
        
        if (attempt === this.maxRetries) {
          throw new Error(`Failed to generate resource after ${this.maxRetries} attempts: ${error.message}`);
        }
        
        // Exponential backoff
        const delay = this.baseDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }
  }

  /**
   * Build the prompt for AI resource generation
   */
  buildPrompt(params) {
    const jvdtKeysDescription = this.getJVDTKeysDescription(params.jvdtKeys);
    const formatInstructions = this.getFormatInstructions(params.type);
    
    return `You are an expert educational content creator specializing in the JVDT (Johannes van der Tuin) methodology. Create a high-quality educational resource with the following specifications:

RESOURCE SPECIFICATIONS:
- Topic: ${params.topic}
- Target Age: ${params.targetAge}
- Difficulty Level: ${params.difficulty}
- Resource Type: ${params.type}
- Category: ${params.category}
- JVDT Keys to Emphasize: ${params.jvdtKeys.join(', ') || 'None specified'}
- Additional Requirements: ${params.customRequirements || 'None'}

JVDT METHODOLOGY CONTEXT:
${jvdtKeysDescription}

FORMAT REQUIREMENTS:
${formatInstructions}

QUALITY STANDARDS:
- Ensure content is age-appropriate and culturally sensitive
- Include clear learning objectives
- Provide practical, actionable content
- Incorporate interactive elements where appropriate
- Align with evidence-based educational practices
- Include proper explanations and context

RESPONSE FORMAT:
Return ONLY a valid JSON object with this exact structure:
{
  "title": "Clear, descriptive title",
  "description": "Brief description of the resource and its purpose",
  "content": ${this.getContentStructure(params.type)},
  "metadata": {
    "estimatedDuration": "Time estimate (e.g., '15-20 minutes')",
    "learningObjectives": ["Objective 1", "Objective 2", "Objective 3"],
    "prerequisites": ["Prerequisite 1", "Prerequisite 2"] or null,
    "assessmentCriteria": ["Criteria 1", "Criteria 2"] or null
  },
  "tags": ["relevant", "tags", "for", "searchability"]
}

Ensure the JSON is properly formatted and contains no additional text or formatting.`;
  }

  /**
   * Get JVDT keys description for context
   */
  getJVDTKeysDescription(selectedKeys) {
    const keyDescriptions = {
      'Association': 'Connecting concepts, ideas, and experiences to build understanding and memory.',
      'Analysis': 'Breaking down complex information into component parts for deeper comprehension.',
      'Root': 'Identifying fundamental causes, origins, and core principles underlying issues.',
      'Context': 'Understanding environmental, cultural, and situational factors that influence learning.',
      'Integration': 'Combining multiple perspectives, skills, and knowledge areas into cohesive understanding.'
    };

    if (!selectedKeys || selectedKeys.length === 0) {
      return 'No specific JVDT keys specified. Use general best practices for educational content.';
    }

    return selectedKeys.map(key => `${key}: ${keyDescriptions[key]}`).join('\n');
  }

  /**
   * Get format-specific instructions
   */
  getFormatInstructions(type) {
    const instructions = {
      flashcards: `Create 10-20 flashcards with front/back content and optional explanations. Each card should focus on a key concept, term, or skill. Include visual or mnemonic hints where helpful.`,
      
      workbook: `Create a structured workbook with 3-5 sections. Each section should include explanatory content, practical activities, and reflection questions. Design for interactive engagement.`,
      
      assessment: `Create 10-15 assessment questions of varied types (multiple choice, short answer, scenario-based). Include correct answers and detailed explanations. Ensure comprehensive coverage of the topic.`,
      
      scenarios: `Create 3-5 realistic scenarios that allow learners to practice skills in context. Each scenario should include a detailed situation, discussion questions, and learning objectives.`,
      
      toolkit: `Create a practical toolkit with 5-10 tools, strategies, or techniques. Each tool should include clear instructions, when to use it, and examples of application.`,
      
      guide: `Create a step-by-step guide with clear instructions, tips, and best practices. Include troubleshooting advice and common pitfalls to avoid.`
    };

    return instructions[type] || 'Create educational content appropriate for the specified format.';
  }

  /**
   * Get content structure template for different resource types
   */
  getContentStructure(type) {
    const structures = {
      flashcards: `{
        "cards": [
          {
            "front": "Question or term",
            "back": "Answer or definition",
            "explanation": "Optional detailed explanation"
          }
        ]
      }`,
      
      workbook: `{
        "sections": [
          {
            "title": "Section title",
            "content": "Main content and explanation",
            "activities": ["Activity 1", "Activity 2"],
            "reflection_questions": ["Question 1", "Question 2"]
          }
        ]
      }`,
      
      assessment: `{
        "questions": [
          {
            "question": "The question text",
            "type": "multiple_choice",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option A",
            "explanation": "Why this answer is correct"
          }
        ]
      }`,
      
      scenarios: `{
        "scenarios": [
          {
            "title": "Scenario title",
            "description": "Detailed scenario description",
            "questions": ["Discussion question 1", "Discussion question 2"],
            "learning_objectives": ["Objective 1", "Objective 2"]
          }
        ]
      }`,
      
      toolkit: `{
        "tools": [
          {
            "name": "Tool name",
            "description": "What this tool does",
            "instructions": "How to use it",
            "when_to_use": "Appropriate situations",
            "example": "Concrete example of usage"
          }
        ]
      }`,
      
      guide: `{
        "steps": [
          {
            "step_number": 1,
            "title": "Step title",
            "description": "Detailed instructions",
            "tips": ["Tip 1", "Tip 2"],
            "common_mistakes": ["Mistake 1", "Mistake 2"]
          }
        ]
      }`
    };

    return structures[type] || `{
      "content": "Educational content in appropriate format"
    }`;
  }

  /**
   * Make API call to Gemini
   */
  async makeAPICall(prompt) {
    const response = await fetch(`${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    return await response.json();
  }

  /**
   * Parse and validate the AI response
   */
  parseResponse(response, originalParams) {
    try {
      const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('No content generated');
      }

      // Try to extract JSON from the response
      let jsonStr = text.trim();
      
      // Remove markdown code blocks if present
      if (jsonStr.startsWith('```json')) {
        jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const generatedContent = JSON.parse(jsonStr);

      // Create the complete resource object
      const resource = {
        id: crypto.randomUUID(),
        title: generatedContent.title,
        description: generatedContent.description,
        type: originalParams.type,
        category: originalParams.category,
        difficulty: originalParams.difficulty,
        targetAge: originalParams.targetAge,
        jvdtKeys: originalParams.jvdtKeys,
        content: generatedContent.content,
        estimatedDuration: generatedContent.metadata?.estimatedDuration || '15-30 minutes',
        tags: generatedContent.tags || [],
        isStatic: false,
        createdAt: new Date().toISOString(),
        generatedBy: 'AI',
        originalParams: originalParams,
        metadata: generatedContent.metadata || {}
      };

      this.validateResource(resource);
      return resource;

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.error('Raw response:', response);
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }

  /**
   * Validate the generated resource
   */
  validateResource(resource) {
    const required = ['id', 'title', 'description', 'type', 'content'];
    for (const field of required) {
      if (!resource[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!resource.content || typeof resource.content !== 'object') {
      throw new Error('Resource content must be a valid object');
    }
  }

  /**
   * Save generated resource to localStorage
   */
  saveGeneratedResource(resource) {
    try {
      const existingResources = JSON.parse(localStorage.getItem('jvdt:generated-resources') || '[]');
      existingResources.unshift(resource); // Add to beginning
      
      // Keep only the most recent 50 resources to prevent storage bloat
      const trimmedResources = existingResources.slice(0, 50);
      
      localStorage.setItem('jvdt:generated-resources', JSON.stringify(trimmedResources));
      return resource;
    } catch (error) {
      console.error('Failed to save resource to localStorage:', error);
      throw new Error('Failed to save resource locally');
    }
  }

  /**
   * Get all generated resources from localStorage
   */
  getGeneratedResources() {
    try {
      return JSON.parse(localStorage.getItem('jvdt:generated-resources') || '[]');
    } catch (error) {
      console.error('Failed to load generated resources:', error);
      return [];
    }
  }

  /**
   * Delete a generated resource
   */
  deleteGeneratedResource(resourceId) {
    try {
      const resources = this.getGeneratedResources();
      const filtered = resources.filter(r => r.id !== resourceId);
      localStorage.setItem('jvdt:generated-resources', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete resource:', error);
      return false;
    }
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export a singleton instance
export default new AIResourceService();