import { PrismaClient } from '../src/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adapter = new PrismaLibSql({
  url: `file:${path.join(__dirname, 'dev.db')}`,
});

const prisma = new PrismaClient({ adapter });

interface IngredientData {
  name: string;
  unit: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  sugars: number;
  fat: number;
  saturatedFat: number;
  salt: number;
}

const ingredients: IngredientData[] = [
  // CARNICERÍA
  { name: 'Pollo', unit: 'g', category: 'Carnicería', calories: 165, protein: 31, carbs: 0, sugars: 0, fat: 3.6, saturatedFat: 1, salt: 0.074 },
  { name: 'Carne molida', unit: 'g', category: 'Carnicería', calories: 250, protein: 26, carbs: 0, sugars: 0, fat: 15, saturatedFat: 6, salt: 0.075 },
  { name: 'Cerdo', unit: 'g', category: 'Carnicería', calories: 242, protein: 27, carbs: 0, sugars: 0, fat: 14, saturatedFat: 5, salt: 0.07 },
  { name: 'Ternera', unit: 'g', category: 'Carnicería', calories: 250, protein: 26, carbs: 0, sugars: 0, fat: 15, saturatedFat: 6, salt: 0.07 },
  { name: 'Bacon', unit: 'g', category: 'Carnicería', calories: 541, protein: 37, carbs: 1.4, sugars: 0, fat: 42, saturatedFat: 14, salt: 1.7 },
  { name: 'Jamón', unit: 'g', category: 'Carnicería', calories: 145, protein: 21, carbs: 0.2, sugars: 0, fat: 6, saturatedFat: 2, salt: 1.2 },
  { name: 'Salchichas', unit: 'ud', category: 'Carnicería', calories: 301, protein: 12, carbs: 2, sugars: 0, fat: 27, saturatedFat: 10, salt: 0.8 },

  // PESCADERÍA
  { name: 'Pescado blanco', unit: 'g', category: 'Pescadería', calories: 86, protein: 19, carbs: 0, sugars: 0, fat: 0.8, saturatedFat: 0.2, salt: 0.054 },
  { name: 'Salmón', unit: 'g', category: 'Pescadería', calories: 208, protein: 20, carbs: 0, sugars: 0, fat: 13, saturatedFat: 3, salt: 0.059 },
  { name: 'Gambas', unit: 'g', category: 'Pescadería', calories: 85, protein: 18, carbs: 0.2, sugars: 0, fat: 0.5, saturatedFat: 0.1, salt: 0.38 },
  { name: 'Atún', unit: 'g', category: 'Pescadería', calories: 144, protein: 23, carbs: 0, sugars: 0, fat: 5, saturatedFat: 1, salt: 0.15 },

  // LÁCTEOS
  { name: 'Leche', unit: 'ml', category: 'Lácteos', calories: 42, protein: 3.4, carbs: 5, sugars: 5, fat: 1, saturatedFat: 0.6, salt: 0.044 },
  { name: 'Queso', unit: 'g', category: 'Lácteos', calories: 402, protein: 25, carbs: 1.3, sugars: 0.5, fat: 33, saturatedFat: 21, salt: 0.62 },
  { name: 'Yogur', unit: 'ud', category: 'Lácteos', calories: 63, protein: 3.5, carbs: 4.7, sugars: 4.7, fat: 1.6, saturatedFat: 1, salt: 0.05 },
  { name: 'Mantequilla', unit: 'g', category: 'Lácteos', calories: 717, protein: 0.9, carbs: 0.1, sugars: 0.1, fat: 81, saturatedFat: 51, salt: 0.01 },
  { name: 'Nata', unit: 'ml', category: 'Lácteos', calories: 340, protein: 2, carbs: 3, sugars: 3, fat: 36, saturatedFat: 23, salt: 0.04 },

  // HUEVOS
  { name: 'Huevos', unit: 'ud', category: 'Huevos', calories: 155, protein: 13, carbs: 1.1, sugars: 1.1, fat: 11, saturatedFat: 3.3, salt: 0.124 },

  // PANADERÍA
  { name: 'Pan', unit: 'ud', category: 'Panadería', calories: 265, protein: 9, carbs: 49, sugars: 3, fat: 3.2, saturatedFat: 0.7, salt: 0.49 },
  { name: 'Pan de molde', unit: 'ud', category: 'Panadería', calories: 266, protein: 8, carbs: 47, sugars: 3, fat: 4, saturatedFat: 1, salt: 0.48 },

  // ARROZ Y PASTA
  { name: 'Arroz', unit: 'g', category: 'Arroz y Pasta', calories: 130, protein: 2.7, carbs: 28, sugars: 0.3, fat: 0.3, saturatedFat: 0.1, salt: 0.001 },
  { name: 'Pasta', unit: 'g', category: 'Arroz y Pasta', calories: 131, protein: 5, carbs: 25, sugars: 0.6, fat: 1.1, saturatedFat: 0.2, salt: 0.001 },
  { name: 'Espaguetis', unit: 'g', category: 'Arroz y Pasta', calories: 131, protein: 5, carbs: 25, sugars: 0.6, fat: 1.1, saturatedFat: 0.2, salt: 0.001 },

  // VERDULERÍA
  { name: 'Patatas', unit: 'kg', category: 'Verdulería', calories: 77, protein: 2, carbs: 17, sugars: 0.8, fat: 0.1, saturatedFat: 0, salt: 0.006 },
  { name: 'Cebolla', unit: 'ud', category: 'Verdulería', calories: 40, protein: 1.1, carbs: 9, sugars: 4.2, fat: 0.1, saturatedFat: 0, salt: 0.004 },
  { name: 'Ajo', unit: 'dientes', category: 'Verdulería', calories: 149, protein: 6.4, carbs: 33, sugars: 1, fat: 0.5, saturatedFat: 0.1, salt: 0.003 },
  { name: 'Tomate', unit: 'kg', category: 'Verdulería', calories: 18, protein: 0.9, carbs: 3.9, sugars: 2.6, fat: 0.2, saturatedFat: 0, salt: 0.005 },
  { name: 'Pimiento', unit: 'ud', category: 'Verdulería', calories: 31, protein: 1, carbs: 6, sugars: 4.2, fat: 0.3, saturatedFat: 0, salt: 0.004 },
  { name: 'Lechuga', unit: 'ud', category: 'Verdulería', calories: 15, protein: 1.4, carbs: 2.9, sugars: 0.8, fat: 0.2, saturatedFat: 0, salt: 0.028 },
  { name: 'Zanahoria', unit: 'ud', category: 'Verdulería', calories: 41, protein: 0.9, carbs: 10, sugars: 4.7, fat: 0.2, saturatedFat: 0, salt: 0.069 },
  { name: 'Calabacín', unit: 'ud', category: 'Verdulería', calories: 17, protein: 1.2, carbs: 3.1, sugars: 2.5, fat: 0.3, saturatedFat: 0.1, salt: 0.008 },
  { name: 'Brócoli', unit: 'ud', category: 'Verdulería', calories: 34, protein: 2.8, carbs: 6.6, sugars: 1.7, fat: 0.4, saturatedFat: 0.1, salt: 0.033 },
  { name: 'Espinacas', unit: 'g', category: 'Verdulería', calories: 23, protein: 2.9, carbs: 3.6, sugars: 0.4, fat: 0.4, saturatedFat: 0.1, salt: 0.079 },

  // FRUTA
  { name: 'Plátanos', unit: 'kg', category: 'Fruta', calories: 89, protein: 1.1, carbs: 23, sugars: 12, fat: 0.3, saturatedFat: 0.1, salt: 0.001 },
  { name: 'Manzanas', unit: 'kg', category: 'Fruta', calories: 52, protein: 0.3, carbs: 14, sugars: 10, fat: 0.2, saturatedFat: 0, salt: 0.001 },
  { name: 'Naranjas', unit: 'kg', category: 'Fruta', calories: 47, protein: 0.9, carbs: 12, sugars: 9, fat: 0.1, saturatedFat: 0, salt: 0 },
  { name: 'Limones', unit: 'ud', category: 'Fruta', calories: 29, protein: 1.1, carbs: 9, sugars: 2.5, fat: 0.3, saturatedFat: 0, salt: 0.002 },
  { name: 'Fresas', unit: 'g', category: 'Fruta', calories: 32, protein: 0.7, carbs: 7.7, sugars: 4.9, fat: 0.3, saturatedFat: 0, salt: 0.001 },

  // ACEITES
  { name: 'Aceite de oliva', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturatedFat: 14, salt: 0 },
  { name: 'AOVE', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturatedFat: 14, salt: 0 },
  { name: 'Aceite vegetal', unit: 'ml', category: 'Aceite y Vinagre', calories: 884, protein: 0, carbs: 0, sugars: 0, fat: 100, saturatedFat: 15, salt: 0 },

  // ESPECIAS
  { name: 'Sal', unit: 'g', category: 'Especias', calories: 0, protein: 0, carbs: 0, sugars: 0, fat: 0, saturatedFat: 0, salt: 38.8 },
  { name: 'Pimienta', unit: 'g', category: 'Especias', calories: 251, protein: 10, carbs: 64, sugars: 0.6, fat: 3.3, saturatedFat: 1.4, salt: 0.02 },
  { name: 'Vinagre', unit: 'ml', category: 'Aceite y Vinagre', calories: 21, protein: 0, carbs: 0.04, sugars: 0, fat: 0, saturatedFat: 0, salt: 0.001 },

  // AZÚCAR Y HARINA
  { name: 'Azúcar', unit: 'g', category: 'Azúcar y Harina', calories: 387, protein: 0, carbs: 100, sugars: 100, fat: 0, saturatedFat: 0, salt: 0 },
  { name: 'Harina', unit: 'g', category: 'Azúcar y Harina', calories: 364, protein: 10, carbs: 76, sugars: 0.3, fat: 1, saturatedFat: 0.2, salt: 0.002 },
  { name: 'Levadura', unit: 'g', category: 'Azúcar y Harina', calories: 325, protein: 40, carbs: 41, sugars: 0, fat: 7.6, saturatedFat: 1, salt: 0.51 },

  // DESAYUNO
  { name: 'Cacao', unit: 'g', category: 'Desayuno', calories: 228, protein: 20, carbs: 58, sugars: 1.8, fat: 14, saturatedFat: 8, salt: 0.021 },
  { name: 'Café', unit: 'g', category: 'Desayuno', calories: 2, protein: 0.1, carbs: 0, sugars: 0, fat: 0, saturatedFat: 0, salt: 0.004 },
  { name: 'Infusiones', unit: 'ud', category: 'Desayuno', calories: 1, protein: 0, carbs: 0.2, sugars: 0, fat: 0, saturatedFat: 0, salt: 0.001 },
  { name: 'Cereales', unit: 'g', category: 'Desayuno', calories: 379, protein: 7, carbs: 84, sugars: 26, fat: 1.8, saturatedFat: 0.3, salt: 0.65 },
  { name: 'Miel', unit: 'g', category: 'Desayuno', calories: 304, protein: 0.3, carbs: 82, sugars: 82, fat: 0, saturatedFat: 0, salt: 0.004 },

  // SALSAS
  { name: 'Salsa de soja', unit: 'ml', category: 'Salsas', calories: 53, protein: 8, carbs: 5, sugars: 0.4, fat: 0, saturatedFat: 0, salt: 5.6 },
  { name: 'Mayonesa', unit: 'g', category: 'Salsas', calories: 680, protein: 1, carbs: 0.6, sugars: 0.3, fat: 75, saturatedFat: 12, salt: 0.7 },
  { name: 'Ketchup', unit: 'g', category: 'Salsas', calories: 112, protein: 1.7, carbs: 26, sugars: 22, fat: 0.4, saturatedFat: 0.1, salt: 1.1 },
  { name: 'Mostaza', unit: 'g', category: 'Salsas', calories: 66, protein: 4, carbs: 5.3, sugars: 2, fat: 4, saturatedFat: 0.3, salt: 1.1 },
  { name: 'Tomate frito', unit: 'g', category: 'Salsas', calories: 70, protein: 1.5, carbs: 10, sugars: 6, fat: 2.5, saturatedFat: 0.4, salt: 0.5 },

  // LEGUMBRES
  { name: 'Alubias', unit: 'g', category: 'Legumbres', calories: 127, protein: 9, carbs: 23, sugars: 0.3, fat: 0.5, saturatedFat: 0.1, salt: 0.001 },
  { name: 'Lentejas', unit: 'g', category: 'Legumbres', calories: 116, protein: 9, carbs: 20, sugars: 1.8, fat: 0.4, saturatedFat: 0.1, salt: 0.002 },
  { name: 'Garbanzos', unit: 'g', category: 'Legumbres', calories: 164, protein: 9, carbs: 27, sugars: 4.8, fat: 2.6, saturatedFat: 0.3, salt: 0.007 },

  // OTROS
  { name: 'Gelatina', unit: 'g', category: 'Otros', calories: 335, protein: 86, carbs: 0, sugars: 0, fat: 0.1, saturatedFat: 0, salt: 1.6 },
  { name: 'Maicena', unit: 'g', category: 'Azúcar y Harina', calories: 381, protein: 0.3, carbs: 91, sugars: 0, fat: 0.1, saturatedFat: 0, salt: 0.009 },
  { name: 'Vino', unit: 'ml', category: 'Otros', calories: 83, protein: 0, carbs: 2.6, sugars: 0.4, fat: 0, saturatedFat: 0, salt: 0.004 },
  { name: 'Caldo', unit: 'ml', category: 'Otros', calories: 7, protein: 0.5, carbs: 0.4, sugars: 0.2, fat: 0.2, saturatedFat: 0.1, salt: 0.32 },
  { name: 'Nuez', unit: 'g', category: 'Fruta', calories: 654, protein: 15, carbs: 14, sugars: 2.6, fat: 65, saturatedFat: 6.1, salt: 0.002 },
  { name: 'Almendra', unit: 'g', category: 'Fruta', calories: 579, protein: 21, carbs: 22, sugars: 4.4, fat: 50, saturatedFat: 3.8, salt: 0.001 },
];

async function main() {
  console.log('Starting seed with nutritional values...');

  for (const ingredient of ingredients) {
    await prisma.ingredient.upsert({
      where: { name: ingredient.name },
      update: ingredient,
      create: ingredient,
    });
  }

  console.log(`Seeded ${ingredients.length} ingredients with nutritional values`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });