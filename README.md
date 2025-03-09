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

### 5. AI Integration Layer (New)
- **AI Tool Recommendation**: Recommends appropriate MCP tools based on context
- **Enhanced Tool Descriptions**: Provides detailed documentation to help AI assistants
- **Tool Selection Guidance**: Offers prioritized recommendations for effective tool usage

## Documentation

Comprehensive documentation for the MCP toolkit is available in the [docs](docs) directory:

- [**Tool Arguments Reference**](docs/TOOLS_ARGUMENTS.md) - Complete reference for all tools and their arguments
- [**Tool Priority Guide**](docs/TOOL_PRIORITY.md) - Guide on which tools to use and in what order
- [**Model Selector Usage Guide**](docs/MODEL_SELECTOR_USAGE.md) - Detailed guide for the Model Selector tool
- [**Documentation Index**](docs/README.md) - Overview of all available documentation

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

Helps select the optimal model for a specific task. Now with enhanced capabilities for programming tasks, including architecture selection, design patterns, algorithms, and data structures.

**Capabilities:**
- `select_model`: Selects the optimal model based on task requirements and constraints
- `list_models`: Lists all available models, optionally filtered by category
- `compare_models`: Compares two or more models side by side

See [Model Selector Usage Guide](docs/MODEL_SELECTOR_USAGE.md) for detailed examples and best practices.

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

### AI Integration Server (New)

Provides enhanced tool descriptions, recommendations, and guidance for AI assistants to better utilize the MCP tools.

**Capabilities:**
- `ai_tool_recommendation`: Recommends appropriate tools based on context
- `get_tool_description`: Provides detailed information about a specific tool
- `get_all_tool_descriptions`: Lists all available tools with descriptions

**Usage:**
```typescript
// Start the AI Integration Server
import { startAiIntegrationServer } from 'mcp-enhancement-servers/ai-integration';

// Start the server
startAiIntegrationServer();

// Or use the API directly in your code
import { AiIntegrationLayer } from 'mcp-enhancement-servers/ai-integration';

// Get tool recommendations based on context
const recommendations = AiIntegrationLayer.recommendTools({
  problemStatement: "Need to design a scalable architecture for a web application",
  domain: "programming",
  complexity: "complex"
});

// Get detailed information about a specific tool
const toolDescription = AiIntegrationLayer.getToolDescription("model_selector");

// Generate a summary of all available tools
const toolsSummary = AiIntegrationLayer.getToolsSummary();
```

## License

MIT