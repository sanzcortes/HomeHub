export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string | null;
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  sugars: number | null;
  fat: number | null;
  saturated_fat: number | null;
  salt: number | null;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  id: string;
  dish_id: string;
  ingredient_id: string;
  quantity: number;
  ingredient: Ingredient;
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  ingredients: RecipeIngredient[];
  created_at: string;
  updated_at: string;
}

export interface DishNutrition {
  calories: number;
  protein: number;
  carbs: number;
  sugars: number;
  fat: number;
  saturatedFat: number;
  salt: number;
}

export interface WeeklyPlanDish {
  id: string;
  weekly_plan_id: string;
  dish_id: string;
  assigned_to: string[];
  dish: Dish;
}

export interface WeeklyPlan {
  id: string;
  day: string;
  slot: string;
  week_start: string;
  dishes: WeeklyPlanDish[];
}

export interface ManualItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  week_start: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface ShoppingList {
  grouped: Record<string, ShoppingItem[]>;
  manualItems: ManualItem[];
}

export interface CreateDishData {
  name: string;
  description?: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
  }[];
}

export interface CreateWeeklyPlanData {
  day: string;
  slot: string;
  dishIds: string[];
  weekStart: string;
}

export interface CreateManualItemData {
  name: string;
  quantity?: number;
  unit?: string;
  weekStart: string;
}

export const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'] as const;
export const SLOTS = ['Comida', 'Cena'] as const;

export interface MealTemplate {
  id: string;
  name: string;
  slot: string;
  dishIds: string[];
  created_at: string;
  updated_at: string;
}

export interface WeekTemplate {
  id: string;
  name: string;
  mondayLunch: string[] | null;
  mondayDinner: string[] | null;
  tuesdayLunch: string[] | null;
  tuesdayDinner: string[] | null;
  wednesdayLunch: string[] | null;
  wednesdayDinner: string[] | null;
  thursdayLunch: string[] | null;
  thursdayDinner: string[] | null;
  fridayLunch: string[] | null;
  fridayDinner: string[] | null;
  saturdayLunch: string[] | null;
  saturdayDinner: string[] | null;
  sundayLunch: string[] | null;
  sundayDinner: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateMealTemplateData {
  name: string;
  slot: string;
  dishIds: string[];
}

export interface CreateWeekTemplateData {
  name: string;
  meals: {
    [key: string]: string[] | null;
  };
}
