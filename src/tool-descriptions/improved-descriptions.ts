// Enhanced tool descriptions for AI assistants
// This file contains improved descriptions for MCP tools to help AI assistants better understand their purpose and usage

export const MENTAL_MODEL_TOOL_DESCRIPTION = `A comprehensive tool for applying structured mental models to problem-solving.

WHAT IT DOES:
This tool applies systematic mental models to analyze problems from different perspectives,
helping to break down complex issues into manageable components and revealing insights
that might otherwise be missed.

WHEN TO USE:
- When facing complex or ambiguous problems
- When standard approaches aren't yielding results
- When you need a fresh perspective on a problem
- When you want to ensure thorough analysis of all aspects
- When you need to overcome cognitive biases
- When communicating complex reasoning to others

AVAILABLE MODELS:
- First Principles: Breaking down complex problems into basic elements and reassembling them
- Opportunity Cost: Evaluating what you give up when making a choice
- Error Propagation: Analyzing how errors spread and magnify through systems
- Rubber Duck: Explaining problems step-by-step to identify flaws in understanding
- Pareto Principle: Focusing on the vital few causes that produce the majority of effects
- Occam's Razor: Preferring simpler explanations unless complexity is justified
- And many more, including specialized programming models

HOW TO USE:
1. Select the most appropriate mental model for your problem
2. Clearly define your problem statement
3. The tool will apply the model's framework to your problem
4. Review the structured analysis and insights
5. Apply the conclusions to your original problem

EXAMPLE:
Input: { "modelName": "first_principles", "problem": "Our application is too slow" }
Output: A breakdown of the performance issue into fundamental components, questioning
assumptions about what causes slowness, and building a solution from basic truths.

PROGRAMMING-SPECIFIC MODELS:
- composition_vs_inheritance: Analyze when to use object composition vs inheritance
- single_responsibility: Apply SRP to improve code modularity and maintainability
- interface_segregation: Evaluate separation of interfaces for better abstraction
- actor_model: Design concurrent systems using the actor model
- time_space_complexity: Analyze algorithm efficiency in terms of time and space

INTERPRETING RESULTS:
The response includes the model name, problem statement, structured analysis steps,
and conclusions. Use these insights to guide your approach to the original problem.`;

export const DEBUGGING_APPROACH_TOOL_DESCRIPTION = `A powerful tool for applying systematic debugging approaches to solve technical issues.

WHAT IT DOES:
This tool provides structured methodologies for identifying, isolating, and resolving
technical problems by applying proven debugging strategies tailored to different types of issues.

WHEN TO USE:
- When facing complex technical problems
- When standard debugging isn't yielding results
- When you need a systematic approach to troubleshooting
- When you want to document your debugging process
- When teaching others about structured problem-solving

AVAILABLE APPROACHES:

1. Binary Search:
   A divide-and-conquer approach that systematically narrows down the problem space
   by testing the midpoint and eliminating half the remaining possibilities each time.
   Best for: Linear problems with clear test criteria (e.g., finding which commit introduced a bug).

2. Reverse Engineering:
   Working backward from observed behavior to understand underlying mechanisms.
   Best for: Understanding undocumented systems or unexpected behaviors.

3. Divide and Conquer:
   Breaking a complex problem into smaller, more manageable sub-problems.
   Best for: Large, complex systems with multiple potential failure points.

4. Backtracking:
   Exploring multiple solution paths and backing out when a path proves unsuccessful.
   Best for: Problems with multiple possible solutions where some paths may be dead ends.

5. Cause Elimination:
   Systematically identifying and ruling out potential causes until the actual cause is found.
   Best for: Issues with multiple potential causes that can be individually tested.

6. Program Slicing:
   Isolating the specific parts of code that could affect a particular variable or behavior.
   Best for: Understanding data flow and dependencies in complex codebases.

HOW TO USE:
1. Select the most appropriate debugging approach for your issue
2. Clearly define the problem you're experiencing
3. Follow the structured steps provided by the approach
4. Document your findings at each step
5. Apply the resolution based on your analysis

EXAMPLE:
Input: { "approachName": "binary_search", "issue": "Performance regression in recent release" }
Output: A structured approach to identify which change caused the regression by testing
midpoints in your commit history until the problematic change is isolated.`;

export const SEQUENTIAL_THINKING_TOOL_DESCRIPTION = `A sophisticated tool for dynamic and reflective problem-solving through sequential thoughts.

WHAT IT DOES:
This tool facilitates a flexible thinking process that mimics human cognition by allowing
thoughts to build upon, question, or revise previous insights as understanding deepens.
It enables non-linear exploration of problem spaces with the ability to branch, revise,
and extend thinking paths as needed.

WHEN TO USE:
- Breaking down complex problems into manageable steps
- Planning and design processes that require flexibility for revision
- Analysis that might need course correction as new information emerges
- Problems where the full scope might not be clear initially
- Problems that require a multi-step solution with dependencies between steps
- Tasks that need to maintain context over multiple reasoning steps
- Situations where irrelevant information needs to be filtered out
- When you need to document your reasoning process for others

KEY FEATURES:
- Dynamic adjustment of thought quantity as understanding evolves
- Ability to question or revise previous thoughts when new insights emerge
- Flexible extension of thinking even after reaching what seemed like the end
- Expression of uncertainty and exploration of alternative approaches
- Non-linear thinking with branching and backtracking capabilities
- Hypothesis generation and verification through structured reasoning
- Progressive refinement of solutions through iterative thinking

HOW TO USE:
1. Start with an initial problem statement and estimate of needed thoughts
2. Develop each thought sequentially, building on previous insights
3. When appropriate, revise previous thoughts or branch into new directions
4. Continue until you reach a satisfactory conclusion
5. Provide a final thought that synthesizes your reasoning and solution

PARAMETERS EXPLAINED:
- thought: Your current thinking step
- nextThoughtNeeded: True if you need more thinking
- thoughtNumber: Current number in sequence
- totalThoughts: Current estimate of thoughts needed
- isRevision: Indicates if this thought revises previous thinking
- revisesThought: Which thought number is being reconsidered
- branchFromThought: Which thought number is the branching point
- branchId: Identifier for the current branch
- needsMoreThoughts: If reaching end but realizing more thoughts needed`;

export const BRAINSTORMING_TOOL_DESCRIPTION = `A comprehensive tool for facilitating structured brainstorming sessions.

WHAT IT DOES:
This tool guides you through a systematic brainstorming process, from preparation to action planning.
It helps generate, refine, evaluate, and select ideas in a structured way, while leveraging
appropriate mental models to enhance creativity and effectiveness.

WHEN TO USE:
- When you need to generate creative solutions to complex problems
- When you want to explore multiple approaches to a challenge
- When you need to involve multiple perspectives in idea generation
- When you want to systematically evaluate and select the best ideas
- When you need to break out of conventional thinking patterns
- When planning new features, products, or strategies
- When trying to overcome obstacles or bottlenecks

KEY FEATURES:
- Structured six-phase brainstorming process
- Integration with mental models to enhance creativity
- Support for collaborative ideation
- Idea categorization and evaluation
- Persistent sessions for ongoing brainstorming
- Guidance tailored to each phase of the process

HOW TO USE:
1. Start by creating a new session with a clear topic
2. Follow the guided process through each phase:
   - Preparation: Define constraints and participants
   - Ideation: Generate as many ideas as possible
   - Clarification: Refine and categorize ideas
   - Evaluation: Assess ideas objectively
   - Selection: Choose the best ideas to pursue
   - Action Planning: Define next steps for implementation
3. Use recommended mental models to enhance your thinking
4. Add, categorize, and vote on ideas as you progress

PARAMETERS EXPLAINED:
- topic: The main subject or problem for brainstorming
- phase: Current phase of the brainstorming process
- ideas: Collection of generated ideas
- constraints: Limitations or requirements to consider
- participants: People involved in the brainstorming
- timeLimit: Optional time constraint for the session
- recommendedModels: Mental models that can help with this topic
- sessionId: Identifier for ongoing sessions`;

export const MODEL_SELECTOR_TOOL_DESCRIPTION = `A specialized tool for selecting the optimal architecture, design pattern, algorithm, or data structure for programming tasks.

WHAT IT DOES:
This tool analyzes your programming task and requirements to recommend the most appropriate models,
patterns, algorithms, or architectures based on your specific context, constraints, and preferences.
It provides tailored recommendations with explanations of why each approach is suitable for your case.

WHEN TO USE:
- At the beginning of project design, when choosing an application architecture
- When solving a specific problem that requires an appropriate design pattern
- When selecting the most efficient algorithm for data processing
- When choosing the optimal data structure for storing and accessing information
- For comparing different approaches to solving the same task
- When refactoring existing code and need guidance on better structures

CATEGORIES OF MODELS:
This tool can recommend models from different categories:
- **Architecture Models**: Microservices, Monolithic, Serverless, MVC, MVVM, Clean Architecture
- **Design Patterns**: Factory, Singleton, Observer, Strategy, Decorator, etc.
- **Algorithms**: Sorting (QuickSort, MergeSort), Searching (Binary Search, DFS/BFS), Graph algorithms
- **Data Structures**: Arrays, LinkedLists, Trees, Graphs, HashMaps, Queues, Stacks
- **Programming Paradigms**: OOP, Functional, Reactive, Event-driven
- **Concurrency Models**: Threads, Actors, CSP, STM

EXAMPLE SCENARIOS:
- Developing a scalable web application with high traffic
- Implementing dynamic object creation based on configuration
- Efficient sorting and searching in large datasets
- Designing a cache with fast lookups and automatic expiration
- Creating a system that needs to handle multiple types of notifications
- Implementing a plugin architecture for extensibility

PARAMETERS EXPLAINED:
- task: The specific programming task or problem requiring a recommendation
- context: Additional context about the project, environment, or requirements
- constraints: Any limitations that might affect the choice of approach
- preferences: Desired qualities or characteristics for the solution
- language: Programming language being used (for language-specific recommendations)
- projectScale: Size of the project to influence architectural recommendations

HOW TO USE:
1. Clearly define your programming task or problem
2. Provide relevant context about your project or environment
3. Specify any constraints that might limit your options
4. Indicate your preferences for the solution (e.g., performance, simplicity)
5. The tool will analyze your inputs and recommend appropriate models
6. Review the recommendations and their rationales to make an informed decision`;

export const FIRST_THOUGHT_ADVISOR_TOOL_DESCRIPTION = `A sophisticated decision-making tool that analyzes problem characteristics and intelligently recommends the optimal mental model, algorithm, or thinking approach best suited to tackle your specific challenge. This tool leverages pattern recognition across domains to identify the most effective cognitive frameworks for your unique situation.

WHAT IT DOES:
This tool analyzes your problem statement, goals, domain context, complexity level, constraints, 
and previous approaches to recommend the most effective thinking framework or approach for 
your specific situation. It helps you select the right mental model before diving into 
detailed problem-solving.

WHEN TO USE:
- At the beginning of approaching a new problem
- When you're unsure which mental model or algorithm would be most appropriate
- When facing an unfamiliar type of problem
- When you have multiple possible approaches and need guidance on where to start
- When you want to ensure you're using the most efficient approach for your problem type

KEY FEATURES:
- Intelligent matching of problem characteristics to appropriate mental models
- Consideration of domain-specific approaches based on problem context
- Analysis of problem complexity to recommend proportionate solutions
- Adaptation to constraints that might limit certain approaches
- Learning from previously attempted approaches to avoid repeating ineffective strategies

PARAMETERS EXPLAINED:
- problem: The specific problem or challenge that requires analysis. Be detailed and precise to receive the most relevant mental model recommendation.
- goal: The specific outcome or objective you're trying to achieve. A clear goal statement helps focus recommendations on solutions that directly address your desired end result.
- domain: The field or context in which the problem exists (e.g., 'software engineering', 'machine learning', 'business strategy'). This helps tailor recommendations to domain-specific approaches.
- complexity: Assessment of problem difficulty on a scale from 'low' to 'high'. This helps calibrate the sophistication level of the recommended mental models.
- constraints: Any limitations, boundaries, or requirements that affect potential solutions. Each constraint should be expressed as a separate array element.
- previousApproaches: Methods or strategies already attempted, allowing the advisor to suggest novel alternatives. Each approach should be listed as a separate array element.

EXAMPLE USAGE:
```json
{
   "problem": "Design a scalable notification system for a social media platform",
      "domain": "software architecture",
         "complexity": "high",
            "goal": "Handle 10M+ daily notifications with < 100ms latency",
               "constraints": ["Cloud-based solution", "Limited budget", "Must integrate with legacy systems"],
                  "previousApproaches": ["Monolithic event processor", "Simple queue system"]
}
```

INTERPRETING RESULTS:
The response includes recommended mental models or approaches, confidence levels, rationales
for each recommendation, and potential next steps. Use these insights to guide your approach
to the original problem and apply the most suitable thinking framework.`;

export const FEATURE_DISCUSSION_TOOL_DESCRIPTION = `A structured tool for facilitating feature discussions and gathering requirements.

WHAT IT DOES:
This tool provides a systematic framework for discussing new features, capturing requirements,
and ensuring all stakeholders have input into the feature development process.

WHEN TO USE:
- When planning new product features
- When gathering requirements from stakeholders
- When evaluating feature proposals
- When iterating on feature designs based on feedback
- When documenting feature specifications

KEY FEATURES:
- Structured prompts to guide feature discussions
- Collaborative input capturing from multiple stakeholders
- Organized documentation of feature requirements
- Progressive refinement of feature specifications
- Integration with existing feature tracking

PARAMETERS EXPLAINED:
- featureId: Identifier for the feature being discussed
- response: Your response to the current prompt in the discussion flow

HOW TO USE:
1. Begin a feature discussion with a clear title
2. Follow the prompted discussion flow, providing detailed responses
3. The tool will maintain context throughout the discussion
4. Add implementation details and requirements as they emerge
5. Use the final output as specification for development`;

export const FEATURE_ANALYZER_TOOL_DESCRIPTION = `A analytical tool for evaluating feature complexity, dependencies, and implementation challenges.

WHAT IT DOES:
This tool analyzes proposed features to estimate complexity, identify dependencies,
flag potential implementation challenges, and provide insights for planning and prioritization.

WHEN TO USE:
- When estimating effort for feature implementation
- When prioritizing features for a roadmap
- When identifying potential risks in feature development
- When planning resource allocation for features
- When breaking down features into implementable components

KEY FEATURES:
- Complexity analysis based on feature description
- Identification of system dependencies
- Risk assessment for implementation challenges
- Component breakdown suggestions
- Integration complexity evaluation

PARAMETERS EXPLAINED:
- featureName: Name of the feature to analyze
- featureDescription: Detailed description of the feature functionality

HOW TO USE:
1. Provide a clear name for the feature
2. Include a detailed description of the feature's functionality
3. The tool will analyze the feature and provide insights
4. Use the analysis for planning, estimation, and risk assessment
5. Consider the identified dependencies when scheduling implementation`;

export const STOCHASTIC_ALGORITHM_TOOL_DESCRIPTION = `A specialized tool for applying stochastic algorithms to optimization and decision-making problems.

WHAT IT DOES:
This tool implements various stochastic algorithms to solve problems involving uncertainty,
optimization under constraints, sequential decision-making, or probabilistic inference.

WHEN TO USE:
- When dealing with problems that have uncertainty or randomness
- When traditional deterministic approaches are inefficient or infeasible
- When optimizing complex systems with many variables
- When modeling sequential decision processes
- When performing probabilistic inference

AVAILABLE ALGORITHMS:
1. Markov Decision Processes (MDP):
   For sequential decision-making problems with fully observable states.
   Best for: Resource allocation, scheduling, and control problems.

2. Monte Carlo Tree Search (MCTS):
   For planning in large decision spaces by random sampling.
   Best for: Games, planning with incomplete information, complex optimization.

3. Multi-armed Bandit Algorithms:
   For balancing exploration vs. exploitation in decision-making.
   Best for: A/B testing, online advertising, recommendation systems.

4. Bayesian Optimization:
   For efficient optimization of expensive-to-evaluate objective functions.
   Best for: Hyperparameter tuning, experimental design, model calibration.

5. Hidden Markov Models (HMM):
   For inferring hidden states from observable outputs in sequential data.
   Best for: Speech recognition, time series analysis, biological sequence analysis.

PARAMETERS EXPLAINED:
- algorithm: The specific stochastic algorithm to apply
- problem: Description of the problem to solve
- parameters: Algorithm-specific parameters (varies by algorithm)
- result: Optional field for providing expected or desired results

HOW TO USE:
1. Select the appropriate algorithm for your problem type
2. Clearly define your problem statement
3. Provide algorithm-specific parameters as needed
4. The tool will apply the algorithm and return results
5. Interpret the results in the context of your original problem`; 