import { ToolInteractionAPI } from './tool-interaction-api.js';
import { ToolRegistry } from './tool-registry.js';
import { ThoughtRouter } from './thought-router.js';
import { IncorporationSystem } from './incorporation-system.js';
import { ThinkingLevel } from '../interfaces/tool-metadata.js';

// Fix the implicit any type for inc parameter
historyItem.incorporatedResults = incorporationResult.incorporations.map((inc: any) => ({
    // ... existing code ...
})); 