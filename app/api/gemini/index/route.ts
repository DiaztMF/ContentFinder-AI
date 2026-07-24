import { NextRequest, NextResponse } from 'next/server';
import { indexContentAction } from '@/app/actions/content';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newItem = await indexContentAction({
      url: body.url,
      text: body.text,
      title: body.title
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error) {
    console.error('API /api/gemini/index error:', error);
    return NextResponse.json({ error: 'Failed to index content' }, { status: 500 });
  }
}
