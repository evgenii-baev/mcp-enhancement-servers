#!/usr/bin/env node

/**
 * Script to remove hardcoded parameter descriptions from tool description files
 * 
 * This script finds and removes hardcoded parameterDescriptions objects from
 * tool description files, relying on the automatic lookup in createToolDescription.
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

// Function to write to TypeScript files
function writeTsFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  } catch (error) {
    console.error(`${colors.red}Error writing to file ${filePath}:${colors.reset}`, error);
    return false;
  }
}

// Function to remove hardcoded parameter descriptions
function removeHardcodedDescriptions(content) {
  // Regular expression to match parameterDescriptions blocks
  // This regex matches from 'parameterDescriptions: {' to the closing '}'
  const regex = /(\s*parameterDescriptions\s*:\s*\{[^}]*\})/gs;
  
  // Replace with empty string
  const updatedContent = content.replace(regex, '');
  
  return updatedContent;
}

// Function to process a directory of tool description files
function processDirectory(dirPath) {
  console.log(`${colors.blue}Processing directory: ${dirPath}${colors.reset}`);
  
  const files = fs.readdirSync(dirPath).filter(file => 
    file.endsWith('.ts') && !file.startsWith('index')
  );
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const content = readTsFile(filePath);
    
    if (!content) continue;
    
    totalFiles++;
    
    // Check if file contains hardcoded parameter descriptions
    if (content.includes('parameterDescriptions: {')) {
      console.log(`${colors.yellow}Found hardcoded parameter descriptions in ${colors.cyan}${file}${colors.reset}`);
      
      // Remove hardcoded descriptions
      const updatedContent = removeHardcodedDescriptions(content);
      
      // Write updated content back to file
      if (writeTsFile(filePath, updatedContent)) {
        console.log(`${colors.green}Successfully removed hardcoded descriptions from ${colors.cyan}${file}${colors.reset}`);
        modifiedFiles++;
      }
    }
  }
  
  return { totalFiles, modifiedFiles };
}

// Main function
async function main() {
  console.log(`${colors.blue}Removing hardcoded parameter descriptions from tool description files...${colors.reset}\n`);
  
  // Process main src directory
  const srcDir = path.join(rootDir, 'src', 'tool-descriptions');
  const srcResults = processDirectory(srcDir);
  
  // Process packages directory
  const packagesDir = path.join(rootDir, 'packages', 'server-clear-thought', 'src', 'tool-descriptions');
  let packagesResults = { totalFiles: 0, modifiedFiles: 0 };
  
  if (fs.existsSync(packagesDir)) {
    packagesResults = processDirectory(packagesDir);
  }
  
  // Report results
  const totalFiles = srcResults.totalFiles + packagesResults.totalFiles;
  const modifiedFiles = srcResults.modifiedFiles + packagesResults.modifiedFiles;
  
  console.log(`\n${colors.blue}Summary:${colors.reset}`);
  console.log(`${colors.cyan}Total files processed:${colors.reset} ${totalFiles}`);
  console.log(`${colors.cyan}Files modified:${colors.reset} ${modifiedFiles}`);
  
  if (modifiedFiles > 0) {
    console.log(`\n${colors.green}Successfully removed hardcoded parameter descriptions from ${modifiedFiles} files.${colors.reset}`);
    console.log(`${colors.yellow}Remember to rebuild the Docker image to apply these changes.${colors.reset}`);
  } else {
    console.log(`\n${colors.green}No hardcoded parameter descriptions found. All good!${colors.reset}`);
  }
}

main().catch(error => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
}); 