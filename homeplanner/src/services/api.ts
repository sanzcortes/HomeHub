import { supabase } from '../lib/supabase';
import type { Ingredient, Dish, WeeklyPlan, ManualItem, ShoppingList, CreateDishData, CreateWeeklyPlanData, CreateManualItemData, MealTemplate, WeekTemplate, CreateMealTemplateData, CreateWeekTemplateData } from '../types';

export const ingredientsApi = {
  getAll: async (): Promise<Ingredient[]> => {
    const { data, error } = await supabase.from('ingredients').select('*').order('category').order('name');
    if (error) throw error;
    return data;
  },
  
  create: async (data: Partial<Ingredient>): Promise<Ingredient> => {
    const { data: result, error } = await supabase.from('ingredients').insert(data).select().single();
    if (error) throw error;
    return result;
  },
  
  update: async (id: string, data: Partial<Ingredient>): Promise<Ingredient> => {
    const { data: result, error } = await supabase.from('ingredients').update(data).eq('id', id).select().single();
    if (error) throw error;
    return result;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('ingredients').delete().eq('id', id);
    if (error) throw error;
  },
};

export const dishesApi = {
  getAll: async (): Promise<Dish[]> => {
    const { data: dishes, error } = await supabase.from('dishes').select('*').order('name');
    if (error) throw error;
    
    const dishesWithIngredients = await Promise.all(
      dishes.map(async (dish) => {
        const { data: ingredients } = await supabase
          .from('recipe_ingredients')
          .select('*, ingredient:ingredients(*)')
          .eq('dish_id', dish.id);
        return { ...dish, ingredients: ingredients || [] };
      })
    );
    
    return dishesWithIngredients as Dish[];
  },
  
  create: async (data: CreateDishData): Promise<Dish> => {
    const { data: dish, error } = await supabase.from('dishes').insert({
      name: data.name,
      description: data.description,
    }).select().single();
    if (error) throw error;
    
    for (const ing of data.ingredients) {
      await supabase.from('recipe_ingredients').insert({
        dish_id: dish.id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
      });
    }
    
    return dish;
  },
  
  update: async (id: string, data: CreateDishData): Promise<Dish> => {
    await supabase.from('dishes').update({
      name: data.name,
      description: data.description,
    }).eq('id', id);
    
    await supabase.from('recipe_ingredients').delete().eq('dish_id', id);
    
    for (const ing of data.ingredients) {
      await supabase.from('recipe_ingredients').insert({
        dish_id: id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
      });
    }
    
    const { data: dish } = await supabase.from('dishes').select('*').eq('id', id).single();
    return dish;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('dishes').delete().eq('id', id);
    if (error) throw error;
  },
};

export const weeklyPlansApi = {
  getAll: async (weekStart?: string): Promise<WeeklyPlan[]> => {
    let query = supabase.from('weekly_plans').select('*, dishes:weekly_plan_dishes(*, dish:dishes(*, ingredients:recipe_ingredients(*, ingredient:ingredients(*))))');
    if (weekStart) {
      query = query.eq('week_start', weekStart);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  create: async (data: CreateWeeklyPlanData): Promise<WeeklyPlan> => {
    const { data: plan, error } = await supabase.from('weekly_plans').insert({
      day: data.day,
      slot: data.slot,
      week_start: data.weekStart,
    }).select().single();
    if (error) throw error;
    
    for (const dishId of data.dishIds) {
      await supabase.from('weekly_plan_dishes').insert({
        weekly_plan_id: plan.id,
        dish_id: dishId,
        assigned_to: ['both'],
      });
    }
    
    return plan;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('weekly_plans').delete().eq('id', id);
    if (error) throw error;
  },
};

export const shoppingListApi = {
  get: async (weekStart: string): Promise<ShoppingList> => {
    const { data: plans } = await supabase.from('weekly_plans')
      .select('*, dishes:weekly_plan_dishes(*, dish:dishes(*, ingredients:recipe_ingredients(*, ingredient:ingredients(*))))')
      .eq('week_start', weekStart);
    
    const { data: manualItems } = await supabase.from('manual_items')
      .select('*')
      .eq('week_start', weekStart);
    
    const aggregated: Record<string, { id: string; name: string; quantity: number; unit: string; category: string | null }> = {};
    
    for (const plan of plans || []) {
      for (const wpd of plan.dishes) {
        for (const ri of wpd.dish.ingredients) {
          const ing = ri.ingredient;
          const key = ing.id;
          if (aggregated[key]) {
            aggregated[key].quantity += ri.quantity;
          } else {
            aggregated[key] = {
              id: ing.id,
              name: ing.name,
              quantity: ri.quantity,
              unit: ing.unit,
              category: ing.category,
            };
          }
        }
      }
    }
    
    const grouped = Object.values(aggregated).reduce((acc, item) => {
      const cat = item.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, { id: string; name: string; quantity: number; unit: string }[]>);
    
    return {
      grouped,
      manualItems: manualItems || [],
    };
  },
};

export const manualItemsApi = {
  getAll: async (weekStart?: string): Promise<ManualItem[]> => {
    let query = supabase.from('manual_items').select('*');
    if (weekStart) {
      query = query.eq('week_start', weekStart);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },
  
  create: async (data: CreateManualItemData): Promise<ManualItem> => {
    const { data: item, error } = await supabase.from('manual_items').insert(data).select().single();
    if (error) throw error;
    return item;
  },
  
  update: async (id: string, checked: boolean): Promise<ManualItem> => {
    const { data: item, error } = await supabase.from('manual_items').update({ checked }).eq('id', id).select().single();
    if (error) throw error;
    return item;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('manual_items').delete().eq('id', id);
    if (error) throw error;
  },
};

export const mealTemplatesApi = {
  getAll: async (): Promise<MealTemplate[]> => {
    const { data, error } = await supabase.from('meal_templates').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(t => ({
      ...t,
      dishIds: typeof t.dish_ids === 'string' ? JSON.parse(t.dish_ids) : t.dish_ids
    })) as MealTemplate[];
  },
  
  create: async (data: CreateMealTemplateData): Promise<MealTemplate> => {
    const { data: result, error } = await supabase.from('meal_templates').insert({
      name: data.name,
      slot: data.slot,
      dish_ids: JSON.stringify(data.dishIds),
    }).select().single();
    if (error) throw error;
    return { ...result, dishIds: data.dishIds } as MealTemplate;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('meal_templates').delete().eq('id', id);
    if (error) throw error;
  },
};

export const weekTemplatesApi = {
  getAll: async (): Promise<WeekTemplate[]> => {
    const { data, error } = await supabase.from('week_templates').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(t => ({
      ...t,
      mondayLunch: t.monday_lunch ? JSON.parse(t.monday_lunch) : null,
      mondayDinner: t.monday_dinner ? JSON.parse(t.monday_dinner) : null,
      tuesdayLunch: t.tuesday_lunch ? JSON.parse(t.tuesday_lunch) : null,
      tuesdayDinner: t.tuesday_dinner ? JSON.parse(t.tuesday_dinner) : null,
      wednesdayLunch: t.wednesday_lunch ? JSON.parse(t.wednesday_lunch) : null,
      wednesdayDinner: t.wednesday_dinner ? JSON.parse(t.wednesday_dinner) : null,
      thursdayLunch: t.thursday_lunch ? JSON.parse(t.thursday_lunch) : null,
      thursdayDinner: t.thursday_dinner ? JSON.parse(t.thursday_dinner) : null,
      fridayLunch: t.friday_lunch ? JSON.parse(t.friday_lunch) : null,
      fridayDinner: t.friday_dinner ? JSON.parse(t.friday_dinner) : null,
      saturdayLunch: t.saturday_lunch ? JSON.parse(t.saturday_lunch) : null,
      saturdayDinner: t.saturday_dinner ? JSON.parse(t.saturday_dinner) : null,
      sundayLunch: t.sunday_lunch ? JSON.parse(t.sunday_lunch) : null,
      sundayDinner: t.sunday_dinner ? JSON.parse(t.sunday_dinner) : null,
    })) as WeekTemplate[];
  },
  
  create: async (data: CreateWeekTemplateData): Promise<WeekTemplate> => {
    const templateData: Record<string, unknown> = { name: data.name };
    
    for (const [key, value] of Object.entries(data.meals)) {
      templateData[key] = value ? JSON.stringify(value) : null;
    }
    
    const { data: result, error } = await supabase.from('week_templates').insert(templateData).select().single();
    if (error) throw error;
    return result as WeekTemplate;
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase.from('week_templates').delete().eq('id', id);
    if (error) throw error;
  },
};
