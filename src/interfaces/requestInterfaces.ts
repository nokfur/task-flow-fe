import type { BoardMemberRole, TaskPriority } from '@/constants/constants';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface ProfileUpdateRequest {
    name: string;
}

export interface BoardAddRequest {
    title: string;
    description: string;
    templateId: string;
    boardMembers: BoardMemberRequest[];
}

export interface BoardMemberRequest {
    memberId: string;
    role: BoardMemberRole;
}

export interface ColumnAddRequest {
    title: string;
}

export interface ColumnUpdateRequest {
    title: string;
}

export interface ColumnPositionUpdateRequest {
    id: string;
    position: number;
}

export interface TaskAddRequest {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate: Date | null;
}

export interface TaskUpdateRequest {
    title: string;
    description?: string;
    priority: TaskPriority;
    dueDate: Date | null;
}

export interface TaskReorderUpdateRequest {
    taskId: string;
    sourceColumnId: string;
    targetColumnId: string;
    targetIndex: number;
}

export interface LabelAddRequest {
    name: string;
    color: string;
}

export interface LabelUpdateRequest {
    name: string;
    color: string;
}
