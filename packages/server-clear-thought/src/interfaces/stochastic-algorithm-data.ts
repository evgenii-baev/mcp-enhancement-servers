/**
 * Interface for stochastic algorithm data
 */
export interface StochasticData {
    /** The algorithm to use */
    algorithm: string;
    /** The problem to solve */
    problem: string;
    /** Algorithm-specific parameters */
    parameters: Record<string, unknown>;
    /** Optional result */
    result?: string;
}

/**
 * Interface for algorithm parameters
 */
export interface AlgorithmParameters {
    /** Dynamic parameters for the algorithm */
    [key: string]: unknown;
} 