import { toQueryString, setTokens, getAccessToken, apiRequest } from './api';

describe('Web API Client Helper', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    setTokens(null, null);
    global.fetch = jest.fn();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  describe('toQueryString', () => {
    it('should return empty string if no params or empty object passed', () => {
      expect(toQueryString()).toBe('');
      expect(toQueryString({})).toBe('');
    });

    it('should convert key-value pairs into query string with leading ?', () => {
      const qs = toQueryString({ page: 1, search: 'growth' });
      expect(qs).toBe('?page=1&search=growth');
    });

    it('should omit undefined, null, or empty string values', () => {
      const qs = toQueryString({
        active: true,
        filter: undefined,
        query: null,
        blank: '',
        text: 'essentialism',
      });
      expect(qs).toBe('?active=true&text=essentialism');
    });
  });

  describe('Token management', () => {
    it('should set and get access token correctly', () => {
      expect(getAccessToken()).toBeNull();
      setTokens('test-jwt-access-token', 'test-refresh-token');
      expect(getAccessToken()).toBe('test-jwt-access-token');

      setTokens(null, null);
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('apiRequest', () => {
    it('should include Authorization header when token is present', async () => {
      setTokens('mocked-token-xyz', null);

      const mockResponse = { data: 'test-success' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const res = await apiRequest('/projects');
      expect(res).toEqual(mockResponse);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/projects'),
        expect.objectContaining({
          headers: expect.any(Object),
        }),
      );

      const callHeaders = (global.fetch as jest.Mock).mock.calls[0][1].headers;
      expect(callHeaders.get('Authorization')).toBe('Bearer mocked-token-xyz');
    });

    it('should throw an ApiError when response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Projet introuvable' }),
      });

      await expect(apiRequest('/projects/unknown')).rejects.toThrow('Projet introuvable');
    });
  });
});
