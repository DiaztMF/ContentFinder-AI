import { describe, it, expect } from 'bun:test';
import { fetchAndParseUrl } from '../lib/url-scraper';

describe('Scraper Integration Helper', () => {
  it('fetches domain metadata for structured fallback when network is mock', async () => {
    const scraped = await fetchAndParseUrl('https://example.com/test-article');
    expect(scraped.sourceDomain).toBe('example.com');
    expect(scraped.title).toBeDefined();
  });
});
