import { api } from './api';
import { ModifierGroup, ModifierOption } from '@/types';

export type ModifierGroupWithWithOptions = ModifierGroup & { options: ModifierOption[] };

export const modifiersApi = {
  // Modifier Groups
  getAllGroups: async (): Promise<ModifierGroupWithWithOptions[]> => (await api.get('/modifiers/groups')).data,
  createGroup: async (data: Partial<ModifierGroup>): Promise<ModifierGroup> => (await api.post('/modifiers/groups', data)).data,
  updateGroup: async (id: string, data: Partial<ModifierGroup>): Promise<ModifierGroup> => (await api.patch(`/modifiers/groups/${id}`, data)).data,
  deleteGroup: (id: string): Promise<void> => api.delete(`/modifiers/groups/${id}`),

  // Modifier Options
  createOption: async (data: Partial<ModifierOption> & { groupId: string }): Promise<ModifierOption> => (await api.post('/modifiers/options', data)).data,
  updateOption: async (id: string, data: Partial<ModifierOption>): Promise<ModifierOption> => (await api.patch(`/modifiers/options/${id}`, data)).data,
  deleteOption: (id: string): Promise<void> => api.delete(`/modifiers/options/${id}`),

  // Product Modifier Groups
  updateProductModifierGroups: (productId: string, modifierGroupIds: string[]): Promise<void> =>
    api.post(`/products/${productId}/modifier-groups`, { modifierGroupIds }),
};
