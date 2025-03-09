// Export server classes
import { BrainstormingServer } from './brainstorming-server.js';
import { StochasticAlgorithmServer } from './stochastic-algorithm-server.js';

export { BrainstormingServer, StochasticAlgorithmServer };

export class FirstThoughtAdvisorServer {
    processAdvice(input) {
        return {
            content: [{ type: "text", text: `Processed first thought advice: ${JSON.stringify(input)}` }]
        };
    }
}

export class FeatureDiscussionServer {
    processDiscussion(input) {
        return {
            content: [{ type: "text", text: `Processed feature discussion: ${JSON.stringify(input)}` }]
        };
    }
}

export class FeatureAnalyzerServer {
    processAnalysis(input) {
        return {
            content: [{ type: "text", text: `Processed feature analysis: ${JSON.stringify(input)}` }]
        };
    }
} 