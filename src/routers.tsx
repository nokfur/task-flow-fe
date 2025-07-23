import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '@/constants/constants';
import { lazy } from 'react';

const UserBoardUpdatePage = lazy(
    () => import('@/pages/user/boards/UserBoardUpdatePage'),
);
const TemplateBoardManagementPage = lazy(
    () => import('@/pages/admin/template-boards/TemplateBoardManagementPage'),
);
const PageWrapper = lazy(() => import('@/components/common/PageWrapper'));
const ProtectedRoute = lazy(() => import('@/components/common/ProtectedRoute'));
const AdminLayout = lazy(() => import('@/components/layout/AdminLayout'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const UserBoardCreatePage = lazy(
    () => import('@/pages/user/boards/UserBoardCreatePage'),
);
const UserBoardsPage = lazy(() => import('@/pages/user/boards/UserBoardsPage'));
const TemplateBoardCreatePage = lazy(
    () => import('@/pages/admin/template-boards/TemplateBoardCreatePage'),
);
const UserLayout = lazy(() => import('@/components/layout/UserLayout'));
const TemplateBoardUpdatePage = lazy(
    () => import('@/pages/admin/template-boards/TemplateBoardUpdatePage'),
);
const ChangePassword = lazy(() => import('@/components/user/ChangePassword'));
const UserManagementPage = lazy(
    () => import('@/pages/admin/users/UserManagementPage'),
);

const router = createBrowserRouter([
    {
        path: '',
        element: <PageWrapper />,
        children: [
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
                        <UserLayout>
                            <Outlet />
                        </UserLayout>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: '',
                        element: <Navigate to="boards" replace />,
                    },
                    {
                        path: 'boards',
                        element: <Outlet />,
                        children: [
                            {
                                path: '',
                                element: <UserBoardsPage />,
                            },
                            {
                                path: 'create',
                                element: <UserBoardCreatePage />,
                            },
                            {
                                path: ':boardId',
                                element: <UserBoardUpdatePage />,
                            },
                        ],
                    },
                ],
            },
            {
                path: 'admin',
                element: (
                    <ProtectedRoute roles={[UserRole.Admin]}>
                        <AdminLayout>
                            <Outlet />
                        </AdminLayout>
                    </ProtectedRoute>
                ),
                children: [
                    {
                        path: '',
                        element: <Navigate to="template-boards" replace />,
                    },
                    {
                        path: 'template-boards',
                        element: <Outlet />,
                        children: [
                            {
                                path: '',
                                element: <TemplateBoardManagementPage />,
                            },
                            {
                                path: 'create',
                                element: <TemplateBoardCreatePage />,
                            },
                            {
                                path: ':boardId',
                                element: <TemplateBoardUpdatePage />,
                            },
                        ],
                    },
                    { path: 'change-password', element: <ChangePassword /> },
                    { path: 'users', element: <UserManagementPage /> },
                ],
            },
            {
                path: '*',
                element: (
                    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4">
                        <p className="text-4xl font-semibold text-red-500">
                            Page not found
                        </p>
                        <a
                            href="/"
                            className="text-2xl font-semibold text-teal-500 underline hover:text-teal-600">
                            Go back
                        </a>
                    </div>
                ),
            },
        ],
    },
]);

export default router;
