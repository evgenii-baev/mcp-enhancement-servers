#!/usr/bin/env node

/**
 * Тестовый файл для проверки новых серверов MCP Clear Thought
 */

// Импортируем новые реализации серверов
import {
    FirstThoughtAdvisorServer,
    FeatureDiscussionServer,
    FeatureAnalyzerServer
} from '../dist/src/servers/index.js';

// Создаем экземпляры серверов
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

// Тестирование FirstThoughtAdvisorServer
runTest('FirstThoughtAdvisor', firstThoughtAdvisorServer, 'processAdvice', {
    problem: 'How to create a scalable microservice architecture for a large e-commerce platform',
    domain: 'Software Architecture',
    complexity: 'high',
    constraints: [
        'Limited budget',
        'Must be completed in 3 months',
        'Must support at least 1000 concurrent users'
    ],
    previousApproaches: [
        'Monolithic application',
        'Simple API Gateway with monolith'
    ],
    goal: 'Create a scalable, maintainable system that can evolve independently'
});

// Тестирование FeatureDiscussionServer
// Запускаем несколько тестов для проверки разных этапов обсуждения
const featureId = 'user-profile-management';

// Начало обсуждения (первый этап)
runTest('FeatureDiscussion - Start', featureDiscussionServer, 'processDiscussion', {
    featureId: featureId,
    response: 'Initial response to start the discussion'
});

// Продолжение обсуждения (второй этап)
runTest('FeatureDiscussion - Continue', featureDiscussionServer, 'processDiscussion', {
    featureId: featureId,
    response: 'Users need to easily update their profile information, manage security settings, and customize preferences.'
});

// Еще один этап обсуждения
runTest('FeatureDiscussion - Next Stage', featureDiscussionServer, 'processDiscussion', {
    featureId: featureId,
    response: 'The feature must support profile image upload, email verification, and two-factor authentication.'
});

// Тестирование FeatureAnalyzerServer
runTest('FeatureAnalyzer', featureAnalyzerServer, 'processAnalysis', {
    featureName: 'user-authentication-system',
    featureDescription: 'A secure authentication system with support for multiple authentication methods, including social logins, email/password, and two-factor authentication. Must include password reset functionality and account lockout after failed attempts.'
});

console.log('\n----------- All tests completed -----------');