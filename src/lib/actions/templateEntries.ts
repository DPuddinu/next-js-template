'use server';

import { createTemplateEntry, deleteTemplateEntry, updateTemplateEntry } from '@/lib/api/templateEntries/mutations';
import {
  NewTemplateEntryParams,
  TemplateEntryId,
  UpdateTemplateEntryParams,
  insertTemplateEntryParams,
  templateEntryIdSchema,
  updateTemplateEntryParams
} from '@/lib/db/schema/templateEntries';
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

const revalidateTemplateEntries = () => revalidatePath('/template-entries');

export const createTemplateEntryAction = async (input: NewTemplateEntryParams) => {
  try {
    const payload = insertTemplateEntryParams.parse(input);
    await createTemplateEntry(payload);
    revalidateTemplateEntries();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateTemplateEntryAction = async (input: UpdateTemplateEntryParams) => {
  try {
    const payload = updateTemplateEntryParams.parse(input);
    await updateTemplateEntry(payload.id, payload);
    revalidateTemplateEntries();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteTemplateEntryAction = async (input: TemplateEntryId) => {
  try {
    const payload = templateEntryIdSchema.parse({ id: input });
    await deleteTemplateEntry(payload.id);
    revalidateTemplateEntries();
  } catch (e) {
    return handleErrors(e);
  }
};
