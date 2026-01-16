import { api } from './api';
import { ModifierGroup, ModifierOption } from '@/types';

export type ModifierGroupWithWithOptions = ModifierGroup & { options: ModifierOption[] };

export const modifiersApi = {
  // Modifier Groups
  getAllGroups: async (): Promise<ModifierGroupWithWithOptions[]> => (await api.get('/modifiers/groups')).data,
  createGroup: (data: Partial<ModifierGroup>): Promise<ModifierGroup> => api.post('/modifiers/groups', data),
  updateGroup: (id: string, data: Partial<ModifierGroup>): Promise<ModifierGroup> => api.patch(`/modifiers/groups/${id}`, data),
  deleteGroup: (id: string): Promise<void> => api.delete(`/modifiers/groups/${id}`),

  // Modifier Options
  createOption: (data: Partial<ModifierOption> & { groupId: string }): Promise<ModifierOption> => api.post('/modifiers/options', data),
  updateOption: (id: string, data: Partial<ModifierOption>): Promise<ModifierOption> => api.patch(`/modifiers/options/${id}`, data),
  deleteOption: (id: string): Promise<void> => api.delete(`/modifiers/options/${id}`),

  // Product Modifier Groups
  updateProductModifierGroups: (productId: string, modifierGroupIds: string[]): Promise<void> =>
    api.post(`/products/${productId}/modifier-groups`, { modifierGroupIds }),
};
