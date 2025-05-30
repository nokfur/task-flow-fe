import useAxios from '@/hooks/axios-client';
import type {
    BoardAddRequest,
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
        boards: {
            getOwn: () => axiosClient.get('/boards'),
            addBoard: (payload: BoardAddRequest) =>
                axiosClient.post('/boards', payload),
        },
        users: {
            search: (query: string, exceptIds: string[]) =>
                axiosClient.post(`/users?search=${query}`, exceptIds),
        },
    };
};

export default useApiEndpoints;
