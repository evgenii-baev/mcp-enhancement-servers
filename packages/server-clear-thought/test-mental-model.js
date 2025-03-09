#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки работы инструмента mental_model
 * 
 * Этот скрипт эмулирует вызов инструмента mental_model и выводит результат
 * Запуск: node test-mental-model.js
 */

import { MentalModelServer } from './src/servers/mental-model-server.js';

// Создаем экземпляр сервера
const server = new MentalModelServer();

// Тестовые данные
const testCases = [
    {
        name: 'First Principles',
        input: {
            modelName: 'first_principles',
            problem: 'Our application is slow and users are complaining'
        }
    },
    {
        name: 'Occams Razor',
        input: {
            modelName: 'occams_razor',
            problem: 'The system crashes randomly during peak hours'
        }
    },
    {
        name: 'Systems Thinking',
        input: {
            modelName: 'systems_thinking',
            problem: 'Our microservices architecture is becoming difficult to maintain'
        }
    },
    {
        name: 'Invalid Model',
        input: {
            modelName: 'non_existent_model',
            problem: 'This should fail gracefully'
        }
    },
    {
        name: 'Missing Problem',
        input: {
            modelName: 'first_principles'
        }
    }
];

// Запускаем тесты
console.log('=== Testing Mental Model Tool ===\n');

for (const testCase of testCases) {
    console.log(`\n--- Test: ${testCase.name} ---`);
    console.log(`Input: ${JSON.stringify(testCase.input, null, 2)}`);

    try {
        const result = server.processModel(testCase.input);
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