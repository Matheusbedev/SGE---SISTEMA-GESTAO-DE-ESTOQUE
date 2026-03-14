import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const DEMO = [
  { email: 'admin@estoque.com',    label: 'Administrador', desc: 'Acesso total ao sistema',       icon: '👑', color: 'hover:border-purple-300 hover:bg-purple-50/50' },
  { email: 'gerente@estoque.com',  label: 'Gerente',       desc: 'Relatórios e gestão',           icon: '💼', color: 'hover:border-blue-300 hover:bg-blue-50/50' },
  { email: 'operador@estoque.com', label: 'Operador',      desc: 'Movimentações e estoque',       icon: '🔧', color: 'hover:border-gray-300 hover:bg-gray-50' },
];

export function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const entrar = (e: string) => {
    setLoading(true); setErro('');
    setTimeout(() => {
      const ok = login(e.trim(), '');
      if (ok) navigate('/', { replace: true });
      else { setErro('Email não encontrado.'); setLoading(false); }
    }, 300);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-950 flex-col justify-between p-12 relative overflow-hidden">
        {/* Grid decoration */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">SGE</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Controle total<br />
              <span className="gradient-text">do seu estoque</span>
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Gerencie produtos, movimentações, fornecedores e alertas em um único lugar.
            </p>
          </div>
        </div>

        <div className="relative space-y-3">
          {[
            { icon: '📦', text: 'Controle de produtos e estoque em tempo real' },
            { icon: '📊', text: 'Relatórios e análises de desempenho' },
            { icon: '🔔', text: 'Alertas automáticos de estoque baixo' },
          ].map((f) => (
            <div key={f.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm flex-shrink-0">{f.icon}</div>
              <p className="text-sm text-gray-400">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-sm space-y-8 animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-900">SGE</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo de volta</h1>
            <p className="text-sm text-gray-500 mt-1">Entre com seu email para acessar o sistema</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); entrar(email); }} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErro(''); }}
              placeholder="seu@email.com"
              required
              autoFocus
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            {erro && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {erro}
              </div>
            )}
            <Button type="submit" fullWidth size="lg" loading={loading}>
              Entrar no sistema
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-gray-50 px-3 text-xs text-gray-400 font-medium">Acesso de demonstração</span></div>
          </div>

          <div className="space-y-2">
            {DEMO.map((u) => (
              <button
                key={u.email}
                type="button"
                onClick={() => entrar(u.email)}
                disabled={loading}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 text-left transition-all duration-150 disabled:opacity-50 ${u.color} group`}
              >
                <span className="text-xl flex-shrink-0">{u.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{u.label}</p>
                  <p className="text-xs text-gray-400">{u.desc}</p>
                </div>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400">
            Dados salvos localmente no navegador
          </p>
        </div>
      </div>
    </div>
  );
}
