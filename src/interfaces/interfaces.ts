import type {
    BoardMemberRole,
    TaskPriority,
    UserRole,
} from '@/constants/constants';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface UserDetail {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt: string;
}

export interface BoardGeneral {
    id: string;
    title: string;
    description: string;
    columnCount: number;
    taskCount: number;
    labelCount: number;
    members: User[];
    createdAt: string;
    updatedAt: string;
    isOwn: boolean;
}

export interface BoardMember {
    id: string;
    name: string;
    email: string;
    role: BoardMemberRole;
}

export interface UserSearch {
    id: string;
    name: string;
    email: string;
}

export interface Board {
    id: string;
    title: string;
    description: string;
    columns: Column[];
    labels: Label[];
}

export interface Label {
    id: string;
    name: string;
    color: string;
}

export interface Column {
    id: string;
    title: string;
    position?: number;
    tasks: Task[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    position?: number;
    priority: TaskPriority;
    dueDate: Date | null;
    labels: Label[];
}
