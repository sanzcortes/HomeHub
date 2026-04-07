-- =============================================
-- AÑADIR CÓDIGO DE CASA A HOUSEHOLDS
-- Ejecutar esto en: Supabase SQL Editor
-- =============================================

-- Añadir columna household_code si no existe
ALTER TABLE households ADD COLUMN IF NOT EXISTS household_code TEXT UNIQUE;

-- Generar código para hogares existentes (si no tienen código)
UPDATE households 
SET household_code = 'CASA-' || upper(substring(md5(id::text) from 1 for 6))
WHERE household_code IS NULL;

-- Verificar que todos tengan código
SELECT id, name, household_code FROM households;

SELECT '✓ Código de casa añadido correctamente' as result;