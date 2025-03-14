/**
 * DebuggingApproachServer - сервер для подходов к отладке
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './base/base-server.js';
import { DEBUGGING_APPROACH_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';

/**
 * Сервер для подходов к отладке
 */
export class DebuggingApproachServer extends BaseServer {
    constructor() {
        super('debugging-approach-server', '1.0.0', [
            {
                name: 'apply_debugging_approach',
                description: 'Applies a debugging approach to an issue',
                parameters: createParameters(
                    ['approachName', 'issue', 'findings', 'steps', 'resolution'],
                    DEBUGGING_APPROACH_PARAM_DESCRIPTIONS,
                    {
                        approachName: 'string',
                        issue: 'string',
                        findings: 'string',
                        steps: 'stringArray',
                        resolution: 'string'
                    },
                    ['approachName', 'issue'] // Обязательные параметры
                )
            },
            {
                name: 'list_debugging_approaches',
                description: 'Lists all available debugging approaches'
            }
        ]);
    }

    // Переопределение метода обработки запросов для отладки
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'apply_debugging_approach') {
            // Заглушка для применения подхода к отладке
            return {
                success: true,
                data: {
                    approach: request.parameters.approachName,
                    issue: request.parameters.issue,
                    steps: request.parameters.steps || [
                        'Step 1: Identify the problem',
                        'Step 2: Isolate the source',
                        'Step 3: Fix the issue',
                        'Step 4: Test the solution'
                    ],
                    findings: request.parameters.findings || 'No findings provided yet',
                    resolution: request.parameters.resolution || 'Pending resolution',
                    timestamp: new Date().toISOString()
                }
            };
        } else if (request.capability === 'list_debugging_approaches') {
            // Заглушка для списка подходов к отладке
            return {
                success: true,
                data: {
                    approaches: [
                        'binary_search',
                        'reverse_engineering',
                        'divide_conquer',
                        'backtracking',
                        'cause_elimination',
                        'program_slicing'
                    ],
                    categories: {
                        systematic: ['binary_search', 'divide_conquer', 'cause_elimination'],
                        analytical: ['reverse_engineering', 'program_slicing'],
                        exploratory: ['backtracking']
                    },
                    timestamp: new Date().toISOString()
                }
            };
        }

        return super.handleRequest(request);
    }
} 