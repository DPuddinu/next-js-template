import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db/index';
import { templateEntries, templateEntryIdSchema, type TemplateEntryId } from '@/lib/db/schema/templateEntries';
import { templates } from '@/lib/db/schema/templates';
import { and, eq } from 'drizzle-orm';

export const getTemplateEntries = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select({ templateEntry: templateEntries, template: templates })
    .from(templateEntries)
    .leftJoin(templates, eq(templateEntries.templateId, templates.id))
    .where(eq(templateEntries.userId, session?.user.id!));
  const t = rows.map((r) => ({ ...r.templateEntry, template: r.template }));
  return { templateEntries: t };
};

export const getTemplateEntryById = async (id: TemplateEntryId) => {
  const { session } = await getUserAuth();
  const { id: templateEntryId } = templateEntryIdSchema.parse({ id });
  const [row] = await db
    .select({ templateEntry: templateEntries, template: templates })
    .from(templateEntries)
    .where(and(eq(templateEntries.id, templateEntryId), eq(templateEntries.userId, session?.user.id!)))
    .leftJoin(templates, eq(templateEntries.templateId, templates.id));
  if (row === undefined) return {};
  const t = { ...row.templateEntry, template: row.template };
  return { templateEntry: t };
};
