#!/usr/bin/env node

import { StochasticAlgorithmServer } from './dist/src/servers/stochastic-algorithm-server.js';

// Создаем экземпляр сервера
const server = new StochasticAlgorithmServer();

// Функция для тестирования запросов
async function testRequest(description, request) {
    console.log(`\n\x1b[1m${description}\x1b[0m`);
    console.log('Request:', JSON.stringify(request, null, 2));

    try {
        const response = await server.handleRequest(request);
        console.log('Response:', JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error('\x1b[31mError:\x1b[0m', error.message);
        console.error(error.stack);
        return { success: false, error: error.message };
    }
}

// Основная функция тестирования
async function runTests() {
    console.log('\x1b[32m=== Testing Stochastic Algorithm Tool ===\x1b[0m');

    // Тест 1: Базовый запрос MDP
    await testRequest('Test 1: Basic MDP request', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'mdp',
            problem: 'Find optimal route through city',
            parameters: {
                states: 10,
                actions: 4,
                gamma: 0.95
            }
        }
    });

    // Тест 2: Запрос MCTS
    await testRequest('Test 2: MCTS request', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'mcts',
            problem: 'Find best move in chess position',
            parameters: {
                simulations: 10000,
                explorationConstant: 1.4,
                maxDepth: 20
            }
        }
    });

    // Тест 3: Запрос Multi-Armed Bandit
    await testRequest('Test 3: Multi-Armed Bandit request', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'bandit',
            problem: 'Optimize ad placement',
            parameters: {
                arms: 5,
                strategy: 'epsilon-greedy',
                epsilon: 0.1
            }
        }
    });

    // Тест 4: Запрос Bayesian Optimization
    await testRequest('Test 4: Bayesian Optimization request', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'bayesian',
            problem: 'Tune hyperparameters for ML model',
            parameters: {
                iterations: 50,
                acquisitionFunction: 'expected_improvement',
                bounds: {
                    learning_rate: [0.001, 0.1],
                    batch_size: [16, 256]
                }
            }
        }
    });

    // Тест 5: Запрос Hidden Markov Model
    await testRequest('Test 5: Hidden Markov Model request', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'hmm',
            problem: 'Detect user activity states from sensor data',
            parameters: {
                states: 3,
                observations: 10,
                algorithm: 'forward-backward',
                maxIterations: 100
            }
        }
    });

    // Тест 6: Запрос с неизвестным алгоритмом
    await testRequest('Test 6: Unknown algorithm', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'unknown_algorithm',
            problem: 'Test problem',
            parameters: {}
        }
    });

    // Тест 7: Запрос с отсутствующим алгоритмом
    await testRequest('Test 7: Missing algorithm', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            problem: 'Test problem',
            parameters: {}
        }
    });

    // Тест 8: Запрос с отсутствующей проблемой
    await testRequest('Test 8: Missing problem', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'mdp',
            parameters: {}
        }
    });

    // Тест 9: Запрос с отсутствующими параметрами
    await testRequest('Test 9: Missing parameters', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'mdp',
            problem: 'Test problem'
        }
    });

    // Тест 10: Запрос с специальными символами
    await testRequest('Test 10: Special characters in problem', {
        capability: 'apply_stochastic_algorithm',
        parameters: {
            algorithm: 'mdp',
            problem: 'How to handle JSON data with special characters like " \\ / \b \f \n \r \t and Unicode characters like 你好?',
            parameters: {
                states: 5,
                actions: 3
            }
        }
    });

    console.log('\n\x1b[32m=== Stochastic Algorithm Tool Tests Completed ===\x1b[0m');
}

// Запуск тестов
runTests().catch(error => {
    console.error('\x1b[31mTest execution failed:\x1b[0m', error);
    process.exit(1);
}); 