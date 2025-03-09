# MCP Tools and Arguments Reference Guide

This comprehensive reference guide documents all available MCP tools, their arguments, and provides examples of how to use them effectively. This document serves as a central resource for understanding the capabilities and proper usage of each tool in the MCP toolkit.

## Table of Contents

1. [Initial Analysis Tools](#initial-analysis-tools)
   - [First Thought Advisor](#first-thought-advisor)
   - [Model Selector](#model-selector)
2. [Structured Thinking Tools](#structured-thinking-tools)
   - [Sequential Thinking](#sequential-thinking)
   - [Mental Model](#mental-model)
3. [Solution Generation Tools](#solution-generation-tools)
   - [Brainstorming](#brainstorming)
   - [Stochastic Algorithm](#stochastic-algorithm)
4. [Debugging Tools](#debugging-tools)
   - [Debugging Approach](#debugging-approach)
5. [Feature Analysis Tools](#feature-analysis-tools)
   - [Feature Discussion](#feature-discussion)
   - [Feature Analyzer](#feature-analyzer)

---

## Initial Analysis Tools

### First Thought Advisor

The First Thought Advisor tool intelligently recommends the optimal mental model or algorithm for any problem. It helps AI assistants select the best approach to solving a problem based on its characteristics.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| problem | string | Yes | The problem to analyze |
| goal | string | No | The desired outcome or objective |
| domain | string | No | The field or area the problem belongs to |
| complexity | string | No | An assessment of the problem's complexity |
| constraints | array of strings | No | Any limitations or requirements |
| previousApproaches | array of strings | No | Approaches that have been tried already |

#### Example

```json
{
  "problem": "Our application is experiencing performance issues during peak usage hours",
  "goal": "Improve response time to under 200ms even during high traffic",
  "domain": "Web Application Backend",
  "complexity": "Medium to High",
  "constraints": ["Cannot add more servers", "Must maintain current API contracts"],
  "previousApproaches": ["Added database indexes", "Implemented basic caching"]
}
```

### Model Selector

The Model Selector helps select the optimal architecture, design pattern, algorithm, or data structure for programming tasks. It is particularly useful for software design decisions.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| task | string | Yes | The specific programming task or problem |
| context | string | No | Additional information about the project or environment |
| constraints | array of strings | No | Any limitations or requirements |
| preferences | array of strings | No | Desired qualities for the solution |
| language | string | No | The programming language being used |
| projectScale | string | No | Size of the project (Small, Medium, Large, Enterprise) |

#### Example

```json
{
  "task": "Design a system to process and analyze large batches of financial transaction data",
  "context": "Enterprise banking application that needs to handle regulatory compliance and fraud detection",
  "constraints": ["Must process data in near real-time", "Must be fault-tolerant"],
  "preferences": ["Scalability", "Maintainability", "Performance"],
  "language": "Java",
  "projectScale": "Large"
}
```

---

## Structured Thinking Tools

### Sequential Thinking

The Sequential Thinking tool facilitates dynamic and reflective problem-solving through sequential thoughts. It allows thoughts to build upon each other in a structured way.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| thought | string | Yes | The current thinking step |
| thoughtNumber | integer | Yes | Current number in sequence |
| totalThoughts | integer | Yes | Estimated total thoughts needed |
| nextThoughtNeeded | boolean | Yes | Whether another thought step is needed |
| isRevision | boolean | No | Whether this revises previous thinking |
| revisesThought | integer | No | Which thought is being reconsidered |
| branchFromThought | integer | No | Branching point thought number |
| branchId | string | No | Branch identifier |
| needsMoreThoughts | boolean | No | If more thoughts are needed |

#### Example

```json
{
  "thought": "The application performance issue might be related to the database query optimization",
  "thoughtNumber": 1,
  "totalThoughts": 5,
  "nextThoughtNeeded": true
}
```

Revision example:

```json
{
  "thought": "After reviewing the logs, I see that the performance issue is actually in the API gateway, not the database",
  "thoughtNumber": 2,
  "totalThoughts": 5,
  "nextThoughtNeeded": true,
  "isRevision": true,
  "revisesThought": 1
}
```

Branching example:

```json
{
  "thought": "Let's explore an alternative approach using caching at the API level",
  "thoughtNumber": 3,
  "totalThoughts": 5,
  "nextThoughtNeeded": true,
  "branchFromThought": 2,
  "branchId": "api-caching-solution"
}
```

### Mental Model

The Mental Model tool applies structured mental models to problem-solving. It helps break down complex problems using established thinking frameworks.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| modelName | string | Yes | The mental model to apply |
| problem | string | Yes | The problem to analyze using the selected mental model |

#### Available Models

**General Mental Models:**
- first_principles
- opportunity_cost
- error_propagation
- rubber_duck
- pareto_principle
- occams_razor
- regression_to_mean
- confirmation_bias
- normal_distribution
- sensitivity_analysis
- bayes_theorem
- survivorship_bias
- systems_thinking
- thought_experiment
- hanlons_razor
- proximate_ultimate_causation
- zero_sum_game
- loss_aversion
- sunk_cost
- lateral_thinking
- divergent_thinking
- scientific_method
- decision_tree
- scenario_planning
- simulation
- catalysis
- ecosystem

**Programming-Oriented Mental Models:**
- **composition_vs_inheritance**: Design principle that favors object composition over class inheritance for code reuse and flexibility
- **single_responsibility**: Principle that a class or module should have only one responsibility or reason to change
- **interface_segregation**: Separating what something does (interface) from how it does it (implementation)
- **actor_model**: Concurrency model where independent actors communicate by message passing without shared state
- **time_space_complexity**: Analysis of algorithm efficiency in terms of time and space requirements

#### Example

```json
{
  "modelName": "systems_thinking",
  "problem": "Our e-commerce platform experiences frequent outages during flash sales events"
}
```

Programming example:

```json
{
  "modelName": "single_responsibility",
  "problem": "Our UserManager class has become bloated and handles authentication, profile updates, and notification sending"
}
```

---

## Solution Generation Tools

### Brainstorming

The Brainstorming tool facilitates structured brainstorming sessions. It guides through different phases of the ideation process.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| phase | string | No | The current phase of brainstorming |
| topic | string | No | The topic for brainstorming |
| sessionId | string | No | Identifier for the brainstorming session |

#### Available Phases

- preparation
- ideation
- clarification
- evaluation
- selection
- action_planning

#### Example

```json
{
  "phase": "ideation",
  "topic": "Improving application performance during peak hours",
  "sessionId": "perf-improvement-2023-03-15"
}
```

### Stochastic Algorithm

The Stochastic Algorithm tool applies probabilistic algorithms to decision-making problems. It's useful for problems with uncertainty or randomness.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| algorithm | string | Yes | The algorithm to apply |
| problem | string | Yes | The problem to solve |
| parameters | object | Yes | Algorithm-specific parameters |
| result | string | No | Result of algorithm application |

#### Available Algorithms

- mdp (Markov Decision Process)
- mcts (Monte Carlo Tree Search)
- bandit (Multi-armed Bandit)
- bayesian (Bayesian Optimization)
- hmm (Hidden Markov Model)

#### Example

```json
{
  "algorithm": "mcts",
  "problem": "Optimizing resource allocation across multiple services with varying demand",
  "parameters": {
    "iterations": 1000,
    "explorationFactor": 1.414,
    "maxDepth": 10
  }
}
```

---

## Debugging Tools

### Debugging Approach

The Debugging Approach tool applies systematic debugging methodologies to technical issues. It helps identify, isolate, and resolve problems.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| approachName | string | Yes | The debugging approach to apply |
| issue | string | Yes | The technical issue to debug |
| steps | array of strings | No | Steps taken in the debugging process |
| findings | string | No | Discoveries made during debugging |
| resolution | string | No | Solution to the issue |

#### Available Approaches

- binary_search
- reverse_engineering
- divide_conquer
- backtracking
- cause_elimination
- program_slicing

#### Example

```json
{
  "approachName": "binary_search",
  "issue": "Application performance degradation occurred in one of the recent releases"
}
```

With steps and findings:

```json
{
  "approachName": "cause_elimination",
  "issue": "Intermittent authentication failures during peak hours",
  "steps": [
    "Checked database connection issues",
    "Verified JWT token generation",
    "Examined rate limiting configuration",
    "Analyzed load balancer settings"
  ],
  "findings": "Load balancer session affinity was misconfigured, causing requests to be routed to different servers during the same session",
  "resolution": "Updated load balancer configuration to maintain session affinity based on user ID"
}
```

---

## Feature Analysis Tools

### Feature Discussion

The Feature Discussion tool facilitates structured feature discussions. It helps explore and define features collaboratively.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| featureId | string | Yes | Identifier for the feature |
| response | string | Yes | Content of the discussion |

#### Example

```json
{
  "featureId": "user-preferences-system",
  "response": "The user preferences system should store settings persistently across sessions and synchronize across devices when the user is logged in."
}
```

### Feature Analyzer

The Feature Analyzer tool analyzes features for feasibility, complexity, and impact. It helps evaluate proposed features.

#### Arguments

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| featureName | string | Yes | Name of the feature to analyze |
| featureDescription | string | No | Detailed description of the feature |

#### Example

```json
{
  "featureName": "Real-time Collaboration",
  "featureDescription": "Allow multiple users to edit the same document simultaneously with changes syncing in real-time across all connected clients. Changes should be merged intelligently to avoid conflicts."
}
```

---

## Best Practices for Using MCP Tools

1. **Start with analysis tools** before jumping to implementation
2. **Combine tools** for complex problems (e.g., First Thought Advisor → Mental Model → Sequential Thinking)
3. **Use structured thinking tools** to break down complex problems
4. **Document your thinking process** with Sequential Thinking
5. **Revise previous thoughts** when new information emerges
6. **Branch thinking paths** to explore alternatives
7. **Specify constraints** to get more relevant recommendations
8. **Provide detailed context** for more accurate tool outputs
9. **Follow recommended phases** for tools that have them (e.g., Brainstorming)
10. **Use programming-specific mental models** for code design challenges
11. **Choose the right debugging approach** based on the nature of the issue
12. **Update findings and resolutions** as debugging progresses

This documentation will be continually updated as new tools are added or existing tools are enhanced. 