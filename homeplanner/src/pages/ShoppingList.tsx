import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Check, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { Button, Card, Modal, Input, Stack, Row, Container } from '../components';
import { shoppingListApi, manualItemsApi } from '../services/api';
import { getWeekStart, formatDate, formatWeekRange } from '../lib/utils';
import type { CreateManualItemData } from '../types';

const getCheckedItemsKey = (weekStart: string) => `checked_items_${weekStart}`;

function loadCheckedItems(weekStart: string): Set<string> {
  const stored = localStorage.getItem(getCheckedItemsKey(weekStart));
  if (stored) {
    return new Set(JSON.parse(stored));
  }
  return new Set();
}

export function ShoppingList() {
  const queryClient = useQueryClient();
  const [weekStart] = useState(getWeekStart());
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => loadCheckedItems(formatDate(weekStart)));
  const [manualItemData, setManualItemData] = useState<CreateManualItemData>({
    name: '',
    quantity: undefined,
    unit: '',
    weekStart: formatDate(weekStart),
  });

  const weekStartStr = formatDate(weekStart);

  const toggleChecked = useCallback((itemKey: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemKey)) {
        newSet.delete(itemKey);
      } else {
        newSet.add(itemKey);
      }
      localStorage.setItem(getCheckedItemsKey(weekStartStr), JSON.stringify([...newSet]));
      return newSet;
    });
  }, [weekStartStr]);

  const { data: shoppingList, isLoading } = useQuery({
    queryKey: ['shoppingList', weekStartStr],
    queryFn: () => shoppingListApi.get(weekStartStr),
  });

  const createManualItemMutation = useMutation({
    mutationFn: manualItemsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', weekStartStr] });
      setIsManualModalOpen(false);
      setManualItemData({
        name: '',
        quantity: undefined,
        unit: '',
        weekStart: weekStartStr,
      });
    },
  });

  const deleteManualItemMutation = useMutation({
    mutationFn: manualItemsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingList', weekStartStr] });
    },
  });

  const handleSubmitManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualItemData.name) {
      createManualItemMutation.mutate(manualItemData);
    }
  };

  const allCategories = shoppingList
    ? Object.keys(shoppingList.grouped).sort()
    : [];

  const totalItems = shoppingList
    ? Object.values(shoppingList.grouped).reduce((acc, items) => acc + items.length, 0) +
      (shoppingList.manualItems?.length || 0)
    : 0;

  return (
    <Container size="lg">
      <Stack gap="xl" className="pb-24 md:pb-0">
        <Row justify="between" align="start" className="flex-col sm:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Lista de la Compra</h1>
            <p className="text-text-secondary mt-1">
              {formatWeekRange(weekStart)} · {totalItems} artículos
            </p>
          </div>
          <Button icon={<Plus size={20} />} onClick={() => setIsManualModalOpen(true)}>
            Añadir artículo
          </Button>
        </Row>

        {isLoading ? (
          <Card padding="lg" className="text-center">
          <p className="text-text-secondary">Cargando...</p>
        </Card>
      ) : !shoppingList || (allCategories.length === 0 && !shoppingList.manualItems?.length) ? (
        <Card padding="lg" className="text-center">
          <ShoppingCartIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-text-secondary">
            No hay artículos en tu lista de compra.
            <br />
            Planifica tus comidas para generar automáticamente la lista.
          </p>
        </Card>
      ) : (
        <Stack gap="lg">
          {allCategories.map((category) => (
            <Card key={category} padding="md">
              <Stack gap="md">
                <h2 className="text-lg font-medium text-text-primary">{category}</h2>
                <Stack gap="sm">
                  {shoppingList.grouped[category].map((item) => {
                    const itemKey = `auto_${item.id}`;
                    const isChecked = checkedItems.has(itemKey);
                    return (
                      <Row
                        key={item.id}
                        justify="between"
                        align="center"
                        className={`list-item py-3 ${isChecked ? 'opacity-50' : ''}`}
                      >
                        <Row gap="md" align="center">
                          <button
                            onClick={() => toggleChecked(itemKey)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-accent border-accent text-white'
                                : 'border-slate-300 hover:border-accent'
                            }`}
                          >
                            {isChecked && <Check size={14} />}
                          </button>
                          <span className={isChecked ? 'line-through text-text-secondary' : 'text-text-primary'}>
                            {item.name}
                          </span>
                        </Row>
                        <span className="text-sm text-text-secondary">
                          {item.quantity} {item.unit}
                        </span>
                      </Row>
                    );
                  })}
                </Stack>
              </Stack>
            </Card>
          ))}

          {shoppingList.manualItems && shoppingList.manualItems.length > 0 && (
            <Card padding="md">
              <Stack gap="md">
                <h2 className="text-lg font-medium text-text-primary">Otros artículos</h2>
                <Stack gap="sm">
                  {shoppingList.manualItems.map((item) => {
                    const itemKey = `manual_${item.id}`;
                    const isChecked = checkedItems.has(itemKey);
                    return (
                      <Row
                        key={item.id}
                        justify="between"
                        align="center"
                        className={`py-3 ${isChecked ? 'opacity-50' : ''}`}
                      >
                        <Row gap="md" align="center">
                          <button
                            onClick={() => toggleChecked(itemKey)}
                            className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                              isChecked
                                ? 'bg-accent border-accent text-white'
                                : 'border-slate-300 hover:border-accent'
                            }`}
                          >
                            {isChecked && <Check size={14} />}
                          </button>
                          <span className={isChecked ? 'line-through text-text-secondary' : ''}>
                            {item.name}
                          </span>
                        </Row>
                        <Row gap="sm" align="center">
                          {item.quantity && (
                            <span className="text-sm text-text-secondary">
                              {item.quantity} {item.unit}
                            </span>
                          )}
                          <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteManualItemMutation.mutate(item.id)}
                        >
                          <Trash2 size={16} className="text-slate-400" />
                        </Button>
                      </Row>
                    </Row>
                    );
                  })}
                </Stack>
              </Stack>
            </Card>
          )}
        </Stack>
      )}

      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Añadir artículo manual"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsManualModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmitManualItem}
              disabled={!manualItemData.name || createManualItemMutation.isPending}
            >
              Añadir
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitManualItem}>
          <Stack gap="md">
            <Input
              label="Nombre del artículo"
              value={manualItemData.name}
              onChange={(e) => setManualItemData({ ...manualItemData, name: e.target.value })}
              placeholder="Ej: Detergente"
              required
            />
            <Row gap="md">
            <Input
              label="Cantidad (opcional)"
              type="number"
              step="0.01"
              min="0"
              value={manualItemData.quantity || ''}
              onChange={(e) =>
                setManualItemData({
                  ...manualItemData,
                  quantity: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="Ej: 2"
            />
            <Input
              label="Unidad (opcional)"
              value={manualItemData.unit || ''}
              onChange={(e) => setManualItemData({ ...manualItemData, unit: e.target.value })}
              placeholder="Ej: ud, kg"
            />
          </Row>
          </Stack>
        </form>
      </Modal>
      </Stack>
    </Container>
  );
}
