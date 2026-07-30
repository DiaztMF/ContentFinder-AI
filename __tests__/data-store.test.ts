import { describe, it, expect, beforeEach } from 'bun:test';
import {
  getAllContents,
  getContentById,
  addContentItem,
  getAllCollections,
  createCollection,
  toggleSaveToCollection,
  deleteContentItem
} from '../lib/data-store';
import { ContentItem } from '../lib/types';

describe('Data Store & CRUD Actions Unit Tests', () => {
  it('returns initial seed contents when database is uninitialized or in fallback', async () => {
    const contents = await getAllContents();
    expect(contents.length).toBeGreaterThan(0);
    expect(contents[0].id).toBeDefined();
    expect(contents[0].title).toBeDefined();
  });

  it('retrieves a single content item by ID', async () => {
    const all = await getAllContents();
    const target = all[0];
    const found = await getContentById(target.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(target.id);
  });

  it('adds a new content item and prepends it to memory store', async () => {
    const newItem: ContentItem = {
      id: `test_${Date.now()}`,
      title: 'TDD Test Driven Development Guide',
      url: 'https://example.com/tdd-guide',
      source: 'example.com',
      summary: 'A clean unit test for data-store addContentItem.',
      keyTakeaways: ['Write test first', 'Watch it fail', 'Make it pass'],
      category: 'Web Dev',
      contentType: 'tutorial',
      readTime: '4 min read',
      difficulty: 'Intermediate',
      relevanceScore: 95,
      views: 0,
      tags: ['TDD', 'Testing'],
      createdAt: new Date().toISOString()
    };

    const added = await addContentItem(newItem);
    expect(added.id).toBe(newItem.id);

    const all = await getAllContents();
    expect(all.some((item) => item.id === newItem.id)).toBe(true);
  });

  it('creates a new collection and allows bookmarking content to it', async () => {
    const col = await createCollection('TDD Collection', 'Collection created during systematic debugging');
    expect(col.name).toBe('TDD Collection');

    const contents = await getAllContents();
    const itemToSave = contents[0];

    const saveResult = await toggleSaveToCollection(itemToSave.id, col.id);
    expect(saveResult.saved).toBe(true);

    const updatedCols = await getAllCollections();
    const targetCol = updatedCols.find((c) => c.id === col.id);
    expect(targetCol?.itemIds).toContain(itemToSave.id);

    // Toggle off
    const removeResult = await toggleSaveToCollection(itemToSave.id, col.id);
    expect(removeResult.saved).toBe(false);
  });

  it('deletes a content item from store and collections', async () => {
    const tempItem: ContentItem = {
      id: `delete_me_${Date.now()}`,
      title: 'Temporary Item to Delete',
      url: 'https://example.com/delete-me',
      source: 'example.com',
      summary: 'Item created to be deleted',
      keyTakeaways: ['Will be deleted'],
      category: 'General',
      contentType: 'article',
      readTime: '1 min read',
      difficulty: 'Beginner',
      relevanceScore: 80,
      views: 0,
      tags: ['Temp'],
      createdAt: new Date().toISOString()
    };

    await addContentItem(tempItem);
    const deleted = await deleteContentItem(tempItem.id);
    expect(deleted).toBe(true);

    const found = await getContentById(tempItem.id);
    expect(found).toBeNull();
  });
});
