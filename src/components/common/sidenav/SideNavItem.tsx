import React, { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSideNavContext } from './SideNavWrapper';
import { Button } from '@mui/material';

const SideNavItem: React.FC<{
    type?: 'button' | 'link';
    to?: string;
    onClick?: () => void;
    icon: ReactNode;
    title?: string;
}> = ({ type = 'link', to = '/', onClick = () => {}, icon, title }) => {
    const isSideNavCollapsed = useSideNavContext();
    const location = useLocation();

    return type === 'button' ? (
        <Button
            className={`flex w-full items-center justify-start rounded-lg p-2 text-left text-gray-500 normal-case transition duration-200 hover:bg-gray-200 ${
                isSideNavCollapsed
                    ? 'flex-col items-center justify-center gap-2'
                    : 'gap-3'
            }`}
            onClick={onClick}>
            {React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                    className:
                        `${(icon as React.ReactElement<{ className?: string }>).props.className || ''} ${isSideNavCollapsed ? 'size-4' : ''}`.trim(),
                },
            )}
            <span
                className={`text-center font-medium ${isSideNavCollapsed ? 'text-xs' : ''}`}>
                {title}
            </span>
        </Button>
    ) : (
        <Button
            component={Link}
            to={to}
            className={`flex items-center justify-start rounded-lg p-2 normal-case transition duration-200 hover:bg-gray-200 ${
                location.pathname.includes(to)
                    ? 'bg-green-100 text-green-600'
                    : 'text-gray-500'
            } ${
                isSideNavCollapsed
                    ? 'flex-col items-center justify-center gap-2'
                    : 'gap-3'
            }`}>
            {React.cloneElement(
                icon as React.ReactElement<{ className?: string }>,
                {
                    className:
                        `${(icon as React.ReactElement<{ className?: string }>).props.className || ''} ${isSideNavCollapsed ? 'size-4' : ''}`.trim(),
                },
            )}
            <span
                className={`text-center font-medium ${isSideNavCollapsed ? 'text-xs' : ''}`}>
                {title}
            </span>
        </Button>
    );
};

export default SideNavItem;
