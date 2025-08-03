import { UserRole } from '@/constants/constants';
import { useAuthProvider } from '@/contexts/AuthContext';
import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
    roles?: UserRole[];
    children?: ReactNode;
}

const roleRedirectPath: Record<UserRole, string> = {
    [UserRole.Guest]: '/auth',
    [UserRole.Customer]: '/',
    [UserRole.Admin]: '/admin',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    roles = [],
    children,
}) => {
    const { user } = useAuthProvider();
    const location = useLocation();

    const userRole: UserRole = user?.role || UserRole.Guest;

    // User is authorized
    if (roles.includes(userRole)) {
        return <>{children}</>;
    }

    // User is unauthorized for this route
    const redirectPath = roleRedirectPath[userRole];

    if (userRole === UserRole.Guest) {
        // Build redirect query parameter for guests going to login
        const redirectQuery = `redirect=${encodeURIComponent(
            `${location.pathname}${location.search}`,
        )}`;
        const redirectUrl = `${redirectPath}?${redirectQuery}`;
        return <Navigate to={redirectUrl} />;
    }

    // For non-guests, check if we should use a redirect from query params
    const searchParams = new URLSearchParams(location.search);
    const storedRedirect = searchParams.get('redirect');

    return <Navigate to={storedRedirect || redirectPath} />;
};

export default ProtectedRoute;
