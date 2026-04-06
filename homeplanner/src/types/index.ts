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
  saturatedFat: number | null;
  salt: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface RecipeIngredient {
  id: string;
  dishId: string;
  ingredientId: string;
  quantity: number;
  ingredient: Ingredient;
}

export interface Dish {
  id: string;
  name: string;
  description: string | null;
  ingredients: RecipeIngredient[];
  nutrition?: DishNutrition | null;
  createdAt: string;
  updatedAt: string;
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
  weeklyPlanId: string;
  dishId: string;
  dish: Dish;
}

export interface WeeklyPlan {
  id: string;
  day: string;
  slot: string;
  weekStart: string;
  dishes: WeeklyPlanDish[];
}

export interface ManualItem {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  checked: boolean;
  weekStart: string;
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
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
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
