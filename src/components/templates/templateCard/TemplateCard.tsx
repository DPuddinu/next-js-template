'use client'
import { assignTemplateAction } from '@/lib/actions/templates';
import { Template } from '@/lib/db/schema/templates';
import { Star } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

type Props = {
  template: Template;
  assigned: boolean;
};
const TemplateCard = ({ template, assigned }: Props) => {
  const { color, description, name } = template;
  const [liked, setLiked] = useState(assigned);
  const [ isLoading, setIsLoading ] = useState(false);
  
  return (
    <Card className={`max-w-xs `}>
      <CardHeader className="rounded-t-lg">
        <CardTitle>
          <div className="flex justify-between">
            <p>{name}</p>
            <button onClick={async () => {
              setIsLoading(true);
              setLiked((liked) => !liked);
              await assignTemplateAction(template.id)
              setIsLoading(false);

            }}>
              <Star fill={liked ? 'yellow' : ''} stroke={liked ? 'yellow' : 'white'} />
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center rounded-b-lg">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti corporis harum enim aspernatur et tempore
          id nisi eveniet perferendis dolore.
        </p>
        {/* <p>{description}</p> */}
      </CardContent>
    </Card>
  );
};

export default TemplateCard;
