import { Tool } from "@modelcontextprotocol/sdk/types.js";

/**
 * Tool for applying stochastic algorithms to decision-making problems
 */
export const STOCHASTIC_ALGORITHM_TOOL: Tool = {
  name: "stochastic_algorithm",
  description: `A tool for applying stochastic algorithms to decision-making problems.
Supports various algorithms including:
- Markov Decision Processes (MDPs): Optimize policies over long sequences of decisions
- Monte Carlo Tree Search (MCTS): Simulate future action sequences for large decision spaces
- Multi-Armed Bandit: Balance exploration vs exploitation in action selection
- Bayesian Optimization: Optimize decisions with probabilistic inference
- Hidden Markov Models (HMMs): Infer latent states affecting decision outcomes

Each algorithm provides a systematic approach to handling uncertainty in decision-making.

EXAMPLES:

1. Markov Decision Process (MDP):
   {
     "algorithm": "mdp",
     "problem": "Find optimal route through city",
     "parameters": {
       "states": 10,
       "actions": 4,
       "gamma": 0.95
     }
   }

2. Monte Carlo Tree Search (MCTS):
   {
     "algorithm": "mcts",
     "problem": "Find best move in chess position",
     "parameters": {
       "simulations": 10000,
       "explorationConstant": 1.4,
       "maxDepth": 20
     }
   }

3. Multi-Armed Bandit:
   {
     "algorithm": "bandit",
     "problem": "Optimize ad placement",
     "parameters": {
       "arms": 5,
       "strategy": "epsilon-greedy",
       "epsilon": 0.1
     }
   }

4. Bayesian Optimization:
   {
     "algorithm": "bayesian",
     "problem": "Tune hyperparameters for ML model",
     "parameters": {
       "iterations": 50,
       "acquisitionFunction": "expected_improvement",
       "bounds": {"learning_rate": [0.001, 0.1], "batch_size": [16, 256]}
     }
   }

5. Hidden Markov Model (HMM):
   {
     "algorithm": "hmm",
     "problem": "Detect user activity states from sensor data",
     "parameters": {
       "states": 3,
       "observations": 10,
       "algorithm": "forward-backward",
       "maxIterations": 100
     }
   }`,
  inputSchema: {
    type: "object",
    properties: {
      algorithm: {
        type: "string",
        enum: [
          "mdp",
          "mcts",
          "bandit",
          "bayesian",
          "hmm"
        ]
      },
      problem: { type: "string" },
      parameters: {
        type: "object",
        additionalProperties: true
      },
      result: { type: "string" }
    },
    required: ["algorithm", "problem", "parameters"]
  }
}; 