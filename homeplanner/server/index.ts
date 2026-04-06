import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../src/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adapter = new PrismaLibSql({
  url: `file:${path.join(__dirname, '..', 'prisma', 'dev.db')}`,
});

const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());

const ingredientSchema = z.object({
  name: z.string().min(1),
  unit: z.string().min(1),
  category: z.string().optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  sugars: z.number().min(0).optional(),
  fat: z.number().min(0).optional(),
  saturatedFat: z.number().min(0).optional(),
  salt: z.number().min(0).optional(),
});

const recipeIngredientSchema = z.object({
  ingredientId: z.string(),
  quantity: z.number().positive(),
});

const dishSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.array(recipeIngredientSchema).min(1),
});

const weeklyPlanSchema = z.object({
  day: z.string(),
  slot: z.string(),
  dishIds: z.array(z.string()).min(1),
  weekStart: z.string().transform((s) => new Date(s)),
});

const manualItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive().optional(),
  unit: z.string().optional(),
  weekStart: z.string().transform((s) => new Date(s)),
});

const unitConversions: Record<string, { base: string; toBase: (v: number) => number; fromBase: (v: number) => number }> = {
  g: { base: 'mg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  kg: { base: 'mg', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
  ml: { base: 'ml', toBase: (v) => v, fromBase: (v) => v },
  l: { base: 'ml', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
};

function getBaseUnit(unit: string): string {
  const conv = unitConversions[unit.toLowerCase()];
  return conv ? conv.base : unit;
}

interface DishNutrition {
  calories: number;
  protein: number;
  carbs: number;
  sugars: number;
  fat: number;
  saturatedFat: number;
  salt: number;
}

function calculateDishNutrition(ingredients: { quantity: number; ingredient: { unit: string; calories: number | null; protein: number | null; carbs: number | null; sugars: number | null; fat: number | null; saturatedFat: number | null; salt: number | null } }[]): DishNutrition {
  const nutrition = { calories: 0, protein: 0, carbs: 0, sugars: 0, fat: 0, saturatedFat: 0, salt: 0 };
  
  for (const ri of ingredients) {
    const factor = ri.ingredient.unit.toLowerCase() === 'g' || ri.ingredient.unit.toLowerCase() === 'ml' 
      ? ri.quantity / 100 
      : ri.quantity > 0 ? 1 : 0;
    
    if (ri.ingredient.calories != null) nutrition.calories += ri.ingredient.calories * factor;
    if (ri.ingredient.protein != null) nutrition.protein += ri.ingredient.protein * factor;
    if (ri.ingredient.carbs != null) nutrition.carbs += ri.ingredient.carbs * factor;
    if (ri.ingredient.sugars != null) nutrition.sugars += ri.ingredient.sugars * factor;
    if (ri.ingredient.fat != null) nutrition.fat += ri.ingredient.fat * factor;
    if (ri.ingredient.saturatedFat != null) nutrition.saturatedFat += ri.ingredient.saturatedFat * factor;
    if (ri.ingredient.salt != null) nutrition.salt += ri.ingredient.salt * factor;
  }
  
  return {
    calories: Math.round(nutrition.calories * 100) / 100,
    protein: Math.round(nutrition.protein * 100) / 100,
    carbs: Math.round(nutrition.carbs * 100) / 100,
    sugars: Math.round(nutrition.sugars * 100) / 100,
    fat: Math.round(nutrition.fat * 100) / 100,
    saturatedFat: Math.round(nutrition.saturatedFat * 100) / 100,
    salt: Math.round(nutrition.salt * 100) / 100,
  };
}

app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    res.json(ingredients);
  } catch {
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

app.post('/api/ingredients', async (req, res) => {
  try {
    const data = ingredientSchema.parse(req.body);
    const ingredient = await prisma.ingredient.create({ data });
    res.status(201).json(ingredient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create ingredient' });
    }
  }
});

app.put('/api/ingredients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = ingredientSchema.parse(req.body);
    const ingredient = await prisma.ingredient.update({
      where: { id },
      data,
    });
    res.json(ingredient);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update ingredient' });
    }
  }
});

app.delete('/api/ingredients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ingredient.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

app.get('/api/dishes', async (req, res) => {
  try {
    const dishes = await prisma.dish.findMany({
      include: {
        ingredients: {
          include: { ingredient: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    const dishesWithNutrition = dishes.map(dish => ({
      ...dish,
      nutrition: calculateDishNutrition(dish.ingredients),
    }));
    res.json(dishesWithNutrition);
  } catch {
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
});

app.post('/api/dishes', async (req, res) => {
  try {
    const data = dishSchema.parse(req.body);
    
    const existingDish = await prisma.dish.findFirst({
      where: { name: data.name },
    });
    
    if (existingDish) {
      res.status(400).json({ error: 'A dish with this name already exists' });
      return;
    }

    const dish = await prisma.dish.create({
      data: {
        name: data.name,
        description: data.description,
        ingredients: {
          create: data.ingredients,
        },
      },
      include: {
        ingredients: { include: { ingredient: true } },
      },
    });
    
    res.status(201).json({
      ...dish,
      nutrition: calculateDishNutrition(dish.ingredients),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create dish' });
    }
  }
});

app.put('/api/dishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = dishSchema.parse(req.body);

    await prisma.recipeIngredient.deleteMany({ where: { dishId: id } });

    const dish = await prisma.dish.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        ingredients: {
          create: data.ingredients,
        },
      },
      include: {
        ingredients: { include: { ingredient: true } },
      },
    });
    
    res.json({
      ...dish,
      nutrition: calculateDishNutrition(dish.ingredients),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update dish' });
    }
  }
});

app.delete('/api/dishes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.dish.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete dish' });
  }
});

app.get('/api/weekly-plans', async (req, res) => {
  try {
    const { weekStart } = req.query;
    const where = weekStart
      ? { weekStart: new Date(weekStart as string) }
      : {};

    const plans = await prisma.weeklyPlan.findMany({
      where,
      include: { 
        dishes: { 
          include: { 
            dish: { 
              include: { ingredients: { include: { ingredient: true } } } 
            } 
          } 
        } 
      },
      orderBy: [{ day: 'asc' }, { slot: 'asc' }],
    });
    const plansWithNutrition = plans.map(plan => ({
      ...plan,
      dishes: plan.dishes.map(wpd => ({
        ...wpd,
        dish: {
          ...wpd.dish,
          nutrition: calculateDishNutrition(wpd.dish.ingredients),
        },
      })),
    }));
    res.json(plansWithNutrition);
  } catch {
    res.status(500).json({ error: 'Failed to fetch weekly plans' });
  }
});

app.post('/api/weekly-plans', async (req, res) => {
  try {
    const data = weeklyPlanSchema.parse(req.body);
    
    let plan = await prisma.weeklyPlan.findFirst({
      where: {
        day: data.day,
        slot: data.slot,
        weekStart: data.weekStart,
      },
      include: { 
        dishes: { 
          include: { 
            dish: { 
              include: { ingredients: { include: { ingredient: true } } } 
            } 
          } 
        } 
      },
    });

    if (plan) {
      await prisma.weeklyPlanDish.deleteMany({ where: { weeklyPlanId: plan.id } });
      plan = await prisma.weeklyPlan.update({
        where: { id: plan.id },
        data: {
          dishes: {
            create: data.dishIds.map((dishId) => ({ dishId })),
          },
        },
        include: { 
          dishes: { 
            include: { 
              dish: { 
                include: { ingredients: { include: { ingredient: true } } } 
              } 
            } 
          } 
        },
      });
    } else {
      plan = await prisma.weeklyPlan.create({
        data: {
          day: data.day,
          slot: data.slot,
          weekStart: data.weekStart,
          dishes: {
            create: data.dishIds.map((dishId) => ({ dishId })),
          },
        },
        include: { 
          dishes: { 
            include: { 
              dish: { 
                include: { ingredients: { include: { ingredient: true } } } 
              } 
            } 
          } 
        },
      });
    }
    
    res.status(201).json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create weekly plan' });
    }
  }
});

app.delete('/api/weekly-plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.weeklyPlan.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete weekly plan' });
  }
});

app.get('/api/shopping-list', async (req, res) => {
  try {
    const { weekStart } = req.query;
    if (!weekStart) {
      res.status(400).json({ error: 'weekStart is required' });
      return;
    }

    const startDate = new Date(weekStart as string);
    
    const plans = await prisma.weeklyPlan.findMany({
      where: { weekStart: startDate },
      include: { 
        dishes: { 
          include: { 
            dish: { 
              include: { ingredients: { include: { ingredient: true } } } 
            } 
          } 
        } 
      },
    });

    const manualItems = await prisma.manualItem.findMany({
      where: { weekStart: startDate },
    });

    const aggregated: Record<string, { ingredientId: string; name: string; quantity: number; unit: string; category: string | null }> = {};

    for (const plan of plans) {
      for (const wpd of plan.dishes) {
        for (const ri of wpd.dish.ingredients) {
          const { ingredient } = ri;
          const key = `${ingredient.id}`;
          
          if (aggregated[key]) {
            const conv = unitConversions[ingredient.unit.toLowerCase()];
            if (conv && conv.base === getBaseUnit(aggregated[key].unit)) {
              aggregated[key].quantity += conv.toBase(ri.quantity);
            } else if (ingredient.unit === aggregated[key].unit) {
              aggregated[key].quantity += ri.quantity;
            }
          } else {
            const conv = unitConversions[ingredient.unit.toLowerCase()];
            const baseValue = conv ? conv.toBase(ri.quantity) : ri.quantity;
            aggregated[key] = {
              ingredientId: ingredient.id,
              name: ingredient.name,
              quantity: baseValue,
              unit: ingredient.unit,
              category: ingredient.category,
            };
          }
        }
      }
    }

    const convertedItems = Object.values(aggregated).map((item) => {
      const conv = unitConversions[item.unit.toLowerCase()];
      if (conv) {
        return {
          ...item,
          quantity: conv.fromBase(item.quantity),
        };
      }
      return item;
    });

    const grouped = convertedItems.reduce((acc, item) => {
      const cat = item.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push({
        id: item.ingredientId,
        name: item.name,
        quantity: Math.round(item.quantity * 100) / 100,
        unit: item.unit,
      });
      return acc;
    }, {} as Record<string, { id: string; name: string; quantity: number; unit: string }[]>);

    res.json({
      grouped,
      manualItems,
    });
  } catch {
    res.status(500).json({ error: 'Failed to generate shopping list' });
  }
});

app.get('/api/manual-items', async (req, res) => {
  try {
    const { weekStart } = req.query;
    const where = weekStart ? { weekStart: new Date(weekStart as string) } : {};
    const items = await prisma.manualItem.findMany({ where });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to fetch manual items' });
  }
});

app.post('/api/manual-items', async (req, res) => {
  try {
    const data = manualItemSchema.parse(req.body);
    const item = await prisma.manualItem.create({ data });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create manual item' });
    }
  }
});

app.patch('/api/manual-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { checked } = req.body;
    const item = await prisma.manualItem.update({
      where: { id },
      data: { checked },
    });
    res.json(item);
  } catch {
    res.status(500).json({ error: 'Failed to update manual item' });
  }
});

app.delete('/api/manual-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.manualItem.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete manual item' });
  }
});

const mealTemplateSchema = z.object({
  name: z.string().min(1),
  slot: z.string(),
  dishIds: z.array(z.string()),
});

app.get('/api/meal-templates', async (req, res) => {
  try {
    const templates = await prisma.mealTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const formatted = templates.map((t) => ({
      ...t,
      dishIds: JSON.parse(t.dishIds),
    }));
    res.json(formatted);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meal templates' });
  }
});

app.post('/api/meal-templates', async (req, res) => {
  try {
    const data = mealTemplateSchema.parse(req.body);
    const template = await prisma.mealTemplate.create({
      data: {
        name: data.name,
        slot: data.slot,
        dishIds: JSON.stringify(data.dishIds),
      },
    });
    res.status(201).json({
      ...template,
      dishIds: data.dishIds,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create meal template' });
    }
  }
});

app.delete('/api/meal-templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mealTemplate.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete meal template' });
  }
});

const daySlots = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
const slotNames = ['Lunch', 'Dinner'] as const;

function parseMealField(value: string | null): string[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

const weekTemplateSchema = z.object({
  name: z.string().min(1),
  meals: z.record(z.string(), z.array(z.string()).nullable()),
});

app.get('/api/week-templates', async (req, res) => {
  try {
    const templates = await prisma.weekTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const formatted = templates.map((t) => ({
      ...t,
      mondayLunch: parseMealField(t.mondayLunch),
      mondayDinner: parseMealField(t.mondayDinner),
      tuesdayLunch: parseMealField(t.tuesdayLunch),
      tuesdayDinner: parseMealField(t.tuesdayDinner),
      wednesdayLunch: parseMealField(t.wednesdayLunch),
      wednesdayDinner: parseMealField(t.wednesdayDinner),
      thursdayLunch: parseMealField(t.thursdayLunch),
      thursdayDinner: parseMealField(t.thursdayDinner),
      fridayLunch: parseMealField(t.fridayLunch),
      fridayDinner: parseMealField(t.fridayDinner),
      saturdayLunch: parseMealField(t.saturdayLunch),
      saturdayDinner: parseMealField(t.saturdayDinner),
      sundayLunch: parseMealField(t.sundayLunch),
      sundayDinner: parseMealField(t.sundayDinner),
    }));
    res.json(formatted);
  } catch {
    res.status(500).json({ error: 'Failed to fetch week templates' });
  }
});

app.post('/api/week-templates', async (req, res) => {
  try {
    const data = weekTemplateSchema.parse(req.body);
    
    const templateData: Record<string, string | null> = { name: data.name };
    
    for (const day of daySlots) {
      for (const slot of slotNames) {
        const key = `${day}${slot}`;
        const value = data.meals[key];
        templateData[key] = value ? JSON.stringify(value) : null;
      }
    }
    
    const template = await prisma.weekTemplate.create({
      data: templateData,
    });
    
    res.status(201).json({
      ...template,
      mondayLunch: parseMealField(template.mondayLunch),
      mondayDinner: parseMealField(template.mondayDinner),
      tuesdayLunch: parseMealField(template.tuesdayLunch),
      tuesdayDinner: parseMealField(template.tuesdayDinner),
      wednesdayLunch: parseMealField(template.wednesdayLunch),
      wednesdayDinner: parseMealField(template.wednesdayDinner),
      thursdayLunch: parseMealField(template.thursdayLunch),
      thursdayDinner: parseMealField(template.thursdayDinner),
      fridayLunch: parseMealField(template.fridayLunch),
      fridayDinner: parseMealField(template.fridayDinner),
      saturdayLunch: parseMealField(template.saturdayLunch),
      saturdayDinner: parseMealField(template.saturdayDinner),
      sundayLunch: parseMealField(template.sundayLunch),
      sundayDinner: parseMealField(template.sundayDinner),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Failed to create week template' });
    }
  }
});

app.delete('/api/week-templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.weekTemplate.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete week template' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
