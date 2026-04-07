import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';
import { z } from 'zod';

const app = express();

app.use(cors());
app.use(express.json());

// Supabase configuration
const SUPABASE_URL = 'https://kjvysxkfvyvwrohouqda.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdnlzeGtmdnl2d3JvaG91cWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjYyMzcsImV4cCI6MjA5MTA0MjIzN30.PIEXdhcHbGPBVyhtfxkL7koL2jAO5iCzk8jlpZQM0vs';

const supabase = axios.create({
  baseURL: SUPABASE_URL,
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
  },
});

// Helper to generate token
function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Helper to generate household code
function generateHouseholdCode(name: string): string {
  const prefix = name.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 4) || 'CASA';
  const suffix = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${suffix}`;
}

// Auth endpoints

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, householdCode } = req.body;
    
    if (!username || !password || !name) {
      return res.status(400).json({ error: 'Username, password y name son requeridos' });
    }

    // Check if username exists
    const existingUser = await supabase.get('/rest/v1/app_users?username=eq.' + username);
    if (existingUser.data && existingUser.data.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    let householdId = null;

    if (householdCode) {
      const existingHousehold = await supabase.get(`/rest/v1/households?household_code=eq.${householdCode}`);
      if (!existingHousehold.data || existingHousehold.data.length === 0) {
        return res.status(400).json({ error: 'Código de casa no válido' });
      }
      householdId = existingHousehold.data[0].id;
    }

    // Create user
    const newUser = await supabase.post('/rest/v1/app_users', {
      username,
      password,
      name,
      household_id: householdId,
    });

    // Generate session token
    const token = generateToken();
    await supabase.post('/rest/v1/app_sessions', {
      user_id: newUser.data.id,
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.status(201).json({
      token,
      user: {
        id: newUser.data.id,
        username: newUser.data.username,
        name: newUser.data.name,
        household_id: newUser.data.household_id,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error.message);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Find user
    const userData = await supabase.get(`/rest/v1/app_users?username=eq.${username}`);
    
    if (!userData.data || userData.data.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const user = userData.data[0];

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Generate session token
    const token = generateToken();
    await supabase.post('/rest/v1/app_sessions', {
      user_id: user.id,
      token,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        household_id: user.household_id,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      await supabase.delete('/rest/v1/app_sessions?token=eq.' + token);
    }
    
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Find session
    const sessions = await supabase.get('/rest/v1/app_sessions?token=eq.' + token + '&expires_at=gt.' + new Date().toISOString());
    
    if (!sessions.data || sessions.data.length === 0) {
      return res.status(401).json({ error: 'Sesión expirada' });
    }

    // Get user
    const userId = sessions.data[0].user_id;
    const users = await supabase.get('/rest/v1/app_users?id=eq.' + userId);
    
    if (!users.data || users.data.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = users.data[0];
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      household_id: user.household_id,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// GET /api/profile - Get full profile with household info
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // Find session
    const sessions = await supabase.get('/rest/v1/app_sessions?token=eq.' + token + '&expires_at=gt.' + new Date().toISOString());
    
    if (!sessions.data || sessions.data.length === 0) {
      return res.status(401).json({ error: 'Sesión expirada' });
    }

    // Get user
    const userId = sessions.data[0].user_id;
    const users = await supabase.get('/rest/v1/app_users?id=eq.' + userId);
    
    if (!users.data || users.data.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = users.data[0];

    // Get household info (only if user has a household_id)
    let household = null;
    let members: any[] = [];
    
    if (user.household_id) {
      const households = await supabase.get('/rest/v1/households?id=eq.' + user.household_id);
      household = households.data?.[0];
      
      // Get all members of the household
      const membersRes = await supabase.get('/rest/v1/app_users?household_id=eq.' + user.household_id);
      members = (membersRes.data || []).map((m: any) => ({
        id: m.id,
        username: m.username,
        name: m.name,
      }));
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
      household: household ? {
        id: household.id,
        name: household.name,
        code: household.household_code,
      } : null,
      members,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// GET /api/households/by-code/:code - Find household by code
app.get('/api/households/by-code/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const households = await supabase.get(`/rest/v1/households?household_code=eq.${code}`);
    
    if (!households.data || households.data.length === 0) {
      return res.status(404).json({ error: 'Casa no encontrada' });
    }

    const household = households.data[0];
    
    res.json({
      id: household.id,
      name: household.name,
      code: household.household_code,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al buscar casa' });
  }
});

// POST /api/households/join - Join existing household
app.post('/api/households/join', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.userId;

    if (!code) {
      return res.status(400).json({ error: 'Código de casa requerido' });
    }

    // Find household by code
    const households = await supabase.get(`/rest/v1/households?household_code=eq.${code}`);
    
    if (!households.data || households.data.length === 0) {
      return res.status(400).json({ error: 'Código de casa no válido' });
    }

    const householdId = households.data[0].id;

    // Update user's household
    await supabase.patch(`/rest/v1/app_users?id=eq.${userId}`, {
      household_id: householdId,
    });

    // Get updated user info
    const users = await supabase.get('/rest/v1/app_users?id=eq.' + userId);
    const user = users.data[0];

    res.json({
      success: true,
      household: {
        id: householdId,
        name: households.data[0].name,
        code: households.data[0].household_code,
      },
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        household_id: householdId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al unirse a la casa' });
  }
});

// POST /api/households/create - Create new household for current user
app.post('/api/households/create', authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    // Generate household code
    const code = generateHouseholdCode(name || 'Mi Casa');

    // Create new household
    const householdRes = await supabase.post('/rest/v1/households', {
      name: name || 'Mi Hogar',
      household_code: code,
    }, {
      headers: { 'Prefer': 'return=representation' }
    });
    const householdId = householdRes.data[0].id;

    // Update user's household_id
    await supabase.patch(`/rest/v1/app_users?id=eq.${userId}`, {
      household_id: householdId,
    });

    // Get updated user
    const users = await supabase.get('/rest/v1/app_users?id=eq.' + userId);
    const user = users.data[0];

    res.json({
      success: true,
      household: {
        id: householdId,
        name: name || 'Mi Hogar',
        code: code,
      },
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        household_id: householdId,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear la casa' });
  }
});

// Middleware to check auth
function authenticate(req: any, res: any, next: any) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  supabase.get('/rest/v1/app_sessions?token=eq.' + token + '&expires_at=gt.' + new Date().toISOString())
    .then(sessions => {
      if (!sessions.data || sessions.data.length === 0) {
        return res.status(401).json({ error: 'Sesión expirada' });
      }
      req.userId = sessions.data[0].user_id;
      next();
    })
    .catch(() => res.status(401).json({ error: 'No autorizado' }));
}

// Ingredients endpoints
app.get('/api/ingredients', async (req, res) => {
  try {
    const response = await supabase.get('/rest/v1/ingredients?select=*&order=category,name');
    res.json(response.data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

app.post('/api/ingredients', authenticate, async (req, res) => {
  try {
    const { name, unit, category, calories, protein, carbs, sugars, fat, saturated_fat, salt } = req.body;
    const response = await supabase.post('/rest/v1/ingredients', {
      name, unit, category, calories, protein, carbs, sugars, fat, saturated_fat, salt,
    });
    res.status(201).json(response.data);
  } catch {
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

app.put('/api/ingredients/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const response = await supabase.patch(`/rest/v1/ingredients?id=eq.${id}`, req.body);
    res.json(response.data);
  } catch {
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

app.delete('/api/ingredients/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.delete(`/rest/v1/ingredients?id=eq.${id}`);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete ingredient' });
  }
});

// Dishes endpoints
app.get('/api/dishes', async (req, res) => {
  try {
    const dishesRes = await supabase.get('/rest/v1/dishes?select=*&order=name');
    const dishes = dishesRes.data || [];
    
    const dishesWithIngredients = await Promise.all(dishes.map(async (dish: any) => {
      const ingRes = await supabase.get(`/rest/v1/recipe_ingredients?dish_id=eq.${dish.id}&select=*,ingredient:ingredients(*)`);
      return { ...dish, ingredients: ingRes.data || [] };
    }));
    
    res.json(dishesWithIngredients);
  } catch {
    res.status(500).json({ error: 'Failed to fetch dishes' });
  }
});

app.post('/api/dishes', authenticate, async (req, res) => {
  try {
    const { name, description, ingredients } = req.body;
    
    const dishRes = await supabase.post('/rest/v1/dishes', { name, description });
    const dish = dishRes.data;
    
    for (const ing of ingredients) {
      await supabase.post('/rest/v1/recipe_ingredients', {
        dish_id: dish.id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
      });
    }
    
    res.status(201).json(dish);
  } catch {
    res.status(500).json({ error: 'Failed to create dish' });
  }
});

app.put('/api/dishes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, ingredients } = req.body;
    
    await supabase.patch(`/rest/v1/dishes?id=eq.${id}`, { name, description });
    await supabase.delete(`/rest/v1/recipe_ingredients?dish_id=eq.${id}`);
    
    for (const ing of ingredients) {
      await supabase.post('/rest/v1/recipe_ingredients', {
        dish_id: id,
        ingredient_id: ing.ingredientId,
        quantity: ing.quantity,
      });
    }
    
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to update dish' });
  }
});

app.delete('/api/dishes/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.delete(`/rest/v1/dishes?id=eq.${id}`);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete dish' });
  }
});

// Weekly Plans endpoints
app.get('/api/weekly-plans', async (req, res) => {
  try {
    const { weekStart } = req.query;
    let url = '/rest/v1/weekly_plans?select=*,dishes:weekly_plan_dishes(*,dish:dishes(*,ingredients:recipe_ingredients(*,ingredient:ingredients(*))))';
    if (weekStart) {
      url += `&week_start=eq.${weekStart}`;
    }
    const response = await supabase.get(url);
    res.json(response.data || []);
  } catch {
    res.status(500).json({ error: 'Failed to fetch weekly plans' });
  }
});

app.post('/api/weekly-plans', authenticate, async (req, res) => {
  try {
    const { day, slot, dishIds, weekStart } = req.body;
    
    const planRes = await supabase.post('/rest/v1/weekly_plans', {
      day, slot, week_start: weekStart,
    });
    const plan = planRes.data;
    
    for (const dishId of dishIds) {
      await supabase.post('/rest/v1/weekly_plan_dishes', {
        weekly_plan_id: plan.id,
        dish_id: dishId,
        assigned_to: ['both'],
      });
    }
    
    res.status(201).json(plan);
  } catch {
    res.status(500).json({ error: 'Failed to create weekly plan' });
  }
});

app.delete('/api/weekly-plans/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.delete(`/rest/v1/weekly_plans?id=eq.${id}`);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete weekly plan' });
  }
});

// Shopping List endpoints
app.get('/api/shopping-list', async (req, res) => {
  try {
    const { weekStart } = req.query;
    
    const plansRes = await supabase.get(`/rest/v1/weekly_plans?week_start=eq.${weekStart}&select=*,dishes:weekly_plan_dishes(*,dish:dishes(*,ingredients:recipe_ingredients(*,ingredient:ingredients(*))))`);
    const manualRes = await supabase.get(`/rest/v1/manual_items?week_start=eq.${weekStart}`);
    
    const aggregated: Record<string, any> = {};
    
    for (const plan of plansRes.data || []) {
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
    
    const grouped = Object.values(aggregated).reduce((acc: any, item: any) => {
      const cat = item.category || 'Otros';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
    
    res.json({ grouped, manualItems: manualRes.data || [] });
  } catch {
    res.status(500).json({ error: 'Failed to fetch shopping list' });
  }
});

// Manual Items endpoints
app.get('/api/manual-items', async (req, res) => {
  try {
    const { weekStart } = req.query;
    let url = '/rest/v1/manual_items?select=*';
    if (weekStart) {
      url += `&week_start=eq.${weekStart}`;
    }
    const response = await supabase.get(url);
    res.json(response.data || []);
  } catch {
    res.status(500).json({ error: 'Failed to fetch manual items' });
  }
});

app.post('/api/manual-items', authenticate, async (req, res) => {
  try {
    const response = await supabase.post('/rest/v1/manual_items', req.body);
    res.status(201).json(response.data);
  } catch {
    res.status(500).json({ error: 'Failed to create manual item' });
  }
});

app.patch('/api/manual-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { checked } = req.body;
    const response = await supabase.patch(`/rest/v1/manual_items?id=eq.${id}`, { checked });
    res.json(response.data);
  } catch {
    res.status(500).json({ error: 'Failed to update manual item' });
  }
});

app.delete('/api/manual-items/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.delete(`/rest/v1/manual_items?id=eq.${id}`);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete manual item' });
  }
});

// Meal Templates endpoints
app.get('/api/meal-templates', async (req, res) => {
  try {
    const response = await supabase.get('/rest/v1/meal_templates?select=*&order=created_at.desc');
    const templates = (response.data || []).map((t: any) => ({
      ...t,
      dishIds: t.dish_ids ? JSON.parse(t.dish_ids) : [],
    }));
    res.json(templates);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meal templates' });
  }
});

app.post('/api/meal-templates', authenticate, async (req, res) => {
  try {
    const { name, slot, dishIds } = req.body;
    const response = await supabase.post('/rest/v1/meal_templates', {
      name,
      slot,
      dish_ids: JSON.stringify(dishIds),
    });
    res.status(201).json({ ...response.data, dishIds });
  } catch {
    res.status(500).json({ error: 'Failed to create meal template' });
  }
});

app.delete('/api/meal-templates/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.delete(`/rest/v1/meal_templates?id=eq.${id}`);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete meal template' });
  }
});

// Week Templates endpoints
app.get('/api/week-templates', async (req, res) => {
  try {
    const response = await supabase.get('/rest/v1/week_templates?select=*&order=created_at.desc');
    const templates = (response.data || []).map((t: any) => ({
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
    }));
    res.json(templates);
  } catch {
    res.status(500).json({ error: 'Failed to fetch week templates' });
  }
});

app.post('/api/week-templates', authenticate, async (req, res) => {
  try {
    const { name, meals } = req.body;
    const data: any = { name };
    
    for (const [key, value] of Object.entries(meals)) {
      data[key] = value ? JSON.stringify(value) : null;
    }
    
    const response = await supabase.post('/rest/v1/week_templates', data);
    res.status(201).json(response.data);
  } catch {
    res.status(500).json({ error: 'Failed to create week template' });
  }
});

app.delete('/api/week-templates/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.delete(`/rest/v1/week_templates?id=eq.${id}`);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete week template' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});