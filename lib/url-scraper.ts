/**
 * Web Scraper & HTML Metadata Extractor Utility
 */

export interface ScrapedMetadata {
  title: string;
  description: string;
  imageUrl?: string;
  sourceDomain: string;
  extractedText: string;
}

export function sanitizeHtmlContent(html: string): string {
  if (!html) return '';

  // Remove script and style elements
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  clean = clean.replace(/<!--[\s\S]*?-->/g, '');

  // Strip remaining HTML tags
  clean = clean.replace(/<[^>]+>/g, ' ');

  // Collapse whitespace
  return clean.replace(/\s+/g, ' ').trim();
}

export function extractWebpageMetadata(html: string, url: string): ScrapedMetadata {
  let title = '';
  let description = '';
  let imageUrl: string | undefined = undefined;
  let sourceDomain = 'web';

  try {
    const parsedUrl = new URL(url);
    sourceDomain = parsedUrl.hostname.replace(/^www\./, '');
  } catch {
    // Keep fallback
  }

  // Extract <title>
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    title = titleMatch[1].trim();
  }

  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i) ||
                    html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["']/i);
  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  }

  // Extract og:image
  const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([\s\S]*?)["']/i) ||
                     html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*property=["']og:image["']/i);
  if (ogImgMatch && ogImgMatch[1]) {
    imageUrl = ogImgMatch[1].trim();
  }

  const extractedText = sanitizeHtmlContent(html);

  return {
    title: title || sourceDomain || 'Indexed Webpage',
    description: description || extractedText.slice(0, 250) + '...',
    imageUrl,
    sourceDomain,
    extractedText
  };
}

export async function fetchAndParseUrl(url: string): Promise<ScrapedMetadata> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    const html = await res.text();
    return extractWebpageMetadata(html, url);
  } catch (error) {
    console.warn(`Failed to fetch URL ${url}:`, error);
    let domain = 'web';
    try {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } catch {}

    return {
      title: `Article from ${domain}`,
      description: `Resource indexed from ${url}`,
      sourceDomain: domain,
      extractedText: ''
    };
  }
}
