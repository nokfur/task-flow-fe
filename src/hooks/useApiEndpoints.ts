import useAxios from '@/hooks/axios-client';
import type {
    LoginRequest,
    RegisterRequest,
} from '@/interfaces/requestInterfaces';

const useApiEndpoints = () => {
    const axiosClient = useAxios();

    return {
        auth: {
            login: (payload: LoginRequest) =>
                axiosClient.post('/auth/login', payload),
            register: (payload: RegisterRequest) =>
                axiosClient.post('/auth/register', payload),
        },
    };
};

export default useApiEndpoints;
