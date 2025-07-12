import Header from '@/components/user/Header';
import React, { type ReactNode } from 'react';

const UserLayout: React.FC<{ children?: ReactNode }> = ({ children }) => {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
};

export default UserLayout;
