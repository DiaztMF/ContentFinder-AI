import { describe, it, expect } from 'bun:test';
import { calculateReadTime, cleanAndTruncateText, formatKeyTakeaways } from '../lib/content-summary-helper';

describe('Content Summary Helper Utilities', () => {
  describe('calculateReadTime', () => {
    it('returns "1 min read" for short texts under 200 words', () => {
      const text = 'This is a short article explaining Next.js server actions.';
      expect(calculateReadTime(text)).toBe('1 min read');
    });

    it('calculates correct read time for longer articles', () => {
      const words = Array(500).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe('3 min read');
    });

    it('handles empty text gracefully', () => {
      expect(calculateReadTime('')).toBe('1 min read');
    });
  });

  describe('cleanAndTruncateText', () => {
    it('truncates long text and appends ellipsis', () => {
      const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      expect(cleanAndTruncateText(text, 20)).toBe('Lorem ipsum dolor si... (20 chars)');
    });

    it('returns original text if shorter than limit', () => {
      const text = 'Short text';
      expect(cleanAndTruncateText(text, 50)).toBe('Short text');
    });
  });

  describe('formatKeyTakeaways', () => {
    it('filters out empty or duplicate takeaways', () => {
      const raw = ['  First takeaway  ', '', 'First takeaway', 'Second takeaway'];
      expect(formatKeyTakeaways(raw)).toEqual(['First takeaway', 'Second takeaway']);
    });
  });
});
