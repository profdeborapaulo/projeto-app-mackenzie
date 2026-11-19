import { Code2, Compass, Play, Terminal, Trophy } from 'lucide-react';
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

export default function Navbar({
  activeTab,
  onSelectTab,
  solvedCount,
  totalChallenges,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0B1120]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:gap-8">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onSelectTab('conceito')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-md px-1 py-0.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-400">
            <Code2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-100">
            JS Lab: Loops &amp; Arrays
          </span>
        </button>

        {/* Zone 2: 4 Single-line Navigation Links (Desktop) */}
        <nav
          aria-label="Módulos do laboratório"
          className="hidden md:flex items-center gap-1 lg:gap-2"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
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
                    className="absolute inset-x-3 -bottom-[13px] h-0.5 bg-sky-400 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => onSelectTab('desafios')}
            className="flex items-center gap-2 rounded-lg bg-sky-500 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-sky-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            <Trophy className="h-4 w-4" aria-hidden="true" />
            <span>
              Desafios ({solvedCount}/{totalChallenges})
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bar (Compact 1-row scrollable strip) */}
      <nav
        aria-label="Navegação móvel"
        className="flex md:hidden items-center gap-1 overflow-x-auto border-t border-slate-800/80 px-3 py-1.5"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
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
