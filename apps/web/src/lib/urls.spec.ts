import { getAppUrl, getLandingUrl } from './urls';

describe('Web URLs Helper', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getAppUrl', () => {
    it('should return relative path when NEXT_PUBLIC_APP_URL is not set', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;

      expect(getAppUrl()).toBe('/');
      expect(getAppUrl('/overview')).toBe('/overview');
      expect(getAppUrl('dashboard')).toBe('/dashboard');
    });

    it('should prepend absolute URL origin when NEXT_PUBLIC_APP_URL is configured', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://app.kanbanex.com';

      expect(getAppUrl('/overview')).toBe('https://app.kanbanex.com/overview');
      expect(getAppUrl('dashboard')).toBe('https://app.kanbanex.com/dashboard');
    });

    it('should avoid trailing double slashes when origin ends with slash', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://app.kanbanex.com/';

      expect(getAppUrl('/projects')).toBe('https://app.kanbanex.com/projects');
    });
  });

  describe('getLandingUrl', () => {
    it('should return relative path when NEXT_PUBLIC_LANDING_URL is not set', () => {
      delete process.env.NEXT_PUBLIC_LANDING_URL;

      expect(getLandingUrl()).toBe('/');
      expect(getLandingUrl('/pricing')).toBe('/pricing');
      expect(getLandingUrl('legal/privacy')).toBe('/legal/privacy');
    });

    it('should prepend absolute URL origin when NEXT_PUBLIC_LANDING_URL is configured', () => {
      process.env.NEXT_PUBLIC_LANDING_URL = 'https://kanbanex.com';

      expect(getLandingUrl('/pricing')).toBe('https://kanbanex.com/pricing');
    });
  });
});
