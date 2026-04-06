import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Check, X, Bookmark, Save } from 'lucide-react';
import { Button, Modal, Stack, Row, Container, Badge, Input } from '../components';
import { SlotButton, WeekNavigator, DayCard } from '../components';
import { weeklyPlansApi, dishesApi, mealTemplatesApi } from '../services/api';
import { getWeekStart, formatDate, addWeeks, formatWeekRange } from '../lib/utils';
import { DAYS } from '../types';

export function Planner() {
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(getWeekStart());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; slot: string } | null>(null);
  const [search, setSearch] = useState('');
  const [selectedDishIds, setSelectedDishIds] = useState<string[]>([]);
  const [saveName, setSaveName] = useState('');
  const [activeTab, setActiveTab] = useState<'dishes' | 'templates'>('dishes');

  const weekStartStr = formatDate(currentDate);
  const today = new Date();
  const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const currentDayName = DAYS[currentDayIndex];

  const { data: plans = [] } = useQuery({
    queryKey: ['weeklyPlans', weekStartStr],
    queryFn: () => weeklyPlansApi.getAll(weekStartStr),
  });

  const { data: dishes = [] } = useQuery({
    queryKey: ['dishes'],
    queryFn: dishesApi.getAll,
  });

  const { data: mealTemplates = [] } = useQuery({
    queryKey: ['mealTemplates'],
    queryFn: mealTemplatesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: weeklyPlansApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyPlans', weekStartStr] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: weeklyPlansApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weeklyPlans', weekStartStr] });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: mealTemplatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealTemplates'] });
      setIsSaveModalOpen(false);
      setSaveName('');
    },
  });

  const getPlanForSlot = (day: string, slot: string) => {
    return plans.find((p) => p.day === day && p.slot === slot);
  };

  const openSlotModal = (day: string, slot: string) => {
    const existingPlan = getPlanForSlot(day, slot);
    setSelectedSlot({ day, slot });
    setSelectedDishIds(existingPlan?.dishes.map(d => d.dishId) || []);
    setSearch('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlot(null);
    setSelectedDishIds([]);
    setSearch('');
  };

  const toggleDish = (dishId: string) => {
    if (selectedDishIds.includes(dishId)) {
      setSelectedDishIds(selectedDishIds.filter(id => id !== dishId));
    } else {
      setSelectedDishIds([...selectedDishIds, dishId]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedSlot && selectedDishIds.length > 0) {
      createMutation.mutate({
        day: selectedSlot.day,
        slot: selectedSlot.slot,
        dishIds: selectedDishIds,
        weekStart: weekStartStr,
      });
    }
  };

  const handleApplyTemplate = (template: { dishIds: string[]; slot: string }) => {
    setSelectedDishIds(template.dishIds);
  };

  const handleSaveAsTemplate = () => {
    if (saveName && selectedDishIds.length > 0 && selectedSlot) {
      createTemplateMutation.mutate({
        name: saveName,
        slot: selectedSlot.slot,
        dishIds: selectedDishIds,
      });
    }
  };

  const handleSaveCurrentAsTemplate = () => {
    if (selectedSlot && selectedDishIds.length > 0) {
      setSaveName('');
      setIsSaveModalOpen(true);
    }
  };

  const closeSaveModal = () => {
    setIsSaveModalOpen(false);
    setSaveName('');
  };

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDishes = dishes.filter(d => selectedDishIds.includes(d.id));

  const prevWeek = () => setCurrentDate(addWeeks(currentDate, -1));
  const nextWeek = () => setCurrentDate(addWeeks(currentDate, 1));
  const goToCurrentWeek = () => setCurrentDate(getWeekStart());

  return (
    <Container size="lg">
      <Stack gap="xl" className="pb-24 md:pb-0">
        <Row justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Planificador</h1>
            <p className="text-text-secondary mt-1">{formatWeekRange(currentDate)}</p>
          </div>
          <WeekNavigator
            currentDate={currentDate}
            onPrevWeek={prevWeek}
            onNextWeek={nextWeek}
            onGoToCurrent={goToCurrentWeek}
            weekRange={formatWeekRange(currentDate)}
          />
        </Row>

        <section aria-label="Planificación semanal">
          <div className="grid grid-cols-1 gap-4 md:hidden" role="list">
            {DAYS.map((day, index) => {
              const comidaPlan = getPlanForSlot(day, 'Comida');
              const cenaPlan = getPlanForSlot(day, 'Cena');
              const isToday = day === currentDayName;

              return (
                <DayCard
                  key={day}
                  dayName={day}
                  dayIndex={index}
                  isToday={isToday}
                >
                  <div role="listitem">
                    <SlotButton
                      slotType="Comida"
                      dishName={comidaPlan?.dishes[0]?.dish.name}
                      dishCount={comidaPlan?.dishes.length || 0}
                      onClick={() => openSlotModal(day, 'Comida')}
                      onRemove={() => comidaPlan && deleteMutation.mutate(comidaPlan.id)}
                    />
                  </div>
                  <div role="listitem">
                    <SlotButton
                      slotType="Cena"
                      dishName={cenaPlan?.dishes[0]?.dish.name}
                      dishCount={cenaPlan?.dishes.length || 0}
                      onClick={() => openSlotModal(day, 'Cena')}
                      onRemove={() => cenaPlan && deleteMutation.mutate(cenaPlan.id)}
                    />
                  </div>
                </DayCard>
              );
            })}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[600px]" role="grid" aria-label="Planificación semanal">
              <thead>
                <tr>
                  <th className="w-20 p-2 text-left text-sm font-medium text-text-secondary" scope="col">
                    <span className="sr-only">Hora</span>
                  </th>
                  {DAYS.map((day) => {
                    const isToday = day === currentDayName;
                    return (
                      <th
                        key={day}
                        className={`p-2 text-center text-sm font-medium ${
                          isToday ? 'text-primary' : 'text-text-primary'
                        }`}
                        scope="col"
                        aria-current={isToday ? 'date' : undefined}
                      >
                        <span className="flex items-center justify-center gap-1">
                          {day.slice(0, 3)}
                          {isToday && (
                            <span className="sr-only">(actual)</span>
                          )}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {['Comida', 'Cena'].map((slot) => (
                  <tr key={slot}>
                    <th className="p-2 text-left text-sm font-medium text-text-secondary" scope="row">
                      {slot}
                    </th>
                    {DAYS.map((day) => {
                      const plan = getPlanForSlot(day, slot);
                      return (
                        <td key={`${day}-${slot}`} className="p-2">
                          {plan ? (
                            <div className="bg-primary/5 rounded-lg p-2 min-h-[80px] flex flex-col gap-1">
                              {plan.dishes.map((wpd) => (
                                <p key={wpd.id} className="text-xs text-primary font-medium">
                                  {wpd.dish.name}
                                </p>
                              ))}
                              {plan.dishes.length > 1 && (
                                <Badge variant="primary" className="self-start text-[10px]">
                                  +{plan.dishes.length - 1}
                                </Badge>
                              )}
                              <button
                                onClick={() => deleteMutation.mutate(plan.id)}
                                className="mt-auto self-end p-1 text-slate-400 hover:text-danger rounded transition-colors"
                                aria-label={`Eliminar ${plan.dishes[0]?.dish.name}`}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => openSlotModal(day, slot)}
                              className="w-full h-full min-h-[80px] border-2 border-dashed border-slate-200 hover:border-primary rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                              aria-label={`Añadir ${slot} para ${day}`}
                            >
                              <Plus size={20} />
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`Selecciona plato(s) - ${selectedSlot?.day} ${selectedSlot?.slot}`}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={closeModal}>
                Cancelar
              </Button>
              {selectedDishIds.length > 0 && (
                <Button variant="secondary" onClick={handleSaveCurrentAsTemplate} disabled={!selectedSlot}>
                  <Bookmark size={20} />
                  Guardar
                </Button>
              )}
              <Button
                onClick={handleConfirmSelection}
                disabled={selectedDishIds.length === 0 || createMutation.isPending}
              >
                <Check size={20} />
                Confirmar {selectedDishIds.length > 1 ? `(${selectedDishIds.length} platos)` : ''}
              </Button>
            </>
          }
        >
          <Stack gap="md">
            {selectedDishIds.length > 0 && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium text-primary mb-2">
                  Platos seleccionados ({selectedDishIds.length}):
                </p>
                <Row gap="xs" className="flex-wrap">
                  {selectedDishes.map((dish) => (
                    <Badge key={dish.id} variant="primary" className="pr-1">
                      {dish.name}
                      <button
                        onClick={() => toggleDish(dish.id)}
                        className="ml-1 p-0.5 hover:bg-primary/20 rounded"
                        aria-label={`Quitar ${dish.name}`}
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </Row>
              </div>
            )}

            <div className="flex gap-2 border-b border-border">
              <button
                onClick={() => setActiveTab('dishes')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === 'dishes'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                Platos
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-1 ${
                  activeTab === 'templates'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Bookmark size={16} />
                Guardados
              </button>
            </div>

            {activeTab === 'dishes' ? (
              <>
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    placeholder="Buscar platos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Buscar platos"
                    autoFocus
                  />
                </div>

                <Stack gap="sm" className="max-h-64 overflow-y-auto" role="listbox" aria-label="Lista de platos disponibles">
                  {filteredDishes.length === 0 ? (
                    <p className="text-center py-4 text-text-secondary" role="status">
                      {search ? 'No se encontraron platos' : 'No hay platos disponibles'}
                    </p>
                  ) : (
                    filteredDishes.map((dish) => {
                      const isSelected = selectedDishIds.includes(dish.id);
                      return (
                        <button
                          key={dish.id}
                          onClick={() => toggleDish(dish.id)}
                          className={`w-full p-4 text-left rounded-lg transition-colors flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            isSelected 
                              ? 'bg-primary/10 border-2 border-primary' 
                              : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                          }`}
                          role="option"
                          aria-selected={isSelected}
                        >
                          <div 
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary border-primary' : 'border-slate-300'
                            }`}
                            aria-hidden="true"
                          >
                            {isSelected && <Check size={14} className="text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-text-primary">{dish.name}</p>
                            <p className="text-sm text-text-secondary mt-0.5">
                              {dish.ingredients.length} ingredientes
                            </p>
                          </div>
                          <Plus size={20} className="text-text-secondary" aria-hidden="true" />
                        </button>
                      );
                    })
                  )}
                </Stack>
              </>
            ) : (
              <Stack gap="sm" className="max-h-64 overflow-y-auto">
                {mealTemplates.length === 0 ? (
                  <p className="text-center py-4 text-text-secondary">
                    No hay comidas guardadas. Selecciona platos y guarda la combinación.
                  </p>
                ) : (
                  mealTemplates.map((template) => {
                    const templateDishes = dishes.filter(d => template.dishIds.includes(d.id));
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleApplyTemplate(template)}
                        className="w-full p-4 text-left rounded-lg bg-slate-50 hover:bg-slate-100 border-2 border-transparent hover:border-primary/50 transition-colors"
                      >
                        <Row justify="between" align="center">
                          <div>
                            <p className="font-medium text-text-primary">{template.name}</p>
                            <p className="text-sm text-text-secondary mt-0.5">
                              {templateDishes.map(d => d.name).join(' + ')}
                            </p>
                          </div>
                          <Badge variant="outline">{template.slot}</Badge>
                        </Row>
                      </button>
                    );
                  })
                )}
              </Stack>
            )}
          </Stack>
        </Modal>

        <Modal
          isOpen={isSaveModalOpen}
          onClose={closeSaveModal}
          title="Guardar como plantilla"
          footer={
            <>
              <Button variant="secondary" onClick={closeSaveModal}>
                Cancelar
              </Button>
              <Button
                onClick={handleSaveAsTemplate}
                disabled={!saveName || createTemplateMutation.isPending}
              >
                <Save size={20} />
                Guardar
              </Button>
            </>
          }
        >
          <Stack gap="md">
            <p className="text-text-secondary text-sm">
              Guarda "{selectedDishes.map(d => d.name).join(' + ')}" como plantilla para reutilizarla después.
            </p>
            <Input
              label="Nombre de la plantilla"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Ej: Burguer Night"
              autoFocus
            />
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}