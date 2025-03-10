# MCP Clear Thought Server

This server provides cognitive enhancement tools for AI assistants, including:

- Mental Models
- Sequential Thinking
- Debugging Approaches
- Brainstorming
- First Thought Advisor
- Stochastic Algorithms

## Debugging the Mental Model Tool

### Problem

The `mental_model` tool was experiencing issues with JSON formatting and error handling, causing failures when:

1. Special characters were present in the model output
2. Error conditions were not properly handled
3. JSON parsing failed due to invalid input

### Solution

We've implemented several improvements to make the tool more robust:

1. **Enhanced Error Handling**:
   - Added try/catch blocks around JSON parsing
   - Improved error reporting with detailed messages
   - Added fallback responses when errors occur

2. **Caching for Performance**:
   - Implemented model caching to avoid repeated file reads
   - Added validation of loaded models

3. **Robust Response Formatting**:
   - Simplified response structure
   - Added additional error checking
   - Improved JSON serialization with proper error handling

4. **Logging for Debugging**:
   - Added detailed logs for request parameters
   - Included stack traces for errors
   - Added validation checks for response format

## Enhancing the Sequential Thinking Tool

### Problem

The `sequential_thinking` tool had similar issues with error handling and could fail when:

1. Optional parameters had incorrect types
2. Logical validation was missing for related parameters
3. Special characters or formatting issues occurred
4. Error handling was insufficient for complex scenarios

### Solution

We've made the following improvements:

1. **Enhanced Validation**:
   - Added type checking for all optional parameters
   - Implemented logical validation between related parameters
   - Made sure required parameters are present when certain options are used

2. **Improved Error Handling**:
   - Added try/catch blocks around formatting and JSON serialization
   - Improved error reporting with specific messages
   - Implemented fallback responses for error conditions

3. **Better Response Structure**:
   - Simplified the response format
   - Added additional useful fields in the response
   - Ensured all responses follow a consistent pattern

4. **Robust Console Output**:
   - Added error handling around console formatting
   - Ensured formatting errors don't crash the application
   - Improved debug information

## Enhancing the Brainstorming Tool

### Problem

The `brainstorming` tool had several issues that needed to be addressed:

1. Lack of error handling when formatting complex output
2. No handling for long strings or special characters
3. Insufficient logging for debugging session state
4. Inconsistent phase checking (using input phase instead of session phase)
5. No fallback for JSON serialization errors

### Solution

We've implemented the following improvements:

1. **Robust Formatting**:
   - Added try/catch blocks around all formatting operations
   - Implemented truncation for long strings
   - Added error handling for each idea and model formatting
   - Created fallback display for formatting errors

2. **Enhanced Logging**:
   - Added detailed logs for session creation and updates
   - Included logging for idea additions and modifications
   - Added error reporting for failed operations
   - Improved traceability of session state changes

3. **Improved Error Handling**:
   - Added comprehensive error handling for JSON serialization
   - Created fallback responses for error conditions
   - Improved error message clarity
   - Added safeguards against invalid data

4. **Better Response Structure**:
   - Added more useful fields in the response
   - Included lastIdeaId when adding new ideas
   - Standardized response format
   - Improved consistency with other tools

## Testing

Test scripts have been added to verify the functionality of both tools:

```bash
# Test the mental model tool
npm run test:mental-model

# Test the sequential thinking tool
npm run test:sequential-thinking

# Test the brainstorming tool
npm run test:brainstorming
```

These scripts test various scenarios including:
- Valid inputs with different parameters
- Invalid inputs with missing or incorrect data
- Edge cases with special characters
- Error handling mechanisms

## Usage

To use the mental model tool:

```javascript
{
  "modelName": "first_principles",
  "problem": "Our application is slow and users are complaining"
}
```

Available models include:
- first_principles
- occams_razor
- systems_thinking
- rubber_duck
- pareto_principle
- and many more...

## Development

To build the server:

```bash
npm run build
```

To start the server:

```bash
npm start
```

## Features

### Mental Models
- First Principles Thinking
- Opportunity Cost Analysis
- Error Propagation Understanding
- Rubber Duck Debugging
- Pareto Principle
- Occam's Razor
- And many more...

### Design Patterns
- Modular Architecture
- API Integration Patterns
- State Management
- Asynchronous Processing
- Scalability Considerations
- Security Best Practices
- Agentic Design Patterns

Note: Compatible with various modern web frameworks and architectures.

### Programming Paradigms
- Imperative Programming
- Procedural Programming
- Object-Oriented Programming
- Functional Programming
- Declarative Programming
- Logic Programming
- Event-Driven Programming
- Aspect-Oriented Programming
- Concurrent Programming
- Reactive Programming

### Debugging Approaches
- Binary Search
- Reverse Engineering
- Divide and Conquer
- Backtracking
- Cause Elimination
- Program Slicing
- Advanced debugging patterns

### Sequential Thinking
- Structured thought process
- Revision and branching support
- Progress tracking
- Context maintenance

## Tool Selection Guide

Each tool in the Clear Thought MCP Server has specific strengths. Here are some scenarios where each tool might be particularly useful:

### Mental Models
Best suited for:
- Initial problem understanding
- Breaking down complex systems
- Analyzing trade-offs
- Finding root causes
- Making strategic decisions

Example scenarios:
- Analyzing system architecture choices
- Evaluating competing solutions
- Understanding error patterns

### Design Patterns
Best suited for:
- Implementing proven solutions
- Structuring new features
- Ensuring maintainable code
- Scaling applications
- Managing technical debt

Example scenarios:
- Building new system components
- Refactoring existing code
- Implementing cross-cutting concerns

### Debugging Approaches
Best suited for:
- Troubleshooting issues
- Performance optimization
- System analysis
- Error resolution
- Quality assurance

Example scenarios:
- Fixing production issues
- Optimizing slow processes
- Resolving integration problems

### Sequential Thinking
Best suited for:
- Complex problem-solving
- Multi-step analysis
- Decision refinement
- Process improvement
- Comprehensive planning

Example scenarios:
- Planning major features
- Analyzing system-wide changes
- Making architectural decisions

Note: These are suggestions rather than rules. Tools can be used in any order or combination that best serves your needs.

## Installation

### Installing via Smithery

To install Clear Thought MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@waldzellai/clear-thought):

```bash
npx -y @smithery/cli install @waldzellai/clear-thought --client claude
```

### Manual Installation
```bash
npm install @waldzellai/clear-thought
```

Or run with npx:

```bash
npx @waldzellai/clear-thought
```

## Docker

Build the Docker image:

```bash
docker build -t waldzellai/clear-thought .
```

Run the container:

```bash
docker run -it waldzellai/clear-thought
```

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Start the server: `npm start`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE for details.

## Acknowledgments

- Based on the Model Context Protocol (MCP) by Anthropic, and uses the code for the sequentialthinking server
- Mental Models framework inspired by [James Clear's comprehensive guide to mental models](https://jamesclear.com/mental-models), which provides an excellent overview of how these thinking tools can enhance decision-making and problem-solving capabilities
