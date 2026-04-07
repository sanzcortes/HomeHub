-- =============================================
-- AUTH SIMPLE - BASE DE DATOS PROPIA
-- Ejecutar esto en: Supabase SQL Editor
-- =============================================

-- 1. Tabla de usuarios
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  household_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Tabla de sesiones
CREATE TABLE IF NOT EXISTS app_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Habilitar RLS (pero permitir operaciones)
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS simples
-- Cualquiera puede crear usuario (registro)
CREATE POLICY "app_users_insert" ON app_users FOR INSERT WITH CHECK (true);
-- Cualquiera puede hacer login (consultar por username)
CREATE POLICY "app_users_select" ON app_users FOR SELECT USING (true);
-- El usuario puede actualizar su propio perfil
CREATE POLICY "app_users_update" ON app_users FOR UPDATE USING (id IN (SELECT user_id FROM app_sessions WHERE token = current_setting('app.current_token', true)));

-- Sesiones: cualquier operación
CREATE POLICY "app_sessions_all" ON app_sessions FOR ALL USING (true) WITH CHECK (true);

-- 5. Agregar household_id a app_users si no existe en households
-- Primero verificar que existe la tabla households
-- INSERTAR household por defecto si no existe
INSERT INTO households (name)
SELECT 'Mi Hogar'
WHERE NOT EXISTS (SELECT 1 FROM households LIMIT 1);

SELECT '✓ Tablas de auth creadas correctamente' as result;