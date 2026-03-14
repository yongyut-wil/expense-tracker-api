import { KeywordCategorizationService } from './keyword-categorization.service';

describe('KeywordCategorizationService', () => {
  let service: KeywordCategorizationService;

  beforeEach(() => {
    service = new KeywordCategorizationService();
  });

  it('should categorize "กินข้าว" as "Food"', () => {
    expect(service.categorize('กินข้าว')).toBe('Food');
  });

  it('should categorize "นั่ง bts" as "Transport"', () => {
    expect(service.categorize('นั่ง bts')).toBe('Transport');
  });

  it('should categorize "จ่ายค่าไฟ" as "Utilities"', () => {
    expect(service.categorize('จ่ายค่าไฟ')).toBe('Utilities');
  });

  it('should return null for unknown keywords', () => {
    expect(service.categorize('ทำบุญ')).toBe(null);
  });
});
