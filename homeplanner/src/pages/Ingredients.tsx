import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, Search, Package } from 'lucide-react';
import { Button, Card, Modal, Input, Select, Stack, Row, Badge, Container } from '../components';
import { ingredientsApi } from '../services/api';
import type { Ingredient } from '../types';

export function Ingredients() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [formData, setFormData] = useState({
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

  const { data: ingredients = [], isLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: ingredientsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Ingredient>) => ingredientsApi.create(data as Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ingredient> }) =>
      ingredientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ingredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] });
    },
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIngredient(null);
    setFormData({
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
  };

  const openCreateModal = () => {
    setEditingIngredient(null);
    setFormData({
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
    setIsModalOpen(true);
  };

  const openEditModal = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      unit: ingredient.unit,
      category: ingredient.category || '',
      calories: ingredient.calories?.toString() || '',
      protein: ingredient.protein?.toString() || '',
      carbs: ingredient.carbs?.toString() || '',
      sugars: ingredient.sugars?.toString() || '',
      fat: ingredient.fat?.toString() || '',
      saturatedFat: ingredient.saturatedFat?.toString() || '',
      salt: ingredient.salt?.toString() || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      unit: formData.unit,
      category: formData.category || null,
      calories: formData.calories ? parseFloat(formData.calories) : null,
      protein: formData.protein ? parseFloat(formData.protein) : null,
      carbs: formData.carbs ? parseFloat(formData.carbs) : null,
      sugars: formData.sugars ? parseFloat(formData.sugars) : null,
      fat: formData.fat ? parseFloat(formData.fat) : null,
      saturatedFat: formData.saturatedFat ? parseFloat(formData.saturatedFat) : null,
      salt: formData.salt ? parseFloat(formData.salt) : null,
    };

    if (editingIngredient) {
      updateMutation.mutate({ id: editingIngredient.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredIngredients = ingredients.filter((ing) =>
    ing.name.toLowerCase().includes(search.toLowerCase())
  );

  const groupedIngredients = filteredIngredients.reduce((acc, ing) => {
    const cat = ing.category || 'Sin categoría';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ing);
    return acc;
  }, {} as Record<string, Ingredient[]>);

  const categories = Object.keys(groupedIngredients).sort();

  return (
    <Container size="lg">
      <Stack gap="xl" className="pb-24 md:pb-0">
        <Row justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Ingredientes</h1>
            <p className="text-text-secondary mt-1">{ingredients.length} ingredientes</p>
          </div>
          <Button icon={<Plus size={20} />} onClick={openCreateModal}>
            Nuevo ingrediente
          </Button>
        </Row>

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar ingredientes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {isLoading ? (
          <Card padding="lg" className="text-center">
            <p className="text-text-secondary">Cargando...</p>
          </Card>
        ) : filteredIngredients.length === 0 ? (
          <Card padding="lg" className="text-center">
            <p className="text-text-secondary">
              {search ? 'No se encontraron ingredientes' : 'Aún no tienes ingredientes'}
            </p>
          </Card>
        ) : (
          <Stack gap="xl">
            {categories.map((category) => (
              <div key={category}>
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                  {category}
                </h2>
                <Row gap="md" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedIngredients[category].map((ing) => (
                    <Card key={ing.id} hoverable padding="md">
                      <Stack gap="sm">
                        <Row justify="between" align="start">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-text-tertiary" />
                            <h3 className="font-medium text-text-primary">{ing.name}</h3>
                          </div>
                          <Row gap="xs">
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(ing)}>
                              <Edit2 size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteMutation.mutate(ing.id)}>
                              <Trash2 size={16} className="text-danger" />
                            </Button>
                          </Row>
                        </Row>
                        
                        <p className="text-sm text-text-secondary">
                          Unidad: <span className="font-medium">{ing.unit}</span>
                        </p>

                        {ing.calories !== null && (
                          <div className="text-xs text-text-secondary border-t pt-2 mt-2">
                            <p className="font-medium mb-1">Valores por 100g/ml</p>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                              <span>Calorías: {ing.calories} kcal</span>
                              <span>Proteína: {ing.protein}g</span>
                              <span>Carbs: {ing.carbs}g</span>
                              <span>Azúcar: {ing.sugars}g</span>
                              <span>Grasa: {ing.fat}g</span>
                              <span>Sat: {ing.saturatedFat}g</span>
                              <span>Sal: {ing.salt}g</span>
                            </div>
                          </div>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Row>
              </div>
            ))}
          </Stack>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingIngredient ? 'Editar ingrediente' : 'Nuevo ingrediente'}
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name.trim() || !formData.unit.trim()}
              >
                {editingIngredient ? 'Guardar' : 'Crear'}
              </Button>
            </>
          }
        >
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <Input
                label="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Pollo"
                required
              />
              <Row gap="md">
                <div className="flex-1">
                  <Input
                    label="Unidad"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="g, ml, ud..."
                    required
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Categoría"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  />
                  <Input
                    label="Proteína (g)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.protein}
                    onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  />
                </Row>
                <Row gap="md" className="mt-3">
                  <Input
                    label="Carbohidratos (g)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.carbs}
                    onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  />
                  <Input
                    label="Azúcares (g)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.sugars}
                    onChange={(e) => setFormData({ ...formData, sugars: e.target.value })}
                  />
                </Row>
                <Row gap="md" className="mt-3">
                  <Input
                    label="Grasa (g)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.fat}
                    onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  />
                  <Input
                    label="Grasa saturada (g)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.saturatedFat}
                    onChange={(e) => setFormData({ ...formData, saturatedFat: e.target.value })}
                  />
                </Row>
                <div className="mt-3">
                  <Input
                    label="Sal (g)"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.salt}
                    onChange={(e) => setFormData({ ...formData, salt: e.target.value })}
                  />
                </div>
              </div>
            </Stack>
          </form>
        </Modal>
      </Stack>
    </Container>
  );
}
