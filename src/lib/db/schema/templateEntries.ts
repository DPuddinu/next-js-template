import { type getTemplateEntries } from '@/lib/api/templateEntries/queries';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { templates } from './templates';

import { nanoid } from '@/lib/utils';

export const templateEntries = sqliteTable('template_entries', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  body: text('body').notNull(),
  templateId: text('template_id')
    .references(() => templates.id, { onDelete: 'cascade' })
    .notNull(),
  userId: text('user_id').notNull()
});

// Schema for templateEntries - used to validate API requests
const baseSchema = createSelectSchema(templateEntries);

export const insertTemplateEntrySchema = createInsertSchema(templateEntries);
export const insertTemplateEntryParams = baseSchema
  .extend({
    templateId: z.coerce.string().min(1)
  })
  .omit({
    id: true,
    userId: true
  });

export const updateTemplateEntrySchema = baseSchema;
export const updateTemplateEntryParams = baseSchema
  .extend({
    templateId: z.coerce.string().min(1)
  })
  .omit({
    userId: true
  });
export const templateEntryIdSchema = baseSchema.pick({ id: true });

// Types for templateEntries - used to type API request params and within Components
export type TemplateEntry = typeof templateEntries.$inferSelect;
export type NewTemplateEntry = z.infer<typeof insertTemplateEntrySchema>;
export type NewTemplateEntryParams = z.infer<typeof insertTemplateEntryParams>;
export type UpdateTemplateEntryParams = z.infer<typeof updateTemplateEntryParams>;
export type TemplateEntryId = z.infer<typeof templateEntryIdSchema>['id'];

// this type infers the return from getTemplateEntries() - meaning it will include any joins
export type CompleteTemplateEntry = Awaited<ReturnType<typeof getTemplateEntries>>['templateEntries'][number];
