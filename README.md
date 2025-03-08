# MCP Enhancement Servers

A collection of servers for enhancing thinking capabilities in Model Context Protocol (MCP).

## Overview

This package provides a set of servers that implement various thinking enhancement capabilities:

- **Mental Model Server**: Applies mental models to problems
- **Sequential Thinking Server**: Processes sequential thoughts
- **Debugging Approach Server**: Applies debugging approaches to issues
- **Brainstorming Server**: Facilitates brainstorming sessions
- **Stochastic Algorithm Server**: Applies stochastic algorithms to problems
- **First Thought Advisor Server**: Recommends thinking approaches for problems

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
  'mentalModelServer',
  'apply_mental_model',
  {
    modelName: 'first_principles',
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

### Mental Model Server

Applies mental models to problems.

**Capabilities:**
- `apply_mental_model`: Applies a mental model to a problem
- `list_mental_models`: Lists all available mental models

### Sequential Thinking Server

Processes sequential thoughts.

**Capabilities:**
- `process_sequential_thought`: Processes a sequential thought

### Debugging Approach Server

Applies debugging approaches to issues.

**Capabilities:**
- `apply_debugging_approach`: Applies a debugging approach to an issue
- `list_debugging_approaches`: Lists all available debugging approaches

### Brainstorming Server

Facilitates brainstorming sessions.

**Capabilities:**
- `start_brainstorming`: Starts a brainstorming session
- `continue_brainstorming`: Continues an existing brainstorming session

### Stochastic Algorithm Server

Applies stochastic algorithms to problems.

**Capabilities:**
- `apply_stochastic_algorithm`: Applies a stochastic algorithm to a problem

### First Thought Advisor Server

Recommends thinking approaches for problems.

**Capabilities:**
- `get_thinking_approach`: Gets recommended thinking approach for a problem

## License

MIT
