/**
 * Content Summary & Text Utility Helper Module
 */

export function calculateReadTime(text: string): string {
  if (!text || !text.trim()) {
    return '1 min read';
  }
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function cleanAndTruncateText(text: string, maxLength: number): string {
  if (!text) return '';
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }
  return `${trimmed.slice(0, maxLength).trim()}... (${maxLength} chars)`;
}

export function formatKeyTakeaways(takeaways: string[]): string[] {
  if (!Array.isArray(takeaways)) return [];
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of takeaways) {
    const cleaned = (raw || '').trim();
    if (cleaned && !seen.has(cleaned)) {
      seen.add(cleaned);
      result.push(cleaned);
    }
  }

  return result;
}
