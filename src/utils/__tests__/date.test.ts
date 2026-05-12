import { describe, it, expect } from 'vitest';
import { formatDateTime, formatDate } from '../date';

describe('date utils', () => {
  describe('formatDateTime', () => {
    it('should format ISO string date correctly', () => {
      const result = formatDateTime('2026-04-27T10:00:00');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should format Date object correctly', () => {
      const date = new Date(2026, 3, 27, 14, 30, 0);
      const result = formatDateTime(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should handle different times of day', () => {
      const morning = formatDateTime('2026-04-27T09:00:00');
      const afternoon = formatDateTime('2026-04-27T15:30:00');
      expect(morning).not.toBe(afternoon);
    });
  });

  describe('formatDate', () => {
    it('should format ISO string date correctly', () => {
      const result = formatDate('2026-04-27');
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format Date object correctly', () => {
      const date = new Date(2026, 3, 27);
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });

    it('should format different dates consistently', () => {
      const date1 = formatDate('2026-01-01');
      const date2 = formatDate('2026-12-31');
      expect(date1).not.toBe(date2);
    });
  });
});
