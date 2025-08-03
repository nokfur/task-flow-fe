import SideNavWrapper from '@/components/common/sidenav/SideNavWrapper';
import { useState, type ReactNode } from 'react';
import SideNavSection from '@/components/common/sidenav/SideNavSection';
import SideNavItem from '@/components/common/sidenav/SideNavItem';
import { IconBrandSamsungpass, IconUserCog } from '@tabler/icons-react';

const UserProfileLayout: React.FC<{ children?: ReactNode }> = ({
    children,
}) => {
    const [isCollapsed, setCollapsed] = useState(false);

    return (
        <div className="flex grow">
            <SideNavWrapper
                isCollapsed={isCollapsed}
                handleCollapsed={setCollapsed}>
                <SideNavSection title="Personal Settings">
                    <SideNavItem icon={<IconUserCog />} title="Profile" to="" />
                    <SideNavItem
                        icon={<IconBrandSamsungpass />}
                        title="Change Password"
                        to="password"
                    />
                </SideNavSection>
            </SideNavWrapper>

            <div
                className={`w-0 flex-auto grow duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <div className="flex h-full px-6 py-8 md:px-12">{children}</div>
            </div>
        </div>
    );
};

export default UserProfileLayout;
