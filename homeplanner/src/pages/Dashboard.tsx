import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Calendar, ShoppingCart, UtensilsCrossed, ChevronRight } from 'lucide-react';
import { Card, Stack, Row, Badge, Container } from '../components';
import { weeklyPlansApi, dishesApi, shoppingListApi } from '../services/api';
import { getWeekStart, formatDate, formatWeekRange } from '../lib/utils';
import { DAYS } from '../types';

export function Dashboard() {
  const weekStart = getWeekStart();
  const weekStartStr = formatDate(weekStart);

  const { data: plans = [] } = useQuery({
    queryKey: ['weeklyPlans', weekStartStr],
    queryFn: () => weeklyPlansApi.getAll(weekStartStr),
  });

  const { data: dishes = [] } = useQuery({
    queryKey: ['dishes'],
    queryFn: dishesApi.getAll,
  });

  const { data: shoppingList } = useQuery({
    queryKey: ['shoppingList', weekStartStr],
    queryFn: () => shoppingListApi.get(weekStartStr),
    enabled: plans.length > 0,
  });

  const todayName = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todayPlans = plans.filter((p) => p.day === todayName);
  const totalPlanned = plans.length;
  const totalDishes = dishes.length;

  const shoppingItemsCount = shoppingList
    ? Object.values(shoppingList.grouped).reduce((acc, items) => acc + items.length, 0) +
      shoppingList.manualItems.length
    : 0;

  const quickActions = [
    {
      to: '/planner',
      icon: Calendar,
      title: 'Planificador',
      description: 'Planifica las comidas de la semana',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      to: '/dishes',
      icon: UtensilsCrossed,
      title: 'Platos',
      description: 'Gestiona tu recetario',
      color: 'bg-green-50 text-green-600',
    },
    {
      to: '/shopping',
      icon: ShoppingCart,
      title: 'Lista de compra',
      description: `${shoppingItemsCount} artículos pendientes`,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <Container size="lg">
      <Stack gap="xl" className="pb-24 md:pb-0">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Bienvenido</h1>
          <p className="text-text-secondary mt-1">{formatWeekRange(weekStart)}</p>
        </div>

        <Stack gap="md">
          <Row gap="md" className="grid grid-cols-1 md:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.to} to={action.to}>
                <Card hoverable padding="md">
                  <Row gap="md" align="start">
                    <div className={`p-3 rounded-lg shrink-0 ${action.color}`}>
                      <action.icon size={24} />
                    </div>
                    <Stack gap="xs" className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-primary">{action.title}</h3>
                      <p className="text-sm text-text-secondary">{action.description}</p>
                    </Stack>
                    <ChevronRight size={20} className="text-text-secondary shrink-0" />
                  </Row>
                </Card>
              </Link>
            ))}
          </Row>
        </Stack>

        <Row gap="lg" className="grid grid-cols-1 md:grid-cols-2">
          <Card padding="md">
            <Row justify="between" align="center" className="mb-4">
              <h2 className="text-lg font-medium text-text-primary">Comida de hoy</h2>
              <Badge variant="outline">{todayName}</Badge>
            </Row>
            
            {todayPlans.length > 0 ? (
              <Stack gap="sm">
                {todayPlans.map((plan) => (
                  <Row key={plan.id} justify="between" align="center" className="list-item">
                    <span className="text-sm font-medium text-text-primary">{plan.slot}</span>
                    <span className="text-text-secondary">
                      {plan.dishes.map(d => d.dish.name).join(' + ')}
                    </span>
                  </Row>
                ))}
              </Stack>
            ) : (
              <p className="text-text-secondary text-sm py-4">No hay platos planificados para hoy</p>
            )}
            
            <Link
              to="/planner"
              className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
            >
              Ir al planificador <ChevronRight size={16} />
            </Link>
          </Card>

          <Card padding="md">
            <h2 className="text-lg font-medium text-text-primary mb-4">Resumen semanal</h2>
            <Row gap="md" className="grid grid-cols-2">
              <Card padding="md" className="text-center bg-slate-50">
                <p className="text-3xl font-bold text-primary">{totalPlanned}</p>
                <p className="text-sm text-text-secondary mt-1">Comidas planificadas</p>
              </Card>
              <Card padding="md" className="text-center bg-slate-50">
                <p className="text-3xl font-bold text-accent">{totalDishes}</p>
                <p className="text-sm text-text-secondary mt-1">Platos disponibles</p>
              </Card>
            </Row>
          </Card>
        </Row>
      </Stack>
    </Container>
  );
}
