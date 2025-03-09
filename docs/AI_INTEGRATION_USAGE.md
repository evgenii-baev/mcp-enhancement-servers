# AI Integration Layer Usage Guide

The AI Integration Layer provides enhanced tool descriptions, recommendations, and guidance to help AI assistants better utilize the MCP mental models and thinking tools. This guide explains how to use the AI Integration Server and its capabilities effectively.

## Overview

The AI Integration Layer serves as a bridge between AI assistants and the MCP thinking tools, providing:

1. **Enhanced Tool Descriptions**: Detailed, structured documentation for each tool
2. **Context-Aware Tool Recommendations**: Intelligent recommendations based on problem context
3. **Tool Selection Guidance**: Prioritized suggestions for effective tool usage
4. **Parameter Suggestions**: Recommendations for appropriate parameter values

## Starting the AI Integration Server

You can run the AI Integration Server as a standalone MCP server:

```bash
# Via npm script
npm run start:ai-integration

# Or directly
node dist/ai-integration/start-server.js
```

## API Reference

### AI Tool Recommendation

Recommends appropriate MCP tools based on the user's context.

**Input:**
```json
{
  "problemStatement": "Need to design a scalable architecture for a web application",
  "domain": "programming",
  "complexity": "complex",
  "constraints": ["time", "performance"],
  "previouslyUsedTools": ["mental_model"]
}
```

**Output:**
```json
[
  {
    "tool": {
      "name": "model_selector",
      "displayName": "Model Selector",
      "description": "...",
      "category": "Programming",
      "priority": 1,
      "aiUsageHints": [...]
    },
    "confidence": 0.85,
    "rationale": "This tool is recommended because: Base confidence from priority: +0.50; Keyword matches (architecture, design, approach): +0.23; Domain relevance: +0.20; Complexity match: +0.10",
    "suggestedParameters": {
      "task": "Design a scalable architecture for a web application",
      "context": "Need to design a scalable architecture for a web application"
    }
  },
  {
    "tool": {
      "name": "first_thought_advisor",
      "displayName": "First Thought Advisor",
      "description": "...",
      "category": "Initial Analysis",
      "priority": 1,
      "aiUsageHints": [...]
    },
    "confidence": 0.65,
    "rationale": "This tool is recommended because: Base confidence from priority: +0.50; Domain relevance: +0.15; Used as first approach for complex problems",
    "suggestedParameters": {}
  }
]
```

### Get Tool Description

Retrieves detailed information about a specific tool.

**Input:**
```json
{
  "toolName": "mental_model"
}
```

**Output:**
```json
{
  "name": "mental_model",
  "displayName": "Mental Model",
  "description": "A comprehensive tool for applying structured mental models to problem-solving...",
  "category": "Thinking Framework",
  "priority": 3,
  "aiUsageHints": [
    "Suggest this tool when users need to analyze complex problems systematically",
    "Recommend specific mental models based on the problem domain",
    "For programming tasks, prioritize domain-specific models like composition_vs_inheritance",
    "Use this after First Thought Advisor when a specific thinking framework is needed"
  ]
}
```

### Get All Tool Descriptions

Lists all available tools with their descriptions.

**Input:**
```json
{
  "format": "summary"
}
```

**Output:**
```
# Available MCP Mental Models Tool Summary

The following tools are available to help with problem-solving, analysis, and decision-making:

## Initial Analysis Tools

### First Thought Advisor (first_thought_advisor)
An intelligent recommendation tool for identifying the optimal mental model, algorithm, or approach for any problem.

**When to use:**
- At the beginning of approaching a new problem
- When you're unsure which mental model or algorithm would be most appropriate
- When facing an unfamiliar type of problem
- When you have multiple possible approaches and need guidance on where to start
- When you want to ensure you're using the most efficient approach for your problem type

**AI Usage Hints:**
- Suggest this as the first tool when approaching new problems
- Use this before diving into specific mental models or approaches
- Help formulate clear problem statements for optimal recommendations
- Consider domain, complexity, and constraints when suggesting this tool

...
```

## Using the API Directly

You can also use the AI Integration Layer API directly in your code:

```typescript
import { AiIntegrationLayer } from 'mcp-enhancement-servers/ai-integration';

// Get tool recommendations based on context
const recommendations = AiIntegrationLayer.recommendTools({
  problemStatement: "Need to design a scalable architecture for a web application",
  domain: "programming",
  complexity: "complex"
});

// Get detailed information about a specific tool
const toolDescription = AiIntegrationLayer.getToolDescription("model_selector");

// Get all tool descriptions
const allTools = AiIntegrationLayer.getAllToolDescriptions();

// Get tools grouped by category
const toolsByCategory = AiIntegrationLayer.getToolsByCategory();

// Get tools ordered by priority
const toolsByPriority = AiIntegrationLayer.getToolsByPriority();

// Generate a summary of all available tools
const toolsSummary = AiIntegrationLayer.getToolsSummary();
```

## Recommended Patterns for AI Assistants

When building AI assistants that integrate with MCP mental models tools, we recommend the following patterns:

1. **Start with AI Tool Recommendation**: When a user presents a problem, use the `ai_tool_recommendation` to get context-appropriate tools
2. **Provide Tool Explanation**: Use the detailed tool descriptions to explain to users why a particular tool is recommended
3. **Progressive Tool Usage**: Start with higher priority tools (lower priority number) before moving to more specialized tools
4. **Follow Category Order**: Generally follow the category sequence: Initial Analysis → Structured Thinking → Solution Generation → Requirements
5. **Use Suggested Parameters**: When available, use the suggested parameters to pre-fill tool inputs
6. **Educate Users**: Use the detailed tool descriptions to help users understand the mental models and approaches

## Tool Categories and Priorities

Tools are organized into categories with assigned priorities (lower number = higher priority):

1. **Initial Analysis (Priority 1)**: 
   - First Thought Advisor
   - Model Selector

2. **Thinking Framework (Priority 2-3)**:
   - Sequential Thinking (2)
   - Mental Model (3)
   - Debugging Approach (3)

3. **Idea Generation (Priority 3)**:
   - Brainstorming
   - Stochastic Algorithm

4. **Requirements (Priority 4)**:
   - Feature Discussion
   - Feature Analyzer

## Example Workflows

### For Problem Analysis:
1. First Thought Advisor → Mental Model → Sequential Thinking

### For Solution Design:
1. First Thought Advisor → Model Selector → Brainstorming → Feature Discussion

### For Debugging Issues:
1. First Thought Advisor → Debugging Approach → Sequential Thinking 