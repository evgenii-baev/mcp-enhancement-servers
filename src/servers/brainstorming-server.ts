/**
 * BrainstormingServer - сервер для сессий мозгового штурма
 */

import { ServerRequest, ServerResponse } from '../interfaces/server-interfaces.js';
import { BaseServer } from './index.js';
import { BRAINSTORMING_PARAM_DESCRIPTIONS } from '../interfaces/parameter-descriptions.js';
import { createParameters } from '../utils/parameter-utils.js';

/**
 * Интерфейс для идеи в мозговом штурме
 */
interface BrainstormingIdea {
    id: string;
    text: string;
    category?: string;
    votes: number;
    selected: boolean;
    actions: string[];
}

/**
 * Интерфейс для сессии мозгового штурма
 */
interface BrainstormingSession {
    id: string;
    topic: string;
    phase: string;
    participants: string[];
    ideas: BrainstormingIdea[];
    currentStep: number;
    totalSteps: number;
    createdAt: string;
    updatedAt: string;
}

// Хранилище сессий мозгового штурма (в памяти)
const sessions: Record<string, BrainstormingSession> = {};

/**
 * Сервер для сессий мозгового штурма
 */
export class BrainstormingServer extends BaseServer {
    constructor() {
        super('brainstorming-server', '1.0.0', [
            {
                name: 'start_brainstorming',
                description: 'Starts a brainstorming session',
                parameters: createParameters(
                    ['topic', 'phase', 'participants'],
                    BRAINSTORMING_PARAM_DESCRIPTIONS,
                    {
                        topic: 'string',
                        phase: 'string',
                        participants: 'stringArray'
                    },
                    ['topic', 'phase'] // Обязательные параметры
                )
            },
            {
                name: 'continue_brainstorming',
                description: 'Continues an existing brainstorming session',
                parameters: createParameters(
                    [
                        'sessionId', 'phase', 'newIdea', 'category', 'ideaId',
                        'voteForIdea', 'selectIdea', 'action'
                    ],
                    BRAINSTORMING_PARAM_DESCRIPTIONS,
                    {
                        sessionId: 'string',
                        phase: 'string',
                        newIdea: 'string',
                        category: 'string',
                        ideaId: 'string',
                        voteForIdea: 'string',
                        selectIdea: 'string',
                        action: 'string'
                    },
                    ['sessionId', 'phase'] // Обязательные параметры
                )
            }
        ]);
    }

    // Переопределение метода обработки запросов для мозгового штурма
    async handleRequest(request: ServerRequest): Promise<ServerResponse> {
        if (request.capability === 'start_brainstorming') {
            const { topic, phase, participants = [] } = request.parameters;

            // Валидация обязательных параметров
            if (!topic || topic.trim() === '') {
                return {
                    success: false,
                    error: 'Topic is required for starting a brainstorming session'
                };
            }

            if (!phase || phase.trim() === '') {
                return {
                    success: false,
                    error: 'Phase is required for starting a brainstorming session'
                };
            }

            // Создание новой сессии
            const sessionId = `brainstorm-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            const timestamp = new Date().toISOString();

            sessions[sessionId] = {
                id: sessionId,
                topic,
                phase,
                participants,
                ideas: [],
                currentStep: 1,
                totalSteps: phase === 'preparation' ? 3 : (phase === 'ideation' ? 5 : 2),
                createdAt: timestamp,
                updatedAt: timestamp
            };

            return {
                success: true,
                data: {
                    session: sessions[sessionId],
                    nextSteps: this.getNextSteps(phase),
                    timestamp
                }
            };
        } else if (request.capability === 'continue_brainstorming') {
            const {
                sessionId, phase, newIdea, category,
                ideaId, voteForIdea, selectIdea, action
            } = request.parameters;

            // Валидация обязательных параметров
            if (!sessionId || !sessions[sessionId]) {
                return {
                    success: false,
                    error: 'Valid session ID is required'
                };
            }

            const session = sessions[sessionId];
            session.phase = phase;
            session.updatedAt = new Date().toISOString();

            // Обработка действий в зависимости от фазы
            if (phase === 'ideation' && newIdea) {
                // Добавление новой идеи
                const idea: BrainstormingIdea = {
                    id: `idea-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
                    text: newIdea,
                    votes: 0,
                    selected: false,
                    actions: []
                };

                session.ideas.push(idea);
            } else if (phase === 'clarification' && ideaId && category) {
                // Категоризация идеи
                const idea = session.ideas.find(i => i.id === ideaId);
                if (idea) {
                    idea.category = category;
                }
            } else if (phase === 'evaluation' && voteForIdea) {
                // Голосование за идею
                const idea = session.ideas.find(i => i.id === voteForIdea);
                if (idea) {
                    idea.votes += 1;
                }
            } else if (phase === 'selection' && selectIdea) {
                // Выбор идеи для реализации
                const idea = session.ideas.find(i => i.id === selectIdea);
                if (idea) {
                    idea.selected = true;
                }
            } else if (phase === 'action_planning' && ideaId && action) {
                // Добавление действия к идее
                const idea = session.ideas.find(i => i.id === ideaId);
                if (idea) {
                    idea.actions.push(action);
                }
            }

            return {
                success: true,
                data: {
                    session,
                    nextSteps: this.getNextSteps(phase),
                    timestamp: session.updatedAt
                }
            };
        }

        return {
            success: false,
            error: `Capability '${request.capability}' not supported`
        };
    }

    // Вспомогательный метод для получения следующих шагов
    private getNextSteps(phase: string): string[] {
        switch (phase) {
            case 'preparation':
                return [
                    'Define the problem or opportunity clearly',
                    'Set the scope and desired outcomes',
                    'Move to ideation phase when ready'
                ];
            case 'ideation':
                return [
                    'Generate as many ideas as possible',
                    'Focus on quantity over quality at this stage',
                    'Avoid judgment or criticism of ideas',
                    'Build on others\' ideas',
                    'Move to clarification phase when idea generation slows'
                ];
            case 'clarification':
                return [
                    'Group similar ideas into categories',
                    'Clarify any ideas that are ambiguous',
                    'Remove duplicates',
                    'Move to evaluation phase when ideas are organized'
                ];
            case 'evaluation':
                return [
                    'Vote on the most promising ideas',
                    'Assess feasibility and impact',
                    'Move to selection phase after voting'
                ];
            case 'selection':
                return [
                    'Select ideas for implementation based on votes and criteria',
                    'Move to action planning phase for selected ideas'
                ];
            case 'action_planning':
                return [
                    'Define specific actions for implementing selected ideas',
                    'Assign responsibilities',
                    'Set timelines',
                    'Determine how to measure success'
                ];
            default:
                return [
                    'Choose a phase to proceed',
                    'Start with preparation if unsure'
                ];
        }
    }
} 