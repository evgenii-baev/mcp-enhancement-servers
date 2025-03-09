/**
 * Централизованное хранилище описаний параметров для инструментов
 * Используется как в серверах, так и в описаниях инструментов
 */

// Описания параметров для инструмента First Thought Advisor
export const FIRST_THOUGHT_ADVISOR_PARAM_DESCRIPTIONS = {
    problem: 'The problem to analyze. Provide a clear, concise description of the challenge or task that needs a solution.',
    goal: 'The desired outcome or objective. What would a successful solution achieve?',
    domain: 'The field or context of the problem (e.g., software development, data analysis, etc.)',
    complexity: 'The estimated complexity level of the problem (e.g., simple, moderate, complex, very complex)',
    constraints: 'Any limitations or requirements that restrict possible solutions',
    previousApproaches: 'Methods that have already been tried, whether successful or not'
};

// Описания параметров для инструмента Mental Model
export const MENTAL_MODEL_PARAM_DESCRIPTIONS = {
    modelName: 'The mental model to apply. For programming problems, consider using the specialized programming models: composition_vs_inheritance, single_responsibility, interface_segregation, actor_model, or time_space_complexity.',
    problem: 'The problem to analyze using the selected mental model. For programming models, provide specific code design or architectural challenges.'
};

// Описания параметров для инструмента Sequential Thinking
export const SEQUENTIAL_THINKING_PARAM_DESCRIPTIONS = {
    thought: 'The current thought or reasoning step',
    thoughtNumber: 'The sequential number of the current thought (starting from 1)',
    totalThoughts: 'The estimated total number of thoughts needed',
    nextThoughtNeeded: 'Whether additional thoughts are needed to complete the reasoning',
    branchFromThought: 'Number of the thought from which to create an alternative reasoning path',
    branchId: 'Identifier for the current reasoning branch',
    revisesThought: 'Number of the thought being revised with new information',
    isRevision: 'Whether this thought is a revision of a previous thought',
    needsMoreThoughts: 'Indicates if additional thoughts would be helpful beyond the initial estimate'
};

// Описания параметров для инструмента Debugging Approach
export const DEBUGGING_APPROACH_PARAM_DESCRIPTIONS = {
    approachName: 'The debugging methodology to apply (binary_search, reverse_engineering, divide_conquer, backtracking, cause_elimination, program_slicing)',
    issue: 'Description of the problem to be debugged',
    findings: 'Observations and patterns discovered during the debugging process',
    steps: 'Specific actions taken or recommended to isolate and resolve the issue',
    resolution: 'The solution that fixed the problem, including explanation of root cause'
};

// Описания параметров для инструмента Brainstorming
export const BRAINSTORMING_PARAM_DESCRIPTIONS = {
    topic: 'The main subject or problem for brainstorming. Be specific enough to focus ideation but broad enough to allow creative solutions. Required when creating a new session.',
    sessionId: 'Identifier for an existing brainstorming session. Use this to continue a previously started session, allowing for persistent brainstorming across multiple interactions.',
    phase: 'Current phase of the brainstorming process. Progress through phases in sequence: preparation → ideation → clarification → evaluation → selection → action_planning.',
    participants: 'People involved in the brainstorming session. Tracking participants helps ensure diverse perspectives and assign responsibilities.',
    newIdea: 'A new idea to add to the session during the ideation phase. Should be clear, concise, and relevant to the brainstorming topic.',
    category: 'Category name for grouping related ideas during the clarification phase. Helps organize ideas by theme or type.',
    ideaId: 'Identifier for a specific idea, used when categorizing, voting for, selecting, or adding actions to an idea.',
    voteForIdea: 'ID of an idea to vote for during the evaluation phase. More votes indicate higher group preference.',
    selectIdea: 'ID of an idea to mark as selected during the selection phase. Selected ideas move forward to action planning.',
    action: 'Action step to add to a selected idea during the action planning phase. Should be specific and actionable.',
    ideas: 'Collection of generated ideas for the brainstorming session. Grows during the ideation phase and gets refined in later phases.',
    constraints: 'Limitations or requirements to consider during brainstorming. Helps focus ideation on practical solutions that meet specific criteria.',
    currentStep: 'Current step in the brainstorming process. Helps track progress within each phase of the session.',
    totalSteps: 'Total number of steps in the brainstorming process. Provides context for how far along the session has progressed.'
};

// Описания параметров для инструмента Stochastic Algorithm
export const STOCHASTIC_ALGORITHM_PARAM_DESCRIPTIONS = {
    algorithm: 'The stochastic algorithm to apply. Each algorithm is suited to different types of decision problems.',
    problem: 'The decision problem to solve. Describe the uncertainty, options, and desired outcome.',
    parameters: 'Algorithm-specific parameters for customization. Each algorithm has its own parameter set.',
    result: 'Optional result from algorithm application, typically filled in response.'
};

// Описания параметров для инструмента Feature Discussion
export const FEATURE_DISCUSSION_PARAM_DESCRIPTIONS = {
    featureId: 'Identifier for the feature being discussed',
    response: 'Your response to the current prompt about the feature'
};

// Описания параметров для инструмента Feature Analyzer
export const FEATURE_ANALYZER_PARAM_DESCRIPTIONS = {
    featureName: 'The name of the feature to analyze',
    featureDescription: 'Detailed description of the feature\'s purpose, functionality, and requirements'
};

// Описания параметров для инструмента Model Selector
export const MODEL_SELECTOR_PARAM_DESCRIPTIONS = {
    task: 'The specific programming task or problem that requires a model/approach recommendation',
    context: 'Additional context about the project, environment, or requirements',
    language: 'Programming language being used (to provide language-specific recommendations)',
    framework: 'Framework or platform being used (to ensure compatibility with recommendations)',
    constraints: 'Any limitations or requirements that might affect the choice of model/approach',
    preferences: 'Desired qualities or characteristics that the selected model/approach should have',
    requiredFeatures: 'Specific features or capabilities that must be supported by the recommended model',
    optimizationGoals: 'Aspects of the solution that should be optimized (e.g., performance, memory usage, maintainability)',
    teamExperience: 'Level of experience the team has with different technologies and approaches',
    projectScale: 'Size of the project (Small, Medium, Large, Enterprise) to influence architectural recommendations',
    timeConstraints: 'Time available for implementation, which may affect complexity of recommended solutions',
    category: 'Category of models to list (e.g., Architecture, Design Pattern, Algorithm, Data Structure). If omitted, all models are returned.',
    modelNames: 'Array of model names to compare (e.g., ["Microservices", "Monolithic", "Serverless"])',
    criteria: 'Specific aspects to compare (e.g., ["scalability", "complexity", "maintainability"]). If omitted, all relevant aspects are compared.'
}; 