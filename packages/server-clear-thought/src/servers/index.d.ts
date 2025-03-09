import { FormattedOutput } from '../interfaces/server-interfaces';

export class BrainstormingServer {
    processBrainstorming(input: unknown): FormattedOutput;
}

export class FirstThoughtAdvisorServer {
    processAdvice(input: unknown): FormattedOutput;
}

export class FeatureDiscussionServer {
    processDiscussion(input: unknown): FormattedOutput;
}

export class FeatureAnalyzerServer {
    processAnalysis(input: unknown): FormattedOutput;
}

export class StochasticAlgorithmServer {
    processAlgorithm(input: unknown): FormattedOutput;
} 