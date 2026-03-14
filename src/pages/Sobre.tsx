import React from 'react';
import { Card } from '../components/ui/Card';

export function Sobre() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Sobre o Sistema</h1>
        <p className="text-sm text-gray-500 mt-0.5">Informações do desenvolvedor e do projeto</p>
      </div>

      {/* Dev card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
              M
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Desenvolvedor</p>
            <h2 className="text-2xl font-bold text-gray-900">Matheus Augusto</h2>
            <p className="text-sm text-gray-500 mt-1">Desenvolvedor · Criador do SGE</p>

            <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-3 justify-center sm:justify-start">
              <a
                href="https://instagram.com/dev.matheusscontato"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @dev.matheusscontato
              </a>

              <a
                href="https://wa.me/5543999555144"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                (43) 99955-5144
              </a>

              <a
                href="mailto:dev.matheusaugustoo@gmail.com"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                dev.matheusaugustoo@gmail.com
              </a>
            </div>
          </div>
        </div>
      </Card>

      {/* System info */}
      <Card title="Sobre o SGE" subtitle="Sistema de Gestão de Estoque">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Versão', value: '1.0.0' },
            { label: 'Tecnologia', value: 'React + TypeScript' },
            { label: 'Estilização', value: 'Tailwind CSS v4' },
            { label: 'Estado', value: 'Zustand' },
            { label: 'Armazenamento', value: 'LocalStorage' },
            { label: 'Gráficos', value: 'Chart.js' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-semibold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Features */}
      <Card title="Funcionalidades">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            '📦 Gestão de produtos com código de barras',
            '🏪 Controle de estoque em tempo real',
            '↕️ Registro de entradas e saídas',
            '🏭 Cadastro de fornecedores',
            '🔔 Alertas automáticos de estoque baixo',
            '📊 Relatórios e gráficos de desempenho',
            '🔒 Controle de acesso por papel',
            '🌙 Modo claro e escuro',
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5 py-2 text-sm text-gray-700">
              <span className="text-base leading-none">{f.split(' ')[0]}</span>
              <span>{f.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
