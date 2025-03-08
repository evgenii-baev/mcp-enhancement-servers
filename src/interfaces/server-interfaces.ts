// Data Interfaces
export interface ThoughtData {
    thought: string;
    thoughtNumber: number;
    totalThoughts: number;
    isRevision?: boolean;
    revisesThought?: number;
    branchFromThought?: number;
    branchId?: string;
    needsMoreThoughts?: boolean;
    nextThoughtNeeded: boolean;
}

export interface MentalModelData {
    modelName: string;
    problem: string;
    steps?: string[];
    reasoning?: string;
    conclusion?: string;
}

export interface DebuggingApproachData {
    approachName: string;
    issue: string;
    steps?: string[];
    findings?: string;
    resolution?: string;
}

export interface BrainstormingData {
    phase: 'preparation' | 'ideation' | 'clarification' | 'evaluation' | 'selection' | 'action_planning';
    sessionId?: string;
    topic?: string;
}

export interface StochasticAlgorithmData {
    algorithm: string;
    problem: string;
    parameters: Record<string, any>;
    result?: string;
}

export interface FirstThoughtAdvisorData {
    problem: string;
    goal?: string;
    domain?: string;
    complexity?: string;
    constraints?: string[];
    previousApproaches?: string[];
}

export interface FeatureDiscussionData {
    featureId: string;
    response: string;
}

export interface FeatureAnalyzerData {
    featureName: string;
    featureDescription?: string;
    requirements?: string[];
}

export interface ModelSelectorData {
    task: string;
    context?: string;
    constraints?: string[];
    preferences?: string[];
} 