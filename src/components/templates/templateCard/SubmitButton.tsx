'use client';
import { Star } from 'lucide-react';
import { useState } from 'react';

type Props = {
  selected: boolean;
};
const StarIcon = ({ selected }: Props) => {
  const [ liked, setLiked ] = useState(selected)
  
  return (
    <button type="submit" onClick={() => setLiked(liked => !liked)}>
      <Star
        fill={liked ? 'yellow' : ''}
        stroke={liked ? 'yellow' : 'white'}
      />
    </button>
  );
};

export default StarIcon;
