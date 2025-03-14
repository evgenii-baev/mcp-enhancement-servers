/**
 * MentalModelServer - сервер для применения ментальных моделей к проблемам
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './base/base-server.js';
import { MENTAL_MODEL_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';
import { getAllMentalModelNames } from '../models/mental-models.js';

/**
 * Сервер для применения ментальных моделей к проблемам
 */
export class MentalModelServer extends BaseServer {
    constructor() {
        super('mental-model-server', '1.0.0', [
            {
                name: 'apply_mental_model',
                description: 'Applies a mental model to a problem',
                parameters: createParameters(
                    ['modelName', 'problem'],
                    MENTAL_MODEL_PARAM_DESCRIPTIONS,
                    {
                        modelName: 'string',
                        problem: 'string'
                    },
                    ['modelName', 'problem'] // Обязательные параметры
                )
            },
            {
                name: 'list_mental_models',
                description: 'Lists all available mental models'
            }
        ]);
    }

    // Переопределение метода обработки запросов для ментальных моделей
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'apply_mental_model') {
            // Заглушка для применения ментальной модели
            return {
                success: true,
                data: {
                    model: request.parameters.modelName,
                    problem: request.parameters.problem,
                    analysis: `Analysis of the problem using ${request.parameters.modelName}...`,
                    insights: [
                        'Key insight 1',
                        'Key insight 2',
                        'Key insight 3'
                    ],
                    recommendedApproach: 'Recommended approach based on the mental model',
                    timestamp: new Date().toISOString()
                }
            };
        } else if (request.capability === 'list_mental_models') {
            // Реальный список ментальных моделей
            return {
                success: true,
                data: {
                    models: getAllMentalModelNames(),
                    categories: {
                        thinking: ['First Principles', 'Systems Thinking', 'Second-Order Thinking'],
                        decisionMaking: ['Decision Matrix', 'Expected Value', 'Bayesian Updating'],
                        problemSolving: ['Inversion', 'Abstraction', 'Decomposition']
                    },
                    timestamp: new Date().toISOString()
                }
            };
        }

        return super.handleRequest(request);
    }
} 