/**
 * Enum for brainstorming phases
 */
export enum BrainstormingPhase {
    /** Preparation phase (defining topic, participants, constraints) */
    PREPARATION = "preparation",
    /** Ideation phase (generating ideas) */
    IDEATION = "ideation",
    /** Clarification phase (explaining and refining ideas) */
    CLARIFICATION = "clarification",
    /** Evaluation phase (assessing ideas) */
    EVALUATION = "evaluation",
    /** Selection phase (choosing the best ideas) */
    SELECTION = "selection",
    /** Action planning phase (planning implementation) */
    ACTION_PLANNING = "action_planning",
}

/**
 * Interface for a single brainstorming idea
 */
export interface BrainstormingIdea {
    /** Unique identifier for the idea */
    id: string
    /** Content of the idea */
    content: string
    /** Optional category for the idea */
    category?: string
    /** Optional vote count */
    votes?: number
    /** Optional list of ideas this one builds upon */
    buildUpon?: string[]
    /** Creation timestamp */
    createdAt: number
}

/**
 * Interface for brainstorming session data
 */
export interface BrainstormingData {
    /** Topic for brainstorming */
    topic: string
    /** Current phase of brainstorming */
    phase: BrainstormingPhase
    /** List of ideas */
    ideas: BrainstormingIdea[]
    /** Optional constraints */
    constraints?: string[]
    /** Optional participants */
    participants?: string[]
    /** Optional time limit in minutes */
    timeLimit?: number
    /** Optional recommended mental models */
    recommendedModels?: string[]
    /** Optional current step in the process */
    currentStep?: number
    /** Optional total steps in the process */
    totalSteps?: number
} 