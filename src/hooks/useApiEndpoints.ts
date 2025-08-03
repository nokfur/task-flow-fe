import type { BoardMemberRole } from '@/constants/constants';
import useAxios from '@/hooks/useAxios';
import type { Board } from '@/interfaces/interfaces';
import type {
    BoardAddRequest,
    BoardMemberRequest,
    ChangePasswordRequest,
    ColumnAddRequest,
    ColumnPositionUpdateRequest,
    ColumnUpdateRequest,
    LabelAddRequest,
    LabelUpdateRequest,
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
    TaskAddRequest,
    TaskReorderUpdateRequest,
    TaskUpdateRequest,
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
            getOwns: () => axiosClient.get('/boards'),
            getDetail: (boardId: string) =>
                axiosClient.get(`/boards/${boardId}`),
            add: (payload: BoardAddRequest) =>
                axiosClient.post('/boards', payload),
            update: (boardId: string, payload: Board) =>
                axiosClient.put(`/boards/${boardId}`, payload),
            delete: (boardId: string) =>
                axiosClient.delete(`/boards/${boardId}`),
            getTemplates: () => axiosClient.get('/boards/templates'),
        },
        columns: {
            add: (boardId: string, payload: ColumnAddRequest) =>
                axiosClient.post(`/boards/${boardId}/columns`, payload),
            update: (columnId: string, payload: ColumnUpdateRequest) =>
                axiosClient.put(`/columns/${columnId}`, payload),
            delete: (columnId: string) =>
                axiosClient.delete(`/columns/${columnId}`),
            updatePositions: (payload: ColumnPositionUpdateRequest[]) =>
                axiosClient.patch(`/columns/positions`, payload),
        },
        tasks: {
            add: (columnId: string, payload: TaskAddRequest) =>
                axiosClient.post(`/columns/${columnId}/tasks`, payload),
            update: (taskId: string, payload: TaskUpdateRequest) =>
                axiosClient.put(`/tasks/${taskId}`, payload),
            delete: (taskId: string) => axiosClient.delete(`/tasks/${taskId}`),
            deleteAll: (columnId: string) =>
                axiosClient.delete(`/columns/${columnId}/tasks`),
            toggleLabel: (taskId: string, labelId: string) =>
                axiosClient.patch(`/tasks/${taskId}/labels/${labelId}`),
            reorder: (payload: TaskReorderUpdateRequest) =>
                axiosClient.patch(`/tasks/reorder`, payload),
        },
        labels: {
            add: (boardId: string, payload: LabelAddRequest) =>
                axiosClient.post(`/boards/${boardId}/labels`, payload),
            update: (labelId: string, payload: LabelUpdateRequest) =>
                axiosClient.put(`/labels/${labelId}`, payload),
            delete: (labelId: string) =>
                axiosClient.delete(`/labels/${labelId}`),
        },
        users: {
            search: (query: string, exceptIds: string[]) =>
                axiosClient.post(`/users?search=${query}`, exceptIds),
            getProfile: () => axiosClient.get(`/users/me`),
            updateProfile: (payload: ProfileUpdateRequest) =>
                axiosClient.put(`/users/me`, payload),
            changePassword: (payload: ChangePasswordRequest) =>
                axiosClient.patch(`/users/password`, payload),
            getBoardMembers: (boardId: string) =>
                axiosClient.get(`/boards/${boardId}/members`),
            addBoardMembers: (boardId: string, payload: BoardMemberRequest[]) =>
                axiosClient.post(`/boards/${boardId}/members`, payload),
            deleteBoardMember: (boardId: string, memberId: string) =>
                axiosClient.delete(`/boards/${boardId}/members/${memberId}`),
            updateBoardMemberRole: (
                boardId: string,
                memberId: string,
                role: BoardMemberRole,
            ) =>
                axiosClient.patch(
                    `/boards/${boardId}/members/${memberId}/role`,
                    role,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    },
                ),
        },
        admin: {
            boards: {
                getTemplates: () => axiosClient.get('/admin/templates'),
                addTemplate: (payload: Board) =>
                    axiosClient.post('/admin/templates', payload),
            },
            users: {
                getAll: () => axiosClient.get('/admin/users'),
            },
        },
    };
};

export default useApiEndpoints;
