import { timestamps } from '@/lib/utils';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  body: text('body').notNull(),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

// Schema for todos - used to validate API requests
const baseSchema = createSelectSchema(todos).omit(timestamps);

export const insertTodoSchema = createInsertSchema(todos).omit(timestamps);
export const insertTodoParams = baseSchema.extend({}).omit({
  id: true
});

export const updateTodoSchema = baseSchema;
export const updateTodoParams = baseSchema;
export const todoIdSchema = baseSchema.pick({ id: true });

// Types for todos - used to type API request params and within Components
export type Todo = typeof todos.$inferSelect;
export type NewTodo = z.infer<typeof insertTodoSchema>;
export type NewTodoParams = z.infer<typeof insertTodoParams>;
export type UpdateTodoParams = z.infer<typeof updateTodoParams>;
