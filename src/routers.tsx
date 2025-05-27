import ProtectedRoute from '@/components/common/ProtectedRoute';
import Header from '@/components/Header';
import { UserRole } from '@/constants/constants';
import AuthPage from '@/pages/AuthPage';
import UserBoardsPage from '@/pages/UserBoardsPage';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: 'auth',
        element: (
            <ProtectedRoute roles={[UserRole.Guest]}>
                <Outlet />
            </ProtectedRoute>
        ),
        children: [{ path: '', element: <AuthPage /> }],
    },
    {
        path: '',
        element: (
            <ProtectedRoute roles={[UserRole.Customer]}>
                <Header />
                <Outlet />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '',
                element: <Navigate to="boards" replace />,
            },
            { path: 'boards', element: <UserBoardsPage /> },
        ],
    },
]);

export default router;
