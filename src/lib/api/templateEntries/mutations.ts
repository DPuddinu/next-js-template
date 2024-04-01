import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db/index';
import {
  NewTemplateEntryParams,
  TemplateEntryId,
  UpdateTemplateEntryParams,
  insertTemplateEntrySchema,
  templateEntries,
  templateEntryIdSchema,
  updateTemplateEntrySchema
} from '@/lib/db/schema/templateEntries';
import { and, eq } from 'drizzle-orm';

export const createTemplateEntry = async (templateEntry: NewTemplateEntryParams) => {
  const { session } = await getUserAuth();
  const newTemplateEntry = insertTemplateEntrySchema.parse({
    ...templateEntry,
    userId: session?.user.id!
  });
  try {
    const [t] = await db.insert(templateEntries).values(newTemplateEntry).returning();
    return { templateEntry: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateTemplateEntry = async (id: TemplateEntryId, templateEntry: UpdateTemplateEntryParams) => {
  const { session } = await getUserAuth();
  const { id: templateEntryId } = templateEntryIdSchema.parse({ id });
  const newTemplateEntry = updateTemplateEntrySchema.parse({
    ...templateEntry,
    userId: session?.user.id!
  });
  try {
    const [t] = await db
      .update(templateEntries)
      .set(newTemplateEntry)
      .where(and(eq(templateEntries.id, templateEntryId!), eq(templateEntries.userId, session?.user.id!)))
      .returning();
    return { templateEntry: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteTemplateEntry = async (id: TemplateEntryId) => {
  const { session } = await getUserAuth();
  const { id: templateEntryId } = templateEntryIdSchema.parse({ id });
  try {
    const [t] = await db
      .delete(templateEntries)
      .where(and(eq(templateEntries.id, templateEntryId!), eq(templateEntries.userId, session?.user.id!)))
      .returning();
    return { templateEntry: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
