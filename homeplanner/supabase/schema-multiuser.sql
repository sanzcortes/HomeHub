-- =============================================
-- CREACIÓN COMPLETA DE TABLAS PARA MULTIUSUARIO
-- Ejecutar esto en: Supabase SQL Editor
-- IMPORTANTE: Ejecutar completo desde el inicio
-- =============================================

-- =============================================
-- 1. TABLAS BÁSICAS (Ingredients, Dishes, etc.)
-- =============================================

-- Ingredientes
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  unit TEXT NOT NULL,
  category TEXT,
  calories REAL,
  protein REAL,
  carbs REAL,
  sugars REAL,
  fat REAL,
  saturated_fat REAL,
  salt REAL,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Platos
CREATE TABLE IF NOT EXISTS dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ingredientes de receta
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  quantity REAL NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(dish_id, ingredient_id)
);

-- Planificación semanal
CREATE TABLE IF NOT EXISTS weekly_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  slot TEXT NOT NULL,
  week_start TIMESTAMPTZ NOT NULL,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(day, slot, week_start, household_id)
);

-- Platos en planificación semanal
CREATE TABLE IF NOT EXISTS weekly_plan_dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  weekly_plan_id UUID REFERENCES weekly_plans(id) ON DELETE CASCADE,
  dish_id UUID REFERENCES dishes(id) ON DELETE CASCADE,
  assigned_to TEXT[] DEFAULT ARRAY['both']::TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(weekly_plan_id, dish_id)
);

-- Items manuales de compra
CREATE TABLE IF NOT EXISTS manual_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity REAL,
  unit TEXT,
  checked BOOLEAN DEFAULT false,
  week_start TIMESTAMPTZ NOT NULL,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Plantillas de comidas
CREATE TABLE IF NOT EXISTS meal_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slot TEXT NOT NULL,
  dish_ids TEXT NOT NULL,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Plantillas de semanas
CREATE TABLE IF NOT EXISTS week_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  monday_lunch TEXT,
  monday_dinner TEXT,
  tuesday_lunch TEXT,
  tuesday_dinner TEXT,
  wednesday_lunch TEXT,
  wednesday_dinner TEXT,
  thursday_lunch TEXT,
  thursday_dinner TEXT,
  friday_lunch TEXT,
  friday_dinner TEXT,
  saturday_lunch TEXT,
  saturday_dinner TEXT,
  sunday_lunch TEXT,
  sunday_dinner TEXT,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2. TABLAS DE MULTIUSUARIO
-- =============================================

-- Hogares (parejas/pisos)
CREATE TABLE IF NOT EXISTS households (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Mi hogar',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'Usuario',
  household_id UUID REFERENCES households(id) ON DELETE SET NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invitaciones a hogares
CREATE TABLE IF NOT EXISTS household_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '7 days'),
  UNIQUE(household_id, email)
);

-- =============================================
-- 3. FUNCIONES Y TRIGGERS
-- =============================================

-- Función para crear household automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_household_id UUID;
BEGIN
  -- Crear nuevo household
  INSERT INTO households (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'name', 'Mi hogar'))
  RETURNING id INTO new_household_id;
  
  -- Insertar perfil
  INSERT INTO profiles (id, email, name, household_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    new_household_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- 4. HABILITAR RLS
-- =============================================

ALTER TABLE households ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE household_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plan_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE manual_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_templates ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. POLÍTICAS RLS (simplificadas para desarrollo)
-- =============================================

-- Households: usuarios del mismo household pueden ver
CREATE POLICY "household_select" ON households
  FOR SELECT USING (id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "household_insert" ON households
  FOR INSERT WITH CHECK (true);

CREATE POLICY "household_update" ON households
  FOR UPDATE USING (id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

-- Profiles: usuarios del mismo household pueden verse
CREATE POLICY "profiles_select" ON profiles
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "profiles_update" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- Ingredients, Dishes, etc: filtrar por household_id
CREATE POLICY "ingredients_select" ON ingredients
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()) OR household_id IS NULL);

CREATE POLICY "dishes_select" ON dishes
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()) OR household_id IS NULL);

CREATE POLICY "recipe_ingredients_select" ON recipe_ingredients
  FOR SELECT USING (true);

CREATE POLICY "weekly_plans_select" ON weekly_plans
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()) OR household_id IS NULL);

CREATE POLICY "weekly_plan_dishes_select" ON weekly_plan_dishes
  FOR SELECT USING (true);

CREATE POLICY "manual_items_select" ON manual_items
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()) OR household_id IS NULL);

CREATE POLICY "meal_templates_select" ON meal_templates
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()) OR household_id IS NULL);

CREATE POLICY "week_templates_select" ON week_templates
  FOR SELECT USING (household_id IN (SELECT household_id FROM profiles WHERE id = auth.uid()) OR household_id IS NULL);

-- Insert/Update policies
CREATE POLICY "ingredients_insert" ON ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "ingredients_update" ON ingredients FOR UPDATE USING (true);
CREATE POLICY "dishes_insert" ON dishes FOR INSERT WITH CHECK (true);
CREATE POLICY "dishes_update" ON dishes FOR UPDATE USING (true);
CREATE POLICY "recipe_ingredients_insert" ON recipe_ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "recipe_ingredients_update" ON recipe_ingredients FOR UPDATE USING (true);
CREATE POLICY "weekly_plans_insert" ON weekly_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "weekly_plans_update" ON weekly_plans FOR UPDATE USING (true);
CREATE POLICY "weekly_plan_dishes_insert" ON weekly_plan_dishes FOR INSERT WITH CHECK (true);
CREATE POLICY "weekly_plan_dishes_update" ON weekly_plan_dishes FOR UPDATE USING (true);
CREATE POLICY "manual_items_insert" ON manual_items FOR INSERT WITH CHECK (true);
CREATE POLICY "manual_items_update" ON manual_items FOR UPDATE USING (true);
CREATE POLICY "meal_templates_insert" ON meal_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "meal_templates_update" ON meal_templates FOR UPDATE USING (true);
CREATE POLICY "week_templates_insert" ON week_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "week_templates_update" ON week_templates FOR UPDATE USING (true);

SELECT '✓ Tablas creadas correctamente' as result;
