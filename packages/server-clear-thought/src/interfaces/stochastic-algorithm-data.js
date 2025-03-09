/**
 * Interface for stochastic algorithm data
 * @typedef {Object} StochasticData
 * @property {string} algorithm - The algorithm to use
 * @property {string} problem - The problem to solve
 * @property {Object} parameters - Algorithm-specific parameters
 * @property {string} [result] - Optional result
 */

/**
 * Interface for algorithm parameters
 * @typedef {Object} AlgorithmParameters
 */

// Export for documentation
export const StochasticAlgorithms = {
    MDP: 'mdp',          // Markov Decision Process
    MCTS: 'mcts',        // Monte Carlo Tree Search
    BANDIT: 'bandit',    // Multi-Armed Bandit
    BAYESIAN: 'bayesian',// Bayesian Optimization
    HMM: 'hmm'           // Hidden Markov Model
}; 