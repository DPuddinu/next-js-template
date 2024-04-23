import { SidebarLink } from '@/components/SidebarItems';
import { Cog, HomeIcon } from 'lucide-react';

export const defaultLinks: SidebarLink[] = [
  { href: '/', title: 'Home', icon: HomeIcon },
  { href: '/settings', title: 'Settings', icon: Cog }
];
