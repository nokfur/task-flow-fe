import React, { type ReactNode } from 'react';
import { useSideNavContext } from './SideNavWrapper';

const SideNavSection: React.FC<{
    children?: ReactNode;
    title?: string;
}> = ({ children, title }) => {
    const isSideNavCollapsed = useSideNavContext();

    return (
        <div>
            {title && (
                <h3
                    className={`mb-2 text-xs font-semibold ${
                        isSideNavCollapsed ? 'hidden' : 'text-gray-500'
                    }`}>
                    {title}
                </h3>
            )}
            <div className="flex flex-col gap-1">{children}</div>
        </div>
    );
};

export default SideNavSection;
