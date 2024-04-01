import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { usersToTemplates } from './templates';

export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  spotifyUserId: text('spotifyUserId').notNull(),
  image: text('image').notNull(),
  username: text('username').notNull()
});
export type DatabaseUser = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  usersToGroups: many(usersToTemplates)
}));

export const sessions = sqliteTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  expires_at: integer('expires_at').notNull()
});

const baseSchema = createSelectSchema(users);
export const userIdSchema = baseSchema.pick({ id: true });
export type UserId = z.infer<typeof userIdSchema>['id'];
