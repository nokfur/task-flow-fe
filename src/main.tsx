import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from '@/routers';
import {
    createTheme,
    GlobalStyles,
    StyledEngineProvider,
    ThemeProvider,
} from '@mui/material';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';

const THEME = createTheme({
    typography: {
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StyledEngineProvider enableCssLayer>
            <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
            <AuthProvider>
                <ThemeProvider theme={THEME}>
                    <AnimatePresence mode="wait">
                        <RouterProvider router={router} />
                    </AnimatePresence>
                </ThemeProvider>
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
