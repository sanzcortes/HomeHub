import axios from 'axios';
import type {
  Ingredient,
  Dish,
  WeeklyPlan,
  ManualItem,
  ShoppingList,
  CreateDishData,
  CreateWeeklyPlanData,
  CreateManualItemData,
  MealTemplate,
  WeekTemplate,
  CreateMealTemplateData,
  CreateWeekTemplateData,
} from '../types';

const api = axios.create({
  baseURL: '/api',
});

export const ingredientsApi = {
  getAll: () => api.get<Ingredient[]>('/ingredients').then((res) => res.data),
  create: (data: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Ingredient>('/ingredients', data).then((res) => res.data),
  update: (id: string, data: Partial<Ingredient>) =>
    api.put<Ingredient>(`/ingredients/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/ingredients/${id}`),
};

export const dishesApi = {
  getAll: () => api.get<Dish[]>('/dishes').then((res) => res.data),
  create: (data: CreateDishData) =>
    api.post<Dish>('/dishes', data).then((res) => res.data),
  update: (id: string, data: CreateDishData) =>
    api.put<Dish>(`/dishes/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/dishes/${id}`),
};

export const weeklyPlansApi = {
  getAll: (weekStart?: string) =>
    api.get<WeeklyPlan[]>('/weekly-plans', {
      params: weekStart ? { weekStart } : undefined,
    }).then((res) => res.data),
  create: (data: CreateWeeklyPlanData) =>
    api.post<WeeklyPlan>('/weekly-plans', data).then((res) => res.data),
  delete: (id: string) => api.delete(`/weekly-plans/${id}`),
};

export const shoppingListApi = {
  get: (weekStart: string) =>
    api.get<ShoppingList>('/shopping-list', {
      params: { weekStart },
    }).then((res) => res.data),
};

export const manualItemsApi = {
  getAll: (weekStart?: string) =>
    api.get<ManualItem[]>('/manual-items', {
      params: weekStart ? { weekStart } : undefined,
    }).then((res) => res.data),
  create: (data: CreateManualItemData) =>
    api.post<ManualItem>('/manual-items', data).then((res) => res.data),
  update: (id: string, checked: boolean) =>
    api.patch<ManualItem>(`/manual-items/${id}`, { checked }).then((res) => res.data),
  delete: (id: string) => api.delete(`/manual-items/${id}`),
};

export const mealTemplatesApi = {
  getAll: () => api.get<MealTemplate[]>('/meal-templates').then((res) => res.data),
  create: (data: CreateMealTemplateData) =>
    api.post<MealTemplate>('/meal-templates', data).then((res) => res.data),
  delete: (id: string) => api.delete(`/meal-templates/${id}`),
};

export const weekTemplatesApi = {
  getAll: () => api.get<WeekTemplate[]>('/week-templates').then((res) => res.data),
  create: (data: CreateWeekTemplateData) =>
    api.post<WeekTemplate>('/week-templates', data).then((res) => res.data),
  delete: (id: string) => api.delete(`/week-templates/${id}`),
};
