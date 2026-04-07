import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Search, Utensils } from 'lucide-react';
import { Button, Card, Modal, Input, Stack, Row, Container, ComboBox } from '../components';
import { ingredientsApi, dishesApi } from '../services/api';
import type { Dish, CreateDishData, Ingredient } from '../types';

export function Dishes() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [formData, setFormData] = useState<CreateDishData>({
    name: '',
    description: '',
    ingredients: [],
  });
  const [newIngredient, setNewIngredient] = useState({ ingredientId: '', quantity: '' });
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [isIngredientModalOpen, setIsIngredientModalOpen] = useState(false);
  const [editingIngredientData, setEditingIngredientData] = useState<Ingredient | null>(null);

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes'],
    queryFn: dishesApi.getAll,
  });

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: ingredientsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDishData) => dishesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateDishData }) =>
      dishesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => dishesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dishes'] });
    },
  });

  const createIngredientMutation = useMutation({
    mutationFn: (data: Partial<Ingredient>) => ingredientsApi.create(data as Omit<Ingredient, 'id' | 'created_at' | 'updated_at'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      setIsIngredientModalOpen(false);
    },
  });

  const updateIngredientMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ingredient> }) =>
      ingredientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      setIsIngredientModalOpen(false);
      setEditingIngredientData(null);
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDish(null);
    setFormData({ name: '', description: '', ingredients: [] });
    setNewIngredient({ ingredientId: '', quantity: '' });
    setEditingIngredient(null);
    setEditQuantity('');
  };

  const openEditModal = (dish: Dish) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      description: dish.description || '',
      ingredients: dish.ingredients.map((ri) => ({
        ingredientId: ri.ingredient_id,
        quantity: ri.quantity,
      })),
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingDish(null);
    setFormData({ name: '', description: '', ingredients: [] });
    setIsModalOpen(true);
  };

  const [ingredientFormData, setIngredientFormData] = useState({
    name: '',
    unit: '',
    category: '',
    calories: '',
    protein: '',
    carbs: '',
    sugars: '',
    fat: '',
    saturatedFat: '',
    salt: '',
  });

  const openIngredientModal = (ingredient?: Ingredient) => {
    if (ingredient) {
      setEditingIngredientData(ingredient);
      setIngredientFormData({
        name: ingredient.name,
        unit: ingredient.unit,
        category: ingredient.category || '',
        calories: ingredient.calories?.toString() || '',
        protein: ingredient.protein?.toString() || '',
        carbs: ingredient.carbs?.toString() || '',
        sugars: ingredient.sugars?.toString() || '',
        fat: ingredient.fat?.toString() || '',
        saturatedFat: ingredient.saturated_fat?.toString() || '',
        salt: ingredient.salt?.toString() || '',
      });
    } else {
      setEditingIngredientData(null);
      setIngredientFormData({
        name: '',
        unit: '',
        category: '',
        calories: '',
        protein: '',
        carbs: '',
        sugars: '',
        fat: '',
        saturatedFat: '',
        salt: '',
      });
    }
    setIsIngredientModalOpen(true);
  };

  const handleIngredientSubmit = () => {
    const data = {
      name: ingredientFormData.name,
      unit: ingredientFormData.unit,
      category: ingredientFormData.category || null,
      calories: ingredientFormData.calories ? parseFloat(ingredientFormData.calories) : null,
      protein: ingredientFormData.protein ? parseFloat(ingredientFormData.protein) : null,
      carbs: ingredientFormData.carbs ? parseFloat(ingredientFormData.carbs) : null,
      sugars: ingredientFormData.sugars ? parseFloat(ingredientFormData.sugars) : null,
      fat: ingredientFormData.fat ? parseFloat(ingredientFormData.fat) : null,
      saturated_fat: ingredientFormData.saturatedFat ? parseFloat(ingredientFormData.saturatedFat) : null,
      salt: ingredientFormData.salt ? parseFloat(ingredientFormData.salt) : null,
    };

    if (editingIngredientData) {
      updateIngredientMutation.mutate({ id: editingIngredientData.id, data });
    } else {
      createIngredientMutation.mutate(data);
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.ingredientId && newIngredient.quantity) {
      const existing = formData.ingredients.find(
        (i) => i.ingredientId === newIngredient.ingredientId
      );
      if (existing) {
        existing.quantity += parseFloat(newIngredient.quantity);
        setFormData({ ...formData, ingredients: [...formData.ingredients] });
      } else {
        setFormData({
          ...formData,
          ingredients: [
            ...formData.ingredients,
            { ingredientId: newIngredient.ingredientId, quantity: parseFloat(newIngredient.quantity) },
          ],
        });
      }
      setNewIngredient({ ingredientId: '', quantity: '' });
    }
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((i) => i.ingredientId !== ingredientId),
    });
  };

  const handleStartEditIngredient = (ingredientId: string, quantity: number) => {
    setEditingIngredient(ingredientId);
    setEditQuantity(quantity.toString());
  };

  const handleSaveEditIngredient = (ingredientId: string) => {
    const quantity = parseFloat(editQuantity);
    if (!isNaN(quantity) && quantity > 0) {
      setFormData({
        ...formData,
        ingredients: formData.ingredients.map((i) =>
          i.ingredientId === ingredientId ? { ...i, quantity } : i
        ),
      });
    }
    setEditingIngredient(null);
    setEditQuantity('');
  };

  const handleCancelEditIngredient = () => {
    setEditingIngredient(null);
    setEditQuantity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDish) {
      updateMutation.mutate({ id: editingDish.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase())
  );

  const availableIngredients = ingredients.filter(
    (i) => !formData.ingredients.find((fi) => fi.ingredientId === i.id)
  );

  return (
    <Container size="lg">
      <Stack gap="xl" className="pb-24 md:pb-0">
        <Row justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Platos</h1>
            <p className="text-text-secondary mt-1">{dishes.length} platos</p>
          </div>
          <Button icon={<Plus size={20} />} onClick={openCreateModal}>
            Nuevo plato
          </Button>
        </Row>

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar platos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {isLoading ? (
          <Card padding="lg" className="text-center">
            <p className="text-text-secondary">Cargando...</p>
          </Card>
        ) : filteredDishes.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-text-secondary">
              {search ? 'No se encontraron platos' : 'Aún no tienes platos. ¡Crea tu primer plato!'}
            </p>
          </Card>
        ) : (
          <Row gap="md" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => (
              <Card key={dish.id} hoverable padding="md">
                <Stack gap="sm">
                  <Row justify="between" align="start">
                    <h3 className="font-medium text-text-primary">{dish.name}</h3>
                    <Row gap="xs">
                      <Button variant="ghost" size="sm" onClick={() => openEditModal(dish)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(dish.id)}>
                        <Trash2 size={16} className="text-danger" />
                      </Button>
                    </Row>
                  </Row>
                  
                  {dish.description && (
                    <p className="text-sm text-text-secondary">{dish.description}</p>
                  )}
                  
                  <p className="text-sm text-text-secondary">
                    <span className="font-medium">{dish.ingredients.length}</span> ingredientes
                  </p>
                </Stack>
              </Card>
            ))}
          </Row>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingDish ? 'Editar plato' : 'Nuevo plato'}
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.name.trim() ||
                  formData.ingredients.length === 0 ||
                  createMutation.isPending ||
                  updateMutation.isPending
                }
              >
                {editingDish ? 'Guardar' : 'Crear'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="lg">
              <Input
                label="Nombre del plato"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Pollo a la plancha"
                required
              />
              <Input
                label="Descripción (opcional)"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Breve descripción del plato"
              />

              <Stack gap="md">
                <label className="text-sm font-medium text-text-primary">Ingredientes</label>
                
                <Stack gap="sm">
                  {formData.ingredients.map((fi) => {
                    const ing = ingredients.find((i) => i.id === fi.ingredientId);
                    const isEditing = editingIngredient === fi.ingredientId;
                    return (
                      <Row
                        key={fi.ingredientId}
                        justify="between"
                        align="center"
                        className="p-3 bg-slate-50 rounded-lg"
                      >
                        {isEditing ? (
                          <>
                            <span className="text-sm text-text-primary font-medium">
                              {ing?.name}
                            </span>
                            <Row gap="sm" align="center">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                                className="w-20"
                              />
                              <span className="text-sm text-text-secondary">{ing?.unit}</span>
                              <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={() => handleSaveEditIngredient(fi.ingredientId)}
                              >
                                Guardar
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEditIngredient}
                              >
                                Cancelar
                              </Button>
                            </Row>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-text-primary">
                              {ing?.name} - {fi.quantity} {ing?.unit}
                            </span>
                            <Row gap="xs">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleStartEditIngredient(fi.ingredientId, fi.quantity)}
                              >
                                <Edit2 size={16} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveIngredient(fi.ingredientId)}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </Row>
                          </>
                        )}
                      </Row>
                    );
                  })}
                  
                  {formData.ingredients.length === 0 && (
                    <p className="text-sm text-text-secondary py-2">Añade al menos un ingrediente</p>
                  )}
                </Stack>

                <div className="space-y-3">
                  <ComboBox
                    value={newIngredient.ingredientId}
                    onChange={(value) =>
                      setNewIngredient({ ...newIngredient, ingredientId: value })
                    }
                    options={availableIngredients.map((i) => ({
                      value: i.id,
                      label: i.name,
                      description: i.unit,
                    }))}
                    placeholder="Selecciona ingrediente"
                    searchable={true}
                    emptyMessage="No hay ingredientes disponibles"
                  />
                  
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Cantidad"
                        value={newIngredient.quantity}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, quantity: e.target.value })
                        }
                      />
                    </div>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={handleAddIngredient}
                      className="px-5"
                      disabled={!newIngredient.ingredientId || !newIngredient.quantity}
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => openIngredientModal()}
                  className="mt-2"
                >
                  <Utensils size={16} className="mr-1" />
                  Crear nuevo ingrediente
                </Button>
              </Stack>
            </Stack>
          </form>
        </Modal>

        <Modal
          isOpen={isIngredientModalOpen}
          onClose={() => setIsIngredientModalOpen(false)}
          title={editingIngredientData ? 'Editar ingrediente' : 'Nuevo ingrediente'}
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsIngredientModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleIngredientSubmit}
                disabled={!ingredientFormData.name.trim() || !ingredientFormData.unit.trim()}
              >
                {editingIngredientData ? 'Guardar' : 'Crear'}
              </Button>
            </>
          }
        >
          <Stack gap="md">
            <Input
              label="Nombre"
              value={ingredientFormData.name}
              onChange={(e) => setIngredientFormData({ ...ingredientFormData, name: e.target.value })}
              placeholder="Ej: Pollo"
              required
            />
            <Row gap="md">
              <div className="flex-1">
                <Input
                  label="Unidad"
                  value={ingredientFormData.unit}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, unit: e.target.value })}
                  placeholder="g, ml, ud..."
                  required
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Categoría"
                  value={ingredientFormData.category}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, category: e.target.value })}
                  placeholder="Ej: Carne"
                />
              </div>
            </Row>

            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-medium text-text-primary mb-3">Valores nutricionales (por 100g/ml)</p>
              <Row gap="md">
                <Input
                  label="Calorías (kcal)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.calories}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, calories: e.target.value })}
                />
                <Input
                  label="Proteína (g)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.protein}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, protein: e.target.value })}
                />
              </Row>
              <Row gap="md" className="mt-3">
                <Input
                  label="Carbohidratos (g)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.carbs}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, carbs: e.target.value })}
                />
                <Input
                  label="Azúcares (g)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.sugars}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, sugars: e.target.value })}
                />
              </Row>
              <Row gap="md" className="mt-3">
                <Input
                  label="Grasa (g)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.fat}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, fat: e.target.value })}
                />
                <Input
                  label="Grasa saturada (g)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.saturatedFat}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, saturatedFat: e.target.value })}
                />
              </Row>
              <div className="mt-3">
                <Input
                  label="Sal (g)"
                  type="number"
                  step="0.1"
                  min="0"
                  value={ingredientFormData.salt}
                  onChange={(e) => setIngredientFormData({ ...ingredientFormData, salt: e.target.value })}
                />
              </div>
            </div>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
