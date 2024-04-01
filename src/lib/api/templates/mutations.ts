import { getPageSession } from '@/lib/auth/lucia';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db/index';
import {
  NewTemplateParams,
  TemplateId,
  UpdateTemplateParams,
  insertTemplateSchema,
  templateIdSchema,
  templates,
  updateTemplateSchema,
  usersToTemplates
} from '@/lib/db/schema/templates';
import { and, eq } from 'drizzle-orm';
import { getTemplatesByUserId } from './queries';

export const createTemplate = async (template: NewTemplateParams) => {
  const newTemplate = insertTemplateSchema.parse({
    ...template
  });
  try {
    const [t] = await db.insert(templates).values(newTemplate).returning();
    return { template: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
export const assignTemplateToUser = async (templateId: TemplateId) => {
  const { user } = await getPageSession();

  try {
    const { templates } = await getTemplatesByUserId(user.id);

    if (templates?.find((t) => t.id === templateId)) {
      const data = await db
        .delete(usersToTemplates)
        .where(and(eq(usersToTemplates.userId, user.id), eq(usersToTemplates.templateId, templateId)))
        .returning();

      return {
        deleted: data
      };
    }

    const [t] = await db
      .insert(usersToTemplates)
      .values({
        templateId,
        userId: user.id
      })
      .returning();
    return { added: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
export const updateTemplate = async (id: TemplateId, template: UpdateTemplateParams) => {
  const { session } = await getUserAuth();
  const { id: templateId } = templateIdSchema.parse({ id });
  const newTemplate = updateTemplateSchema.parse({
    ...template,
    userId: session?.user.id!
  });
  try {
    const [t] = await db
      .update(templates)
      .set({
        ...newTemplate,
        updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
      })
      .where(eq(templates.id, templateId!))
      .returning();
    return { template: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteTemplate = async (id: TemplateId) => {
  const { id: templateId } = templateIdSchema.parse({ id });
  try {
    const [t] = await db.delete(templates).where(eq(templates.id, templateId!)).returning();
    return { template: t };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
