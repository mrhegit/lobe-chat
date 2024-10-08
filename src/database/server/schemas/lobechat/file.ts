/* eslint-disable sort-keys-fix/sort-keys-fix  */
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

import { chunks } from '@/database/server/schemas/lobechat/rag';

import { idGenerator } from '../../utils/idGenerator';
import { createdAt, updatedAt } from './_helpers';
import { users } from './user';

export const asyncTasks = pgTable('async_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: text('type'),
  status: text('status'),
  error: jsonb('error'),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  duration: integer('duration'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type NewAsyncTaskItem = typeof asyncTasks.$inferInsert;
export type AsyncTaskSelectItem = typeof asyncTasks.$inferSelect;

export const globalFiles = pgTable('global_files', {
  hashId: varchar('hash_id', { length: 64 }).primaryKey(),
  fileType: varchar('file_type', { length: 255 }).notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),
  metadata: jsonb('metadata'),
  createdAt: createdAt(),
});

export type NewGlobalFile = typeof globalFiles.$inferInsert;
export type GlobalFileItem = typeof globalFiles.$inferSelect;

export const files = pgTable('files', {
  id: text('id')
    .$defaultFn(() => idGenerator('files'))
    .primaryKey(),

  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  fileType: varchar('file_type', { length: 255 }).notNull(),
  fileHash: varchar('file_hash', { length: 64 }).references(() => globalFiles.hashId, {
    onDelete: 'no action',
  }),
  name: text('name').notNull(),
  size: integer('size').notNull(),
  url: text('url').notNull(),

  metadata: jsonb('metadata'),
  chunkTaskId: uuid('chunk_task_id').references(() => asyncTasks.id, { onDelete: 'set null' }),
  embeddingTaskId: uuid('embedding_task_id').references(() => asyncTasks.id, {
    onDelete: 'set null',
  }),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export type NewFile = typeof files.$inferInsert;
export type FileItem = typeof files.$inferSelect;

export const fileChunks = pgTable(
  'file_chunks',
  {
    fileId: varchar('file_id').references(() => files.id, { onDelete: 'cascade' }),
    chunkId: uuid('chunk_id').references(() => chunks.id, { onDelete: 'cascade' }),
    createdAt: createdAt(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.fileId, t.chunkId] }),
  }),
);

export type NewFileChunkItem = typeof fileChunks.$inferInsert;

export const knowledgeBases = pgTable('knowledge_bases', {
  id: text('id')
    .$defaultFn(() => idGenerator('knowledgeBases'))
    .primaryKey(),

  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),

  // different types of knowledge bases need to be distinguished
  type: text('type'),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),

  isPublic: boolean('is_public').default(false),

  settings: jsonb('settings'),

  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const insertKnowledgeBasesSchema = createInsertSchema(knowledgeBases);

export type NewKnowledgeBase = typeof knowledgeBases.$inferInsert;
export type KnowledgeBaseItem = typeof knowledgeBases.$inferSelect;

export const knowledgeBaseFiles = pgTable(
  'knowledge_base_files',
  {
    knowledgeBaseId: text('knowledge_base_id')
      .references(() => knowledgeBases.id, { onDelete: 'cascade' })
      .notNull(),

    fileId: text('file_id')
      .references(() => files.id, { onDelete: 'cascade' })
      .notNull(),

    // userId: text('user_id')
    //   .references(() => users.id, { onDelete: 'cascade' })
    //   .notNull(),

    createdAt: createdAt(),
  },
  (t) => ({
    pk: primaryKey({
      columns: [
        t.knowledgeBaseId,
        t.fileId,
        // t.userId
      ],
    }),
  }),
);
