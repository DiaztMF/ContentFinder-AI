import { describe, it, expect } from 'bun:test';
import { extractWebpageMetadata, sanitizeHtmlContent } from '../lib/url-scraper';

describe('Web Scraper & Metadata Extractor', () => {
  const sampleHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mastering Next.js 15 Server Actions</title>
        <meta name="description" content="A comprehensive guide on building scalable web apps with Next.js 15 server actions." />
        <meta property="og:image" content="https://example.com/hero.png" />
        <meta property="og:site_name" content="WebDev Blog" />
        <script>console.log('script noise');</script>
        <style>body { color: red; }</style>
      </head>
      <body>
        <nav><a href="#">Home</a> <a href="#">About</a></nav>
        <main>
          <h1>Mastering Next.js 15 Server Actions</h1>
          <p>Server actions allow you to execute server-side functions directly from client components.</p>
          <p>They provide type-safety, automatic bundle splitting, and zero-client JS overhead when mutating data.</p>
        </main>
        <footer>Copyright 2026 WebDev Blog</footer>
      </body>
    </html>
  `;

  it('extracts metadata correctly from HTML string', () => {
    const meta = extractWebpageMetadata(sampleHtml, 'https://example.com/blog/nextjs-15');
    expect(meta.title).toBe('Mastering Next.js 15 Server Actions');
    expect(meta.description).toBe('A comprehensive guide on building scalable web apps with Next.js 15 server actions.');
    expect(meta.imageUrl).toBe('https://example.com/hero.png');
    expect(meta.sourceDomain).toBe('example.com');
  });

  it('sanitizes HTML body text removing script and style tags', () => {
    const text = sanitizeHtmlContent(sampleHtml);
    expect(text).toContain('Mastering Next.js 15 Server Actions');
    expect(text).toContain('Server actions allow you to execute server-side functions');
    expect(text).not.toContain('script noise');
    expect(text).not.toContain('color: red');
  });

  it('handles HTML without meta tags gracefully', () => {
    const minimalHtml = '<html><head><title>Simple Page</title></head><body><p>Hello world</p></body></html>';
    const meta = extractWebpageMetadata(minimalHtml, 'https://sub.domain.co.id/page');
    expect(meta.title).toBe('Simple Page');
    expect(meta.sourceDomain).toBe('sub.domain.co.id');
    expect(meta.description).toBeDefined();
  });
});
