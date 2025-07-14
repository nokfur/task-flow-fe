import { type ReactNode, useState } from 'react';
import logo from '@/assets/images/logo.png';
import { useAuthProvider } from '@/contexts/AuthContext';
import SideNavWrapper from '@/components/common/sidenav/SideNavWrapper';
import SideNavSection from '@/components/common/sidenav/SideNavSection';
import SideNavItem from '@/components/common/sidenav/SideNavItem';
import {
    IconBrandSamsungpass,
    IconLogout,
    IconTable,
    IconUserCog,
} from '@tabler/icons-react';

const AdminLayout: React.FC<{ children?: ReactNode }> = ({ children }) => {
    document.title = 'Admin';

    const { handleLogout, user } = useAuthProvider();
    const [isCollapsed, setCollapsed] = useState(false);

    return (
        <div className="flex">
            <SideNavWrapper
                isCollapsed={isCollapsed}
                handleCollapsed={setCollapsed}
                logoSrc={logo}>
                <SideNavSection title="MANAGEMENT">
                    <SideNavItem
                        icon={<IconTable />}
                        title="Template Boards"
                        to="/admin/template-boards"
                    />
                    <SideNavItem
                        icon={<IconUserCog />}
                        title="Users"
                        to="/admin/users"
                    />
                </SideNavSection>
                <SideNavSection title="SECURITY">
                    <SideNavItem
                        icon={<IconBrandSamsungpass />}
                        title="Change Password"
                        to="/admin/change-password"
                    />
                </SideNavSection>
                <SideNavSection>
                    <SideNavItem
                        icon={<IconLogout />}
                        title="Log out"
                        onClick={handleLogout}
                        type="button"
                    />
                </SideNavSection>
            </SideNavWrapper>

            <div
                className={`w-0 flex-auto duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <div>
                    <div className="hidden border-b border-gray-200 py-4">
                        <p className="text-center text-lg font-semibold">
                            Welcome, {user?.name}!
                        </p>
                    </div>
                    <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
