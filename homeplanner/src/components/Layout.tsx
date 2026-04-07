import { NavLink, Outlet } from 'react-router-dom';
import { Home, UtensilsCrossed, Package, Calendar, ShoppingCart, Bookmark, UserCircle } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio', description: 'Página principal' },
  { to: '/dishes', icon: UtensilsCrossed, label: 'Platos', description: 'Gestionar recetas' },
  { to: '/ingredients', icon: Package, label: 'Ingredientes', description: 'Ver ingredientes' },
  { to: '/planner', icon: Calendar, label: 'Planificador', description: 'Planificar comidas' },
  { to: '/shopping', icon: ShoppingCart, label: 'Compra', description: 'Lista de compra' },
  { to: '/templates', icon: Bookmark, label: 'Plantillas', description: 'Guardar y reutilizar' },
  { to: '/profile', icon: UserCircle, label: 'Perfil', description: 'Tu cuenta' },
];

export function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      <div className="flex min-h-screen">
        <aside 
          className="w-64 bg-surface border-r border-border hidden md:flex flex-col shrink-0" 
          aria-label="Navegación principal"
        >
          <div className="px-6 py-5 border-b border-border">
            <h1 className="text-xl font-bold text-text-primary tracking-tight">HomeHub</h1>
            <p className="text-sm text-text-tertiary mt-0.5">Planificación semanal</p>
          </div>
          <nav aria-label="Menú de navegación" className="flex-1 py-4 px-3">
            <ul role="list" className="space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                        isActive
                          ? 'bg-primary text-white font-medium shadow-sm'
                          : 'text-text-secondary hover:text-text-primary hover:bg-secondary-light'
                      }`
                    }
                  >
                    <Icon size={20} aria-hidden="true" />
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="bg-surface border-b border-border px-4 py-4 md:hidden">
            <h1 className="text-lg font-bold text-text-primary tracking-tight">HomeHub</h1>
          </header>

          <main 
            id="main-content" 
            className="flex-1 px-4 py-6 md:px-8 md:py-8 overflow-auto"
            tabIndex={-1}
          >
            <Outlet />
          </main>
        </div>

        <nav 
          className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-40" 
          aria-label="Navegación móvil"
        >
          <ul role="list" className="flex justify-around">
            {navItems.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex flex-col items-center gap-1 py-3 px-4 min-w-[4rem] transition-colors duration-150 ${
                      isActive ? 'text-primary' : 'text-text-tertiary'
                    }`
                  }
                >
                  <Icon size={22} aria-hidden="true" />
                  <span className="text-xs font-medium">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
