/**
 * Interface for sequential thinking thought data
 */
export interface ThoughtData {
    /** The content of the thought */
    thought: string
    /** The sequential number of this thought */
    thoughtNumber: number
    /** The estimated total number of thoughts needed */
    totalThoughts: number
    /** Whether another thought is needed after this one */
    nextThoughtNeeded: boolean
    /** Whether this thought revises a previous thought */
    isRevision?: boolean
    /** The thought number being revised (if isRevision is true) */
    revisesThought?: number
    /** The thought number this branch starts from (if branching) */
    branchFromThought?: number
    /** Unique identifier for this branch */
    branchId?: string
    /** Indicates more thoughts are needed even if initially thought complete */
    needsMoreThoughts?: boolean
} 