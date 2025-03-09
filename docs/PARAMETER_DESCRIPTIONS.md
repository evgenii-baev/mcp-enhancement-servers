# Tool Parameter Descriptions

This document explains how to ensure that all tool parameters have proper descriptions for better AI assistant integration.

## Why Parameter Descriptions Matter

When AI assistants interact with MCP tools, they need to understand:

1. What each parameter does
2. What format or values are expected
3. Which parameters are required vs. optional
4. How the parameters relate to each other

Without clear descriptions, AI assistants may:
- Misuse tools by providing invalid parameters
- Avoid using tools they don't fully understand
- Provide inadequate guidance to users

## Validation Tools

We provide utilities to validate and fix parameter descriptions:

### Checking Parameter Descriptions

The parameter validator checks all tools for missing descriptions:

```bash
# Build the project first
npm run build

# Run the parameter validator
npm run validate:params
```

This will output:
- Total number of tools analyzed
- Number of tools with valid parameter descriptions
- Number of tools with missing descriptions
- List of specific tools and parameters that need descriptions

### Fixing Parameter Descriptions

To automatically fix missing parameter descriptions:

```bash
# Build the project first
npm run build

# Run the parameter fixer
npm run fix:params
```

This will:
1. Identify tools with missing parameter descriptions
2. Apply predefined description templates where possible
3. Generate generic descriptions for parameters without templates
4. Validate that all descriptions have been fixed

## Parameter Description Standards

When writing parameter descriptions:

1. **Be clear and concise**: Explain what the parameter does in 1-2 sentences
2. **Include expected values**: If applicable, list expected value ranges or formats
3. **Note requirements**: Indicate if the parameter is required or optional
4. **Provide context**: Explain how the parameter relates to the tool's operation
5. **Use examples**: When helpful, include example values

Example of a good parameter description:
```json
"complexity": {
  "type": "string",
  "required": false,
  "description": "Assessment of problem difficulty on a scale from low to high. This helps calibrate the sophistication level of the recommended models."
}
```

## Adding New Parameters

When adding new parameters to tools:

1. Always include a descriptive `description` field
2. Add the parameter and its description template to `descriptionTemplates` in `src/tools/fix-parameter-descriptions.ts`
3. Run validation to ensure all parameters have descriptions

## Troubleshooting

If the automatic fixer doesn't resolve all issues:

1. Check for nested parameters that might not be detected
2. Ensure parameter objects have the correct structure
3. Update the validator if you have custom parameter formats 