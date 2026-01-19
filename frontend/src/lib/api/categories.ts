import { api } from "@/lib/api/api";

export type Category = {
    id: string;
    name: string;
    description?: string;
    displayOrder: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CategoryDto = {
    name: string;
    description?: string;
    displayOrder?: number;
    isActive?: boolean;
};

export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get("/categories");
        return response.data;
    },

    getById: async (id: string): Promise<Category> => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    create: async (data: CategoryDto): Promise<Category> => {
        const response = await api.post("/categories", data);
        return response.data;
    },

    update: async (id: string, data: Partial<CategoryDto>): Promise<Category> => {
        const response = await api.patch(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/categories/${id}`);
    },
};
