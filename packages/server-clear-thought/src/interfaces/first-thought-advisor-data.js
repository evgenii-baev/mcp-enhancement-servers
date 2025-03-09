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
    problem: "The specific problem or challenge that requires analysis. Be detailed and precise to receive the most relevant mental model recommendation.",
    domain: "The field or context in which the problem exists (e.g., 'software engineering', 'machine learning', 'business strategy'). This helps tailor recommendations to domain-specific approaches.",
    complexity: "Assessment of problem difficulty on a scale from 'low' to 'high'. This helps calibrate the sophistication level of the recommended mental models.",
    constraints: "Any limitations, boundaries, or requirements that affect potential solutions. Each constraint should be expressed as a separate array element.",
    previousApproaches: "Methods or strategies already attempted, allowing the advisor to suggest novel alternatives. Each approach should be listed as a separate array element.",
    goal: "The specific outcome or objective you're trying to achieve. A clear goal statement helps focus recommendations on solutions that directly address your desired end result."
};