import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTemplateByIdWithTemplateEntries } from "@/lib/api/templates/queries";
import { checkAuth } from "@/lib/auth/utils";
import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function TemplatePage({
  params,
}: {
  params: { templateId: string };
}) {

  return (
    <main className="overflow-auto">
      <Template id={params.templateId} />
    </main>
  );
}

const Template = async ({ id }: { id: string }) => {
  await checkAuth();

  const { template, templateEntries } = await getTemplateByIdWithTemplateEntries(id);
  

  if (!template) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="templates" />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{template.name}&apos;s Template Entries</h3>
      </div>
    </Suspense>
  );
};
