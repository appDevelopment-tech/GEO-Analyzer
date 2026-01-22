import * as cheerio from 'cheerio';
import { CrawlData } from '@/types/geo';

const HEDGING_WORDS = ['may', 'might', 'can', 'could', 'helps', 'holistic', 'possibly', 'sometimes', 'often'];

export async function crawlPage(url: string): Promise<CrawlData> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GEO-Analyzer/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style tags
    $('script, style, nav, footer').remove();

    // Extract headings
    const h1 = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2 = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3 = $('h3').map((_, el) => $(el).text().trim()).get();

    // Extract text content (first 2000 words)
    const textContent = $('body').text().replace(/\s+/g, ' ').trim().split(' ').slice(0, 2000).join(' ');

    // Extract JSON-LD
    const jsonLd: any[] = [];
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        jsonLd.push(JSON.parse($(el).html() || '{}'));
      } catch (e) {
        // Skip invalid JSON-LD
      }
    });

    // Signal extraction
    const signals = {
      entityMentions: extractEntityMentions($, textContent),
      locationMentions: extractLocationMentions(textContent),
      dateMentions: extractDates(textContent),
      hedgingWords: countHedgingWords(textContent),
      directAnswerBlocks: extractDirectAnswerBlocks($),
    };

    return {
      url,
      title: $('title').text() || '',
      metaDescription: $('meta[name="description"]').attr('content') || '',
      headings: { h1, h2, h3 },
      textContent,
      jsonLd,
      signals,
    };
  } catch (error) {
    throw new Error(`Crawl failed for ${url}: ${error}`);
  }
}

function extractEntityMentions($: cheerio.CheerioAPI, text: string): string[] {
  const mentions: string[] = [];
  
  // Look for "X is a Y" patterns
  const patterns = [
    /(\w+(?:\s+\w+)*)\s+is\s+an?\s+([^.]+)/gi,
    /(\w+(?:\s+\w+)*)\s+specializes?\s+in\s+([^.]+)/gi,
  ];

  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      mentions.push(match[0]);
    }
  });

  return mentions.slice(0, 5);
}

function extractLocationMentions(text: string): string[] {
  const locationPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s+([A-Z]{2})\b/g;
  const matches: string[] = [];
  let match;
  
  while ((match = locationPattern.exec(text)) !== null) {
    matches.push(match[0]);
  }
  
  return Array.from(new Set(matches)).slice(0, 5);
}

function extractDates(text: string): string[] {
  const datePattern = /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},?\s+\d{4}\b/gi;
  const matches: string[] = [];
  let match;
  
  while ((match = datePattern.exec(text)) !== null) {
    matches.push(match[0]);
  }
  
  return Array.from(new Set(matches)).slice(0, 5);
}

function countHedgingWords(text: string): number {
  const lowerText = text.toLowerCase();
  return HEDGING_WORDS.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
}

function extractDirectAnswerBlocks($: cheerio.CheerioAPI): string[] {
  const blocks: string[] = [];
  
  // Look for FAQ patterns
  $('h2, h3').each((_, el) => {
    const heading = $(el).text();
    if (heading.includes('?') || heading.toLowerCase().includes('what') || 
        heading.toLowerCase().includes('how') || heading.toLowerCase().includes('why')) {
      const nextP = $(el).next('p');
      if (nextP.length) {
        const text = nextP.text().trim();
        const wordCount = text.split(' ').length;
        if (wordCount >= 40 && wordCount <= 60) {
          blocks.push(text);
        }
      }
    }
  });

  return blocks.slice(0, 3);
}

export async function crawlWebsite(url: string): Promise<CrawlData[]> {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  const baseUrl = new URL(normalizedUrl);
  
  // Define pages to crawl
  const pathsToCrawl = [
    '/',
  ];

  const results: CrawlData[] = [];
  
  for (const path of pathsToCrawl) {
    try {
      const fullUrl = new URL(path, baseUrl.origin).toString();
      const data = await crawlPage(fullUrl);
      results.push(data);
      
      // Limit to 8 pages as per spec
      if (results.length >= 8) break;
    } catch (error) {
      console.error(`Failed to crawl ${path}:`, error);
      // Continue with other pages
    }
  }

  return results;
}
