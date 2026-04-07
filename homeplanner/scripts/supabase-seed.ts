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
];

async function seedIngredients() {
  console.log('Seeding ingredients to Supabase...');
  
  let created = 0;
  let skipped = 0;
  
  for (const ingredient of ingredients) {
    const { error } = await supabase
      .from('ingredients')
      .upsert({ name: ingredient.name }, { onConflict: 'name' })
      .select()
      .single();
    
    if (error) {
      // If conflict, try to insert with all data
      const { error: insertError } = await supabase
        .from('ingredients')
        .insert(ingredient);
      
      if (insertError && insertError.code !== '23505') { // Ignore duplicate errors
        console.log(`Error inserting ${ingredient.name}:`, insertError.message);
        skipped++;
      } else {
        created++;
      }
    } else {
      created++;
    }
  }
  
  console.log(`Seeded ${created} ingredients, ${skipped} skipped`);
}

seedIngredients().catch(console.error);