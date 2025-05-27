import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from '@/routers';
import { GlobalStyles, StyledEngineProvider } from '@mui/material';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyledEngineProvider enableCssLayer>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
            <ToastContainer
                position="top-right"
                closeButton={false}
                closeOnClick
                autoClose={3000}
            />
        </StyledEngineProvider>
    </StrictMode>,
);
