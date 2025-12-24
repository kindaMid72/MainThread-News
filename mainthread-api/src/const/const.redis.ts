export const REDIS_KEY = {
    USERS_ACCESS: 'users_access',
    ADMIN_ID: (userId: string) => `admin_id:${userId}`,
    USER_ID: (userId: string) => `user_id:${userId}`,
    CATEGORIES: 'categories',
    TAGS: 'tags',
} as const;