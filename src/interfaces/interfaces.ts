import type { UserRole } from '@/constants/constants';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface BoardItem {
    id: string;
    title: string;
    description: string;
    columnCount: number;
    taskCount: number;
    labelCount: number;
    members: string[];
    createdAt: string;
    updatedAt: string;
}
