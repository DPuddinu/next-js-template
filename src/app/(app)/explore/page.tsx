import Loading from '@/app/loading';
import TemplateCard from '@/components/templates/templateCard/TemplateCard';
import { getTemplates } from '@/lib/api/templates/queries';
import { Suspense } from 'react';

export const revalidate = 0;
const Explore = async () => {
  
  return (
    <main>
      <div className="flex justify-between">
        <h1 className="my-2 text-2xl font-semibold">Templates</h1>
      </div>
      <Templates />
    </main>
  );
};

export default Explore;

const Templates = async () => {
  const { templates } = await getTemplates();

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-wrap gap-2">
        {templates?.map((template) => <TemplateCard key={template.id} template={template} assigned={false} />)}
      </div>
    </Suspense>
  );
};
