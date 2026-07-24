import { NextRequest, NextResponse } from 'next/server';
import { askContentAI } from '@/lib/gemini';
import { getContentById } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const { contentId, question, history } = await req.json();

    if (!contentId || !question) {
      return NextResponse.json({ error: 'contentId and question are required' }, { status: 400 });
    }

    const content = await getContentById(contentId);
    if (!content) {
      return NextResponse.json({ error: 'Content item not found' }, { status: 404 });
    }

    const answer = await askContentAI(content, question, history || []);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('API /api/gemini/chat error:', error);
    return NextResponse.json({ error: 'Failed to answer question' }, { status: 500 });
  }
}
