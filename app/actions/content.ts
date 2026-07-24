'use server';

import {
  getAllContents,
  getContentById,
  getAllCollections,
  createCollection,
  toggleSaveToCollection,
  addContentItem,
  incrementContentViews,
  deleteContentItem
} from '@/lib/data-store';
import { analyzeAndIndexContent } from '@/lib/gemini';
import { ContentItem, Collection } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function fetchContentsAction(): Promise<ContentItem[]> {
  return await getAllContents();
}

export async function getContentByIdAction(id: string): Promise<ContentItem | null> {
  return await getContentById(id);
}

export async function fetchCollectionsAction(): Promise<Collection[]> {
  return await getAllCollections();
}

export async function createCollectionAction(
  name: string,
  description?: string,
  color = 'indigo',
  icon = 'folder'
): Promise<Collection> {
  const col = await createCollection(name, description, color, icon);
  revalidatePath('/');
  revalidatePath('/collections');
  return col;
}

export async function toggleSaveAction(
  contentId: string,
  collectionId: string,
  notes?: string
): Promise<{ saved: boolean }> {
  const res = await toggleSaveToCollection(contentId, collectionId, notes);
  revalidatePath('/');
  revalidatePath('/collections');
  return res;
}

export async function indexContentAction(input: {
  url?: string;
  text?: string;
  title?: string;
}): Promise<ContentItem> {
  const aiResult = await analyzeAndIndexContent(input);

  const newItem: ContentItem = {
    id: `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: aiResult.title || 'Untitled Content',
    url: aiResult.url || 'https://example.com',
    source: aiResult.source || 'web',
    author: aiResult.author || 'Editorial',
    summary: aiResult.summary || 'Summary unavailable.',
    keyTakeaways: aiResult.keyTakeaways || [],
    category: aiResult.category || 'Web Dev',
    contentType: aiResult.contentType || 'article',
    readTime: aiResult.readTime || '5 min read',
    difficulty: aiResult.difficulty || 'Intermediate',
    relevanceScore: aiResult.relevanceScore || 90,
    views: 1,
    tags: aiResult.tags || ['Indexed'],
    createdAt: new Date().toISOString(),
    imageUrl: aiResult.imageUrl,
    rawContent: aiResult.rawContent
  };

  await addContentItem(newItem);
  revalidatePath('/');
  revalidatePath('/search');
  return newItem;
}

export async function incrementViewsAction(id: string): Promise<void> {
  await incrementContentViews(id);
}

export async function deleteContentAction(id: string): Promise<boolean> {
  const res = await deleteContentItem(id);
  revalidatePath('/');
  revalidatePath('/collections');
  return res;
}
