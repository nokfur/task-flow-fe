import UserHeader from '@/components/user/UserHeader';
import React, { type ReactNode } from 'react';

const UserLayout: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col">
            <UserHeader />
            {children}
        </div>
    );
};

export default UserLayout;
