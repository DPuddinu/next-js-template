import { getTemplatesByUserId } from '@/lib/api/templates/queries';
import { getPageSession } from '@/lib/auth/lucia';
import StarIcon from './SubmitButton';
import { assignTemplateAction } from '@/lib/actions/templates';

type Props = {
  templateId: string;
};
const AssignTemplateForm = async ({ templateId }: Props) => {
  
  const { user } = await getPageSession();
  const { templates } = await getTemplatesByUserId(user.id);
  
  const liked = templates?.find((t) => t.id === templateId);
  const assignTemplateToUser = assignTemplateAction.bind(null, templateId);

  return (
    <form action={assignTemplateToUser}>
      <StarIcon selected={!!liked} />
    </form>
  );
};

export default AssignTemplateForm;
