import { cn, formatFCFA, formatDate, formatDateTime } from './utils';

describe('Web Utility Functions', () => {
  describe('cn (Tailwind class merging)', () => {
    it('should correctly concatenate and deduplicate conflicting Tailwind classes', () => {
      const result = cn('px-4 py-2', 'bg-blue-500', 'px-6', false && 'hidden', undefined);
      expect(result).toBe('py-2 bg-blue-500 px-6');
    });

    it('should handle conditional class objects and expressions', () => {
      const isActive = true;
      const isPending = false;
      const result = cn('text-sm', {
        'text-orange-500 font-bold': isActive,
        'opacity-50': isPending,
      });
      expect(result).toContain('text-orange-500');
      expect(result).toContain('font-bold');
      expect(result).not.toContain('opacity-50');
    });
  });

  describe('formatFCFA', () => {
    it('should format FCFA currency with appropriate thousands separator and suffix', () => {
      const formattedFree = formatFCFA(0);
      expect(formattedFree).toMatch(/0\s*FCFA/);

      const formattedEclosion = formatFCFA(5000);
      expect(formattedEclosion).toMatch(/5[\s\u202F]000\s*FCFA/);

      const formattedExpansion = formatFCFA(15000);
      expect(formattedExpansion).toMatch(/15[\s\u202F]000\s*FCFA/);
    });
  });

  describe('formatDate', () => {
    it('should return empty string for null, undefined or empty input', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('should format valid ISO date strings in French locale', () => {
      const date = new Date('2026-10-10T12:00:00.000Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/10/);
      expect(formatted).toMatch(/2026/);
    });
  });

  describe('formatDateTime', () => {
    it('should return empty string for null, undefined or empty input', () => {
      expect(formatDateTime(null)).toBe('');
      expect(formatDateTime(undefined)).toBe('');
      expect(formatDateTime('')).toBe('');
    });

    it('should include day, month, and time in French locale', () => {
      const date = new Date('2026-10-10T14:30:00.000Z');
      const formatted = formatDateTime(date);
      expect(formatted).toBeTruthy();
      expect(formatted).toMatch(/10\s*oct/i);
    });
  });
});
