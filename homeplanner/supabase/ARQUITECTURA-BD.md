# Arquitectura de Base de Datos - HomePlanner

## Visión General

HomePlanner utiliza **Supabase** (PostgreSQL) como base de datos, con un sistema de autenticación propio y Row Level Security (RLS) para multiusuario.

---

## Diagrama de Entidades

```
┌─────────────────┐     ┌─────────────────┐
│   households    │────<│    profiles    │
└─────────────────┘     └─────────────────┘
        │                        │
        │                        │
        ▼                        ▼
┌───────────────────────────────────────────────┐
│           DATOS COMPARTIDOS (household)      │
├───────────────────────────────────────────────┤
│  ingredients  │  dishes  │  recipe_ingredients│
│  weekly_plans │ weekly_plan_dishes │ manual_items│
│  meal_templates │ week_templates           │
└───────────────────────────────────────────────┘
```

---

## Tablas

### 1. Tablas de Autenticación y Multiusuario

#### `households`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK, identificador único del hogar |
| `name` | TEXT | Nombre del hogar (por defecto "Mi hogar") |
| `created_at` | TIMESTAMPTZ | Fecha de creación |

#### `profiles`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | FK → auth.users.id, PK |
| `email` | TEXT | Email único del usuario |
| `name` | TEXT | Nombre del usuario |
| `household_id` | UUID | FK → households.id |
| `avatar_url` | TEXT | URL del avatar |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

#### `household_invitations`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `household_id` | UUID | FK → households.id |
| `email` | TEXT | Email del invitado |
| `role` | TEXT | Rol del usuario ("member") |
| `invited_by` | UUID | FK → auth.users.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `expires_at` | TIMESTAMPTZ | Fecha de expiración (7 días) |

---

### 2. Tablas de Ingredientes y Recetas

#### `ingredients`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `name` | TEXT | Nombre del ingrediente (único) |
| `unit` | TEXT | Unidad de medida (g, ml, uds...) |
| `category` | TEXT | Categoría (verdura, carne...) |
| `calories` | REAL | Valor energético (kcal/100g) |
| `protein` | REAL | Proteínas (g/100g) |
| `carbs` | REAL | Carbohidratos (g/100g) |
| `sugars` | REAL | Azúcares (g/100g) |
| `fat` | REAL | Grasas (g/100g) |
| `saturated_fat` | REAL | Grasas saturadas (g/100g) |
| `salt` | REAL | Sal (g/100g) |
| `household_id` | UUID | FK → households.id (NULL = global) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

#### `dishes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `name` | TEXT | Nombre del plato |
| `description` | TEXT | Descripción del plato |
| `household_id` | UUID | FK → households.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

#### `recipe_ingredients`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `dish_id` | UUID | FK → dishes.id (CASCADE) |
| `ingredient_id` | UUID | FK → ingredients.id (CASCADE) |
| `quantity` | REAL | Cantidad del ingrediente |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

**Restricción:** UNIQUE(dish_id, ingredient_id)

---

### 3. Tablas de Planificación

#### `weekly_plans`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `day` | TEXT | Día de la semana (monday, tuesday...) |
| `slot` | TEXT | Tipo de comida (lunch, dinner) |
| `week_start` | TIMESTAMPTZ | Inicio de la semana |
| `household_id` | UUID | FK → households.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

**Restricción:** UNIQUE(day, slot, week_start, household_id)

#### `weekly_plan_dishes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `weekly_plan_id` | UUID | FK → weekly_plans.id (CASCADE) |
| `dish_id` | UUID | FK → dishes.id (CASCADE) |
| `assigned_to` | TEXT[] | Array de usuarios asignados (default ['both']) |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

**Restricción:** UNIQUE(weekly_plan_id, dish_id)

---

### 4. Tablas de Listas y Plantillas

#### `manual_items`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `name` | TEXT | Nombre del item |
| `quantity` | REAL | Cantidad |
| `unit` | TEXT | Unidad de medida |
| `checked` | BOOLEAN | Estado (comprado/no comprado) |
| `week_start` | TIMESTAMPTZ | Semana asociada |
| `household_id` | UUID | FK → households.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

#### `meal_templates`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `name` | TEXT | Nombre de la plantilla |
| `slot` | TEXT | Tipo de comida |
| `dish_ids` | TEXT | IDs de platos separados por coma |
| `household_id` | UUID | FK → households.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

#### `week_templates`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | PK |
| `name` | TEXT | Nombre de la plantilla |
| `monday_lunch` | TEXT | ID de plato |
| `monday_dinner` | TEXT | ID de plato |
| `tuesday_lunch` | TEXT | ID de plato |
| `tuesday_dinner` | TEXT | ID de plato |
| `wednesday_lunch` | TEXT | ID de plato |
| `wednesday_dinner` | TEXT | ID de plato |
| `thursday_lunch` | TEXT | ID de plato |
| `thursday_dinner` | TEXT | ID de plato |
| `friday_lunch` | TEXT | ID de plato |
| `friday_dinner` | TEXT | ID de plato |
| `saturday_lunch` | TEXT | ID de plato |
| `saturday_dinner` | TEXT | ID de plato |
| `sunday_lunch` | TEXT | ID de plato |
| `sunday_dinner` | TEXT | ID de plato |
| `household_id` | UUID | FK → households.id |
| `created_at` | TIMESTAMPTZ | Fecha de creación |
| `updated_at` | TIMESTAMPTZ | Fecha de actualización |

---

## Relaciones entre Tablas

```
households (1) ──────< (N) profiles
       │
       └────────────< (N) ingredients
       │
       └────────────< (N) dishes
       │
       └────────────< (N) weekly_plans
       │
       └────────────< (N) manual_items
       │
       └────────────< (N) meal_templates
       │
       └────────────< (N) week_templates

dishes (1) ──────< (N) recipe_ingredients >───── (1) ingredients
weekly_plans (1) ──────< (N) weekly_plan_dishes >───── (1) dishes
```

---

## Seguridad y RLS

### Funciones y Triggers

#### `handle_new_user()` (trigger: on_auth_user_created)
Se ejecuta automáticamente al crear un usuario en auth.users:
1. Crea un nuevo `household` con el nombre del usuario
2. Inserta un `profile` vinculado al usuario y household

### Políticas RLS

| Tabla | SELECT | INSERT | UPDATE |
|-------|--------|--------|--------|
| households | Miembro del household | anyone | Miembro del household |
| profiles | Miembros del mismo household | anyone | Propio usuario |
| ingredients | Miembro del household o NULL | anyone | anyone |
| dishes | Miembro del household o NULL | anyone | anyone |
| weekly_plans | Miembro del household o NULL | anyone | anyone |
| manual_items | Miembro del household o NULL | anyone | anyone |
| meal_templates | Miembro del household o NULL | anyone | anyone |
| week_templates | Miembro del household o NULL | anyone | anyone |
| recipe_ingredients |anyone | anyone | anyone |
| weekly_plan_dishes |anyone | anyone | anyone |

---

## Notas de Implementación

### Ingredientes Globales vs Locales
- Los ingredientes con `household_id = NULL` son globales (compartidos)
- Los ingredientes con `household_id` establecido son privados del hogar

### Asignación de Platos
- El campo `assigned_to` en `weekly_plan_dishes` permite asignar platos a usuarios específicos
- Valor por defecto: `['both']` (ambos miembros del hogar)

###week_start
- Todas las semanas se identifican por su fecha de inicio (lunes)
- Formato: TIMESTAMPTZ (timezone-aware)

---

## Índices Recomendados

```sql
CREATE INDEX idx_ingredients_household ON ingredients(household_id);
CREATE INDEX idx_dishes_household ON dishes(household_id);
CREATE INDEX idx_weekly_plans_week ON weekly_plans(week_start, household_id);
CREATE INDEX idx_recipe_ingredients_dish ON recipe_ingredients(dish_id);
CREATE INDEX idx_profiles_household ON profiles(household_id);
```

---

*Documento generado desde schema-multiuser.sql*