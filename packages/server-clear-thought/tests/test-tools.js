#!/usr/bin/env node

/**
 * Простой тестовый файл для проверки инструментов MCP Clear Thought Server
 */

// Импортируем необходимые классы из главного файла
import {
    MentalModelServer,
    SequentialThinkingServer,
    DebuggingApproachServer,
    BrainstormingServer,
    StochasticAlgorithmServer,
    FirstThoughtAdvisorServer,
    FeatureDiscussionServer,
    FeatureAnalyzerServer
} from '../dist/index.js';

// Создаем экземпляры серверов
const mentalModelServer = new MentalModelServer();
const sequentialThinkingServer = new SequentialThinkingServer();
const debuggingApproachServer = new DebuggingApproachServer();
const brainstormingServer = new BrainstormingServer();
const stochasticAlgorithmServer = new StochasticAlgorithmServer();
const firstThoughtAdvisorServer = new FirstThoughtAdvisorServer();
const featureDiscussionServer = new FeatureDiscussionServer();
const featureAnalyzerServer = new FeatureAnalyzerServer();

// Функция для запуска теста и вывода результатов
function runTest(name, server, method, inputData) {
    console.log(`\n----------- Testing ${name} -----------`);
    try {
        const result = server[method](inputData);
        console.log("Result:", JSON.stringify(result, null, 2));
        console.log(`✅ ${name} test passed`);
        return true;
    } catch (error) {
        console.error(`❌ ${name} test failed:`, error);
        return false;
    }
}

// Тестирование MentalModelServer
runTest('MentalModel', mentalModelServer, 'processModel', {
    modelName: 'first_principles',
    problem: 'How to improve code reusability in a large codebase?'
});

// Тестирование SequentialThinkingServer
runTest('SequentialThinking', sequentialThinkingServer, 'processThought', {
    thought: 'Let me think about how to solve this problem step by step.',
    thoughtNumber: 1,
    totalThoughts: 3,
    nextThoughtNeeded: true
});

// Тестирование DebuggingApproachServer
runTest('DebuggingApproach', debuggingApproachServer, 'processApproach', {
    approachName: 'binary_search',
    issue: 'Application crashes when processing large files.',
    steps: ['Identify if the issue occurs with all file sizes', 'Try with medium-sized file to narrow down']
});

// Тестирование BrainstormingServer
runTest('Brainstorming', brainstormingServer, 'processBrainstorming', {
    phase: 'ideation',
    topic: 'Improving user experience in our application'
});

// Тестирование StochasticAlgorithmServer
runTest('StochasticAlgorithm', stochasticAlgorithmServer, 'processAlgorithm', {
    algorithm: 'mdp',
    problem: 'Optimizing resource allocation in cloud infrastructure',
    parameters: { gamma: 0.9, epsilon: 0.1 }
});

// Тестирование FirstThoughtAdvisorServer
runTest('FirstThoughtAdvisor', firstThoughtAdvisorServer, 'processAdvice', {
    problem: 'How to approach designing a scalable microservice architecture?'
});

// Тестирование FeatureDiscussionServer
runTest('FeatureDiscussion', featureDiscussionServer, 'processDiscussion', {
    featureId: 'dynamic-theme-switching',
    response: 'We should implement a theme provider component that all UI elements can subscribe to.'
});

// Тестирование FeatureAnalyzerServer
runTest('FeatureAnalyzer', featureAnalyzerServer, 'processAnalysis', {
    featureName: 'multi-factor-authentication',
    featureDescription: 'Adding support for authenticator apps and SMS codes for account security.'
});

console.log('\n----------- All tests completed -----------'); 