export const UserRole = {
    Guest: '',
    Customer: 'User',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
