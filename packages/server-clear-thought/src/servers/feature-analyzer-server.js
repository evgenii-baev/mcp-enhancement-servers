/**
 * Feature Analyzer Server
 * Analyzes feature requirements and generates technical specifications
 */

/**
 * Interface for feature analyzer data
 * @typedef {Object} FeatureAnalyzerData
 * @property {string} featureName - Name of the feature to analyze
 * @property {string} [featureDescription] - Optional description of the feature
 */

/**
 * Server for analyzing features and generating technical specifications
 */
export class FeatureAnalyzerServer {
    constructor() {
        // Store analyzed features
        this.analyzedFeatures = new Map();
    }

    /**
     * Validate input data for feature analysis
     * @param {unknown} input - Raw input data
     * @returns {FeatureAnalyzerData} Validated feature analyzer data
     */
    validateAnalyzerData(input) {
        const data = input || {};

        if (!data.featureName || typeof data.featureName !== 'string') {
            throw new Error('Invalid featureName: must be a non-empty string');
        }

        return {
            featureName: data.featureName,
            featureDescription: typeof data.featureDescription === 'string' ? data.featureDescription : undefined
        };
    }

    /**
     * Analyze feature and extract requirements
     * @param {FeatureAnalyzerData} data - Feature data to analyze
     * @returns {Object} Analysis results
     */
    analyzeFeature(data) {
        const { featureName, featureDescription } = data;

        // Generate analysis based on feature name and description
        const analysis = {
            name: featureName,
            description: featureDescription || `Feature: ${featureName}`,
            generatedAt: new Date().toISOString(),
            requirements: this.extractRequirements(featureName, featureDescription),
            dependencies: this.identifyDependencies(featureName, featureDescription),
            complexity: this.assessComplexity(featureName, featureDescription),
            technicalSpecification: this.generateTechnicalSpecification(featureName, featureDescription)
        };

        // Store the analysis
        this.analyzedFeatures.set(featureName, analysis);

        return analysis;
    }

    /**
     * Extract requirements from feature information
     * @param {string} name - Feature name
     * @param {string} description - Feature description
     * @returns {Object[]} Extracted requirements
     */
    extractRequirements(name, description) {
        const requirements = [];
        const nameLower = name.toLowerCase();
        const descLower = description ? description.toLowerCase() : '';

        // Extract functional requirements
        if (descLower.includes('authentication') || nameLower.includes('auth') || nameLower.includes('login')) {
            requirements.push({
                type: 'functional',
                priority: 'high',
                description: 'User authentication mechanism',
                details: 'Secure user identification and access control'
            });
        }

        if (descLower.includes('data') || descLower.includes('storage') || descLower.includes('save')) {
            requirements.push({
                type: 'functional',
                priority: 'high',
                description: 'Data persistence',
                details: 'Ability to store and retrieve data reliably'
            });
        }

        if (descLower.includes('report') || descLower.includes('analytics') || descLower.includes('dashboard')) {
            requirements.push({
                type: 'functional',
                priority: 'medium',
                description: 'Reporting capabilities',
                details: 'Generate insights and visualizations from data'
            });
        }

        // Extract non-functional requirements
        if (descLower.includes('performance') || descLower.includes('fast') || descLower.includes('speed')) {
            requirements.push({
                type: 'non-functional',
                priority: 'high',
                description: 'Performance optimization',
                details: 'Ensure responsive user experience with minimal latency'
            });
        }

        if (descLower.includes('security') || descLower.includes('protect') || nameLower.includes('secure')) {
            requirements.push({
                type: 'non-functional',
                priority: 'high',
                description: 'Security measures',
                details: 'Protect sensitive data and prevent unauthorized access'
            });
        }

        if (descLower.includes('scale') || descLower.includes('load') || descLower.includes('traffic')) {
            requirements.push({
                type: 'non-functional',
                priority: 'medium',
                description: 'Scalability',
                details: 'Handle increasing user load and data volume'
            });
        }

        // Add generic requirements if none were identified
        if (requirements.length === 0) {
            requirements.push({
                type: 'functional',
                priority: 'medium',
                description: `Core ${name} functionality`,
                details: 'Implement the main feature capabilities'
            });

            requirements.push({
                type: 'non-functional',
                priority: 'medium',
                description: 'User experience optimization',
                details: 'Ensure the feature is intuitive and easy to use'
            });
        }

        return requirements;
    }

    /**
     * Identify potential dependencies for a feature
     * @param {string} name - Feature name
     * @param {string} description - Feature description
     * @returns {Object[]} Identified dependencies
     */
    identifyDependencies(name, description) {
        const dependencies = [];
        const nameLower = name.toLowerCase();
        const descLower = description ? description.toLowerCase() : '';

        // Check for authentication dependencies
        if (descLower.includes('authentication') || descLower.includes('login') || nameLower.includes('auth')) {
            dependencies.push({
                type: 'component',
                name: 'Authentication Service',
                criticality: 'high'
            });
        }

        // Check for data storage dependencies
        if (descLower.includes('database') || descLower.includes('storage') || descLower.includes('data')) {
            dependencies.push({
                type: 'infrastructure',
                name: 'Database System',
                criticality: 'high'
            });
        }

        // Check for API dependencies
        if (descLower.includes('api') || descLower.includes('service') || descLower.includes('endpoint')) {
            dependencies.push({
                type: 'external',
                name: 'API Services',
                criticality: 'medium'
            });
        }

        // Check for UI dependencies
        if (descLower.includes('interface') || descLower.includes('ui') || descLower.includes('display')) {
            dependencies.push({
                type: 'component',
                name: 'UI Framework',
                criticality: 'medium'
            });
        }

        // Add generic dependency if none were identified
        if (dependencies.length === 0) {
            dependencies.push({
                type: 'component',
                name: 'Core Application Infrastructure',
                criticality: 'medium'
            });
        }

        return dependencies;
    }

    /**
     * Assess complexity of feature implementation
     * @param {string} name - Feature name
     * @param {string} description - Feature description
     * @returns {Object} Complexity assessment
     */
    assessComplexity(name, description) {
        const descLower = description ? description.toLowerCase() : '';
        let score = 0;

        // Factors that increase complexity
        if (descLower.includes('authentication') || descLower.includes('security')) score += 2;
        if (descLower.includes('real-time') || descLower.includes('realtime')) score += 2;
        if (descLower.includes('scale') || descLower.includes('performance')) score += 1;
        if (descLower.includes('integration') || descLower.includes('api')) score += 1;
        if (descLower.includes('report') || descLower.includes('analytics')) score += 1;
        if (descLower.includes('complex') || descLower.includes('sophisticated')) score += 2;

        // Baseline complexity
        score += 1;

        // Map score to complexity level
        let level;
        let complexityDescription;

        if (score <= 2) {
            level = 'low';
            complexityDescription = 'Straightforward implementation with minimal dependencies';
        } else if (score <= 5) {
            level = 'medium';
            complexityDescription = 'Moderate complexity requiring careful planning';
        } else if (score <= 8) {
            level = 'high';
            complexityDescription = 'Complex implementation with significant technical challenges';
        } else {
            level = 'very high';
            complexityDescription = 'Highly complex implementation requiring specialized expertise';
        }

        return {
            level,
            description: complexityDescription,
            score,
            estimatedEffort: this.calculateEffort(score)
        };
    }

    /**
     * Calculate estimated effort based on complexity score
     * @param {number} complexityScore - Complexity score
     * @returns {Object} Effort estimation
     */
    calculateEffort(complexityScore) {
        let personDays;
        let riskLevel;

        if (complexityScore <= 2) {
            personDays = { min: 1, max: 5 };
            riskLevel = 'low';
        } else if (complexityScore <= 5) {
            personDays = { min: 5, max: 15 };
            riskLevel = 'medium';
        } else if (complexityScore <= 8) {
            personDays = { min: 15, max: 30 };
            riskLevel = 'high';
        } else {
            personDays = { min: 30, max: 60 };
            riskLevel = 'very high';
        }

        return {
            personDays,
            riskLevel
        };
    }

    /**
     * Generate technical specification for a feature
     * @param {string} name - Feature name
     * @param {string} description - Feature description
     * @returns {Object} Technical specification
     */
    generateTechnicalSpecification(name, description) {
        const nameLower = name.toLowerCase();
        const descLower = description ? description.toLowerCase() : '';

        // Identify feature type for appropriate architecture
        const isUiFeature = descLower.includes('ui') || descLower.includes('interface') || descLower.includes('display');
        const isDataFeature = descLower.includes('data') || descLower.includes('storage') || descLower.includes('database');
        const isIntegrationFeature = descLower.includes('integration') || descLower.includes('api') || descLower.includes('connect');
        const isSecurityFeature = descLower.includes('security') || descLower.includes('authentication') || nameLower.includes('auth');

        // Generate appropriate architecture
        const architecture = this.generateArchitecture(isUiFeature, isDataFeature, isIntegrationFeature, isSecurityFeature);

        // Generate data models if applicable
        const dataModels = isDataFeature ? this.generateDataModels(name) : [];

        // Generate API endpoints if applicable
        const apiEndpoints = isIntegrationFeature ? this.generateApiEndpoints(name) : [];

        // Generate UI components if applicable
        const uiComponents = isUiFeature ? this.generateUiComponents(name) : [];

        // Generate security measures if applicable
        const securityMeasures = isSecurityFeature ? this.generateSecurityMeasures() : [];

        return {
            architecture,
            dataModels,
            apiEndpoints,
            uiComponents,
            securityMeasures,
            implementationConsiderations: this.generateImplementationConsiderations(
                isUiFeature, isDataFeature, isIntegrationFeature, isSecurityFeature
            )
        };
    }

    /**
     * Generate architecture recommendation
     * @param {boolean} isUiFeature - Whether feature is UI-related
     * @param {boolean} isDataFeature - Whether feature is data-related
     * @param {boolean} isIntegrationFeature - Whether feature is integration-related
     * @param {boolean} isSecurityFeature - Whether feature is security-related
     * @returns {Object} Architecture recommendation
     */
    generateArchitecture(isUiFeature, isDataFeature, isIntegrationFeature, isSecurityFeature) {
        let pattern;
        let components = [];
        let archDescription;

        if (isUiFeature && isDataFeature) {
            pattern = 'MVC (Model-View-Controller)';
            components = ['ViewController', 'ServiceLayer', 'DataModel', 'Repository'];
            archDescription = 'Separate the UI (View) from business logic (Controller) and data (Model)';
        } else if (isIntegrationFeature) {
            pattern = 'Adapter Pattern';
            components = ['ServiceInterface', 'Adapter', 'ExternalSystemConnector'];
            archDescription = 'Use adapters to normalize interactions with external systems';
        } else if (isSecurityFeature) {
            pattern = 'Interceptor Pattern';
            components = ['SecurityInterceptor', 'AuthenticationService', 'AuthorizationService'];
            archDescription = 'Intercept requests to apply security checks before processing';
        } else if (isDataFeature) {
            pattern = 'Repository Pattern';
            components = ['Repository', 'DataModel', 'DataService'];
            archDescription = 'Abstract data storage operations behind a repository interface';
        } else if (isUiFeature) {
            pattern = 'Component-based Architecture';
            components = ['UIComponents', 'StateManager', 'EventHandlers'];
            archDescription = 'Modular UI components with clear boundaries and responsibilities';
        } else {
            pattern = 'Layered Architecture';
            components = ['PresentationLayer', 'BusinessLogicLayer', 'DataAccessLayer'];
            archDescription = 'Organize code into layers with clear separation of concerns';
        }

        return {
            pattern,
            components,
            description: archDescription
        };
    }

    /**
     * Generate data models based on feature name
     * @param {string} name - Feature name
     * @returns {Object[]} Generated data models
     */
    generateDataModels(name) {
        // Extract meaningful name for the model
        const modelName = name
            .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
            .replace(/^[a-z]/, c => c.toUpperCase());

        return [{
            name: `${modelName}Model`,
            attributes: [
                { name: 'id', type: 'string', required: true, description: 'Unique identifier' },
                { name: 'name', type: 'string', required: true, description: 'Display name' },
                { name: 'description', type: 'string', required: false, description: 'Detailed description' },
                { name: 'createdAt', type: 'datetime', required: true, description: 'Creation timestamp' },
                { name: 'updatedAt', type: 'datetime', required: true, description: 'Last update timestamp' }
            ],
            relationships: [
                { name: 'user', type: 'belongsTo', target: 'User', description: 'User who owns this entity' }
            ]
        }];
    }

    /**
     * Generate API endpoints based on feature name
     * @param {string} name - Feature name
     * @returns {Object[]} Generated API endpoints
     */
    generateApiEndpoints(name) {
        // Convert feature name to endpoint path format
        const basePath = name
            .replace(/([A-Z])/g, '-$1')
            .replace(/^-/, '')
            .toLowerCase();

        return [
            {
                method: 'GET',
                path: `/api/${basePath}`,
                description: `List all ${name} items`,
                parameters: [
                    { name: 'limit', type: 'query', dataType: 'number', description: 'Maximum number of items to return' },
                    { name: 'offset', type: 'query', dataType: 'number', description: 'Number of items to skip' }
                ],
                responses: [
                    { code: 200, description: 'Success', dataType: `${name}[]` },
                    { code: 401, description: 'Unauthorized', dataType: 'Error' },
                    { code: 500, description: 'Server Error', dataType: 'Error' }
                ]
            },
            {
                method: 'GET',
                path: `/api/${basePath}/:id`,
                description: `Get a specific ${name} item by ID`,
                parameters: [
                    { name: 'id', type: 'path', dataType: 'string', description: 'Item identifier' }
                ],
                responses: [
                    { code: 200, description: 'Success', dataType: name },
                    { code: 404, description: 'Not Found', dataType: 'Error' },
                    { code: 500, description: 'Server Error', dataType: 'Error' }
                ]
            },
            {
                method: 'POST',
                path: `/api/${basePath}`,
                description: `Create a new ${name} item`,
                parameters: [
                    { name: 'body', type: 'body', dataType: name, description: 'Item data' }
                ],
                responses: [
                    { code: 201, description: 'Created', dataType: name },
                    { code: 400, description: 'Bad Request', dataType: 'Error' },
                    { code: 401, description: 'Unauthorized', dataType: 'Error' },
                    { code: 500, description: 'Server Error', dataType: 'Error' }
                ]
            },
            {
                method: 'PUT',
                path: `/api/${basePath}/:id`,
                description: `Update an existing ${name} item`,
                parameters: [
                    { name: 'id', type: 'path', dataType: 'string', description: 'Item identifier' },
                    { name: 'body', type: 'body', dataType: name, description: 'Updated item data' }
                ],
                responses: [
                    { code: 200, description: 'Success', dataType: name },
                    { code: 400, description: 'Bad Request', dataType: 'Error' },
                    { code: 404, description: 'Not Found', dataType: 'Error' },
                    { code: 500, description: 'Server Error', dataType: 'Error' }
                ]
            },
            {
                method: 'DELETE',
                path: `/api/${basePath}/:id`,
                description: `Delete a ${name} item`,
                parameters: [
                    { name: 'id', type: 'path', dataType: 'string', description: 'Item identifier' }
                ],
                responses: [
                    { code: 204, description: 'No Content', dataType: null },
                    { code: 404, description: 'Not Found', dataType: 'Error' },
                    { code: 500, description: 'Server Error', dataType: 'Error' }
                ]
            }
        ];
    }

    /**
     * Generate UI components based on feature name
     * @param {string} name - Feature name
     * @returns {Object[]} Generated UI components
     */
    generateUiComponents(name) {
        // Extract meaningful name for components
        const componentBaseName = name
            .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
            .replace(/^[a-z]/, c => c.toUpperCase());

        return [
            {
                name: `${componentBaseName}List`,
                description: `Displays a list of ${name} items`,
                props: [
                    { name: 'items', type: 'array', required: true, description: 'Items to display' },
                    { name: 'onSelect', type: 'function', required: true, description: 'Handler for item selection' },
                    { name: 'loading', type: 'boolean', required: false, description: 'Whether data is loading' }
                ]
            },
            {
                name: `${componentBaseName}Detail`,
                description: `Displays details for a single ${name} item`,
                props: [
                    { name: 'item', type: 'object', required: true, description: 'Item to display' },
                    { name: 'onEdit', type: 'function', required: false, description: 'Handler for edit action' },
                    { name: 'onDelete', type: 'function', required: false, description: 'Handler for delete action' }
                ]
            },
            {
                name: `${componentBaseName}Form`,
                description: `Form for creating or editing a ${name} item`,
                props: [
                    { name: 'item', type: 'object', required: false, description: 'Item to edit (omit for create)' },
                    { name: 'onSubmit', type: 'function', required: true, description: 'Form submission handler' },
                    { name: 'onCancel', type: 'function', required: true, description: 'Cancel handler' }
                ]
            },
            {
                name: `${componentBaseName}Page`,
                description: `Container page for ${name} feature`,
                props: [
                    { name: 'id', type: 'string', required: false, description: 'Item ID (for detail view)' }
                ]
            }
        ];
    }

    /**
     * Generate security measures
     * @returns {Object[]} Generated security measures
     */
    generateSecurityMeasures() {
        return [
            {
                category: 'Authentication',
                measures: [
                    'Implement JWT-based authentication',
                    'Use secure HTTP-only cookies',
                    'Add CSRF protection',
                    'Implement rate limiting for login attempts'
                ]
            },
            {
                category: 'Authorization',
                measures: [
                    'Role-based access control',
                    'Fine-grained permissions',
                    'Resource ownership validation',
                    'Audit logging for sensitive operations'
                ]
            },
            {
                category: 'Data Protection',
                measures: [
                    'Encrypt sensitive data at rest',
                    'Use TLS for data in transit',
                    'Implement secure password hashing',
                    'Data validation and sanitization'
                ]
            },
            {
                category: 'Infrastructure',
                measures: [
                    'Use HTTPS exclusively',
                    'Set secure HTTP headers',
                    'Implement proper error handling',
                    'Regular security updates and patches'
                ]
            }
        ];
    }

    /**
     * Generate implementation considerations
     * @param {boolean} isUiFeature - Whether feature is UI-related
     * @param {boolean} isDataFeature - Whether feature is data-related
     * @param {boolean} isIntegrationFeature - Whether feature is integration-related
     * @param {boolean} isSecurityFeature - Whether feature is security-related
     * @returns {Object[]} Implementation considerations
     */
    generateImplementationConsiderations(isUiFeature, isDataFeature, isIntegrationFeature, isSecurityFeature) {
        const considerations = [
            {
                category: 'Testing Strategy',
                items: [
                    'Write unit tests for business logic components',
                    'Implement integration tests for critical paths',
                    'Consider property-based testing for complex algorithms',
                    'Set up CI/CD pipeline with automated testing'
                ]
            },
            {
                category: 'Performance',
                items: [
                    'Optimize database queries for data-intensive operations',
                    'Implement appropriate caching strategies',
                    'Monitor performance metrics in production',
                    'Consider pagination for large data sets'
                ]
            }
        ];

        if (isUiFeature) {
            considerations.push({
                category: 'Accessibility',
                items: [
                    'Follow WCAG 2.1 AA standards',
                    'Test with screen readers',
                    'Ensure keyboard navigation',
                    'Maintain appropriate color contrast'
                ]
            });
        }

        if (isDataFeature) {
            considerations.push({
                category: 'Data Integrity',
                items: [
                    'Implement database transactions for critical operations',
                    'Add data validation at multiple layers',
                    'Consider eventual consistency requirements',
                    'Plan for data migration strategy'
                ]
            });
        }

        if (isIntegrationFeature) {
            considerations.push({
                category: 'Fault Tolerance',
                items: [
                    'Implement retry mechanisms for transient failures',
                    'Design circuit breakers for integration points',
                    'Consider fallback mechanisms',
                    'Log detailed error information for troubleshooting'
                ]
            });
        }

        if (isSecurityFeature) {
            considerations.push({
                category: 'Security Compliance',
                items: [
                    'Review applicable regulatory requirements (GDPR, CCPA, etc.)',
                    'Schedule security code review',
                    'Plan for regular penetration testing',
                    'Document security measures for compliance'
                ]
            });
        }

        return considerations;
    }

    /**
     * Format output for display
     * @param {Object} analysis - Analysis results
     * @returns {string} Formatted string output
     */
    formatOutput(analysis) {
        const { name, description, requirements, dependencies, complexity, technicalSpecification } = analysis;

        // Calculate border width based on the longest content
        const longestLine = Math.max(
            name.length,
            description.length,
            30 // Minimum width
        );

        const border = '─'.repeat(longestLine + 4);

        let output = `
┌${border}┐
│ 🔍 Feature Analysis: ${name}${' '.repeat(Math.max(0, longestLine - name.length - 20))} │
├${border}┤
│ Description: ${description}${' '.repeat(Math.max(0, longestLine - description.length - 14))} │
├${border}┤
│ Complexity: ${complexity.level.toUpperCase()}${' '.repeat(Math.max(0, longestLine - complexity.level.length - 13))} │
│ Effort: ${complexity.estimatedEffort.personDays.min}-${complexity.estimatedEffort.personDays.max} person-days${' '.repeat(Math.max(0, longestLine - String(complexity.estimatedEffort.personDays.max).length - String(complexity.estimatedEffort.personDays.min).length - 17))} │
│ Risk Level: ${complexity.estimatedEffort.riskLevel}${' '.repeat(Math.max(0, longestLine - complexity.estimatedEffort.riskLevel.length - 13))} │
`;

        // Add requirements section
        output += `├${border}┤
│ Requirements:${' '.repeat(Math.max(0, longestLine - 14))} │
`;
        requirements.forEach(req => {
            output += `│ - [${req.priority.toUpperCase()}] ${req.description}${' '.repeat(Math.max(0, longestLine - req.description.length - req.priority.length - 7))} │\n`;
        });

        // Add dependencies section
        output += `├${border}┤
│ Dependencies:${' '.repeat(Math.max(0, longestLine - 14))} │
`;
        dependencies.forEach(dep => {
            output += `│ - [${dep.criticality.toUpperCase()}] ${dep.name}${' '.repeat(Math.max(0, longestLine - dep.name.length - dep.criticality.length - 7))} │\n`;
        });

        // Add architecture section
        const arch = technicalSpecification.architecture;
        output += `├${border}┤
│ Architecture: ${arch.pattern}${' '.repeat(Math.max(0, longestLine - arch.pattern.length - 15))} │
`;
        arch.components.forEach(comp => {
            output += `│ - Component: ${comp}${' '.repeat(Math.max(0, longestLine - comp.length - 13))} │\n`;
        });

        // Add implementation considerations
        output += `├${border}┤
│ Key Implementation Considerations:${' '.repeat(Math.max(0, longestLine - 32))} │
`;
        const considerations = technicalSpecification.implementationConsiderations;
        considerations.slice(0, 2).forEach(consideration => {
            output += `│ - ${consideration.category}: ${consideration.items[0]}${' '.repeat(Math.max(0, longestLine - consideration.items[0].length - consideration.category.length - 4))} │\n`;
        });

        output += `└${border}┘`;

        return output;
    }

    /**
     * Process feature analysis
     * @param {unknown} input - Input data
     * @returns {Object} Formatted output with content and error status
     */
    processAnalysis(input) {
        try {
            const data = this.validateAnalyzerData(input);
            const analysis = this.analyzeFeature(data);
            const formattedOutput = this.formatOutput(analysis);

            return {
                content: [{ type: 'text', text: formattedOutput }],
                isError: false
            };
        } catch (error) {
            return {
                content: [{ type: 'text', text: `Error processing feature analysis: ${error.message}` }],
                isError: true
            };
        }
    }
} 