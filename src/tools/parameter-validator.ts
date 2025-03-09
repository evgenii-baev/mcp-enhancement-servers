/**
 * Утилита для проверки описаний параметров инструментов
 */

import { servers } from '../../index.js';
import { validateParameterDescriptions } from '../interfaces/tool-description.js';
import { ServerCapability } from '../interfaces/server-interfaces.js';

/**
 * Проверяет все серверы и их инструменты на наличие описаний параметров
 * @returns Отчет о проверке описаний параметров
 */
export function validateAllToolParameters(): {
    serverName: string;
    capability: string;
    valid: boolean;
    missingDescriptions: string[]
}[] {
    const results: {
        serverName: string;
        capability: string;
        valid: boolean;
        missingDescriptions: string[]
    }[] = [];

    // Перебираем все серверы
    for (const [serverKey, server] of Object.entries(servers)) {
        // Перебираем все возможности сервера
        for (const capability of server.capabilities) {
            if (capability.parameters) {
                // Проверяем описания параметров
                const validationResult = validateParameterDescriptions(capability.parameters);

                results.push({
                    serverName: server.name,
                    capability: capability.name,
                    valid: validationResult.valid,
                    missingDescriptions: validationResult.missingDescriptions
                });
            }
        }
    }

    return results;
}

/**
 * Возвращает статистику по валидации параметров инструментов
 * @returns Статистика по валидации
 */
export function getParameterValidationStats(): {
    totalTools: number;
    toolsWithValidParameters: number;
    toolsWithMissingDescriptions: number;
    missingDescriptionsCount: number;
} {
    const results = validateAllToolParameters();

    return {
        totalTools: results.length,
        toolsWithValidParameters: results.filter(r => r.valid).length,
        toolsWithMissingDescriptions: results.filter(r => !r.valid).length,
        missingDescriptionsCount: results.reduce((sum, r) => sum + r.missingDescriptions.length, 0)
    };
}

// Выполняем проверку при импорте модуля
const validationResults = validateAllToolParameters();
const stats = getParameterValidationStats();

// Выводим статистику
console.log('== Tool Parameter Description Validation ==');
console.log(`Total tools: ${stats.totalTools}`);
console.log(`Tools with valid parameters: ${stats.toolsWithValidParameters}`);
console.log(`Tools with missing descriptions: ${stats.toolsWithMissingDescriptions}`);
console.log(`Total missing descriptions: ${stats.missingDescriptionsCount}`);
console.log('==========================================');

// Выводим детали по инструментам с отсутствующими описаниями
if (stats.toolsWithMissingDescriptions > 0) {
    console.log('\nTools with missing parameter descriptions:');
    validationResults
        .filter(r => !r.valid)
        .forEach(r => {
            console.log(`\n${r.serverName} / ${r.capability}`);
            console.log(`Missing descriptions for parameters: ${r.missingDescriptions.join(', ')}`);
        });
} 