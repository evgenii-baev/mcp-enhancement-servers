#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки работы инструмента sequential_thinking
 * 
 * Этот скрипт эмулирует вызов инструмента sequential_thinking и выводит результат
 * Запуск: node test-sequential-thinking.js
 */

import { SequentialThinkingServer } from './src/servers/sequential-thinking-server.js';

// Создаем экземпляр сервера
const server = new SequentialThinkingServer();

// Тестовые данные
const testCases = [
    {
        name: 'First Thought',
        input: {
            thought: 'Начинаем анализ проблемы: приложение работает медленно',
            thoughtNumber: 1,
            totalThoughts: 5,
            nextThoughtNeeded: true
        }
    },
    {
        name: 'Second Thought',
        input: {
            thought: 'Изучаем логи и находим много обращений к базе данных',
            thoughtNumber: 2,
            totalThoughts: 5,
            nextThoughtNeeded: true
        }
    },
    {
        name: 'Revision of First Thought',
        input: {
            thought: 'Пересматриваем исходную проблему: медленная работа связана с БД',
            thoughtNumber: 3,
            totalThoughts: 5,
            nextThoughtNeeded: true,
            isRevision: true,
            revisesThought: 1
        }
    },
    {
        name: 'Branch Thought',
        input: {
            thought: 'Альтернативный подход: может проблема в сетевом соединении?',
            thoughtNumber: 4,
            totalThoughts: 5,
            nextThoughtNeeded: true,
            branchFromThought: 3,
            branchId: 'network-alternative'
        }
    },
    {
        name: 'Final Thought',
        input: {
            thought: 'Заключение: необходимо оптимизировать запросы к базе данных',
            thoughtNumber: 5,
            totalThoughts: 5,
            nextThoughtNeeded: false
        }
    },
    {
        name: 'Invalid Input - Missing Required Properties',
        input: {
            thought: 'Неполные данные'
            // thoughtNumber: отсутствует
            // totalThoughts: отсутствует
            // nextThoughtNeeded: отсутствует
        }
    },
    {
        name: 'Invalid Input - Wrong Types',
        input: {
            thought: 'Некорректные типы данных',
            thoughtNumber: 'один', // должно быть число
            totalThoughts: 5,
            nextThoughtNeeded: true
        }
    },
    {
        name: 'Edge Case - Many Special Characters',
        input: {
            thought: 'Специальные символы: `~!@#$%^&*()_+-=[]{}|;:\'",.<>/?\n\nМногострочный\nтекст\nс переносами строк',
            thoughtNumber: 6,
            totalThoughts: 6,
            nextThoughtNeeded: false
        }
    }
];

// Запускаем тесты
console.log('=== Testing Sequential Thinking Tool ===\n');

for (const testCase of testCases) {
    console.log(`\n--- Test: ${testCase.name} ---`);
    console.log(`Input: ${JSON.stringify(testCase.input, null, 2)}`);

    try {
        const result = server.processThought(testCase.input);
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
        }
    } catch (error) {
        console.log('Status: Exception thrown');
        console.log(`Error: ${error.message}`);
    }

    console.log('----------------------------');
}

console.log('\n=== Test Complete ==='); 