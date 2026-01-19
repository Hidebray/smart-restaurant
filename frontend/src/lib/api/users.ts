import { api } from '@/lib/api/api';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
}

export interface CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface UpdateUserDto {
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
}

export const usersApi = {
    getAll: async (role?: string): Promise<User[]> => {
        const response = await api.get('/users', {
            params: { role },
        });
        return response.data;
    },

    create: async (data: CreateUserDto): Promise<User> => {
        const response = await api.post('/users', data);
        return response.data;
    },

    update: async (id: string, data: UpdateUserDto): Promise<User> => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};
