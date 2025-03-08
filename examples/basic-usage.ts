/**
 * Пример базового использования серверов улучшения мышления
 */

import {
    servers,
    handleServerRequest,
    getAllCapabilities,
    MentalModelServer,
    SequentialThinkingServer
} from '../index';

// Асинхронная функция для демонстрации использования
async function demonstrateServers() {
    try {
        // Получение всех возможностей серверов
        console.log('Getting all server capabilities...');
        const capabilities = getAllCapabilities();
        console.log('Available capabilities:');
        Object.entries(capabilities).forEach(([serverName, serverCapabilities]) => {
            console.log(`\n${serverName}:`);
            serverCapabilities.forEach(cap => {
                console.log(`  - ${cap.name}: ${cap.description}`);
            });
        });

        // Использование сервера ментальных моделей
        console.log('\n\nUsing Mental Model Server...');
        const mentalModelResponse = await handleServerRequest(
            'mentalModelServer',
            'apply_mental_model',
            {
                modelName: 'first_principles',
                problem: 'How to optimize a web application'
            }
        );
        console.log('Mental Model Response:');
        console.log(JSON.stringify(mentalModelResponse, null, 2));

        // Использование сервера последовательного мышления
        console.log('\n\nUsing Sequential Thinking Server...');
        const sequentialThinkingResponse = await handleServerRequest(
            'sequentialThinkingServer',
            'process_sequential_thought',
            {
                thought: 'The application is slow due to inefficient database queries',
                thoughtNumber: 1,
                totalThoughts: 3
            }
        );
        console.log('Sequential Thinking Response:');
        console.log(JSON.stringify(sequentialThinkingResponse, null, 2));

        // Использование сервера отладки
        console.log('\n\nUsing Debugging Approach Server...');
        const debuggingResponse = await handleServerRequest(
            'debuggingApproachServer',
            'apply_debugging_approach',
            {
                approachName: 'binary_search',
                issue: 'Performance regression in the latest release'
            }
        );
        console.log('Debugging Response:');
        console.log(JSON.stringify(debuggingResponse, null, 2));

        // Создание собственного экземпляра сервера
        console.log('\n\nCreating custom server instance...');
        const customMentalModelServer = new MentalModelServer();
        const customResponse = await customMentalModelServer.handleRequest({
            capability: 'apply_mental_model',
            parameters: {
                modelName: 'systems_thinking',
                problem: 'Understanding complex user interactions'
            }
        });
        console.log('Custom Server Response:');
        console.log(JSON.stringify(customResponse, null, 2));

    } catch (error) {
        console.error('Error demonstrating servers:', error);
    }
}

// Запуск демонстрации
demonstrateServers().then(() => {
    console.log('\nDemonstration completed successfully!');
}).catch(error => {
    console.error('Demonstration failed:', error);
}); 