import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Save, Calendar, Utensils, X } from 'lucide-react';
import { Button, Card, Modal, Input, Stack, Row, Container, Badge } from '../components';
import { mealTemplatesApi, weekTemplatesApi, dishesApi } from '../services/api';
import { DAYS, SLOTS, type Dish } from '../types';

const daySlots = ['mondayLunch', 'mondayDinner', 'tuesdayLunch', 'tuesdayDinner', 'wednesdayLunch', 'wednesdayDinner', 'thursdayLunch', 'thursdayDinner', 'fridayLunch', 'fridayDinner', 'saturdayLunch', 'saturdayDinner', 'sundayLunch', 'sundayDinner'] as const;

export function Templates() {
  const queryClient = useQueryClient();
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [isWeekModalOpen, setIsWeekModalOpen] = useState(false);
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);
  const [mealName, setMealName] = useState('');
  const [mealSlot, setMealSlot] = useState('Comida');
  const [weekName, setWeekName] = useState('');
  const [weekMeals, setWeekMeals] = useState<Record<string, string[]>>({});

  const { data: mealTemplates = [] } = useQuery({
    queryKey: ['mealTemplates'],
    queryFn: mealTemplatesApi.getAll,
  });

  const { data: weekTemplates = [] } = useQuery({
    queryKey: ['weekTemplates'],
    queryFn: weekTemplatesApi.getAll,
  });

  const { data: dishes = [] } = useQuery({
    queryKey: ['dishes'],
    queryFn: dishesApi.getAll,
  });

  const createMealMutation = useMutation({
    mutationFn: mealTemplatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealTemplates'] });
      closeMealModal();
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: mealTemplatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealTemplates'] });
    },
  });

  const createWeekMutation = useMutation({
    mutationFn: weekTemplatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekTemplates'] });
      closeWeekModal();
    },
  });

  const deleteWeekMutation = useMutation({
    mutationFn: weekTemplatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weekTemplates'] });
    },
  });

  const closeMealModal = () => {
    setIsMealModalOpen(false);
    setMealName('');
    setMealSlot('Comida');
    setSelectedDishes([]);
  };

  const openMealModal = () => {
    setIsMealModalOpen(true);
  };

  const closeWeekModal = () => {
    setIsWeekModalOpen(false);
    setWeekName('');
    setWeekMeals({});
  };

  const openWeekModal = () => {
    setIsWeekModalOpen(true);
  };

  const toggleDish = (dishId: string) => {
    if (selectedDishes.includes(dishId)) {
      setSelectedDishes(selectedDishes.filter(id => id !== dishId));
    } else {
      setSelectedDishes([...selectedDishes, dishId]);
    }
  };

  const handleCreateMeal = () => {
    if (mealName && selectedDishes.length > 0) {
      createMealMutation.mutate({
        name: mealName,
        slot: mealSlot,
        dishIds: selectedDishes,
      });
    }
  };

  const handleCreateWeek = () => {
    if (weekName && Object.values(weekMeals).some(v => v && v.length > 0)) {
      createWeekMutation.mutate({
        name: weekName,
        meals: weekMeals,
      });
    }
  };

  const getDishesByIds = (ids: string[]): Dish[] => {
    return dishes.filter(d => ids.includes(d.id));
  };

  const renderMealDishes = (dishIds: string[]) => {
    const dishList = getDishesByIds(dishIds);
    return dishList.map(d => d.name).join(' + ') || 'Sin platos';
  };

  return (
    <Container size="lg">
      <Stack gap="xl" className="pb-24 md:pb-0">
        <Row justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Plantillas</h1>
            <p className="text-text-secondary mt-1">
              Guarda combinaciones de platos para reutilizarlas fácilmente
            </p>
          </div>
          <Row gap="sm">
            <Button icon={<Utensils size={20} />} variant="secondary" onClick={openMealModal}>
              Nueva comida
            </Button>
            <Button icon={<Calendar size={20} />} onClick={openWeekModal}>
              Nueva semana
            </Button>
          </Row>
        </Row>

        <Row gap="lg" className="grid grid-cols-1 lg:grid-cols-2">
          <Card padding="md">
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Utensils size={20} className="text-primary" />
                <h2 className="text-lg font-medium text-text-primary">Comidas guardadas</h2>
              </div>
              
              {mealTemplates.length === 0 ? (
                <p className="text-text-secondary text-sm py-4">
                  No hay comidas guardadas. Crea una para reutilizarla después.
                </p>
              ) : (
                <Stack gap="sm">
                  {mealTemplates.map((template) => (
                    <Card key={template.id} padding="sm" className="bg-slate-50">
                      <Row justify="between" align="start">
                        <div className="flex-1">
                          <Row gap="sm" align="center">
                            <p className="font-medium text-text-primary">{template.name}</p>
                            <Badge variant="outline">{template.slot}</Badge>
                          </Row>
                          <p className="text-sm text-text-secondary mt-1">
                            {renderMealDishes(template.dishIds)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMealMutation.mutate(template.id)}
                        >
                          <Trash2 size={16} className="text-danger" />
                        </Button>
                      </Row>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          </Card>

          <Card padding="md">
            <Stack gap="md">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-primary" />
                <h2 className="text-lg font-medium text-text-primary">Semanas guardadas</h2>
              </div>
              
              {weekTemplates.length === 0 ? (
                <p className="text-text-secondary text-sm py-4">
                  No hay semanas guardadas. Crea una para reutilizarla después.
                </p>
              ) : (
                <Stack gap="sm">
                  {weekTemplates.map((template) => {
                    const filledSlots = Object.entries(template)
                      .filter(([key]) => key.startsWith('monday') || key.startsWith('tuesday') || key.startsWith('wednesday') || key.startsWith('thursday') || key.startsWith('friday') || key.startsWith('saturday') || key.startsWith('sunday'))
                      .filter((entry) => {
                        const val = entry[1];
                        return val && Array.isArray(val) && val.length > 0;
                      }).length;
                    
                    return (
                      <Card key={template.id} padding="sm" className="bg-slate-50">
                        <Row justify="between" align="start">
                          <div className="flex-1">
                            <p className="font-medium text-text-primary">{template.name}</p>
                            <p className="text-sm text-text-secondary mt-1">
                              {filledSlots} comidas planificadas
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteWeekMutation.mutate(template.id)}
                          >
                            <Trash2 size={16} className="text-danger" />
                          </Button>
                        </Row>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Card>
        </Row>

        <Modal
          isOpen={isMealModalOpen}
          onClose={closeMealModal}
          title="Crear comida guardada"
          footer={
            <>
              <Button variant="secondary" onClick={closeMealModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateMeal}
                disabled={!mealName || selectedDishes.length === 0 || createMealMutation.isPending}
              >
                <Save size={20} />
                Guardar
              </Button>
            </>
          }
        >
          <Stack gap="md">
            <Input
              label="Nombre de la comida"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="Ej: Burguer Night"
              required
            />
            
            <div>
              <label className="text-sm font-medium text-text-primary block mb-2">Slot</label>
              <div className="flex gap-2">
                {SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setMealSlot(slot)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      mealSlot === slot
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-text-secondary hover:border-primary/50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text-primary block mb-2">
                Selecciona los platos ({selectedDishes.length})
              </label>
              <div className="flex flex-wrap gap-2">
                {dishes.map((dish) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => toggleDish(dish.id)}
                    className={`px-3 py-2 rounded-lg border transition-all text-sm ${
                      selectedDishes.includes(dish.id)
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-slate-50 text-text-primary hover:border-primary/50'
                    }`}
                  >
                    {selectedDishes.includes(dish.id) && <X size={14} className="inline mr-1" />}
                    {dish.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedDishes.length > 0 && (
              <div className="p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium text-primary mb-2">Vista previa:</p>
                <p className="text-text-primary">{renderMealDishes(selectedDishes)}</p>
              </div>
            )}
          </Stack>
        </Modal>

        <Modal
          isOpen={isWeekModalOpen}
          onClose={closeWeekModal}
          title="Crear semana guardada"
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={closeWeekModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateWeek}
                disabled={!weekName || createWeekMutation.isPending}
              >
                <Save size={20} />
                Guardar semana
              </Button>
            </>
          }
        >
          <Stack gap="md">
            <Input
              label="Nombre de la semana"
              value={weekName}
              onChange={(e) => setWeekName(e.target.value)}
              placeholder="Ej: Semana saludable"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DAYS.map((day, dayIndex) => (
                <Card key={day} padding="sm" className="bg-slate-50">
                  <Stack gap="sm">
                    <h3 className="font-medium text-text-primary">{day}</h3>
                    {SLOTS.map((slot, slotIndex) => {
                      const slotKey = daySlots[dayIndex * 2 + slotIndex];
                      const currentDishes = weekMeals[slotKey] || [];
                      return (
                        <div key={slot}>
                          <p className="text-xs text-text-secondary mb-1">{slot}</p>
                          <div className="flex flex-wrap gap-1">
                            {currentDishes.map((dishId) => {
                              const dish = dishes.find(d => d.id === dishId);
                              return dish ? (
                                <Badge key={dishId} variant="primary" className="pr-1">
                                  {dish.name}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setWeekMeals({
                                        ...weekMeals,
                                        [slotKey]: currentDishes.filter(id => id !== dishId),
                                      });
                                    }}
                                    className="ml-1 p-0.5 hover:bg-primary/20 rounded"
                                  >
                                    <X size={10} />
                                  </button>
                                </Badge>
                              ) : null;
                            })}
                            <select
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  setWeekMeals({
                                    ...weekMeals,
                                    [slotKey]: [...currentDishes, e.target.value],
                                  });
                                }
                              }}
                              className="text-xs border border-border rounded px-1 py-0.5 bg-white"
                            >
                              <option value="">+ Añadir</option>
                              {dishes.map((dish) => (
                                <option key={dish.id} value={dish.id} disabled={currentDishes.includes(dish.id)}>
                                  {dish.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </Stack>
                </Card>
              ))}
            </div>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
