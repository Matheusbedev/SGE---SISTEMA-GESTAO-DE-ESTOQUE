import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './components/layout/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { Produtos } from './pages/Produtos';
import { Estoque } from './pages/Estoque';
import { Movimentacoes } from './pages/Movimentacoes';
import { Fornecedores } from './pages/Fornecedores';
import { Relatorios } from './pages/Relatorios';
import { Alertas } from './pages/Alertas';
import { Sobre } from './pages/Sobre';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function LoginRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="estoque" element={<Estoque />} />
          <Route path="movimentacoes" element={<Movimentacoes />} />
          <Route path="fornecedores" element={<Fornecedores />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="alertas" element={<Alertas />} />
          <Route path="sobre" element={<Sobre />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
