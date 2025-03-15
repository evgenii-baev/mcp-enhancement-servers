#!/usr/bin/env node

/**
 * Script to validate parameter descriptions for all tools
 * 
 * This script ensures that all tools have proper parameter descriptions
 * in the centralized parameter-descriptions.ts file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to read and parse TypeScript files
function readTsFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}:${colors.reset}`, error);
    return null;
  }
}

// Function to extract tool names from tool description files
function extractToolNames(content) {
  const toolNames = [];
  
  // Regular expression to match the exact pattern from the files
  // Example: export const FIRST_THOUGHT_ADVISOR_DESCRIPTION: ToolDescription = createToolDescription({
  const regex = /export\s+const\s+(\w+)_(?:TOOL_)?DESCRIPTION\s*:\s*ToolDescription\s*=/g;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    toolNames.push(name);
  }
  
  return toolNames;
}

// Function to extract parameter descriptions from parameter-descriptions.ts
function extractParameterDescriptions(content) {
  const paramDescriptionsMap = {};
  
  // Regular expression to match export const NAME_PARAM_DESCRIPTIONS = { ... };
  const regex = /export\s+const\s+(\w+)_PARAM_DESCRIPTIONS\s*=\s*{([^}]*)}/gs;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const name = match[1];
    paramDescriptionsMap[name] = true;
  }
  
  return paramDescriptionsMap;
}

// Function to extract key parameters from tool description files
function extractKeyParameters(content) {
  const keyParamsMap = {};
  
  // Regular expression to match tool name and keyParameters array
  const toolRegex = /export\s+const\s+(\w+)_(?:TOOL_)?DESCRIPTION\s*:\s*ToolDescription\s*=/g;
  
  let toolMatch;
  while ((toolMatch = toolRegex.exec(content)) !== null) {
    const toolName = toolMatch[1];
    
    // Find keyParameters arrays in the tool description
    const toolContent = content.slice(toolMatch.index);
    const endIndex = toolContent.indexOf('});');
    if (endIndex === -1) continue;
    
    const toolSection = toolContent.slice(0, endIndex);
    
    // Updated regex to match keyParameters in the capabilities section
    const capabilitiesRegex = /capabilities\s*:\s*\[([\s\S]*?)\]/g;
    let capabilitiesMatch;
    const keyParams = [];
    
    while ((capabilitiesMatch = capabilitiesRegex.exec(toolSection)) !== null) {
      const capabilitiesContent = capabilitiesMatch[1];
      
      // Find keyParameters within each capability
      const keyParamsRegex = /keyParameters\s*:\s*\[([\s\S]*?)\]/g;
      let keyParamsMatch;
      
      while ((keyParamsMatch = keyParamsRegex.exec(capabilitiesContent)) !== null) {
        const paramsStr = keyParamsMatch[1];
        // Extract parameter names from the array
        const params = paramsStr.split(',')
          .map(p => p.trim().replace(/["']/g, ''))
          .filter(p => p && p.length > 0);
        
        keyParams.push(...params);
      }
    }
    
    if (keyParams.length > 0) {
      keyParamsMap[toolName] = [...new Set(keyParams)]; // Remove duplicates
    }
  }
  
  return keyParamsMap;
}

// Main function
async function main() {
  console.log(`${colors.blue}Validating parameter descriptions for all tools...${colors.reset}\n`);
  
  // Read the centralized parameter descriptions
  const paramDescriptionsPath = path.join(rootDir, 'src', 'interfaces', 'parameter-descriptions.ts');
  const paramDescriptionsContent = readTsFile(paramDescriptionsPath);
  
  if (!paramDescriptionsContent) {
    console.error(`${colors.red}Could not read parameter descriptions file.${colors.reset}`);
    process.exit(1);
  }
  
  const paramDescriptions = extractParameterDescriptions(paramDescriptionsContent);
  console.log(`${colors.blue}Found ${Object.keys(paramDescriptions).length} parameter description objects.${colors.reset}\n`);
  
  // Read tool description files
  const toolDescriptionsDir = path.join(rootDir, 'src', 'tool-descriptions');
  const files = fs.readdirSync(toolDescriptionsDir).filter(file => 
    file.endsWith('.ts') && !file.startsWith('index')
  );
  
  let allToolsValid = true;
  const missingParamDescriptions = [];
  
  for (const file of files) {
    const filePath = path.join(toolDescriptionsDir, file);
    const content = readTsFile(filePath);
    
    if (!content) continue;
    
    // Extract tool names from the file
    const toolNames = extractToolNames(content);
    console.log(`${colors.cyan}File ${file} contains ${toolNames.length} tool descriptions:${colors.reset} ${toolNames.join(', ')}`);
    
    // Extract key parameters for each tool
    const keyParamsMap = extractKeyParameters(content);
    
    // Check if parameter descriptions exist for each tool
    for (const toolName of toolNames) {
      // Convert tool name to parameter description name
      // For example: FIRST_THOUGHT_ADVISOR_TOOL -> FIRST_THOUGHT_ADVISOR
      let paramDescName = toolName;
      if (toolName.endsWith('_TOOL')) {
        paramDescName = toolName.replace('_TOOL', '');
      }
      
      // Check if parameter descriptions exist
      if (!paramDescriptions[paramDescName]) {
        allToolsValid = false;
        missingParamDescriptions.push({
          tool: toolName,
          paramName: paramDescName,
          file,
          keyParams: keyParamsMap[toolName] || []
        });
      }
    }
  }
  
  // Report results
  if (!allToolsValid) {
    console.log(`\n${colors.red}Missing parameter descriptions for the following tools:${colors.reset}\n`);
    
    for (const missing of missingParamDescriptions) {
      console.log(`${colors.yellow}Tool: ${colors.cyan}${missing.tool}${colors.reset} (in ${missing.file})`);
      console.log(`  Parameter description name should be: ${colors.cyan}${missing.paramName}_PARAM_DESCRIPTIONS${colors.reset}`);
      
      if (missing.keyParams.length > 0) {
        console.log(`  Key parameters: ${missing.keyParams.join(', ')}`);
        console.log(`  Add to parameter-descriptions.ts:`);
        console.log(`${colors.green}export const ${missing.paramName}_PARAM_DESCRIPTIONS = {`);
        
        for (const param of missing.keyParams) {
          console.log(`    ${param}: 'Description for ${param}',`);
        }
        
        console.log(`};${colors.reset}\n`);
      } else {
        console.log(`  No key parameters found. Please check the tool description.\n`);
      }
    }
    
    process.exit(1);
  } else {
    console.log(`\n${colors.green}All tools have proper parameter descriptions!${colors.reset}`);
    process.exit(0);
  }
}

main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
}); 