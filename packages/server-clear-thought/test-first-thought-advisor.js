#!/usr/bin/env node

import { FirstThoughtAdvisorServer } from './dist/src/servers/first-thought-advisor-server.js';

// Создаем экземпляр сервера
const server = new FirstThoughtAdvisorServer();

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
    console.log('\x1b[32m=== Testing First Thought Advisor Tool ===\x1b[0m');

    // Тест 1: Базовый запрос с минимальными параметрами
    await testRequest('Test 1: Basic request with minimal parameters', {
        capability: 'get_thinking_approach',
        parameters: {
            problem: 'Our software development team is struggling with meeting deadlines.'
        }
    });

    // Тест 2: Запрос с дополнительными параметрами
    await testRequest('Test 2: Request with additional parameters', {
        capability: 'get_thinking_approach',
        parameters: {
            problem: 'We need to optimize our e-commerce website for better conversion rates.',
            goal: 'optimize',
            domain: 'business',
            complexity: 'medium',
            constraints: ['limited budget', 'must complete in 2 months'],
            previousApproaches: ['A/B Testing', 'User Surveys']
        }
    });

    // Тест 3: Запрос для технической проблемы
    await testRequest('Test 3: Technical problem request', {
        capability: 'get_thinking_approach',
        parameters: {
            problem: 'Our codebase has become difficult to maintain with increasing technical debt.',
            goal: 'optimize',
            domain: 'tech',
            complexity: 'high'
        }
    });

    // Тест 4: Запрос с пустой проблемой (должен вернуть ошибку)
    await testRequest('Test 4: Empty problem (should return error)', {
        capability: 'get_thinking_approach',
        parameters: {
            problem: ''
        }
    });

    // Тест 5: Запрос с очень длинным описанием проблемы
    await testRequest('Test 5: Very long problem description', {
        capability: 'get_thinking_approach',
        parameters: {
            problem: 'Our organization is facing a complex challenge related to data management and integration across multiple departments. We have legacy systems that don\'t communicate well with each other, resulting in data silos, duplicate entries, and inconsistent reporting. This affects decision-making processes and operational efficiency. Additionally, we need to comply with new regulatory requirements while maintaining system performance and user experience. The technical team is understaffed and has limited expertise in some of the newer technologies we might need to implement. Budget constraints prevent us from completely replacing all systems at once, so we need a phased approach that delivers incremental value while working toward a comprehensive solution. Previous attempts to address these issues have been piecemeal and haven\'t resolved the underlying architectural problems.',
            goal: 'optimize',
            domain: 'tech',
            complexity: 'high',
            constraints: ['budget limitations', 'understaffed team', 'regulatory compliance', 'cannot disrupt operations']
        }
    });

    // Тест 6: Запрос с неподдерживаемой возможностью
    await testRequest('Test 6: Unsupported capability', {
        capability: 'unsupported_capability',
        parameters: {
            problem: 'Test problem'
        }
    });

    // Тест 7: Запрос с специальными символами
    await testRequest('Test 7: Special characters in problem', {
        capability: 'get_thinking_approach',
        parameters: {
            problem: 'How to handle JSON data with special characters like " \\ / \b \f \n \r \t and Unicode characters like 你好?',
            domain: 'tech'
        }
    });

    console.log('\n\x1b[32m=== First Thought Advisor Tool Tests Completed ===\x1b[0m');
}

// Запуск тестов
runTests().catch(error => {
    console.error('\x1b[31mTest execution failed:\x1b[0m', error);
    process.exit(1);
}); 