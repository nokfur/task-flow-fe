import TemplateBoardManagementPage from '@/pages/admin/TemplateBoardManagementPage';
import PageWrapper from '@/components/common/PageWrapper';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { UserRole } from '@/constants/constants';
import AdminLayout from '@/components/layout/AdminLayout';
import AuthPage from '@/pages/AuthPage';
import UserBoardCreatePage from '@/pages/user/UserBoardCreatePage';
import UserBoardsPage from '@/pages/user/UserBoardsPage';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import TemplateBoardCreatePage from '@/pages/admin/TemplateBoardCreatePage';
import UserLayout from '@/components/layout/UserLayout';
import TemplateBoardUpdatePage from '@/pages/admin/TemplateBoardUpdatePage';

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
