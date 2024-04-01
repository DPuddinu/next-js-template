import { SidebarLink } from '@/components/SidebarItems';
import { Cog, Globe, HomeIcon } from 'lucide-react';

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: '/dashboard', title: 'Home', icon: HomeIcon },
  { href: '/settings', title: 'Settings', icon: Cog },
  { href: '/explore', title: 'Explore', icon: Globe },
  { href: '/templates', title: 'Templates', icon: Globe }
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Entities',
    links: [
      {
        href: '/template-entries',
        title: 'Template Entries',
        icon: Globe
      },
      {
        href: '/templates',
        title: 'Templates',
        icon: Globe
      }
    ]
  }
];
