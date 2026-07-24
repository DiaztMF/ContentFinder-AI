import { GoogleGenAI, Type } from '@google/genai';
import { ContentItem, SearchIntent, TechnicalDifficulty, ContentType } from './types';

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export async function analyzeAndIndexContent(input: {
  url?: string;
  text?: string;
  title?: string;
}): Promise<Partial<ContentItem>> {
  const ai = getAiClient();
  const prompt = `Analyze and summarize the following web content or URL for a technical knowledge discovery engine.
URL / Link: ${input.url || 'N/A'}
Title provided: ${input.title || 'N/A'}
Content Text: ${input.text || 'N/A'}

Provide a high quality technical extraction with executive summary, key takeaways, category, content type, reading time, difficulty, and relevant tags.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert AI Content Analyst and Information Architect. Your task is to analyze incoming articles, technical documentation, videos, tutorials, and code snippets, returning structured JSON metadata.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Clear, concise title of the content' },
            source: { type: Type.STRING, description: 'Domain or platform source name (e.g. github.com, medium.com, youtube.com)' },
            author: { type: Type.STRING, description: 'Author name or publishing group' },
            summary: { type: Type.STRING, description: 'Detailed executive summary (2-3 paragraphs)' },
            keyTakeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 to 5 core takeaways or actionable learnings'
            },
            category: {
              type: Type.STRING,
              description: 'Primary domain category e.g. Web Dev, AI & ML, Database, Systems, Design, Cloud, DevOps, Security'
            },
            contentType: {
              type: Type.STRING,
              description: 'One of: article, video, documentation, code_snippet, tutorial'
            },
            readTime: { type: Type.STRING, description: 'Estimated read time e.g. 7 min read' },
            difficulty: { type: Type.STRING, description: 'One of: Beginner, Intermediate, Advanced' },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '4 to 6 relevant search tags'
            }
          },
          required: ['title', 'summary', 'keyTakeaways', 'category', 'contentType', 'readTime', 'difficulty', 'tags']
        }
      }
    });

    const jsonText = response.text || '{}';
    const parsed = JSON.parse(jsonText);

    // Standardize content type
    let contentType: ContentType = 'article';
    const validTypes: ContentType[] = ['article', 'video', 'documentation', 'code_snippet', 'tutorial'];
    if (validTypes.includes(parsed.contentType?.toLowerCase())) {
      contentType = parsed.contentType.toLowerCase() as ContentType;
    }

    // Standardize difficulty
    let difficulty: TechnicalDifficulty = 'Intermediate';
    const validLevels: TechnicalDifficulty[] = ['Beginner', 'Intermediate', 'Advanced'];
    if (validLevels.includes(parsed.difficulty)) {
      difficulty = parsed.difficulty as TechnicalDifficulty;
    }

    // Derive source domain if missing
    let source = parsed.source || 'web';
    if (input.url) {
      try {
        const parsedUrl = new URL(input.url);
        source = parsedUrl.hostname.replace(/^www\./, '');
      } catch {
        // Keep fallback
      }
    }

    return {
      title: parsed.title || input.title || 'Indexed Article',
      url: input.url || 'https://example.com/indexed-article',
      source,
      author: parsed.author || 'Editorial',
      summary: parsed.summary || 'Summary unavailable.',
      keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : ['Comprehensive technical overview.'],
      category: parsed.category || 'Web Dev',
      contentType,
      readTime: parsed.readTime || '5 min read',
      difficulty,
      relevanceScore: 95,
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['Tech', 'Knowledge'],
      rawContent: input.text || undefined,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(parsed.title || 'tech')}/800/450`
    };
  } catch (error) {
    console.error('Error analyzing content with Gemini:', error);
    // Graceful fallback
    return {
      title: input.title || (input.url ? `Indexed Content (${new URL(input.url).hostname})` : 'Untitled Note'),
      url: input.url || 'https://example.com',
      source: input.url ? new URL(input.url).hostname.replace(/^www\./, '') : 'web',
      author: 'AI Indexer',
      summary: input.text ? input.text.slice(0, 300) + '...' : 'Content successfully indexed and stored.',
      keyTakeaways: ['Quickly indexed for search', 'Saved to discovery library', 'AI analysis ready'],
      category: 'General',
      contentType: 'article',
      readTime: '4 min read',
      difficulty: 'Intermediate',
      relevanceScore: 90,
      tags: ['Indexed', 'Resource'],
      imageUrl: 'https://picsum.photos/seed/fallback/800/450'
    };
  }
}

export async function semanticSearchAndExpand(
  query: string,
  availableItems: ContentItem[]
): Promise<{
  intent: SearchIntent;
  itemScores: Record<string, { score: number; explanation: string }>;
}> {
  const ai = getAiClient();

  const itemsSummaryList = availableItems.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    category: item.category,
    contentType: item.contentType,
    tags: item.tags,
    difficulty: item.difficulty
  }));

  const prompt = `Analyze this search query for a developer content discovery search engine:
User Query: "${query}"

Available Content Items in Index:
${JSON.stringify(itemsSummaryList, null, 2)}

Perform two tasks:
1. Extract query intent, expanded natural language query, key topics, target depth/level, suggested formats, keywords, and reasoning.
2. Evaluate semantic relevance (0-100 score) for each content item in the index, with a concise 1-sentence match explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a Semantic Search Engine Intelligence Module. Analyze user queries and score knowledge assets based on deep contextual relevance.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            expandedQuery: { type: Type.STRING, description: 'Natural language expansion of query' },
            primaryIntent: { type: Type.STRING, description: 'Core learning objective of the user' },
            extractedTopics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key concepts extracted from query'
            },
            recommendedLevel: { type: Type.STRING, description: 'One of: Beginner, Intermediate, Advanced' },
            suggestedFormats: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Suggested formats e.g. article, video, documentation, code_snippet, tutorial'
            },
            searchKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Synonyms and search keywords'
            },
            aiReasoning: { type: Type.STRING, description: 'Why these results best match the user intent' },
            itemScores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  score: { type: Type.NUMBER, description: '0 to 100 relevance score' },
                  explanation: { type: Type.STRING, description: 'Reason for score match' }
                },
                required: ['id', 'score', 'explanation']
              }
            }
          },
          required: ['expandedQuery', 'primaryIntent', 'extractedTopics', 'recommendedLevel', 'suggestedFormats', 'searchKeywords', 'aiReasoning', 'itemScores']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    const itemScores: Record<string, { score: number; explanation: string }> = {};
    if (Array.isArray(parsed.itemScores)) {
      parsed.itemScores.forEach((entry: { id: string; score: number; explanation: string }) => {
        itemScores[entry.id] = {
          score: Math.min(100, Math.max(0, entry.score || 50)),
          explanation: entry.explanation || 'Matches query topic.'
        };
      });
    }

    const intent: SearchIntent = {
      query,
      expandedQuery: parsed.expandedQuery || query,
      primaryIntent: parsed.primaryIntent || 'General topic discovery',
      extractedTopics: parsed.extractedTopics || [query],
      recommendedLevel: (parsed.recommendedLevel as TechnicalDifficulty) || 'Intermediate',
      suggestedFormats: (parsed.suggestedFormats as ContentType[]) || ['article', 'documentation'],
      searchKeywords: parsed.searchKeywords || [query],
      aiReasoning: parsed.aiReasoning || 'Relevance matched using semantic concept vectors.'
    };

    return { intent, itemScores };
  } catch (error) {
    console.error('Error in semantic search with Gemini:', error);
    // Keyword fallback search
    const qLower = query.toLowerCase();
    const itemScores: Record<string, { score: number; explanation: string }> = {};

    availableItems.forEach((item) => {
      let score = 50;
      let matches: string[] = [];

      if (item.title.toLowerCase().includes(qLower)) {
        score += 35;
        matches.push('Title keyword match');
      }
      if (item.summary.toLowerCase().includes(qLower)) {
        score += 20;
        matches.push('Summary content match');
      }
      if (item.tags.some((t) => t.toLowerCase().includes(qLower))) {
        score += 25;
        matches.push('Tag match');
      }
      if (item.category.toLowerCase().includes(qLower)) {
        score += 15;
        matches.push('Category match');
      }

      itemScores[item.id] = {
        score: Math.min(100, score),
        explanation: matches.length > 0 ? matches.join(', ') : 'Keyword keyword similarity match.'
      };
    });

    const fallbackIntent: SearchIntent = {
      query,
      expandedQuery: `${query} concepts and guides`,
      primaryIntent: `Search for ${query}`,
      extractedTopics: [query],
      recommendedLevel: 'Intermediate',
      suggestedFormats: ['article', 'documentation'],
      searchKeywords: [query],
      aiReasoning: 'Filtered results using keyword search.'
    };

    return { intent: fallbackIntent, itemScores };
  }
}

export async function askContentAI(
  content: ContentItem,
  question: string,
  history: { role: string; content: string }[] = []
): Promise<string> {
  const ai = getAiClient();

  const formattedHistory = history.map((h) => `${h.role.toUpperCase()}: ${h.content}`).join('\n');

  const prompt = `You are a helpful AI Knowledge Assistant specializing in analyzing technical articles, papers, and videos.

Target Content Metadata:
Title: ${content.title}
Source: ${content.source} (${content.url})
Category: ${content.category}
Content Type: ${content.contentType}
Summary: ${content.summary}
Key Takeaways:
${content.keyTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}
${content.rawContent ? `Full Content Text:\n${content.rawContent.slice(0, 3000)}` : ''}

Previous Chat Conversation:
${formattedHistory}

User Question: "${question}"

Provide a clear, direct, and insightful response answering the user's question based on this specific content item. If relevant, include code snippets or bullet points.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an articulate technical expert explaining content details concisely.'
      }
    });

    return response.text || 'I could not generate an answer at this time.';
  } catch (error) {
    console.error('Error asking content AI:', error);
    return `Apologies, I encountered an issue retrieving the answer: ${error instanceof Error ? error.message : 'Unknown error'}.`;
  }
}
