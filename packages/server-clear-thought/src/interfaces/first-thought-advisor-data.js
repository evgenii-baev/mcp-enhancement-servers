/**
 * Interface for first thought advisor data
 * @typedef {Object} FirstThoughtData
 * @property {string} problem - The problem statement
 * @property {string} [domain] - Optional domain of the problem
 * @property {string} [complexity] - Optional complexity assessment
 * @property {string[]} [constraints] - Optional array of constraints
 * @property {string[]} [previousApproaches] - Optional array of previously tried approaches
 * @property {string} [goal] - Optional explicit goal statement
 */

/**
 * Interface for recommendation data
 * @typedef {Object} RecommendationData
 * @property {string} primary - Primary recommendation
 * @property {string[]} alternatives - Alternative recommendations
 */

// Export for documentation
export const FirstThoughtParameters = {
    problem: "Problem statement that needs a solution",
    domain: "Optional domain or context of the problem",
    complexity: "Optional assessment of problem complexity (low/medium/high)",
    constraints: "Optional array of constraints affecting the solution",
    previousApproaches: "Optional array of previously tried approaches",
    goal: "Optional explicit goal statement"
};