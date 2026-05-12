import { describe, it, expect } from 'vitest';
import { calculatePercentage, formatPercentage, getApprovalRate } from '../voting';

describe('voting utils', () => {
  describe('calculatePercentage', () => {
    it('should return 0 for both when totalVotes is 0', () => {
      const result = calculatePercentage(0, 0, 0);
      expect(result.yes).toBe(0);
      expect(result.no).toBe(0);
    });

    it('should calculate correct percentages with votes', () => {
      const result = calculatePercentage(10, 5, 15);
      expect(result.yes).toBeCloseTo(66.67, 1);
      expect(result.no).toBeCloseTo(33.33, 1);
    });

    it('should handle 100% yes votes', () => {
      const result = calculatePercentage(10, 0, 10);
      expect(result.yes).toBe(100);
      expect(result.no).toBe(0);
    });

    it('should handle 100% no votes', () => {
      const result = calculatePercentage(0, 10, 10);
      expect(result.yes).toBe(0);
      expect(result.no).toBe(100);
    });
  });

  describe('formatPercentage', () => {
    it('should format with 1 decimal place by default', () => {
      expect(formatPercentage(66.666)).toBe('66.7');
      expect(formatPercentage(33.333)).toBe('33.3');
    });

    it('should format with specified decimal places', () => {
      expect(formatPercentage(66.666, 2)).toBe('66.67');
      expect(formatPercentage(66.666, 0)).toBe('67');
    });

    it('should handle 0 value', () => {
      expect(formatPercentage(0)).toBe('0.0');
    });

    it('should handle whole numbers', () => {
      expect(formatPercentage(100)).toBe('100.0');
      expect(formatPercentage(50, 0)).toBe('50');
    });
  });

  describe('getApprovalRate', () => {
    it('should return "0" when totalVotes is 0', () => {
      expect(getApprovalRate(0, 0)).toBe('0');
    });

    it('should calculate correct approval rate', () => {
      expect(getApprovalRate(10, 15)).toBe('66.7');
    });

    it('should return 100.0 for all yes votes', () => {
      expect(getApprovalRate(10, 10)).toBe('100.0');
    });

    it('should return 0.0 for all no votes', () => {
      expect(getApprovalRate(0, 10)).toBe('0.0');
    });

    it('should handle draw scenario', () => {
      expect(getApprovalRate(5, 10)).toBe('50.0');
    });
  });
});
