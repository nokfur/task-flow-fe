import { useAuthProvider } from '@/contexts/AuthContext';
import axios from 'axios';
import { useLayoutEffect } from 'react';
import { toast } from 'react-toastify';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    // timeout: 10000,
});

const useAxios = () => {
    const { token, handleLogout } = useAuthProvider();

    useLayoutEffect(() => {
        const requestInterceptor = axiosClient.interceptors.request.use(
            (config) => {
                config.headers.Authorization = token
                    ? `Bearer ${token}`
                    : config.headers.Authorization;
                // config.headers['Content-Type'] = 'application/json';

                return config;
            },
        );

        const responseInterceptor = axiosClient.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                let errorMessage;

                if (error.response) {
                    if (error.response.status === 401) {
                        handleLogout();
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.errors) {
                        const errorMessages = Object.values(
                            error.response.data.errors,
                        ).map((value) =>
                            Array.isArray(value) ? value.join('\n') : value,
                        );
                        errorMessage = errorMessages.join('\n');
                    }
                } else {
                    errorMessage = error.message || 'Unknown error';
                }

                if (errorMessage) {
                    if (!error._toast) {
                        error._toast = true;
                        toast.error(errorMessage, {
                            autoClose: 3000,
                        });
                    }
                }

                return Promise.reject(error);
            },
        );

        return () => {
            axiosClient.interceptors.request.eject(requestInterceptor);
            axiosClient.interceptors.response.eject(responseInterceptor);
        };
    }, [token, handleLogout]);

    return axiosClient;
};

export default useAxios;
