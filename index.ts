#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  McpError,
  ErrorCode,
} from "@modelcontextprotocol/sdk/types.js";
// Fixed chalk import for ESM
import chalk from 'chalk';

// Import tools
import { MENTAL_MODEL_TOOL } from "./src/tools/mental-model-tool.js";
import { SEQUENTIAL_THINKING_TOOL } from "./src/tools/sequential-thinking-tool.js";
import { DEBUGGING_APPROACH_TOOL } from "./src/tools/debugging-approach-tool.js";
import { BRAINSTORMING_TOOL } from "./src/tools/brainstorming-tool.js";
import { MODEL_SELECTOR_TOOL } from "./src/tools/model-selector-tool.js";
import { STOCHASTIC_ALGORITHM_TOOL } from "./src/tools/stochastic-algorithm-tool.js";

// Import interfaces from server-interfaces.js
import {
  ThoughtData,
  MentalModelData,
  DebuggingApproachData,
  BrainstormingData,
  ModelSelectorData,
  FeatureDiscussionData,
  FeatureAnalyzerData,
  FirstThoughtAdvisorData,
  StochasticAlgorithmData
} from './src/interfaces/server-interfaces.js'

// Import server classes
import {
  MentalModelServer,
  DebuggingApproachServer,
  SequentialThinkingServer
} from './src/servers/index.js'

// Create classes for new servers
class BrainstormingServer {
  private validateBrainstormingData(input: unknown): BrainstormingData {
    const data = input as Record<string, unknown>;

    if (!data.phase || typeof data.phase !== 'string') {
      throw new Error('Invalid phase: must be a string');
    }

    return data as BrainstormingData;
  }

  public processBrainstorming(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const data = this.validateBrainstormingData(input);

      // Process the brainstorming data
      console.log(`Processing brainstorming phase: ${data.phase}`);

      return {
        content: [{ type: "text", text: `Processed brainstorming phase: ${data.phase}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error processing brainstorming: ${error}` }],
        isError: true
      };
    }
  }
}

class StochasticAlgorithmServer {
  private validateAlgorithmData(input: unknown): StochasticAlgorithmData {
    const data = input as Record<string, unknown>;

    if (!data.algorithm || typeof data.algorithm !== 'string') {
      throw new Error('Invalid algorithm: must be a string');
    }
    if (!data.problem || typeof data.problem !== 'string') {
      throw new Error('Invalid problem: must be a string');
    }

    return data as StochasticAlgorithmData;
  }

  public processAlgorithm(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const data = this.validateAlgorithmData(input);

      // Process the stochastic algorithm data
      console.log(`Processing algorithm: ${data.algorithm} for problem: ${data.problem}`);

      return {
        content: [{ type: "text", text: `Applied ${data.algorithm} to problem: ${data.problem}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error processing stochastic algorithm: ${error}` }],
        isError: true
      };
    }
  }
}

class FirstThoughtAdvisorServer {
  private validateAdviceData(input: unknown): FirstThoughtAdvisorData {
    const data = input as Record<string, unknown>;

    if (!data.problem || typeof data.problem !== 'string') {
      throw new Error('Invalid problem: must be a string');
    }

    return data as FirstThoughtAdvisorData;
  }

  public processAdvice(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const data = this.validateAdviceData(input);

      // Process the first thought advisor data
      console.log(`Processing advice for problem: ${data.problem}`);

      return {
        content: [{ type: "text", text: `Processed advice for problem: ${data.problem}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error processing advice: ${error}` }],
        isError: true
      };
    }
  }
}

class FeatureDiscussionServer {
  private validateDiscussionData(input: unknown): FeatureDiscussionData {
    const data = input as Record<string, unknown>;

    if (!data.featureId || typeof data.featureId !== 'string') {
      throw new Error('Invalid featureId: must be a string');
    }
    if (!data.response || typeof data.response !== 'string') {
      throw new Error('Invalid response: must be a string');
    }

    return data as FeatureDiscussionData;
  }

  public processDiscussion(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const data = this.validateDiscussionData(input);

      // Process the feature discussion data
      console.log(`Processing feature discussion for: ${data.featureId}`);

      return {
        content: [{ type: "text", text: `Processed feature discussion for: ${data.featureId}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error processing feature discussion: ${error}` }],
        isError: true
      };
    }
  }
}

class FeatureAnalyzerServer {
  private validateAnalysisData(input: unknown): FeatureAnalyzerData {
    const data = input as Record<string, unknown>;

    if (!data.featureName || typeof data.featureName !== 'string') {
      throw new Error('Invalid featureName: must be a string');
    }

    return data as FeatureAnalyzerData;
  }

  public processAnalysis(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const data = this.validateAnalysisData(input);

      // Process the feature analyzer data
      console.log(`Processing feature analysis for: ${data.featureName}`);

      return {
        content: [{ type: "text", text: `Processed feature analysis for: ${data.featureName}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error processing feature analysis: ${error}` }],
        isError: true
      };
    }
  }
}

class ModelSelectorServer {
  private validateModelSelectionData(input: unknown): ModelSelectorData {
    const data = input as Record<string, unknown>;

    if (!data.task || typeof data.task !== 'string') {
      throw new Error('Invalid task: must be a string');
    }

    return data as ModelSelectorData;
  }

  public processModelSelection(input: unknown): { content: Array<{ type: string; text: string }>; isError?: boolean } {
    try {
      const data = this.validateModelSelectionData(input);

      // Process the model selector data
      console.log(`Processing model selection for task: ${data.task}`);

      return {
        content: [{ type: "text", text: `Processed model selection for task: ${data.task}` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error processing model selection: ${error}` }],
        isError: true
      };
    }
  }
}

// Initialize server instances
const mentalModelServer = new MentalModelServer();
const debuggingApproachServer = new DebuggingApproachServer();
const sequentialThinkingServer = new SequentialThinkingServer();
const brainstormingServer = new BrainstormingServer();
const stochasticAlgorithmServer = new StochasticAlgorithmServer();
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer();
const featureDiscussionServer = new FeatureDiscussionServer();
const featureAnalyzerServer = new FeatureAnalyzerServer();
const modelSelectorServer = new ModelSelectorServer();

const server = new Server(
  {
    name: "clear-thought-server",
    version: "0.3.0",
  },
  {
    capabilities: {
      tools: {
        "sequential_thinking": SEQUENTIAL_THINKING_TOOL,
        "mental_model": MENTAL_MODEL_TOOL,
        "debugging_approach": DEBUGGING_APPROACH_TOOL,
        "brainstorming": BRAINSTORMING_TOOL,
        "stochastic_algorithm": STOCHASTIC_ALGORITHM_TOOL,
        "model_selector": MODEL_SELECTOR_TOOL,
        "first_thought_advisor": { name: "first_thought_advisor", description: "A tool that intelligently recommends the optimal mental model or algorithm for any problem." },
        "feature_discussion": { name: "feature_discussion", description: "Start a new feature discussion" },
        "feature_analyzer": { name: "feature_analyzer", description: "Analyze a feature" }
      },
    },
  }
);

// Request Handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    SEQUENTIAL_THINKING_TOOL,
    MENTAL_MODEL_TOOL,
    DEBUGGING_APPROACH_TOOL,
    BRAINSTORMING_TOOL,
    STOCHASTIC_ALGORITHM_TOOL,
    MODEL_SELECTOR_TOOL,
    { name: "first_thought_advisor", description: "A tool that intelligently recommends the optimal mental model or algorithm for any problem." },
    { name: "feature_discussion", description: "Start a new feature discussion" },
    { name: "feature_analyzer", description: "Analyze a feature" }
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: params } = request.params;

  try {
    switch (name) {
      case "mental_model":
        return mentalModelServer.processModel(params);
      case "debugging_approach":
        return debuggingApproachServer.processApproach(params);
      case "sequential_thinking":
        return sequentialThinkingServer.processThought(params);
      case "brainstorming":
        return brainstormingServer.processBrainstorming(params);
      case "stochastic_algorithm":
        return stochasticAlgorithmServer.processAlgorithm(params);
      case "first_thought_advisor":
        return firstThoughtAdvisorServer.processAdvice(params);
      case "feature_discussion":
        return featureDiscussionServer.processDiscussion(params);
      case "feature_analyzer":
        return featureAnalyzerServer.processAnalysis(params);
      case "model_selector":
        return modelSelectorServer.processModelSelection(params);
      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    console.error(`Error processing ${name} request:`, error);
    throw error;
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Clear Thought MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
