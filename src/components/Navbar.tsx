import { Award, Code2, Compass, Play, Terminal, Trophy } from 'lucide-react';
import { ModuleTab } from '../types/lab';

interface NavbarProps {
  activeTab: ModuleTab;
  onSelectTab: (tab: ModuleTab) => void;
  solvedCount: number;
  totalChallenges: number;
}

const NAV_ITEMS: { id: ModuleTab; label: string; icon: typeof Compass }[] = [
  { id: 'conceito', label: 'Conceito Visual', icon: Compass },
  { id: 'simulador', label: 'Simulador', icon: Play },
  { id: 'exemplos', label: 'Exemplos Práticos', icon: Terminal },
  { id: 'desafios', label: 'Desafio & Prática', icon: Trophy },
];

function getLevelInfo(solvedCount: number, totalChallenges: number) {
  const safeTotal = Math.max(1, totalChallenges);
  const ratio = Math.min(1, solvedCount / safeTotal);
  const percent = Math.round(ratio * 100);

  if (solvedCount >= safeTotal) {
    return {
      level: 4,
      title: 'Ninja de Arrays',
      percent: 100,
      xp: solvedCount * 100,
      maxXp: safeTotal * 100,
      isMax: true,
    };
  }
  if (solvedCount === 2) {
    return {
      level: 3,
      title: 'Mestre dos Índices',
      percent,
      xp: 200,
      maxXp: safeTotal * 100,
      isMax: false,
    };
  }
  if (solvedCount === 1) {
    return {
      level: 2,
      title: 'Aprendiz de Loops',
      percent,
      xp: 100,
      maxXp: safeTotal * 100,
      isMax: false,
    };
  }
  return {
    level: 1,
    title: 'Explorador',
    percent: 0,
    xp: 0,
    maxXp: safeTotal * 100,
    isMax: false,
  };
}

export default function Navbar({
  activeTab,
  onSelectTab,
  solvedCount,
  totalChallenges,
}: NavbarProps) {
  const levelInfo = getLevelInfo(solvedCount, totalChallenges);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0B1120]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:gap-6">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onSelectTab('conceito')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md px-1 py-0.5 cursor-pointer"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-400">
            <Code2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-sm sm:text-lg font-bold tracking-tight text-slate-100">
            JS Lab: Loops &amp; Arrays
          </span>
        </button>

        {/* Zone 2: 4 Single-line Navigation Links (Desktop) */}
        <nav
          aria-label="Módulos do laboratório"
          className="hidden lg:flex items-center gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isActive
                    ? 'text-sky-300 bg-sky-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-[11px] h-0.5 bg-sky-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Level & Progress Action Widget */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('desafios')}
            aria-label={`Nível ${levelInfo.level}: ${levelInfo.title}. ${solvedCount} de ${totalChallenges} desafios concluídos (${levelInfo.percent}%). Ir para desafios.`}
            className={`group flex flex-col justify-center gap-1.5 rounded-xl border px-3 py-2 text-left transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 min-w-[148px] sm:min-w-[205px] ${
              levelInfo.isMax
                ? 'border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/15'
                : 'border-slate-700/80 bg-slate-900/90 hover:border-sky-500/50 hover:bg-slate-800/90'
            }`}
          >
            <div className="flex items-center justify-between gap-2.5 text-xs">
              <span
                className={`flex items-center gap-1.5 font-semibold ${
                  levelInfo.isMax ? 'text-emerald-300' : 'text-sky-300'
                }`}
              >
                <Award className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  Nível {levelInfo.level}
                  <span className="hidden sm:inline font-medium text-slate-200">
                    {' '}
                    · {levelInfo.title}
                  </span>
                </span>
              </span>

              <span className="font-mono text-[11px] font-semibold text-slate-300 tabular-nums">
                {solvedCount}/{totalChallenges}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div
                role="progressbar"
                aria-valuenow={levelInfo.percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progresso dos desafios"
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800"
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    levelInfo.isMax
                      ? 'bg-emerald-400'
                      : 'bg-gradient-to-r from-sky-400 to-violet-400'
                  }`}
                  style={{ width: `${levelInfo.percent}%` }}
                />
              </div>
              <span className="font-mono text-[10px] font-medium text-slate-400 tabular-nums">
                {levelInfo.percent}%
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Tablet/Mobile Navigation Bar (Compact 1-row scrollable strip) */}
      <nav
        aria-label="Navegação secundária"
        className="flex lg:hidden items-center gap-1 overflow-x-auto border-t border-slate-800/80 px-3 py-1.5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                isActive
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
