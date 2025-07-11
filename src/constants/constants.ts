export const UserRole = {
    Guest: '',
    Customer: 'User',
    Admin: 'Admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type BoardMemberRole = 'Owner' | 'Member' | 'Admin';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export const TaskPriorityColor: Record<TaskPriority, string> = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-amber-100 text-amber-800',
    Low: 'bg-green-100 text-green-800',
};
