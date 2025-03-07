import { FeatureAnalyzer, FeatureAnalysisParams, RequirementType, RequirementPriority } from '../index.js';

describe('FeatureAnalyzer', () => {
    let analyzer: FeatureAnalyzer;

    beforeEach(() => {
        analyzer = new FeatureAnalyzer();
    });

    test('should create an instance', () => {
        expect(analyzer).toBeInstanceOf(FeatureAnalyzer);
    });

    test('should analyze feature with basic parameters', async () => {
        const params: FeatureAnalysisParams = {
            featureId: 'test-feature-1',
            featureTitle: 'Test Feature',
            featureDescription: 'This is a test feature for unit testing',
            additionalRequirements: [
                'The feature should be responsive',
                'The feature should be accessible'
            ]
        };

        const result = await analyzer.analyzeFeature(params);

        // Проверка базовых свойств результата
        expect(result).toBeDefined();
        expect(result.featureId).toBe(params.featureId);
        expect(result.requirements.length).toBeGreaterThanOrEqual(3); // 1 из описания + 2 дополнительных
        expect(result.dependencies).toBeDefined();
        expect(result.complexity).toBeDefined();
        expect(result.overallComplexity).toBeGreaterThan(0);
        expect(result.technicalSpecification).toBeDefined();
    });

    test('should check for contradictions in requirements', async () => {
        const requirements = [
            {
                id: 'req_1',
                description: 'The system should be fast',
                type: RequirementType.PERFORMANCE,
                priority: RequirementPriority.HIGH
            },
            {
                id: 'req_2',
                description: 'The system should be comprehensive',
                type: RequirementType.FUNCTIONAL,
                priority: RequirementPriority.MEDIUM
            }
        ];

        const result = await analyzer.checkForContradictions(requirements);
        expect(result).toBeDefined();
        expect(typeof result.conflictsFound).toBe('boolean');
    });

    test('should estimate complexity of requirements', async () => {
        const requirements = [
            {
                id: 'req_1',
                description: 'The system should be fast',
                type: RequirementType.PERFORMANCE,
                priority: RequirementPriority.HIGH
            },
            {
                id: 'req_2',
                description: 'The system should be comprehensive',
                type: RequirementType.FUNCTIONAL,
                priority: RequirementPriority.MEDIUM
            }
        ];

        const result = await analyzer.estimateComplexity(requirements);
        expect(result).toBeDefined();
        expect(result.individualComplexity.length).toBe(2);
        expect(result.overallComplexity).toBeGreaterThan(0);
        expect(result.overallComplexity).toBeLessThanOrEqual(10);
    });

    test('should generate technical specification', async () => {
        const analysisResult = {
            featureId: 'test-feature-1',
            requirements: [
                {
                    id: 'req_1',
                    description: 'The system should be fast',
                    type: RequirementType.PERFORMANCE,
                    priority: RequirementPriority.HIGH
                }
            ],
            dependencies: [],
            conflictsFounded: false,
            complexity: [
                {
                    requirementId: 'req_1',
                    score: 5,
                    factors: ['Performance requirement']
                }
            ],
            overallComplexity: 5
        };

        const result = await analyzer.generateTechnicalSpecification(analysisResult);
        expect(result).toBeDefined();
        expect(result.featureId).toBe(analysisResult.featureId);
        expect(result.components.length).toBeGreaterThan(0);
    });
}); 