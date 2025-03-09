/**
 * Interface for mental model application data
 */
export interface MentalModelData {
    /** The name of the mental model to apply */
    modelName: string
    /** The problem to solve using the mental model */
    problem: string
    /** Steps taken in applying the model */
    steps: string[]
    /** Reasoning process */
    reasoning: string
    /** Final conclusion */
    conclusion: string
} 