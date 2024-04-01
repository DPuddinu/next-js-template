import { Suspense } from "react";
import Loading from "@/app/loading";
import { getTemplatesByUserId } from "@/lib/api/templates/queries";
import { getPageSession } from "@/lib/auth/lucia";
import TemplateCard from "@/components/templates/templateCard/TemplateCard";

export const revalidate = 60;

export default async function TemplatesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Templates</h1>
        </div>
        <Templates />
      </div>
    </main>
  );
}

const Templates = async () => {
  const {user} = await getPageSession();
  
  const { templates } = await getTemplatesByUserId(user.id); 
  
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-wrap gap-2">
        {templates?.map((template) => (
          <TemplateCard key={template.id} template={template} assigned/>
        ))}
      </div>
    </Suspense>
  );
};
