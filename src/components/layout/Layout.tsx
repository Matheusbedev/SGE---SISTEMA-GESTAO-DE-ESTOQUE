import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAlertaStore } from '../../store/useAlertaStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { ThemeToggle } from '../ui/ThemeToggle';

const navItems = [
  { to: '/',              label: 'Dashboard',    icon: <DashIcon />,  end: true  },
  { to: '/produtos',      label: 'Produtos',     icon: <BoxIcon />,   end: false },
  { to: '/estoque',       label: 'Estoque',      icon: <StockIcon />, end: false },
  { to: '/movimentacoes', label: 'Movimentações',icon: <MoveIcon />,  end: false },
  { to: '/fornecedores',  label: 'Fornecedores', icon: <TruckIcon />, end: false },
  { to: '/relatorios',    label: 'Relatórios',   icon: <ChartIcon />, end: false },
  { to: '/alertas',       label: 'Alertas',      icon: <BellIcon />,  end: false },
  { to: '/sobre',         label: 'Sobre',        icon: <InfoIcon />,  end: false },
];

const papelConfig: Record<string, { label: string; color: string }> = {
  admin:    { label: 'Administrador', color: 'bg-purple-100 text-purple-700' },
  gerente:  { label: 'Gerente',       color: 'bg-blue-100 text-blue-700' },
  operador: { label: 'Operador',      color: 'bg-gray-100 text-gray-600' },
};

export function Layout() {
  const naoLidos = useAlertaStore((s) => s.naoLidos);
  const { usuario, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const papel = papelConfig[usuario?.papel ?? 'operador'];
  const pageTitle = navItems.find((n) => n.end ? location.pathname === n.to : location.pathname.startsWith(n.to))?.label ?? 'SGE';

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">SGE</p>
            <p className="text-xs text-gray-500">Gestão de Estoque</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-600 uppercase tracking-widest">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive ? 'nav-active text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.to === '/alertas' && naoLidos > 0 && (
                  <span className="flex-shrink-0 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 animate-pulse-ring">
                    {naoLidos > 9 ? '9+' : naoLidos}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Theme toggle */}
      <div className="px-5 py-3 border-t border-white/5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{theme === 'dark' ? 'Modo escuro' : 'Modo claro'}</span>
          <ThemeToggle />
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {usuario?.nome?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate leading-tight">{usuario?.nome}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${papel.color}`}>
              {papel.label}
            </span>
          </div>
          <button onClick={handleLogout} title="Sair"
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-500 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: theme === 'dark' ? '#0a0f1e' : '#f8fafc' }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-950/70 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 flex flex-col transform transition-transform duration-200 ease-out lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className={`flex-shrink-0 h-14 border-b flex items-center px-4 lg:px-6 gap-4 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <button className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="text-sm font-semibold text-gray-900 truncate">{pageTitle}</h1>

          <div className="ml-auto flex items-center gap-3">
            {/* Theme toggle no header (mobile) */}
            <div className="lg:hidden">
              <ThemeToggle />
            </div>

            {naoLidos > 0 && (
              <NavLink to="/alertas"
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors border border-red-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="hidden sm:inline">{naoLidos} alerta{naoLidos > 1 ? 's' : ''}</span>
                <span className="sm:hidden">{naoLidos}</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              </NavLink>
            )}

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {usuario?.nome?.[0]?.toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-700 hidden md:block">{usuario?.nome}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="animate-fade-up max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className={`flex-shrink-0 border-t px-6 py-2.5 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <p className="text-xs text-gray-400">
            SGE — Sistema de Gestão de Estoque
          </p>
          <p className="text-xs text-gray-400">
            Desenvolvido por{' '}
            <a href="/sobre" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
              Matheus Augusto
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

function DashIcon()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /></svg>; }
function BoxIcon()   { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>; }
function StockIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>; }
function MoveIcon()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>; }
function TruckIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>; }
function ChartIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>; }
function BellIcon()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>; }
function InfoIcon()  { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; }
