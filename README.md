# MCP Enhancement Servers

A collection of servers for enhancing thinking capabilities in Model Context Protocol (MCP).

## Overview

This package provides a set of servers that implement various thinking enhancement capabilities, listed in order of priority:

### 1. Initial Analysis and Approach Selection Tools
- **First Thought Advisor Server**: Recommends initial thinking approaches for problems
- **Model Selector Server**: Helps select the optimal model for a task

### 2. Structured Thinking Tools
- **Sequential Thinking Server**: Processes sequential thoughts in steps, branches, and revisions
- **Mental Model Server**: Applies mental models to problems
- **Debugging Approach Server**: Applies debugging approaches to issues

### 3. Solution Generation and Optimization Tools
- **Brainstorming Server**: Facilitates structured brainstorming sessions
- **Stochastic Algorithm Server**: Applies stochastic algorithms to optimization problems

### 4. Feature and Requirements Tools
- **Feature Discussion Server**: Facilitates structured feature discussions
- **Feature Analyzer Server**: Analyzes feature complexity and dependencies

## Tool Priority

We've organized the tools in a recommended priority order to help AI/users choose the appropriate tool for different tasks. For detailed guidance on when to use each tool and recommended combinations for different scenarios, see [Tool Priority Guide](docs/TOOL_PRIORITY.md).

## Installation

```bash
npm install mcp-enhancement-servers
```

## Usage

### Basic Usage

```typescript
import { 
  servers, 
  handleServerRequest, 
  getAllCapabilities 
} from 'mcp-enhancement-servers';

// Get all server capabilities
const capabilities = getAllCapabilities();
console.log(capabilities);

// Handle a request to a specific server
const response = await handleServerRequest(
  'firstThoughtAdvisorServer',
  'get_thinking_approach',
  {
    problem: 'How to optimize a web application'
  }
);
console.log(response);
```

### Using Individual Servers

```typescript
import { MentalModelServer } from 'mcp-enhancement-servers';

// Create a server instance
const mentalModelServer = new MentalModelServer();

// Handle a request
const response = await mentalModelServer.handleRequest({
  capability: 'apply_mental_model',
  parameters: {
    modelName: 'systems_thinking',
    problem: 'Understanding complex user interactions'
  }
});
console.log(response);
```

## Available Servers

### First Thought Advisor Server

Recommends initial thinking approaches for problems.

**Capabilities:**
- `get_thinking_approach`: Gets recommended thinking approach for a problem

### Model Selector Server

Helps select the optimal model for a specific task.

**Capabilities:**
- `select_model`: Selects the optimal model based on task requirements and constraints

### Sequential Thinking Server

Processes sequential thoughts in steps, branches, and revisions.

**Capabilities:**
- `process_sequential_thought`: Processes a sequential thought with support for branching and revision

### Mental Model Server

Applies mental models to problems.

**Capabilities:**
- `apply_mental_model`: Applies a mental model to a problem
- `list_mental_models`: Lists all available mental models

### Debugging Approach Server

Applies debugging approaches to issues.

**Capabilities:**
- `apply_debugging_approach`: Applies a debugging approach to an issue
- `list_debugging_approaches`: Lists all available debugging approaches

### Brainstorming Server

Facilitates structured brainstorming sessions.

**Capabilities:**
- `start_brainstorming`: Starts a brainstorming session
- `continue_brainstorming`: Continues an existing brainstorming session

### Stochastic Algorithm Server

Applies stochastic algorithms to optimization problems.

**Capabilities:**
- `apply_stochastic_algorithm`: Applies a stochastic algorithm to an optimization problem

### Feature Discussion Server

Facilitates structured feature discussions.

**Capabilities:**
- `begin_feature_discussion`: Starts a new feature discussion
- `provide_feature_input`: Provides input to an ongoing feature discussion

### Feature Analyzer Server

Analyzes feature complexity and dependencies.

**Capabilities:**
- `analyze_feature`: Analyzes a feature's complexity, dependencies, and implementation challenges

## License

MIT
