/**
 * StochasticAlgorithmServer - сервер для стохастических алгоритмов
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './index.js';
import { STOCHASTIC_ALGORITHM_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';
import { logger } from '../utils/logger.js';

// Допустимые значения для алгоритмов
const VALID_ALGORITHMS = ['mdp', 'mcts', 'bandit', 'bayesian', 'hmm'];

// Максимальная длина строки для обрезания
const MAX_STRING_LENGTH = 500;

/**
 * Интерфейс для параметров стохастических алгоритмов
 */
interface AlgorithmParameters {
    [key: string]: any;
}

/**
 * Интерфейс для результатов симуляции
 */
interface SimulationResults {
    [key: string]: any;
}

/**
 * Сервер для стохастических алгоритмов
 */
export class StochasticAlgorithmServer extends BaseServer {
    constructor() {
        super('stochastic-algorithm-server', '1.0.0', [
            {
                name: 'apply_stochastic_algorithm',
                description: 'Applies a stochastic algorithm to a problem',
                parameters: createParameters(
                    ['algorithm', 'problem', 'parameters', 'result'],
                    STOCHASTIC_ALGORITHM_PARAM_DESCRIPTIONS,
                    {
                        algorithm: 'string',
                        problem: 'string',
                        parameters: 'object',
                        result: 'string'
                    },
                    ['algorithm', 'problem', 'parameters'] // Обязательные параметры
                )
            }
        ]);
    }

    // Переопределение метода обработки запросов для стохастических алгоритмов
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        try {
            logger.info(`StochasticAlgorithmServer: Received request for capability '${request.capability}'`);

            if (request.capability === 'apply_stochastic_algorithm') {
                // Валидация параметров
                const validatedParams = this.validateParameters(request.parameters);
                if ('error' in validatedParams) {
                    logger.error(`StochasticAlgorithmServer: Validation error - ${validatedParams.error}`);
                    return {
                        success: false,
                        error: validatedParams.error
                    };
                }

                const { algorithm, problem, parameters, result } = validatedParams;

                // Симуляция алгоритма
                try {
                    let simulationResults: SimulationResults;

                    switch (algorithm.toLowerCase()) {
                        case 'mdp': // Markov Decision Process
                            simulationResults = this.simulateMDP(problem, parameters);
                            break;
                        case 'mcts': // Monte Carlo Tree Search
                            simulationResults = this.simulateMCTS(problem, parameters);
                            break;
                        case 'bandit': // Multi-Armed Bandit
                            simulationResults = this.simulateBandit(problem, parameters);
                            break;
                        case 'bayesian': // Bayesian Optimization
                            simulationResults = this.simulateBayesian(problem, parameters);
                            break;
                        case 'hmm': // Hidden Markov Model
                            simulationResults = this.simulateHMM(problem, parameters);
                            break;
                        default:
                            logger.error(`StochasticAlgorithmServer: Unknown algorithm - ${algorithm}`);
                            return {
                                success: false,
                                error: `Unknown algorithm: ${algorithm}`
                            };
                    }

                    logger.info(`StochasticAlgorithmServer: Successfully simulated ${algorithm} algorithm`);

                    return {
                        success: true,
                        data: {
                            algorithm,
                            problem,
                            parameters,
                            inputResult: result,
                            simulationResults,
                            recommendations: this.getRecommendations(algorithm, parameters),
                            timestamp: new Date().toISOString()
                        }
                    };
                } catch (error) {
                    logger.error(`StochasticAlgorithmServer: Error simulating algorithm - ${error.message}`);
                    return {
                        success: false,
                        error: `Error simulating algorithm: ${error.message}`
                    };
                }
            }

            logger.warn(`StochasticAlgorithmServer: Unsupported capability '${request.capability}'`);
            return {
                success: false,
                error: `Capability '${request.capability}' not supported`
            };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Unexpected error - ${error.message}`);
            return {
                success: false,
                error: `Unexpected error: ${error.message}`
            };
        }
    }

    /**
     * Валидация параметров запроса
     */
    private validateParameters(params: any): { algorithm: string; problem: string; parameters: AlgorithmParameters; result?: string } | { error: string } {
        try {
            // Проверка наличия обязательных параметров
            if (!params || typeof params !== 'object') {
                return { error: 'Parameters must be an object' };
            }

            if (!params.algorithm) {
                return { error: 'Algorithm name is required' };
            }

            if (typeof params.algorithm !== 'string' || params.algorithm.trim() === '') {
                return { error: 'Algorithm name must be a non-empty string' };
            }

            // Проверка допустимых значений алгоритма
            if (!VALID_ALGORITHMS.includes(params.algorithm.toLowerCase())) {
                return { error: `Algorithm must be one of: ${VALID_ALGORITHMS.join(', ')}` };
            }

            if (!params.problem) {
                return { error: 'Problem description is required' };
            }

            if (typeof params.problem !== 'string' || params.problem.trim() === '') {
                return { error: 'Problem description must be a non-empty string' };
            }

            if (!params.parameters) {
                return { error: 'Algorithm parameters are required' };
            }

            if (typeof params.parameters !== 'object' || Array.isArray(params.parameters)) {
                return { error: 'Algorithm parameters must be an object' };
            }

            // Валидация опциональных параметров
            if (params.result !== undefined && typeof params.result !== 'string') {
                return { error: 'Result must be a string' };
            }

            // Обрезаем длинные строки
            const algorithm = params.algorithm.toLowerCase();
            const problem = this.truncateString(params.problem, MAX_STRING_LENGTH);
            const result = params.result ? this.truncateString(params.result, MAX_STRING_LENGTH) : undefined;

            // Валидация специфичных параметров для каждого алгоритма
            const parameters = this.validateAlgorithmParameters(algorithm, params.parameters);
            if ('error' in parameters) {
                return parameters;
            }

            return { algorithm, problem, parameters, result };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Parameter validation error - ${error.message}`);
            return { error: `Parameter validation error: ${error.message}` };
        }
    }

    /**
     * Валидация параметров для конкретного алгоритма
     */
    private validateAlgorithmParameters(algorithm: string, params: any): AlgorithmParameters | { error: string } {
        try {
            const validatedParams: AlgorithmParameters = {};

            switch (algorithm) {
                case 'mdp':
                    // Валидация параметров для MDP
                    if (params.states !== undefined) {
                        if (typeof params.states !== 'number' || params.states <= 0) {
                            return { error: 'MDP states must be a positive number' };
                        }
                        validatedParams.states = params.states;
                    }

                    if (params.actions !== undefined) {
                        if (typeof params.actions !== 'number' || params.actions <= 0) {
                            return { error: 'MDP actions must be a positive number' };
                        }
                        validatedParams.actions = params.actions;
                    }

                    if (params.gamma !== undefined) {
                        if (typeof params.gamma !== 'number' || params.gamma < 0 || params.gamma > 1) {
                            return { error: 'MDP gamma must be a number between 0 and 1' };
                        }
                        validatedParams.gamma = params.gamma;
                    }
                    break;

                case 'mcts':
                    // Валидация параметров для MCTS
                    if (params.simulations !== undefined) {
                        if (typeof params.simulations !== 'number' || params.simulations <= 0) {
                            return { error: 'MCTS simulations must be a positive number' };
                        }
                        validatedParams.simulations = params.simulations;
                    }

                    if (params.explorationConstant !== undefined) {
                        if (typeof params.explorationConstant !== 'number' || params.explorationConstant <= 0) {
                            return { error: 'MCTS exploration constant must be a positive number' };
                        }
                        validatedParams.explorationConstant = params.explorationConstant;
                    }

                    if (params.maxDepth !== undefined) {
                        if (typeof params.maxDepth !== 'number' || params.maxDepth <= 0) {
                            return { error: 'MCTS max depth must be a positive number' };
                        }
                        validatedParams.maxDepth = params.maxDepth;
                    }
                    break;

                case 'bandit':
                    // Валидация параметров для Multi-Armed Bandit
                    if (params.arms !== undefined) {
                        if (typeof params.arms !== 'number' || params.arms <= 0) {
                            return { error: 'Bandit arms must be a positive number' };
                        }
                        validatedParams.arms = params.arms;
                    }

                    if (params.strategy !== undefined) {
                        if (typeof params.strategy !== 'string' || params.strategy.trim() === '') {
                            return { error: 'Bandit strategy must be a non-empty string' };
                        }
                        validatedParams.strategy = params.strategy;
                    }

                    if (params.epsilon !== undefined) {
                        if (typeof params.epsilon !== 'number' || params.epsilon < 0 || params.epsilon > 1) {
                            return { error: 'Bandit epsilon must be a number between 0 and 1' };
                        }
                        validatedParams.epsilon = params.epsilon;
                    }
                    break;

                case 'bayesian':
                    // Валидация параметров для Bayesian Optimization
                    if (params.iterations !== undefined) {
                        if (typeof params.iterations !== 'number' || params.iterations <= 0) {
                            return { error: 'Bayesian iterations must be a positive number' };
                        }
                        validatedParams.iterations = params.iterations;
                    }

                    if (params.acquisitionFunction !== undefined) {
                        if (typeof params.acquisitionFunction !== 'string' || params.acquisitionFunction.trim() === '') {
                            return { error: 'Bayesian acquisition function must be a non-empty string' };
                        }
                        validatedParams.acquisitionFunction = params.acquisitionFunction;
                    }

                    if (params.bounds !== undefined) {
                        if (typeof params.bounds !== 'object' || Array.isArray(params.bounds)) {
                            return { error: 'Bayesian bounds must be an object' };
                        }
                        validatedParams.bounds = params.bounds;
                    }
                    break;

                case 'hmm':
                    // Валидация параметров для Hidden Markov Model
                    if (params.states !== undefined) {
                        if (typeof params.states !== 'number' || params.states <= 0) {
                            return { error: 'HMM states must be a positive number' };
                        }
                        validatedParams.states = params.states;
                    }

                    if (params.observations !== undefined) {
                        if (typeof params.observations !== 'number' || params.observations <= 0) {
                            return { error: 'HMM observations must be a positive number' };
                        }
                        validatedParams.observations = params.observations;
                    }

                    if (params.algorithm !== undefined) {
                        if (typeof params.algorithm !== 'string' || params.algorithm.trim() === '') {
                            return { error: 'HMM algorithm must be a non-empty string' };
                        }
                        validatedParams.algorithm = params.algorithm;
                    }

                    if (params.maxIterations !== undefined) {
                        if (typeof params.maxIterations !== 'number' || params.maxIterations <= 0) {
                            return { error: 'HMM max iterations must be a positive number' };
                        }
                        validatedParams.maxIterations = params.maxIterations;
                    }
                    break;

                default:
                    return { error: `Unknown algorithm: ${algorithm}` };
            }

            // Копируем остальные параметры
            for (const key in params) {
                if (!(key in validatedParams)) {
                    validatedParams[key] = params[key];
                }
            }

            return validatedParams;
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Algorithm parameter validation error - ${error.message}`);
            return { error: `Algorithm parameter validation error: ${error.message}` };
        }
    }

    /**
     * Обрезает строку до указанной максимальной длины
     */
    private truncateString(str: string, maxLength: number): string {
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    }

    /**
     * Получает рекомендации на основе алгоритма и параметров
     */
    private getRecommendations(algorithm: string, parameters: AlgorithmParameters): string[] {
        try {
            const baseRecommendations = [
                'Consider adjusting parameters for better convergence',
                'Run multiple simulations to ensure robustness',
                'Compare results with deterministic alternatives'
            ];

            // Добавляем специфичные рекомендации для каждого алгоритма
            switch (algorithm) {
                case 'mdp':
                    return [
                        ...baseRecommendations,
                        'Try different discount factors (gamma) to balance immediate vs. future rewards',
                        'Consider using value iteration for faster convergence in some cases',
                        'For large state spaces, consider state aggregation or function approximation'
                    ];
                case 'mcts':
                    return [
                        ...baseRecommendations,
                        'Adjust the exploration constant to balance exploration vs. exploitation',
                        'Increase simulation count for more accurate results at the cost of computation time',
                        'Consider domain-specific heuristics for the rollout policy'
                    ];
                case 'bandit':
                    return [
                        ...baseRecommendations,
                        'Try different exploration strategies (epsilon-greedy, UCB, Thompson sampling)',
                        'Adjust epsilon over time to transition from exploration to exploitation',
                        'Consider contextual bandits if additional information is available'
                    ];
                case 'bayesian':
                    return [
                        ...baseRecommendations,
                        'Experiment with different acquisition functions for different optimization goals',
                        'Consider the trade-off between exploration and exploitation in your acquisition function',
                        'Try different kernel functions for the Gaussian process'
                    ];
                case 'hmm':
                    return [
                        ...baseRecommendations,
                        'Experiment with different numbers of hidden states',
                        'Consider domain knowledge when initializing transition and emission probabilities',
                        'Use multiple random initializations to avoid local optima'
                    ];
                default:
                    return baseRecommendations;
            }
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Error generating recommendations - ${error.message}`);
            return [
                'Consider adjusting parameters for better convergence',
                'Run multiple simulations to ensure robustness',
                'Compare results with deterministic alternatives'
            ];
        }
    }

    // Заглушки для реализаций стохастических алгоритмов

    // Марковский процесс принятия решений
    private simulateMDP(problem: string, parameters: AlgorithmParameters): SimulationResults {
        try {
            return {
                states: parameters.states ? Array.from({ length: Math.min(parameters.states, 10) }, (_, i) => `state${i + 1}`) : ['state1', 'state2', 'state3'],
                actions: parameters.actions ? Array.from({ length: Math.min(parameters.actions, 5) }, (_, i) => `action${i + 1}`) : ['action1', 'action2'],
                policy: {
                    'state1': 'action1',
                    'state2': 'action2',
                    'state3': 'action1'
                },
                expectedReward: 0.85,
                confidence: 0.92,
                discountFactor: parameters.gamma || 0.95
            };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Error simulating MDP - ${error.message}`);
            return {
                error: `Error simulating MDP: ${error.message}`,
                fallbackResult: {
                    states: ['state1', 'state2', 'state3'],
                    actions: ['action1', 'action2'],
                    policy: { 'state1': 'action1', 'state2': 'action2', 'state3': 'action1' }
                }
            };
        }
    }

    // Поиск по дереву Монте-Карло
    private simulateMCTS(problem: string, parameters: AlgorithmParameters): SimulationResults {
        try {
            return {
                iterations: parameters.simulations || 1000,
                bestPath: ['node1', 'node3', 'node7', 'node12'],
                expectedValue: 0.78,
                confidence: 0.85,
                explorationParameter: parameters.explorationConstant || 1.41,
                maxDepth: parameters.maxDepth || 20,
                nodesExplored: Math.min(parameters.simulations || 1000, 10000)
            };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Error simulating MCTS - ${error.message}`);
            return {
                error: `Error simulating MCTS: ${error.message}`,
                fallbackResult: {
                    iterations: 1000,
                    bestPath: ['node1', 'node3', 'node7', 'node12'],
                    expectedValue: 0.78
                }
            };
        }
    }

    // Многорукий бандит
    private simulateBandit(problem: string, parameters: AlgorithmParameters): SimulationResults {
        try {
            const numArms = parameters.arms || 4;
            const arms = Array.from({ length: Math.min(numArms, 10) }, (_, i) => `option${i + 1}`);
            
            const pulls: Record<string, number> = {};
            const rewards: Record<string, number> = {};
            
            arms.forEach((arm, index) => {
                pulls[arm] = 100 + Math.floor(Math.random() * 300);
                rewards[arm] = 0.4 + Math.random() * 0.4;
            });
            
            // Находим лучшую руку
            let bestArm = arms[0];
            let bestReward = rewards[arms[0]];
            
            for (const arm of arms) {
                if (rewards[arm] > bestReward) {
                    bestReward = rewards[arm];
                    bestArm = arm;
                }
            }
            
            return {
                strategy: parameters.strategy || 'epsilon-greedy',
                epsilon: parameters.epsilon || 0.1,
                arms,
                pulls,
                rewards,
                bestArm,
                confidence: 0.85 + Math.random() * 0.1,
                totalPulls: Object.values(pulls).reduce((a, b) => a + b, 0)
            };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Error simulating Bandit - ${error.message}`);
            return {
                error: `Error simulating Bandit: ${error.message}`,
                fallbackResult: {
                    arms: ['option1', 'option2', 'option3', 'option4'],
                    bestArm: 'option3',
                    confidence: 0.91
                }
            };
        }
    }

    // Байесовская оптимизация
    private simulateBayesian(problem: string, parameters: AlgorithmParameters): SimulationResults {
        try {
            const iterations = parameters.iterations || 50;
            const acquisitionFunction = parameters.acquisitionFunction || 'expected_improvement';
            
            // Создаем случайные гиперпараметры
            const hyperparameters: Record<string, number> = {};
            const bounds = parameters.bounds || { 'param1': [0, 1], 'param2': [0, 2], 'param3': [0, 0.5] };
            
            for (const [param, range] of Object.entries(bounds)) {
                if (Array.isArray(range) && range.length === 2) {
                    const [min, max] = range;
                    hyperparameters[param] = min + Math.random() * (max - min);
                }
            }
            
            // Создаем следующую точку оценки
            const nextEvaluationPoint = Object.values(hyperparameters).map(v => v * (0.95 + Math.random() * 0.1));
            
            return {
                iterations,
                acquisitionFunction,
                hyperparameters,
                expectedImprovement: 0.1 + Math.random() * 0.3,
                confidence: 0.8 + Math.random() * 0.15,
                nextEvaluationPoint,
                bounds
            };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Error simulating Bayesian - ${error.message}`);
            return {
                error: `Error simulating Bayesian: ${error.message}`,
                fallbackResult: {
                    iterations: 50,
                    hyperparameters: { 'param1': 0.42, 'param2': 1.87, 'param3': 0.156 },
                    expectedImprovement: 0.23
                }
            };
        }
    }

    // Скрытая марковская модель
    private simulateHMM(problem: string, parameters: AlgorithmParameters): SimulationResults {
        try {
            const states = parameters.states || 3;
            const observations = parameters.observations || 5;
            
            // Создаем последовательность наблюдений
            const observationSequence = Array.from(
                { length: Math.min(observations, 20) }, 
                (_, i) => `obs${(i % 3) + 1}`
            );
            
            // Создаем наиболее вероятную последовательность состояний
            const mostLikelySequence = observationSequence.map(
                (_, i) => `state${(i % states) + 1}`
            );
            
            // Создаем матрицы переходов и эмиссий
            const transitions = Array.from({ length: states }, () => 
                Array.from({ length: states }, () => Math.random())
            ).map(row => {
                const sum = row.reduce((a, b) => a + b, 0);
                return row.map(v => parseFloat((v / sum).toFixed(2)));
            });
            
            const emissions = Array.from({ length: states }, () => 
                Array.from({ length: 3 }, () => Math.random())
            ).map(row => {
                const sum = row.reduce((a, b) => a + b, 0);
                return row.map(v => parseFloat((v / sum).toFixed(2)));
            });
            
            return {
                algorithm: parameters.algorithm || 'forward-backward',
                hiddenStates: states,
                observationSequence,
                mostLikelySequence,
                logLikelihood: -10 - Math.random() * 10,
                modelParameters: {
                    transitions,
                    emissions
                },
                convergenceIterations: Math.floor(Math.random() * parameters.maxIterations) || 50
            };
        } catch (error) {
            logger.error(`StochasticAlgorithmServer: Error simulating HMM - ${error.message}`);
            return {
                error: `Error simulating HMM: ${error.message}`,
                fallbackResult: {
                    hiddenStates: 3,
                    observationSequence: ['obs1', 'obs2', 'obs1', 'obs3', 'obs2'],
                    mostLikelySequence: ['state2', 'state1', 'state2', 'state3', 'state1']
                }
            };
        }
    }
} 