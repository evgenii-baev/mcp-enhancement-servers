/**
 * Interface for debugging approach data
 */
export interface DebuggingApproachData {
    /** The name of the debugging approach to apply */
    approachName: string
    /** The issue to debug */
    issue: string
    /** Steps taken in debugging */
    steps: string[]
    /** Findings from the debugging process */
    findings: string
    /** Resolution or fix for the issue */
    resolution: string
} 