-- Agregar columna household_code a la tabla households
ALTER TABLE households ADD COLUMN IF NOT EXISTS household_code TEXT;

-- Verificar que se agregó
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'households' AND column_name = 'household_code';
