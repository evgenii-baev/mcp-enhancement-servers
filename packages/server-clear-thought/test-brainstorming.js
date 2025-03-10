#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки работы инструмента brainstorming
 * 
 * Этот скрипт эмулирует вызов инструмента brainstorming и выводит результат
 * Запуск: node test-brainstorming.js
 */

import { BrainstormingServer } from './src/servers/brainstorming-server.js';
import { BrainstormingPhase } from './src/interfaces/brainstorming-data.js';

// Создаем экземпляр сервера
const server = new BrainstormingServer();

// Тестовые данные
const testCases = [
    {
        name: 'Create New Session',
        input: {
            topic: 'Оптимизация производительности веб-приложения',
            phase: 'preparation'
        }
    },
    {
        name: 'Continue Session - Ideation Phase',
        input: {
            sessionId: 'test-session-id', // Будет заменено на реальный ID из первого теста
            phase: 'ideation'
        }
    },
    {
        name: 'Add New Idea',
        input: {
            sessionId: 'test-session-id', // Будет заменено на реальный ID из первого теста
            newIdea: 'Использовать кэширование на стороне клиента'
        }
    },
    {
        name: 'Clarification Phase',
        input: {
            sessionId: 'test-session-id', // Будет заменено на реальный ID из первого теста
            phase: 'clarification',
            categorizeIdea: {
                ideaId: 'idea-id', // Будет заменено на реальный ID идеи
                category: 'Кэширование'
            }
        }
    },
    {
        name: 'Evaluation Phase',
        input: {
            sessionId: 'test-session-id', // Будет заменено на реальный ID из первого теста
            phase: 'evaluation',
            voteForIdea: 'idea-id' // Будет заменено на реальный ID идеи
        }
    },
    {
        name: 'Selection Phase',
        input: {
            sessionId: 'test-session-id', // Будет заменено на реальный ID из первого теста
            phase: 'selection'
        }
    },
    {
        name: 'Action Planning Phase',
        input: {
            sessionId: 'test-session-id', // Будет заменено на реальный ID из первого теста
            phase: 'action_planning'
        }
    },
    {
        name: 'Invalid Input - Missing Topic',
        input: {
            phase: 'preparation'
        }
    },
    {
        name: 'Invalid Input - Invalid Phase',
        input: {
            topic: 'Тестовая тема',
            phase: 'invalid_phase'
        }
    },
    {
        name: 'Edge Case - Special Characters',
        input: {
            topic: 'Специальные символы: `~!@#$%^&*()_+-=[]{}|;:\'",.<>/?\n\nМногострочный\nтекст\nс переносами строк',
            phase: 'preparation'
        }
    }
];

// Запускаем тесты
console.log('=== Testing Brainstorming Tool ===\n');

let sessionId = null;
let ideaId = null;

for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n--- Test: ${testCase.name} ---`);

    // Заменяем placeholder на реальный sessionId, если он уже получен
    if (sessionId && testCase.input.sessionId === 'test-session-id') {
        testCase.input.sessionId = sessionId;
    }

    // Заменяем placeholder на реальный ideaId, если он уже получен
    if (ideaId) {
        if (testCase.input.voteForIdea === 'idea-id') {
            testCase.input.voteForIdea = ideaId;
        }
        if (testCase.input.categorizeIdea && testCase.input.categorizeIdea.ideaId === 'idea-id') {
            testCase.input.categorizeIdea.ideaId = ideaId;
        }
    }

    console.log(`Input: ${JSON.stringify(testCase.input, null, 2)}`);

    try {
        const result = server.processBrainstorming(testCase.input);
        console.log('Status: Success');

        // Проверяем, есть ли ошибка в ответе
        if (result.isError) {
            console.log('Response contains error:');
            const responseObj = JSON.parse(result.content[0].text);
            console.log(`Error: ${responseObj.error}`);
            console.log(`Status: ${responseObj.status}`);
        } else {
            console.log('Response:');
            // Выводим только первые 200 символов ответа для краткости
            const responseText = result.content[0].text;
            console.log(`${responseText.substring(0, 200)}... (truncated)`);

            // Сохраняем sessionId из первого успешного теста
            if (i === 0) {
                const responseObj = JSON.parse(result.content[0].text);
                sessionId = responseObj.sessionId;
                console.log(`Captured sessionId: ${sessionId}`);
            }

            // Сохраняем ideaId из теста добавления идеи
            if (i === 2 && testCase.name === 'Add New Idea') {
                // Здесь мы не можем получить ideaId из ответа, так как он не включен в ответ
                // В реальном сценарии нужно было бы получить его из сессии
                // Для тестов просто создадим фиктивный ID
                ideaId = 'test-idea-id';
                console.log(`Using test ideaId: ${ideaId}`);
            }
        }
    } catch (error) {
        console.log('Status: Exception thrown');
        console.log(`Error: ${error.message}`);
    }

    console.log('----------------------------');
}

console.log('\n=== Test Complete ==='); 