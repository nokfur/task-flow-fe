import { Button } from '@mui/material';
import { IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import React, { createContext, type ReactNode, useContext } from 'react';

const SideNavContext = createContext(false);

const SideNavWrapper: React.FC<{
    children?: ReactNode;
    title?: string;
    logoSrc?: string;
    isCollapsed?: boolean;
    handleCollapsed?: (isCollapsed: boolean) => void;
}> = ({
    children,
    title,
    logoSrc,
    isCollapsed = false,
    handleCollapsed = () => {},
}) => {
    const toggleSidebar = () => {
        handleCollapsed(!isCollapsed);
    };

    return (
        <SideNavContext.Provider value={isCollapsed}>
            <aside
                className={`fixed flex h-screen flex-col border-r border-gray-200 bg-white shadow-lg duration-300 ${
                    isCollapsed ? 'w-20' : 'w-64'
                } `}>
                {/* Sidebar Header with Logo */}
                <div
                    className={`flex flex-col items-center justify-center gap-2 p-4 pb-0`}>
                    {logoSrc && (
                        <div className="max-w-20">
                            <img src={logoSrc} />
                        </div>
                    )}
                    {title && (
                        <p
                            className={`font-medium ${isCollapsed && 'text-sm'}`}>
                            {title}
                        </p>
                    )}
                </div>

                {/* Sidebar Content */}
                <div className={`flex-1 ${isCollapsed ? 'p-1' : 'p-4'}`}>
                    <div className="flex flex-col gap-4">
                        {/* Nav Section */}
                        {children}
                    </div>
                </div>

                {/* Sidebar Toggle Button */}
                <div className="absolute top-[5%] right-0 translate-x-1/2 transform">
                    {/* <button
                        onClick={toggleSidebar}
                        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white shadow-md outline-none">
                        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                    </button> */}
                    <Button
                        onClick={toggleSidebar}
                        className="h-8 w-8 min-w-8 rounded-full border border-gray-300 bg-white text-gray-700 shadow-md">
                        {isCollapsed ? (
                            <IconChevronsRight />
                        ) : (
                            <IconChevronsLeft />
                        )}
                    </Button>
                </div>
            </aside>
        </SideNavContext.Provider>
    );
};

export default SideNavWrapper;

export const useSideNavContext = () => {
    return useContext(SideNavContext);
};
