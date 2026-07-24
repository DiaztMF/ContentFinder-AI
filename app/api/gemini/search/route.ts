import { NextRequest, NextResponse } from 'next/server';
import { semanticSearchAndExpand } from '@/lib/gemini';
import { getAllContents } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    const availableItems = await getAllContents();
    const result = await semanticSearchAndExpand(query.trim(), availableItems);

    return NextResponse.json(result);
  } catch (error) {
    console.error('API /api/gemini/search error:', error);
    return NextResponse.json(
      { error: 'Failed to process semantic search request' },
      { status: 500 }
    );
  }
}
