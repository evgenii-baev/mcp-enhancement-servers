/**
 * Простой скрипт для проверки описаний инструментов
 */

// Описания инструментов для проверки
const toolDescriptions = {
    firstThoughtAdvisor: {
        name: "First Thought Advisor",
        purpose: "A tool that intelligently recommends the optimal mental model or algorithm for any problem.",
        capabilities: [
            {
                name: "get_thinking_approach",
                description: "Recommends a thinking approach, algorithm, or mental model suited for a specific problem",
                keyParameters: ["problem", "goal", "domain", "complexity", "constraints", "previousApproaches"]
            }
        ],
        parameterDescriptions: {
            "problem": "The problem to analyze. Provide a clear, concise description of the challenge or task that needs a solution.",
            "goal": "The desired outcome or objective. What would a successful solution achieve?",
            "domain": "The field or context of the problem (e.g., software development, data analysis, etc.)",
            "complexity": "The estimated complexity level of the problem (e.g., simple, moderate, complex, very complex)",
            "constraints": "Any limitations or requirements that restrict possible solutions",
            "previousApproaches": "Methods that have already been tried, whether successful or not"
        }
    },
    mentalModel: {
        name: "Mental Model",
        purpose: "A tool for applying structured mental models to problem-solving.",
        capabilities: [
            {
                name: "apply_mental_model",
                description: "Applies a specific mental model to analyze a problem",
                keyParameters: ["modelName", "problem"]
            }
        ],
        parameterDescriptions: {
            "modelName": "The mental model to apply. For programming problems, consider using the specialized programming models: composition_vs_inheritance, single_responsibility, interface_segregation, actor_model, or time_space_complexity.",
            "problem": "The problem to analyze using the selected mental model. For programming models, provide specific code design or architectural challenges."
        }
    },
    sequentialThinking: {
        name: "Sequential Thinking",
        purpose: "A tool for dynamic and reflective problem-solving through sequential thoughts.",
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
        }
    },
    debuggingApproach: {
        name: "Debugging Approach",
        purpose: "A tool for applying systematic debugging approaches to technical issues.",
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
        parameterDescriptions: {
            "approachName": "The debugging methodology to apply (binary_search, reverse_engineering, divide_conquer, backtracking, cause_elimination, program_slicing)",
            "issue": "Description of the problem to be debugged",
            "findings": "Observations and patterns discovered during the debugging process",
            "steps": "Specific actions taken or recommended to isolate and resolve the issue",
            "resolution": "The solution that fixed the problem, including explanation of root cause"
        }
    },
    brainstorming: {
        name: "Brainstorming",
        purpose: "A tool for facilitating structured brainstorming sessions.",
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
        }
    },
    stochasticAlgorithm: {
        name: "Stochastic Algorithm",
        purpose: "A tool for applying stochastic algorithms to decision-making problems.",
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
        parameterDescriptions: {
            "algorithm": "The stochastic algorithm to apply. Each algorithm is suited to different types of decision problems.",
            "problem": "The decision problem to solve. Describe the uncertainty, options, and desired outcome.",
            "parameters": "Algorithm-specific parameters for customization. Each algorithm has its own parameter set.",
            "result": "Optional result from algorithm application, typically filled in response."
        }
    },
    featureDiscussion: {
        name: "Feature Discussion",
        purpose: "A tool for collaborative feature discussion and planning.",
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
        parameterDescriptions: {
            "featureId": "Identifier for the feature being discussed",
            "response": "Your response to the current prompt about the feature"
        }
    },
    featureAnalyzer: {
        name: "Feature Analyzer",
        purpose: "A tool for analyzing feature requirements and implementation approaches.",
        capabilities: [
            {
                name: "analyze_feature",
                description: "Provides structured analysis of a feature concept",
                keyParameters: ["featureName", "featureDescription"]
            }
        ],
        parameterDescriptions: {
            "featureName": "The name of the feature to analyze",
            "featureDescription": "Detailed description of the feature's purpose, functionality, and requirements"
        }
    },
    modelSelector: {
        name: "Model Selector",
        purpose: "A tool for recommending optimal programming patterns, architectures, and algorithms for specific development tasks.",
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
        parameterDescriptions: {
            "task": "The specific programming task or problem that requires a model/approach recommendation",
            "language": "Programming language being used (to provide language-specific recommendations)",
            "projectScale": "Size of the project (Small, Medium, Large, Enterprise) to influence architectural recommendations",
            "context": "Additional context about the project, environment, or requirements",
            "constraints": "Any limitations or requirements that might affect the choice of model/approach",
            "preferences": "Desired qualities or characteristics that the selected model/approach should have"
        }
    }
};

// Функция для проверки наличия описаний параметров
function validateParameterDescriptions(toolName, description) {
    const missingDescriptions = [];

    if (!description.parameterDescriptions) {
        return [`${toolName} has no parameterDescriptions`];
    }

    const parameterDescriptions = description.parameterDescriptions;
    const capabilities = description.capabilities || [];

    for (const capability of capabilities) {
        const keyParameters = capability.keyParameters || [];

        for (const param of keyParameters) {
            if (!parameterDescriptions[param]) {
                missingDescriptions.push(`${toolName}/${capability.name}: missing description for parameter ${param}`);
            }
        }
    }

    return missingDescriptions;
}

// Проверка всех инструментов
console.log('Checking tool parameter descriptions...');
console.log('--------------------------------------');

let totalTools = 0;
let validTools = 0;
const allMissingDescriptions = [];

for (const [toolName, description] of Object.entries(toolDescriptions)) {
    totalTools++;

    const missingDescriptions = validateParameterDescriptions(toolName, description);

    if (missingDescriptions.length === 0) {
        validTools++;
        console.log(`✅ ${toolName}: All parameters have descriptions`);
    } else {
        console.log(`❌ ${toolName}: Missing parameter descriptions`);
        for (const missing of missingDescriptions) {
            console.log(`   - ${missing}`);
            allMissingDescriptions.push(missing);
        }
    }
}

console.log('--------------------------------------');
console.log(`Summary: ${validTools}/${totalTools} tools have complete parameter descriptions`);

if (allMissingDescriptions.length > 0) {
    console.log('\nMissing descriptions:');
    for (const missing of allMissingDescriptions) {
        console.log(` - ${missing}`);
    }
    process.exit(1);
} else {
    console.log('\nAll tools have complete parameter descriptions! 🎉');
    process.exit(0);
} 