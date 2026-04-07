# Project Specification: HomeHub - Meal & Home Management

## 1. Visión General

HomeHub es una aplicación de gestión doméstica diseñada para centralizar la planificación de comidas y tareas del hogar. El objetivo principal es permitir una "Sesión de Planificación Dominical" donde se seleccionan los platos de la semana y la app genera automáticamente una lista de la compra exacta basada en ingredientes y cantidades.

## 2. Stack Tecnológico

| Tecnología | Uso | Licencia |
|------------|-----|----------|
| **React 18+** | Frontend framework | MIT (Free) |
| **Vite** | Bundler y dev server | MIT (Free) |
| **TypeScript** | Tipado estático | Apache 2.0 (Free) |
| **Tailwind CSS** | Estilos | MIT (Free) |
| **Node.js** | Runtime backend | MIT (Free) |
| **tsx** | Ejecución TypeScript | MIT (Free) |
| **SQLite** | Base de datos local | Public Domain (Free) |
| **Prisma** | ORM y migraciones | Apache 2.0 (Free) |
| **TanStack Query** | Estado servidor y cache | MIT (Free) |
| **Axios** | Cliente HTTP | MIT (Free) |

## 3. Arquitectura de Datos (Prisma Schema)

```prisma
// schema.prisma

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Ingredient {
  id        String   @id @default(uuid())
  name      String   @unique
  unit      String   // ej: "g", "kg", "ml", "unidades"
  category  String?  // ej: "Fruta", "Carnicería" (para agrupar la compra)
  dishes    RecipeIngredient[]
}

model Dish {
  id          String @id @default(uuid())
  name        String
  description String?
  ingredients RecipeIngredient[]
  weeklyPlans WeeklyPlanDish[]
}

model RecipeIngredient {
  id           String     @id @default(uuid())
  dishId       String
  ingredientId String
  quantity     Float
  dish         Dish       @relation(fields: [dishId], references: [id], onDelete: Cascade)
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)

  @@unique([dishId, ingredientId])
}

model WeeklyPlan {
  id        String   @id @default(uuid())
  day       String   // "Lunes", "Martes", etc.
  slot      String   // "Comida", "Cena"
  weekStart DateTime // Fecha del lunes de esa semana
  dishes    WeeklyPlanDish[]
  @@unique([day, slot, weekStart])
}

model WeeklyPlanDish {
  id            String      @id @default(uuid())
  weeklyPlanId  String
  dishId        String
  weeklyPlan    WeeklyPlan  @relation(fields: [weeklyPlanId], references: [id], onDelete: Cascade)
  dish          Dish        @relation(fields: [dishId], references: [id], onDelete: Cascade)

  @@unique([weeklyPlanId, dishId])
}

model ManualItem {
  id        String   @id @default(uuid())
  name      String
  quantity  Float?
  unit      String?
  checked   Boolean  @default(false)
  weekStart DateTime
}

model MealTemplate {
  id        String   @id @default(uuid())
  name      String
  slot      String   // "Comida" o "Cena"
  dishIds   String   // JSON array stored as string
}

model WeekTemplate {
  id        String   @id @default(uuid())
  name      String
  mondayLunch    String?
  mondayDinner   String?
  tuesdayLunch   String?
  tuesdayDinner  String?
  wednesdayLunch String?
  wednesdayDinner String?
  thursdayLunch  String?
  thursdayDinner String?
  fridayLunch   String?
  fridayDinner  String?
  saturdayLunch String?
  saturdayDinner String?
  sundayLunch   String?
  sundayDinner  String?
}
```

## 4. Requerimientos Funcionales (MVP)

### 4.1 Módulo de Cocina (Masterlist)
- **Gestión de Platos**: Cada plato tiene nombre, descripción e ingredientes
- **Validación de Unidades**: Warning cuando se añaden ingredientes con unidades incompatibles (peso vs volumen)
- **CRUD Completo**: Crear, editar, eliminar y listar platos

### 4.2 Planificador Dominical
- **Grid Semanal**: Vista de calendario (Lunes-Domingo) con slots para Comida y Cena
- **Selector Múltiple**: 
  - Al hacer clic en un slot, se abre un modal para seleccionar 1 o N platos
  - Los platos seleccionados se muestran como "combo" (ej: "Pollo + Verduras")
- **Navegación por Semanas**: Botones para cambiar entre semanas

### 4.3 Motor de Lista de la Compra (Shopping Engine)
- **Agregación Inteligente**:
  1. Iterar por todos los platos de cada slot del WeeklyPlan activo
  2. Para cada plato, obtener sus ingredientes
  3. Sumar las `quantity` de los `Ingredient` idénticos (con conversión de unidades)
  4. Presentar la lista final agrupada por `category`
- **Items Manuales**: Opción de añadir productos que no pertenecen a recetas (ej: Detergente)
- **Checklist Interactivo**: Marcar items como comprados (persistido en localStorage)

### 4.4 Dashboard
- Acceso rápido al plan del día actual
- Vista previa de la lista de compra pendiente
- Resumen semanal de platos planificados

### 4.5 Plantillas (Templates)
- **MealTemplate**: Guarda combinaciones de platos con un nombre personalizado
  - Ejemplo: "Burguer Night" = hamburguesa + pan + ketchup + patatas fritas
- **WeekTemplate**: Guarda semanas completas con todas sus comidas
  - Ejemplo: "Semana saludable" = 14 comidas predefinidas
- **Integración en Planificador**: 
  - Botón "Guardar" para salvar la selección actual como template
  - Pestaña "Guardados" para aplicar templates existentes
- **Página dedicada** (/templates): Gestión de templates creados

## 5. Especificaciones de Interfaz (UI/UX)

### Principios de Diseño (según `.agent-skills/homeplanner-ui.json`)
- **Limpieza Visual**: Espacios en blanco generosos y tipografía legible
- **Mobile First**: Priorizar usabilidad en móvil para uso en supermercado
- **Colores**:
  - Primary: `#3B82F6`
  - Accent: `#10B981`
  - Background: `#F8FAFC`
  - Surface: `#FFFFFF`
- **Tipografía**: Inter font family
- **Transiciones**: 150-200ms para estados hover

### Vistas Principales
1. **Dashboard**: Vista principal con resumen del día y acceso rápido
2. **Masterlist**: Gestión de platos e ingredientes
3. **Planificador**: Grid semanal interactivo con selector de templates
4. **Lista de Compra**: Checklist agrupado por categorías
5. **Plantillas**: Gestión de meals y semanas guardadas

## 6. Roadmap de Desarrollo

### Fase 1: Cimientos (Backend & DB)
- [x] Configurar Node.js + Prisma + SQLite
- [x] Crear scripts de "Seed" con ingredientes básicos
- [x] Desarrollar API básica (CRUD de platos e ingredientes)
- [x] Configurar conexión backend-frontend

### Fase 2: Masterlist & Planificador (Frontend)
- [x] Setup de React con Tailwind
- [x] Formulario dinámico de creación de platos
- [x] Validación de unidades en frontend (warning para unidades incompatibles)
- [x] Interfaz del Planificador Semanal
- [x] Selector múltiple de platos para crear combos
- [x] Integración con API via TanStack Query

### Fase 3: Lógica de Compra
- [x] Algoritmo de suma de cantidades en backend
- [x] Vista de Checklist de la compra
- [x] Items manuales
- [x] Persistencia de estado de compra (localStorage)
- [ ] Conversión avanzada de unidades (sugerir unidad correcta)

### Fase 4: Plantillas y Reutilización
- [x] Modelo MealTemplate (guardar combinaciones de platos)
- [x] Modelo WeekTemplate (guardar semanas completas)
- [x] Página de Plantillas (/templates)
- [x] Guardar comida desde el Planificador
- [x] Aplicar template desde el Planificador

### Fase 5: Escalabilidad (Futuro)
- [ ] Exportar lista de compra (PDF, compartir)
- [ ] Modelo CleaningTask en Prisma (limpieza)
- [ ] Vista de planificación de limpieza periódica

### Fase 6: Multiusuario Compartido (En desarrollo)
- [x] Supabase como backend (Auth + Database)
- [x] Sistema de autenticación (login/register)
- [x] Perfiles de usuario vinculados a households
- [ ] Selector de comensales en planificación
- [ ] Mostrar iconos de quién come cada plato
- [ ] Lista de compra filtrable por usuario
- [ ] Invitar a otros usuarios al household
- [ ] Sincronización realtime

## 7. Instrucciones para el Desarrollo

### Tipado Estricto
- Todas las interfaces de datos en React deben coincidir con los tipos generados por Prisma
- Usar `npx prisma generate` después de cambios en el schema

### Modularidad
- Componentes de lista de ingredientes reutilizables
- Hooks personalizados para lógica de negocio

### Local First
- Base de datos SQLite en `./prisma/dev.db`
- Ficheros de seed en `./prisma/seed.ts`

## 8. Notas de Escalabilidad

- **Conversión de Unidades**: El campo `unit` es crítico. Implementar lógica de conversión (ej: 1000g -> 1kg) en el motor de la lista de compra
- **Frecuencia de Limpieza**: Integrar usando una lógica similar a las comidas pero con disparadores temporales configurables
- **Exportación**: Posibilidad de exportar lista de compra a PDF o compartir

## 9. Comandos de Desarrollo

```bash
# Instalación
npm install

# Desarrollo Backend
npm run dev:server    # Inicia servidor con tsx
npm run db:generate    # Genera cliente Prisma
npm run db:push        # Sincroniza schema con DB
npm run db:seed        # Ejecuta seed

# Desarrollo Frontend
npm run dev           # Inicia Vite dev server

# Build
npm run build         # Build producción
```
