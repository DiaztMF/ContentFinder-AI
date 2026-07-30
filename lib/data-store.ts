import { ContentItem, Collection, SavedItem } from './types';
import { INITIAL_CONTENTS, INITIAL_COLLECTIONS } from './initial-seed';
import { getDb } from '@/db';
import { contents, collections, savedItems, tags, contentTags, contentEmbeddings } from '@/db/schema';
import { generateTextEmbedding } from '@/lib/gemini';
import { eq, desc } from 'drizzle-orm';

// In-memory store for fallback mode or instant SSR rendering
let memoryContents: ContentItem[] = [...INITIAL_CONTENTS];
let memoryCollections: Collection[] = [...INITIAL_COLLECTIONS];
let memorySavedItems: SavedItem[] = [
  { id: 'save_1', collectionId: 'col_web_dev_2026', contentId: 'cnt_react19_server_actions', savedAt: new Date().toISOString() },
  { id: 'save_2', collectionId: 'col_web_dev_2026', contentId: 'cnt_tailwind_v4_guide', savedAt: new Date().toISOString() },
  { id: 'save_3', collectionId: 'col_ai_research', contentId: 'cnt_gemini_35_architecture', savedAt: new Date().toISOString() }
];

export async function getAllContents(): Promise<ContentItem[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(contents).orderBy(desc(contents.createdAt));
      if (rows.length > 0) {
        return rows.map((r) => ({
          id: r.id,
          title: r.title,
          url: r.url,
          source: r.source || 'web',
          author: r.author || undefined,
          summary: r.summary,
          keyTakeaways: (r.keyTakeaways as string[]) || [],
          category: r.category,
          contentType: r.contentType as any,
          readTime: r.readTime || '5 min read',
          difficulty: (r.difficulty as any) || 'Intermediate',
          relevanceScore: r.relevanceScore || 90,
          views: r.views || 0,
          tags: [r.category, r.contentType], // Tag list
          createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
          imageUrl: r.imageUrl || undefined,
          rawContent: r.rawContent || undefined
        }));
      }
    } catch (e) {
      // Postgres query error or missing table fallback
    }
  }
  return memoryContents;
}

export async function getContentById(id: string): Promise<ContentItem | null> {
  const all = await getAllContents();
  const found = all.find((item) => item.id === id);
  return found || null;
}

export async function addContentItem(item: ContentItem): Promise<ContentItem> {
  memoryContents = [item, ...memoryContents];
  
  const db = getDb();
  if (db) {
    try {
      await db.insert(contents).values({
        id: item.id,
        title: item.title,
        url: item.url,
        source: item.source,
        author: item.author,
        summary: item.summary,
        keyTakeaways: item.keyTakeaways,
        category: item.category,
        contentType: item.contentType,
        readTime: item.readTime,
        difficulty: item.difficulty,
        relevanceScore: item.relevanceScore,
        views: item.views,
        imageUrl: item.imageUrl,
        rawContent: item.rawContent,
        createdAt: new Date(item.createdAt)
      });

      // Generate and store vector embedding for RAG search
      const embeddingText = `${item.title}. ${item.summary}. Key Takeaways: ${item.keyTakeaways.join(', ')}`;
      const vec = await generateTextEmbedding(embeddingText);
      if (vec && vec.length > 0) {
        await db.insert(contentEmbeddings).values({
          contentId: item.id,
          embedding: vec,
          updatedAt: new Date()
        });
      }
    } catch (e) {
      console.warn('Postgres insert error for content:', e);
    }
  }
  return item;
}

export async function incrementContentViews(id: string): Promise<void> {
  const item = memoryContents.find((c) => c.id === id);
  if (item) {
    item.views += 1;
  }
  
  const db = getDb();
  if (db) {
    try {
      const existing = await db.select().from(contents).where(eq(contents.id, id)).limit(1);
      if (existing.length > 0) {
        await db.update(contents).set({ views: (existing[0].views || 0) + 1 }).where(eq(contents.id, id));
      }
    } catch (e) {
      console.warn('Postgres update views error:', e);
    }
  }
}

export async function getAllCollections(): Promise<Collection[]> {
  const db = getDb();
  if (db) {
    try {
      const rows = await db.select().from(collections);
      const saved = await db.select().from(savedItems);
      if (rows.length > 0) {
        return rows.map((col) => {
          const itemIds = saved.filter((s) => s.collectionId === col.id).map((s) => s.contentId);
          return {
            id: col.id,
            name: col.name,
            description: col.description || undefined,
            color: col.color || 'indigo',
            icon: col.icon || 'folder',
            createdAt: col.createdAt ? col.createdAt.toISOString() : new Date().toISOString(),
            itemIds
          };
        });
      }
    } catch (e) {
      // Postgres collections query error or missing table fallback
    }
  }
  return memoryCollections;
}

export async function createCollection(name: string, description?: string, color = 'indigo', icon = 'folder'): Promise<Collection> {
  const newCol: Collection = {
    id: `col_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name,
    description,
    color,
    icon,
    createdAt: new Date().toISOString(),
    itemIds: []
  };
  memoryCollections = [newCol, ...memoryCollections];

  const db = getDb();
  if (db) {
    try {
      await db.insert(collections).values({
        id: newCol.id,
        name: newCol.name,
        description: newCol.description,
        color: newCol.color,
        icon: newCol.icon,
        createdAt: new Date(newCol.createdAt)
      });
    } catch (e) {
      console.warn('Postgres insert collection error:', e);
    }
  }
  return newCol;
}

export async function toggleSaveToCollection(contentId: string, collectionId: string, notes?: string): Promise<{ saved: boolean }> {
  const collection = memoryCollections.find((c) => c.id === collectionId);
  if (!collection) {
    return { saved: false };
  }

  const existingIndex = collection.itemIds.indexOf(contentId);
  let saved = false;

  if (existingIndex >= 0) {
    // Remove
    collection.itemIds.splice(existingIndex, 1);
    memorySavedItems = memorySavedItems.filter((s) => !(s.collectionId === collectionId && s.contentId === contentId));
    saved = false;
  } else {
    // Add
    collection.itemIds.push(contentId);
    memorySavedItems.push({
      id: `save_${Date.now()}`,
      collectionId,
      contentId,
      notes,
      savedAt: new Date().toISOString()
    });
    saved = true;
  }

  const db = getDb();
  if (db) {
    try {
      if (saved) {
        await db.insert(savedItems).values({
          id: `save_${Date.now()}`,
          collectionId,
          contentId,
          notes,
          savedAt: new Date()
        });
      } else {
        await db.delete(savedItems).where(eq(savedItems.collectionId, collectionId) && eq(savedItems.contentId, contentId));
      }
    } catch (e) {
      console.warn('Postgres toggle save item error:', e);
    }
  }

  return { saved };
}

export async function deleteContentItem(id: string): Promise<boolean> {
  memoryContents = memoryContents.filter((c) => c.id !== id);
  memoryCollections.forEach((col) => {
    col.itemIds = col.itemIds.filter((itemId) => itemId !== id);
  });

  const db = getDb();
  if (db) {
    try {
      await db.delete(contents).where(eq(contents.id, id));
    } catch (e) {
      console.warn('Postgres delete content error:', e);
    }
  }

  return true;
}
