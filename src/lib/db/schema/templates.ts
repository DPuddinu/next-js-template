import { type getTemplates } from '@/lib/api/templates/queries';
import { nanoid, timestamps } from '@/lib/utils';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './auth';

export const templates = sqliteTable('templates', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  color: text('color'),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
});

export const usersToTemplates = sqliteTable('users_to_templates', {
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  templateId: text('template_id')
    .notNull()
    .references(() => templates.id)
});

export const usersToTemplatesRelations = relations(usersToTemplates, ({ one }) => ({
  group: one(templates, {
    fields: [usersToTemplates.templateId],
    references: [templates.id]
  }),
  user: one(users, {
    fields: [usersToTemplates.userId],
    references: [users.id]
  })
}));

export const templatesRelations = relations(templates, ({ many }) => ({
  usersToTemplates: many(usersToTemplates)
}));

// Schema for templates - used to validate API requests
const baseSchema = createSelectSchema(templates).omit(timestamps);

export const insertTemplateSchema = createInsertSchema(templates).omit(timestamps);
export const insertTemplateParams = baseSchema.extend({}).omit({
  id: true,
  userId: true
});

export const updateTemplateSchema = baseSchema;
export const updateTemplateParams = baseSchema;
export const templateIdSchema = baseSchema.pick({ id: true });

// Types for templates - used to type API request params and within Components
export type Template = typeof templates.$inferSelect;
export type NewTemplate = z.infer<typeof insertTemplateSchema>;
export type NewTemplateParams = z.infer<typeof insertTemplateParams>;
export type UpdateTemplateParams = z.infer<typeof updateTemplateParams>;
export type TemplateId = z.infer<typeof templateIdSchema>['id'];

// this type infers the return from getTemplates() - meaning it will include any joins
export type CompleteTemplate = Awaited<ReturnType<typeof getTemplates>>['templates'][number];
