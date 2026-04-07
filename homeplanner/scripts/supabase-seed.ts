import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kjvysxkfvyvwrohouqda.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqdnlzeGtmdnl2d3JvaG91cWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjYyMzcsImV4cCI6MjA5MTA0MjIzN30.PIEXdhcHbGPBVyhtfxkL7koL2jAO5iCzk8jlpZQM0vs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface IngredientData {
  name: string;
  unit: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  sugars: number;
  fat: number;
  saturated_fat: number;
  salt: number;
}

const ingredients: IngredientData[] = [
  { name: 'Pollo', unit: 'g', category: 'Carnicería', calories: 165, protein: 31, carbs: 0, sugars: 0, fat: 3.6, saturated_fat: 1, salt: 0.074 },
  { name: 'Carne molida', unit: 'g', category: 'Carnicería', calories: 250, protein: 26, carbs: 0, sugars: 0, fat: 15, saturated_fat: 6, salt: 0.075 },
  { name: 'Cerdo', unit: 'g', category: 'Carnicería', calories: 242, protein: 27, carbs: 0, sugars: 0, fat: 14, saturated_fat: 5, salt: 0.07 },
  { name: 'Ternera', unit: 'g', category: 'Carnicería', calories: 250, protein: 26, carbs: 0, sugars: 0, fat: 15, saturated_fat: 6, salt: 0.07 },
  { name: 'Bacon', unit: 'g', category: 'Carnicería', calories: 541, protein: 37, carbs: 1.4, sugars: 0, fat: 42, saturated_fat: 14, salt: 1.7 },
  { name: 'Jamón', unit: 'g', category: 'Carnicería', calories: 145, protein: 21, carbs: 0.2, sugars: 0, fat: 6, saturated_fat: 2, salt: 1.2 },
  { name: 'Salchichas', unit: 'ud', category: 'Carnicería', calories: 301, protein: 12, carbs: 2, sugars: 0, fat: 27, saturated_fat: 10, salt: 0.8 },

  { name: 'Pescado blanco', unit: 'g', category: 'Pescadería', calories: 86, protein: 19, carbs: 0, sugars: 0, fat: 0.8, saturated_fat: 0.2, salt: 0.054 },
  { name: 'Salmón', unit: 'g', category: 'Pescadería', calories: 208, protein: 20, carbs: 0, sugars: 0, fat: 13, saturated_fat: 3, salt: 0.059 },
  { name: 'Gambas', unit: 'g', category: 'Pescadería', calories: 85, protein: 18, carbs: 0.2, sugars: 0, fat: 0.5, saturated_fat: 0.1, salt: 0.38 },
  { name: 'Atún', unit: 'g', category: 'Pescadería', calories: 144, protein: 23, carbs: 0, sugars: 0, fat: 5, saturated_fat: 1, salt: 0.15 },

  { name: 'Leche', unit: 'ml', category: 'Lácteos', calories: 42, protein: 3.4, carbs: 5, sugars: 5, fat: 1, saturated_fat: 0.6, salt: 0.044 },
  { name: 'Queso', unit: 'g', category: 'Lácteos', calories: 402, protein: 25, carbs: 1.3, sugars: 0.5, fat: 33, saturated_fat: 21, salt: 0.62 },
  { name: 'Yogur', unit: 'ud', category: 'Lácteos', calories: 63, protein: 3.5, carbs: 4.7, sugars: 4.7, fat: 1.6, saturated_fat: 1, salt: 0.05 },
  { name: 'Mantequilla', unit: 'g', category: 'Lácteos', calories: 717, protein: 0.9, carbs: 0.1, sugars: 0.1, fat: 81, saturated_fat: 51, salt: 0.01 },
  { name: 'Nata', unit: 'ml', category: 'Lácteos', calories: 340, protein: 2, carbs: 3, sugars: 3, fat: 36, saturated_fat: 23, salt: 0.04 },

  { name: 'Huevos', unit: 'ud', category: 'Huevos', calories: 155, protein: 13, carbs: 1.1, sugars: 1.1, fat: 11, saturated_fat: 3.3, salt: 0.124 },

  { name: 'Pan', unit: 'ud', category: 'Panadería', calories: 265, protein: 9, carbs: 49, sugars: 3, fat: 3.2, saturated_fat: 0.7, salt: 0.49 },
  { name: 'Pan de molde', unit: 'ud', category: 'Panadería', calories: 266, protein: 8, carbs: 47, sugars: 3, fat: 4, saturated_fat: 1, salt: 0.48 },

  { name: 'Arroz', unit: 'g', category: 'Arroz y Pasta', calories: 130, protein: 2.7, carbs: 28, sugars: 0.3, fat: 0.3, saturated_fat: 0.1, salt: 0.001 },
  { name: 'Pasta', unit: 'g', category: 'Arroz y Pasta', calories: 131, protein: 5, carbs: 25, sugars: 0.6, fat: 1.1, saturated_fat: 0.2, salt: 0.001 },
  { name: 'Espaguetis', unit: 'g', category: 'Arroz y Pasta', calories: 131, protein: 5, carbs: 25, sugars: 0.6, fat: 1.1, saturated_fat: 0.2, salt: 0.001 },

  { name: 'Patatas', unit: 'kg', category: 'Verdulería', calories: 77, protein: 2, carbs: 17, sugars: 0.8, fat: 0.1, saturated_fat: 0, salt: 0.006 },
  { name: 'Cebolla', unit: 'ud', category: 'Verdulería', calories: 40, protein: 1.1, carbs: 9, sugars: 4.2, fat: 0.1, saturated_fat: 0, salt: 0.004 },
  { name: 'Ajo', unit: 'dientes', category: 'Verdulería', calories: 149, protein: 6.4, carbs: 33, sugars: 1, fat: 0.5, saturated_fat: 0.1, salt: 0.003 },
  { name: 'Tomate', unit: 'kg', category: 'Verdulería', calories: 18, protein: 0.9, carbs: 3.9, sugars: 2.6, fat: 0.2, saturated_fat: 0, salt: 0.005 },
  { name: 'Pimiento', unit: 'ud', category: 'Verdulería', calories: 31, protein: 1, carbs: 6, sugars: 4.2, fat: 0.3, saturated_fat: 0, salt: 0.004 },
  { name: 'Lechuga', unit: 'ud', category: 'Verdulería', calories: 15, protein: 1.4, carbs: 2.9, sugars: 0.8, fat: 0.2, saturated_fat: 0, salt: 0.028 },
  { name: 'Zanahoria', unit: 'ud', category: 'Verdulería', calories: 41, protein: 0.9, carbs: 10, sugars: 4.7, fat: 0.2, saturated_fat: 0, salt: 0.069 },
  { name: 'Calabacín', unit: 'ud', category: 'Verdulería', calories: 17, protein: 1.2, carbs: 3.1, sugars: 2.5, fat: 0.3, saturated_fat: 0.1, salt: 0.008 },
  { name: 'Brócoli', unit: 'ud', category: 'Verdulería', calories: 34, protein: 2.8, carbs: 6.6, sugars: 1.7, fat: 0.4, saturated_fat: 0.1, salt: 0.033 },
  { name: 'Espinacas', unit: 'g', category: 'Verdulería', calories: 23, protein: 2.9, carbs: 3.6, sugars: 0.4, fat: 0.4, saturated_fat: 0.1, salt: 0.079 },

  { name: 'Plátanos', unit: 'kg', category: 'Fruta', calories: 89, protein: 1.1, carbs: 23, sugars: 12, fat: 0.3, saturated_fat: 0.1, salt: 0.001 },
  { name: 'Manzana', unit: 'kg', category: 'Fruta', calories: 52, protein: 0.3, carbs: 14, sugars: 10, fat: 0.2, saturated_fat: 0, salt: 0.001 },
  { name: 'Naranja', unit: 'kg', category: 'Fruta', calories: 47, protein: 0.9, carbs: 12, sugars: 9, fat: 0.1, saturated_fat: 0, salt: 0 },
  { name: 'Limón', unit: 'ud', category: 'Fruta', calories: 29, protein: 1.1, carbs: 9, sugars: 2.5, fat: 0.3, saturated_fat: 0, salt: 0.002 },
  { name: 'Fresas', unit: 'g', category: 'Fruta', calories: 32, protein: 0.7, carbs: 7.7, sugars: 4.9, fat: 0.3, saturated_fat: 0, salt: 0.001 },

  { name: 'Aceite de oliva', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturated_fat: 14, salt: 0 },
  { name: 'AOVE', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturated_fat: 14, salt: 0 },
  { name: 'Vinagre', unit: 'ml', category: 'Aceite y Vinagre', calories: 21, protein: 0, carbs: 0.04, sugars: 0, fat: 0, saturated_fat: 0, salt: 0.001 },

  { name: 'Sal', unit: 'g', category: 'Especias', calories: 0, protein: 0, carbs: 0, sugars: 0, fat: 0, saturated_fat: 0, salt: 38.8 },
  { name: 'Pimienta', unit: 'g', category: 'Especias', calories: 251, protein: 10, carbs: 64, sugars: 0.6, fat: 3.3, saturated_fat: 1.4, salt: 0.02 },

  { name: 'Azúcar', unit: 'g', category: 'Azúcar y Harina', calories: 387, protein: 0, carbs: 100, sugars: 100, fat: 0, saturated_fat: 0, salt: 0 },
  { name: 'Harina', unit: 'g', category: 'Azúcar y Harina', calories: 364, protein: 10, carbs: 76, sugars: 0.3, fat: 1, saturated_fat: 0.2, salt: 0.002 },
  { name: 'Levadura', unit: 'g', category: 'Azúcar y Harina', calories: 325, protein: 40, carbs: 41, sugars: 0, fat: 7.6, saturated_fat: 1, salt: 0.51 },

  { name: 'Cacao', unit: 'g', category: 'Desayuno', calories: 228, protein: 20, carbs: 58, sugars: 1.8, fat: 14, saturated_fat: 8, salt: 0.021 },
  { name: 'Café', unit: 'g', category: 'Desayuno', calories: 2, protein: 0.1, carbs: 0, sugars: 0, fat: 0, saturated_fat: 0, salt: 0.004 },
  { name: 'Infusiones', unit: 'ud', category: 'Desayuno', calories: 1, protein: 0, carbs: 0.2, sugars: 0, fat: 0, saturated_fat: 0, salt: 0.001 },
  { name: 'Cereales', unit: 'g', category: 'Desayuno', calories: 379, protein: 7, carbs: 84, sugars: 26, fat: 1.8, saturated_fat: 0.3, salt: 0.65 },
  { name: 'Miel', unit: 'g', category: 'Desayuno', calories: 304, protein: 0.3, carbs: 82, sugars: 82, fat: 0, saturated_fat: 0, salt: 0.004 },

  { name: 'Salsa de soja', unit: 'ml', category: 'Salsas', calories: 53, protein: 8, carbs: 5, sugars: 0.4, fat: 0, saturated_fat: 0, salt: 5.6 },
  { name: 'Mayonesa', unit: 'g', category: 'Salsas', calories: 680, protein: 1, carbs: 0.6, sugars: 0.3, fat: 75, saturated_fat: 12, salt: 0.7 },
  { name: 'Ketchup', unit: 'g', category: 'Salsas', calories: 112, protein: 1.7, carbs: 26, sugars: 22, fat: 0.4, saturated_fat: 0.1, salt: 1.1 },
  { name: 'Mostaza', unit: 'g', category: 'Salsas', calories: 66, protein: 4, carbs: 5.3, sugars: 2, fat: 4, saturated_fat: 0.3, salt: 1.1 },
  { name: 'Tomate frito', unit: 'g', category: 'Salsas', calories: 70, protein: 1.5, carbs: 10, sugars: 6, fat: 2.5, saturated_fat: 0.4, salt: 0.5 },

  { name: 'Alubias', unit: 'g', category: 'Legumbres', calories: 127, protein: 9, carbs: 23, sugars: 0.3, fat: 0.5, saturated_fat: 0.1, salt: 0.001 },
  { name: 'Lentejas', unit: 'g', category: 'Legumbres', calories: 116, protein: 9, carbs: 20, sugars: 1.8, fat: 0.4, saturated_fat: 0.1, salt: 0.002 },
  { name: 'Garbanzos', unit: 'g', category: 'Legumbres', calories: 164, protein: 9, carbs: 27, sugars: 4.8, fat: 2.6, saturated_fat: 0.3, salt: 0.007 },

  { name: 'Gelatina', unit: 'g', category: 'Otros', calories: 335, protein: 86, carbs: 0, sugars: 0, fat: 0.1, saturated_fat: 0, salt: 1.6 },
  { name: 'Maicena', unit: 'g', category: 'Azúcar y Harina', calories: 381, protein: 0.3, carbs: 91, sugars: 0, fat: 0.1, saturated_fat: 0, salt: 0.009 },
  { name: 'Caldo', unit: 'ml', category: 'Otros', calories: 7, protein: 0.5, carbs: 0.4, sugars: 0.2, fat: 0.2, saturated_fat: 0.1, salt: 0.32 },
  { name: 'Nuez', unit: 'g', category: 'Fruta', calories: 654, protein: 15, carbs: 14, sugars: 2.6, fat: 65, saturated_fat: 6.1, salt: 0.002 },
  { name: 'Almendra', unit: 'g', category: 'Fruta', calories: 579, protein: 21, carbs: 22, sugars: 4.4, fat: 50, saturated_fat: 3.8, salt: 0.001 },

  { name: 'Pavo', unit: 'g', category: 'Carnicería', calories: 135, protein: 30, carbs: 0, sugars: 0, fat: 1, saturated_fat: 0.3, salt: 0.074 },
  { name: 'Cordero', unit: 'g', category: 'Carnicería', calories: 294, protein: 25, carbs: 0, sugars: 0, fat: 21, saturated_fat: 9, salt: 0.07 },
  { name: 'Conejo', unit: 'g', category: 'Carnicería', calories: 173, protein: 33, carbs: 0, sugars: 0, fat: 3.5, saturated_fat: 1.3, salt: 0.05 },
  { name: 'Hamburguesa', unit: 'ud', category: 'Carnicería', calories: 254, protein: 17, carbs: 2.5, sugars: 0.5, fat: 19, saturated_fat: 7.5, salt: 0.55 },
  { name: 'Solomillo', unit: 'g', category: 'Carnicería', calories: 217, protein: 26, carbs: 0, sugars: 0, fat: 12, saturated_fat: 5, salt: 0.054 },
  { name: 'Chuleta', unit: 'g', category: 'Carnicería', calories: 231, protein: 27, carbs: 0, sugars: 0, fat: 13, saturated_fat: 5, salt: 0.08 },

  { name: 'Merluza', unit: 'g', category: 'Pescadería', calories: 86, protein: 18, carbs: 0, sugars: 0, fat: 1, saturated_fat: 0.2, salt: 0.07 },
  { name: 'Bacalao', unit: 'g', category: 'Pescadería', calories: 82, protein: 18, carbs: 0, sugars: 0, fat: 0.7, saturated_fat: 0.1, salt: 0.05 },
  { name: 'Mejillones', unit: 'g', category: 'Pescadería', calories: 86, protein: 12, carbs: 3.7, sugars: 0, fat: 2.2, saturated_fat: 0.5, salt: 0.29 },
  { name: 'Calamares', unit: 'g', category: 'Pescadería', calories: 92, protein: 16, carbs: 1.4, sugars: 0, fat: 1.4, saturated_fat: 0.3, salt: 0.13 },
  { name: 'Pulpo', unit: 'g', category: 'Pescadería', calories: 82, protein: 15, carbs: 0, sugars: 0, fat: 1.5, saturated_fat: 0.3, salt: 0.15 },
  { name: 'Sardinas', unit: 'g', category: 'Pescadería', calories: 208, protein: 25, carbs: 0, sugars: 0, fat: 11, saturated_fat: 2.5, salt: 0.1 },
  { name: 'Bonito', unit: 'g', category: 'Pescadería', calories: 161, protein: 28, carbs: 0, sugars: 0, fat: 4.8, saturated_fat: 1.2, salt: 0.12 },

  { name: 'Leche desnatada', unit: 'ml', category: 'Lácteos', calories: 35, protein: 3.4, carbs: 5, sugars: 5, fat: 0.1, saturated_fat: 0.06, salt: 0.05 },
  { name: 'Leche semidesnatada', unit: 'ml', category: 'Lácteos', calories: 47, protein: 3.3, carbs: 4.8, sugars: 4.8, fat: 1.5, saturated_fat: 1, salt: 0.05 },
  { name: 'Queso fresco', unit: 'g', category: 'Lácteos', calories: 100, protein: 12, carbs: 3, sugars: 2, fat: 4.5, saturated_fat: 3, salt: 0.4 },
  { name: 'Queso crema', unit: 'g', category: 'Lácteos', calories: 342, protein: 6, carbs: 4, sugars: 2, fat: 34, saturated_fat: 19, salt: 0.32 },
  { name: 'Queso rallado', unit: 'g', category: 'Lácteos', calories: 431, protein: 25, carbs: 1.8, sugars: 0.5, fat: 37, saturated_fat: 23, salt: 1.2 },
  { name: 'Burrra', unit: 'g', category: 'Lácteos', calories: 310, protein: 5, carbs: 0, sugars: 0, fat: 31, saturated_fat: 19, salt: 0.1 },
  { name: 'Mozzarella', unit: 'g', category: 'Lácteos', calories: 280, protein: 28, carbs: 3, sugars: 1, fat: 17, saturated_fat: 11, salt: 0.63 },
  { name: 'Parmsano', unit: 'g', category: 'Lácteos', calories: 431, protein: 38, carbs: 4, sugars: 0.9, fat: 29, saturated_fat: 19, salt: 1.6 },
  { name: 'Requesón', unit: 'g', category: 'Lácteos', calories: 98, protein: 11, carbs: 3.4, sugars: 2, fat: 4.3, saturated_fat: 2.7, salt: 0.4 },

  { name: 'Avena', unit: 'g', category: 'Cereales', calories: 389, protein: 17, carbs: 66, sugars: 1, fat: 7, saturated_fat: 1.2, salt: 0.002 },
  { name: 'Trigo', unit: 'g', category: 'Cereales', calories: 340, protein: 13, carbs: 72, sugars: 0.4, fat: 2.5, saturated_fat: 0.4, salt: 0.002 },
  { name: 'Centeno', unit: 'g', category: 'Cereales', calories: 338, protein: 10, carbs: 75, sugars: 0.8, fat: 1.7, saturated_fat: 0.2, salt: 0.002 },
  { name: 'Quinoa', unit: 'g', category: 'Cereales', calories: 120, protein: 4.4, carbs: 21, sugars: 0.9, fat: 1.9, saturated_fat: 0.2, salt: 0.007 },
  { name: 'Cuscús', unit: 'g', category: 'Cereales', calories: 112, protein: 3.8, carbs: 23, sugars: 0.1, fat: 0.2, saturated_fat: 0, salt: 0.005 },

  { name: 'Acelgas', unit: 'g', category: 'Verdulería', calories: 19, protein: 1.8, carbs: 3.7, sugars: 1.1, fat: 0.2, saturated_fat: 0, salt: 0.12 },
  { name: 'Champiñones', unit: 'g', category: 'Verdulería', calories: 22, protein: 3.1, carbs: 3.3, sugars: 2, fat: 0.3, saturated_fat: 0.1, salt: 0.005 },
  { name: 'Judías verdes', unit: 'g', category: 'Verdulería', calories: 31, protein: 1.8, carbs: 7, sugars: 1.4, fat: 0.2, saturated_fat: 0, salt: 0.006 },
  { name: 'Coliflor', unit: 'ud', category: 'Verdulería', calories: 25, protein: 2, carbs: 5, sugars: 1.9, fat: 0.3, saturated_fat: 0.1, salt: 0.02 },
  { name: 'Repollo', unit: 'g', category: 'Verdulería', calories: 25, protein: 1.3, carbs: 6, sugars: 3.2, fat: 0.1, saturated_fat: 0, salt: 0.018 },
  { name: 'Coles de Bruselas', unit: 'g', category: 'Verdulería', calories: 43, protein: 3.4, carbs: 9, sugars: 2.2, fat: 0.3, saturated_fat: 0.1, salt: 0.025 },
  { name: 'Berenjena', unit: 'ud', category: 'Verdulería', calories: 25, protein: 1, carbs: 6, sugars: 3.5, fat: 0.2, saturated_fat: 0, salt: 0.004 },
  { name: 'Puerro', unit: 'ud', category: 'Verdulería', calories: 61, protein: 1.5, carbs: 14, sugars: 3.5, fat: 0.3, saturated_fat: 0, salt: 0.02 },
  { name: 'Apio', unit: 'ud', category: 'Verdulería', calories: 16, protein: 0.7, carbs: 3, sugars: 1.3, fat: 0.2, saturated_fat: 0, salt: 0.08 },
  { name: 'Nabo', unit: 'g', category: 'Verdulería', calories: 28, protein: 0.9, carbs: 6, sugars: 3.8, fat: 0.1, saturated_fat: 0, salt: 0.07 },
  { name: 'Boniato', unit: 'g', category: 'Verdulería', calories: 86, protein: 1.6, carbs: 20, sugars: 4.2, fat: 0.1, saturated_fat: 0, salt: 0.036 },
  { name: 'Remolacha', unit: 'g', category: 'Verdulería', calories: 43, protein: 1.6, carbs: 10, sugars: 7, fat: 0.2, saturated_fat: 0, salt: 0.078 },
  { name: 'Rúcula', unit: 'g', category: 'Verdulería', calories: 25, protein: 2.6, carbs: 3.7, sugars: 2, fat: 0.7, saturated_fat: 0.1, salt: 0.027 },
  { name: 'Canónigos', unit: 'g', category: 'Verdulería', calories: 21, protein: 2.3, carbs: 3.6, sugars: 0.7, fat: 0.4, saturated_fat: 0.1, salt: 0.041 },

  { name: 'Uva', unit: 'g', category: 'Fruta', calories: 69, protein: 0.7, carbs: 18, sugars: 16, fat: 0.2, saturated_fat: 0.1, salt: 0.003 },
  { name: 'Sandía', unit: 'g', category: 'Fruta', calories: 30, protein: 0.6, carbs: 8, sugars: 6, fat: 0.2, saturated_fat: 0, salt: 0.001 },
  { name: 'Melón', unit: 'g', category: 'Fruta', calories: 36, protein: 0.9, carbs: 9, sugars: 8, fat: 0.2, saturated_fat: 0, salt: 0.016 },
  { name: 'Kiwi', unit: 'ud', category: 'Fruta', calories: 61, protein: 1.1, carbs: 15, sugars: 9, fat: 0.5, saturated_fat: 0.1, salt: 0.002 },
  { name: 'Piña', unit: 'g', category: 'Fruta', calories: 50, protein: 0.5, carbs: 13, sugars: 10, fat: 0.1, saturated_fat: 0, salt: 0.002 },
  { name: 'Aguacate', unit: 'ud', category: 'Fruta', calories: 160, protein: 2, carbs: 9, sugars: 0.7, fat: 15, saturated_fat: 2.1, salt: 0.007 },
  { name: 'Mango', unit: 'ud', category: 'Fruta', calories: 60, protein: 0.8, carbs: 15, sugars: 14, fat: 0.4, saturated_fat: 0.1, salt: 0.002 },
  { name: 'Pera', unit: 'ud', category: 'Fruta', calories: 57, protein: 0.4, carbs: 15, sugars: 10, fat: 0.1, saturated_fat: 0, salt: 0.002 },
  { name: 'Melocotón', unit: 'ud', category: 'Fruta', calories: 39, protein: 0.9, carbs: 10, sugars: 8, fat: 0.3, saturated_fat: 0, salt: 0.001 },
  { name: 'Cereza', unit: 'g', category: 'Fruta', calories: 50, protein: 1, carbs: 12, sugars: 8, fat: 0.3, saturated_fat: 0.1, salt: 0.001 },
  { name: 'Higo', unit: 'ud', category: 'Fruta', calories: 37, protein: 0.5, carbs: 10, sugars: 9, fat: 0.2, saturated_fat: 0, salt: 0.002 },
  { name: 'Granada', unit: 'ud', category: 'Fruta', calories: 83, protein: 1.7, carbs: 19, sugars: 14, fat: 1.2, saturated_fat: 0.1, salt: 0.003 },
  { name: 'Pomelo', unit: 'ud', category: 'Fruta', calories: 42, protein: 0.8, carbs: 11, sugars: 7, fat: 0.1, saturated_fat: 0, salt: 0.001 },
  { name: 'Caqui', unit: 'ud', category: 'Fruta', calories: 70, protein: 0.6, carbs: 19, sugars: 14, fat: 0.2, saturated_fat: 0, salt: 0.001 },
  { name: 'Albaricoque', unit: 'ud', category: 'Fruta', calories: 17, protein: 0.5, carbs: 4, sugars: 3.5, fat: 0.1, saturated_fat: 0, salt: 0.001 },
  { name: 'Moras', unit: 'g', category: 'Fruta', calories: 43, protein: 1.4, carbs: 10, sugars: 4.9, fat: 0.5, saturated_fat: 0, salt: 0.001 },
  { name: 'Arándanos', unit: 'g', category: 'Fruta', calories: 57, protein: 0.7, carbs: 14, sugars: 10, fat: 0.3, saturated_fat: 0, salt: 0.002 },

  { name: 'Pistachos', unit: 'g', category: 'Frutos secos', calories: 560, protein: 20, carbs: 28, sugars: 7.7, fat: 45, saturated_fat: 5.5, salt: 0.001 },
  { name: 'Cacahuetes', unit: 'g', category: 'Frutos secos', calories: 567, protein: 26, carbs: 16, sugars: 4, fat: 49, saturated_fat: 6.8, salt: 0.001 },
  { name: 'Avellanas', unit: 'g', category: 'Frutos secos', calories: 628, protein: 15, carbs: 17, sugars: 4.3, fat: 61, saturated_fat: 4.5, salt: 0.001 },
  { name: 'Pipas de girasol', unit: 'g', category: 'Frutos secos', calories: 584, protein: 21, carbs: 20, sugars: 2.6, fat: 51, saturated_fat: 4.5, salt: 0.001 },
  { name: 'Pasas', unit: 'g', category: 'Frutos secos', calories: 299, protein: 3.1, carbs: 79, sugars: 59, fat: 0.5, saturated_fat: 0.2, salt: 0.011 },

  { name: 'Oregano', unit: 'g', category: 'Especias', calories: 265, protein: 9, carbs: 69, sugars: 4.1, fat: 4.3, saturated_fat: 1.6, salt: 0.025 },
  { name: 'Comino', unit: 'g', category: 'Especias', calories: 375, protein: 18, carbs: 44, sugars: 2.3, fat: 22, saturated_fat: 1.5, salt: 0.024 },
  { name: 'Pimentón', unit: 'g', category: 'Especias', calories: 282, protein: 14, carbs: 54, sugars: 10, fat: 13, saturated_fat: 2.1, salt: 0.068 },
  { name: 'Laurel', unit: 'ud', category: 'Especias', calories: 6, protein: 0.1, carbs: 1.5, sugars: 0, fat: 0, saturated_fat: 0, salt: 0.001 },
  { name: 'Curry', unit: 'g', category: 'Especias', calories: 325, protein: 14, carbs: 58, sugars: 2, fat: 14, saturated_fat: 2, salt: 0.052 },
  { name: 'Canela', unit: 'g', category: 'Especias', calories: 247, protein: 4, carbs: 81, sugars: 2.2, fat: 1.2, saturated_fat: 0.3, salt: 0.02 },
  { name: 'Jenjibre', unit: 'g', category: 'Especias', calories: 80, protein: 1.8, carbs: 18, sugars: 1.7, fat: 0.8, saturated_fat: 0.2, salt: 0.013 },
  { name: 'Azafrán', unit: 'g', category: 'Especias', calories: 310, protein: 11, carbs: 65, sugars: 0.4, fat: 5.9, saturated_fat: 1.6, salt: 0.148 },
  { name: 'Vainilla', unit: 'g', category: 'Especias', calories: 288, protein: 0.1, carbs: 13, sugars: 13, fat: 0.1, saturated_fat: 0, salt: 0.009 },

  { name: 'Aceite vegetal', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturated_fat: 7, salt: 0 },
  { name: 'Aceite de coco', unit: 'ml', category: 'Aceite y Vinagre', calories: 862, protein: 0, carbs: 0, sugars: 0, fat: 100, saturated_fat: 87, salt: 0 },
  { name: 'Aceite de girasol', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturated_fat: 10, salt: 0 },

  { name: 'Nuez moscada', unit: 'g', category: 'Especias', calories: 525, protein: 6, carbs: 49, sugars: 2.8, fat: 36, saturated_fat: 25, salt: 0.016 },

  { name: 'Agua', unit: 'ml', category: 'Bebidas', calories: 0, protein: 0, carbs: 0, sugars: 0, fat: 0, saturated_fat: 0, salt: 0 },
  { name: 'Zumo de naranja', unit: 'ml', category: 'Bebidas', calories: 45, protein: 0.7, carbs: 10, sugars: 8.4, fat: 0.2, saturated_fat: 0, salt: 0.001 },
  { name: 'Zumo de manzana', unit: 'ml', category: 'Bebidas', calories: 46, protein: 0.1, carbs: 11, sugars: 10, fat: 0.1, saturated_fat: 0, salt: 0.004 },
  { name: 'Refresco', unit: 'ml', category: 'Bebidas', calories: 41, protein: 0, carbs: 10.6, sugars: 10.6, fat: 0, saturated_fat: 0, salt: 0.012 },

  { name: 'Chocolate negro', unit: 'g', category: 'Otros', calories: 598, protein: 7.8, carbs: 46, sugars: 24, fat: 43, saturated_fat: 24, salt: 0.02 },
  { name: 'Chocolate con leche', unit: 'g', category: 'Otros', calories: 535, protein: 8, carbs: 52, sugars: 49, fat: 30, saturated_fat: 19, salt: 0.15 },
  { name: 'Galletas', unit: 'ud', category: 'Otros', calories: 45, protein: 0.6, carbs: 6, sugars: 2.5, fat: 2, saturated_fat: 0.8, salt: 0.05 },
  { name: 'Patatas fritas', unit: 'g', category: 'Otros', calories: 536, protein: 7, carbs: 53, sugars: 0.5, fat: 35, saturated_fat: 6, salt: 0.5 },
  { name: 'Palomitas', unit: 'g', category: 'Otros', calories: 387, protein: 13, carbs: 78, sugars: 0.9, fat: 4.5, saturated_fat: 0.7, salt: 0.94 },

  { name: 'Tofu', unit: 'g', category: 'Otros', calories: 76, protein: 8, carbs: 1.9, sugars: 0.6, fat: 4.8, saturated_fat: 0.7, salt: 0.007 },
  { name: 'Tempeh', unit: 'g', category: 'Otros', calories: 193, protein: 19, carbs: 9.4, sugars: 0, fat: 11, saturated_fat: 2.5, salt: 0.009 },
  { name: 'Seitan', unit: 'g', category: 'Otros', calories: 370, protein: 75, carbs: 14, sugars: 0.5, fat: 1.9, saturated_fat: 0.3, salt: 0.38 },

  { name: 'Soja texturizada', unit: 'g', category: 'Legumbres', calories: 345, protein: 52, carbs: 35, sugars: 6, fat: 1.8, saturated_fat: 0.3, salt: 0.02 },
  { name: 'Edamame', unit: 'g', category: 'Legumbres', calories: 121, protein: 12, carbs: 9, sugars: 2.2, fat: 5.2, saturated_fat: 0.8, salt: 0.006 },

  { name: 'Copos de avena', unit: 'g', category: 'Desayuno', calories: 375, protein: 13, carbs: 67, sugars: 1, fat: 6.5, saturated_fat: 1.1, salt: 0.002 },
  { name: 'Muesli', unit: 'g', category: 'Desayuno', calories: 340, protein: 8, carbs: 66, sugars: 24, fat: 5.5, saturated_fat: 0.8, salt: 0.15 },
  { name: 'Galletas integrales', unit: 'ud', category: 'Desayuno', calories: 43, protein: 0.8, carbs: 7, sugars: 2.5, fat: 1.5, saturated_fat: 0.3, salt: 0.06 },
  { name: 'Tostadas integrales', unit: 'ud', category: 'Desayuno', calories: 38, protein: 1.5, carbs: 7, sugars: 0.8, fat: 0.5, saturated_fat: 0.1, salt: 0.12 },

  { name: 'Mantequilla de cacahuete', unit: 'g', category: 'Otros', calories: 588, protein: 25, carbs: 20, sugars: 9, fat: 50, saturated_fat: 10, salt: 0.67 },
  { name: 'Tahini', unit: 'g', category: 'Otros', calories: 595, protein: 17, carbs: 21, sugars: 0.3, fat: 54, saturated_fat: 7.6, salt: 0.003 },
  { name: 'Hummus', unit: 'g', category: 'Otros', calories: 166, protein: 8, carbs: 14, sugars: 0.4, fat: 10, saturated_fat: 1.4, salt: 0.38 },

  { name: 'Piñones', unit: 'g', category: 'Frutos secos', calories: 673, protein: 14, carbs: 13, sugars: 3.7, fat: 68, saturated_fat: 4.9, salt: 0.003 },
  { name: 'Macadamia', unit: 'g', category: 'Frutos secos', calories: 718, protein: 8, carbs: 14, sugars: 4.6, fat: 76, saturated_fat: 12, salt: 0.001 },

  { name: 'Curry en pasta', unit: 'g', category: 'Salsas', calories: 135, protein: 2, carbs: 8, sugars: 3, fat: 11, saturated_fat: 1.5, salt: 1.1 },
  { name: 'Pesto', unit: 'g', category: 'Salsas', calories: 467, protein: 5, carbs: 6, sugars: 1, fat: 47, saturated_fat: 7, salt: 0.88 },
  { name: 'Barbacoa', unit: 'ml', category: 'Salsas', calories: 172, protein: 0.8, carbs: 40, sugars: 33, fat: 0.6, saturated_fat: 0.1, salt: 1.1 },
  { name: 'Alioli', unit: 'g', category: 'Salsas', calories: 615, protein: 1, carbs: 1, sugars: 0.5, fat: 68, saturated_fat: 10, salt: 0.6 },
];

async function seedIngredients() {
  console.log('Seeding ingredients to Supabase...');
  
  let created = 0;
  let updated = 0;
  let skipped = 0;
  
  for (const ingredient of ingredients) {
    const { error } = await supabase
      .from('ingredients')
      .upsert(ingredient, { onConflict: 'name' })
      .select()
      .single();
    
    if (error) {
      console.log(`Error upserting ${ingredient.name}:`, error.message);
      skipped++;
    } else {
      updated++;
    }
  }
  
  console.log(`Seeded ${updated} ingredients, ${skipped} skipped`);
}

seedIngredients().catch(console.error);