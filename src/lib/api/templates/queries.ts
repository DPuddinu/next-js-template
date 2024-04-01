import { db } from '@/lib/db/index';
import { UserId } from '@/lib/db/schema/auth';
import { templateEntries, type CompleteTemplateEntry } from '@/lib/db/schema/templateEntries';
import { templateIdSchema, templates, usersToTemplates, type TemplateId } from '@/lib/db/schema/templates';
import { eq } from 'drizzle-orm';
import { cache } from 'react';

export const getTemplates = async () => {
  const rows = await db.select().from(templates);
  const t = rows;
  return { templates: t };
};

export const getTemplatesByUserId = cache(async (id: UserId) => {
  const rows = await db
    .select()
    .from(usersToTemplates)
    .innerJoin(templates, eq(usersToTemplates.templateId, templates.id))
    .where(eq(usersToTemplates.userId, id));
  if (rows === undefined) return {};
  const t = rows;
  return { templates: t.map((row) => row.templates) };
});

export const getTemplateById = async (id: TemplateId) => {
  const { id: templateId } = templateIdSchema.parse({ id });
  const [row] = await db.select().from(templates).where(eq(templates.id, templateId));
  if (row === undefined) return {};
  const t = row;
  return { template: t };
};

export const getTemplateByIdWithTemplateEntries = async (id: TemplateId) => {
  const { id: templateId } = templateIdSchema.parse({ id });
  const rows = await db
    .select({ template: templates, templateEntry: templateEntries })
    .from(templates)
    .where(eq(templates.id, templateId))
    .leftJoin(templateEntries, eq(templates.id, templateEntries.templateId));
  if (rows.length === 0) return {};
  const t = rows[0].template;
  const tt = rows.filter((r) => r.templateEntry !== null).map((t) => t.templateEntry) as CompleteTemplateEntry[];

  return { template: t, templateEntries: tt };
};
