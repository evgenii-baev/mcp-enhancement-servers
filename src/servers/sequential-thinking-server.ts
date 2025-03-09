/**
 * SequentialThinkingServer - сервер для последовательного мышления
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './index.js';
import { SEQUENTIAL_THINKING_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';

/**
 * Сервер для последовательного мышления
 */
export class SequentialThinkingServer extends BaseServer {
    constructor() {
        super('sequential-thinking-server', '1.0.0', [
            {
                name: 'process_sequential_thought',
                description: 'Processes a sequential thought',
                parameters: createParameters(
                    [
                        'thought', 'thoughtNumber', 'totalThoughts', 'nextThoughtNeeded',
                        'branchFromThought', 'branchId', 'revisesThought', 'isRevision', 'needsMoreThoughts'
                    ],
                    SEQUENTIAL_THINKING_PARAM_DESCRIPTIONS,
                    {
                        thought: 'string',
                        thoughtNumber: 'number',
                        totalThoughts: 'number',
                        nextThoughtNeeded: 'boolean',
                        branchFromThought: 'number',
                        branchId: 'string',
                        revisesThought: 'number',
                        isRevision: 'boolean',
                        needsMoreThoughts: 'boolean'
                    },
                    ['thought', 'thoughtNumber', 'totalThoughts'] // Обязательные параметры
                )
            }
        ]);
    }

    // Переопределение метода обработки запросов для последовательного мышления
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'process_sequential_thought') {
            const {
                thought, thoughtNumber, totalThoughts, nextThoughtNeeded,
                branchFromThought, branchId, revisesThought, isRevision, needsMoreThoughts
            } = request.parameters;

            // Валидация обязательных параметров
            if (!thought || thought.trim() === '') {
                return {
                    success: false,
                    error: 'Thought content is required'
                };
            }

            if (typeof thoughtNumber !== 'number' || thoughtNumber < 1) {
                return {
                    success: false,
                    error: 'Thought number must be a positive integer'
                };
            }

            if (typeof totalThoughts !== 'number' || totalThoughts < 1) {
                return {
                    success: false,
                    error: 'Total thoughts must be a positive integer'
                };
            }

            // Заглушка для обработки последовательного мышления
            return {
                success: true,
                data: {
                    processedThought: {
                        content: thought,
                        number: thoughtNumber,
                        total: totalThoughts,
                        needsMore: nextThoughtNeeded ?? (thoughtNumber < totalThoughts),
                        branch: branchId || 'main',
                        isRevision: isRevision || false,
                        revisesThought: revisesThought || null
                    },
                    status: nextThoughtNeeded ? 'in_progress' : 'completed',
                    suggestedNextSteps: nextThoughtNeeded ? [
                        'Continue with the next thought',
                        'Explore alternative branches if needed',
                        'Revise previous thoughts if new insights emerge'
                    ] : [
                        'Review the complete thought sequence',
                        'Extract key insights and conclusions',
                        'Apply the derived approach to the problem'
                    ],
                    timestamp: new Date().toISOString()
                }
            };
        }

        return {
            success: false,
            error: `Capability '${request.capability}' not supported`
        };
    }
} 