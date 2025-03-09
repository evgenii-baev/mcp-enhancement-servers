/**
 * Улучшенные описания для инструментов MCP
 * Эти описания используются для отображения в IDE и для авто-документации
 */

import { ToolDescription } from '../interfaces/tool-description.js';
import { createToolDescription } from '../utils/tool-description-utils.js';

/**
 * Описание инструмента Mental Model
 */
export const MENTAL_MODEL_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Mental Model",
   purpose: "A tool for applying structured mental models to problem-solving.",
   whenToUse: [
      "When facing complex problems requiring different thinking approaches",
      "When you want to analyze a problem from a specific perspective",
      "When traditional approaches have failed to yield satisfactory solutions",
      "When you need to teach or explain a specific mental model to a user"
   ],
   capabilities: [
      {
         name: "apply_mental_model",
         description: "Applies a specific mental model to analyze a problem",
         keyParameters: ["modelName", "problem"]
      }
   ],
   exampleScenarios: [
      "Using first principles to break down a complex software architecture",
      "Applying systems thinking to understand interdependencies in a codebase",
      "Using the scientific method to debug an inconsistent issue",
      "Analyzing time and space complexity for algorithm optimization"
   ],
   bestPractices: [
      "Be explicit about which mental model you're using",
      "Explain why you chose that particular model for the problem",
      "Document insights gained from applying the model",
      "Consider using multiple models for complex problems"
   ],
   integration: {
      withAI: "This tool helps AI assistants structure their thinking process and communicate it to users",
      examples: [
         "When analyzing a complex system: 'I'll use the systems thinking model to understand the interdependencies in your architecture.'",
         "When debugging: 'Let me apply the scientific method to systematically identify the root cause of this issue.'"
      ]
   },
   parameterDescriptions: {
      "modelName": "The mental model to apply. For programming problems, consider using the specialized programming models: composition_vs_inheritance, single_responsibility, interface_segregation, actor_model, or time_space_complexity.",
      "problem": "The problem to analyze using the selected mental model. For programming models, provide specific code design or architectural challenges."
   },
   exampleUsage: {
      "modelName": "first_principles",
      "problem": "How should we architect our data pipeline to handle 10x the current load?"
   }
});

/**
 * Описание инструмента Sequential Thinking
 */
export const SEQUENTIAL_THINKING_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Sequential Thinking",
   purpose: "A tool for dynamic and reflective problem-solving through sequential thoughts.",
   whenToUse: [
      "When solving complex, multi-step problems",
      "When you need to break down reasoning into discrete steps",
      "When you want to show your thinking process transparently",
      "When exploring multiple solution branches is helpful"
   ],
   capabilities: [
      {
         name: "think_sequentially",
         description: "Produces a series of connected thoughts to solve a problem",
         keyParameters: ["thought", "thoughtNumber", "totalThoughts", "nextThoughtNeeded"]
      },
      {
         name: "branch_thinking",
         description: "Creates alternative thinking paths from a specific thought",
         keyParameters: ["branchFromThought", "branchId"]
      },
      {
         name: "revise_thinking",
         description: "Updates a previous thought with new information",
         keyParameters: ["revisesThought", "isRevision"]
      }
   ],
   exampleScenarios: [
      "Debugging a complex issue step by step",
      "Planning architecture with multiple considerations",
      "Exploring different approaches to algorithm design",
      "Decomposing a complex function into manageable pieces"
   ],
   bestPractices: [
      "Keep individual thoughts focused and concise",
      "Clearly indicate when you're branching to an alternative solution",
      "Use revision to improve earlier thoughts with new insights",
      "Summarize key insights at the end of the thinking sequence"
   ],
   integration: {
      withAI: "AIs can use this tool to make their thinking process explicit and revisable",
      examples: [
         "When solving a complex problem: 'Let me think through this step by step to find the best approach.'",
         "When exploring alternatives: 'I'll branch my thinking here to consider a different solution path.'"
      ]
   },
   parameterDescriptions: {
      "thought": "The current thought or reasoning step",
      "thoughtNumber": "The sequential number of the current thought (starting from 1)",
      "totalThoughts": "The estimated total number of thoughts needed",
      "nextThoughtNeeded": "Whether additional thoughts are needed to complete the reasoning",
      "branchFromThought": "Number of the thought from which to create an alternative reasoning path",
      "branchId": "Identifier for the current reasoning branch",
      "revisesThought": "Number of the thought being revised with new information",
      "isRevision": "Whether this thought is a revision of a previous thought",
      "needsMoreThoughts": "Indicates if additional thoughts would be helpful beyond the initial estimate"
   },
   exampleUsage: {
      "thought": "Let's analyze the time complexity of this recursive function",
      "thoughtNumber": 1,
      "totalThoughts": 5,
      "nextThoughtNeeded": true
   }
});

/**
 * Описание инструмента Debugging Approach
 */
export const DEBUGGING_APPROACH_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Debugging Approach",
   purpose: "A tool for applying systematic debugging approaches to technical issues.",
   whenToUse: [
      "When facing complex or difficult-to-reproduce bugs",
      "When standard debugging techniques have failed",
      "When you need a structured approach to isolate issues",
      "When documenting debugging processes for future reference"
   ],
   capabilities: [
      {
         name: "apply_debugging_approach",
         description: "Applies a specific debugging methodology to troubleshoot an issue",
         keyParameters: ["approachName", "issue"]
      },
      {
         name: "document_findings",
         description: "Records observations and patterns discovered during debugging",
         keyParameters: ["findings"]
      },
      {
         name: "propose_steps",
         description: "Suggests specific actions to isolate or resolve the issue",
         keyParameters: ["steps"]
      },
      {
         name: "resolve_issue",
         description: "Documents the solution that fixed the problem",
         keyParameters: ["resolution"]
      }
   ],
   exampleScenarios: [
      "Using binary search to locate a performance regression",
      "Applying divide and conquer to isolate a race condition",
      "Using backtracking to understand a complex state management bug",
      "Applying program slicing to identify relevant code for a memory leak"
   ],
   bestPractices: [
      "Document each step of the debugging process",
      "Test hypotheses systematically before moving on",
      "Create minimal reproducible examples when possible",
      "Consider environmental factors that might contribute to the issue"
   ],
   integration: {
      withAI: "AI assistants can use this tool to structure and document their debugging processes",
      examples: [
         "When facing a complex bug: 'I'll use binary search debugging to narrow down where the issue occurs.'",
         "When analyzing a performance problem: 'Let me apply divide and conquer to isolate which component is causing the slowdown.'"
      ]
   },
   parameterDescriptions: {
      "approachName": "The debugging methodology to apply (binary_search, reverse_engineering, divide_conquer, backtracking, cause_elimination, program_slicing)",
      "issue": "Description of the problem to be debugged",
      "findings": "Observations and patterns discovered during the debugging process",
      "steps": "Specific actions taken or recommended to isolate and resolve the issue",
      "resolution": "The solution that fixed the problem, including explanation of root cause"
   },
   exampleUsage: {
      "approachName": "binary_search",
      "issue": "Performance degradation occurred between version 2.1 and 2.8"
   }
});

/**
 * Описание инструмента Brainstorming
 */
export const BRAINSTORMING_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Brainstorming",
   purpose: "A tool for facilitating structured brainstorming sessions.",
   whenToUse: [
      "When generating ideas for a new feature or project",
      "When exploring multiple solutions to a problem",
      "When creativity and divergent thinking are needed",
      "When organizing collaborative ideation"
   ],
   capabilities: [
      {
         name: "create_session",
         description: "Starts a new brainstorming session on a specific topic",
         keyParameters: ["topic", "participants"]
      },
      {
         name: "generate_ideas",
         description: "Adds new ideas during the ideation phase",
         keyParameters: ["newIdea", "sessionId", "phase"]
      },
      {
         name: "categorize_ideas",
         description: "Groups related ideas during the clarification phase",
         keyParameters: ["ideaId", "category", "phase"]
      },
      {
         name: "evaluate_ideas",
         description: "Votes on ideas during the evaluation phase",
         keyParameters: ["voteForIdea", "phase"]
      },
      {
         name: "select_ideas",
         description: "Chooses top ideas to implement during the selection phase",
         keyParameters: ["selectIdea", "phase"]
      },
      {
         name: "plan_actions",
         description: "Creates action plans for selected ideas",
         keyParameters: ["ideaId", "action", "phase"]
      }
   ],
   exampleScenarios: [
      "Generating feature ideas for a new product release",
      "Exploring architectural approaches for a system redesign",
      "Brainstorming solutions to performance bottlenecks",
      "Planning refactoring strategies for legacy code"
   ],
   bestPractices: [
      "Follow the structured phases: preparation → ideation → clarification → evaluation → selection → action planning",
      "Encourage quantity of ideas during ideation before evaluating",
      "Group similar ideas to identify patterns and themes",
      "Create specific, actionable plans for implementation"
   ],
   integration: {
      withAI: "AI assistants can use this tool to facilitate creative problem-solving sessions",
      examples: [
         "When designing a new feature: 'Let's start a brainstorming session to explore different approaches to this problem.'",
         "When refactoring: 'We can use brainstorming to identify the best strategies for improving this code.'"
      ]
   },
   parameterDescriptions: {
      "topic": "The main subject or problem for brainstorming. Be specific enough to focus ideation but broad enough to allow creative solutions. Required when creating a new session.",
      "sessionId": "Identifier for an existing brainstorming session. Use this to continue a previously started session, allowing for persistent brainstorming across multiple interactions.",
      "phase": "Current phase of the brainstorming process. Progress through phases in sequence: preparation → ideation → clarification → evaluation → selection → action_planning.",
      "participants": "People involved in the brainstorming session. Tracking participants helps ensure diverse perspectives and assign responsibilities.",
      "newIdea": "A new idea to add to the session during the ideation phase. Should be clear, concise, and relevant to the brainstorming topic.",
      "category": "Category name for grouping related ideas during the clarification phase. Helps organize ideas by theme or type.",
      "ideaId": "Identifier for a specific idea, used when categorizing, voting for, selecting, or adding actions to an idea.",
      "voteForIdea": "ID of an idea to vote for during the evaluation phase. More votes indicate higher group preference.",
      "selectIdea": "ID of an idea to mark as selected during the selection phase. Selected ideas move forward to action planning.",
      "action": "Action step to add to a selected idea during the action planning phase. Should be specific and actionable.",
      "ideas": "Collection of generated ideas for the brainstorming session. Grows during the ideation phase and gets refined in later phases.",
      "constraints": "Limitations or requirements to consider during brainstorming. Helps focus ideation on practical solutions that meet specific criteria.",
      "currentStep": "Current step in the brainstorming process. Helps track progress within each phase of the session.",
      "totalSteps": "Total number of steps in the brainstorming process. Provides context for how far along the session has progressed."
   },
   exampleUsage: {
      "topic": "How can we improve the performance of our database queries?",
      "phase": "ideation",
      "sessionId": "perf-improvement-2023-12"
   }
});

/**
 * Описание инструмента Stochastic Algorithm
 */
export const STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Stochastic Algorithm",
   purpose: "A tool for applying stochastic algorithms to decision-making problems.",
   whenToUse: [
      "When decisions must be made under uncertainty",
      "When probabilistic modeling would improve outcomes",
      "When dealing with sequential decision processes",
      "When optimization requires exploring large solution spaces"
   ],
   capabilities: [
      {
         name: "apply_stochastic_algorithm",
         description: "Applies a specific stochastic algorithm to a decision problem",
         keyParameters: ["algorithm", "problem", "parameters"]
      },
      {
         name: "analyze_results",
         description: "Interprets and explains the output of the algorithm",
         keyParameters: ["result"]
      }
   ],
   exampleScenarios: [
      "Using Markov Decision Processes (MDP) for resource allocation",
      "Applying Monte Carlo Tree Search for planning complex workflows",
      "Using Multi-Armed Bandit algorithms for A/B testing",
      "Applying Bayesian optimization for hyperparameter tuning"
   ],
   bestPractices: [
      "Clearly define the state space and actions for MDPs",
      "Allow sufficient simulation time for MCTS to converge",
      "Balance exploration vs. exploitation in Bandit algorithms",
      "Update Bayesian priors with new evidence systematically"
   ],
   integration: {
      withAI: "AI assistants can use this tool to make robust decisions under uncertainty",
      examples: [
         "When optimizing resource allocation: 'I'll apply MDP to find the optimal policy for distributing resources.'",
         "When planning a complex workflow: 'Let me use MCTS to explore the possible execution paths and find the most promising one.'"
      ]
   },
   parameterDescriptions: {
      "algorithm": "The stochastic algorithm to apply. Each algorithm is suited to different types of decision problems.",
      "problem": "The decision problem to solve. Describe the uncertainty, options, and desired outcome.",
      "parameters": "Algorithm-specific parameters for customization. Each algorithm has its own parameter set.",
      "result": "Optional result from algorithm application, typically filled in response."
   },
   exampleUsage: {
      "algorithm": "mcts",
      "problem": "We need to schedule tasks with uncertain durations to minimize overall completion time",
      "parameters": {
         "simulationDepth": 10,
         "explorationConstant": 1.41
      }
   }
});

/**
 * Описание инструмента Feature Discussion
 */
export const FEATURE_DISCUSSION_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Feature Discussion",
   purpose: "A tool for collaborative feature discussion and planning.",
   whenToUse: [
      "When discussing a new feature in a structured way",
      "When gathering requirements for feature development",
      "When evaluating feature proposals with stakeholders",
      "When planning feature implementation details"
   ],
   capabilities: [
      {
         name: "start_discussion",
         description: "Initiates a new feature discussion with a title",
         keyParameters: ["featureId", "response"]
      },
      {
         name: "contribute_to_discussion",
         description: "Adds input to an ongoing feature discussion",
         keyParameters: ["featureId", "response"]
      }
   ],
   exampleScenarios: [
      "Planning a new authentication system feature",
      "Discussing implementation approaches for a critical algorithm",
      "Evaluating user interface improvements for accessibility",
      "Planning performance optimizations for key functionality"
   ],
   bestPractices: [
      "Clearly define the feature scope at the beginning",
      "Consider both technical implementation and user experience",
      "Document assumptions and constraints explicitly",
      "Identify potential risks and mitigation strategies"
   ],
   integration: {
      withAI: "AI assistants can use this tool to facilitate structured discussions about features",
      examples: [
         "When planning a new feature: 'Let's start a feature discussion to clarify the requirements and implementation approach.'",
         "When evaluating options: 'We can use feature discussion to compare different implementation strategies.'"
      ]
   },
   parameterDescriptions: {
      "featureId": "Identifier for the feature being discussed",
      "response": "Your response to the current prompt about the feature"
   },
   exampleUsage: {
      "featureId": "auth-system-redesign",
      "response": "The new authentication system should support both OAuth and traditional logins"
   }
});

/**
 * Описание инструмента Feature Analyzer
 */
export const FEATURE_ANALYZER_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Feature Analyzer",
   purpose: "A tool for analyzing feature requirements and implementation approaches.",
   whenToUse: [
      "When evaluating the feasibility of a proposed feature",
      "When identifying dependencies and requirements for implementation",
      "When breaking down a complex feature into manageable components",
      "When assessing potential impacts on existing systems"
   ],
   capabilities: [
      {
         name: "analyze_feature",
         description: "Provides structured analysis of a feature concept",
         keyParameters: ["featureName", "featureDescription"]
      }
   ],
   exampleScenarios: [
      "Analyzing requirements for a real-time notification system",
      "Breaking down implementation steps for data migration feature",
      "Evaluating security implications of a new API endpoint",
      "Analyzing performance requirements for video processing feature"
   ],
   bestPractices: [
      "Consider technical, UX, security, and performance aspects",
      "Identify dependencies on other systems or components",
      "Assess potential scalability challenges",
      "Outline a phased implementation approach if appropriate"
   ],
   integration: {
      withAI: "AI assistants can use this tool to provide comprehensive feature analysis to development teams",
      examples: [
         "When evaluating a feature request: 'Let me analyze this feature to understand its requirements and implementation complexity.'",
         "When planning development: 'I'll break down this feature into its component parts for easier implementation.'"
      ]
   },
   parameterDescriptions: {
      "featureName": "The name of the feature to analyze",
      "featureDescription": "Detailed description of the feature's purpose, functionality, and requirements"
   },
   exampleUsage: {
      "featureName": "Real-time Collaboration Editor",
      "featureDescription": "A document editing feature that allows multiple users to edit the same document simultaneously with real-time updates"
   }
});

/**
 * Описание инструмента Model Selector
 */
export const MODEL_SELECTOR_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "Model Selector",
   purpose: "A tool for recommending optimal programming patterns, architectures, and algorithms for specific development tasks.",
   whenToUse: [
      "When selecting architectural patterns for a new project or component",
      "When choosing data structures or algorithms for specific operations",
      "When refactoring code and considering design patterns",
      "When facing performance or scalability challenges requiring structural solutions"
   ],
   capabilities: [
      {
         name: "select_model",
         description: "Recommends the most appropriate design pattern, architecture, or algorithm for a specific task",
         keyParameters: ["task", "language", "projectScale"]
      },
      {
         name: "list_models",
         description: "Provides a list of relevant models that could apply to a specific development context",
         keyParameters: ["context", "constraints", "preferences"]
      }
   ],
   exampleScenarios: [
      "Selecting between microservices vs. monolith for a new web application",
      "Choosing between inheritance and composition for a class hierarchy",
      "Determining the optimal data structure for high-frequency lookups with occasional inserts",
      "Selecting an architectural pattern for a real-time data processing system"
   ],
   bestPractices: [
      "Consider trade-offs between complexity, performance, and maintainability",
      "Align recommendations with project scale and team expertise",
      "Account for language-specific idioms and best practices",
      "Explain rationale behind recommendations to aid understanding"
   ],
   integration: {
      withAI: "AI assistants can use this tool to guide software design decisions with principled recommendations",
      examples: [
         "When starting a new project: 'Let me recommend an architectural pattern that would best suit your requirements.'",
         "When facing a design challenge: 'I'll help you select the most appropriate data structure for this use case.'"
      ]
   },
   parameterDescriptions: {
      "task": "The specific programming task or problem that requires a model/approach recommendation",
      "language": "Programming language being used (to provide language-specific recommendations)",
      "projectScale": "Size of the project (Small, Medium, Large, Enterprise) to influence architectural recommendations",
      "context": "Additional context about the project, environment, or requirements",
      "constraints": "Any limitations or requirements that might affect the choice of model/approach",
      "preferences": "Desired qualities or characteristics that the selected model/approach should have"
   },
   exampleUsage: {
      "task": "We need to implement a cache for database query results",
      "language": "TypeScript",
      "projectScale": "Medium"
   }
});

/**
 * Описание инструмента First Thought Advisor
 */
export const FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION: ToolDescription = createToolDescription({
   name: "First Thought Advisor",
   purpose: "A tool that intelligently recommends the optimal mental model or algorithm for any problem.",
   whenToUse: [
      "When beginning to approach a complex problem",
      "When unsure which mental model or algorithm would be most effective",
      "When wanting to explore different problem-solving perspectives",
      "When teaching problem-solving approaches to others"
   ],
   capabilities: [
      {
         name: "get_thinking_approach",
         description: "Recommends a thinking approach, algorithm, or mental model suited for a specific problem",
         keyParameters: ["problem", "goal", "domain", "complexity", "constraints", "previousApproaches"]
      }
   ],
   exampleScenarios: [
      "Finding the right approach to optimize a slow-performing algorithm",
      "Determining how to break down a complex system architecture problem",
      "Selecting an appropriate mental model for a decision under uncertainty",
      "Recommending a search strategy for an NP-hard computational problem"
   ],
   bestPractices: [
      "Consider the problem's domain when recommending approaches",
      "Account for complexity and constraints in recommendations",
      "Suggest multiple approaches when appropriate, with reasoning",
      "Build upon previous approaches that partially worked"
   ],
   integration: {
      withAI: "AI assistants can use this tool as a meta-level advisor for their own reasoning process",
      examples: [
         "When approaching a complex problem: 'Let me first determine the best thinking approach for this type of challenge.'",
         "When teaching problem-solving: 'I'll show you how to select the right mental model for different types of problems.'"
      ]
   },
   parameterDescriptions: {
      "problem": "The problem to analyze. Provide a clear, concise description of the challenge or task that needs a solution.",
      "goal": "The desired outcome or objective. What would a successful solution achieve?",
      "domain": "The field or context of the problem (e.g., software development, data analysis, etc.)",
      "complexity": "The estimated complexity level of the problem (e.g., simple, moderate, complex, very complex)",
      "constraints": "Any limitations or requirements that restrict possible solutions",
      "previousApproaches": "Methods that have already been tried, whether successful or not"
   },
   exampleUsage: {
      "problem": "Need to find the shortest path between nodes in a sparse graph with millions of nodes",
      "domain": "Algorithm design",
      "complexity": "High",
      "constraints": ["Memory limitations", "Must complete in near real-time"]
   }
});

export const toolDescriptions = {
   firstThoughtAdvisor: FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION,
   mentalModel: MENTAL_MODEL_TOOL_DESCRIPTION,
   sequentialThinking: SEQUENTIAL_THINKING_TOOL_DESCRIPTION,
   debuggingApproach: DEBUGGING_APPROACH_TOOL_DESCRIPTION,
   brainstorming: BRAINSTORMING_TOOL_DESCRIPTION,
   stochasticAlgorithm: STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION,
   featureDiscussion: FEATURE_DISCUSSION_TOOL_DESCRIPTION,
   featureAnalyzer: FEATURE_ANALYZER_TOOL_DESCRIPTION,
   modelSelector: MODEL_SELECTOR_TOOL_DESCRIPTION
}; 