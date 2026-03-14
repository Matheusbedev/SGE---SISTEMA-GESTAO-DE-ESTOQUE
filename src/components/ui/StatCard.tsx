import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'indigo';
  trend?: { value: string; up?: boolean; label?: string };
  subtitle?: string;
  onClick?: () => void;
}

const colors = {
  blue:    { wrap: 'from-blue-500 to-blue-600',    icon: 'bg-blue-500/20 text-blue-100',    glow: 'shadow-blue-500/20' },
  emerald: { wrap: 'from-emerald-500 to-emerald-600', icon: 'bg-emerald-500/20 text-emerald-100', glow: 'shadow-emerald-500/20' },
  amber:   { wrap: 'from-amber-400 to-amber-500',  icon: 'bg-amber-500/20 text-amber-100',  glow: 'shadow-amber-500/20' },
  red:     { wrap: 'from-red-500 to-red-600',      icon: 'bg-red-500/20 text-red-100',      glow: 'shadow-red-500/20' },
  purple:  { wrap: 'from-purple-500 to-purple-600',icon: 'bg-purple-500/20 text-purple-100',glow: 'shadow-purple-500/20' },
  indigo:  { wrap: 'from-indigo-500 to-indigo-600',icon: 'bg-indigo-500/20 text-indigo-100',glow: 'shadow-indigo-500/20' },
};

export function StatCard({ title, value, icon, color = 'blue', trend, subtitle, onClick }: StatCardProps) {
  const c = colors[color];
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.wrap} p-5 shadow-lg ${c.glow} ${onClick ? 'cursor-pointer hover:scale-[1.02] transition-transform duration-200' : ''}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -bottom-6 w-16 h-16 rounded-full bg-white/5" />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className={`rounded-xl p-2.5 ${c.icon}`}>
            <span className="text-xl leading-none">{icon}</span>
          </div>
          {trend && (
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.up !== false ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
              {trend.up !== false ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
        <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className="text-white text-2xl font-bold mt-1 leading-tight">{value}</p>
        {subtitle && <p className="text-white/60 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
