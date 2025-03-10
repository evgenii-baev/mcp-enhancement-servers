#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки работы инструмента debugging_approach
 * 
 * Этот скрипт эмулирует вызов инструмента debugging_approach и выводит результат
 * Запуск: node test-debugging-approach.js
 */

import { DebuggingApproachServer } from './src/servers/debugging-approach-server.js';

// Создаем экземпляр сервера
const server = new DebuggingApproachServer();

// Тестовые данные
const testCases = [
    {
        name: 'Binary Search Approach',
        input: {
            approachName: 'binary_search',
            issue: 'Производительность приложения значительно снизилась после последнего обновления',
            steps: [
                'Определить временной диапазон, когда произошло снижение производительности',
                'Найти средний коммит в этом диапазоне и проверить производительность',
                'Сузить диапазон поиска на основе результатов',
                'Повторять, пока не будет найден проблемный коммит'
            ],
            findings: 'Обнаружено, что проблема связана с изменением в алгоритме кэширования',
            resolution: 'Оптимизирован алгоритм кэширования для уменьшения использования памяти'
        }
    },
    {
        name: 'Reverse Engineering Approach',
        input: {
            approachName: 'reverse_engineering',
            issue: 'Неизвестная ошибка в сторонней библиотеке без документации',
            steps: [
                'Анализ входных и выходных данных библиотеки',
                'Трассировка выполнения функций',
                'Создание диаграммы потока данных',
                'Воссоздание логики работы проблемного компонента'
            ],
            findings: 'Библиотека неправильно обрабатывает Unicode-символы в определенных локалях'
        }
    },
    {
        name: 'Divide and Conquer Approach',
        input: {
            approachName: 'divide_conquer',
            issue: 'Сложная система с множеством компонентов работает некорректно',
            steps: [
                'Разделить систему на логические компоненты',
                'Изолировать и протестировать каждый компонент отдельно',
                'Определить проблемные компоненты',
                'Рекурсивно применить подход к проблемным компонентам'
            ]
        }
    },
    {
        name: 'Backtracking Approach',
        input: {
            approachName: 'backtracking',
            issue: 'Необходимо найти оптимальную конфигурацию системы из множества возможных вариантов'
        }
    },
    {
        name: 'Invalid Input - Missing Required Field',
        input: {
            approachName: 'binary_search'
            // issue отсутствует
        }
    },
    {
        name: 'Invalid Input - Invalid Approach Name',
        input: {
            approachName: 'invalid_approach',
            issue: 'Тестовая проблема'
        }
    },
    {
        name: 'Edge Case - Long Text',
        input: {
            approachName: 'cause_elimination',
            issue: 'Очень длинное описание проблемы, которое может вызвать проблемы с форматированием. ' +
                'Текст должен быть достаточно длинным, чтобы проверить обработку длинных строк. ' +
                'Повторяем текст для увеличения длины. '.repeat(10),
            steps: [
                'Очень длинный шаг с подробным описанием действий, которые необходимо выполнить. '.repeat(5),
                'Еще один длинный шаг с множеством деталей и специфических инструкций. '.repeat(5)
            ],
            findings: 'Длинный текст с результатами отладки и множеством технических деталей. '.repeat(10)
        }
    },
    {
        name: 'Edge Case - Special Characters',
        input: {
            approachName: 'program_slicing',
            issue: 'Проблема с специальными символами: `~!@#$%^&*()_+-=[]{}|;:\'",.<>/?\n\nМногострочный\nтекст\nс переносами строк',
            steps: [
                'Шаг с эмодзи: 🔍 🐛 🔧 🔨 🧪 🧠',
                'Шаг с HTML: <div>test</div><script>alert("test")</script>'
            ]
        }
    }
];

// Запускаем тесты
console.log('=== Testing Debugging Approach Tool ===\n');

for (const testCase of testCases) {
    console.log(`\n--- Test: ${testCase.name} ---`);
    console.log(`Input: ${JSON.stringify(testCase.input, null, 2)}`);

    try {
        const result = server.processApproach(testCase.input);
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