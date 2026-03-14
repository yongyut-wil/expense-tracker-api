import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AICategorizationService } from './ai-categorization.service';

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockImplementation(() => {
          return {
            generateContent: jest.fn().mockResolvedValue({
              response: {
                text: () => JSON.stringify({
                  category: 'Food',
                  titleEn: 'Eating'
                }),
              },
            }),
          };
        }),
      };
    }),
  };
});

describe('AICategorizationService', () => {
  let service: AICategorizationService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AICategorizationService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<AICategorizationService>(AICategorizationService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a category and titleEn when AI responds correctly', async () => {
    const result = await service.categorize('กินข้าว');
    expect(result).toEqual({
      category: 'Food',
      titleEn: 'Eating'
    });
  });

  it('should return "Other" if AI returns an invalid category as JSON', async () => {
    // Override the mock for this specific test
    (service as any).model.generateContent.mockResolvedValueOnce({
      response: {
        text: () => JSON.stringify({
          category: 'InvalidCategory',
          titleEn: 'Random'
        }),
      },
    });

    const result = await service.categorize('random title');
    expect(result?.category).toBe('Other');
    expect(result?.titleEn).toBe('Random');
  });
});
