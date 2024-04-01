'use server';

import { assignTemplateToUser, createTemplate, deleteTemplate, updateTemplate } from '@/lib/api/templates/mutations';
import {
  NewTemplateParams,
  TemplateId,
  UpdateTemplateParams,
  insertTemplateParams,
  templateIdSchema,
  updateTemplateParams
} from '@/lib/db/schema/templates';
import { revalidatePath } from 'next/cache';

const handleErrors = (e: unknown) => {
  const errMsg = 'Error, please try again.';
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === 'object' && 'error' in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};
export async function assignTemplateAction(templateId: TemplateId) {
  await assignTemplateToUser(templateId);
  revalidatePath('/explore');
}
const revalidateTemplates = () => revalidatePath('/templates');

export const createTemplateAction = async (input: NewTemplateParams) => {
  try {
    const payload = insertTemplateParams.parse(input);
    await createTemplate(payload);
    revalidateTemplates();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTemplateAction = async (input: UpdateTemplateParams) => {
  try {
    const payload = updateTemplateParams.parse(input);
    await updateTemplate(payload.id, payload);
    revalidateTemplates();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTemplateAction = async (input: TemplateId) => {
  try {
    const payload = templateIdSchema.parse({ id: input });
    await deleteTemplate(payload.id);
    revalidateTemplates();
  } catch (e) {
    return handleErrors(e);
  }
};
