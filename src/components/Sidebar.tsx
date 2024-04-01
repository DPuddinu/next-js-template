
import SidebarItems from './SidebarItems';

import { getUserAuth } from '@/lib/auth/utils';

const Sidebar = async () => {
  const session = await getUserAuth();
  if (session.session === null) return null;

  return (
    <aside className="hidden h-screen min-w-52 border-r border-border bg-muted p-4 pt-8 shadow-inner md:block">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4">
          <h3 className="ml-4 text-lg font-semibold">Logo</h3>
          <SidebarItems />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

