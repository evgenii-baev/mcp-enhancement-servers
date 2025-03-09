#!/usr/bin/env node

/**
 * Entry point script for starting the AI Integration Server
 */

import { startAiIntegrationServer } from './server';

// Display server information
console.log('MCP AI Integration Server');
console.log('=======================');
console.log('This server provides enhanced tool descriptions and recommendations');
console.log('for AI assistants to better utilize MCP Mental Models tools.');
console.log('');
console.log('Available tools:');
console.log('  - ai_tool_recommendation: Recommends appropriate tools based on context');
console.log('  - get_tool_description: Provides detailed information about a specific tool');
console.log('  - get_all_tool_descriptions: Lists all available tools with descriptions');
console.log('');

// Start the server
startAiIntegrationServer(); 